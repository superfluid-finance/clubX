import { useGetProtege, useRealtimeBalance } from "@/core/Api";
import Configuration from "@/core/Configuration";
import { UnitOfTime } from "@/utils/NumberUtils";
import { shortenHex } from "@/utils/StringUtils";
import { fromUnixTime } from "date-fns";
import { FC, useCallback } from "react";
import styled from "styled-components";
import { useAccount, useDisconnect } from "wagmi";
import AccountCard from "./AccountCard";
import Amount from "./Amount";
import { GlowingBox, GradientBorderBox, HangingBox } from "./Boxes";
import { LinkButton } from "./Button";
import Flex from "./Flex";
import FlowingBalance from "./FlowingBalance";
import { HorizontalLines } from "./Lines";
import { SnapScrollContent, SnapScrollWrapper } from "./SnapScroll";
import { Caption, H2 } from "./Typography";

const GreenBoxWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  width: 100vw;
`;

const ProtegeSection = styled(SnapScrollContent)`
  display: flex;
  flex-direction: column;
  padding-top: 23dvh;
  padding-bottom: 32px;
  justify-content: space-between;
  background-image: url("/assets/bg4.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

const StatsBox = styled(GradientBorderBox)`
  padding: 20px 24px;
  align-self: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MAX_PROTEGE_LEVEL = 4;

const { SuperfluidClubAddress } = Configuration;

interface HomeViewProps {}

const HomeView: FC<HomeViewProps> = ({}) => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const onDisconnect = useCallback(() => {
    disconnect();
  }, [disconnect]);

  const { data: protegeData } = useGetProtege(address);
  const { data: realtimeBalanceData } = useRealtimeBalance(
    address,
    SuperfluidClubAddress
  );

  return (
    <SnapScrollWrapper>
      <AccountCard onClick={onDisconnect}>
        {shortenHex(address || "")}
      </AccountCard>

      <ProtegeSection>
        <Flex align="center" gap="15px">
          <GreenBoxWrapper>
            <div />
            <GlowingBox $color="#1db227" gap="8px" align="center">
              <div style={{ fontSize: "12px", fontWeight: 500 }}>
                YOU HAVE RECEIVED
              </div>
              <Flex direction="row" align="end" gap="8px" justify="center">
                <H2 style={{ fontVariantNumeric: "tabular-nums" }}>
                  {realtimeBalanceData && (
                    <>
                      {realtimeBalanceData.flowrate === BigInt(0) ? (
                        <Amount wei={realtimeBalanceData.currentBalance} />
                      ) : (
                        <FlowingBalance
                          flowRate={realtimeBalanceData.flowrate}
                          startingBalance={realtimeBalanceData.currentBalance}
                          startingBalanceDate={fromUnixTime(
                            realtimeBalanceData.timestamp
                          )}
                        />
                      )}
                    </>
                  )}
                </H2>
                <b style={{ paddingBottom: "2px" }}>CLUBx</b>
              </Flex>
            </GlowingBox>
            <HorizontalLines $reverse />
          </GreenBoxWrapper>
          <HangingBox direction="row" align="center" gap="4px">
            {realtimeBalanceData && (
              <b>
                <Amount
                  wei={realtimeBalanceData.flowrate * BigInt(UnitOfTime.Month)}
                >
                  {` CLUBx`}
                </Amount>
              </b>
            )}
            <span>/month</span>
          </HangingBox>
        </Flex>

        {protegeData && (
          <>
            <StatsBox>
              <Caption>
                Members you invited: {protegeData.directTotalProtegeCount}
              </Caption>
            </StatsBox>
            {protegeData.level < MAX_PROTEGE_LEVEL ? (
              <LinkButton href="/scan">Scan</LinkButton>
            ) : (
              <div />
            )}
          </>
        )}
      </ProtegeSection>
    </SnapScrollWrapper>
  );
};

export default HomeView;
