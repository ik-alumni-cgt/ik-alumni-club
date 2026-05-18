"use server";

import { db } from "@/db";
import { heroSlides } from "@/db/schemas/hero-slides";
import { verifyAdmin } from "@/lib/session";
import {
  generatePresignedPutUrl,
  type PresignedPutUrlResult,
} from "@/lib/storage";
import { saveHeroSlidesSchema, type SaveHeroSlidesData } from "@/zod/hero-slide";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

/**
 * ヒーロー画像アップロード用の Presigned PUT URL を一括生成する
 * クライアントはこのURLに直接PUTしてR2にアップロードする
 */
export async function generateHeroPresignedUrls(
  requests: { contentType: string }[]
): Promise<PresignedPutUrlResult[]> {
  await verifyAdmin();

  if (requests.length > 100) {
    throw new Error("一度にアップロードできる画像は100枚までです");
  }

  return Promise.all(
    requests.map((req) =>
      generatePresignedPutUrl({
        key: `hero/${nanoid()}`,
        contentType: req.contentType,
      })
    )
  );
}

/**
 * 指定 type のヒーロー画像を一括保存する
 * 既存行を全削除し、渡された順序で再登録する
 * （追加・差し替え・削除・並び替え・リンク編集を一括反映）
 */
export async function saveHeroSlides(formData: SaveHeroSlidesData) {
  await verifyAdmin();

  const data = saveHeroSlidesSchema.parse(formData);

  await db.transaction(async (tx) => {
    await tx.delete(heroSlides).where(eq(heroSlides.type, data.type));

    if (data.slides.length > 0) {
      await tx.insert(heroSlides).values(
        data.slides.map((slide, index) => ({
          type: data.type,
          imageUrl: slide.imageUrl,
          linkUrl: slide.linkUrl || null,
          sortOrder: index,
        }))
      );
    }
  });

  revalidatePath("/");
  revalidatePath("/admin/hero-carousel");
  revalidatePath("/admin/hero-background");
}
