import type { NextConfig } from "next";

/**
 * Enhanced Next.js configuration with security features and optimizations
 */
const nextConfig: NextConfig = {
  // Image optimization security settings
  images: {
    remotePatterns: [
      // Local development Strapi server
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "1337",
        pathname: "/uploads/**",
      },
      // GitHub avatars for Giscus comments
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
    // Set reasonable defaults for image optimization
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60, // Cache optimized images for at least 60 seconds
    dangerouslyAllowSVG: false, // Prevent SVG unless necessary for your use case
  },
  
  // Security headers (additional to middleware)
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN',
        },
      ],
    },
  ],
  
  // Disable powered-by header to hide technology information
  poweredByHeader: false,
  
  // Remove trailing slashes for consistency
  trailingSlash: false,
  
  // Strict mode for better React debugging
  reactStrictMode: true,
};

export default nextConfig;
