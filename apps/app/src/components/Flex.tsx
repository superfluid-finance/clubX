import { Property } from "csstype";
import { styled } from "styled-components";

interface FlexProps {
  direction?: "row" | "column";
  gap?: string;
  align?: string;
  justify?: string;
  text?: Property.TextAlign;
}

const Flex = styled.div<FlexProps>(
  ({ direction = "column", gap, align, justify, text }) => ({
    display: "flex",
    flexDirection: direction,
    gap,
    alignItems: align,
    justifyContent: justify,
    textAlign: text,
  })
);

export default Flex;
