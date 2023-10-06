import CFAv1ForwarderABI from "@/abis/CFAv1Forwarder";
import SuperTokenABI from "@/abis/SuperToken";
import SuperfluidClubABI from "@/abis/SuperfluidClub";
import {
  Address,
  readContracts,
  useContractRead,
  useMutation,
  useQuery,
} from "wagmi";
import { writeContract } from "wagmi/actions";
import Configuration from "./Configuration";

const { SuperfluidClubAddress, network, CFAv1ForwarderAddress } = Configuration;

export const useGetFee = (directProtegeCount: number = 1) =>
  useContractRead({
    chainId: network.id,
    abi: SuperfluidClubABI,
    address: SuperfluidClubAddress,
    functionName: "fee",
    args: [directProtegeCount],
    enabled: true,
  });

export const useGetChainOfSponsors = (address?: Address) =>
  useContractRead({
    chainId: network.id,
    abi: SuperfluidClubABI,
    address: SuperfluidClubAddress,
    functionName: "getChainOfSponsors",
    args: [address!],
    enabled: !!address,
  });

export const useGetProtege = (address?: Address) =>
  useContractRead({
    chainId: network.id,
    abi: SuperfluidClubABI,
    address: SuperfluidClubAddress,
    functionName: "getProtege",
    args: [address!],
    enabled: !!address,
    staleTime: 30000,
  });

export const useSponsor = () => {
  return useMutation({
    mutationFn: async ({
      address,
      amount,
    }: {
      address: Address;
      amount: bigint;
    }) =>
      writeContract({
        abi: SuperfluidClubABI,
        address: SuperfluidClubAddress,
        functionName: "sponsor",
        value: amount,
        args: [address!],
      }),
  });
};

export const useIsProtege = (address?: Address) =>
  useContractRead({
    scopeKey: "IsProtege",
    chainId: network.id,
    abi: SuperfluidClubABI,
    address: SuperfluidClubAddress,
    functionName: "isProtege",
    args: [address!],
    enabled: !!address,
  });

export const useRealtimeBalance = (
  accountAddress?: Address,
  superTokenAddress?: Address
) =>
  useQuery(["RealTimeBalance", accountAddress, superTokenAddress], {
    queryFn: async () =>
      fetchRealtimeBalance(accountAddress, superTokenAddress),
    enabled: !!accountAddress && !!superTokenAddress,
    staleTime: 30000,
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
          abi: CFAv1ForwarderABI,
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
    timestamp: Number(timestamp),
  };
};
