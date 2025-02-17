import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Zen_Kaku_Gothic_Antique,
  Zen_Antique,
} from "next/font/google";
import "./globals.css";
import { AppProvider } from "./Context/AppContext";
import LayoutContent from "./LayoutContent";

import { use } from "react";
import SessionWrapper from "@/components/SessionWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${zenKakuGothicAntique.variable} ${zenAntique.variable} antialiased`}
      >
        <SessionWrapper>
        <AppProvider>
          <LayoutContent>{children}</LayoutContent>
        </AppProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}