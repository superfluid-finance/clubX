import { useWeb3Modal } from "@web3modal/react";
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

// const StreamSection = styled(SnapScrollContent)`
//   background-image: url("/assets/bg4.png");
//   background-size: cover;
//   background-position: center;
//   display: flex;
//   flex-direction: column;
//   padding-top: 15dvh;
//   padding-bottom: 10dvh;
//   justify-content: space-between;
// `;

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

// const ValuePropSection = styled(SnapScrollContent)`
//   background-image: url("/assets/bg5.png");
//   background-size: 100% 100%;
//   background-position-y: -111px;
//   display: flex;
//   flex-direction: column;
//   padding-top: 10dvh;
//   padding-bottom: 10dvh;
//   justify-content: space-between;
// `;

const ValuePropList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 70dvh;
  padding-bottom: 10dvh;
`;

// const ConnectSection = styled(SnapScrollContent)`
//   background-image: url("/assets/bg6.png");
//   background-size: contain;
//   background-position: center;
//   background-repeat: no-repeat;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
// `;

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

const WhiteBox = styled(Flex)`
  display: inline-flex;
  border-radius: 8px;
  border: 1px solid #e9ebef;
  padding: 10px 24px;
  ${CaptionStyle}
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
          <Button onClick={open}>Join</Button>
        </ConnectCard>
      </SnapScrollContent>
    </SnapScrollWrapper>
  );
};

export default IntroScreens;
