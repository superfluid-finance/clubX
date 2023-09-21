import { useWeb3Modal } from "@web3modal/wagmi/react";
import styled from "styled-components";
import { Button } from "./Button";
import Flex from "./Flex";
import FlowingBalance from "./FlowingBalance";
import { SnapScrollContent, SnapScrollWrapper } from "./SnapScroll";
import { CaptionStyle, H1, H2, H3, Subtitle2 } from "./Typography";

const ScrollImg = styled.img`
  height: 38px;
`;

const ScrollDownBtn = () => {
  return (
    <Flex
      align="center"
      gap="12px"
      style={{ position: "absolute", bottom: "5dvh" }}
    >
      <b style={{ fontWeight: 500 }}>Next</b>
      <ScrollImg src="/assets/scroll-down.svg" />
    </Flex>
  );
};

const HeroSectionWrapper = styled.div`
  scroll-snap-align: start;
`;

const HeroSection = styled(SnapScrollContent)`
  background-image: url("/assets/bg1.png");
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding-top: 23dvh;
  padding-bottom: 5dvh;
  scroll-snap-align: initial;
`;

const CitySection = styled(SnapScrollContent)`
  background-image: url("/assets/bg2.png");
  background-size: cover;
  background-position: center;
  height: 100dvh;
  position: relative;
  overflow: hidden;
  scroll-snap-align: initial;
  position: relative;
`;

const CityBuildings = styled.img`
  display: block;
  position: absolute;
  top: calc(100dvh + 60dvh);
  width: 100%;
`;

const PoweredBySection = styled(SnapScrollContent)`
  background-image: url("/assets/bg3.png");
  background-size: cover;
  background-position: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  padding-top: 16dvh;
  padding-bottom: 10dvh;
  justify-content: space-between;
  position: relative;
`;

const PinkBoxWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  width: 100vw;
`;

const PinkBox = styled(Flex)`
  position: relative;
  padding: 32px 45px;
  text-align: center;
  text-shadow: 0 0 10px #ea00e0dd;

  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow:
    0 0 4px 2px #ea00e0dd,
    inset 0 0 4px 2px #ea00e0dd;
  z-index: 2;
`;

const PinkBoxLines = styled.div`
  position: relative;
  width: 100%;

  &::before,
  &::after {
    content: "";
    position: absolute;
    right: 0;
    height: 2px;
    width: 100%;
    background: linear-gradient(90deg, #06062b, #b5b5ff);
    z-index: 1;
  }

  &::before {
    top: 20%;
  }

  &::after {
    bottom: 20%;
  }
`;

const ValuePropList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 70dvh;
  padding-bottom: 10dvh;
`;

const GreenBoxWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  width: 100vw;
`;

const GreenBox = styled(Flex)`
  padding: 24px 40px;
  text-align: center;
  text-shadow: 0 0 10px #1db227;
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow:
    0 0 4px 2px #1db227,
    inset 0 0 4px 2px #1db227;
  z-index: 2;
`;

const GreenBoxLines = styled.div`
  position: relative;
  width: 100%;

  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 0;
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

const PoweredByBox = styled(Flex)`
  display: inline-flex;
  border-radius: 8px;
  border: 1.5px solid #e9ebef;
  padding: 10px 24px;
  ${CaptionStyle}
  position: relative;

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

const ConnectCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  width: 80vw;
  padding: 72px 24px 24px;
  position: relative;
  gap: 8dvh;

  p {
    max-width: 200px;
    text-align: center;
    width: 100%;
    margin: 0 auto;
  }

  &::before {
    content: "";
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

const IntroScreens = () => {
  const { open } = useWeb3Modal();

  const onClickJoin = () => {
    open();
  };

  return (
    <SnapScrollWrapper>
      <HeroSectionWrapper>
        <HeroSection>
          <Flex gap="8px" align="center">
            <H1>Join CLUBx</H1>
            <p>Refer people to get a higher Flow Rate</p>
          </Flex>
          <ScrollDownBtn />
        </HeroSection>

        <CitySection></CitySection>
        <CityBuildings src="/assets/bg3.png" />
      </HeroSectionWrapper>

      <PoweredBySection>
        <Flex gap="15px" align="center">
          <GreenBoxWrapper>
            <div></div>
            <GreenBox gap="8px" align="center">
              <H2>
                One transaction,
                <br />
                flows indefinitely
              </H2>
              <p>(until you cancel)</p>
            </GreenBox>
            <GreenBoxLines />
          </GreenBoxWrapper>
          <PoweredByBox direction="row" align="center" gap="4px">
            <div>Powered by</div>
            <img src="/assets/sf-logo.svg" />
          </PoweredByBox>
        </Flex>
        <ScrollDownBtn />
      </PoweredBySection>

      <SnapScrollContent
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundImage: "url(/assets/grain.png), url(/assets/test3.png)",
          backgroundSize: "cover",
          backgroundBlendMode: "overlay",
        }}
      >
        <Flex align="center" style={{ marginTop: "10dvh" }}>
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

          <PinkBoxWrapper>
            <PinkBoxLines />
            <PinkBox gap="8px" align="center">
              <Flex direction="row" align="end" gap="8px" justify="center">
                <H2 style={{ fontVariantNumeric: "tabular-nums" }}>
                  <FlowingBalance
                    flowRate={BigInt(9385712843748234)}
                    startingBalance={BigInt(12095746250000000000)}
                    startingBalanceDate={new Date()}
                  />
                </H2>
                <b style={{ paddingBottom: "2px" }}>CLUBx</b>
              </Flex>
              <p>Total amount streamed</p>
            </PinkBox>
            <div />
          </PinkBoxWrapper>
        </Flex>
        <ScrollDownBtn />
      </SnapScrollContent>

      <SnapScrollContent
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: "url(/assets/grain.png), url(/assets/test2.png)",
          backgroundSize: "cover",
          backgroundBlendMode: "overlay",
        }}
      >
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
      </SnapScrollContent>

      <SnapScrollContent
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: "url(/assets/grain.png), url(/assets/test1.png)",
          backgroundSize: "cover",
          backgroundBlendMode: "overlay",
        }}
      >
        <ConnectCard>
          <div>
            <H1>Join CLUBx</H1>
            <p>Refer people to get a higher Flow Rate</p>
          </div>
          <img src="/assets/glowing-logo.png" />
          <Button onClick={onClickJoin}>Join</Button>
        </ConnectCard>
      </SnapScrollContent>
    </SnapScrollWrapper>
  );
};

export default IntroScreens;
