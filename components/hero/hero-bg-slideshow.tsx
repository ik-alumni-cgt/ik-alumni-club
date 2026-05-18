"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { HeroSlide } from "@/types/hero-slide";

type Props = {
  items: HeroSlide[];
};

export function HeroBgSlideshow({ items }: Props) {
  // 画像が無い場合は描画しない
  if (items.length === 0) return null;
  return <HeroBgSlideshowInner images={items.map((item) => item.imageUrl)} />;
}

function HeroBgSlideshowInner({ images }: { images: string[] }) {
  const [displayIndex, setDisplayIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState<number | null>(null);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = (displayIndex + 1) % images.length;
      setNextIndex(next);
      // 少し遅延してフェードを開始（次の画像がロードされるのを待つ）
      setTimeout(() => {
        setIsFading(true);
      }, 50);
    }, 5000);
    return () => clearInterval(interval);
  }, [displayIndex, images.length]);

  // フェード完了後にインデックスを更新
  useEffect(() => {
    if (isFading && nextIndex !== null) {
      const timer = setTimeout(() => {
        setDisplayIndex(nextIndex);
        setNextIndex(null);
        setIsFading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isFading, nextIndex]);

  return (
    <div className="relative w-full overflow-hidden">
      {/* 現在の画像（背面） */}
      <Image
        src={images[displayIndex]}
        alt=""
        width={1920}
        height={1080}
        className="w-full h-auto mx-auto md:px-8"
        priority
      />
      {/* 次の画像（前面でフェードイン） */}
      {nextIndex !== null && (
        <Image
          src={images[nextIndex]}
          alt=""
          width={1920}
          height={1080}
          className={`w-full h-auto mx-auto md:px-8 absolute top-0 left-0 z-10 transition-opacity duration-1000 ${
            isFading ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}
