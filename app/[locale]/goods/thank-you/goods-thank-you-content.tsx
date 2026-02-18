"use client";

import { useEffect, useRef, useState } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// ロゴ
import logo from "@/components/header/logo.png";

// 集合写真
import profileImage from "../../(main)/profiles/profile.jpg";
import spProfileImage from "./IMG_4970.jpg";
import spLogo from "./logo1.png";

// メンバー画像
import shoImage from "../../(main)/profiles/member/sho.jpg";
import ryoImage from "../../(main)/profiles/member/ryo.jpg";
import akariImage from "../../(main)/profiles/member/akari.jpg";
import natukiImage from "../../(main)/profiles/member/natuki.jpg";
import rinImage from "../../(main)/profiles/member/rin.jpg";
import hiroakiImage from "../../(main)/profiles/member/hiroaki.jpg";
import yunaImage from "../../(main)/profiles/member/yuna.jpg";
import nanaImage from "../../(main)/profiles/member/nana.jpg";
import taiseiImage from "../../(main)/profiles/member/taisei.jpg";
import aoiImage from "../../(main)/profiles/member/aoi.jpg";
import aokiImage from "../../(main)/profiles/member/aoki.jpg";
import sakuraImage from "../../(main)/profiles/member/sakura.jpg";
import kahoImage from "../../(main)/profiles/member/kaho.jpg";
import mikotoImage from "../../(main)/profiles/member/mikoto.jpg";
import yumaImage from "../../(main)/profiles/member/yuma.jpg";
import kazuakiImage from "../../(main)/profiles/member/kazuaki.jpg";
import moekaImage from "../../(main)/profiles/member/moeka.jpg";
import ayumiImage from "../../(main)/profiles/member/ayumi.jpg";
import sakura2Image from "../../(main)/profiles/member/sakura2.jpg";

const members: { id: string; name: string; image: StaticImageData }[] = [
  { id: "1", name: "SHO", image: shoImage },
  { id: "2", name: "RYO", image: ryoImage },
  { id: "3", name: "AKARI", image: akariImage },
  { id: "4", name: "NATUKI", image: natukiImage },
  { id: "5", name: "RIN", image: rinImage },
  { id: "6", name: "HIROAKI", image: hiroakiImage },
  { id: "7", name: "YUNA", image: yunaImage },
  { id: "8", name: "NANA", image: nanaImage },
  { id: "9", name: "TAISEI", image: taiseiImage },
  { id: "10", name: "AOI", image: aoiImage },
  { id: "11", name: "AOKI", image: aokiImage },
  { id: "12", name: "SAKURA", image: sakuraImage },
  { id: "13", name: "KAHO", image: kahoImage },
  { id: "14", name: "MIKOTO", image: mikotoImage },
  { id: "15", name: "YUMA", image: yumaImage },
  { id: "16", name: "KAZUAKI", image: kazuakiImage },
  { id: "17", name: "MOEKA", image: moekaImage },
  { id: "18", name: "AYUMI", image: ayumiImage },
  { id: "19", name: "SAKURA", image: sakura2Image },
];

// 個別要素用のアニメーションコンポーネント
function FadeInElement({
  children,
  direction = "up",
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  direction?: "up" | "left" | "right";
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3, rootMargin: "-50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const translateClass = {
    up: isInView ? "translate-y-0" : "translate-y-12",
    left: isInView ? "translate-x-0" : "-translate-x-8",
    right: isInView ? "translate-x-0" : "translate-x-8",
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isInView ? "opacity-100" : "opacity-0"
      } ${translateClass[direction]} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// メンバー写真セクション用のアニメーションコンポーネント
// 上から一枚ずつ左右交互に表示、メッセージも同じタイミングで順次表示
function MemberPhotoSection({
  leftMembers,
  rightMembers,
  messageElements,
}: {
  leftMembers: { id: string; name: string; image: StaticImageData }[];
  rightMembers: { id: string; name: string; image: StaticImageData }[];
  messageElements: React.ReactNode[];
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visibleStep, setVisibleStep] = useState(0);

  // 全要素数: 左メンバー、右メンバー、メッセージを交互に表示
  // 表示順: 左[0], 右[0], メッセージ[0], 左[1], 右[1], メッセージ[1], ...
  const maxIndex = Math.max(leftMembers.length, rightMembers.length, messageElements.length);
  const totalSteps = maxIndex * 3; // 各行で左、右、メッセージの3つ

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const sectionHeight = rect.height;

      // セクションの上端がビューポートの60%に来た時を0%、
      // セクションをスクロールしきった時を100%として進行度を計算
      const scrollStart = viewportHeight * 0.6; // ビューポートの60%から開始
      const scrollEnd = -sectionHeight * 0.4; // セクションの40%が見えなくなるまで
      const scrollRange = scrollStart - scrollEnd;

      const progress = Math.max(0, Math.min(1, (scrollStart - rect.top) / scrollRange));
      const newStep = Math.min(Math.floor(progress * (totalSteps + 1)), totalSteps);

      setVisibleStep(newStep);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [totalSteps]);

  // 左側のindex番目が表示されるべきかどうか
  // 左[0]はstep 1、左[1]はstep 4、左[2]はstep 7... (index * 3 + 1)
  const isLeftVisible = (index: number) => visibleStep > index * 3;

  // 右側のindex番目が表示されるべきかどうか
  // 右[0]はstep 2、右[1]はstep 5、右[2]はstep 8... (index * 3 + 2)
  const isRightVisible = (index: number) => visibleStep > index * 3 + 1;

  // メッセージのindex番目が表示されるべきかどうか
  // メッセージ[0]はstep 3、メッセージ[1]はstep 6、メッセージ[2]はstep 9... (index * 3 + 3)
  const isMessageVisible = (index: number) => visibleStep > index * 3 + 2;

  return (
    <div ref={sectionRef} className="flex flex-row gap-4 md:gap-8 items-start justify-center">
      {/* 左側メンバー写真 */}
      <div className="flex flex-col w-[70px] md:w-[140px] shrink-0">
        {leftMembers.map((member, index) => (
          <div
            key={member.id}
            className={`transition-all duration-500 ease-out w-[60px] md:w-[120px] ${
              isLeftVisible(index) ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            } ${index > 0 ? "-mt-[20%]" : ""} ${index % 2 === 0 ? "ml-0" : "ml-[10px] md:ml-[20px]"}`}
          >
            <div className="relative aspect-[2/3] overflow-hidden shadow-lg">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      {/* 中央メッセージ */}
      <div className="text-center text-sm md:text-lg text-white/90 max-w-md flex-1">
        {messageElements.map((element, index) => (
          <div
            key={index}
            className={`transition-all duration-500 ease-out ${
              isMessageVisible(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {element}
          </div>
        ))}
      </div>

      {/* 右側メンバー写真 */}
      <div className="flex flex-col w-[70px] md:w-[140px] shrink-0 items-end">
        {rightMembers.map((member, index) => (
          <div
            key={member.id}
            className={`transition-all duration-500 ease-out w-[60px] md:w-[120px] ${
              isRightVisible(index) ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            } ${index > 0 ? "-mt-[20%]" : ""} ${index % 2 === 0 ? "mr-0" : "mr-[10px] md:mr-[20px]"}`}
          >
            <div className="relative aspect-[2/3] overflow-hidden shadow-lg">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GoodsThankYouContent() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ローディング画面を1.5秒後にフェードアウト
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* ローディング画面 */}
      <div
        className={`fixed inset-0 bg-white z-50 flex items-center justify-center transition-opacity duration-700 ${
          isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-red-500 to-red-700 min-h-screen">
      {/* セクション1: メイン写真（フル幅） */}
      <section className="w-full">
        {/* SP用 - 縦長画像、画面の高さに合わせる + ロゴオーバーレイ */}
        <div className="relative md:hidden">
          <Image
            src={spProfileImage}
            alt="IK ALUMNI CGT メンバー集合写真"
            className="w-full h-screen object-cover"
            priority
          />
          {/* SP用ロゴオーバーレイ（上部固定表示・フェードインアニメーション） */}
          <div className="absolute top-24 left-0 right-0 flex justify-center animate-fade-in-slow">
            <Image
              src={spLogo}
              alt="IK ALUMNI CGT"
              width={280}
              height={140}
              className="w-[220px] h-auto drop-shadow-lg"
            />
          </div>
        </div>
        {/* PC用 */}
        <Image
          src={profileImage}
          alt="IK ALUMNI CGT メンバー集合写真"
          className="w-full hidden md:block"
          priority
        />
      </section>

      {/* ロゴ */}
      <section className="py-12">
        <FadeInElement direction="up" className="flex justify-center">
          <Image
            src={logo}
            alt="IK ALUMNI CGT"
            width={400}
            height={400}
            className="w-[250px] md:w-[400px] h-auto"
          />
        </FadeInElement>
      </section>

      <div className="container mx-auto px-4 pb-16">
        {/* セクション2: お礼メッセージ + メンバー写真（両脇配置） */}
        <section className="mb-16">
          <MemberPhotoSection
            leftMembers={members.slice(0, 10)}
            rightMembers={members.slice(10, 19)}
            messageElements={[
              <h1 key="title" className="text-4xl md:text-5xl font-bold text-white mb-12 md:mb-16">
                Thank you!!
              </h1>,
              <p key="msg1" className="mb-6 md:mb-8">
                この度はチャリティーグッズのご購入ありがとうございました！
              </p>,
              <p key="msg2" className="mb-6 md:mb-8">皆様のご支援が大変励みになります。</p>,
              <p key="msg3" className="mb-6 md:mb-8">コンサートは最後まで楽しんでいただけましたか？</p>,
              <p key="msg4" className="mb-6 md:mb-8">
                チャリティーグッズをご購入していただいた皆様限定で、
                <br />
                メンバーからのメッセージ付き動画をご覧ください！
              </p>,
              <p key="msg5" className="mb-6 md:mb-8">ぜひ来年もまたお越しください！</p>,
              <p key="msg6" className="font-medium">
                改めて、この度はご来場並びにご購入ありがとうございました！
              </p>,
            ]}
          />
        </section>

        {/* セクション3: 動画（プレースホルダー） */}
        <section className="mb-16">
          <FadeInElement direction="up" className="max-w-3xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6 text-center">
              MESSAGE
            </h2>
            <video
              controls
              playsInline
              preload="metadata"
              className="w-full rounded-xl"
            >
              <source src="/videos/thank-you-message.mp4#t=0.001" type="video/mp4" />
            </video>
          </FadeInElement>
        </section>

        {/* セクション4: サポーターズクラブ案内 */}
        <section>
          <FadeInElement direction="up" className="max-w-2xl mx-auto text-center">
            <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 overflow-hidden">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                サポーターズクラブに
                <br className="sm:hidden" />
                参加しませんか？
              </h2>
              <p className="text-base text-white/90 mb-8">
                会員限定グッズ、コンサート映像の配信、
                <br className="hidden sm:block" />
                会員ページ限定コンテンツなど、
                <br className="hidden sm:block" />
                充実した特典をご用意しています。
              </p>
              <Link href="/supporters">
                <Button className="px-10 py-6 text-lg bg-white text-red-600 hover:bg-white/90 font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  詳しく見る
                </Button>
              </Link>
            </div>
          </FadeInElement>
        </section>
      </div>
    </div>
    </>
  );
}
