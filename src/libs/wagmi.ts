import {
  createClient,
  configureChains,
  goerli,
  Chain
} from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { publicProvider } from 'wagmi/providers/public';
import { infuraProvider } from 'wagmi/providers/infura'



const localChain: Chain = {
  id: 1337,
  name: 'Local',
  network: 'Local',
  nativeCurrency: {
    name: 'Noah',
    symbol: 'NOAH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:7545']
    }
  }
};
const {
  chains,
  provider,
  webSocketProvider
} = configureChains(
  [process.env.NEXT_PUBLIC_ENV === 'development' ? localChain : goerli],
  [
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string,
    }),
    infuraProvider({
      apiKey: process.env.NEXT_PUBLIC_INFUR_API_KEY as string,
    }),
    publicProvider()
  ]
);

const {
  connectors
} = getDefaultWallets({
  appName: 'Noah DApp',
  chains,
});

const client = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider
});

export {
  client,
  chains
}