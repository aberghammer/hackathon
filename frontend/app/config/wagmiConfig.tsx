"use client"
import { getDefaultProvider } from 'ethers';
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { createPublicClient, http } from 'viem'
import { mainnet, sepolia, goerli, polygonMumbai, polygon } from 'wagmi/chains'
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';
import { connectorsForWallets, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

console.log(process.env.INFURA_KEY)

const { chains, publicClient, webSocketPublicClient } = configureChains(
    [sepolia, polygonMumbai, mainnet],

    [
        infuraProvider({
            apiKey: process.env.NEXT_PUBLIC_INFURA_KEY != undefined ? process.env.NEXT_PUBLIC_INFURA_KEY : "NO KEY",
        }),
        publicProvider(),
    ],
)



export const rainbowChains = chains;

console.log(process.env.WALLET_CONNECT_API)


const { wallets } = getDefaultWallets({
    appName: "Youtube Demo",
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_API != undefined ? process.env.NEXT_PUBLIC_WALLET_CONNECT_API : "NO KEY",
    chains,
});
const connectors = connectorsForWallets([...wallets]);



const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    webSocketPublicClient,
    publicClient
})



export default function Wagmi({ children,
}: {
    children: React.ReactNode
}) {
    return (<WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider coolMode chains={chains}>{children}
        </RainbowKitProvider>
    </WagmiConfig >
    );
}



