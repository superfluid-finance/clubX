import { Address } from "viem";
import { polygon } from "viem/chains";

const Configuration = {
  network: polygon,
  CFAv1ForwarderAddress: <Address>"0xcfA132E353cB4E398080B9700609bb008eceB125",
  SuperfluidClubAddress: <Address>"0x58b5bcfddf72579fc1e03874df9bc234bc9f417b", //0x5e3fea4a014e84679e839ff0e9b1fbcb7b5096e0
  WalletConnectID: "8f889a96cfb4b5e9cc538b3dae8275d8",
  MagicLinkKey: "pk_live_1AC13096CD7EA885",
};

export default Object.freeze(Configuration);
