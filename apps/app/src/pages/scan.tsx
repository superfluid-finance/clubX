import Amount from "@/components/Amount";
import { Button } from "@/components/Button";
import Flex from "@/components/Flex";
import { FooterLink } from "@/components/FooterButton";
import { PageContent, PageWrapper } from "@/components/Layout";
import { H2, H3, Subtitle1 } from "@/components/Typography";
import { useGetFee, useGetProtege, useIsProtege, useSponsor } from "@/core/Api";
import Configuration from "@/core/Configuration";
import getDefaultSponsorAmount from "@/utils/DefaultSponsorAmount";
import { shortenHex } from "@/utils/StringUtils";
import { Html5Qrcode } from "html5-qrcode";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Address, isAddress } from "viem";
import { useAccount, useBalance, useWaitForTransaction } from "wagmi";

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

  const [scannedAddress, setScannedAddress] = useState<Address | undefined>();
  const [error, setError] = useState("");

  const { address } = useAccount();
  const sponsorMutation = useSponsor();
  const isProtegeResult = useIsProtege(scannedAddress);
  const { data: protege } = useGetProtege(address);
  const { data: fee } = useGetFee(protege?.directTotalProtegeCount);
  const nativeBalance = useBalance({ address });

  const sponsorAmount = getDefaultSponsorAmount(protege?.level);

  const invalidateSponsorCache = () => {
    // TODO: Clear balances and sponsor amount cache
  };

  const { isLoading: sponsorTxLoading, isSuccess: sponsorTxSuccess } =
    useWaitForTransaction({
      chainId: network.id,
      hash: sponsorMutation.data?.hash,
      enabled: !!sponsorMutation.data?.hash,
      onSuccess: invalidateSponsorCache,
    });

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
        QRCodeReader.current.clear();
        QRCodeReader.current.stop();
      }
    };
  }, [QRCodeReader.current]);

  return (
    <PageWrapper>
      <PageContent>
        {scannedAddress ? (
          <Flex
            gap="8px"
            align="center"
            justify="center"
            style={{ marginTop: "10dvh" }}
          >
            <Subtitle1>Scanned address:</Subtitle1>
            <H3>{shortenHex(scannedAddress, 8)}</H3>

            <>
              {fee && (
                <div>
                  <div>Invitation fee</div>
                  <Subtitle1>
                    <Amount wei={fee} /> MATIC
                  </Subtitle1>
                </div>
              )}

              {protege && sponsorAmount && (
                <div>
                  <div>Sponsor amount</div>
                  <Subtitle1>
                    <Amount wei={sponsorAmount} /> MATIC
                  </Subtitle1>
                </div>
              )}

              {fee && protege && sponsorAmount && (
                <div>
                  <div>Total cost</div>
                  <Subtitle1>
                    <Amount wei={fee + sponsorAmount} /> MATIC
                  </Subtitle1>
                </div>
              )}

              {nativeBalance.data && (
                <div>
                  <div>Available balance</div>
                  <Subtitle1>
                    <Amount wei={nativeBalance.data.value} /> MATIC
                  </Subtitle1>
                </div>
              )}

              <div style={{ width: "calc(100vw - 32px)", margin: "20px auto" }}>
                {isProtegeResult.data === true && (
                  <div>Unable to invite, user is already protege!</div>
                )}

                {isProtegeResult.data === false && !sponsorTxSuccess && (
                  <Button
                    disabled={sponsorMutation.isLoading || sponsorTxLoading}
                    onClick={onSponsor}
                  >
                    {sponsorMutation.isLoading || sponsorTxLoading
                      ? "Loading..."
                      : "Sponsor"}
                  </Button>
                )}

                {sponsorTxSuccess && (
                  <div>
                    Successfully invited {shortenHex(scannedAddress)} to CLUBx
                  </div>
                )}
              </div>
            </>
          </Flex>
        ) : (
          <ReaderWrapper ref={cameraRef} id="reader" />
        )}
      </PageContent>

      <FooterLink href="/">Cancel</FooterLink>
    </PageWrapper>
  );
};

export default Scan;
