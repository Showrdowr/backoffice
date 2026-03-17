import type { NextConfig } from "next";

process.env.TZ = 'Asia/Bangkok';

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
};

export default nextConfig;
