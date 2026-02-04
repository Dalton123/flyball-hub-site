import "@workspace/ui/globals.css";

import type { Metadata } from "next";

export const revalidate = 3600; // 1 hour
import { DM_Sans, Geist, Geist_Mono, Outfit } from "next/font/google";
import { draftMode } from "next/headers";
import Script from "next/script";
import { VisualEditing } from "next-sanity";
import { Suspense } from "react";
import { preconnect } from "react-dom";

import { FooterServer, FooterSkeleton } from "@/components/footer";
import { CombinedJsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";
import { PreviewBar } from "@/components/preview-bar";
import { Providers } from "@/components/providers";
import { getNavigationData } from "@/lib/navigation";
import { SanityLive } from "@/lib/sanity/live";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const fontDisplay = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
  display: "swap",
});

const fontHero = DM_Sans({
  subsets: ["latin"],
  variable: "--font-hero",
  weight: ["700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.flyballhub.com"),
  verification: {
    other: {
      "copyrighted-site-verification": "f1ee49580e68fe32",
      "google-adsense-account": "ca-pub-7614147681863452",
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  preconnect("https://cdn.sanity.io");
  const nav = await getNavigationData();
  return (
    <html lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning>
        {/* Ezoic Privacy/Consent Scripts - must load first */}
        <Script
          src="https://cmp.gatekeeperconsent.com/min.js"
          strategy="beforeInteractive"
          data-cfasync="false"
        />
        <Script
          src="https://the.gatekeeperconsent.com/cmp.min.js"
          strategy="beforeInteractive"
          data-cfasync="false"
        />
        {/* Ezoic Header Script */}
        <Script
          src="//www.ezojs.com/ezoic/sa.min.js"
          strategy="beforeInteractive"
        />
        <Script id="ezoic-init" strategy="beforeInteractive">
          {`
            window.ezstandalone = window.ezstandalone || {};
            ezstandalone.cmd = ezstandalone.cmd || [];
            ezstandalone.cmd.push(function() {
              ezstandalone.showAds();
            });
          `}
        </Script>
      </head>
      <body
        className={`${fontSans.variable} ${fontMono.variable} ${fontDisplay.variable} ${fontHero.variable} font-sans antialiased`}
      >
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-TJ9VYF25SX"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TJ9VYF25SX');
          `}
        </Script>
        <Script id="grow-me-init" strategy="lazyOnload">
          {`window.growMe||((window.growMe=function(e){window.growMe._.push(e);}),(window.growMe._=[]));`}
        </Script>
        <Script
          src="https://faves.grow.me/main.js"
          strategy="lazyOnload"
          data-grow-faves-site-id="U2l0ZTplMWNhOTk1NS1hMWMwLTQ5MTktYjkwZi0wZGZjMzI2YTRhOWQ="
        />
        <Providers>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:text-foreground"
          >
            Skip to main content
          </a>
          <Navbar navbarData={nav.navbarData} settingsData={nav.settingsData} />
          {children}
          <Suspense fallback={<FooterSkeleton />}>
            <FooterServer />
          </Suspense>
          <SanityLive />
          <CombinedJsonLd includeWebsite includeOrganization />
          {(await draftMode()).isEnabled && (
            <>
              <PreviewBar />
              <VisualEditing />
            </>
          )}
        </Providers>
      </body>
    </html>
  );
}
