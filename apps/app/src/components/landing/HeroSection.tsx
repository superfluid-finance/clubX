import { FC, RefObject } from "react";
import Flex from "../Flex";
import { H1 } from "../Typography";
import { SnapScrollContent } from "../SnapScroll";
import styled from "styled-components";
import ScrollDownBtn from "../ScrollDownBtn";
import useScrollPosition from "@/hooks/useScrollPosition";

const Wrapper = styled.div`
  scroll-snap-align: start;
  position: relative;
  overflow: hidden;
`;

const HeroSectionWrapper = styled(SnapScrollContent)`
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
  top: calc(105dvh);
  width: 100%;
  z-index: 2;
  transition: all 50ms linear;
`;

interface HeroSectionProps {
  scrollWrapper: HTMLElement | null;
}

const HeroSection: FC<HeroSectionProps> = ({ scrollWrapper }) => {
  const pos = useScrollPosition(scrollWrapper, 0.25);

  return (
    <Wrapper>
      <HeroSectionWrapper>
        <Flex gap="8px" align="center">
          <H1>Join CLUBx</H1>
          <p>Refer people to get a higher Flow Rate</p>
        </Flex>
        <ScrollDownBtn />
      </HeroSectionWrapper>

      <CitySection></CitySection>
      <CityBuildings
        src="/assets/bg3.png"
        style={{ transform: `translateY(${pos}px)` }}
      />
    </Wrapper>
  );
};

export default HeroSection;
