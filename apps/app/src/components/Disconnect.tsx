import { FooterButton } from "@/components/FooterButton";
import { useDisconnect } from "wagmi";

const Disconnect = () => {
  const { disconnect, isLoading, isIdle } = useDisconnect();

  return (
    <FooterButton
      className="sign-in-button primary-button"
      onClick={() => disconnect()}
    >
      {isLoading ? "Loading..." : isIdle ? "Disconnect" : "Disconnecting..."}
    </FooterButton>
  );
};

export default Disconnect;
