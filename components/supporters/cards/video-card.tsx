"use client";

import Image from "next/image";
import { useState } from "react";
import { StaticImageData } from "next/image";

interface VideoCardProps {
  videoImages: StaticImageData[];
}

export function VideoCard({ videoImages }: VideoCardProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const handlePrevVideo = () => {
    setCurrentVideoIndex((prev) => (prev === 0 ? videoImages.length - 1 : prev - 1));
  };

  const handleNextVideo = () => {
    setCurrentVideoIndex((prev) => (prev === videoImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-8 overflow-visible group hover:bg-white/15 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-white mb-3">MEMBERS VIDEO</h3>
        <p className="text-white/90 mb-6 leading-relaxed">
          過去のイベントや<br />
          発表会の動画などを配信！
        </p>
        <div className="relative h-48 md:h-56">
          <div className="relative w-full h-full perspective-1000 overflow-hidden">
            {videoImages.map((video, index) => {
              const position = (index - currentVideoIndex + videoImages.length) % videoImages.length;
              const isCenter = position === 0;
              const isLeft = position === videoImages.length - 1;
              const isRight = position === 1;

              let transform = "";
              let zIndex = 0;
              let opacity = 0;

              if (isCenter) {
                transform = "translateX(-50%) translateY(-50%) translateZ(0px) rotateZ(0deg) scale(1)";
                zIndex = 30;
                opacity = 1;
              } else if (isLeft) {
                transform = "translateX(-50%) translateY(-50%) translateX(-25%) translateZ(-100px) rotateZ(-5deg) scale(0.8)";
                zIndex = 20;
                opacity = 0.6;
              } else if (isRight) {
                transform = "translateX(-50%) translateY(-50%) translateX(25%) translateZ(-100px) rotateZ(5deg) scale(0.8)";
                zIndex = 20;
                opacity = 0.6;
              } else {
                transform = "translateX(-50%) translateY(-50%) translateZ(-200px) scale(0.6)";
                zIndex = 10;
                opacity = 0;
              }

              return (
                <div
                  key={index}
                  className="absolute left-1/2 top-1/2 w-[70%] aspect-video rounded-lg overflow-hidden cursor-pointer transition-all duration-500 ease-out"
                  style={{
                    transform,
                    zIndex,
                    opacity,
                    transformStyle: "preserve-3d",
                  }}
                  onClick={() => setCurrentVideoIndex(index)}
                >
                  <Image
                    src={video}
                    alt={`動画サムネイル${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  {!isCenter && (
                    <div className="absolute inset-0 bg-black/40 transition-opacity duration-500" />
                  )}
                  {isCenter && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <svg
                        className="w-12 h-12 md:w-16 md:h-16 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={handlePrevVideo}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-40 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-300"
            aria-label="前の動画"
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
            onClick={handleNextVideo}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-40 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-300"
            aria-label="次の動画"
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
          {videoImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentVideoIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentVideoIndex
                  ? "bg-white w-6"
                  : "bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`動画${index + 1}へ移動`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
