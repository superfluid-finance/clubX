import ConnectionBoundary from "@/context/ConnectionBoundary";
import Web3AuthConnectorInstance from "@/context/_Web3AuthConnectorInstance";
import Configuration from "@/core/Configuration";
import "@/styles/globals.css";
// import { MagicConnectConnector } from "@magiclabs/wagmi-connector";
import type { AppProps } from "next/app";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const { rpcUrl, network } = Configuration;

export const { chains: wagmiChains, publicClient: createPublicClient } =
  configureChains(
    [
      {
        ...network,
        rpcUrls: {
          ...network.rpcUrls,
          default: {
            http: [rpcUrl],
          },
          public: {
            http: [rpcUrl],
          },
        },
      },
    ],
    [
      jsonRpcProvider({
        rpc: (chain) => ({
          http: rpcUrl,
        }),
      }),
    ],
    {
      batch: {
        // NOTE: It is very important to enable the multicall support, otherwise token balance queries will run into rate limits.
        multicall: {
          wait: 100,
        },
      },
    }
  );

// Note: We need to create the public clients and re-use them to have the automatic multicall batching work.
export const resolvedPublicClients = wagmiChains.reduce(
  (acc, current) => {
    acc[current.id] = createPublicClient({ chainId: current.id });
    return acc;
  },
  {} as Record<number, ReturnType<typeof createPublicClient>>
);


// const magicConnector = new MagicConnectConnector({
//   chains: wagmiChains,
//   options: {
//     apiKey: "pk_live_1C4195ECA42E5D43",
//     magicSdkConfiguration:{
//       network:{
//         chainId: network.id,
//         rpcUrl: rpcUrl,
//       }
//     },
//     networks: [
//       {
//         chainId: network.id,
//         rpcUrl: rpcUrl,
//       },
//     ],
//   },
// });

// MagicConnectConnector.prototype.getProvider = () => {
//   const magic = magicConnector.getMagicSDK();
//   if (!magic) {
//     throw new Error("Magic not ininitialized properly");
//   }

//   return magic.wallet.getProvider();
// };

const config = createConfig({
  autoConnect: false,
  publicClient: (config) =>
    (config.chainId ? resolvedPublicClients[config.chainId] : null) ??
    createPublicClient(config),
  connectors: [
    // new WalletConnectConnector({
    //   chains:wagmiChains,
    //   options: {
    //     projectId: "3314f39613059cb687432d249f1658d2",
    //     showQrModal: true,
    //   },
    // }),
    // new InjectedConnector({
    //   chains:wagmiChains,
    //   options: {
    //     name: "Injected",
    //     shimDisconnect: true,
    //   },
    // }),
    Web3AuthConnectorInstance(wagmiChains) as any,
  ],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <ConnectionBoundary expectedNetwork={network} >
      <Component {...pageProps} />
      </ConnectionBoundary>
    </WagmiConfig>
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