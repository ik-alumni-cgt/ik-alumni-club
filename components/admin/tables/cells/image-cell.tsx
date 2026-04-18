"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";

type Props = {
  src: string | null;
  alt: string;
};

export function ImageCell({ src, alt }: Props) {
  if (!src) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
        <ImageIcon className="h-4 w-4 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="relative h-10 w-10 overflow-hidden rounded-md">
      <Image
        src={src}
        alt={alt}
        width={40}
        height={40}
        className="object-cover"
      />
    </div>
  );
}
