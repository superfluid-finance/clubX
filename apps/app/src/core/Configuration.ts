import { Address } from "viem";
import { polygon } from "viem/chains";

const Configuration = {
  network: polygon,
  CFAv1ForwarderAddress: <Address>"0xcfA132E353cB4E398080B9700609bb008eceB125",
  SuperfluidClubAddress: <Address>"0x520acbb446028dac642374773b312dbc577869fb",
  WalletConnectID: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID || "",
  MagicLinkKey: process.env.NEXT_PUBLIC_MAGIC_LINK_KEY || "",
};

export default Object.freeze(Configuration);
