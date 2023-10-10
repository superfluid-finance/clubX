import styled from "styled-components";

export const PageWrapper = styled.main`
  display: flex;
  flex-direction: column;
  max-height: 100dvh;
  height: 100dvh;
  max-width: 800px;
  width: 100%;
  overflow: hidden;
  margin: 0 auto;
  position: relative;
`;

export const PageContent = styled.div`
  flex: 1;
  overflow-y: auto;
  gap: 32px;
`;
