import "@/styles/globals.css";
import { MagicConnectConnector } from "@magiclabs/wagmi-connector";
import type { AppProps } from "next/app";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygon, polygonMumbai],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: false,
  publicClient,
  webSocketPublicClient,
  connectors: [

    new MagicConnectConnector({
      chains,
      options: {
        apiKey: "pk_live_1C4195ECA42E5D43",
      }
    }),
  ]
});

export default function App({ Component, pageProps }: AppProps) {
  return <WagmiConfig config={config} >
           <Component {...pageProps} />
     </WagmiConfig>
}
