import { useWeb3Modal } from "@web3modal/wagmi/react";
import {
  ButtonHTMLAttributes,
  FC,
  PropsWithChildren,
  useCallback,
} from "react";
import { Chain } from "viem";
import { Button } from "./Button";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";

interface ConnectionGateBtnProps
  extends PropsWithChildren,
    ButtonHTMLAttributes<HTMLButtonElement> {
  expectedNetwork?: Chain;
  className?: string;
}

const ConnectionGateBtn: FC<ConnectionGateBtnProps> = ({
  expectedNetwork,
  children,
  ...ButtonProps
}) => {
  const { open } = useWeb3Modal();
  const { isLoading, switchNetwork } = useSwitchNetwork();

  const { address } = useAccount();
  const { chain } = useNetwork();

  const onConnectWallet = () => {
    open();
  };

  const onSwitchNetwork = useCallback(() => {
    switchNetwork && expectedNetwork && switchNetwork(expectedNetwork.id);
  }, [switchNetwork, expectedNetwork]);

  if (!address) {
    return (
      <Button {...ButtonProps} onClick={onConnectWallet}>
        Connect Wallet
      </Button>
    );
  }

  if (expectedNetwork && chain?.id !== expectedNetwork.id) {
    return (
      <Button {...ButtonProps} onClick={onSwitchNetwork}>
        {isLoading ? "Switching Network..." : "Switch Network"}
      </Button>
    );
  }

  return children;
};

export default ConnectionGateBtn;
