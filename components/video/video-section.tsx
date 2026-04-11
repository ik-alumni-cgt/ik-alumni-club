"use client";

import { useState } from "react";
import { ContentsHeader } from "../contents/contents-header";
import { VideoCard } from "./card";
import { Carousel } from "./carousel";
import { CarouselIndicator } from "./carousel-indicator";
import { ShortsList } from "./shorts-card";

interface VideoItem {
  videoUrl: string;
  title: string;
}

interface ShortsItem {
  videoUrl: string;
  title: string;
}

interface VideoSectionProps {
  title: string;
  videoItems: VideoItem[];
  shortsItems: ShortsItem[];
}

type Tab = "shorts" | "video";

export function VideoSection({
  title,
  videoItems,
  shortsItems,
}: VideoSectionProps) {
  const [activeTab, setActiveTab] = useState<Tab>("shorts");
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? videoItems.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === videoItems.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="flex flex-col">
      <ContentsHeader title={title} viewAllHref="/video" />
      <div className="flex gap-4 mt-4 mb-6">
        <button
          onClick={() => setActiveTab("shorts")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === "shorts"
              ? "bg-red-600 text-white"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
        >
          Shorts
        </button>
        <button
          onClick={() => setActiveTab("video")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === "video"
              ? "bg-red-600 text-white"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
        >
          Video
        </button>
      </div>
      {activeTab === "shorts" ? (
        <ShortsList items={shortsItems} />
      ) : videoItems.length === 0 ? (
        <div className="mt-[60px]">
          <p>配信までしばらくお待ちください</p>
        </div>
      ) : (
        <>
          <Carousel onPrevious={handlePrevious} onNext={handleNext}>
            <VideoCard
              videoUrl={videoItems[currentIndex].videoUrl}
              title={videoItems[currentIndex].title}
            />
          </Carousel>
          <CarouselIndicator
            totalItems={videoItems.length}
            currentIndex={currentIndex}
            maxDots={3}
            onDotClick={setCurrentIndex}
          />
        </>
      )}
    </div>
  );
}
