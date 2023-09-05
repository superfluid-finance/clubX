// 1. Import the DynamicWagmiConnector

import { MagicAuthConnector } from "@magiclabs/wagmi-connector";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import Dashboard from "./components/dashboard";
import {  polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";


const { chains, publicClient, webSocketPublicClient } = configureChains(
    [polygonMumbai],
    [publicProvider()]
  );
  
  const config = createConfig({
    
    autoConnect: false,
    publicClient,
    webSocketPublicClient,
    connectors: [
      new MagicAuthConnector({
        chains,
        options: {

          apiKey: "pk_live_3247E1E1BB785715",
          oauthOptions: {
            providers: ["google"],
          },
          enableEmailLogin: true, 
          magicSdkConfiguration: {
            network: {
              rpcUrl: "https://polygon-mumbai.rpc.x.superfluid.dev",
              chainId: 80001,
            },
          },
        }
      })
    ]
  });



export default function Page() {
return (
    <WagmiConfig config={config}>
    <Dashboard />
  </WagmiConfig>
  );;
}