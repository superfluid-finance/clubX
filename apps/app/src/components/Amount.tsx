import { getDecimalPlacesToRoundTo } from "@/utils/NumberUtils";
import Decimal from "decimal.js";
import { memo, ReactNode } from "react";
import { formatEther } from "viem";

interface AmountProps {
  wei: bigint;
  /**
   * Defaults to 18 which is what super tokens always have.
   * IMPORTANT: Make sure to pass in this value when you need to display balance of an underlying token and the wei amount was denominated in underlying token's decimals.
   * a.k.a "token decimals", "unit"
   */
  decimals?: number;
  /**
   * a.k.a "fixed" _visible_ decimal places
   */
  decimalPlaces?: number;
  disableRounding?: boolean;
  roundingIndicator?: "..." | "~";
  children?: ReactNode;
}

export function formatAmount(
  wei: bigint,
  decimals?: number,
  decimalPlaces?: number,
  disableRounding?: boolean,
  roundingIndicator?: "..." | "~"
) {
  const decimal = new Decimal(formatEther(wei));
  const decimalPlacesToRoundTo =
    decimalPlaces ?? getDecimalPlacesToRoundTo(decimal);
  const decimalPlacesToDisplay = decimalPlaces ?? undefined; // "undefined" means that trailing zeroes will be removed by `toFixed`
  const decimalRounded = disableRounding
    ? decimal
    : decimal.toDP(decimalPlacesToRoundTo);
  const isRounded = !decimal.equals(decimalRounded);

  return `${
    isRounded && roundingIndicator === "~" ? "~" : ""
  }${decimalRounded.toFixed(decimalPlacesToDisplay)}${
    isRounded && roundingIndicator === "..." ? "..." : ""
  }`;
}

// NOTE: Previously known as "EtherFormatted" & "Ether"
export default memo<AmountProps>(function Amount({
  wei,
  decimals = 18,
  disableRounding,
  roundingIndicator,
  children,
  ...props
}) {
  const formattedAmount = formatAmount(
    wei,
    decimals,
    props.decimalPlaces,
    disableRounding,
    roundingIndicator
  );

  return (
    <>
      {formattedAmount}
      {children}
    </>
  );
});
