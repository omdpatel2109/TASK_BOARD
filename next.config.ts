import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [ //help which external image URLs Next.js is allowed to load
      {
        protocol: "https",
        hostname: "dummyjson.com",
        pathname: "/icon/**",
      },
    ],
  },

  compiler:{
    removeConsole: true,
  },

  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: true,
      },
    ];
  },
};

// export default nextConfig;
export default withNextIntl(nextConfig);