import { PulseCenteredKeyframes } from "@/utils/animations";
import styled from "styled-components";
import { GlowingBox, HangingBox } from "../Boxes";
import Flex from "../Flex";
import OverlayGrain from "../OverlayGrain";
import ScrollDownBtn from "../ScrollDownBtn";
import { SnapScrollContent } from "../SnapScroll";
import { H2 } from "../Typography";

const StyledSection = styled(SnapScrollContent)`
  align-items: center;
  display: flex;
  flex-direction: column;
  padding-top: 16dvh;
  padding-bottom: 10dvh;
  justify-content: space-between;
  position: relative;
`;

const GreenBoxWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  width: 100%;
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

const Gradient = styled.img`
  position: absolute;
  top: 100%;
  left: 50%;
  animation: ${PulseCenteredKeyframes} 2s infinite
    cubic-bezier(0.35, 0, 0.65, 1);
`;

const PoweredBySection = ({}) => {
  return (
    <StyledSection>
      <Flex
        gap="15px"
        align="center"
        style={{ position: "relative", width: "100%" }}
      >
        <Gradient src="/assets/gradient7.svg" />
        <GreenBoxWrapper>
          <div></div>
          <GlowingBox $color="#1db227" gap="8px" align="center">
            <H2>
              One transaction,
              <br />
              flows indefinitely
            </H2>
            <p>(until you cancel)</p>
          </GlowingBox>
          <GreenBoxLines />
        </GreenBoxWrapper>

        <HangingBox direction="row" align="center" gap="4px">
          <div>Powered by</div>
          <img src="/assets/sf-logo.svg" />
        </HangingBox>
      </Flex>

      <ScrollDownBtn />
      <OverlayGrain />
    </StyledSection>
  );
};

export default PoweredBySection;
