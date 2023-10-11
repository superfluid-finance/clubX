import { useIsProtege } from "@/core/Api";
import { shortenHex } from "@/utils/StringUtils";
import { FC, useCallback, useEffect } from "react";
import QRCode from "react-qr-code";
import styled from "styled-components";
import { useAccount, useDisconnect } from "wagmi";
import AccountCard from "./AccountCard";
import Flex from "./Flex";
import { SnapScrollContent, SnapScrollWrapper } from "./SnapScroll";
import { H1 } from "./Typography";
import { PageWrapper } from "./Layout";

const ConnectedSection = styled(SnapScrollContent)`
  display: flex;
  flex-direction: column;
  padding-top: 23dvh;
  padding-bottom: 10dvh;
  justify-content: space-between;
  background-image: url("/assets/bg4.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

interface LockScreenProps {}

const LockScreen: FC<LockScreenProps> = ({}) => {
  const { address } = useAccount();
  const { refetch: refetchIsProtege } = useIsProtege(address);
  const { disconnect } = useDisconnect();

  const onDisconnect = useCallback(() => {
    disconnect();
  }, [disconnect]);

  useEffect(() => {
    let refetchInterval = setInterval(() => {
      refetchIsProtege();
    }, 3000);

    return () => {
      refetchInterval && clearInterval(refetchInterval);
    };
  }, [address]);

  return (
    <PageWrapper>
      <AccountCard onClick={onDisconnect}>
        {shortenHex(address || "")}
      </AccountCard>
      <ConnectedSection>
        <Flex gap="8px" align="center">
          <H1>Join CLUBx</H1>
          <p style={{ maxWidth: "300px" }}>
            Find CLUBx member who can scan your invitation to enter the club.
          </p>
          <QRCode
            value={address || ""}
            viewBox={`0 0 256 256`}
            bgColor="transparent"
            style={{
              background: "white",
              padding: "8px",
              borderRadius: "8px",
              overflow: "hidden",
              marginTop: "24px",
              width: "80%",
              maxWidth: "360px",
              height: "auto",
            }}
          />
        </Flex>
      </ConnectedSection>
    </PageWrapper>
  );
};

export default LockScreen;
