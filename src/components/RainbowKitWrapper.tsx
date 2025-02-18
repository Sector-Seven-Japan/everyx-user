"use client";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";

const queryClient = new QueryClient(); // ✅ Fix undefined QueryClient error

const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "ecd3b47bbfb460ff7694adef865be002",
  chains: [mainnet, polygon, optimism, arbitrum, base],
});


export default function RainbowKitWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
