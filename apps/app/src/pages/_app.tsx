import Configuration from "@/core/Configuration";
import "@/styles/globals.css";
import { MagicConnectConnector } from "@magiclabs/wagmi-connector";
import type { AppProps } from "next/app";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
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

const magicConnector = new MagicConnectConnector({
  chains: wagmiChains,
  options: {
    apiKey: "pk_live_1C4195ECA42E5D43",
    networks: [
      {
        chainId: network.id,
        rpcUrl: rpcUrl,
      },
    ],
  },
});

MagicConnectConnector.prototype.getProvider = () => {
  const magic = magicConnector.getMagicSDK();
  if (!magic) {
    throw new Error("Magic not ininitialized properly");
  }

  return magic.wallet.getProvider();
};

const config = createConfig({
  autoConnect: false,
  publicClient: (config) =>
    (config.chainId ? resolvedPublicClients[config.chainId] : null) ??
    createPublicClient(config),
  connectors: [magicConnector],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <Component {...pageProps} />
    </WagmiConfig>
  );
}
