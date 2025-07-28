import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    nodeMiddleware: true,
  },
  images: {
    domains: ["q54hvvxotq.ufs.sh"],
  },

  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: 'https',
  //       hostname: 'cqi51k0kqc.ufs.sh',
  //       pathname: '/**',
  //     },
  //   ],
  // },
};

export default nextConfig;
