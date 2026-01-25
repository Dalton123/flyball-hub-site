import Script from "next/script";

import { AdBox } from "./ad-box";

export const metadata = {
  title: "Ad Test - Flyball Hub",
  description: "This page helps verify ad delivery for Flyball Hub.",
  robots: {
    index: true,
    follow: true,
  },
};

const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-XXXXXXXXXXXXXXX";

export default function Page() {
  return (
    <>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <main className="prose prose-invert mx-auto max-w-xl py-12">
        <h1>Ad Test</h1>
        <p>This page helps verify ad delivery.</p>
        <AdBox />
      </main>
    </>
  );
}
