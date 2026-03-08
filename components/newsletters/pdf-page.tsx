import { forwardRef } from "react";

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
        className="w-full h-full object-contain"
        draggable={false}
      />
    </div>
  );
});

export { PdfPage };
