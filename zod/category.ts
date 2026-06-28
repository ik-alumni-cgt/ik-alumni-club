import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { categories } from "@/db/schemas/categories";

export const categoryFormSchema = createInsertSchema(categories, {
  name: z
    .string()
    .trim()
    .min(1, "カテゴリー名を入力してください")
    .max(100, "カテゴリー名は100文字以内で入力してください"),
  slug: z
    .string()
    .trim()
    .min(1, "スラッグを入力してください")
    .max(100, "スラッグは100文字以内で入力してください")
    .regex(/^[a-z0-9-]+$/, "スラッグは半角英数字とハイフンのみ使用できます"),
  parentId: z.string().nullable().optional(),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "色は #RRGGBB 形式で指定してください")
    .nullable()
    .optional(),
  sortOrder: z.number().int(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;
