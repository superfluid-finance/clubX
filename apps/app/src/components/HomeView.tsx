import { useGetProtege, useIsProtege, useRealtimeBalance } from "@/core/Api";
import Configuration from "@/core/Configuration";
import { UnitOfTime } from "@/utils/NumberUtils";
import { shortenHex } from "@/utils/StringUtils";
import { fromUnixTime } from "date-fns";
import { FC, useCallback } from "react";
import styled from "styled-components";
import { useAccount, useDisconnect, useQueryClient } from "wagmi";
import AccountCard from "./AccountCard";
import Amount from "./Amount";
import { LinkButton } from "./Button";
import Flex from "./Flex";
import FlowingBalance from "./FlowingBalance";
import { SnapScrollContent, SnapScrollWrapper } from "./SnapScroll";
import { Caption, CaptionStyle, H2 } from "./Typography";

const WhiteBox = styled(Flex)`
  position: relative;
  display: inline-flex;
  border-radius: 8px;
  border: 1.5px solid #e9ebef;
  padding: 10px 24px;
  font-weight: 700;
  ${CaptionStyle}

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: -15px;
    width: 2px;
    height: 15px;
    background: linear-gradient(180deg, #06062b, #b5b5ff);
  }

  &::before {
    left: 20%;
  }

  &::after {
    right: 20%;
  }
`;

const GreenBoxWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  width: 100vw;
`;

const GreenBoxLines = styled.div`
  position: relative;
  width: 100%;

  &::before,
  &::after {
    content: "";
    position: absolute;
    right: 0;
    height: 2px;
    width: 100%;
    background: linear-gradient(270deg, #06062b, #b5b5ff);
    z-index: 1;
  }

  &::before {
    top: 20%;
  }

  &::after {
    bottom: 20%;
  }
`;

const GreenBox = styled(Flex)`
  position: relative;
  padding: 24px 36px;
  text-align: center;
  text-shadow: 0 0 10px #1db227;

  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow:
    0 0 4px 2px #1db227,
    inset 0 0 4px 2px #1db227;
  z-index: 2;
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

const StatsBox = styled.div`
  position: relative;
  padding: 20px 24px;
  align-self: center;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &::before {
    content: "";
    z-index: 1;
    position: absolute;
    inset: 0;
    border-radius: 8px;
    padding: 2px; /* control the border thickness */
    background: linear-gradient(0deg, #b5b5ff, #0e0e4b);
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
`;

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
            <GreenBox gap="8px" align="center">
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
            </GreenBox>
            <GreenBoxLines />
          </GreenBoxWrapper>
          <WhiteBox direction="row" align="center" gap="4px">
            {realtimeBalanceData && (
              <Amount
                wei={realtimeBalanceData.flowrate * BigInt(UnitOfTime.Month)}
              >
                {` CLUBx`}
              </Amount>
            )}
            <span style={{ fontWeight: 400 }}>/month</span>
          </WhiteBox>
        </Flex>

        {protegeData && (
          <>
            <StatsBox>
              <Caption>
                Members you invited: {protegeData.directTotalProtegeCount}
              </Caption>
              {/* <Caption>Level: {protegeData.level}</Caption> */}
            </StatsBox>
            {protegeData.level < 5 ? (
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
