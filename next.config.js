// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "out",
  output: "export",
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
