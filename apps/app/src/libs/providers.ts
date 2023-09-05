import { magic } from './magic';
import {
    Web3Provider
} from "@ethersproject/providers"

export const getProvider = () => {
  return (magic.wallet as any).getProvider();
};

export const getEtherProvider = async () => {
  const provider = await getProvider();
  return provider as Web3Provider;
};
