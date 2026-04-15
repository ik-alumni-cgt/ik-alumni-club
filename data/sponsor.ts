import { db } from "@/db"
import { sponsors } from "@/db/schemas/sponsors"
import { eq, desc } from "drizzle-orm"
import "server-only"

// 全スポンサー回答一覧を取得（管理者用）
export const getAllSponsors = async () => {
  return db.query.sponsors.findMany({
    orderBy: [desc(sponsors.createdAt)],
  })
}

// ホームページ掲載同意済みスポンサーを取得
export const getWebsiteConsentedSponsors = async () => {
  return db.query.sponsors.findMany({
    where: eq(sponsors.websiteConsent, true),
    orderBy: [desc(sponsors.createdAt)],
  })
}

// 個別スポンサー回答を取得
export const getSponsor = async (id: string) => {
  return db.query.sponsors.findFirst({
    where: eq(sponsors.id, id),
  })
}
