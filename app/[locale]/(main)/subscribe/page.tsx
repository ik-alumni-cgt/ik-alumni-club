import { SubscribeButton } from "@/components/subscribe-button";
import { CheckCircle } from "lucide-react";

export default function SubscribePage() {
  return (
    <div className="container mx-auto py-12 max-w-4xl px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">年間メンバーシップ</h1>
        <p className="text-muted-foreground text-lg">
          IK ALUMNI CGT サポーターズクラブに参加して、限定コンテンツにアクセス
        </p>
      </div>

      <div className="grid md:grid-cols-1 gap-8 max-w-2xl mx-auto">
        <div className="border rounded-lg p-8 shadow-lg">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">年間プラン</h2>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">¥36,000</span>
              <span className="text-muted-foreground">/ 年</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">税込</p>
          </div>

          <ul className="space-y-4 mb-8">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>全てのブログ・動画コンテンツへのアクセス</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>会員限定イベントへの参加</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>ニュースレターの配信</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>プレミアムサポート</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>いつでもキャンセル可能</span>
            </li>
          </ul>

          <div className="space-y-4">
            <SubscribeButton
              priceId="price_1SsFKvFyvqHGbm7Rl0qwmXjx"
              mode="subscription"
              description="毎年自動更新されます"
            />
            <SubscribeButton
              priceId="price_1SsMW0FyvqHGbm7RavWqX97G"
              mode="payment"
              description="1年間有効・更新時は再度お支払いが必要です"
            />
          </div>
        </div>
      </div>

      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>安全なStripe決済を使用しています</p>
        <p className="mt-2">ご不明な点がございましたら、お問い合わせください</p>
      </div>
    </div>
  );
}
