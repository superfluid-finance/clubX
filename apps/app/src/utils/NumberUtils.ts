import Decimal from "decimal.js";

export enum UnitOfTime {
  Second = 1,
  Minute = 60,
  Hour = 3600,
  Day = 86400,
  Week = 604800,
  Month = 2628000,
  Year = 31536000,
}

export const absoluteValue = (n: bigint) => {
  return n >= 0 ? n : -n;
};

export function toFixedUsingString(numStr: string, decimalPlaces: number) {
  const [wholePart, decimalPart] = numStr.split(".");

  if (!decimalPart || decimalPart.length <= decimalPlaces) {
    return numStr.padEnd(wholePart.length + 1 + decimalPlaces, "0");
  }

  const decimalPartBigInt = BigInt(decimalPart.slice(0, decimalPlaces + 1));

  const round = decimalPartBigInt % BigInt(10) >= BigInt(5);
  const roundedDecimal =
    decimalPartBigInt / BigInt(10) + (round ? BigInt(1) : BigInt(0));

  return (
    wholePart + "." + roundedDecimal.toString().padStart(decimalPlaces, "0")
  );
}

export const getDecimalPlacesToRoundTo = (value: Decimal): number => {
  if (value.isZero()) {
    return 0;
  }

  const absoluteValue = value.abs();

  if (absoluteValue.gte(1000)) {
    return 0;
  }

  if (absoluteValue.gte(100)) {
    return 1;
  }

  if (absoluteValue.gte(10)) {
    return 2;
  }

  if (absoluteValue.gte(0.099)) {
    return 4;
  }

  if (absoluteValue.gte(0.00099)) {
    return 6;
  }

  if (absoluteValue.gte(0.0000099)) {
    return 8;
  }

  if (absoluteValue.gte(0.000000099)) {
    return 12;
  }

  if (absoluteValue.gte(0.0000000000099)) {
    return 16;
  }

  return 18;
};
