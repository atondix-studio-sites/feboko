import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@feboko/database", "@feboko/shared"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "feboko.com" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
};

export default nextConfig;
