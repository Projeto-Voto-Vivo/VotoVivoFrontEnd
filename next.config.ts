import type { NextConfig } from "next";

const backendBaseUrl = process.env.BACKEND_INTERNAL_URL 
  ? process.env.BACKEND_INTERNAL_URL.replace(/\/+$/, '') 
  : 'http://localhost:3001';

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
        destination: `${backendBaseUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
;
