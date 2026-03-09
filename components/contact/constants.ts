export const contactCategoryValues = [
  "membership",
  "payment",
  "event",
  "withdrawal",
  "other",
] as const;

export type ContactCategory = (typeof contactCategoryValues)[number];

export const CONTACT_CATEGORY_LABELS: Record<ContactCategory, string> = {
  membership: "会員登録について",
  payment: "会費・決済について",
  event: "イベントについて",
  withdrawal: "退会について",
  other: "その他",
};
