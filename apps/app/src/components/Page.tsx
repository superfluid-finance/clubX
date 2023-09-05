import styled from "styled-components";

export const PageWrapper = styled.main(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  height: "100vh",
  width: "100vw",
}));

export const PageContent = styled.div(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  maxWidth: "calc(100vw - 32px)",
  width: "100%",
  gap: "32px",
  flex: 1,
}));
