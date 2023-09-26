import { FC } from "react";
import styled from "styled-components";
import Flex from "./Flex";

const ScrollImg = styled.img`
  height: 38px;
`;

const ScrollDownBtn = () => (
  <Flex
    align="center"
    gap="12px"
    style={{ position: "absolute", bottom: "5dvh" }}
  >
    <b style={{ fontWeight: 500 }}>Next</b>
    <ScrollImg src="/assets/scroll-down.svg" />
  </Flex>
);

export default ScrollDownBtn;
