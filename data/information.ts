import { db } from "@/db";
import { informations } from "@/db/schemas/informations";
import { categories } from "@/db/schemas/categories";
import { eq, desc, asc } from "drizzle-orm";
import "server-only";

// お知らせ絞り込みに使う親カテゴリーの名前（この名前のカテゴリーの子を候補にする）
const NEWS_PARENT_NAME = "news";

// 公開済みお知らせ一覧を取得（一般公開用）
// 会員限定コンテンツも一覧には表示（詳細ページでアクセス制御）
// categorySlug を渡すと、そのカテゴリーが付いたお知らせのみに絞り込む
export const getInformations = async (categorySlug?: string) => {
  const items = await db.query.informations.findMany({
    where: eq(informations.published, true),
    orderBy: [desc(informations.date)],
    with: {
      informationCategories: {
        with: {
          category: true,
        },
      },
    },
  });

  if (!categorySlug) return items;

  return items.filter((item) =>
    item.informationCategories.some((ic) => ic.category?.slug === categorySlug),
  );
};

// 絞り込み UI 用のカテゴリー一覧を取得
// 親カテゴリー（slug=news）の子カテゴリーのみを対象にする
export const getNewsFilterCategories = async () => {
  const parent = await db.query.categories.findFirst({
    where: eq(categories.name, NEWS_PARENT_NAME),
  });
  if (!parent) return [];

  return db.query.categories.findMany({
    where: eq(categories.parentId, parent.id),
    orderBy: [asc(categories.sortOrder), asc(categories.name)],
  });
};

// 全お知らせ一覧を取得（管理者用）
export const getAllInformations = async () => {
  return db.query.informations.findMany({
    orderBy: [desc(informations.date)],
    with: {
      informationCategories: {
        with: {
          category: true,
        },
      },
    },
  });
};

// 個別お知らせを取得
export const getInformation = async (id: string) => {
  return db.query.informations.findFirst({
    where: eq(informations.id, id),
  });
};
