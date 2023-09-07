import { useSponsor } from "@/core/Api";
import { FooterButton, FooterLink } from "@/components/FooterButton";
import { PageContent, PageWrapper } from "@/components/Layout";
import { Html5Qrcode } from "html5-qrcode";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Address, isAddress } from "viem";

const ReaderWrapper = styled.div`
  width: 100%;
`;

const Scan = () => {
  const cameraRef = useRef<HTMLDivElement | null>(null);
  const QRCodeReader = useRef<Html5Qrcode>();
  const [error, setError] = useState("");

  const [scannedAddress, setScannedAddress] = useState<Address | undefined>();

  const [sponsorAddress, sponsorAddressLoading, sponsorAddressSuccess] =
    useSponsor(scannedAddress);

  useEffect(() => {
    if (!cameraRef.current) return;

    QRCodeReader.current = new Html5Qrcode(cameraRef.current.id);
  }, [cameraRef.current]);

  const onSuccessfulScan = useCallback(
    (decodedText: string) => {
      console.log("Read address", decodedText);

      if (!isAddress(decodedText)) {
        return setError("Invalid address!");
      }
      setError("");
      setScannedAddress(decodedText);
    },
    [sponsorAddress]
  );

  useEffect(() => {
    sponsorAddress && sponsorAddress();
  }, [scannedAddress]);

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
        <div>Scan the code!</div>

        {sponsorAddressSuccess && (
          <div>Successfully sponsored {scannedAddress}</div>
        )}

        {scannedAddress && (
          <>
            <div>Scanned text:</div>
            <div>{scannedAddress}</div>
          </>
        )}

        {error && <div>Error: {error}</div>}

        <ReaderWrapper ref={cameraRef} id="reader" />
      </PageContent>
      {sponsorAddressLoading && <FooterButton>Loading...</FooterButton>}
      {!sponsorAddressLoading && <FooterLink href="/">Cancel</FooterLink>}
    </PageWrapper>
  );
};

export default Scan;
