import Configuration from "@/core/Configuration";
import { createContext, FC, ReactNode, useContext, useEffect, useMemo } from "react";
import { Chain, useAccount, useNetwork, useSwitchNetwork } from "wagmi";

export interface ConnectionBoundaryContextValue {
  isConnecting: boolean;
  isConnected: boolean;
  isCorrectNetwork: boolean;
  switchNetwork: (() => void) | undefined;
  expectedNetwork:  Chain;
}

const ConnectionBoundaryContext = createContext<ConnectionBoundaryContextValue>(
  null!
);

export const useConnectionBoundary = () =>
  useContext(ConnectionBoundaryContext);

type FunctionChildType = (arg: ConnectionBoundaryContextValue) => ReactNode;

interface ConnectionBoundaryProps {
  children: ReactNode | FunctionChildType;
  expectedNetwork?: Chain | null;
}

const ConnectionBoundary: FC<ConnectionBoundaryProps> = ({
  children,
  ...props
}) => {
  const { chain: activeChain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { isConnecting, isConnected } = useAccount();
  const { network } = Configuration;
  const expectedNetwork = props.expectedNetwork ?? network;

  const isCorrectNetwork = useMemo(() => {

    if (props.expectedNetwork) {
      return props.expectedNetwork.id === activeChain?.id;
    }

    return network.id === activeChain?.id;
  }, [props.expectedNetwork, network, activeChain]);

  const contextValue = useMemo<ConnectionBoundaryContextValue>(
    () => ({
      isConnected,
      isConnecting: isConnecting,
      isCorrectNetwork: isCorrectNetwork,
      switchNetwork: switchNetwork
        ? () => {
            switchNetwork(expectedNetwork.id);
          }
        : undefined,
      expectedNetwork,
    }),
    [
      isCorrectNetwork,
      isConnected,
      isConnecting,
      switchNetwork,
      expectedNetwork,
      activeChain,
    ]
  );

  return (
    <ConnectionBoundaryContext.Provider value={contextValue}>
      {typeof children === "function" ? children(contextValue) : children}
    </ConnectionBoundaryContext.Provider>
  );
};

export default ConnectionBoundary;