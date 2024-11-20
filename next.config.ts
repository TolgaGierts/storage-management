import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit:'100MB'
    },
  },
  /* config options here */
  images: {
    remotePatterns: [
      { hostname: 'commons.wikimedia.org' },
      { hostname: 'www.google.com' },
      { hostname: 'cdn.pixabay.com' },
      { hostname: 'cloud.appwrite.io' },
      { hostname: 'img.freepik.com' },
    ],
  },
};

export default nextConfig;
