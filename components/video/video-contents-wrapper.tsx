"use client";

import { ContentsHeader } from "../contents/contents-header";
import { VideoCard } from "./card";
import { Carousel } from "./carousel";
import { CarouselIndicator } from "./carousel-indicator";
import { useState } from "react";

interface VideoItem {
  id?: string;
  videoUrl: string;
  title: string;
}

interface VideoContentsWrapperProps {
  title: string;
  items: VideoItem[];
}

export function VideoContentsWrapper({ title, items }: VideoContentsWrapperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col">
      <ContentsHeader title={title} viewAllHref="/video" />
      {items.length === 0 ? (
        <div className="mt-[60px]">
          <p>配信までしばらくお待ちください</p>
        </div>
      ) : (
        <>
          <Carousel onPrevious={handlePrevious} onNext={handleNext}>
            <VideoCard
              videoUrl={items[currentIndex].videoUrl}
              title={items[currentIndex].title}
            />
          </Carousel>
          <CarouselIndicator
            totalItems={items.length}
            currentIndex={currentIndex}
            maxDots={3}
            onDotClick={setCurrentIndex}
          />
        </>
      )}
    </div>
  );
}
