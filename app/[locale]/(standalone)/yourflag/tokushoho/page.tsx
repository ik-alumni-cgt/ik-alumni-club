import { LegalPage, legalMetadata } from "@/components/yourflag/legal-page"
import { OPERATOR } from "@/lib/yourflag-legal-config"

export const metadata = legalMetadata("特定商取引法に基づく表記")

export default function TokushohoPage() {
  return (
    <LegalPage
      title="特定商取引法に基づく表記"
      sections={[
        { heading: "販売事業者", body: <p>{OPERATOR.companyName}</p> },
        { heading: "運営統括責任者", body: <p>{OPERATOR.representative}</p> },
        { heading: "所在地", body: <p>{OPERATOR.address}</p> },
        { heading: "お問い合わせ先", body: <p>{OPERATOR.contact}</p> },
        {
          heading: "販売価格",
          body: <p>会員種別ごとの会費（年額）は、各団体のページに表示されたとおりです。消費税の扱いは、各団体のページの表示に従います。</p>,
        },
        {
          heading: "お支払い方法",
          body: <p>クレジットカード、Apple Pay、Google Pay。</p>,
        },
        {
          heading: "お支払い時期",
          body: (
            <>
              <p>お申し込みのときにお支払いが確定します。</p>
              <p>2 年目以降は、会員期間の更新日に自動でお支払いが行われます。</p>
            </>
          ),
        },
        {
          heading: "サービスの提供時期",
          body: <p>お支払いの確認が取れたときから、会員としての資格が始まります。</p>,
        },
        {
          heading: "返品・キャンセル",
          body: <p>お支払い済みの会費の返金は、入会先の団体が可否を判断します。詳細は会員規約をご覧ください。</p>,
        },
      ]}
    />
  )
}
