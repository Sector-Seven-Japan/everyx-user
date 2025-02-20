import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // Ensure all dependencies are bundled properly
  images: {
    unoptimized: true, // Use Vercel's built-in image optimization
  },
};

export default nextConfig;
