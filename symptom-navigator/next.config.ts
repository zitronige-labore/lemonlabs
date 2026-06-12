import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  devIndicators: false,
};

const isDev = process.env.NODE_ENV === "development";

export default isDev
  ? nextConfig
  : withPWA({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: false,   
  disable: process.env.NODE_ENV === "development",
})(nextConfig);