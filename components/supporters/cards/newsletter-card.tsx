"use client";

import Image from "next/image";
import { useState } from "react";
import { StaticImageData } from "next/image";

interface NewsletterCardProps {
  newsletterImages: StaticImageData[];
}

export function NewsletterCard({ newsletterImages }: NewsletterCardProps) {
  const [currentNewsletterIndex, setCurrentNewsletterIndex] = useState(0);

  const handleNextNewsletter = () => {
    setCurrentNewsletterIndex((prev) => (prev === newsletterImages.length - 1 ? 0 : prev + 1));
  };

  const handlePrevNewsletter = () => {
    setCurrentNewsletterIndex((prev) => (prev === 0 ? newsletterImages.length - 1 : prev - 1));
  };

  return (
    <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-8 overflow-visible group hover:bg-white/15 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-white mb-3">DIGITAL MAGAZINE</h3>
        <p className="text-white/90 mb-6 leading-relaxed">
          活動内容の報告や、<br />
          イベントの最新情報をお届け！
        </p>

        <div className="relative h-[400px] md:h-[480px]">
          <div className="relative w-full h-full perspective-1000 overflow-hidden">
            {newsletterImages.map((newsletter, index) => {
              let transform = "";
              let zIndex = 0;
              let opacity = 0;

              if (currentNewsletterIndex === 0) {
                if (index === 0) {
                  transform = "translateX(-50%) translateY(-50%) translateZ(0px) rotateZ(0deg) scale(1)";
                  zIndex = 30;
                  opacity = 1;
                } else if (index === 1) {
                  transform = "translateX(-50%) translateY(-50%) translateX(-35%) translateZ(-70px) rotateZ(-7deg) scale(0.85)";
                  zIndex = 20;
                  opacity = 0.7;
                } else {
                  transform = "translateX(-50%) translateY(-50%) translateX(-38%) translateZ(-90px) rotateZ(-9deg) scale(0.8)";
                  zIndex = 10;
                  opacity = 0.5;
                }
              } else if (currentNewsletterIndex === 1) {
                if (index === 0) {
                  transform = "translateX(-50%) translateY(-50%) translateX(-35%) translateZ(-80px) rotateZ(-8deg) scale(0.85)";
                  zIndex = 20;
                  opacity = 0.6;
                } else if (index === 1) {
                  transform = "translateX(-50%) translateY(-50%) translateZ(0px) rotateZ(0deg) scale(1)";
                  zIndex = 30;
                  opacity = 1;
                } else {
                  transform = "translateX(-50%) translateY(-50%) translateX(35%) translateZ(-80px) rotateZ(8deg) scale(0.85)";
                  zIndex = 20;
                  opacity = 0.6;
                }
              } else {
                if (index === 0) {
                  transform = "translateX(-50%) translateY(-50%) translateX(38%) translateZ(-90px) rotateZ(9deg) scale(0.8)";
                  zIndex = 10;
                  opacity = 0.5;
                } else if (index === 1) {
                  transform = "translateX(-50%) translateY(-50%) translateX(35%) translateZ(-70px) rotateZ(7deg) scale(0.85)";
                  zIndex = 20;
                  opacity = 0.7;
                } else {
                  transform = "translateX(-50%) translateY(-50%) translateZ(0px) rotateZ(0deg) scale(1)";
                  zIndex = 30;
                  opacity = 1;
                }
              }

              return (
                <div
                  key={index}
                  className="absolute left-1/2 top-1/2 w-auto h-[90%] cursor-pointer transition-all duration-500 ease-out"
                  style={{
                    transform,
                    zIndex,
                    opacity,
                    transformStyle: "preserve-3d",
                  }}
                  onClick={() => setCurrentNewsletterIndex(index)}
                >
                  <div className="relative w-auto h-full rounded-lg overflow-hidden shadow-2xl">
                    <Image
                      src={newsletter}
                      alt={`Digital Magazine${index + 1}`}
                      height={400}
                      width={283}
                      className="object-contain h-full w-auto"
                    />
                    {!(
                      (currentNewsletterIndex === 0 && index === 0) ||
                      (currentNewsletterIndex === 1 && index === 1) ||
                      (currentNewsletterIndex === 2 && index === 2)
                    ) && (
                      <div className="absolute inset-0 bg-black/40 transition-opacity duration-500" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handlePrevNewsletter}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-40 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-300"
            aria-label="前のDigital Magazine"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={handleNextNewsletter}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-40 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-300"
            aria-label="次のDigital Magazine"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {newsletterImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentNewsletterIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentNewsletterIndex
                  ? "bg-purple-400 w-6"
                  : "bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Digital Magazine${index + 1}へ移動`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
