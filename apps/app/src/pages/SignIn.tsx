import { FooterButton } from "@/components/FooterButton";
import { useConnect } from "wagmi";

const SignIn = () => {
  const { connect, connectors, isLoading, isIdle } = useConnect();

  return (
    <FooterButton
      className="sign-in-button primary-button"
      onClick={() => connect({ connector: connectors[0] })}
    >
      {isLoading ? "Loading..." : isIdle ? "Connect" : "Connecting..."}
    </FooterButton>
  );
};

export default SignIn;
