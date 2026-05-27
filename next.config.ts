import type { NextConfig } from "next";

const backendUrl =
  process.env.NEXT_PUBLIC_GBSW_GG_BACKEND_URL ?? "http://43.201.251.100";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
