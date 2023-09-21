import Amount from "@/components/Amount";
import { Button, LinkButton } from "@/components/Button";
import Flex from "@/components/Flex";
import FlowingBalance from "@/components/FlowingBalance";
import IntroScreens from "@/components/IntroScreens";
import { SnapScrollContent, SnapScrollWrapper } from "@/components/SnapScroll";
import { CaptionStyle, H1, H2 } from "@/components/Typography";
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
  position: relative;
  display: inline-flex;
  border-radius: 8px;
  border: 1.5px solid #e9ebef;
  padding: 10px 24px;
  font-weight: 700;
  ${CaptionStyle}

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: -15px;
    width: 2px;
    height: 15px;
    background: linear-gradient(180deg, #06062b, #b5b5ff);
  }

  &::before {
    left: 20%;
  }

  &::after {
    right: 20%;
  }
`;

const GreenBoxWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  width: 100vw;
`;

const GreenBoxLines = styled.div`
  position: relative;
  width: 100%;

  &::before,
  &::after {
    content: "";
    position: absolute;
    right: 0;
    height: 2px;
    width: 100%;
    background: linear-gradient(270deg, #06062b, #b5b5ff);
    z-index: 1;
  }

  &::before {
    top: 20%;
  }

  &::after {
    bottom: 20%;
  }
`;

const GreenBox = styled(Flex)`
  position: relative;
  padding: 24px 36px;
  text-align: center;
  text-shadow: 0 0 10px #1db227;

  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow:
    0 0 4px 2px #1db227,
    inset 0 0 4px 2px #1db227;
  z-index: 2;
`;

const ConnectedSection = styled(SnapScrollContent)`
  display: flex;
  flex-direction: column;
  padding-top: 23dvh;
  padding-bottom: 10dvh;
  justify-content: space-between;
  background-image: url("/assets/bg4.png");
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
  background-image: url("/assets/bg4.png");
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
          <Flex align="center" gap="15px">
            <GreenBoxWrapper>
              <div />
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
              <GreenBoxLines />
            </GreenBoxWrapper>
            <WhiteBox direction="row" align="center" gap="4px">
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
