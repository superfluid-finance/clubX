import Amount from "@/components/Amount";
import { Button, LinkButton } from "@/components/Button";
import ConnectionGateBtn from "@/components/ConnectionGateBtn";
import Delimiter from "@/components/Delimiter";
import Flex from "@/components/Flex";
import { FooterLink } from "@/components/FooterButton";
import { PageContent, PageWrapper } from "@/components/Layout";
import { Caption, H3 } from "@/components/Typography";
import { useGetFee, useGetProtege, useIsProtege, useSponsor } from "@/core/Api";
import Configuration from "@/core/Configuration";
import getDefaultSponsorAmount from "@/utils/DefaultSponsorAmount";
import { shortenHex } from "@/utils/StringUtils";
import { Html5Qrcode } from "html5-qrcode";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Address, isAddress } from "viem";
import { useAccount, useBalance, useWaitForTransaction } from "wagmi";

const CostItem: FC<{ title: string; wei: bigint }> = ({ title, wei }) => (
  <Flex direction="row" align="center" justify="space-between" gap="32px">
    <div>{title}</div>
    <b>
      <Amount wei={wei} /> MATIC
    </b>
  </Flex>
);

const ReaderWrapper = styled.div`
  width: 100%;
`;

const StatsBox = styled.div`
  width: calc(100vw - 64px);
  position: relative;
  padding: 20px 24px;
  margin-top: 36px;
  align-self: center;
  display: flex;
  flex-direction: column;
  gap: 16px;

  &::before {
    content: "";
    z-index: 1;
    position: absolute;
    inset: 0;
    border-radius: 8px;
    padding: 2px; /* control the border thickness */
    background: linear-gradient(0deg, #b5b5ff, #0e0e4b);
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
`;

const { network } = Configuration;

const Scan = () => {
  const cameraRef = useRef<HTMLDivElement | null>(null);
  const QRCodeReader = useRef<Html5Qrcode>();

  const router = useRouter();

  const [scannedAddress, setScannedAddress] = useState<Address | undefined>();

  const { address } = useAccount();
  const sponsorMutation = useSponsor();

  const isProtegeResult = useIsProtege(scannedAddress);
  const imProtegeResult = useIsProtege(address);

  const { data: protege } = useGetProtege(address);
  const { data: fee } = useGetFee(protege?.directTotalProtegeCount);
  const nativeBalance = useBalance({ address });

  const sponsorAmount = getDefaultSponsorAmount(protege?.level);

  const { isLoading: sponsorTxLoading, isSuccess: sponsorTxSuccess } =
    useWaitForTransaction({
      chainId: network.id,
      hash: sponsorMutation.data?.hash,
      enabled: !!sponsorMutation.data?.hash,
    });

  useEffect(() => {
    if (!address || imProtegeResult.data === false) {
      router.replace("/");
    }
  }, [address, imProtegeResult]);

  const onSponsor = useCallback(() => {
    if (fee) {
      sponsorMutation.mutate({
        address: scannedAddress!,
        amount: sponsorAmount + fee,
      });
    }
  }, [scannedAddress, sponsorAmount, fee]);

  useEffect(() => {
    if (!cameraRef.current) return;

    QRCodeReader.current = new Html5Qrcode(cameraRef.current.id);

    return () => {
      QRCodeReader.current = undefined;
    };
  }, [cameraRef.current]);

  const onSuccessfulScan = useCallback(
    (decodedText: string) => {
      if (!isAddress(decodedText)) return;
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
            });
        }
      })
      .catch((err) => {
        console.log("Catching all them errors", err);
        // handle err
      });

    return () => {
      if (QRCodeReader.current && QRCodeReader.current.isScanning) {
        QRCodeReader.current.stop();
      }
    };
  }, [QRCodeReader.current]);

  if (!scannedAddress) {
    return (
      <PageWrapper>
        <PageContent>
          <ReaderWrapper ref={cameraRef} id="reader" />
        </PageContent>
        <FooterLink href="/">Cancel</FooterLink>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      style={{
        backgroundImage: `url("/assets/bg4.png")`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <PageContent>
        <Flex
          gap="8px"
          align="center"
          justify="center"
          style={{ marginTop: "20dvh" }}
        >
          <H3>Sponsorship request</H3>
          <p
            style={{
              maxWidth: "calc(100vw - 32px)",
              width: "270px",
              margin: "0 auto",
            }}
          >
            Address {shortenHex(scannedAddress)} wants to become your protege.
          </p>

          <StatsBox>
            <>
              {fee && <CostItem title="Invitation fee" wei={fee} />}

              {protege && sponsorAmount && (
                <CostItem title="Sponsor amount" wei={sponsorAmount} />
              )}

              <Delimiter />

              {fee && protege && sponsorAmount && (
                <CostItem title="Total cost" wei={fee + sponsorAmount} />
              )}

              {nativeBalance.data && (
                <Flex direction="row" align="center" justify="end">
                  <Caption>
                    Available balance <Amount wei={nativeBalance.data.value} />{" "}
                    MATIC
                  </Caption>
                </Flex>
              )}
            </>
          </StatsBox>

          <div style={{ width: "calc(100vw - 32px)", margin: "20px auto" }}>
            {isProtegeResult.data === true && (
              <div>Unable to invite, user is already protege!</div>
            )}

            {sponsorTxSuccess && (
              <div>
                Successfully invited {shortenHex(scannedAddress)} to CLUBx
              </div>
            )}
          </div>
        </Flex>
      </PageContent>

      {isProtegeResult.data === false && !sponsorTxSuccess && (
        <ConnectionGateBtn
          expectedNetwork={network}
          disabled={sponsorMutation.isLoading || sponsorTxLoading}
        >
          <Button
            disabled={sponsorMutation.isLoading || sponsorTxLoading}
            onClick={onSponsor}
          >
            {sponsorMutation.isLoading || sponsorTxLoading
              ? "Loading..."
              : "Sponsor"}
          </Button>
        </ConnectionGateBtn>
      )}

      {isProtegeResult.data === true && (
        <LinkButton href="/">Go Back</LinkButton>
      )}

      <FooterLink
        style={{
          visibility: isProtegeResult.data !== true ? "visible" : "hidden",
        }}
        href="/"
      >
        Cancel
      </FooterLink>
    </PageWrapper>
  );
};

export default Scan;
