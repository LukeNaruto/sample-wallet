import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { chains, client } from '@/libs/wagmi';
import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';


export default function App({ Component, pageProps }: AppProps) {
  return <>
  
    <WagmiConfig client={client}>
      <RainbowKitProvider chains={chains}>
          <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  </> 
}
