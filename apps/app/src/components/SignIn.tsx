import { FooterButton } from "@/components/FooterButton";
import { useConnect } from "wagmi";
import { Button } from "./Button";
import { useWeb3Modal } from "@web3modal/react";

const SignIn = () => {
  const { open } = useWeb3Modal();

  return <Button onClick={open}>Connect</Button>;
};

export default SignIn;
