import { Address } from "viem";
import { polygonMumbai } from "viem/chains";

const Configuration = {
  network: polygonMumbai,
  rpcUrl: "https://rpc-mumbai.maticvigil.com",
  CFAv1ForwarderAddress: <Address>"0xcfA132E353cB4E398080B9700609bb008eceB125",
  SuperfluidClubAddress: <Address>"0xde299f6ab4aed5cec33cf8dce96a9facb0afbfae",
  WalletConnectID: "8f889a96cfb4b5e9cc538b3dae8275d8",
};

export default Object.freeze(Configuration);
