import styled from "styled-components";

export const PageWrapper = styled.main(() => ({
  display: "flex",
  flexDirection: "column",
  maxHeight: "100dvh",
  height: "100dvh",
  maxWidth: "100%",
  width: "100%",
  overflow: "hidden",
}));

export const PageContent = styled.div(() => ({
  flex: 1,
  overflowY: "auto",
  gap: "32px",
}));

export const Header = styled.header(() => ({
  width: "100%",
  textAlign: "center",
  margin: "20px",
}));

export const Footer = styled.footer(() => ({
  width: "100%",
}));
