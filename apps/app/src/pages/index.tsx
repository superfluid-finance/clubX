import HomeView from "@/components/HomeView";
import IntroScreens from "@/components/IntroScreens";
import LockScreen from "@/components/LockScreen";
import { useIsProtege } from "@/core/Api";
import { useAccount } from "wagmi";

const Intro = () => {
  const { address } = useAccount();
  const { data, isLoading } = useIsProtege(address);

  if (data === true) {
    return <HomeView />;
  }

  if (address) {
    return <LockScreen />;
  }

  return <IntroScreens />;
};

export default Intro;
