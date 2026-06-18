import type { Metadata, Viewport } from "next";
import { Cinzel, Inter } from "next/font/google";
import type { ReactNode } from "react";

import { AppProviders } from "@/app/providers";
import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel"
});

export const metadata: Metadata = {
  title: {
    default: "AegisLore",
    template: "%s | AegisLore"
  },
  description: "Digital health and account safety, calmly explained.",
  metadataBase: new URL("https://aegislore.example")
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F2EE" },
    { media: "(prefers-color-scheme: dark)", color: "#090B10" }
  ]
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${cinzel.variable}`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
