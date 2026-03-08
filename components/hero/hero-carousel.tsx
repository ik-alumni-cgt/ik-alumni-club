"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import hero1 from "./hero1.jpg";
import hero2 from "./hero2.jpg";
import hero4 from "./hero4.jpg";

const images = [
  { src: hero1, alt: "Hero 1", href: "https://www.ik-alumni-cgt.com/information/St337J1TNm73cYbjGT_1b" },
  { src: hero2, alt: "Hero 2", href: "https://www.ik-alumni-cgt.com/supporters" },
  { src: hero4, alt: "Hero 4", href: "https://linktr.ee/ik_alumni_2022" },
];

// SP: 35vw、PC: 33.333%
const SP_IMAGE_WIDTH = 50;
const PC_IMAGE_WIDTH = 33.333;
const SP_GAP = 4; // SP版のギャップ（4vw）
const PC_GAP = 1; // PC版のギャップ（1vw）

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(images.length);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // ドラッグ/スワイプ用の状態
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [hasDragged, setHasDragged] = useState(false); // ドラッグしたかどうか

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
        setCurrentIndex(currentIndex - images.length);
        requestAnimationFrame(() => setIsTransitioning(true));
      }, 500);
      return () => clearTimeout(timer);
    }
    if (currentIndex < images.length) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(currentIndex + images.length);
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
    // SP: 50vw（ビューポート基準）、PC: 50%（コンテナ基準）
    const center = isMobile ? "50vw" : "50%";
    // ドラッグ中はオフセットを加算
    if (isDragging) {
      return `calc(-${offset}vw + ${center} + ${dragOffset}px)`;
    }
    return `calc(-${offset}vw + ${center})`;
  };

  // ドラッグ開始（マウス）
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // テキスト選択を防ぐ
    setIsDragging(true);
    setStartX(e.clientX);
    setIsTransitioning(false);
    setHasDragged(false);
  };

  // ドラッグ中（マウス）
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    setDragOffset(diff);
    if (Math.abs(diff) > 5) {
      setHasDragged(true);
    }
  };

  // ドラッグ終了（マウス）
  const handleMouseUp = () => {
    if (!isDragging) return;
    finishDrag();
  };

  // タッチ開始
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setIsTransitioning(false);
    setHasDragged(false);
  };

  // タッチ中
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientX - startX;
    setDragOffset(diff);
    if (Math.abs(diff) > 5) {
      setHasDragged(true);
    }
  };

  // タッチ終了
  const handleTouchEnd = () => {
    if (!isDragging) return;
    finishDrag();
  };

  // ドラッグ終了時の処理
  const finishDrag = () => {
    setIsDragging(false);
    setIsTransitioning(true);

    // スワイプ距離に応じてスライド
    const threshold = 50; // px
    if (dragOffset > threshold) {
      handlePrev();
    } else if (dragOffset < -threshold) {
      handleNext();
    }

    setDragOffset(0);
  };

  // 実際のインデックス（インジケーター用）
  const actualIndex = currentIndex % images.length;

  return (
    <div className="w-full mt-8 md:mt-12 overflow-x-clip">
      {/* SP: 全幅、PC: container */}
      <div className="md:container md:mx-auto md:px-4">
        {/* 画像カルーセル */}
        <div
          className="overflow-hidden md:overflow-visible pb-4 cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            ref={containerRef}
            className="flex items-center select-none"
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
                  className="flex-shrink-0"
                  style={{
                    width: `${getImageWidth()}vw`,
                  }}
                >
                  <Link
                    href={image.href}
                    target={image.href.startsWith("http") ? "_blank" : undefined}
                    rel={image.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    onClick={(e) => {
                      if (hasDragged) {
                        e.preventDefault();
                      }
                    }}
                    className="block"
                  >
                    <div className="relative aspect-[16/9] w-full overflow-hidden shadow-lg">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover pointer-events-none"
                        draggable={false}
                        placeholder="blur"
                        sizes="(max-width: 768px) 85vw, 33vw"
                      />
                    </div>
                  </Link>
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
