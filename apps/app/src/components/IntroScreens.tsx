import { useWeb3Modal } from "@web3modal/wagmi/react";
import styled, { css, keyframes } from "styled-components";
import { Button } from "./Button";
import Flex from "./Flex";
import FlowingBalance from "./FlowingBalance";
import { SnapScrollContent, SnapScrollWrapper } from "./SnapScroll";
import { CaptionStyle, H1, H2, H3, Subtitle2 } from "./Typography";
import useScrollPosition from "@/hooks/useScrollPosition";
import { useRef, useState } from "react";
import ScrollDownBtn from "./ScrollDownBtn";
import HeroSection from "./landing/HeroSection";
import OverlayGrain from "./OverlayGrain";

const PulseCenteredKeyframes = keyframes`
0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.6;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.1);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.6;
    }
`;

const PulseLeftKeyframes = keyframes`
0% {
      transform: translateY(-50%) scale(1);
      opacity: 0.6;
    }
    50% {
      transform: translateY(-50%) scale(1.2);
      opacity: 1;
    }
    100% {
      transform: translateY(-50%) scale(1);
      opacity: 0.6;
    }
`;

const PoweredBySection = styled(SnapScrollContent)`
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
    z-index: 1;
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

const Gradient1 = styled.img`
  position: absolute;
  top: 60%;
  left: 40%;
  transform: translate(-50%, -50%);
  width: 100vw;
  animation: ${PulseCenteredKeyframes} 2s infinite
    cubic-bezier(0.35, 0, 0.65, 1);
`;

const Gradient2 = styled.img`
  position: absolute;
  top: 70%;
  left: 70%;
  width: 55vw;
  transform: translate(-50%, -50%);
  animation: ${PulseCenteredKeyframes} 2s infinite 300ms
    cubic-bezier(0.35, 0, 0.65, 1);
`;

const Pulse2 = keyframes`
    10% {
      opacity: 1;
      transform: scale(1);
    }
    31% {
      opacity: 1;
      transform: scale(1.2);
    }
    32% {
      opacity: 0.5;
      transform: scale(0.8);
    }
    34% {
      opacity: 1;
      transform: scale(1);
    }
    35% {
      opacity: 0.5;
      transform: scale(0.7);
    }
    45% {
      opacity: 0.5;
      transform: scale(0.7);
    }
    60% {
      opacity: 1;
      transform: scale(1);
    }
`;

const Gradient3 = styled.img`
  position: absolute;
  left: 0;
  transform-origin: left;
  animation: ${Pulse2} 4s infinite cubic-bezier(0.35, 0, 0.65, 1);
`;

const Gradient4 = styled.img`
  position: absolute;
  right: 0;
  transform-origin: right;
  animation: ${Pulse2} 4s infinite 200ms cubic-bezier(0.35, 0, 0.65, 1);
`;

const Gradient5 = styled.img`
  position: absolute;
  left: 0;
  transform-origin: left;
  animation-delay: 1000;
  animation: ${Pulse2} 4s infinite 400ms cubic-bezier(0.35, 0, 0.65, 1);
`;

const Electricity = keyframes`
    10% {
      opacity: 0.5;
    }
    31% {
      opacity: 1;
    }
    32% {
      opacity: 0.1;
    }
    34% {
      opacity: 0.5;
    }
    35% {
      opacity: 0.05;
    }
    45% {
      opacity: 0.05;
    }
    60% {
      opacity: 0.5;
    }
`;

const Icon1 = styled.img`
  opacity: 0.5;
  animation: ${Electricity} 4s infinite cubic-bezier(0.35, 0, 0.65, 1);
`;
const Icon2 = styled.img`
  opacity: 0.5;
  animation: ${Electricity} 4s infinite 200ms cubic-bezier(0.35, 0, 0.65, 1);
`;
const Icon3 = styled.img`
  opacity: 0.5;
  animation: ${Electricity} 4s infinite 400ms cubic-bezier(0.35, 0, 0.65, 1);
`;

const Gradient6 = styled.img`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  animation: ${PulseLeftKeyframes} 2s infinite cubic-bezier(0.35, 0, 0.65, 1);
`;

const IntroScreens = () => {
  const { open } = useWeb3Modal();
  const [scrollWrapper, setScrollWrapper] = useState<HTMLDivElement | null>(
    null
  );

  const onClickJoin = () => {
    open();
  };

  return (
    <SnapScrollWrapper ref={(newRef) => setScrollWrapper(newRef)}>
      <HeroSection scrollWrapper={scrollWrapper} />

      <PoweredBySection style={{ background: "#000009", position: "relative" }}>
        <Flex gap="15px" align="center" style={{ zIndex: 2 }}>
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
        <OverlayGrain />
      </PoweredBySection>

      <SnapScrollContent
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Flex align="center" style={{ marginTop: "10dvh" }}>
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

            <div>
              Tokens with <b>streaming capabilities</b>
            </div>
          </Flex>

          <PinkBoxWrapper style={{ position: "relative" }}>
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
            <Gradient6 src="/assets/gradient6.svg" />
          </PinkBoxWrapper>
        </Flex>
        <ScrollDownBtn />
        <OverlayGrain />
      </SnapScrollContent>

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
            <Icon1 src="/assets/timer.svg" />
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
            <Icon2 src="/assets/yield.svg" />
          </Flex>

          <Flex direction="row" align="center" text="left" gap="28px">
            <Gradient5
              src="/assets/gradient5.svg"
              style={{ position: "absolute", left: 0 }}
            />
            <Icon3 src="/assets/dca.svg" />
            <div style={{ zIndex: 1 }}>
              <Subtitle2>Passive</Subtitle2>
              <H3>DCA</H3>
            </div>
          </Flex>
        </ValuePropList>

        <ScrollDownBtn />
        <OverlayGrain />
      </SnapScrollContent>

      <SnapScrollContent
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000009",
        }}
      >
        <div style={{ position: "absolute" }}>
          <div
            style={{
              position: "relative",
              width: "100vw",
              height: "100vw",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Gradient1 src="/assets/gradient2.svg" />
            <Gradient2 src="/assets/gradient1.svg" />
          </div>
        </div>
        <ConnectCard>
          <div style={{ zIndex: 1 }}>
            <H1>Join CLUBx</H1>
            <p>Refer people to get a higher Flow Rate</p>
          </div>
          <img src="/assets/glowing-logo.png" style={{ opacity: 0.8 }} />
          <Button style={{ zIndex: 1 }} onClick={onClickJoin}>
            Join
          </Button>
        </ConnectCard>
        <OverlayGrain />
      </SnapScrollContent>
    </SnapScrollWrapper>
  );
};

export default IntroScreens;
