import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@feboko/database", "@feboko/shared"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "feboko.com" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "studio.atondix.de" },
    ],
  },
};

export default nextConfig;
