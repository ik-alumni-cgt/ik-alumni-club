# Stripe年払いサブスクリプション 実装ガイド

**作成日**: 2025-11-22
**対象**: Better AuthとStripeを使った年払いサブスクリプションの実装
**参考**: [Better Auth公式ドキュメント](https://www.better-auth.com/docs/plugins/stripe)

---

## 📋 目次

1. [概要](#概要)
2. [事前準備](#事前準備)
3. [実装手順](#実装手順)
4. [カスタマーポータルの設定](#カスタマーポータルの設定)
5. [Webhookの設定](#webhookの設定)
6. [サブスクリプション状態の確認](#サブスクリプション状態の確認)
7. [テスト](#テスト)
8. [本番環境への移行](#本番環境への移行)

---

## 概要

このガイドでは、Better AuthのStripeプラグインを使用して、単純な年払いサブスクリプションを実装する方法を説明します。

### 実装する機能

- ✅ 年払いサブスクリプションの作成
- ✅ Stripe Checkoutによる決済画面
- ✅ Webhookによる決済イベントの受信と処理
- ✅ カスタマーポータルによるプラン変更・キャンセル
- ✅ サブスクリプション状態の管理

### 技術スタック

- **認証**: Better Auth
- **決済**: Stripe
- **ORM**: Drizzle ORM
- **フレームワーク**: Next.js 15 (App Router)

---

## 事前準備

### 1. Stripeアカウントの作成

1. [Stripe](https://stripe.com)にアクセスしてアカウントを作成
2. テストモードに切り替え
3. APIキーを取得:
   - ダッシュボード → 開発者 → APIキー
   - 公開可能キー（`pk_test_`で始まる）
   - シークレットキー（`sk_test_`で始まる）

### 2. 環境変数の設定

`.env.local`ファイルに以下を追加:

```env
# Stripe設定
STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Better Auth（既存）
BETTER_AUTH_SECRET=your-secret-key
```

**注意**: `.env.local`は`.gitignore`に含まれていることを確認してください。

### 3. 必要なパッケージのインストール

```bash
pnpm add stripe @better-auth/stripe
```

### 4. Stripeで商品と価格を作成

#### 方法1: Stripeダッシュボードで作成（推奨）

1. [Stripe Dashboard](https://dashboard.stripe.com/test/products) → 商品
2. 「商品を追加」をクリック
3. 商品情報を入力:
   - **名前**: 例「年間メンバーシップ」
   - **説明**: 任意
4. 料金情報を入力:
   - **料金モデル**: 定額
   - **金額**: 例 36,000円
   - **請求期間**: 年次
   - **通貨**: JPY
5. 保存後、**Price ID**（`price_xxxxx`形式）をコピー

#### 方法2: CLIで作成（オプション）

```bash
# 商品作成
stripe products create \
  --name="年間メンバーシップ" \
  --description="年間サブスクリプションプラン"

# 価格作成（商品IDを上記の結果から取得）
stripe prices create \
  --product=prod_xxxxx \
  --unit-amount=3600000 \
  --currency=jpy \
  --recurring[interval]=year
```

**金額の注意**: Stripeでは金額を**セント単位**で指定します
- 36,000円 = 3,600,000セント（`--unit-amount=3600000`）

---

## 実装手順

### ステップ1: Better Auth設定にStripeプラグインを追加

`lib/auth.ts`を編集:

```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { stripe } from "@better-auth/stripe"; // 追加
import { db } from "@/db";
import { getBaseURL } from '@/lib/get-base-url';
import * as schema from '@/db/schemas/auth';

export const auth = betterAuth({
  baseURL: getBaseURL(),
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    nextCookies(),
    stripe({
      stripeSecretKey: process.env.STRIPE_SECRET_KEY!,
      stripePublishableKey: process.env.STRIPE_PUBLIC_KEY!,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
    }),
  ]
});
```

### ステップ2: データベーススキーマの更新

Better AuthのStripeプラグインは自動的にテーブルを作成します。マイグレーションを実行:

```bash
pnpm drizzle:generate
pnpm drizzle:migrate
```

以下のテーブルが作成されます:
- `subscriptions`: サブスクリプション情報
- `stripe_customers`: Stripe顧客情報

**確認方法**:
```bash
# データベースに接続してテーブルを確認
psql $DATABASE_URL -c "\dt"
```

### ステップ3: サブスクリプション作成フローの実装

#### 3-1. サブスクリプションページの作成

`app/[locale]/subscribe/page.tsx`:

```typescript
import { SubscribeButton } from "@/components/subscribe-button";

export default function SubscribePage() {
  return (
    <div className="container mx-auto py-12 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">年間メンバーシップ</h1>

      <div className="border rounded-lg p-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold">¥36,000 / 年</h2>
          <p className="text-sm text-muted-foreground">税込</p>
        </div>

        <ul className="space-y-2 mb-6">
          <li className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            全コンテンツへのアクセス
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            限定イベントへの参加
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            プレミアムサポート
          </li>
        </ul>

        <SubscribeButton priceId="price_xxxxxxxxxxxxx" />
      </div>
    </div>
  );
}
```

#### 3-2. サブスクリプションボタンコンポーネント

`components/subscribe-button.tsx`:

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);

      // Better AuthのStripeプラグインを使用してCheckout Sessionを作成
      const response = await fetch("/api/auth/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          successUrl: `${window.location.origin}/subscribe/success`,
          cancelUrl: `${window.location.origin}/subscribe/cancel`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await response.json();

      // Stripe Checkoutページへリダイレクト
      window.location.href = url;
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("サブスクリプションの作成に失敗しました");
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSubscribe}
      disabled={isLoading}
      size="lg"
      className="w-full"
    >
      {isLoading ? "処理中..." : "年間メンバーシップに登録"}
    </Button>
  );
}
```

#### 3-3. 成功・キャンセルページの作成

`app/[locale]/subscribe/success/page.tsx`:

```typescript
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function SubscribeSuccessPage() {
  return (
    <div className="container mx-auto py-12 max-w-2xl text-center">
      <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
      <h1 className="text-3xl font-bold mb-4">登録完了</h1>
      <p className="text-muted-foreground mb-8">
        年間メンバーシップへのご登録ありがとうございます!
        <br />
        全てのコンテンツにアクセスできるようになりました。
      </p>
      <Button asChild size="lg">
        <Link href="/dashboard">ダッシュボードへ</Link>
      </Button>
    </div>
  );
}
```

`app/[locale]/subscribe/cancel/page.tsx`:

```typescript
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function SubscribeCancelPage() {
  return (
    <div className="container mx-auto py-12 max-w-2xl text-center">
      <XCircle className="w-16 h-16 text-orange-600 mx-auto mb-4" />
      <h1 className="text-3xl font-bold mb-4">キャンセルされました</h1>
      <p className="text-muted-foreground mb-8">
        サブスクリプションの登録がキャンセルされました。
        <br />
        いつでも再度お試しいただけます。
      </p>
      <Button asChild size="lg">
        <Link href="/subscribe">プランを見る</Link>
      </Button>
    </div>
  );
}
```

---

## カスタマーポータルの設定

カスタマーポータルを有効にすることで、ユーザーが自分でサブスクリプションを管理できるようになります。

### 1. Stripeダッシュボードでの設定

1. [Stripe Dashboard](https://dashboard.stripe.com/test/settings/billing/portal) → 設定 → 請求 → カスタマーポータル
2. 「有効にする」をクリック
3. サブスクリプション設定で「すべてのプランと料金」を選択
4. 以下の機能を有効化:
   - ✅ サブスクリプションのキャンセル
   - ✅ サブスクリプションの更新
   - ✅ 支払い方法の更新
5. 保存

### 2. カスタマーポータルへのリンク実装

`components/manage-subscription-button.tsx`:

```typescript
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ManageSubscriptionButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleManage = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/auth/stripe/create-portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          returnUrl: `${window.location.origin}/dashboard`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create portal session");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Portal error:", error);
      toast.error("カスタマーポータルの起動に失敗しました");
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleManage} disabled={isLoading} variant="outline">
      {isLoading ? "処理中..." : "サブスクリプションを管理"}
    </Button>
  );
}
```

`app/[locale]/dashboard/page.tsx`に追加:

```typescript
import { ManageSubscriptionButton } from "@/components/manage-subscription-button";

export default async function DashboardPage() {
  // ... 既存のコード

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">ダッシュボード</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">サブスクリプション</h2>
        <ManageSubscriptionButton />
      </div>

      {/* 他のコンテンツ */}
    </div>
  );
}
```

---

## Webhookの設定

Webhookを設定することで、Stripeでの決済イベント（支払い成功、キャンセル等）を受信できます。

### 1. ローカル開発環境でのWebhook設定

#### package.jsonにスクリプトを追加

`package.json`に以下を追加して、Webhook起動を効率化:

```json
{
  "scripts": {
    "dev": "next dev",
    "stripe:webhook": "stripe listen --forward-to http://localhost:3000/api/auth/stripe/webhook"
  }
}
```

#### Stripe CLIのインストールと設定

```bash
# Stripe CLIをインストール（macOS）
brew install stripe/stripe-cli/stripe

# Stripeにログイン
stripe login

# Webhookをローカルに転送
pnpm stripe:webhook
```

実行すると以下のような出力が表示されます:

```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

この`whsec_xxxxxxxxxxxxx`を`.env.local`の`STRIPE_WEBHOOK_SECRET`に設定します。

#### 開発の流れ

1. ターミナル1: `pnpm dev` でNext.jsサーバーを起動
2. ターミナル2: `pnpm stripe:webhook` でWebhookリスナーを起動
3. テスト決済を実行
4. Webhookイベントがリアルタイムで転送される

### 2. 本番環境でのWebhook設定

1. [Stripe Dashboard](https://dashboard.stripe.com/test/webhooks) → 開発者 → Webhook
2. 「エンドポイントを追加」をクリック
3. エンドポイントURL: `https://your-domain.com/api/auth/stripe/webhook`
4. 受信するイベントを選択:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
5. エンドポイントを追加
6. 「署名シークレット」をコピーして`.env`に設定

---

## サブスクリプション状態の確認

### 1. ユーザーのサブスクリプション状態を取得

`data/subscription.ts`:

```typescript
import "server-only";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { subscriptions } from "@/db/schemas/auth";

export async function getUserSubscription(userId: string) {
  const subscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, userId),
    orderBy: (subscriptions, { desc }) => [desc(subscriptions.createdAt)],
  });

  return subscription;
}

export async function isActiveSubscriber(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId);

  if (!subscription) {
    return false;
  }

  // Stripeのステータスが 'active' または 'trialing' の場合、有効なサブスクリプション
  return subscription.status === "active" || subscription.status === "trialing";
}
```

### 2. コンテンツアクセス制御

サブスクリプション状態に基づいてコンテンツアクセスを制御:

`lib/access-control.ts`:

```typescript
import { verifySession } from "@/lib/session";
import { isActiveSubscriber } from "@/data/subscription";
import { redirect } from "next/navigation";

export async function requireActiveSubscription() {
  const session = await verifySession();
  const userId = session.user.id;

  const hasActiveSubscription = await isActiveSubscriber(userId);

  if (!hasActiveSubscription) {
    redirect("/subscribe");
  }

  return { userId };
}
```

使用例（会員限定ページ）:

```typescript
// app/[locale]/premium-content/page.tsx
import { requireActiveSubscription } from "@/lib/access-control";

export default async function PremiumContentPage() {
  await requireActiveSubscription(); // サブスクリプションがない場合は/subscribeにリダイレクト

  return (
    <div>
      <h1>プレミアムコンテンツ</h1>
      {/* 会員限定コンテンツ */}
    </div>
  );
}
```

### 3. サブスクリプションバッジの表示

`components/subscription-badge.tsx`:

```typescript
import { getUserSubscription } from "@/data/subscription";
import { Badge } from "@/components/ui/badge";

interface SubscriptionBadgeProps {
  userId: string;
}

export async function SubscriptionBadge({ userId }: SubscriptionBadgeProps) {
  const subscription = await getUserSubscription(userId);

  if (!subscription) {
    return <Badge variant="outline">無料プラン</Badge>;
  }

  const statusMap = {
    active: { label: "アクティブ", variant: "default" as const },
    trialing: { label: "トライアル中", variant: "secondary" as const },
    past_due: { label: "支払い遅延", variant: "destructive" as const },
    canceled: { label: "キャンセル済み", variant: "outline" as const },
    incomplete: { label: "未完了", variant: "outline" as const },
  };

  const status = statusMap[subscription.status as keyof typeof statusMap] || {
    label: subscription.status,
    variant: "outline" as const,
  };

  return <Badge variant={status.variant}>{status.label}</Badge>;
}
```

---

## テスト

### 1. テストカード

Stripeのテストモードで使用できるテストカード番号:

| カード番号 | 用途 |
|----------|------|
| `4242 4242 4242 4242` | 成功 |
| `4000 0025 0000 3155` | 3Dセキュア認証が必要 |
| `4000 0000 0000 0002` | カード拒否 |
| `4000 0000 0000 9995` | 残高不足 |

**入力値**:
- カード番号: 上記のいずれか
- 有効期限: 未来の任意の日付（例: 12/34）
- CVC: 任意の3桁（例: 123）
- 郵便番号: 任意の5桁（例: 12345）

### 2. テストフロー

#### サブスクリプション作成のテスト

```bash
# ターミナル1: Next.jsサーバー起動
pnpm dev

# ターミナル2: Webhookリスナー起動
pnpm stripe:webhook
```

1. http://localhost:3000/subscribe にアクセス
2. 「年間メンバーシップに登録」をクリック
3. テストカード `4242 4242 4242 4242` で決済
4. 決済完了後、`/subscribe/success` にリダイレクト
5. Webhookリスナーで `checkout.session.completed` イベントを確認
6. データベースの `subscriptions` テーブルを確認

```bash
# データベースでサブスクリプションを確認
psql $DATABASE_URL -c "SELECT * FROM subscriptions;"
```

#### カスタマーポータルのテスト

1. http://localhost:3000/dashboard にアクセス
2. 「サブスクリプションを管理」をクリック
3. カスタマーポータルでサブスクリプションをキャンセル
4. Webhookリスナーで `customer.subscription.deleted` イベントを確認
5. データベースの `subscriptions` テーブルでステータスが更新されたことを確認

### 3. Webhookイベントのテスト

Stripe CLIを使用して手動でWebhookイベントを送信:

```bash
# checkout.session.completed イベントをトリガー
stripe trigger checkout.session.completed

# customer.subscription.deleted イベントをトリガー
stripe trigger customer.subscription.deleted
```

---

## 本番環境への移行

### 1. 本番環境のStripe設定

#### APIキーの取得

1. Stripeダッシュボードで「本番データを表示」に切り替え
2. 開発者 → APIキー → 本番環境のキーをコピー
   - 公開可能キー: `pk_live_xxxxx`
   - シークレットキー: `sk_live_xxxxx`

#### 商品と価格の作成

テストモードで作成した商品を本番モードでも作成:

1. 商品 → 商品を追加
2. テストモードと同じ設定で作成
3. Price IDをコピー（`price_xxxxx`）

### 2. 環境変数の設定

本番環境（Vercel、Netlify等）の環境変数設定:

```env
# 本番環境
STRIPE_PUBLIC_KEY=pk_live_xxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

BETTER_AUTH_SECRET=your-production-secret-key
DATABASE_URL=your-production-database-url
```

### 3. Webhookエンドポイントの設定

1. [Stripe Dashboard](https://dashboard.stripe.com/webhooks)（本番モード）
2. エンドポイントを追加
3. URL: `https://your-production-domain.com/api/auth/stripe/webhook`
4. イベント選択:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. 署名シークレットをコピーして環境変数に設定

### 4. 本番環境での確認事項

- [ ] 環境変数がすべて正しく設定されている
- [ ] Price IDが本番環境のものに更新されている
- [ ] Webhookエンドポイントが正しく設定されている
- [ ] カスタマーポータルが有効化されている
- [ ] HTTPSが有効になっている（必須）

### 5. 本番環境テスト

本番環境でも、少額の実際の決済でテストすることを推奨:

1. 実際のクレジットカードで決済
2. Webhookイベントが正しく受信されることを確認
3. サブスクリプションが正しく作成されることを確認
4. カスタマーポータルでキャンセルできることを確認
5. **重要**: テスト後、サブスクリプションをキャンセル

---

## トラブルシューティング

### 問題1: Webhookが受信されない

**症状**: 決済は成功するが、データベースにサブスクリプションが作成されない

**解決策**:
1. Webhook署名シークレットが正しく設定されているか確認
2. WebhookエンドポイントのURLが正しいか確認（`/api/auth/stripe/webhook`）
3. ローカル開発では `pnpm stripe:webhook` が起動しているか確認
4. Stripeダッシュボードの Webhook → イベント履歴 でエラーを確認

### 問題2: 環境変数が読み込まれない

**症状**: `STRIPE_SECRET_KEY is undefined` エラー

**解決策**:
1. `.env.local` ファイルが存在し、正しい場所にあるか確認
2. Next.jsサーバーを再起動（環境変数の変更後は必須）
3. `process.env.STRIPE_SECRET_KEY!` のように `!` を付けて型エラーを回避

### 問題3: カスタマーポータルにアクセスできない

**症状**: カスタマーポータルボタンをクリックしてもエラー

**解決策**:
1. Stripeダッシュボードでカスタマーポータルが有効化されているか確認
2. サブスクリプションが存在するか確認（データベースの`subscriptions`テーブル）
3. `returnUrl`が正しく設定されているか確認

---

## まとめ

このガイドに従うことで、以下を実装できました:

- ✅ Better AuthのStripeプラグインを使用したサブスクリプション管理
- ✅ 年払いサブスクリプションの作成フロー
- ✅ Stripe Checkoutによる安全な決済画面
- ✅ Webhookによるイベント処理
- ✅ カスタマーポータルによる自己管理機能
- ✅ サブスクリプション状態に基づくアクセス制御

### 次のステップ

実装をさらに拡張する場合:

- [ ] 複数のプラン（月払い、年払い等）の追加
- [ ] トライアル期間の設定
- [ ] クーポン・割引コードの実装
- [ ] メール通知（支払い失敗、キャンセル等）
- [ ] 請求書のダウンロード機能
- [ ] 使用量ベースの課金

---

**参考リンク**:

- [Better Auth - Stripe Plugin](https://www.better-auth.com/docs/plugins/stripe)
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
