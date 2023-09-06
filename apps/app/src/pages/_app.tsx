import { UserProvider } from "@/contexts/UserProvider";
import { Web3ContextProvider } from "@/contexts/Web3Context";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Web3ContextProvider>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </Web3ContextProvider>
  );
}
