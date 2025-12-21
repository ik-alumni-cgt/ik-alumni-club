"use server";

import { db } from "@/db";
import { photoLibrary, photoLibraryImages } from "@/db/schemas/photo-library";
import { photoLibraryFormSchema, type PhotoLibraryFormData } from "@/zod/photo-library";
import { verifyAdmin } from "@/lib/session";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { resolveImageUpload } from "@/lib/storage";
import { nanoid } from "nanoid";

/**
 * フォトを新規作成
 */
export async function createPhoto(formData: PhotoLibraryFormData) {
  // 1. 管理者権限チェック
  const { userId } = await verifyAdmin();

  // 2. バリデーション
  const data = photoLibraryFormSchema.parse(formData);

  // 3. カバー画像URLの処理
  const coverImageUrl = data.coverImageUrl
    ? await resolveImageUpload(`photo-library/${nanoid()}-cover`, data.coverImageUrl)
    : null;

  // 4. データベースに挿入
  const [newPhoto] = await db
    .insert(photoLibrary)
    .values({
      title: data.title,
      description: data.description,
      coverImageUrl,
      published: data.published,
      isMemberOnly: data.isMemberOnly,
      createdBy: userId,
    })
    .returning();

  // 5. 画像を挿入
  for (let i = 0; i < data.images.length; i++) {
    const image = data.images[i];
    const imageUrl = await resolveImageUpload(`photo-library/${newPhoto.id}/${nanoid()}`, image.imageUrl);
    await db.insert(photoLibraryImages).values({
      photoLibraryId: newPhoto.id,
      imageUrl,
      caption: image.caption,
      sortOrder: i,
    });
  }

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

  // 3. カバー画像URLの処理
  const coverImageUrl = data.coverImageUrl
    ? await resolveImageUpload(`photo-library/${id}-cover`, data.coverImageUrl)
    : null;

  // 4. データベース更新
  const [updatedPhoto] = await db
    .update(photoLibrary)
    .set({
      title: data.title,
      description: data.description,
      coverImageUrl,
      published: data.published,
      isMemberOnly: data.isMemberOnly,
    })
    .where(eq(photoLibrary.id, id))
    .returning();

  if (!updatedPhoto) {
    throw new Error("フォトが見つかりません");
  }

  // 5. 既存の画像を削除
  await db.delete(photoLibraryImages).where(eq(photoLibraryImages.photoLibraryId, id));

  // 6. 新しい画像を挿入
  for (let i = 0; i < data.images.length; i++) {
    const image = data.images[i];
    const imageUrl = await resolveImageUpload(`photo-library/${id}/${nanoid()}`, image.imageUrl);
    await db.insert(photoLibraryImages).values({
      photoLibraryId: id,
      imageUrl,
      caption: image.caption,
      sortOrder: i,
    });
  }

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
