import ConnectionBoundary from "@/context/ConnectionBoundary";
import Web3AuthConnectorInstance from "@/context/_Web3AuthConnectorInstance";
import Configuration from "@/core/Configuration";
import "@/styles/globals.css";
// import { MagicConnectConnector } from "@magiclabs/wagmi-connector";
import type { AppProps } from "next/app";
import { polygonMumbai } from "viem/chains";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import {
  w3mProvider,
  w3mConnectors,
  EthereumClient,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";

const { rpcUrl, network, WalletConnectID } = Configuration;

const SupportedNetworks = [polygonMumbai];

// // TODO: If automatically signing fails then fall back to manual signing
export const { publicClient } = configureChains(SupportedNetworks, [
  w3mProvider({ projectId: WalletConnectID }),
]);

const wagmiConfig = createConfig({
  autoConnect: false,
  connectors: w3mConnectors({
    projectId: WalletConnectID,
    chains: SupportedNetworks,
  }),
  publicClient,
});

const ethereumClient = new EthereumClient(wagmiConfig, SupportedNetworks);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <ConnectionBoundary expectedNetwork={network}>
          <Component {...pageProps} />
        </ConnectionBoundary>
      </WagmiConfig>
      <Web3Modal projectId={WalletConnectID} ethereumClient={ethereumClient} />
    </>
  );
}

// import Configuration from "@/core/Configuration";
// import "@/styles/globals.css";
// import { MagicConnectConnector } from "@magiclabs/wagmi-connector";
// import {
//   w3mProvider,
//   w3mConnectors,
//   EthereumClient,
// } from "@web3modal/ethereum";
// import { Web3Modal } from "@web3modal/react";
// import type { AppProps } from "next/app";
// import config from "next/config";
// import { polygonMumbai } from "viem/chains";
// import { WagmiConfig, configureChains, createConfig } from "wagmi";
// import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

// const { rpcUrl, network, WalletConnectID } = Configuration;

// const SupportedNetworks = [polygonMumbai];

// // TODO: If automatically signing fails then fall back to manual signing
// export const { publicClient } = configureChains(SupportedNetworks, [
//   w3mProvider({ projectId: WalletConnectID }),
// ]);

// const wagmiConfig = createConfig({
//   autoConnect: false,
//   connectors: w3mConnectors({
//     projectId: WalletConnectID,
//     chains: SupportedNetworks,
//   }),
//   publicClient,
// });

// const ethereumClient = new EthereumClient(wagmiConfig, SupportedNetworks);

// export default function App({ Component, pageProps }: AppProps) {
//   return (
//     <>
//       <WagmiConfig config={wagmiConfig}>
//         <Component {...pageProps} />
//       </WagmiConfig>
//       <Web3Modal projectId={WalletConnectID} ethereumClient={ethereumClient} />
//     </>
//   );
// }
