"use client";

import { cn } from "@/lib/utils";
import { ImagePlus, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

type Props = {
  aspectRatio?: number;
  resultWidth: number;
  onImagesAdded: (images: string[]) => void;
};

export function InputMultipleImages({
  aspectRatio = 4 / 3,
  resultWidth,
  onImagesAdded,
}: Props) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const processImages = useCallback(
    async (files: File[]) => {
      console.log("[InputMultipleImages] Processing files:", files.length);
      setIsProcessing(true);
      setTotalCount(files.length);
      setProcessedCount(0);

      const processedImages: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`[InputMultipleImages] Processing file ${i + 1}:`, file.name, file.type, file.size);
        try {
          const dataUrl = await readFileAsDataUrl(file);
          console.log(`[InputMultipleImages] DataURL length:`, dataUrl.length);
          const resizedImage = await resizeImage(
            dataUrl,
            resultWidth,
            resultWidth / aspectRatio
          );
          console.log(`[InputMultipleImages] Resized image length:`, resizedImage.length);
          processedImages.push(resizedImage);
          setProcessedCount(i + 1);
        } catch (error) {
          console.error(`[InputMultipleImages] Failed to process image ${file.name}:`, error);
        }
      }

      console.log("[InputMultipleImages] Calling onImagesAdded with", processedImages.length, "images");
      setIsProcessing(false);
      if (processedImages.length > 0) {
        onImagesAdded(processedImages);
      }
    },
    [aspectRatio, resultWidth, onImagesAdded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    // ファイルサイズ制限なし（リサイズで対応）
    multiple: true,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif", ".heic", ".heif"],
    },
    useFsAccessApi: false,
    disabled: isProcessing,
    onDropAccepted: (files) => {
      console.log("[InputMultipleImages] onDropAccepted called with", files.length, "files");
      processImages(files);
    },
    onDropRejected: (rejectedFiles) => {
      console.log("[InputMultipleImages] onDropRejected:", rejectedFiles);
      toast.error("対応していないファイル形式です", {
        description: "JPEG, PNG, WebP, GIF形式の画像を選択してください",
      });
    },
  });

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
        "hover:border-primary hover:bg-primary/5",
        isDragActive && "border-primary bg-primary/10",
        isProcessing && "cursor-not-allowed opacity-50"
      )}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {isProcessing ? (
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            処理中... ({processedCount}/{totalCount})
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <ImagePlus className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium">
            クリックまたはドラッグ&ドロップで画像を追加
          </p>
          <p className="text-xs text-muted-foreground">
            複数選択可能（JPEG, PNG, WebP / 最大4MB）
          </p>
        </div>
      )}
    </div>
  );
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function resizeImage(
  imageSrc: string,
  maxWidth: number,
  _maxHeight: number
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  // Calculate dimensions maintaining original aspect ratio
  let width = image.width;
  let height = image.height;

  // 幅がmaxWidthより大きい場合のみリサイズ
  if (width > maxWidth) {
    height = Math.round((height * maxWidth) / width);
    width = maxWidth;
  }

  canvas.width = width;
  canvas.height = height;

  // 高品質なリサイズのための設定
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(image, 0, 0, width, height);

  // 品質を調整してファイルサイズを抑える
  return canvas.toDataURL("image/jpeg", 0.8);
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = document.createElement("img");
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });
}
