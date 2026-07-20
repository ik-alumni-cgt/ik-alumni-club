import "server-only";
import { db } from "@/db";
import { blogs } from "@/db/schemas/blogs";
import { and, desc, eq, sql } from "drizzle-orm";


/**
 * 公開されているブログ一覧を取得（一般ユーザー向け）
 * 会員限定コンテンツも一覧には表示（詳細ページでアクセス制御）
 */
export const getPublishedBlogs = async () => {
  return db.query.blogs.findMany({
    where: eq(blogs.published, true),
    orderBy: [desc(sql`COALESCE(${blogs.publishedAt}, ${blogs.createdAt})`)],
    with: {
      author: true,
    },
  });
};

/**
 * 一般公開ブログ一覧を取得（isMemberOnly = false のみ）
 */
export const getPublicBlogs = async () => {
  return db.query.blogs.findMany({
    where: and(eq(blogs.published, true), eq(blogs.isMemberOnly, false)),
    orderBy: [desc(sql`COALESCE(${blogs.publishedAt}, ${blogs.createdAt})`)],
    with: {
      author: true,
    },
  });
};

/**
 * 会員限定ブログ一覧を取得（isMemberOnly = true のみ）
 */
export const getMemberOnlyBlogs = async () => {
  return db.query.blogs.findMany({
    where: and(eq(blogs.published, true), eq(blogs.isMemberOnly, true)),
    orderBy: [desc(sql`COALESCE(${blogs.publishedAt}, ${blogs.createdAt})`)],
    with: {
      author: true,
    },
  });
};

/**
 * 全てのブログ一覧を取得（管理者向け）
 */
export const getAllBlogs = async () => {
  return db.query.blogs.findMany({
    orderBy: [desc(sql`COALESCE(${blogs.publishedAt}, ${blogs.createdAt})`)],
    with: {
      author: true,
      blogCategories: {
        with: {
          category: true,
        },
      },
    },
  });
};

/**
 * 特定の執筆者（authorId）の全記事を取得
 * team_member の執筆エリア（/team-blog）で自分の記事のみ表示するために使用
 */
export const getBlogsByAuthor = async (authorId: string) => {
  return db.query.blogs.findMany({
    where: eq(blogs.authorId, authorId),
    orderBy: [desc(sql`COALESCE(${blogs.publishedAt}, ${blogs.createdAt})`)],
    with: {
      author: true,
      blogCategories: {
        with: {
          category: true,
        },
      },
    },
  });
};

/**
 * IDで特定のブログを取得
 */
export const getBlog = async (id: string) => {
  return db.query.blogs.findFirst({
    where: eq(blogs.id, id),
    with: {
      author: true,
    },
  });
};

/**
 * 最新記事を取得（ホーム画面用）
 * 会員限定コンテンツも一覧には表示（詳細ページでアクセス制御）
 */
export const getRecentBlogs = async (limit: number = 3) => {
  return db.query.blogs.findMany({
    where: eq(blogs.published, true),
    orderBy: [desc(sql`COALESCE(${blogs.publishedAt}, ${blogs.createdAt})`)],
    limit,
  });
};
