import { styled } from "styled-components";

interface FlexProps {
  direction?: "row" | "column";
  gap?: string;
  align?: string;
  justify?: string;
}

const Flex = styled.div<FlexProps>(
  ({ direction = "column", gap, align, justify }) => ({
    display: "flex",
    flexDirection: direction,
    gap,
    alignItems: align,
    justifyContent: justify,
  })
);

export default Flex;
