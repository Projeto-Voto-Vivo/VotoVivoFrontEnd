import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: process.env.BACKEND_INTERNAL_URL || 'http://localhost:3001/:path*', 
      },
    ];
  },
};

export default nextConfig;
