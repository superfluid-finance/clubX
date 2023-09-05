import styled from "styled-components";

export const PageWrapper = styled.main(() => ({
  display: "flex",
  flexDirection: "column",
  // gridTemplateRows: "32px auto 64px",
  // gridTemplateAreas: `"header" "content" "footer"`,
  maxHeight: "100dvh",
  height: "100dvh",
  maxWidth: "100vw",
  width: "100vw",
  overflow: "hidden",
}));

export const PageContent = styled.div(() => ({
  // gridArea: "content",
  flex: 1,
  overflowY: "auto",
  // maxWidth: "calc(100vw - 32px)",
  // width: "100%",
  gap: "32px",
}));

export const Header = styled.header(() => ({
  width: "100%",
  textAlign: "center",
  margin: "20px"
  // height: "64px"
  // gridArea: "header",
}));

export const Footer = styled.footer(() => ({
  width: "100%",
  gridArea: "footer",
}));
