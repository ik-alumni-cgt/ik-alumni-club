import "server-only";
import { db } from "@/db";
import { photoLibrary } from "@/db/schemas/photo-library";
import { and, desc, eq, sql } from "drizzle-orm";

/**
 * 公開されているフォトライブラリ一覧を取得（一般ユーザー向け）
 * 会員限定コンテンツも一覧には表示（詳細ページでアクセス制御）
 */
export const getPublishedPhotos = async () => {
  return db.query.photoLibrary.findMany({
    where: eq(photoLibrary.published, true),
    orderBy: [desc(sql`COALESCE(${photoLibrary.publishedAt}, ${photoLibrary.createdAt})`)],
    with: {
      creator: true,
      images: {
        orderBy: (images, { asc }) => [asc(images.sortOrder)],
      },
    },
  });
};

/**
 * 一般公開フォトライブラリ一覧を取得（isMemberOnly = false のみ）
 */
export const getPublicPhotos = async () => {
  return db.query.photoLibrary.findMany({
    where: and(
      eq(photoLibrary.published, true),
      eq(photoLibrary.isMemberOnly, false)
    ),
    orderBy: [desc(sql`COALESCE(${photoLibrary.publishedAt}, ${photoLibrary.createdAt})`)],
    with: {
      creator: true,
      images: {
        orderBy: (images, { asc }) => [asc(images.sortOrder)],
      },
    },
  });
};

/**
 * 会員限定フォトライブラリ一覧を取得（isMemberOnly = true のみ）
 */
export const getMemberOnlyPhotos = async () => {
  return db.query.photoLibrary.findMany({
    where: and(
      eq(photoLibrary.published, true),
      eq(photoLibrary.isMemberOnly, true)
    ),
    orderBy: [desc(sql`COALESCE(${photoLibrary.publishedAt}, ${photoLibrary.createdAt})`)],
    with: {
      creator: true,
      images: {
        orderBy: (images, { asc }) => [asc(images.sortOrder)],
      },
    },
  });
};

/**
 * 全てのフォトライブラリ一覧を取得（管理者向け）
 */
export const getAllPhotos = async () => {
  return db.query.photoLibrary.findMany({
    orderBy: [desc(sql`COALESCE(${photoLibrary.publishedAt}, ${photoLibrary.createdAt})`)],
    with: {
      creator: true,
      images: {
        orderBy: (images, { asc }) => [asc(images.sortOrder)],
      },
    },
  });
};

/**
 * IDで特定のフォトを取得
 */
export const getPhoto = async (id: string) => {
  return db.query.photoLibrary.findFirst({
    where: eq(photoLibrary.id, id),
    with: {
      creator: true,
      images: {
        orderBy: (images, { asc }) => [asc(images.sortOrder)],
      },
    },
  });
};

/**
 * 人気のフォトを取得
 */
export const getPopularPhotos = async (limit: number = 5) => {
  return db.query.photoLibrary.findMany({
    where: eq(photoLibrary.published, true),
    orderBy: [desc(photoLibrary.viewCount)],
    limit,
    with: {
      images: {
        orderBy: (images, { asc }) => [asc(images.sortOrder)],
        limit: 1,
      },
    },
  });
};

/**
 * 最新のフォトを取得（ホーム画面用）
 */
export const getRecentPhotos = async (limit: number = 6) => {
  return db.query.photoLibrary.findMany({
    where: eq(photoLibrary.published, true),
    orderBy: [desc(sql`COALESCE(${photoLibrary.publishedAt}, ${photoLibrary.createdAt})`)],
    limit,
    with: {
      images: {
        orderBy: (images, { asc }) => [asc(images.sortOrder)],
        limit: 1,
      },
    },
  });
};
