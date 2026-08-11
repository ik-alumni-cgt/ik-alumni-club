import "server-only";
import { db } from "@/db";
import { photoLibrary } from "@/db/schemas/photo-library";
import { and, desc, eq, sql } from "drizzle-orm";
import type { PhotoLibraryGroup } from "@/types/photo-library";

/**
 * 会員限定フォトライブラリで 1 つに束ねるグループの定義
 * categoryNames をすべて持つアルバムを 1 グループとして扱う（AND 条件）
 * slug はカテゴリページの URL に使う
 * 新しい発表会を束ねたくなったら、この配列に 1 件追加する
 */
const PHOTO_LIBRARY_GROUPS = [
  {
    slug: "happyokai-2026",
    title: "発表会2026",
    categoryNames: ["CONCERT", "2026"],
  },
];


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
 * 会員限定フォトライブラリをカテゴリ付きで取得（isMemberOnly = true のみ）
 */
const findMemberOnlyPhotosWithCategories = async () => {
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
      photoLibraryCategories: {
        with: {
          category: true,
        },
      },
    },
  });
};

type MemberOnlyPhoto = Awaited<ReturnType<typeof findMemberOnlyPhotosWithCategories>>[number];

const belongsToGroup = (photo: MemberOnlyPhoto, categoryNames: string[]) => {
  const names = photo.photoLibraryCategories.map((pc) => pc.category.name.toLowerCase());
  return categoryNames.every((name) => names.includes(name.toLowerCase()));
};

/**
 * 会員限定フォトライブラリ一覧を、集約グループと単体アルバムに分けて取得
 * グループに属するアルバムは albums に含めない（一覧ではグループカードに集約する）
 */
export const getMemberOnlyPhotoSections = async () => {
  const photos = await findMemberOnlyPhotosWithCategories();

  const groups: PhotoLibraryGroup[] = PHOTO_LIBRARY_GROUPS.map((group) => ({
    slug: group.slug,
    title: group.title,
    albums: photos.filter((photo) => belongsToGroup(photo, group.categoryNames)),
  })).filter((group) => group.albums.length > 0);

  const groupedIds = new Set(groups.flatMap((group) => group.albums.map((album) => album.id)));
  const albums = photos.filter((photo) => !groupedIds.has(photo.id));

  return { groups, albums };
};

/**
 * slug から集約グループとそのアルバムを取得（会員限定のカテゴリページ用）
 * 定義がない、または該当アルバムが 0 件の場合は undefined
 */
export const getPhotoLibraryGroup = async (slug: string): Promise<PhotoLibraryGroup | undefined> => {
  const group = PHOTO_LIBRARY_GROUPS.find((g) => g.slug === slug);
  if (!group) {
    return undefined;
  }

  const photos = await findMemberOnlyPhotosWithCategories();
  const albums = photos.filter((photo) => belongsToGroup(photo, group.categoryNames));
  if (albums.length === 0) {
    return undefined;
  }

  return { slug: group.slug, title: group.title, albums };
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
      photoLibraryCategories: {
        with: {
          category: true,
        },
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
