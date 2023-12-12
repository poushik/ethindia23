import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { WagmiConfig, createClient } from 'wagmi'
import { ConnectKitProvider, getDefaultClient } from "connectkit"
import { mainnet, polygon, polygonMumbai, optimism, arbitrum } from "wagmi/chains"

import { useHuddle01 } from "@huddle01/react"
import { useEffect } from 'react'

const chains = [mainnet, polygon, polygonMumbai, optimism, arbitrum];

const client = createClient(
  getDefaultClient({
  autoConnect: true,
  appName: "connectWithOne",
  chains,
 })
)

export default function App({ Component, pageProps }: AppProps) {
  const { initialize } = useHuddle01();

  useEffect(() => {
    initialize('KL1r3E1yHfcrRbXsT4mcE-3mK60Yc3YR');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WagmiConfig client={client}>
        <ConnectKitProvider>
            <Component {...pageProps} />
        </ConnectKitProvider>
    </WagmiConfig>
  )
}
