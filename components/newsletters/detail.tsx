"use client";

import Image from "next/image";
import { useState } from "react";
import { PdfViewer } from "./pdf-viewer";

type Newsletter = {
  id: string;
  issueNumber: number;
  title: string;
  excerpt: string;
  content: string;
  thumbnailUrl: string | null;
  pdfUrl: string | null;
  authorName: string | null;
  category: string | null;
  viewCount: number;
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export function NewsletterDetail({ item }: { item: Newsletter }) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  return (
    <article className="flex flex-col gap-8 max-w-4xl mx-auto">
      <header>
        <div className="text-sm font-medium text-white/80 mb-2">
          第{item.issueNumber}号
          {item.category && ` - ${item.category}`}
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl mb-4">{item.title}</h1>
        <div className="flex items-center gap-4 text-sm text-white/70">
          {item.authorName && <span>著者: {item.authorName}</span>}
          <span>
            {new Date(item.publishedAt ?? item.createdAt).toLocaleDateString("ja-JP")}
          </span>
        </div>
      </header>

      {item.thumbnailUrl && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
          <Image
            src={item.thumbnailUrl}
            alt={item.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="prose prose-lg prose-invert max-w-none">
        <p className="text-xl text-white/80 mb-8">{item.excerpt}</p>
        <div className="whitespace-pre-wrap">{item.content}</div>
      </div>

      {item.pdfUrl && (
        <div className="mt-6 p-4 bg-white/10 rounded-lg flex items-center gap-4">
          <button
            onClick={() => setIsViewerOpen(true)}
            className="text-white hover:text-white/80 underline font-medium"
          >
            PDFを閲覧する
          </button>
          <a
            href={item.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white/80 text-sm underline"
          >
            ダウンロード
          </a>
        </div>
      )}

      {isViewerOpen && item.pdfUrl && (
        <PdfViewer
          pdfUrl={item.pdfUrl}
          title={item.title}
          issueNumber={item.issueNumber}
          onClose={() => setIsViewerOpen(false)}
        />
      )}
    </article>
  );
}
