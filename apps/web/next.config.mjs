/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@juniorcode/ui", "@juniorcode/db"],
  webpack: (config) => {
    config.infrastructureLogging = { level: "error" };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["@supabase/supabase-js"],
  },
};

export default nextConfig;
