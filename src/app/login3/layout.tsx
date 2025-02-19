"use client";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // ✅ Add missing QueryClient import

const queryClient = new QueryClient(); // ✅ Fix undefined QueryClient error

const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "Include your project Id here after generating it from the walletConnect Cloud",
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true,
});

export default function LoginLayout({
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
