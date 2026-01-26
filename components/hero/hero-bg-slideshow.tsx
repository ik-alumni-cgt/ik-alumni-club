"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// 全角数字のファイル名に対応
const imageNumbers = [
  "１", "２", "３", "４", "５", "６", "７", "８", "９", "１０",
  "１１", "１２", "１３", "１４", "１５", "１６", "１７", "１８", "１９", "２０",
  "２１", "２２", "２３", "２４", "２５", "２６", "２７", "２８", "２９", "３０",
  "３１", "３２", "３３", "３４", "３５", "３６", "３７", "３８", "３９", "４０",
  "４１", "４２", "４３", "４４",
];

const imageExtensions: Record<string, string> = {
  "１": "jpg", "２": "jpg", "３": "jpg", "４": "jpg", "５": "JPG",
  "６": "JPG", "７": "jpg", "８": "JPEG", "９": "JPEG", "１０": "JPEG",
  "１１": "jpg", "１２": "JPG", "１３": "jpg", "１４": "JPEG", "１５": "jpg",
  "１６": "jpg", "１７": "JPG", "１８": "JPEG", "１９": "jpg", "２０": "JPG",
  "２１": "JPG", "２２": "JPG", "２３": "JPG", "２４": "JPG", "２５": "JPG",
  "２６": "JPG", "２７": "JPG", "２８": "jpg", "２９": "JPG", "３０": "JPG",
  "３１": "JPG", "３２": "JPEG", "３３": "jpg", "３４": "JPG", "３５": "jpg",
  "３６": "jpg", "３７": "JPG", "３８": "jpg", "３９": "JPG", "４０": "JPEG",
  "４１": "JPG", "４２": "JPG", "４３": "jpg", "４４": "jpg",
};

const images = imageNumbers.map(
  (num) => `/hero-bg/${num}.${imageExtensions[num]}`
);

export function HeroBgSlideshow() {
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
  }, [displayIndex]);

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
        alt={`Hero Background ${displayIndex + 1}`}
        width={1920}
        height={1080}
        className="w-full h-auto mx-auto px-4 md:px-8"
        priority
      />
      {/* 次の画像（前面でフェードイン） */}
      {nextIndex !== null && (
        <Image
          src={images[nextIndex]}
          alt={`Hero Background ${nextIndex + 1}`}
          width={1920}
          height={1080}
          className={`w-full h-auto mx-auto px-4 md:px-8 absolute top-0 left-0 z-10 transition-opacity duration-1000 ${
            isFading ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}
