import { forwardRef, useCallback, useRef } from "react";

type Props = {
  src: string;
  pageNumber: number;
};

const PdfPage = forwardRef<HTMLDivElement, Props>(function PdfPage(
  { src, pageNumber },
  ref
) {
  return (
    <div ref={ref} className="bg-white" data-density="soft">
      {/* eslint-disable-next-line @next/next/no-img-element -- Data URL from pdf.js canvas, not optimizable by next/image */}
      <img
        src={src}
        alt={`ページ ${pageNumber}`}
        className="w-full h-full object-cover"
        draggable={false}
      />
    </div>
  );
});

export { PdfPage };

type MobileSingleProps = {
  src: string;
  pageNumber: number;
};

const MobileSinglePage = forwardRef<HTMLDivElement, MobileSingleProps>(
  function MobileSinglePage({ src, pageNumber }, ref) {
    return (
      <div ref={ref} className="bg-black flex items-center justify-center" data-density="hard">
        {/* eslint-disable-next-line @next/next/no-img-element -- Data URL from pdf.js canvas */}
        <img
          src={src}
          alt={`ページ ${pageNumber}`}
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>
    );
  }
);

export { MobileSinglePage };

type MobileSpreadProps = {
  leftSrc: string;
  rightSrc: string;
  leftPageNum: number;
  rightPageNum: number;
  onFlipNext: () => void;
  onFlipPrev: () => void;
};

const MobileSpreadPage = forwardRef<HTMLDivElement, MobileSpreadProps>(
  function MobileSpreadPage(
    { leftSrc, rightSrc, leftPageNum, rightPageNum, onFlipNext, onFlipPrev },
    ref
  ) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const touchStartRef = useRef({
      x: 0,
      atLeftEdge: false,
      atRightEdge: false,
    });

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
      e.stopPropagation();
      const el = scrollRef.current;
      if (!el) return;

      touchStartRef.current = {
        x: e.touches[0].clientX,
        atLeftEdge: el.scrollLeft <= 1,
        atRightEdge: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1,
      };
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
      e.stopPropagation();
    }, []);

    const handleTouchEnd = useCallback(
      (e: React.TouchEvent) => {
        e.stopPropagation();
        const diff = touchStartRef.current.x - e.changedTouches[0].clientX;
        if (Math.abs(diff) < 50) return;

        if (diff < 0 && touchStartRef.current.atLeftEdge) {
          onFlipPrev();
        } else if (diff > 0 && touchStartRef.current.atRightEdge) {
          onFlipNext();
        }
      },
      [onFlipNext, onFlipPrev]
    );

    return (
      <div ref={ref} className="bg-black" data-density="soft">
        <div className="w-full h-full flex items-center">
          <div
            ref={scrollRef}
            className="w-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide"
            style={{ WebkitOverflowScrolling: "touch" }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="flex" style={{ width: "200%" }}>
              <div className="w-1/2 snap-start snap-always">
                {/* eslint-disable-next-line @next/next/no-img-element -- Data URL from pdf.js canvas */}
                <img
                  src={leftSrc}
                  alt={`ページ ${leftPageNum}`}
                  className="w-full object-contain"
                  draggable={false}
                />
              </div>
              <div className="w-1/2 snap-start snap-always">
                {/* eslint-disable-next-line @next/next/no-img-element -- Data URL from pdf.js canvas */}
                <img
                  src={rightSrc}
                  alt={`ページ ${rightPageNum}`}
                  className="w-full object-contain"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export { MobileSpreadPage };
