"use client";

import Script from "next/script";

/** Studio analytics, forms, and published content hydrate (docs/customer-site-content.md). */
export function StudioSdk() {
  const token = process.env.NEXT_PUBLIC_STUDIO_SITE_TOKEN;
  return (
    <Script
      src="https://studio.atondix.de/sdk/atondix.js"
      data-site-token={token || undefined}
      data-consent={token ? "pending" : undefined}
      data-content={token ? "true" : undefined}
      strategy="afterInteractive"
    />
  );
}
