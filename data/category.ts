import "server-only";
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
import { asc, eq, isNull } from "drizzle-orm";
import type { CategoryWithChildren } from "@/types/category";

export const getAllCategories = async () => {
  return db.query.categories.findMany({
    orderBy: [asc(categories.sortOrder), asc(categories.name)],
  });
};

export const getCategory = async (id: string) => {
  return db.query.categories.findFirst({
    where: eq(categories.id, id),
  });
};

export const getCategoriesTree = async (): Promise<CategoryWithChildren[]> => {
  const allCategories = await db.query.categories.findMany({
    orderBy: [asc(categories.sortOrder), asc(categories.name)],
  });

  const parentCategories = allCategories.filter((c) => !c.parentId);
  return parentCategories.map((parent) => ({
    ...parent,
    children: allCategories.filter((c) => c.parentId === parent.id),
  }));
};

export const getParentCategories = async () => {
  return db.query.categories.findMany({
    where: isNull(categories.parentId),
    orderBy: [asc(categories.sortOrder), asc(categories.name)],
  });
};

export const getBlogCategoryIds = async (blogId: string) => {
  const rows = await db.query.blogCategories.findMany({
    where: eq(blogCategories.blogId, blogId),
  });
  return rows.map((r) => r.categoryId);
};

export const getInformationCategoryIds = async (informationId: string) => {
  const rows = await db.query.informationCategories.findMany({
    where: eq(informationCategories.informationId, informationId),
  });
  return rows.map((r) => r.categoryId);
};

export const getScheduleCategoryIds = async (scheduleId: string) => {
  const rows = await db.query.scheduleCategories.findMany({
    where: eq(scheduleCategories.scheduleId, scheduleId),
  });
  return rows.map((r) => r.categoryId);
};

export const getVideoCategoryIds = async (videoId: string) => {
  const rows = await db.query.videoCategories.findMany({
    where: eq(videoCategories.videoId, videoId),
  });
  return rows.map((r) => r.categoryId);
};

export const getNewsletterCategoryIds = async (newsletterId: string) => {
  const rows = await db.query.newsletterCategories.findMany({
    where: eq(newsletterCategories.newsletterId, newsletterId),
  });
  return rows.map((r) => r.categoryId);
};

export const getPhotoLibraryCategoryIds = async (photoLibraryId: string) => {
  const rows = await db.query.photoLibraryCategories.findMany({
    where: eq(photoLibraryCategories.photoLibraryId, photoLibraryId),
  });
  return rows.map((r) => r.categoryId);
};
