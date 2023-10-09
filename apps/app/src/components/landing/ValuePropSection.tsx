import { FC } from "react";
import Flex from "../Flex";
import OverlayGrain from "../OverlayGrain";
import ScrollDownBtn from "../ScrollDownBtn";
import { SnapScrollContent } from "../SnapScroll";
import { Subtitle2, H3 } from "../Typography";
import { Pulse, Electricity } from "@/utils/animations";
import styled from "styled-components";

const ValuePropList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 70dvh;
  padding-bottom: 10dvh;
`;

const Gradient3 = styled.img`
  position: absolute;
  left: 0;
  transform-origin: left;
  animation: ${Pulse} 4s infinite cubic-bezier(0.35, 0, 0.65, 1);
`;

const Gradient4 = styled.img`
  position: absolute;
  right: 0;
  transform-origin: right;
  animation: ${Pulse} 4s infinite 200ms cubic-bezier(0.35, 0, 0.65, 1);
`;

const Gradient5 = styled.img`
  position: absolute;
  left: 0;
  transform-origin: left;
  animation-delay: 1000;
  animation: ${Pulse} 4s infinite 400ms cubic-bezier(0.35, 0, 0.65, 1);
`;

const ElectricIcon = styled.img<{ $delay?: number }>`
  opacity: 0.5;
  animation: ${Electricity} 4s infinite ${({ $delay = 0 }) => `${$delay}ms`}
    cubic-bezier(0.35, 0, 0.65, 1);
`;

interface ValuePropSectionProps {}

const ValuePropSection: FC<ValuePropSectionProps> = ({}) => {
  return (
    <SnapScrollContent
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#000009",
      }}
    >
      <ValuePropList>
        <Flex
          direction="row"
          align="center"
          text="left"
          gap="28px"
          style={{ position: "relative" }}
        >
          <Gradient3 src="/assets/gradient3.svg" />
          <ElectricIcon src="/assets/timer.svg" />
          <div style={{ zIndex: 1 }}>
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
          <Gradient4 src="/assets/gradient4.svg" />
          <div style={{ zIndex: 1 }}>
            <Subtitle2>Generate yield</Subtitle2>
            <H3>every second</H3>
          </div>
          <ElectricIcon $delay={200} src="/assets/yield.svg" />
        </Flex>

        <Flex direction="row" align="center" text="left" gap="28px">
          <Gradient5 src="/assets/gradient5.svg" />
          <ElectricIcon $delay={400} src="/assets/dca.svg" />
          <div style={{ zIndex: 1 }}>
            <Subtitle2>Passive</Subtitle2>
            <H3>DCA</H3>
          </div>
        </Flex>
      </ValuePropList>

      <ScrollDownBtn />
      <OverlayGrain />
    </SnapScrollContent>
  );
};

export default ValuePropSection;
