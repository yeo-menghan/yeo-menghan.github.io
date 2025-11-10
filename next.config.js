/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",  // Enables static exports
  // distDir: "out",
  reactStrictMode: true,
  images: {
    unoptimized: true, // Disable Image Optimization API
  },
};

module.exports = nextConfig;
