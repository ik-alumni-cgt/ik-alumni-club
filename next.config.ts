import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@workspace/ui"],
  images: {
    // Vercel の画像最適化（_next/image）の無料枠超過で 402 になるためバイパス。
    // 画像実体は Cloudflare R2（egress 無料）から原寸配信。軽量化は別タスクで対応（Notion タスク #59）。
    unoptimized: true,
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
  async redirects() {
    return [
      // 旧サービス名 Cheerly は YOURFLAG に統合。配布済み資料・QRコード（/cheerly）を維持。
      {
        source: '/cheerly',
        destination: '/yourflag',
        permanent: true,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin('./app/web/i18n/request.ts');
export default withNextIntl(nextConfig);