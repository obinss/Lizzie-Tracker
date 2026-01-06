import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true, // Required for static export
  },
  // Optional: Enable static export for Firebase Hosting
  // output: 'export',
};

export default nextConfig;
