import { Address } from "viem";
import { polygonMumbai } from "viem/chains";

const Configuration = {
  network: polygonMumbai,
  rpcUrl: "https://rpc-mumbai.maticvigil.com",
  CFAv1ForwarderAddress: <Address>"0xcfA132E353cB4E398080B9700609bb008eceB125",
  SuperfluidClubAddress: <Address>"0x5e3fea4a014e84679e839ff0e9b1fbcb7b5096e0",
  WalletConnectID: "8f889a96cfb4b5e9cc538b3dae8275d8",
};

export default Object.freeze(Configuration);
