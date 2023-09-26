import Link from "next/link";
import styled, { css } from "styled-components";

const FooterBtnStyle = css(() => ({
  width: "100%",
  height: "64px",
  color: "#A600E0",
  textAlign: "center",
  lineHeight: "64px",
}));

export const FooterButton = styled.button`
  ${FooterBtnStyle}
`;

export const FooterLink = styled(Link)`
  ${FooterBtnStyle}
`;
