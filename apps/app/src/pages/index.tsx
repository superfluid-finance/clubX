import HomeView from "@/components/HomeView";
import IntroScreens from "@/components/IntroScreens";
import LockScreen from "@/components/LockScreen";
import { useIsProtege } from "@/core/Api";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

const Intro = () => {
  const { address } = useAccount();
  const { data: isProtege } = useIsProtege(address);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  if (isMounted) {
    if (isProtege === true) return <HomeView />;
    if (isProtege === false) return <LockScreen />;
  }

  return <IntroScreens />;
};

export default Intro;
