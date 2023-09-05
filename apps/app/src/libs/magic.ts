import { Networks } from '@/utils/networks';
import { EthNetworkConfiguration, Magic } from 'magic-sdk';


export const magic = new Magic(process.env.REACT_APP_MAGIC_API_KEY as string, {
  network: {
    rpcUrl: process.env.REACT_APP_POLYGON_RPC_URL as string,
    chainId: 80001,
  },
});
