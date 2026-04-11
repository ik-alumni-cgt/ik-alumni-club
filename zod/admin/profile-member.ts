import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"
import { profileMembers } from "@/db/schemas/profile-members"

export const profileMemberFormSchema = createInsertSchema(profileMembers, {
  name: z
    .string()
    .trim()
    .min(1, "名前を入力してください")
    .max(100, "名前は100文字以内で入力してください"),
  description: z
    .string()
    .trim()
    .min(1, "紹介文を入力してください")
    .max(500, "紹介文は500文字以内で入力してください"),
  imageUrl: z
    .string()
    .optional()
    .nullable()
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
  sortOrder: z.number().int(),
  isVisible: z.boolean(),
  memberId: z.string().nullable().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export type ProfileMemberFormData = z.infer<typeof profileMemberFormSchema>
