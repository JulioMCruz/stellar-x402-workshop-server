import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@x402/core", "@x402/next", "@x402/stellar"],
  async headers() {
    const origin = process.env.CLIENT_ORIGIN || "http://localhost:3001";
    return [{
      source: "/api/:path*",
      headers: [
        { key: "Access-Control-Allow-Origin", value: origin },
        { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS" },
        { key: "Access-Control-Allow-Headers", value: "Content-Type, PAYMENT-SIGNATURE" },
        { key: "Access-Control-Expose-Headers", value: "PAYMENT-REQUIRED, PAYMENT-RESPONSE" },
      ],
    }];
  },
};

export default nextConfig;
