/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["http://192.168.1.222:3000"],
  transpilePackages: ["@juniorcode/ui", "@juniorcode/db"],
  serverExternalPackages: ["@supabase/supabase-js"],
  async headers() {
    const shouldUpgradeInsecureRequests =
      process.env.NODE_ENV === "production" &&
      (process.env.VERCEL === "1" ||
        process.env.NEXT_PUBLIC_APP_URL?.startsWith("https://"));
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.supabase.co https://avatars.githubusercontent.com",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://*.stripe.com",
      "frame-src 'self' https://js.stripe.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ];

    if (shouldUpgradeInsecureRequests) {
      cspDirectives.push("upgrade-insecure-requests");
    }

    const securityHeaders = [
      {
        key: "Content-Security-Policy",
        value: cspDirectives.join("; "),
      },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), payment=()",
      },
    ];

    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
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
};

export default nextConfig;
