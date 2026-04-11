"use server";

import { db } from "@/db";
import { blogs } from "@/db/schemas/blogs";
import { blogFormSchema, type BlogFormData } from "@/zod/blog";
import { verifyAdmin } from "@/lib/session";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { resolveImageUpload } from "@/lib/storage";
import { nanoid } from "nanoid";

/**
 * ブログ記事を新規作成
 */
export async function createBlog(formData: BlogFormData) {
  // 1. 管理者権限チェック
  const { userId } = await verifyAdmin();

  // 2. バリデーション
  const data = blogFormSchema.parse(formData);

  // 3. ユーザー情報取得（authorName設定用）
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
  });

  if (!user) {
    throw new Error("ユーザーが見つかりません");
  }

  // 4. 画像URLの処理（dataURLの場合はアップロード）
  const thumbnailUrl = data.thumbnailUrl
    ? await resolveImageUpload(`blogs/${nanoid()}`, data.thumbnailUrl)
    : null;

  // 5. データベースに挿入
  const [newBlog] = await db
    .insert(blogs)
    .values({
      ...data,
      thumbnailUrl,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
      authorId: userId,
      authorName: user.name,
    })
    .returning();

  // 6. キャッシュ再検証
  revalidatePath("/admin/blogs");
  revalidatePath("/blogs");

  return newBlog;
}

/**
 * ブログ記事を更新
 */
export async function updateBlog(id: string, formData: BlogFormData) {
  // 1. 管理者権限チェック
  await verifyAdmin();

  // 2. バリデーション
  const data = blogFormSchema.parse(formData);

  // 3. 画像URLの処理（dataURLの場合はアップロード）
  const thumbnailUrl = data.thumbnailUrl
    ? await resolveImageUpload(`blogs/${id}`, data.thumbnailUrl)
    : null;

  // 4. データベース更新
  const [updatedBlog] = await db
    .update(blogs)
    .set({
      ...data,
      thumbnailUrl,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
    })
    .where(eq(blogs.id, id))
    .returning();

  if (!updatedBlog) {
    throw new Error("ブログが見つかりません");
  }

  // 5. キャッシュ再検証
  revalidatePath("/admin/blogs");
  revalidatePath("/blogs");
  revalidatePath(`/blogs/${id}`);

  return updatedBlog;
}

/**
 * ブログ記事を削除
 */
export async function deleteBlog(id: string) {
  // 1. 管理者権限チェック
  await verifyAdmin();

  // 2. データベースから削除
  await db.delete(blogs).where(eq(blogs.id, id));

  // 3. キャッシュ再検証
  revalidatePath("/admin/blogs");
  revalidatePath("/blogs");
}

/**
 * ブログの公開状態を切り替え
 */
export async function toggleBlogPublish(id: string, published: boolean) {
  await verifyAdmin();

  await db
    .update(blogs)
    .set({ published })
    .where(eq(blogs.id, id));

  revalidatePath("/admin/blogs");
  revalidatePath("/blogs");
}
