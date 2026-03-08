"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePdfDocument } from "@/hooks/use-pdf-document";
import { useIsMobile } from "@/hooks/use-mobile";
import { PdfPage } from "./pdf-page";
import { PdfViewerToolbar } from "./pdf-viewer-toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const HTMLFlipBook = dynamic(() => import("react-pageflip"), { ssr: false });

type Props = {
  pdfUrl: string;
  title: string;
  issueNumber: number;
  newsletterId: string;
};

export function PdfViewer({ pdfUrl, title, issueNumber, newsletterId }: Props) {
  const isMobile = useIsMobile();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- react-pageflip does not export its instance type
  const flipBookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  const { pages, totalPages, isLoading, error, progress } =
    usePdfDocument(pdfUrl);

  useEffect(() => {
    setIsLayoutReady(true);
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
      <div className="text-center text-white py-20">
        <p>PDFの読み込みに失敗しました</p>
        <Link
          href={`/newsletter/${newsletterId}`}
          className="underline mt-4 inline-block"
        >
          詳細ページに戻る
        </Link>
      </div>
    );
  }

  if (!isLayoutReady || isLoading) {
    return (
      <div className="flex flex-col items-center gap-4 py-10">
        <Skeleton className="w-[600px] max-w-full h-[800px] bg-white/20" />
        <div className="w-[300px] max-w-full">
          <Progress value={progress} className="h-2" />
        </div>
        <p className="text-white/70">PDFを読み込んでいます... {progress}%</p>
      </div>
    );
  }

  const pageWidth = isMobile
    ? Math.min(window.innerWidth - 32, 400)
    : 500;
  const pageHeight = Math.round(pageWidth * 1.414);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full flex items-center justify-between px-4">
        <Link
          href={`/newsletter/${newsletterId}`}
          className="text-white hover:text-white/80 flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          戻る
        </Link>
        <h2 className="text-white text-lg font-medium truncate mx-4">
          第{issueNumber}号: {title}
        </h2>
        <div />
      </div>

      <div className="flex items-center justify-center">
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
            usePortrait={isMobile}
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
              <PdfPage
                key={index}
                src={pageDataUrl}
                pageNumber={index + 1}
              />
            ))}
          </HTMLFlipBook>
        )}
      </div>

      <PdfViewerToolbar
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={goPrev}
        onNext={goNext}
      />
    </div>
  );
}
