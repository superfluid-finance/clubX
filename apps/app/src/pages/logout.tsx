import { FooterButton } from "@/components/FooterButton";
import { useUser } from "@/contexts/UserProvider";
import { useWeb3 } from "@/contexts/Web3Context";
// import { magic } from '@/libs/magic';
// import { getEthers } from '@/libs/providers';
import React, { useState } from "react";

export const Logout = () => {
  const { setUser } = useUser();
  const { setWeb3, magic, etherProvider, web3 } = useWeb3();
  const [disabled, setDisabled] = useState(false);

  const logout = async () => {
    try {
      setDisabled(true);
      localStorage.removeItem("user");
      await magic.wallet.disconnect();
      setWeb3(etherProvider);
      setUser(null);
      console.log("Successfully disconnected");
      setDisabled(false);
    } catch (error) {
      setDisabled(false);
      console.error(error);
    }
  };

  return (
    <FooterButton onClick={logout} disabled={disabled}>
      {disabled ? "Loading..." : "Logout"}
    </FooterButton>
  );
};
