"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SNS_LINKS } from "../sns-icon/sns-links";
import xBlack from "../sns-icon/x-black.png";
import instagramBlack from "../sns-icon/instagram-black.png";
import youtubeBlack from "../sns-icon/youtube-black.png";
import tiktokBlack from "../sns-icon/tiktok-black.png";
import { StaticImageData } from "next/image";

const snsIcons: Record<string, StaticImageData> = {
  x: xBlack,
  instagram: instagramBlack,
  youtube: youtubeBlack,
  tiktok: tiktokBlack,
};
import logo from "./logo_main.png";
import supportersLogo from "@/app/[locale]/(main)/supporters/top_supporter's.jpg";
import supportersSamune from "@/components/supporters/samune.jpg";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { authClient } from "@/lib/auth-client";
import { User, LogOut } from "lucide-react";

interface HamburgerMenuContentProps {
  onClose?: () => void;
}

export function HamburgerMenuContent({ onClose }: HamburgerMenuContentProps) {
  const t = useTranslations("Header");
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    onClose?.();
    router.push("/");
    router.refresh();
  };

  const handleLinkClick = () => {
    onClose?.();
  };

  return (
    <nav className="flex flex-col md:grid md:grid-cols-2 h-full w-full rounded-none md:rounded-[10px] overflow-y-auto md:overflow-hidden">
      {/* 上（スマホ）/ 左（PC）: メインメニュー（白背景・赤字） */}
      <div className="bg-white p-20 flex flex-col gap-4 flex-shrink-0 md:h-full">
        {/* ロゴ */}
        <div className="mb-4 flex justify-center">
          <Image src={logo} alt="IK ALUMNI CGT" width={200} height={112} className="h-auto" />
        </div>
        <Link href="/" onClick={handleLinkClick} className="text-base font-medium text-red-500 hover:text-red-300 transition-colors pb-4 border-b border-red-500">
          {t("home")}
        </Link>
        <Link href="/information" onClick={handleLinkClick} className="text-base font-medium text-red-500 hover:text-red-300 transition-colors pb-4 border-b border-red-500">
          {t("information")}
        </Link>
        <Link href="/schedule" onClick={handleLinkClick} className="text-base font-medium text-red-500 hover:text-red-300 transition-colors pb-4 border-b border-red-500">
          {t("schedule")}
        </Link>
        <Link href="/video" onClick={handleLinkClick} className="text-base font-medium text-red-500 hover:text-red-300 transition-colors pb-4 border-b border-red-500">
          {t("video")}
        </Link>
        <Link href="/blog" onClick={handleLinkClick} className="text-base font-medium text-red-500 hover:text-red-300 transition-colors pb-4 border-b border-red-500">
          {t("blog")}
        </Link>
        <Link href="/profiles" onClick={handleLinkClick} className="text-base font-medium text-red-500 hover:text-red-300 transition-colors pb-4 border-b border-red-500">
          {t("profiles")}
        </Link>
        <Link href="/contact" onClick={handleLinkClick} className="text-base font-medium text-red-500 hover:text-red-300 transition-colors pb-4 border-b border-red-500">
          {t("contact")}
        </Link>

        {/* SNSアイコン */}
        <div className="flex gap-4 mt-4 justify-center">
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
      </div>

      {/* 下（スマホ）/ 右（PC）: サポーターズクラブ（青系背景） */}
      <div className="bg-gradient-to-br from-cyan-400 via-blue-400 to-cyan-500 p-20 flex flex-col gap-4 flex-grow md:h-full">
        {/* サポーターズクラブロゴ */}
        <div className="mb-4 flex justify-center">
          <Image src={supportersLogo} alt="Supporter's Club" width={200} height={112} className="h-auto" />
        </div>
        {session?.user ? (
          <div className="flex flex-col md:flex-row gap-4">
            <Link href="/mypage" onClick={handleLinkClick} className="w-full md:flex-1">
              <Button variant="outline" className="w-full min-h-11 bg-white/20 border-white text-white hover:bg-white/30">
                <User className="h-4 w-4 mr-2" />
                {t("mypage")}
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full md:flex-1 min-h-11 bg-white/20 border-white text-white hover:bg-white/30"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t("logout")}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4">
            <Link href="/supporters" onClick={handleLinkClick} className="w-full md:flex-1">
              <Button className="w-full min-h-11 bg-white text-blue-500 hover:bg-white/90">
                {t("joinUs")}
              </Button>
            </Link>
            <Link href="/login" onClick={handleLinkClick} className="w-full md:flex-1">
              <Button variant="outline" className="w-full min-h-11 bg-white/20 border-white text-white hover:bg-white/30">
                {t("login")}
              </Button>
            </Link>
          </div>
        )}
        {/* サムネイル画像 */}
        <div className="mt-4 flex justify-center">
          <Image src={supportersSamune} alt="Supporter's Club" width={360} height={202} className="h-auto rounded-lg" />
        </div>
        {/* コンテンツリンク（会員限定） */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 w-full bg-blue-500 rounded-lg p-4">
          <Link href="/member/video" onClick={handleLinkClick} className="text-base font-medium text-white hover:text-white/70 transition-colors text-center py-2">
            VIDEO
          </Link>
          <Link href="/member/newsletter" onClick={handleLinkClick} className="text-base font-medium text-white hover:text-white/70 transition-colors text-center py-2">
            DIGITAL MAGAZINE
          </Link>
          <Link href="/member/photo-library" onClick={handleLinkClick} className="text-base font-medium text-white hover:text-white/70 transition-colors text-center py-2">
            PHOTO LIBRARY
          </Link>
          <Link href="/member/blog" onClick={handleLinkClick} className="text-base font-medium text-white hover:text-white/70 transition-colors text-center py-2">
            EXCLUSIVE BLOG
          </Link>
        </div>
      </div>
    </nav>
  );
}
