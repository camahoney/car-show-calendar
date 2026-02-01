import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://car-show-calendar.vercel.app"),
  title: {
    default: "Car Show Calendar | Premier Automotive Events",
    template: "%s | Car Show Calendar"
  },
  description: "The ultimate guide to car shows, meets, and automotive events. Find local car shows, register your vehicle, and join the community.",
  keywords: ["Car Shows", "Auto Events", "Car Meets", "Classic Cars", "Car Show Calendar", "Automotive Events", "Car Culture"],
  authors: [{ name: "Car Show Calendar Team" }],
  creator: "Car Show Calendar",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Car Show Calendar | Premier Automotive Events",
    description: "Discover the best car shows, meets, and automotive events near you.",
    siteName: "Car Show Calendar",
    images: [
      {
        url: "/logo-wide.png", // Fallback OG Image
        width: 1200,
        height: 630,
        alt: "Car Show Calendar"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Car Show Calendar | Premier Automotive Events",
    description: "Discover the best car shows, meets, and automotive events near you.",
    images: ["/logo-wide.png"],
    creator: "@carshowcalendar"
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          geistSans.variable,
          geistMono.variable,
          outfit.variable
        )}
      >
        <Providers>
          <SiteHeader />
          <main className="pt-24 min-h-[calc(100vh-theme(spacing.24))]">
            {children}
          </main>
          <SiteFooter />
          <Toaster position="top-center" richColors theme="dark" />
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
