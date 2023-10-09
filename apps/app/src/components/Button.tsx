import Link from "next/link";
import { FC, PropsWithChildren } from "react";
import { css, styled } from "styled-components";

interface ButtonProps extends PropsWithChildren {}

const ButtonStyles = css`
  position: relative;
  max-width: 320px;
  width: 100%;
  height: 42px;
  line-height: 42px;
  margin: 0 auto;

  text-align: center;

  box-shadow: 0px 0px 20px 0px #a600e0;
  border-radius: 10px;
  border: 1px solid #fff;

  background: rgb(166, 0, 224);
  background: radial-gradient(
    circle,
    rgba(166, 0, 224, 1) 0%,
    rgba(241, 202, 255, 1) 110%
  );
  color: white;
  font-size: 18px;
  font-weight: 500;
`;

export const Button = styled.button`
  ${ButtonStyles}

  ${({ disabled }) =>
    disabled && {
      filter: "grayscale(1)",
    }}
`;

export const LinkButton = styled(Link)`
  display: inline-block;
  ${ButtonStyles}
`;
