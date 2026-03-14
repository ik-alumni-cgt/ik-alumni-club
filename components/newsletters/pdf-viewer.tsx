"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePdfDocument } from "@/hooks/use-pdf-document";
import { useIsMobile } from "@/hooks/use-mobile";
import { PdfPage } from "./pdf-page";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const HTMLFlipBook = dynamic(() => import("react-pageflip"), { ssr: false });

type Props = {
  pdfUrl: string;
  title: string;
  issueNumber: number;
  onClose: () => void;
};

export function PdfViewer({ pdfUrl, title, issueNumber, onClose }: Props) {
  const isMobile = useIsMobile();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- react-pageflip does not export its instance type
  const flipBookRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  const { pages, isLoading, error, progress } = usePdfDocument(pdfUrl);

  useEffect(() => {
    setIsLayoutReady(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleFlip = useCallback((e: { data: number }) => {
    setCurrentPage(e.data);
  }, []);

  // デスクトップ用
  const goNextDesktop = useCallback(() => {
    flipBookRef.current?.pageFlip()?.flipNext();
  }, []);

  const goPrevDesktop = useCallback(() => {
    flipBookRef.current?.pageFlip()?.flipPrev();
  }, []);

  // モバイル用: スクロールでページ検出
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const pageIndex = Math.round(el.scrollLeft / el.clientWidth);
    setCurrentPage(pageIndex);
  }, []);

  if (error) {
    return (
      <div className="fixed inset-0 z-[70] bg-black/90 flex items-center justify-center">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-white hover:bg-white/20"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
        <div className="text-center text-white">
          <p>PDFの読み込みに失敗しました</p>
          <button
            onClick={onClose}
            className="underline mt-4 inline-block"
          >
            閉じる
          </button>
        </div>
      </div>
    );
  }

  if (!isLayoutReady || isLoading) {
    return (
      <div className="fixed inset-0 z-[70] bg-black/90 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-[300px] max-w-full">
            <Progress value={progress} className="h-2" />
          </div>
          <p className="text-white/70">
            PDFを読み込んでいます... {progress}%
          </p>
        </div>
      </div>
    );
  }

  // ===== モバイル: シンプルな横スライド =====
  if (isMobile && pages.length > 0) {
    return (
      <div className="fixed inset-0 z-[70] bg-black flex flex-col">
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-4 py-3 z-20">
          <div className="bg-black/60 text-white px-3 py-1 rounded-md text-sm">
            {currentPage + 1} / {pages.length}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* スライドコンテナ */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide"
          style={{ WebkitOverflowScrolling: "touch" }}
          onScroll={handleScroll}
        >
          <div className="flex h-full" style={{ width: `${pages.length * 100}%` }}>
            {pages.map((pageDataUrl, index) => (
              <div
                key={index}
                className="snap-start snap-always flex items-center justify-center"
                style={{ width: `${100 / pages.length}%` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- Data URL from pdf.js canvas */}
                <img
                  src={pageDataUrl}
                  alt={`ページ ${index + 1}`}
                  className="max-w-full max-h-full object-contain"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* フッター */}
        <div className="bg-gradient-to-t from-black/70 to-transparent p-4">
          <p className="text-white text-center text-sm">
            第{issueNumber}号: {title}
          </p>
        </div>
      </div>
    );
  }

  // ===== デスクトップ: react-pageflip =====
  const pageWidth = 500;
  const pageHeight = Math.round(pageWidth * 1.414);

  return (
    <div className="fixed inset-0 z-[70] bg-black/90 flex items-center justify-center py-12">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-white hover:bg-white/20"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>

      <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-md text-sm">
        {currentPage + 1} / {pages.length}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 text-white bg-black/50 hover:bg-black/70 h-10 w-10 sm:h-12 sm:w-12 rounded-full"
        onClick={goPrevDesktop}
        disabled={currentPage <= 0}
      >
        <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 text-white bg-black/50 hover:bg-black/70 h-10 w-10 sm:h-12 sm:w-12 rounded-full"
        onClick={goNextDesktop}
        disabled={currentPage >= pages.length - 1}
      >
        <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
      </Button>

      {pages.length > 0 && (
        <HTMLFlipBook
          ref={flipBookRef}
          width={pageWidth}
          height={pageHeight}
          size="stretch"
          minWidth={300}
          maxWidth={600}
          minHeight={424}
          maxHeight={849}
          showCover={true}
          mobileScrollSupport={true}
          onFlip={handleFlip}
          className="shadow-2xl"
          style={{}}
          usePortrait={false}
          startPage={0}
          drawShadow={true}
          flippingTime={600}
          maxShadowOpacity={0.5}
          autoSize={true}
          startZIndex={0}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={30}
          showPageCorners={true}
          disableFlipByClick={false}
        >
          {pages.map((pageDataUrl, index) => (
            <PdfPage key={index} src={pageDataUrl} pageNumber={index + 1} />
          ))}
        </HTMLFlipBook>
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <p className="text-white text-center">
          第{issueNumber}号: {title}
        </p>
      </div>
    </div>
  );
}
