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
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full">
      {images.map((src, index) => (
        <Image
          key={index}
          src={src}
          alt={`Hero Background ${index + 1}`}
          width={1920}
          height={1080}
          className={`w-full h-auto mx-auto px-4 md:px-8 transition-opacity duration-1000 ${
            index === currentIndex
              ? "opacity-100 relative"
              : "opacity-0 absolute top-0 left-0"
          }`}
          priority={index === 0}
        />
      ))}
    </div>
  );
}
