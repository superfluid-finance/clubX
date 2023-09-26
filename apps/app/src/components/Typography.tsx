import { css, styled } from "styled-components";

export const H1Styles = css`
  font-size: 42px;
  font-weight: 500;
`;

export const H2Styles = css`
  font-size: 28px;
  font-weight: 500;
`;

export const H3Styles = css`
  font-size: 24px;
  font-weight: 500;
`;

export const Subtitle1Styles = css`
  font-size: 18px;
  font-weight: 500;
`;

export const Subtitle2Styles = css`
  font-size: 18px;
`;

export const CaptionStyle = css`
  font-size: 13px;
`;

export const H1 = styled.h1`
  ${H1Styles}
`;

export const H2 = styled.h2`
  ${H2Styles}
`;

export const H3 = styled.h3`
  ${H3Styles}
`;

export const Subtitle1 = styled.div`
  ${Subtitle1Styles}
`;

export const Subtitle2 = styled.div`
  ${Subtitle2Styles}
`;

export const Caption = styled.div`
  ${CaptionStyle}
`;
