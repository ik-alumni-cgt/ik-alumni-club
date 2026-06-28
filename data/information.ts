import { db } from "@/db";
import { informations } from "@/db/schemas/informations";
import { eq, desc } from "drizzle-orm";
import "server-only";

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

// 公開済みお知らせに実際に付与されているカテゴリー一覧を取得（絞り込み UI 用）
export const getUsedInformationCategories = async () => {
  const items = await db.query.informations.findMany({
    where: eq(informations.published, true),
    with: {
      informationCategories: {
        with: {
          category: true,
        },
      },
    },
  });

  const byId = new Map<string, { id: string; name: string; slug: string; sortOrder: number }>();
  for (const item of items) {
    for (const ic of item.informationCategories) {
      if (ic.category) byId.set(ic.category.id, ic.category);
    }
  }

  return [...byId.values()].sort(
    (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name),
  );
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
