import {
  sponsorAddress,
  useGetFee,
  useGetProtege,
  useIsProtege,
  useSponsor,
} from "@/core/Api";
import { FooterButton, FooterLink } from "@/components/FooterButton";
import { Footer, PageContent, PageWrapper } from "@/components/Layout";
import { Html5Qrcode } from "html5-qrcode";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Address, isAddress, parseEther } from "viem";
import getDefaultSponsorAmount from "@/utils/DefaultSponsorAmount";
import calculateTotalSponsorAmountWithFee from "@/utils/CalculateTotalSponsorAmountWithFee";
import Configuration from "@/core/Configuration";
import SuperfluidClubABI from "@/abis/SuperfluidClub";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

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

export const Info = styled(FooterInfo)`
  background: blue;
`;

const ReaderWrapper = styled.div`
  width: 100%;
`;

const { network, SuperfluidClubAddress } = Configuration;

const Scan = () => {
  const cameraRef = useRef<HTMLDivElement | null>(null);
  const QRCodeReader = useRef<Html5Qrcode>();

  const { address } = useAccount();

  const [error, setError] = useState("");
  const [scannedAddress, setScannedAddress] = useState<Address | undefined>();
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);
  const protegeResult = useIsProtege(scannedAddress);

  const { data: protege } = useGetProtege(scannedAddress);

  const { data: fee } = useGetFee(protege?.directTotalProtegeCount);

  const sponsorAmount = getDefaultSponsorAmount(protege?.level);

  const { isLoading: sponsorAddressLoading, isSuccess: sponsorAddressSuccess } =
    useWaitForTransaction({
      hash: hash!,
      enabled: !!hash,
    });

  const onSponsor = async () => {
    console.log(
      "Sponsoring...",
      scannedAddress,
      Number(
        parseEther(
          calculateTotalSponsorAmountWithFee(sponsorAmount, fee).toString()
        )
      )
    );
    const result = await sponsorAddress(
      scannedAddress!,
      calculateTotalSponsorAmountWithFee(sponsorAmount, fee)
    );
    console.log("Received hash");
    setHash(result.hash);
  };

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
    [scannedAddress]
  );

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
      {scannedAddress && (
        <FooterButton onClick={onSponsor}>Sponsor</FooterButton>
      )}
      {sponsorAddressSuccess && (
        <div>Successfully sponsored {scannedAddress}</div>
      )}
      {sponsorAddressLoading ||
        (protegeResult.isLoading && <Info>Loading...</Info>)}
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
