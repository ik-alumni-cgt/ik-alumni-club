"use server"

import { db } from "@/db"
import { sponsors } from "@/db/schemas/sponsors"
import { verifyAdmin } from "@/lib/session"
import { resolveImageUpload } from "@/lib/storage"
import { sponsorFormSchema, type SponsorFormData } from "@/zod/sponsor"
import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"

// スポンサー回答作成（公開フォームから）
export async function createSponsor(formData: SponsorFormData) {
  const data = sponsorFormSchema.parse(formData)

  // ロゴ画像のアップロード処理
  const logoUrl = data.logoUrl
    ? await resolveImageUpload(`sponsors/${nanoid()}`, data.logoUrl)
    : null

  await db.insert(sponsors).values({
    ...data,
    logoUrl,
  })
}

// スポンサー削除（管理者のみ）
export async function deleteSponsor(id: string) {
  await verifyAdmin()

  await db.delete(sponsors).where(eq(sponsors.id, id))
}
