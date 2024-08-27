/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",  // <=== enables static exports
  distDir: "out",
  reactStrictMode: true,
};

module.exports = nextConfig;
