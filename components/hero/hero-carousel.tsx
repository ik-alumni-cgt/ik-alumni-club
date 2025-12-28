"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import hero1 from "./hero1.jpg";
import hero2 from "./hero2.jpg";
import hero3 from "./hero3.jpg";
import hero4 from "./hero4.jpg";

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    { src: hero1, alt: "Hero 1" },
    { src: hero2, alt: "Hero 2" },
    { src: hero3, alt: "Hero 3" },
    { src: hero4, alt: "Hero 4" },
  ];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // 現在のインデックスから3枚を取得（ループ処理）
  const getVisibleImages = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % images.length;
      visible.push({ ...images[index], originalIndex: index });
    }
    return visible;
  };

  return (
    <div className="w-full mb-8 md:mb-12 lg:mb-16 -mt-16 md:-mt-20 lg:-mt-24">
      <div className="container mx-auto px-4">
        {/* 画像の横スクロール表示 */}
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4">
          {getVisibleImages().map((image, idx) => (
            <div
              key={`${image.originalIndex}-${idx}`}
              className="flex-shrink-0 w-[calc(33.333%-0.75rem)] snap-start cursor-pointer transition-transform hover:scale-105"
            >
              <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  placeholder="blur"
                />
              </div>
            </div>
          ))}
        </div>

        {/* インジケーターと矢印ボタン */}
        <div className="flex justify-center items-center gap-4 mt-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrev}
            className="rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
            aria-label="前の画像を表示"
          >
            <ChevronLeft className="h-6 w-6 text-red-500" />
          </Button>

          <div className="flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex
                    ? "bg-red-500 w-6"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
                aria-label={`画像 ${idx + 1} に移動`}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
            aria-label="次の画像を表示"
          >
            <ChevronRight className="h-6 w-6 text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}
