import { FooterButton } from "@/components/FooterButton";
import { useConnect } from "wagmi";
import { Button } from "./Button";

const SignIn = () => {
  const { connect, connectors, isLoading, isIdle } = useConnect();

  return (
    <Button onClick={() => connect({ connector: connectors[0] })}>
      {isLoading ? "Loading..." : isIdle ? "Connect" : "Connecting..."}
    </Button>
  );
};

export default SignIn;
