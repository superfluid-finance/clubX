import { Address } from "viem";
import { polygon } from "viem/chains";

const Configuration = {
  network: polygon,
  CFAv1ForwarderAddress: <Address>"0xcfA132E353cB4E398080B9700609bb008eceB125",
  SuperfluidClubAddress: <Address>"0xf187fa4B5904bC3F6E0E409d80D5213A2e0FF8B2",
  WalletConnectID: "8f889a96cfb4b5e9cc538b3dae8275d8",
  MagicLinkKey: "pk_live_1AC13096CD7EA885",
};

export default Object.freeze(Configuration);
