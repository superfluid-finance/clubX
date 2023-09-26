import Configuration from "@/core/Configuration";
import "@/styles/globals.css";
import { MagicAuthConnector } from "@magiclabs/wagmi-connector";
import { walletConnectProvider } from "@web3modal/wagmi";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import type { AppProps } from "next/app";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

const { WalletConnectID, network, MagicLinkKey } = Configuration;

const SupportedNetworks = [network];

export const { publicClient } = configureChains(SupportedNetworks, [
  walletConnectProvider({ projectId: WalletConnectID }),
]);

const magicConnector = new MagicAuthConnector({
  options: {
    isDarkMode: true,
    apiKey: MagicLinkKey,
  },
});

// @ts-ignore
magicConnector.name = "Email login";

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    magicConnector,
    new WalletConnectConnector({
      options: { projectId: WalletConnectID, showQrModal: false },
    }),
    new InjectedConnector({ options: { shimDisconnect: true } }),
    new CoinbaseWalletConnector({ options: { appName: "Web3Modal" } }),
  ],
  publicClient,
});

createWeb3Modal({
  wagmiConfig,
  projectId: WalletConnectID,
  chains: SupportedNetworks,
  defaultChain: network,
  featuredWalletIds: [],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <Component {...pageProps} />
    </WagmiConfig>
  );
}
