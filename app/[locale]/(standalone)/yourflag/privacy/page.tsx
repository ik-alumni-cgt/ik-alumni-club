import { LegalPage, legalMetadata } from "@/components/yourflag/legal-page"
import { OPERATOR } from "@/lib/yourflag-legal-config"

export const metadata = legalMetadata("プライバシーポリシー")

export default function PrivacyPage() {
  return (
    <LegalPage
      title="プライバシーポリシー"
      intro={`${OPERATOR.companyName}（以下「運営」）は、${OPERATOR.serviceName}（以下「本サービス」）で取り扱う個人情報について、次のとおり取り扱います。`}
      sections={[
        {
          heading: "運営者の情報",
          body: (
            <>
              <p>運営者: {OPERATOR.companyName}</p>
              <p>所在地: {OPERATOR.address}</p>
              <p>個人情報のお問い合わせ窓口: {OPERATOR.privacyContact}</p>
            </>
          ),
        },
        {
          heading: "取得する情報",
          body: (
            <ul className="list-disc space-y-1 pl-5">
              <li>お名前、メールアドレス</li>
              <li>入会する団体が申込フォームで設定した項目（住所、電話番号、卒業年度、応援メッセージなど）への回答</li>
              <li>会員種別、会員期間、お支払いの状況</li>
              <li>プライバシーポリシーと会員規約に同意した日時</li>
              <li>アクセスの状況（利用端末、閲覧ページなど）とエラーの情報</li>
            </ul>
          ),
        },
        {
          heading: "決済に関する情報の取り扱い",
          body: (
            <p>
              カード番号などの決済に関する情報は、決済代行会社（Stripe, Inc.）が取得します。本サービスは、これらの情報を保存しません。
            </p>
          ),
        },
        {
          heading: "利用目的",
          body: (
            <ul className="list-disc space-y-1 pl-5">
              <li>入会の受付、会員の管理、会費のお支払いの確認と精算のため</li>
              <li>入会完了、会費の自動更新のお知らせなど、会員の皆さまへの連絡のため</li>
              <li>不正な利用の防止と、お問い合わせへの対応のため</li>
              <li>本サービスの品質の向上と、障害の調査のため</li>
            </ul>
          ),
        },
        {
          heading: "団体と運営による閲覧",
          body: (
            <>
              <p>ご入会いただいた情報は、入会先の団体の管理者が、会員名簿として閲覧・管理します。</p>
              <p className="font-bold">
                また、運営は、本サービスの運用とサポートのため、すべての団体の会員名簿を閲覧できる構造になっています。
              </p>
            </>
          ),
        },
        {
          heading: "第三者への提供と委託",
          body: (
            <>
              <p>法令に基づく場合を除き、ご本人の同意なく個人情報を第三者へ提供しません。</p>
              <p>本サービスの提供のため、次の事業者に取り扱いを委託または利用しています。</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>決済: Stripe, Inc.</li>
                <li>メールの送信: Resend</li>
                <li>システムの稼働とデータの保管: Vercel Inc.、Supabase Inc.</li>
                <li>エラーの監視: Sentry</li>
                <li>アクセス解析: Google LLC（Google アナリティクス）</li>
              </ul>
            </>
          ),
        },
        {
          heading: "保管期間",
          body: <p>個人情報は、利用目的を達成するまで、および法令で定められた期間保管し、不要になったときは削除します。</p>,
        },
        {
          heading: "開示・訂正・削除のご請求",
          body: (
            <p>
              ご自身の個人情報の開示、訂正、削除などをご希望の場合は、上記の窓口までご連絡ください。ご本人であることを確認のうえ、対応します。
            </p>
          ),
        },
        {
          heading: "改定",
          body: <p>本ポリシーの内容は、必要に応じて改定します。改定した場合は、本ページでお知らせします。</p>,
        },
      ]}
    />
  )
}
