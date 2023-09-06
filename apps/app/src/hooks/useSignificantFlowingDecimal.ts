import { absoluteValue } from "@/utils/NumberUtils";
import { useMemo } from "react";
import { formatEther } from "viem";

export const useSignificantFlowingDecimal = (
  flowRate: bigint,
  animationStepTimeInMs: number
): number | undefined =>
  useMemo(() => {
    if (flowRate === BigInt(0)) {
      return undefined;
    }

    const ticksPerSecond = 1000 / animationStepTimeInMs;
    const flowRatePerTick = flowRate / BigInt(ticksPerSecond);

    const [beforeEtherDecimal, afterEtherDecimal] =
      formatEther(flowRatePerTick).split(".");

    const isFlowingInWholeNumbers =
      absoluteValue(BigInt(beforeEtherDecimal)) > BigInt(0);

    if (isFlowingInWholeNumbers) {
      return 0; // Flowing in whole numbers per tick.
    }
    const numberAfterDecimalWithoutLeadingZeroes = BigInt(afterEtherDecimal);

    const lengthToFirstSignificatDecimal = afterEtherDecimal
      .toString()
      .replace(numberAfterDecimalWithoutLeadingZeroes.toString(), "").length; // We're basically counting the zeroes.

    // This will usually have the last 3 numbers flowing smoothly.
    return Math.min(lengthToFirstSignificatDecimal + 2, 18); // Don't go over 18.
  }, [flowRate]);
