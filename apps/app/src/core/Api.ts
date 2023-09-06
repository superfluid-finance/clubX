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

const { SuperfluidClubAddress, NetworkID, CFAv1ForwarderAddress } =
  Configuration;

export const useSponsor = (
  address?: Address
): [(() => void) | undefined, boolean, boolean] => {
  const sponsorConfig = usePrepareContractWrite(
    address
      ? {
          abi: SuperfluidClubABI,
          address: SuperfluidClubAddress,
          functionName: "sponsor",
          value: BigInt(0.03),
          args: [address, false],
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
      fetchRealtimeBalance(superTokenAddress, accountAddress),
    enabled: !!accountAddress && !!superTokenAddress,
  });

const fetchRealtimeBalance = async (
  superTokenAddress?: Address,
  accountAddress?: Address
) => {
  if (!superTokenAddress || !accountAddress) return Promise.reject();

  const [flowrate, [currentBalance, _deposit, _owedDeposit, timestamp]] =
    await readContracts({
      allowFailure: false,
      contracts: [
        {
          chainId: NetworkID,
          abi: CFAv1ForwarderABI,
          functionName: "getAccountFlowrate",
          address: CFAv1ForwarderAddress,
          args: [superTokenAddress, accountAddress],
        },
        {
          chainId: NetworkID,
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
