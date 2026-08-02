import { z } from "zod";

/**
 * 会員プロフィール入力フォームのバリデーションスキーマ
 * 詳細情報（氏名、住所、電話番号）の入力に使用
 */
export const memberProfileFormSchema = z.object({
  // 氏名情報
  lastName: z.string()
    .trim()
    .min(1, "姓を入力してください")
    .max(100, "姓は100文字以内で入力してください"),

  firstName: z.string()
    .trim()
    .min(1, "名を入力してください")
    .max(100, "名は100文字以内で入力してください"),

  lastNameKana: z.string()
    .trim()
    .min(1, "セイを入力してください")
    .max(100, "セイは100文字以内で入力してください")
    .regex(/^[ァ-ヶー\s]+$/, "カタカナで入力してください"),

  firstNameKana: z.string()
    .trim()
    .min(1, "メイを入力してください")
    .max(100, "メイは100文字以内で入力してください")
    .regex(/^[ァ-ヶー\s]+$/, "カタカナで入力してください"),

  // 住所情報
  postalCode: z.string()
    .trim()
    .regex(/^\d{7}$/, "郵便番号は7桁の数字で入力してください（ハイフンなし）"),

  prefecture: z.string()
    .trim()
    .min(1, "都道府県を選択してください")
    .max(50, "都道府県は50文字以内で入力してください"),

  city: z.string()
    .trim()
    .min(1, "市区町村を入力してください")
    .max(100, "市区町村は100文字以内で入力してください"),

  address: z.string()
    .trim()
    .min(1, "町名番地を入力してください")
    .max(255, "町名番地は255文字以内で入力してください"),

  building: z.string()
    .trim()
    .max(255, "建物名は255文字以内で入力してください")
    .optional()
    .or(z.literal("")),

  // 連絡先情報
  phoneNumber: z.string()
    .trim()
    .regex(/^0\d{9,10}$/, "有効な電話番号を入力してください（ハイフンなし、10〜11桁）"),
});

export type MemberProfileFormData = z.infer<typeof memberProfileFormSchema>;

/**
 * 編集者の氏名入力フォームのバリデーションスキーマ
 * メンバーブログの利用条件は氏名のみ必須のため、姓名だけを抜き出す
 */
export const editorNameFormSchema = memberProfileFormSchema.pick({
  lastName: true,
  firstName: true,
});

export type EditorNameFormData = z.infer<typeof editorNameFormSchema>;
