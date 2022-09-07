import { useEffect, useState } from "react";
import "../styles/globals.css";
import Head from "next/head";
import NavBar from "../components/navbar/NavBar";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";

// Define Avalanche Fuji Network config
const fujiChain = {
  id: 43113,
  name: "Avalanche FUJI C-Chain",
  network: "fuji",
  nativeCurrency: {
    decimals: 18,
    name: "Fuji Avalanche",
    symbol: "AVAX",
  },
  rpcUrls: {
    default: "https://api.avax-test.network/ext/bc/C/rpc",
  },
  blockExplorers: {
    default: { name: "SnowTrace", url: "https://testnet.snowtrace.io/" },
  },
  testnet: true,
};

const { chains, provider } = configureChains(
  [fujiChain],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        return {
          http: chain.rpcUrls.default,
        };
      },
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Mementory DApp",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }) {
  // To prevent hydration errors cause by wagmi and nextjs, we track the status of the page
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  const Loading = () => {
    <div className="flex flex-row justify-center h-full w-main mx-auto px-6 mt-24 mb-12">
      Loading...
    </div>;
  };

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider modalSize="compact" chains={chains}>
        <Head>
          <meta charset="UTF-8" />
          <meta
            name="keywords"
            content="mementory, dapp, decentralized, photo, album, avalanche"
          />
          <meta name="author" content="AXP3 Studio" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </Head>
        <div className="flex flex-col min-h-screen bg-bg-1">
          <NavBar />
          {pageLoaded ? <Component {...pageProps} /> : <Loading />}
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
