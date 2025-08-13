/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "caarashpaxencctvhquf.supabase.co",
        pathname: "/storage/v1/object/public/cabins-images/**",
      },
    ],
    unoptimized: true, // Disable image optimization during build
  },
  experimental: {
    optimizePackageImports: ["sharp"],
  },
};

export default nextConfig;
