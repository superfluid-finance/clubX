import { PulseCenteredKeyframes } from "@/utils/animations";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import styled from "styled-components";
import { Button } from "../Button";
import OverlayGrain from "../OverlayGrain";
import { SnapScrollContent } from "../SnapScroll";
import { H1 } from "../Typography";
import { GradientBorderBox } from "../Boxes";

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

const ConnectCard = styled(GradientBorderBox)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  width: 80vw;
  padding: 72px 24px 24px;
  gap: 8dvh;

  p {
    max-width: 200px;
    text-align: center;
    width: 100%;
    margin: 0 auto;
  }
`;

const JoinSection = () => {
  const { open } = useWeb3Modal();
  const onClickJoin = () => open();

  return (
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
  );
};

export default JoinSection;
