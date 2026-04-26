"use server"

import { db } from "@/db"
import { members } from "@/db/schemas/member"
import { sponsors } from "@/db/schemas/sponsors"
import { verifyAdmin } from "@/lib/session"
import { resolveImageUpload } from "@/lib/storage"
import { sponsorFormSchema, type SponsorFormData } from "@/zod/sponsor"
import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

// スポンサー回答作成（公開フォームから）
export async function createSponsor(formData: SponsorFormData) {
  const data = sponsorFormSchema.parse(formData)

  // ロゴ画像のアップロード処理
  const logoUrl = data.logoUrl
    ? await resolveImageUpload(`sponsors/${nanoid()}`, data.logoUrl)
    : null

  await db.insert(sponsors).values({
    ...data,
    companyName: data.companyName || null,
    logoUrl,
    websiteUrl: data.websiteUrl || null,
  })

  // ログイン中のユーザーがいればsponsorFormCompletedフラグを更新
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    if (session) {
      await db
        .update(members)
        .set({ sponsorFormCompleted: true })
        .where(eq(members.userId, session.user.id))
    }
  } catch {
    // セッションがない場合（未ログイン）は無視
  }
}

// スポンサーロゴ更新（管理者のみ）
export async function updateSponsorLogo(id: string, logoUrl: string | null) {
  await verifyAdmin()

  const resolvedLogoUrl = logoUrl
    ? await resolveImageUpload(`sponsors/${id}-${nanoid()}`, logoUrl)
    : null

  await db
    .update(sponsors)
    .set({ logoUrl: resolvedLogoUrl })
    .where(eq(sponsors.id, id))
}

// スポンサー企業URL更新（管理者のみ）
export async function updateSponsorWebsiteUrl(id: string, websiteUrl: string | null) {
  await verifyAdmin()

  const trimmed = websiteUrl?.trim() || null
  if (trimmed) {
    try {
      const url = new URL(trimmed)
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        throw new Error("invalid protocol")
      }
    } catch {
      throw new Error("有効なURLを入力してください")
    }
  }

  await db
    .update(sponsors)
    .set({ websiteUrl: trimmed })
    .where(eq(sponsors.id, id))
}

// スポンサー削除（管理者のみ）
export async function deleteSponsor(id: string) {
  await verifyAdmin()

  await db.delete(sponsors).where(eq(sponsors.id, id))
}
