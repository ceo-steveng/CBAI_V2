import Head from "next/head";
import { AppProps } from "next/app";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import { Config, DAppProvider, Mainnet } from "@usedapp/core";

import Fonts from "fonts";
import theme from "theme";
import { WalletProvider } from "../providers/WalletProvider";
import { Header } from "../modules/components/Header";

const alchemyUrl = process.env.NEXT_PUBLIC_ALCHEMY_APP;

function MyApp({ Component, pageProps }: AppProps) {
  const config: Config = {
    readOnlyChainId: Mainnet.chainId,
    readOnlyUrls: {
      [Mainnet.chainId]: alchemyUrl || "",
    },
    autoConnect: true,
  };

  return (
    <ChakraProvider resetCSS theme={theme}>
      <DAppProvider config={config}>
        <WalletProvider>
          <Head>
            <title>CAI NFT</title>
            <link rel="shortcut icon" href="/img/logo.svg" />
            <link rel="apple-touch-icon" href="/img/logo.svg" />
            <link rel="manifest" href="/manifest.json" />
            <meta name="description" content="CAI NFT" />
          </Head>

          <Fonts />

          <Flex direction={"column"}>
            <Header logo="/img/logo.svg" />
            <Component {...pageProps} />
          </Flex>
        </WalletProvider>
      </DAppProvider>
    </ChakraProvider>
  );
}

export default MyApp;
