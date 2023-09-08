import Amount from "@/components/Amount";
import { LinkButton } from "@/components/Button";
import Flex from "@/components/Flex";
import FlowingBalance from "@/components/FlowingBalance";
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
import { useAccount, useDisconnect } from "wagmi";

const ScrollImg = styled.img`
  height: 38px;
`;

const ScrollDownBtn = () => {
  return (
    <Flex align="center" gap="12px">
      <b style={{ fontWeight: 500 }}>Next</b>
      <ScrollImg src="/assets/scroll-down.svg" />
    </Flex>
  );
};

const HeroSection = styled(SnapScrollContent)`
  background-image: url("/assets/bg1.png");
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  padding-top: 23dvh;
  padding-bottom: 5dvh;
  justify-content: space-between;
`;

const CitySection = styled(SnapScrollContent)`
  background-image: url("/assets/bg2.png");
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
`;

const CityBuildings = styled.img`
  display: block;
  position: absolute;
  top: 50%;
  width: 100%;
`;

const PoweredBySection = styled(SnapScrollContent)`
  display: flex;
  flex-direction: column;
  padding-top: 16dvh;
  padding-bottom: 10dvh;
  justify-content: space-between;
`;

const StreamSection = styled(SnapScrollContent)`
  background-image: url("/assets/bg4.png");
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  padding-top: 15dvh;
  padding-bottom: 10dvh;
  justify-content: space-between;
`;

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

const PinkBox = styled(Flex)`
  position: relative;
  background-image: url("/assets/box-pink.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  padding: 32px 45px;
  text-align: center;
  text-shadow: 0 0 10px #ea00e0dd;
`;

const ValuePropSection = styled(SnapScrollContent)`
  display: flex;
  flex-direction: column;
  padding-top: 10dvh;
  padding-bottom: 10dvh;
  justify-content: space-between;
`;

const ValuePropList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 60dvh;
`;

const ConnectSection = styled(SnapScrollContent)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ConnectedSection = styled(SnapScrollContent)`
  display: flex;
  flex-direction: column;
  padding-top: 23dvh;
  padding-bottom: 5dvh;
  background-image: url("/assets/bg6.png");
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
  background-image: url("/assets/bg6.png");
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
`;

const { SuperfluidClubAddress } = Configuration;

const Intro = () => {
  const { address } = useAccount();
  const result = useIsProtege(address);
  const { disconnect } = useDisconnect();

  const onDisconnect = useCallback(() => {
    disconnect();
  }, [disconnect]);

  const { data: realtimeBalanceData } = useRealtimeBalance(
    address,
    SuperfluidClubAddress
  );

  if (result.data === true) {
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
        <ConnectedSection>
          <Flex gap="8px" align="center">
            <H1>Join CLUBx</H1>
            <p>Refer people to get a higher Flow Rate</p>
            <div>{address}</div>
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
        </ConnectedSection>
      </SnapScrollWrapper>
    );
  }

  return (
    <SnapScrollWrapper>
      <HeroSection>
        <Flex gap="8px" align="center">
          <H1>Join CLUBx</H1>
          <p>Refer people to get a higher Flow Rate</p>
        </Flex>
        <ScrollDownBtn />
      </HeroSection>

      <CitySection>
        <CityBuildings src="/assets/bg3.png" />
      </CitySection>

      <PoweredBySection>
        <Flex gap="12px" align="center">
          <GreenBox gap="8px" align="center">
            <H2>
              One transaction,
              <br />
              flows indefinitely
            </H2>
            <p>(until you cancel)</p>
          </GreenBox>
          <WhiteBox direction="row" align="center" gap="4px">
            <div>Powered by</div>
            <img src="/assets/sf-logo.svg" />
          </WhiteBox>
        </Flex>
        <ScrollDownBtn />
      </PoweredBySection>

      <StreamSection>
        <Flex align="center">
          <Flex justify="center" gap="12px" style={{ marginBottom: "32px" }}>
            <Flex direction="row" justify="center" align="center">
              <img src="/assets/beam.svg" />
              <div>Upgraded ERC-20</div>
              <img src="/assets/beam.svg" />
            </Flex>

            <div>
              Tokens with <b>streaming capabilities</b>
            </div>
          </Flex>

          <PinkBox gap="8px" align="center">
            <Flex direction="row" align="end" gap="8px" justify="center">
              <H2>12.09574625</H2>
              <b style={{ paddingBottom: "2px" }}>CLUBx</b>
            </Flex>
            <p>Total amount streamed</p>
          </PinkBox>
        </Flex>
        <ScrollDownBtn />
      </StreamSection>

      <ValuePropSection>
        <ValuePropList>
          <Flex direction="row" align="center" text="left" gap="28px">
            <img src="/assets/timer.svg" />
            <div>
              <Subtitle2>Get paid</Subtitle2>
              <H3>every second</H3>
            </div>
          </Flex>

          <Flex
            direction="row"
            align="center"
            text="right"
            gap="28px"
            style={{ alignSelf: "end" }}
          >
            <div>
              <Subtitle2>Generate yield</Subtitle2>
              <H3>every second</H3>
            </div>
            <img src="/assets/yield.svg" />
          </Flex>

          <Flex direction="row" align="center" text="left" gap="28px">
            <img src="/assets/dca.svg" />
            <div>
              <Subtitle2>Passive</Subtitle2>
              <H3>DCA</H3>
            </div>
          </Flex>
        </ValuePropList>

        <ScrollDownBtn />
      </ValuePropSection>

      <ConnectSection>
        <SignIn />
      </ConnectSection>
    </SnapScrollWrapper>
  );
};

export default Intro;
