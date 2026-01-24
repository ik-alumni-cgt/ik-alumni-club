"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PhotoLibraryWithImages } from "@/types/photo-library";

export function PhotoLibraryDetail({ item }: { item: PhotoLibraryWithImages }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const goToPrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? item.images.length - 1 : selectedIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === item.images.length - 1 ? 0 : selectedIndex + 1);
    }
  };

  return (
    <article className="flex flex-col gap-8 max-w-4xl mx-auto">
      <header>
        <h1 className="main-text mb-4">{item.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>{new Date(item.createdAt).toLocaleDateString("ja-JP")}</span>
          <span>閲覧数: {item.viewCount}</span>
          <span>{item.images.length}枚の写真</span>
        </div>
      </header>

      {item.description && (
        <div className="prose prose-lg max-w-none">
          <p className="whitespace-pre-wrap">{item.description}</p>
        </div>
      )}

      {/* 画像グリッド */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {item.images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => openLightbox(index)}
            className="relative aspect-[4/3] rounded-lg overflow-hidden border hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <Image
              src={image.imageUrl}
              alt={image.caption || `${item.title} - ${index + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
            />
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <p className="text-xs text-white line-clamp-1">{image.caption}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      {item.images.length === 0 && (
        <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg">
          <div className="text-center text-gray-500">
            <ImageIcon className="h-12 w-12 mx-auto mb-2" />
            <p>画像がありません</p>
          </div>
        </div>
      )}

      {/* ライトボックス */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[70] bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={closeLightbox}
          >
            <X className="h-6 w-6" />
          </Button>

          {item.images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 text-white bg-black/50 hover:bg-black/70 h-10 w-10 sm:h-12 sm:w-12 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
              >
                <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 text-white bg-black/50 hover:bg-black/70 h-10 w-10 sm:h-12 sm:w-12 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
              >
                <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
              </Button>
            </>
          )}

          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={item.images[selectedIndex].imageUrl}
              alt={item.images[selectedIndex].caption || `${item.title} - ${selectedIndex + 1}`}
              width={1200}
              height={900}
              className="object-contain max-h-[85vh]"
            />
            {item.images[selectedIndex].caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white text-center">{item.images[selectedIndex].caption}</p>
              </div>
            )}
            <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-md text-sm">
              {selectedIndex + 1} / {item.images.length}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
