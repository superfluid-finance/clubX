import { useState } from "react";
import { SnapScrollWrapper } from "./SnapScroll";
import HeroSection from "./landing/HeroSection";
import JoinSection from "./landing/JoinSection";
import PoweredBySection from "./landing/PoweredBySection";
import TokensSection from "./landing/TokensSection";
import ValuePropSection from "./landing/ValuePropSection";

const IntroScreens = () => {
  const [scrollWrapper, setScrollWrapper] = useState<HTMLDivElement | null>(
    null
  );

  return (
    <SnapScrollWrapper ref={(newRef) => setScrollWrapper(newRef)}>
      <HeroSection scrollWrapper={scrollWrapper} />
      <PoweredBySection />
      <TokensSection />
      <ValuePropSection />
      <JoinSection />
    </SnapScrollWrapper>
  );
};

export default IntroScreens;
