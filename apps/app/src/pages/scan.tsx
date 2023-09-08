import { FooterLink } from "@/components/FooterButton";
import { Footer, PageContent, PageWrapper } from "@/components/Layout";
import { useIsProtege, useSponsor } from "@/core/Api";
import { Html5Qrcode } from "html5-qrcode";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Address, isAddress } from "viem";

const FooterInfo = styled.footer(() => ({
  width: "100%",
  lineHeight: "64px",
  color: "white",
}));

export const Warning = styled(FooterInfo)`
  background: orange;
`;

export const Error = styled(FooterInfo)`
  background: red;
`;

const ReaderWrapper = styled.div`
  width: 100%;
`;

const Scan = () => {
  const cameraRef = useRef<HTMLDivElement | null>(null);
  const QRCodeReader = useRef<Html5Qrcode>();
  const [error, setError] = useState("");

  const [scannedAddress, setScannedAddress] = useState<Address | undefined>();

  const protegeResult = useIsProtege(scannedAddress);

  const [sponsorAddress, sponsorAddressLoading, sponsorAddressSuccess] =
    useSponsor(scannedAddress);

  useEffect(() => {
    if (!cameraRef.current) return;

    QRCodeReader.current = new Html5Qrcode(cameraRef.current.id);
  }, [cameraRef.current]);

  // Render errors for 3 seconds
  useEffect(() => {
    let timeout: number;

    if (error) {
      timeout = window.setTimeout(() => {
        setError("");
      }, 3000);
    }

    return () => {
      if (timeout) window.clearTimeout(timeout);
    };
  }, [error]);

  const onSuccessfulScan = useCallback(
    (decodedText: string) => {
      if (!isAddress(decodedText)) {
        setError("Invalid address!");
        return;
      }

      setError("");
      setScannedAddress(decodedText);
    },
    [sponsorAddress]
  );

  useEffect(() => {
    if (protegeResult.data === true) {
      setError("Address is already protege!");
      setScannedAddress(undefined);
      return;
    }

    if (!(protegeResult.data !== false)) return;

    console.log("Sponsoring...");
    sponsorAddress && sponsorAddress();
  }, [protegeResult.data]);

  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (!QRCodeReader.current) return;

        if (devices && devices.length) {
          QRCodeReader.current
            .start(
              { facingMode: "environment" },
              {
                fps: 5,
                qrbox: { width: 250, height: 250 },
              },
              onSuccessfulScan,
              undefined
            )
            .catch((err) => {
              console.log("Starting failed", err);
              // Start failed, handle it.
            });
        }
      })
      .catch((err) => {
        console.log("Catching all them errors", err);
        // handle err
      });
  }, [QRCodeReader.current]);

  return (
    <PageWrapper>
      <PageContent>
        <ReaderWrapper ref={cameraRef} id="reader" />
      </PageContent>
      {sponsorAddressSuccess && (
        <div>Successfully sponsored {scannedAddress}</div>
      )}
      {sponsorAddressLoading ||
        (protegeResult.isLoading && <Footer>Loading...</Footer>)}
      {!sponsorAddressLoading && (
        <>
          {error ? (
            <Error>{error}</Error>
          ) : (
            <FooterLink href="/">Cancel</FooterLink>
          )}
        </>
      )}
    </PageWrapper>
  );
};

export default Scan;
