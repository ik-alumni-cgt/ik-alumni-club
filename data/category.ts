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
  pastEventCategories,
} from "@/db/schemas/categories";
import { blogs } from "@/db/schemas/blogs";
import { videos } from "@/db/schemas/videos";
import { informations } from "@/db/schemas/informations";
import { schedules } from "@/db/schemas/schedules";
import { asc, eq, inArray, and, isNull, desc } from "drizzle-orm";
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

export const getPastEventCategoryIds = async (pastEventId: string) => {
  const rows = await db.query.pastEventCategories.findMany({
    where: eq(pastEventCategories.pastEventId, pastEventId),
  });
  return rows.map((r) => r.categoryId);
};

export type RelatedContentItem = {
  id: string;
  title: string;
  contentType: "blog" | "video" | "information" | "schedule";
  thumbnailUrl: string | null;
  date: Date;
  isMemberOnly: boolean;
};

/**
 * カテゴリーIDに紐づく関連コンテンツ（Blog, Video, Information, Schedule）を取得
 */
export const getRelatedContentByCategoryIds = async (
  categoryIds: string[],
): Promise<RelatedContentItem[]> => {
  if (categoryIds.length === 0) return [];

  // 各コンテンツタイプのIDをカテゴリーから取得
  const [blogRows, videoRows, infoRows, scheduleRows] = await Promise.all([
    db.query.blogCategories.findMany({
      where: inArray(blogCategories.categoryId, categoryIds),
    }),
    db.query.videoCategories.findMany({
      where: inArray(videoCategories.categoryId, categoryIds),
    }),
    db.query.informationCategories.findMany({
      where: inArray(informationCategories.categoryId, categoryIds),
    }),
    db.query.scheduleCategories.findMany({
      where: inArray(scheduleCategories.categoryId, categoryIds),
    }),
  ]);

  const blogIds = [...new Set(blogRows.map((r) => r.blogId))];
  const videoIds = [...new Set(videoRows.map((r) => r.videoId))];
  const infoIds = [...new Set(infoRows.map((r) => r.informationId))];
  const scheduleIds = [...new Set(scheduleRows.map((r) => r.scheduleId))];

  // 各コンテンツの詳細を取得（公開済みのみ）
  const [blogItems, videoItems, infoItems, scheduleItems] = await Promise.all([
    blogIds.length > 0
      ? db.query.blogs.findMany({
          where: and(inArray(blogs.id, blogIds), eq(blogs.published, true)),
          orderBy: [desc(blogs.createdAt)],
        })
      : Promise.resolve([]),
    videoIds.length > 0
      ? db.query.videos.findMany({
          where: and(inArray(videos.id, videoIds), eq(videos.published, true)),
          orderBy: [desc(videos.videoDate)],
        })
      : Promise.resolve([]),
    infoIds.length > 0
      ? db.query.informations.findMany({
          where: and(inArray(informations.id, infoIds), eq(informations.published, true)),
          orderBy: [desc(informations.date)],
        })
      : Promise.resolve([]),
    scheduleIds.length > 0
      ? db.query.schedules.findMany({
          where: and(inArray(schedules.id, scheduleIds), eq(schedules.published, true)),
          orderBy: [desc(schedules.eventDate)],
        })
      : Promise.resolve([]),
  ]);

  // 統一型に変換
  const results: RelatedContentItem[] = [
    ...blogItems.map((b) => ({
      id: b.id,
      title: b.title,
      contentType: "blog" as const,
      thumbnailUrl: b.thumbnailUrl,
      date: b.createdAt,
      isMemberOnly: b.isMemberOnly,
    })),
    ...videoItems.map((v) => ({
      id: v.id,
      title: v.title,
      contentType: "video" as const,
      thumbnailUrl: v.thumbnailUrl,
      date: new Date(v.videoDate),
      isMemberOnly: v.isMemberOnly,
    })),
    ...infoItems.map((i) => ({
      id: i.id,
      title: i.title,
      contentType: "information" as const,
      thumbnailUrl: i.imageUrl,
      date: new Date(i.date),
      isMemberOnly: i.isMemberOnly,
    })),
    ...scheduleItems.map((s) => ({
      id: s.id,
      title: s.title,
      contentType: "schedule" as const,
      thumbnailUrl: s.imageUrl,
      date: s.eventDate,
      isMemberOnly: s.isMemberOnly,
    })),
  ];

  // 日付の新しい順でソート
  return results.sort((a, b) => b.date.getTime() - a.date.getTime());
};
