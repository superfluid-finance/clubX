import Link from "next/link";
import styled, { css } from "styled-components";

const FooterBtnStyle = css(() => ({
  width: "100%",
  height: "64px",
  background: "white",
  color: "black",
  textAlign: "center",
  lineHeight: "64px",
}));

export const FooterButton = styled.button`
  ${FooterBtnStyle}
`;

export const FooterLink = styled(Link)`
  ${FooterBtnStyle}
`;
