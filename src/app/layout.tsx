import { PHProvider } from "@/components/providers/posthog-provider";
import { SiteFooter } from "@/components/layout/site-footer";
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
  metadataBase: new URL("https://aegislore.example"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }
    ],
    apple: "/apple-touch-icon.png"
  },
  manifest: "/site.webmanifest"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
  themeColor: "#211A1C"
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${cinzel.variable}`}>
        <AppProviders>
          <PHProvider>
            {children}
          </PHProvider>
        </AppProviders>

        <SiteFooter />
      </body>
    </html>
  );
}
