import { sponsors } from "@/db/schemas/sponsors"
import { z } from "zod"
import { createInsertSchema } from "drizzle-zod"

export const sponsorFormSchema = createInsertSchema(sponsors, {
  companyName: z
    .string()
    .trim()
    .min(1, "会社名を入力してください")
    .max(255, "会社名は255文字以内で入力してください"),
  logoUrl: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === "") return true
        try {
          new URL(val)
          return true
        } catch {
          return val.startsWith("data:")
        }
      },
      { message: "有効な画像を選択してください" }
    ),
  websiteUrl: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => {
        if (!val || val === "") return true
        try {
          const url = new URL(val)
          return url.protocol === "http:" || url.protocol === "https:"
        } catch {
          return false
        }
      },
      { message: "有効なURLを入力してください（例: https://example.com）" }
    ),
  representativeName: z
    .string()
    .trim()
    .min(1, "代表者名を入力してください")
    .max(255, "代表者名は255文字以内で入力してください"),
  hasFlag: z.boolean(),
  programConsent: z
    .boolean()
    .refine((val) => val === true, "プログラム掲載への同意が必要です"),
  websiteConsent: z
    .boolean()
    .refine((val) => val === true, "ホームページ掲載への同意が必要です"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export type SponsorFormData = z.infer<typeof sponsorFormSchema>
