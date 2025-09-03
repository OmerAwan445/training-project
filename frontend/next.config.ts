import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    ppr: 'incremental',
  },
  images: {
    domains: ['i.pravatar.cc'],
  },
};

export default nextConfig;
