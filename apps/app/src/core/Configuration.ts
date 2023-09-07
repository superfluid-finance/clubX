import { Address } from "viem";
import { polygonMumbai } from "viem/chains";

const Configuration = {
  network: polygonMumbai,
  rpcUrl: "https://rpc-mumbai.maticvigil.com",
  CFAv1ForwarderAddress: <Address>"0xcfA132E353cB4E398080B9700609bb008eceB125",
  SuperfluidClubAddress: <Address>"0x27429186689e8E7Ff1Bf7D36e231C3E6e6B0dDE0",
  WalletConnectID: "8f889a96cfb4b5e9cc538b3dae8275d8",
};

export default Object.freeze(Configuration);
