import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {  Magic } from "magic-sdk";
import { Web3Provider } from "@ethersproject/providers";

const Web3Context = createContext<any>([]);

export const Web3ContextProvider = ({ children }: any) => {
  const [web3, setWeb3] = useState<any>();
  const [provider, setProvider] = useState<any>();

  const [magic, setMagic] = useState<any>();

  const value = useMemo(
    () => ({
      web3: web3,
      setWeb3: setWeb3,
      magic: magic,
      provider: provider
    }),
    [web3, setWeb3, magic]
  );

  useEffect(() => {
    const magic = new Magic("pk_live_1C4195ECA42E5D43", {
      network: {
        rpcUrl: "https://rpc-mumbai.maticvigil.com/",
        chainId: 80001,
      },
    });
    setMagic(magic);
    const provider = (magic.wallet as any).getProvider();
    setProvider(setProvider);
    setWeb3(provider as Web3Provider);
  }, []);

  return (
    <Web3Context.Provider value={{ ...value }}>{children}</Web3Context.Provider>
  );
};

export function useWeb3() {
  return useContext(Web3Context);
}
