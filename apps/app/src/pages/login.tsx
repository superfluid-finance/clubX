import { FooterButton } from "@/components/FooterButton";
import { useUser } from "@/contexts/UserProvider";
import { useWeb3 } from "@/contexts/Web3Context";
// import { magic } from '@/libs/magic';
// import { getEthers } from '@/libs/providers';
import React, { useState } from "react";

export const Login = () => {
  const { setUser } = useUser();
  const { setWeb3, magic, etherProvider, web3 } = useWeb3();
  const [disabled, setDisabled] = useState(false);

  const connect = async () => {
    try {
      setDisabled(true);
      const accounts = await magic.wallet.connectWithUI();
      console.log(accounts);
      setDisabled(false);
      // Once user is logged in, re-initialize web3 instance to use the new provider (if connected with third party wallet)
      setWeb3(web3);
      setUser(accounts[0]);
    } catch (error) {
      setDisabled(false);
      console.error(error);
    }
  };

  return <FooterButton onClick={connect} disabled={disabled} />;
};
