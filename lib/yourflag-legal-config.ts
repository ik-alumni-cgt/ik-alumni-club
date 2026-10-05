// yourflag リポ lib/legal-config.ts と同じ内容。ドメイン取得後は yourflag アプリ側へ一本化する
/**
 * 法的文面（プライバシーポリシー・会員規約・特定商取引法表記）の元になる事業者情報。
 * 文面は仮のもので、弁護士等の専門家の確認を経て更新する（2026-09-12 decision）。
 * 記入が済んだら PENDING を実際の値に置き換え、LEGAL_IS_DRAFT を false にする。
 */
export const LEGAL_IS_DRAFT = false;

export const PENDING = "【要記入】";

export const OPERATOR = {
  serviceName: "YOURFLAG（ユアフラッグ）",
  companyName: "細沼笙",
  representative: "細沼笙",
  address: "茨城県守谷市ひがし野3-13-9 エーデルブルク103",
  contact: `電話: 080-4799-1241 / メール: yourflag.est2026@gmail.com`,
  /** 個人情報の開示・訂正・削除などのお問い合わせ窓口 */
  privacyContact: "yourflag.est2026@gmail.com",
};

export const LEGAL_UPDATED_AT = "2026年10月5日";
