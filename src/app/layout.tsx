import Head from "next/head";
import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Zen_Kaku_Gothic_Antique,
  Zen_Antique,
  Noto_Sans_JP,
  Inter,
} from "next/font/google";
import "./globals.css";
import { AppProvider } from "./Context/AppContext";
import { DepositProvider } from "./Context/DepositContext";
import LayoutContent from "./LayoutContent";

import SessionWrapper from "@/components/SessionWrapper";
import RainbowKitWrapper from "@/components/RainbowKitWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const NotoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
});

const zenKakuGothicAntique = Zen_Kaku_Gothic_Antique({
  variable: "--font-zen-kaku-gothic-antique",
  weight: ["400"],
  subsets: ["latin"],
});

const zenAntique = Zen_Antique({
  variable: "--font-zen-antique",
  weight: ["400"],
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EveryX",
  description: "Trade on the Outcomes of Global Events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${zenKakuGothicAntique.variable} ${zenAntique.variable} ${NotoSansJP.variable} ${inter.variable} inter antialiased`}
      >
        <RainbowKitWrapper>
          <SessionWrapper>
            <AppProvider>
              <DepositProvider>
                <LayoutContent>{children}</LayoutContent>
              </DepositProvider>
            </AppProvider>
          </SessionWrapper>
        </RainbowKitWrapper>
      </body>
    </html>
  );
}
