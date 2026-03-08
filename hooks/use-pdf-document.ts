"use client";

import { useState, useEffect } from "react";

type UsePdfDocumentResult = {
  pages: string[];
  totalPages: number;
  isLoading: boolean;
  error: Error | null;
  progress: number;
};

export function usePdfDocument(pdfUrl: string): UsePdfDocumentResult {
  const [pages, setPages] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadPdf() {
      try {
        setIsLoading(true);
        setError(null);
        setProgress(0);

        const pdfjs = await import("pdfjs-dist");

        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url
        ).toString();

        const pdf = await pdfjs.getDocument(pdfUrl).promise;

        if (cancelled) return;

        setTotalPages(pdf.numPages);

        const pageDataUrls: string[] = [];
        const scale = 2;

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          if (!context) {
            throw new Error("Canvas context の取得に失敗しました");
          }

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({
            canvasContext: context,
            viewport,
            canvas,
          }).promise;

          if (cancelled) return;

          pageDataUrls.push(canvas.toDataURL("image/png"));
          setProgress(Math.round((i / pdf.numPages) * 100));

          canvas.width = 0;
          canvas.height = 0;
        }

        if (!cancelled) {
          setPages(pageDataUrls);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err : new Error("PDF読み込みエラー")
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadPdf();

    return () => {
      cancelled = true;
    };
  }, [pdfUrl]);

  return { pages, totalPages, isLoading, error, progress };
}
