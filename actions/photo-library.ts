"use server";

import { db } from "@/db";
import { photoLibrary, photoLibraryImages } from "@/db/schemas/photo-library";
import { photoLibraryFormSchema, type PhotoLibraryFormData } from "@/zod/photo-library";
import { verifyAdmin } from "@/lib/session";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { generatePresignedPutUrl, type PresignedPutUrlResult } from "@/lib/storage";
import { nanoid } from "nanoid";

/**
 * Presigned PUT URL を一括生成する
 * クライアントはこのURLに直接PUTしてR2にアップロードする（サーバー経由なし）
 */
export async function generatePresignedUrls(
  requests: { contentType: string }[]
): Promise<PresignedPutUrlResult[]> {
  await verifyAdmin();

  if (requests.length > 100) {
    throw new Error("一度にアップロードできる画像は100枚までです");
  }

  return Promise.all(
    requests.map((req) =>
      generatePresignedPutUrl({
        key: `photo-library/${nanoid()}`,
        contentType: req.contentType,
      })
    )
  );
}

/**
 * フォトを新規作成
 */
export async function createPhoto(formData: PhotoLibraryFormData) {
  // 1. 管理者権限チェック
  const { userId } = await verifyAdmin();

  // 2. バリデーション
  const data = photoLibraryFormSchema.parse(formData);

  // 3. データベースに挿入（画像URLはクライアントがR2に直接アップロード済み）
  const [newPhoto] = await db
    .insert(photoLibrary)
    .values({
      title: data.title,
      description: data.description,
      coverImageUrl: data.coverImageUrl || null,
      published: data.published,
      isMemberOnly: data.isMemberOnly,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
      createdBy: userId,
    })
    .returning();

  // 4. 画像URLをDBに並列挿入
  await Promise.all(
    data.images.map(async (image, i) => {
      await db.insert(photoLibraryImages).values({
        photoLibraryId: newPhoto.id,
        imageUrl: image.imageUrl,
        caption: image.caption,
        sortOrder: i,
      });
    })
  );

  // 6. キャッシュ再検証
  revalidatePath("/admin/photo-library");
  revalidatePath("/photo-library");

  return newPhoto;
}

/**
 * フォトを更新
 */
export async function updatePhoto(id: string, formData: PhotoLibraryFormData) {
  // 1. 管理者権限チェック
  await verifyAdmin();

  // 2. バリデーション
  const data = photoLibraryFormSchema.parse(formData);

  // 3. データベース更新（画像URLはクライアントがR2に直接アップロード済み）
  const [updatedPhoto] = await db
    .update(photoLibrary)
    .set({
      title: data.title,
      description: data.description,
      coverImageUrl: data.coverImageUrl || null,
      published: data.published,
      isMemberOnly: data.isMemberOnly,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
    })
    .where(eq(photoLibrary.id, id))
    .returning();

  if (!updatedPhoto) {
    throw new Error("フォトが見つかりません");
  }

  // 4. 既存の画像を削除
  await db.delete(photoLibraryImages).where(eq(photoLibraryImages.photoLibraryId, id));

  // 5. 新しい画像URLをDBに並列挿入
  await Promise.all(
    data.images.map(async (image, i) => {
      await db.insert(photoLibraryImages).values({
        photoLibraryId: id,
        imageUrl: image.imageUrl,
        caption: image.caption,
        sortOrder: i,
      });
    })
  );

  // 7. キャッシュ再検証
  revalidatePath("/admin/photo-library");
  revalidatePath("/photo-library");
  revalidatePath(`/photo-library/${id}`);

  return updatedPhoto;
}

/**
 * フォトを削除
 */
export async function deletePhoto(id: string) {
  // 1. 管理者権限チェック
  await verifyAdmin();

  // 2. データベースから削除（画像はCASCADEで自動削除）
  await db.delete(photoLibrary).where(eq(photoLibrary.id, id));

  // 3. キャッシュ再検証
  revalidatePath("/admin/photo-library");
  revalidatePath("/photo-library");
}

/**
 * 閲覧数をインクリメント
 */
export async function incrementPhotoViewCount(id: string) {
  // 権限チェック不要（一般ユーザーも実行可能）
  await db
    .update(photoLibrary)
    .set({
      viewCount: sql`${photoLibrary.viewCount} + 1`,
    })
    .where(eq(photoLibrary.id, id));

  revalidatePath(`/photo-library/${id}`);
}

/**
 * フォトの公開状態を切り替え
 */
export async function togglePhotoPublish(id: string, published: boolean) {
  await verifyAdmin();

  await db
    .update(photoLibrary)
    .set({ published })
    .where(eq(photoLibrary.id, id));

  revalidatePath("/admin/photo-library");
  revalidatePath("/photo-library");
}
