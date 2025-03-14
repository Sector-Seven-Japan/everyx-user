"use client";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { polygonAmoy, bscTestnet } from "wagmi/chains";
import {
  phantomWallet,
  metaMaskWallet,
  walletConnectWallet,
  coinbaseWallet
} from '@rainbow-me/rainbowkit/wallets';

const queryClient = new QueryClient();

const wallets = [
  {
    groupName: 'Recommended',
    wallets: [
      phantomWallet,
      metaMaskWallet,
      walletConnectWallet,
      coinbaseWallet
    ],
  },
];

const config = getDefaultConfig({
  appName: "Everyx",
  projectId: "ecd3b47bbfb460ff7694adef865be002",
  wallets,
  chains: [polygonAmoy, bscTestnet],
});

// Custom dark theme (optional)
const customDarkTheme = darkTheme({
  accentColor: "#1a1a1a", // Dark gray accent
  accentColorForeground: "#ffffff", // White text
  borderRadius: "medium",
  fontStack: "system",
});

export default function RainbowKitWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={customDarkTheme}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}