import { FooterButton, FooterLink } from "@/components/FooterButton";
import { PageContent, PageWrapper } from "@/components/Page";
import { Inter } from "next/font/google";
import Head from "next/head";
import QRCode from "react-qr-code";
import { Login } from "./login";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageWrapper className={inter.className}>
        <PageContent>
          <div>Club SF</div>
          <p>
            To receive a stream and become immortal, please connect your wallet.
            You can use your own wallet or use custodial one via entering your
            email.
          </p>
          <div>This view needs epic images to hype people up</div>
          <QRCode
            size={256}
            value={"https://superfluid.finance"}
            viewBox={`0 0 256 256`}
          />
        </PageContent>
        <FooterLink href="scan">Scan</FooterLink>
        <Login />
      </PageWrapper>
    </>
  );
}
