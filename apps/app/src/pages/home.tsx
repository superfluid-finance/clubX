import { FooterLink } from "@/components/FooterButton";
import { PageWrapper, PageContent } from "@/components/Page";
import { FC } from "react";
import QRCode from "react-qr-code";
import { Login } from "../components/login";
import { Logout } from "../components/logout";

const Home = () => {
  return (
    <PageWrapper>
      <PageContent>
        <div>
          <div>You have received</div>
          <div>0.005123 CLUBx</div>
          <div>0.05 / month</div>
        </div>

        <p>
          To receive a stream and become immortal, please connect your wallet.
          You can use your own wallet or use custodial one via entering your
          email.
        </p>
        <div>This view needs epic images to hype people up</div>
      </PageContent>
      <FooterLink href="scan">Scan</FooterLink>
    </PageWrapper>
  );
};

export default Home;
