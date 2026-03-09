import { z } from "zod";
import { contactCategoryValues } from "@/components/contact/constants";

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "名前を入力してください")
    .max(100, "名前は100文字以内で入力してください"),
  email: z
    .string()
    .trim()
    .min(1, "メールアドレスを入力してください")
    .email("有効なメールアドレスを入力してください"),
  category: z.enum(contactCategoryValues, {
    message: "カテゴリを選択してください",
  }),
  subject: z
    .string()
    .trim()
    .min(1, "件名を入力してください")
    .max(200, "件名は200文字以内で入力してください"),
  body: z
    .string()
    .trim()
    .min(1, "お問い合わせ内容を入力してください")
    .max(5000, "お問い合わせ内容は5000文字以内で入力してください"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
