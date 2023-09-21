import Amount from "@/components/Amount";
import { Button, LinkButton } from "@/components/Button";
import Flex from "@/components/Flex";
import FlowingBalance from "@/components/FlowingBalance";
import IntroScreens from "@/components/IntroScreens";
import SignIn from "@/components/SignIn";
import { SnapScrollContent, SnapScrollWrapper } from "@/components/SnapScroll";
import { CaptionStyle, H1, H2, H3, Subtitle2 } from "@/components/Typography";
import { useIsProtege, useRealtimeBalance } from "@/core/Api";
import Configuration from "@/core/Configuration";
import { UnitOfTime } from "@/utils/NumberUtils";
import { shortenHex } from "@/utils/StringUtils";
import { fromUnixTime } from "date-fns";
import { useCallback } from "react";
import QRCode from "react-qr-code";
import { styled } from "styled-components";
import { useAccount, useDisconnect, useQueryClient } from "wagmi";

const WhiteBox = styled(Flex)`
  display: inline-flex;
  border-radius: 8px;
  border: 1px solid #e9ebef;
  padding: 10px 24px;
  ${CaptionStyle}
`;

const GreenBox = styled(Flex)`
  position: relative;
  background-image: url("/assets/box-green.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  padding: 32px 45px;
  text-align: center;
  text-shadow: 0 0 10px #1db227;
`;

const ConnectedSection = styled(SnapScrollContent)`
  display: flex;
  flex-direction: column;
  padding-top: 23dvh;
  padding-bottom: 10dvh;
  justify-content: space-between;
  background-image: url("/assets/bg7.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

const ProtegeSection = styled(SnapScrollContent)`
  display: flex;
  flex-direction: column;
  padding-top: 23dvh;
  padding-bottom: 10dvh;
  justify-content: space-between;
  background-image: url("/assets/bg7.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

const AccountBox = styled.div`
  background-image: url("/assets/account-bg.svg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: bottom;
  position: fixed;
  top: 0;
  right: 10%;
  padding: 8px 20px;
  z-index: 10;
`;

const { SuperfluidClubAddress } = Configuration;

const Intro = () => {
  const { address } = useAccount();
  const { data, isLoading, refetch: refetchIsProtege } = useIsProtege(address);
  const { disconnect } = useDisconnect();
  const queryClient = useQueryClient();

  const onDisconnect = useCallback(() => {
    disconnect();
  }, [disconnect]);

  const { data: realtimeBalanceData, refetch: refetchRealtimeBalance } =
    useRealtimeBalance(address, SuperfluidClubAddress);

  const onClearCache = () => {
    queryClient.invalidateQueries({
      queryKey: [{ scopeKey: "RealTimeBalance" }, { scopeKey: "IsProtege" }],
    });
    queryClient.clear();
    refetchIsProtege();
    refetchRealtimeBalance();
  };

  if (data === true) {
    return (
      <SnapScrollWrapper>
        <AccountBox onClick={onDisconnect}>
          {shortenHex(address || "")}
        </AccountBox>

        <ProtegeSection>
          <Flex align="center" gap="8px">
            <GreenBox gap="8px" align="center">
              <div style={{ fontSize: "12px", fontWeight: 500 }}>
                YOU HAVE RECEIVED
              </div>
              <Flex direction="row" align="end" gap="8px" justify="center">
                <H2 style={{ fontVariantNumeric: "tabular-nums" }}>
                  {realtimeBalanceData && (
                    <>
                      {realtimeBalanceData.flowrate === BigInt(0) ? (
                        <Amount wei={realtimeBalanceData.currentBalance} />
                      ) : (
                        <FlowingBalance
                          flowRate={realtimeBalanceData.flowrate}
                          startingBalance={realtimeBalanceData.currentBalance}
                          startingBalanceDate={fromUnixTime(
                            realtimeBalanceData.timestamp
                          )}
                        />
                      )}
                    </>
                  )}
                </H2>
                <b style={{ paddingBottom: "2px" }}>CLUBx</b>
              </Flex>
            </GreenBox>
            <WhiteBox
              direction="row"
              align="center"
              gap="4px"
              style={{ fontSize: "13px", fontWeight: 700 }}
            >
              {realtimeBalanceData && (
                <Amount
                  wei={realtimeBalanceData.flowrate * BigInt(UnitOfTime.Month)}
                >
                  {` CLUBx`}
                </Amount>
              )}
              <span style={{ fontWeight: 400 }}>/month</span>
            </WhiteBox>
          </Flex>

          <LinkButton href="/scan">Scan</LinkButton>
        </ProtegeSection>
      </SnapScrollWrapper>
    );
  }

  if (address) {
    return (
      <SnapScrollWrapper>
        <AccountBox onClick={onDisconnect}>
          {shortenHex(address || "")}
        </AccountBox>
        <ConnectedSection>
          <Flex gap="8px" align="center">
            <H1>Join CLUBx</H1>
            <p>Refer people to get a higher Flow Rate</p>
            <QRCode
              size={256}
              value={address}
              viewBox={`0 0 256 256`}
              style={{
                background: "white",
                padding: "8px",
                borderRadius: "8px",
                marginTop: "24px",
                // fill: `linear-gradient(180deg, #1DB227 5%, #0C6412 95%)`,
              }}
            />
          </Flex>
          <Button onClick={onClearCache}>Refresh</Button>
        </ConnectedSection>
      </SnapScrollWrapper>
    );
  }

  return <IntroScreens />;
};

export default Intro;
