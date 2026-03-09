import { pastEvents } from "@/db/schemas/past-events";
import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

export const pastEventFormSchema = createInsertSchema(pastEvents, {
  title: z
    .string()
    .trim()
    .min(1, "タイトルを入力してください")
    .max(255, "タイトルは255文字以内で入力してください"),
  description: z.string().trim().min(1, "説明文を入力してください"),
  eventDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, "日時を正しく入力してください"),
  imageUrl: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === "") return true;
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: "有効なURLを入力してください" }
    ),
  published: z.boolean(),
  isMemberOnly: z.boolean(),
}).omit({
  id: true,
  authorId: true,
  authorName: true,
  authorEmail: true,
  createdAt: true,
  updatedAt: true,
});
