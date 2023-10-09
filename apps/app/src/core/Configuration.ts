import { Address } from "viem";
import { polygon } from "viem/chains";

const Configuration = {
  network: polygon,
  CFAv1ForwarderAddress: <Address>"0xcfA132E353cB4E398080B9700609bb008eceB125",
  SuperfluidClubAddress: <Address>"0x520acbb446028dac642374773b312dbc577869fb",
  WalletConnectID: "8f889a96cfb4b5e9cc538b3dae8275d8",
  MagicLinkKey: "pk_live_1AC13096CD7EA885",
};

export default Object.freeze(Configuration);
