"use client";

import Link from "next/link";
import Image from "next/image";
import xBlack from "../sns-icon/x-black.png";
import instagramBlack from "../sns-icon/instagram-black.png";
import youtubeBlack from "../sns-icon/youtube-black.png";
import tiktokBlack from "../sns-icon/tiktok-black.png";
import PcFooter from "./PcFooter.jpg";
import SpFooter from "./SpFooter.jpg";

export function Footer() {
  const links = [
    { label: "ホーム", href: "/" },
    { label: "お知らせ", href: "/information" },
    { label: "スケジュール", href: "/schedule" },
    { label: "動画", href: "/video" },
    { label: "ブログ", href: "/blog" },
    { label: "会報", href: "/newsletter" },
    { label: "お問い合わせ", href: "/contact" },
    { label: "利用規約", href: "/terms" },
    { label: "プライバシーポリシー", href: "/privacy" },
    { label: "特定商取引法", href: "/legal" },
  ];

  return (
    <footer className="w-full border-t bg-background">
      <div className="pt-8 md:pt-[50px]">
        {/* SNSアイコン */}
        <div className="flex gap-4 items-center justify-center mb-6 md:mb-8">
          <Image src={xBlack} alt="X (Twitter)" height={24} />
          <Image src={instagramBlack} alt="Instagram" height={24} />
          <Image src={youtubeBlack} alt="YouTube" height={24} />
          <Image src={tiktokBlack} alt="TikTok" height={24} />
        </div>

        {/* リンク */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-4 md:gap-12 items-center justify-center px-4 md:px-[92px] mb-8 md:mb-[50px]">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="header-text whitespace-nowrap hover:underline transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Footer画像 */}
        <div className="w-full">
          {/* SP用 */}
          <Image
            src={SpFooter}
            alt="IK ALUMNI CGT"
            className="w-full md:hidden"
          />
          {/* PC用 */}
          <Image
            src={PcFooter}
            alt="IK ALUMNI CGT"
            className="w-full hidden md:block"
          />
        </div>
      </div>
    </footer>
  );
}
