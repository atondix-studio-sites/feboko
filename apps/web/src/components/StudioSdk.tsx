"use client";

import Script from "next/script";

/** Studio analytics, forms, and published content hydrate (docs/customer-site-content.md). */
export function StudioSdk() {
  const token = process.env.NEXT_PUBLIC_STUDIO_SITE_TOKEN;
  if (!token) return null;
  return (
    <Script
      src="https://studio.atondix.de/sdk/atondix.js"
      data-site-token={token}
      data-consent="pending"
      data-content="true"
      strategy="afterInteractive"
    />
  );
}
