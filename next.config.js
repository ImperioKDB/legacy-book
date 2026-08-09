/** @type {import('next').NextConfig} */
// force-redeploy: confirming Supabase remotePatterns is live in build
const nextConfig = {
  transpilePackages: ["framer-motion"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

module.exports = nextConfig;
