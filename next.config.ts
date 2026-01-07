import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@workspace/ui"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
      // Cloudflare R2
      {
        protocol: 'https',
        hostname: 'pub-35b06e5298d94e1aad043322bc8b2496.r2.dev',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb', // Server Actionsのボディサイズ制限
    },
    middlewareClientMaxBodySize: '100mb', // Middlewareのリクエストボディ制限
  },
};

const withNextIntl = createNextIntlPlugin('./app/web/i18n/request.ts');
export default withNextIntl(nextConfig);