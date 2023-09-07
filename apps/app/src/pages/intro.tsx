import Flex from "@/components/Flex";
import { SnapScrollContent, SnapScrollWrapper } from "@/components/SnapScroll";
import { styled } from "styled-components";

const ScrollDown = () => {
  return <div>Next</div>;
};

const HeroSection = styled(SnapScrollContent)`
  background-image: url("/assets/bg1.png");
  background-size: cover;
  background-position: center;
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

const ERC20Title = styled(Flex)`
  margin-bottom: 20px;
`;

const Intro = () => {
  return (
    <SnapScrollWrapper>
      <HeroSection>
        <div>Join CLUBx</div>
        <p>Refer people to get a higher Flow Rate</p>
        <ScrollDown />
      </HeroSection>

      <CitySection>
        <CityBuildings src="/assets/bg3.png" />
        <div>One transaction, flows indefinitely</div>
        <p>(until you cancel)</p>
        <ScrollDown />
      </CitySection>

      <SnapScrollContent>
        <ERC20Title direction="row" justify="center" align="center">
          <img src="/assets/beam.svg" />
          <div>Upgraded ERC-20</div>
          <img src="/assets/beam.svg" />
        </ERC20Title>

        <div>Tokens with streaming capabilities</div>
        <div>12.09574625 CLUBx</div>
        <p>Total amount streamed</p>
        <ScrollDown />
      </SnapScrollContent>

      <SnapScrollContent>
        <div>
          <img src="/assets/timer.svg" />
          <div>Get paid</div>
          <div>every second</div>
        </div>

        <div>
          <img src="/assets/yield.svg" />
          <div>Generate yield</div>
          <div>every second</div>
        </div>

        <div>
          <img src="/assets/dca.svg" />
          <div>Passive</div>
          <div>DCA</div>
        </div>

        <ScrollDown />
      </SnapScrollContent>
    </SnapScrollWrapper>
  );
};

export default Intro;
