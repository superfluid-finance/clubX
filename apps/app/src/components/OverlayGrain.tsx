import styled from "styled-components";

const OverlayGrainImage = styled.img`
  mix-blend-mode: overlay;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const OverlayGrain = () => (
  <>
    <OverlayGrainImage src="/assets/grain.png" />
    <OverlayGrainImage
      src="/assets/grain.png"
      style={{
        opacity: 0.4,
      }}
    />
  </>
);
export default OverlayGrain;
