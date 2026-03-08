"use server";

import { db } from "@/db";
import {
  categories,
  blogCategories,
  informationCategories,
  scheduleCategories,
  videoCategories,
  newsletterCategories,
  photoLibraryCategories,
} from "@/db/schemas/categories";
import { categoryFormSchema, type CategoryFormData } from "@/zod/category";
import { verifyAdmin } from "@/lib/session";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: CategoryFormData) {
  await verifyAdmin();
  const data = categoryFormSchema.parse(formData);

  const [newCategory] = await db
    .insert(categories)
    .values({
      ...data,
      parentId: data.parentId || null,
    })
    .returning();

  revalidatePath("/admin/categories");
  return newCategory;
}

export async function updateCategory(id: string, formData: CategoryFormData) {
  await verifyAdmin();
  const data = categoryFormSchema.parse(formData);

  const [updatedCategory] = await db
    .update(categories)
    .set({
      ...data,
      parentId: data.parentId || null,
    })
    .where(eq(categories.id, id))
    .returning();

  if (!updatedCategory) {
    throw new Error("カテゴリーが見つかりません");
  }

  revalidatePath("/admin/categories");
  return updatedCategory;
}

export async function deleteCategory(id: string) {
  await verifyAdmin();

  // 子カテゴリーの親IDをnullに更新
  await db
    .update(categories)
    .set({ parentId: null })
    .where(eq(categories.parentId, id));

  await db.delete(categories).where(eq(categories.id, id));

  revalidatePath("/admin/categories");
}

// コンテンツのカテゴリー割り当てを更新する共通関数
export async function updateBlogCategories(blogId: string, categoryIds: string[]) {
  await verifyAdmin();

  await db.delete(blogCategories).where(eq(blogCategories.blogId, blogId));

  if (categoryIds.length > 0) {
    await db.insert(blogCategories).values(
      categoryIds.map((categoryId) => ({ blogId, categoryId })),
    );
  }

  revalidatePath("/admin/blogs");
  revalidatePath("/blog");
}

export async function updateInformationCategories(informationId: string, categoryIds: string[]) {
  await verifyAdmin();

  await db.delete(informationCategories).where(eq(informationCategories.informationId, informationId));

  if (categoryIds.length > 0) {
    await db.insert(informationCategories).values(
      categoryIds.map((categoryId) => ({ informationId, categoryId })),
    );
  }

  revalidatePath("/admin/informations");
  revalidatePath("/information");
}

export async function updateScheduleCategories(scheduleId: string, categoryIds: string[]) {
  await verifyAdmin();

  await db.delete(scheduleCategories).where(eq(scheduleCategories.scheduleId, scheduleId));

  if (categoryIds.length > 0) {
    await db.insert(scheduleCategories).values(
      categoryIds.map((categoryId) => ({ scheduleId, categoryId })),
    );
  }

  revalidatePath("/admin/schedules");
  revalidatePath("/schedule");
}

export async function updateVideoCategories(videoId: string, categoryIds: string[]) {
  await verifyAdmin();

  await db.delete(videoCategories).where(eq(videoCategories.videoId, videoId));

  if (categoryIds.length > 0) {
    await db.insert(videoCategories).values(
      categoryIds.map((categoryId) => ({ videoId, categoryId })),
    );
  }

  revalidatePath("/admin/videos");
  revalidatePath("/video");
}

export async function updateNewsletterCategories(newsletterId: string, categoryIds: string[]) {
  await verifyAdmin();

  await db.delete(newsletterCategories).where(eq(newsletterCategories.newsletterId, newsletterId));

  if (categoryIds.length > 0) {
    await db.insert(newsletterCategories).values(
      categoryIds.map((categoryId) => ({ newsletterId, categoryId })),
    );
  }

  revalidatePath("/admin/newsletters");
  revalidatePath("/newsletters");
}

export async function updatePhotoLibraryCategories(photoLibraryId: string, categoryIds: string[]) {
  await verifyAdmin();

  await db.delete(photoLibraryCategories).where(eq(photoLibraryCategories.photoLibraryId, photoLibraryId));

  if (categoryIds.length > 0) {
    await db.insert(photoLibraryCategories).values(
      categoryIds.map((categoryId) => ({ photoLibraryId, categoryId })),
    );
  }

  revalidatePath("/admin/photo-library");
  revalidatePath("/photo-library");
}
