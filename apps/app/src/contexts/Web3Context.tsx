import { getEtherProvider } from '@/libs/providers';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const Web3Context = createContext<any>([]);

export const Web3ContextProvider = ({ children }: any) => {
  const [etherProvider, setEtherProvider] = useState<any>();

  const value = useMemo(
    () => ({
      etherProvider: etherProvider,
      setEtherProvider: setEtherProvider,
    }),
    [etherProvider, setEtherProvider],
  );

  useEffect(() => {
    getEtherProvider().then(setEtherProvider);
  }, []);

  return <Web3Context.Provider value={{ ...value }}>{children}</Web3Context.Provider>;
};

export function useEtherProvider() {
  return useContext(Web3Context);
}
