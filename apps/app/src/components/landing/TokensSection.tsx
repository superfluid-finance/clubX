import { PulseLeftKeyframes } from "@/utils/animations";
import { FC } from "react";
import styled from "styled-components";
import { GlowingBox } from "../Boxes";
import Flex from "../Flex";
import FlowingBalance from "../FlowingBalance";
import OverlayGrain from "../OverlayGrain";
import ScrollDownBtn from "../ScrollDownBtn";
import { SnapScrollContent } from "../SnapScroll";
import { H2 } from "../Typography";

const PinkBoxWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  width: 100%;
`;

const PinkBox = styled(GlowingBox).attrs(() => ({ $color: "#ea00e0dd" }))`
  padding: 32px 45px;
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

const Gradient6 = styled.img`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  animation: ${PulseLeftKeyframes} 2s infinite cubic-bezier(0.35, 0, 0.65, 1);
`;

interface TokensSectionProps {}

const TokensSection: FC<TokensSectionProps> = ({}) => {
  return (
    <SnapScrollContent
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "10dvh",
        position: "relative",
      }}
    >
      <Flex
        justify="center"
        gap="12px"
        style={{ marginBottom: "32px", zIndex: 2 }}
      >
        <Flex direction="row" justify="center" align="center">
          <img src="/assets/beam.svg" />
          <div>Upgraded ERC-20</div>
          <img src="/assets/beam.svg" />
        </Flex>

        <div style={{ textAlign: "center" }}>
          Tokens with <b>streaming capabilities</b>
        </div>
      </Flex>

      <PinkBoxWrapper style={{ position: "relative" }}>
        <PinkBoxLines />
        <PinkBox gap="8px" align="center">
          <Flex direction="row" align="end" gap="8px" justify="center">
            <H2 style={{ fontVariantNumeric: "tabular-nums" }}>
              <FlowingBalance
                flowRate={9385712843748234n}
                startingBalance={12095746250000000000n}
                startingBalanceDate={new Date()}
              />
            </H2>
            <b style={{ paddingBottom: "2px" }}>CLUBx</b>
          </Flex>
          <p>Total amount streamed</p>
        </PinkBox>
        <Gradient6 src="/assets/gradient6.svg" />
      </PinkBoxWrapper>

      <ScrollDownBtn />
      <OverlayGrain />
    </SnapScrollContent>
  );
};

export default TokensSection;
