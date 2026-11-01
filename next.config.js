/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages requires static files; Vercel uses the default server build.
  output: process.env.NEXT_OUTPUT_EXPORT === "true" ? "export" : undefined,
  reactStrictMode: true,
  images: {
    unoptimized: true, // Disable Image Optimization API
  },
};

module.exports = nextConfig;
