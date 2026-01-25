"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-XXXXXXXXXXXXXXX";
const ADSENSE_SLOT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID || "YOUR_SLOT_ID";

export function AdBox() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block", minHeight: 280 }}
      data-ad-client={ADSENSE_CLIENT_ID}
      data-ad-slot={ADSENSE_SLOT_ID}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
