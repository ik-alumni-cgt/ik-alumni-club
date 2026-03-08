"use client";

import Link from "next/link";
import Image from "next/image";
import { StaticImageData } from "next/image";
import PcFooter from "./PcFooter.jpg";
import SpFooter from "./SpFooter.jpg";
import { SNS_LINKS } from "../sns-icon/sns-links";
import xBlack from "../sns-icon/x-black.png";
import instagramBlack from "../sns-icon/instagram-black.png";
import youtubeBlack from "../sns-icon/youtube-black.png";
import tiktokBlack from "../sns-icon/tiktok-black.png";

const snsIcons: Record<string, StaticImageData> = {
  x: xBlack,
  instagram: instagramBlack,
  youtube: youtubeBlack,
  tiktok: tiktokBlack,
};

export function Footer() {
  const links = [
    { label: "お問い合わせ", href: "/contact" },
    { label: "利用規約", href: "/terms" },
    { label: "プライバシーポリシー", href: "/privacy" },
    { label: "特定商取引法に基づく表記", href: "/legal" },
  ];

  return (
    <footer className="w-full border-t bg-background">
      <div className="pt-8 md:pt-[50px]">
        {/* SNSアイコン */}
        <div className="flex gap-6 justify-center pb-8 md:pb-[50px] mb-8 md:mb-[50px] border-b border-border">
          {SNS_LINKS.map((sns) => (
            <a
              key={sns.key}
              href={sns.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={snsIcons[sns.key]}
                alt={sns.alt}
                height={24}
                width={24}
              />
            </a>
          ))}
        </div>

        {/* リンク */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-12 items-start md:items-center justify-start px-4 md:px-[92px] mb-8 md:mb-[50px]">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="text-sm md:text-base font-[family-name:var(--font-senobi-gothic)] whitespace-nowrap hover:underline transition-colors"
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
