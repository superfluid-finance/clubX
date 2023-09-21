import { useWeb3Modal } from "@web3modal/react";
import { Button } from "./Button";

const SignIn = () => {
  const { open } = useWeb3Modal();

  return <Button onClick={open}>Join</Button>;
};

export default SignIn;
