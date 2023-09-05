import { Footer, Header, PageContent, PageWrapper } from "@/components/Layout";
import { useUser } from "@/contexts/UserProvider";
import { Inter } from "next/font/google";
import Link from "next/link";
import QRCode from "react-qr-code";
import styled from "styled-components";
import { Login } from "../components/login";
import { Logout } from "../components/logout";

const inter = Inter({ subsets: ["latin"] });

const CenteredContent = styled.div`
  padding: 32px 24px;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  gap: 32px;
`;

export default function Home() {
  const { user } = useUser();
  return (
    <PageWrapper className={inter.className}>
      <Header>{user}</Header>
      <PageContent>
        <CenteredContent>
          <div>Club SF</div>

          <p>
            To receive a stream and become immortal, please connect your wallet.
            You can use your own wallet or use custodial one via entering your
            email.
          </p>

          {user && (
            <QRCode size={256} value={user || ""} viewBox={`0 0 256 256`} />
          )}

          <Link href="/scan">Approve Subscriptions</Link>
        </CenteredContent>
      </PageContent>

      <Footer>{user ? <Logout /> : <Login />}</Footer>
    </PageWrapper>
  );
}
