"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

export function PdfViewerToolbar({
  currentPage,
  totalPages,
  onPrev,
  onNext,
}: Props) {
  return (
    <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onPrev}
        disabled={currentPage <= 0}
        className="text-white hover:bg-white/20"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <span className="text-white text-sm min-w-[80px] text-center">
        {currentPage + 1} / {totalPages}
      </span>

      <Button
        variant="ghost"
        size="icon"
        onClick={onNext}
        disabled={currentPage >= totalPages - 1}
        className="text-white hover:bg-white/20"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
