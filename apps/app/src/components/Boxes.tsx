import styled from "styled-components";
import Flex from "./Flex";

export const GlowingBox = styled(Flex)<{ $color?: string }>`
  position: relative;
  padding: 24px 40px;
  text-align: center;
  text-shadow: 0 0 10px ${({ $color }) => $color};
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow:
    0 0 4px 2px ${({ $color }) => $color},
    inset 0 0 4px 2px ${({ $color }) => $color};
  z-index: 2;
`;

export const GradientBorderBox = styled.div`
  position: relative;

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
