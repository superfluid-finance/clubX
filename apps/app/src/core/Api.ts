import CFAv1ForwarderABI from "@/abis/CFAv1Forwarder";
import SuperTokenABI from "@/abis/SuperToken";
import SuperfluidClubABI from "@/abis/SuperfluidClub";
import fromUnixTime from "date-fns/fromUnixTime";
import {
  Address,
  readContracts,
  useContractWrite,
  usePrepareContractWrite,
  useQuery,
  useWaitForTransaction,
} from "wagmi";
import Configuration from "./Configuration";
import { formatEther, parseEther } from "viem";

const { SuperfluidClubAddress, network, CFAv1ForwarderAddress } = Configuration;

export const useSponsor = (
  address?: Address
): [(() => void) | undefined, boolean, boolean] => {
  const sponsorConfig = usePrepareContractWrite(
    address
      ? {
          chainId: network.id,
          abi: SuperfluidClubABI,
          address: SuperfluidClubAddress,
          functionName: "sponsorship",
          value: parseEther("0.01"),
          args: [address],
        }
      : {}
  );

  const { data, write } = useContractWrite(sponsorConfig.config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return [write, isLoading, isSuccess];
};

export const useRealtimeBalance = (
  accountAddress?: Address,
  superTokenAddress?: Address
) =>
  useQuery(["RealTimeBalance", accountAddress, superTokenAddress], {
    queryFn: async () =>
      fetchRealtimeBalance(accountAddress, superTokenAddress),
    enabled: !!accountAddress && !!superTokenAddress,
  });

const fetchRealtimeBalance = async (
  accountAddress?: Address,
  superTokenAddress?: Address
) => {
  if (!superTokenAddress || !accountAddress) return Promise.reject();

  const [flowrate, [currentBalance, _deposit, _owedDeposit, timestamp]] =
    await readContracts({
      allowFailure: false,
      contracts: [
        {
          chainId: network.id,
          abi: [
            {
              stateMutability: "view",
              type: "function",
              inputs: [
                {
                  name: "token",
                  internalType: "contract ISuperToken",
                  type: "address",
                },
                { name: "account", internalType: "address", type: "address" },
              ],
              name: "getAccountFlowrate",
              outputs: [
                { name: "flowrate", internalType: "int96", type: "int96" },
              ],
            },
          ],
          functionName: "getAccountFlowrate",
          address: CFAv1ForwarderAddress,
          args: [superTokenAddress, accountAddress],
        },
        {
          chainId: network.id,
          abi: SuperTokenABI,
          functionName: "realtimeBalanceOfNow",
          address: SuperfluidClubAddress,
          args: [accountAddress],
        },
      ],
    });

  return {
    flowrate,
    currentBalance,
    date: fromUnixTime(Number(timestamp)),
  };
};
