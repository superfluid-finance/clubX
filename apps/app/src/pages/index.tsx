import { useRealtimeBalance } from "@/core/Api";
import Disconnect from "@/components/Disconnect";
import { FooterLink } from "@/components/FooterButton";
import { Header, PageContent, PageWrapper } from "@/components/Layout";
import SignIn from "@/components/SignIn";
import { Inter } from "next/font/google";
import Link from "next/link";
import QRCode from "react-qr-code";
import { styled } from "styled-components";
import { useAccount, useNetwork } from "wagmi";
import FlowingBalance from "@/components/FlowingBalance";
import Amount from "@/components/Amount";
import Configuration from "@/core/Configuration";

const { SuperfluidClubAddress } = Configuration;

const inter = Inter({ subsets: ["latin"] });

const CenteredContent = styled.div`
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 32px;
`;

export default function Home() {
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();

  const { data: realtimeBalanceData } = useRealtimeBalance(
    address,
    SuperfluidClubAddress
  );

  return (
    <PageWrapper className={inter.className}>
      <Header>{isConnected && address}</Header>

      <PageContent>
        <CenteredContent>
          {realtimeBalanceData && (
            <>
              {realtimeBalanceData.flowrate === BigInt(0) ? (
                <Amount wei={realtimeBalanceData.currentBalance} />
              ) : (
                <FlowingBalance
                  flowRate={realtimeBalanceData.flowrate}
                  startingBalance={realtimeBalanceData.currentBalance}
                  startingBalanceDate={realtimeBalanceData.date}
                />
              )}
            </>
          )}
          <div>Club SF</div>
          <p>
            To receive a stream and become immortal, please connect your wallet.
            You can use your own wallet or use custodial one via entering your
            email.
          </p>

          {address && (
            <QRCode
              size={256}
              value={address}
              viewBox={`0 0 256 256`}
              style={{ background: "white", padding: "12px" }}
            />
          )}
          <Link href="/scan">Approve Subscriptions</Link>
        </CenteredContent>
      </PageContent>

      {!isConnected ? <SignIn /> : <Disconnect />}
    </PageWrapper>
  );
}
