"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import hero1 from "./hero1.jpg";
import hero2 from "./hero2.jpg";
import hero3 from "./hero3.jpg";
import hero4 from "./hero4.jpg";

const images = [
  { src: hero1, alt: "Hero 1" },
  { src: hero2, alt: "Hero 2" },
  { src: hero3, alt: "Hero 3" },
  { src: hero4, alt: "Hero 4" },
];

// SP: 50vw、PC: 33.333%
const SP_IMAGE_WIDTH = 50;
const PC_IMAGE_WIDTH = 33.333;
const SP_GAP = 2; // SP版のギャップ（2vw）
const PC_GAP = 1; // PC版のギャップ（1vw）

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(images.length);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 3セット複製（無限ループ用）
  const extendedImages = [...images, ...images, ...images];

  // レスポンシブ判定
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // 無限ループ処理
    if (currentIndex >= images.length * 2) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(images.length);
        requestAnimationFrame(() => setIsTransitioning(true));
      }, 500);
      return () => clearTimeout(timer);
    }
    if (currentIndex < images.length) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(images.length);
        requestAnimationFrame(() => setIsTransitioning(true));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  const handleNext = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const getImageWidth = () => (isMobile ? SP_IMAGE_WIDTH : PC_IMAGE_WIDTH);
  const getGap = () => (isMobile ? SP_GAP : PC_GAP);

  const getTransform = () => {
    const width = getImageWidth();
    const gap = getGap();
    const offset = currentIndex * (width + gap) + width / 2;
    return `calc(-${offset}vw + 50vw)`;
  };

  // 実際のインデックス（インジケーター用）
  const actualIndex = currentIndex % images.length;

  return (
    <div className="w-full mb-8 md:mb-12 lg:mb-16 -mt-16 md:-mt-20 lg:-mt-24">
      {/* SP: 全幅、PC: container */}
      <div className="md:container md:mx-auto md:px-4">
        {/* 画像カルーセル */}
        <div className="overflow-hidden pb-4">
          <div
            ref={containerRef}
            className="flex items-center"
            style={{
              gap: `${getGap()}vw`,
              transform: `translateX(${getTransform()})`,
              transition: isTransitioning
                ? "transform 500ms ease-in-out"
                : "none",
            }}
          >
            {extendedImages.map((image, index) => {
              return (
                <div
                  key={`${index}-${image.alt}`}
                  className="flex-shrink-0 cursor-pointer"
                  style={{
                    width: `${getImageWidth()}vw`,
                  }}
                >
                  <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      placeholder="blur"
                      sizes="(max-width: 768px) 85vw, 33vw"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* インジケーターと矢印ボタン */}
        <div className="flex justify-center items-center gap-4 mt-4 px-4">
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
                onClick={() => setCurrentIndex(images.length + idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === actualIndex
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
