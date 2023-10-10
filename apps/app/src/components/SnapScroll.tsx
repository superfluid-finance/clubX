import { styled } from "styled-components";
import { PageWrapper } from "./Layout";

export const SnapScrollWrapper = styled.div`
  height: 100dvh;
  max-height: 100dvh;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scroll-padding: 0;
  position: relative;
`;

export const SnapScrollContent = styled.section`
  height: 100dvh;
  width: 100%;
  /* border: 1px solid red; */
  scroll-snap-align: center;
  position: relative;
  overflow: hidden;
`;
