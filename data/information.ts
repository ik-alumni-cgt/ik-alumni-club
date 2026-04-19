import { db } from "@/db";
import { informations } from "@/db/schemas/informations";
import { eq, desc } from "drizzle-orm";
import "server-only";

// 公開済みお知らせ一覧を取得（一般公開用）
// 会員限定コンテンツも一覧には表示（詳細ページでアクセス制御）
export const getInformations = async () => {
  return db.query.informations.findMany({
    where: eq(informations.published, true),
    orderBy: [desc(informations.date)],
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
