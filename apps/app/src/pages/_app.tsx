import "@/styles/globals.css";
import { Web3Provider } from "@ethersproject/providers";
import { MagicConnectConnector } from "@magiclabs/wagmi-connector";
import type { AppProps } from "next/app";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygon],
  [publicProvider()]
);

const magicConnector = new MagicConnectConnector({
  chains,
  options: {
    apiKey: "pk_live_1C4195ECA42E5D43",
    networks: [
      {
        chainId: polygon.id,
        rpcUrl: "https://polygon-rpc.com",
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
  publicClient,
  webSocketPublicClient,
  connectors: [magicConnector],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <Component {...pageProps} />
    </WagmiConfig>
  );
}
