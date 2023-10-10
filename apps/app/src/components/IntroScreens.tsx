import { useState } from "react";
import { SnapScrollWrapper } from "./SnapScroll";
import HeroSection from "./landing/HeroSection";
import JoinSection from "./landing/JoinSection";
import PoweredBySection from "./landing/PoweredBySection";
import TokensSection from "./landing/TokensSection";
import ValuePropSection from "./landing/ValuePropSection";
import { PageWrapper } from "./Layout";

const IntroScreens = () => {
  const [scrollWrapper, setScrollWrapper] = useState<HTMLDivElement | null>(
    null
  );

  return (
    <PageWrapper>
      <SnapScrollWrapper ref={(newRef) => setScrollWrapper(newRef)}>
        <HeroSection scrollWrapper={scrollWrapper} />
        <PoweredBySection />
        <TokensSection />
        <ValuePropSection />
        <JoinSection />
      </SnapScrollWrapper>
    </PageWrapper>
  );
};

export default IntroScreens;
