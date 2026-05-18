"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputImageSimple } from "@/components/input-image-simple";
import { InputMultipleImages } from "@/components/input-multiple-images";
import { generateHeroPresignedUrls, saveHeroSlides } from "@/actions/hero-slide";
import type { HeroSlide } from "@/types/hero-slide";
import type { HeroSlideType } from "@/zod/hero-slide";

// 背景画像のクライアントリサイズ後の幅
const BACKGROUND_RESULT_WIDTH = 1920;

type SlideItem = {
  // React のリスト描画用のローカルキー
  key: string;
  // http URL（既存・アップロード済み）または data URL（未アップロード）
  imageUrl: string;
  linkUrl: string;
};

type Props = {
  type: HeroSlideType;
  initialSlides: HeroSlide[];
};

export function HeroSlidesManager({ type, initialSlides }: Props) {
  const isCarousel = type === "carousel";

  const [slides, setSlides] = useState<SlideItem[]>(() =>
    initialSlides.map((slide) => ({
      key: slide.id,
      imageUrl: slide.imageUrl,
      linkUrl: slide.linkUrl ?? "",
    }))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateSlide = (index: number, patch: Partial<SlideItem>) => {
    setSlides((prev) =>
      prev.map((slide, i) => (i === index ? { ...slide, ...patch } : slide))
    );
  };

  const removeSlide = (index: number) => {
    setSlides((prev) => prev.filter((_, i) => i !== index));
  };

  const moveSlide = (index: number, direction: -1 | 1) => {
    setSlides((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const addCarouselSlot = () => {
    setSlides((prev) => [
      ...prev,
      { key: makeKey(), imageUrl: "", linkUrl: "" },
    ]);
  };

  const handleBulkAdd = useCallback((imageUrls: string[]) => {
    setSlides((prev) => [
      ...prev,
      ...imageUrls.map((url) => ({
        key: makeKey(),
        imageUrl: url,
        linkUrl: "",
      })),
    ]);
    toast.success(`${imageUrls.length}枚の画像を追加しました`);
  }, []);

  const handleSave = async () => {
    if (slides.some((slide) => !slide.imageUrl)) {
      toast.error("画像が未選択の項目があります");
      return;
    }
    if (isCarousel) {
      const invalidIndex = slides.findIndex(
        (slide) => !isValidHttpUrl(slide.linkUrl)
      );
      if (invalidIndex !== -1) {
        toast.error(
          `${invalidIndex + 1}番目の画像のリンク先URLが正しくありません`
        );
        return;
      }
    }

    setIsSubmitting(true);
    try {
      // 未アップロード（data URL）の画像だけ抽出
      const pendingUploads = slides.filter((slide) =>
        slide.imageUrl.startsWith("data:")
      );

      const presignedResults =
        pendingUploads.length > 0
          ? await generateHeroPresignedUrls(
              pendingUploads.map((slide) => ({
                contentType: getDataUrlMime(slide.imageUrl),
              }))
            )
          : [];

      // R2 へクライアントから直接アップロード
      await Promise.all(
        presignedResults.map(async (result, i) => {
          const blob = dataUrlToBlob(pendingUploads[i].imageUrl);
          const response = await fetch(result.presignedUrl, {
            method: "PUT",
            body: blob,
            headers: { "Content-Type": blob.type },
          });
          if (!response.ok) {
            throw new Error(
              `画像のアップロードに失敗しました (${response.status})`
            );
          }
        })
      );

      // data URL を公開 URL に差し替え
      let uploadIndex = 0;
      const resolvedSlides = slides.map((slide) => {
        if (slide.imageUrl.startsWith("data:")) {
          const publicUrl = presignedResults[uploadIndex].publicUrl;
          uploadIndex++;
          return { imageUrl: publicUrl, linkUrl: slide.linkUrl };
        }
        return { imageUrl: slide.imageUrl, linkUrl: slide.linkUrl };
      });

      await saveHeroSlides({ type, slides: resolvedSlides });

      // ローカル状態も公開 URL に置き換える（再保存時の二重アップロード防止）
      setSlides(
        resolvedSlides.map((slide) => ({ key: makeKey(), ...slide }))
      );
      toast.success("保存しました");
    } catch (error) {
      toast.error("保存に失敗しました");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {isCarousel ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addCarouselSlot}
        >
          <Plus className="mr-2 h-4 w-4" />
          画像を1枚追加
        </Button>
      ) : (
        <InputMultipleImages
          resultWidth={BACKGROUND_RESULT_WIDTH}
          onImagesAdded={handleBulkAdd}
        />
      )}

      {slides.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          画像がありません。
          {isCarousel
            ? "「画像を1枚追加」から追加してください。"
            : "上のエリアから画像を追加してください。"}
        </p>
      ) : (
        <ul className="space-y-3">
          {slides.map((slide, index) => (
            <li key={slide.key} className="flex gap-4 rounded-lg border p-4">
              <div className="flex flex-col items-center justify-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={index === 0}
                  onClick={() => moveSlide(index, -1)}
                  aria-label="上へ移動"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <span className="text-xs text-muted-foreground">
                  {index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={index === slides.length - 1}
                  onClick={() => moveSlide(index, 1)}
                  aria-label="下へ移動"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 space-y-3">
                {isCarousel ? (
                  <>
                    <InputImageSimple
                      width={280}
                      aspectRatio={16 / 9}
                      value={slide.imageUrl}
                      onChange={(value) =>
                        updateSlide(index, { imageUrl: value })
                      }
                    />
                    <div className="space-y-1">
                      <label className="text-sm font-medium">
                        リンク先URL
                      </label>
                      <Input
                        type="url"
                        placeholder="https://..."
                        value={slide.linkUrl}
                        onChange={(e) =>
                          updateSlide(index, { linkUrl: e.target.value })
                        }
                      />
                    </div>
                  </>
                ) : (
                  <div className="relative aspect-video w-[280px] overflow-hidden rounded-md bg-muted">
                    <Image
                      src={slide.imageUrl}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                      sizes="280px"
                    />
                  </div>
                )}
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={() => removeSlide(index)}
                aria-label="削除"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <Button type="button" onClick={handleSave} disabled={isSubmitting}>
          {isSubmitting ? "保存中..." : "保存"}
        </Button>
      </div>
    </div>
  );
}

function makeKey(): string {
  return Math.random().toString(36).slice(2);
}

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function getDataUrlMime(dataUrl: string): string {
  return dataUrl.match(/^data:(.*?);base64,/)?.[1] ?? "image/jpeg";
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(",");
  const mimeType = header?.match(/:(.*?);/)?.[1] ?? "image/jpeg";
  const binary = atob(base64 ?? "");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mimeType });
}
