import Flex from "@/components/Flex";
import { SnapScrollContent, SnapScrollWrapper } from "@/components/SnapScroll";
import { CaptionStyle, H1, H2, H3, Subtitle2 } from "@/components/Typography";
import { styled } from "styled-components";

const ScrollImg = styled.img`
  height: 38px;
`;

const ScrollDownBtn = () => {
  return (
    <Flex align="center" gap="12px">
      <b>Next</b>
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

const PoweredByBadge = styled(Flex)`
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

const Intro = () => {
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
          <PoweredByBadge direction="row" align="center" gap="4px">
            <div>Powered by</div>
            <img src="/assets/sf-logo.svg" />
          </PoweredByBadge>
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
        <div>Connect</div>
      </ConnectSection>

      <ConnectedSection>
        <Flex gap="8px" align="center">
          <H1>Join CLUBx</H1>
          <p>Refer people to get a higher Flow Rate</p>
        </Flex>
      </ConnectedSection>
    </SnapScrollWrapper>
  );
};

export default Intro;
