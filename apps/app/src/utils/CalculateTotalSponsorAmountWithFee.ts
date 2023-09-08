import { formatEther, parseEther } from "viem";

const calculateTotalSponsorAmountWithFee = (amount: number, fee: bigint | undefined = BigInt(0)) => {
    return Number(formatEther(fee)) + amount;
};

export default calculateTotalSponsorAmountWithFee;
