import Amount from "@/components/Amount";
import { GradientBorderBox } from "@/components/Boxes";
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
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { Address, isAddress } from "viem";
import { useAccount, useBalance, useWaitForTransaction } from "wagmi";

const ScanPage = styled(PageWrapper)`
  background-image: url("/assets/bg4.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

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

const StatsBox = styled(GradientBorderBox)`
  width: calc(100vw - 64px);
  padding: 20px 24px;
  margin-top: 36px;
  align-self: center;
  display: flex;
  flex-direction: column;
  gap: 16px;
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

  const error = useMemo(() => {
    if (isProtegeResult.data === true) {
      return "Unable to invite, user is already protege!";
    }

    if (
      nativeBalance.data &&
      fee &&
      nativeBalance.data.value < fee + sponsorAmount
    ) {
      return "Not enough balance to sponsor!";
    }
  }, [isProtegeResult.data]);

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
    <ScanPage>
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
            {error && <div>{error}</div>}

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
    </ScanPage>
  );
};

export default Scan;
