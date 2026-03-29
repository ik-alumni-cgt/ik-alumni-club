"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePdfDocument } from "@/hooks/use-pdf-document";
import { PdfPage } from "./pdf-page";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight, RotateCw, X } from "lucide-react";

const HTMLFlipBook = dynamic(() => import("react-pageflip"), { ssr: false });

type Props = {
  pdfUrl: string;
  title: string;
  issueNumber: number;
  onClose: () => void;
};

export function PdfViewer({ pdfUrl, title, issueNumber, onClose }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- react-pageflip does not export its instance type
  const flipBookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  const { pages, isLoading, error, progress } = usePdfDocument(pdfUrl);
  const [isPortrait, setIsPortrait] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [windowHeight, setWindowHeight] = useState(600);

  useEffect(() => {
    setIsLayoutReady(true);
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
    setWindowHeight(window.innerHeight);

    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // モバイル縦向き検知
  useEffect(() => {
    if (!isTouchDevice) return;

    const mql = window.matchMedia("(orientation: portrait)");
    setIsPortrait(mql.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsPortrait(e.matches);
    };
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, [isTouchDevice]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleFlip = useCallback((e: { data: number }) => {
    setCurrentPage(e.data);
  }, []);

  const goNext = useCallback(() => {
    flipBookRef.current?.pageFlip()?.flipNext();
  }, []);

  const goPrev = useCallback(() => {
    flipBookRef.current?.pageFlip()?.flipPrev();
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

  // ===== flipbook表示（PC・スマホ共通） =====
  // py-12 = 48px * 2 = 96px分の余白を引いた利用可能高さから算出
  const availableHeight = windowHeight - 96;
  const pageHeight = Math.min(availableHeight, 849);
  const pageWidth = Math.round(pageHeight / 1.414);

  return (
    <div className="fixed inset-0 z-[70] bg-black/90 flex items-center justify-center py-12">
      {/* タッチデバイス縦向き時の横向き促進オーバーレイ */}
      {isTouchDevice && isPortrait && (
        <div className="absolute inset-0 z-30 bg-black/90 flex flex-col items-center justify-center gap-6 text-white">
          <RotateCw className="h-16 w-16 animate-spin" style={{ animationDuration: "3s" }} />
          <p className="text-lg font-medium">
            スマートフォンを横向きにしてご覧ください
          </p>
          <p className="text-sm text-white/60">
            横向きにすると、より見やすく表示されます
          </p>
        </div>
      )}

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
        onClick={goPrev}
        disabled={currentPage <= 0}
      >
        <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 text-white bg-black/50 hover:bg-black/70 h-10 w-10 sm:h-12 sm:w-12 rounded-full"
        onClick={goNext}
        disabled={currentPage >= pages.length - 1}
      >
        <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
      </Button>

      {pages.length > 0 && (
        <HTMLFlipBook
          key={windowHeight}
          ref={flipBookRef}
          width={pageWidth}
          height={pageHeight}
          size="stretch"
          minWidth={Math.round(pageHeight / 1.414)}
          maxWidth={Math.round(pageHeight / 1.414)}
          minHeight={pageHeight}
          maxHeight={pageHeight}
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
