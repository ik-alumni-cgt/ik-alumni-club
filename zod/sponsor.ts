import { sponsors } from "@/db/schemas/sponsors"
import { z } from "zod"
import { createInsertSchema } from "drizzle-zod"

export const sponsorFormSchema = createInsertSchema(sponsors, {
  companyName: z
    .string()
    .trim()
    .max(255, "会社名は255文字以内で入力してください")
    .optional(),
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
  representativeName: z
    .string()
    .trim()
    .min(1, "代表者名を入力してください")
    .max(255, "代表者名は255文字以内で入力してください"),
  hasFlag: z.boolean(),
  programConsent: z.boolean(),
  websiteConsent: z.boolean(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export type SponsorFormData = z.infer<typeof sponsorFormSchema>
