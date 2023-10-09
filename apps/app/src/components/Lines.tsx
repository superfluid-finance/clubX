import styled from "styled-components";

export const HorizontalLines = styled.div<{ $reverse?: boolean }>`
  position: relative;
  width: 100%;

  &::before,
  &::after {
    content: "";
    position: absolute;
    right: 0;
    height: 2px;
    width: 100%;
    background: linear-gradient(
      270deg,
      ${({ $reverse }) => ($reverse ? "#06062b, #b5b5ff" : "#b5b5ff, #06062b")}
    );
    z-index: 1;
  }

  &::before {
    top: 20%;
  }

  &::after {
    bottom: 20%;
  }
`;
