# IK ALUMNI CGT サポーターズクラブ会員サイト

## 基本設計書

**作成日**: 2025-12-09
**バージョン**: 1.0

---

## 目次

1. [基本設計の位置づけ](#1-基本設計の位置づけ)
2. [システムの構成要素と名称](#2-システムの構成要素と名称)
3. [方式設計](#3-方式設計)
4. [Webサイト構成](#4-webサイト構成)
5. [認証・認可設計](#5-認証認可設計)
6. [データベース設計](#6-データベース設計)
7. [多言語対応設計](#7-多言語対応設計)
8. [外部サービス連携](#8-外部サービス連携)

---

## 1. 基本設計の位置づけ

### 1.1 本書の目的

- システムの基本・共通となる要素や重要な要素について記述する
- 各機能の詳細な仕様は詳細設計書にて記述する

### 1.2 関連ドキュメント

| ドキュメント | 説明 |
|-------------|------|
| 要件定義書 | システムの目的、業務要件、機能要件、非機能要件を定義 |
| 詳細設計書 | 各機能の詳細仕様を記述（今後作成予定） |
| API設計書 | API仕様を記述（今後作成予定） |
| テスト仕様書 | テストケースを記述（今後作成予定） |

---

## 2. システムの構成要素と名称

### 2.1 システム全体構成

本システムは以下の構成要素から成り立つ。

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         システム全体                                      │
│                 名称：IK ALUMNI CGT サポーターズクラブ会員サイト             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                    フロントエンド（Next.js）                         │  │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────────┐   │  │
│  │  │ 公開ページ  │  │ 認証ページ  │  │ 会員ページ  │  │ 管理者ページ   │   │  │
│  │  │  (main)   │  │  (auth)   │  │  (mypage)  │  │   (admin)    │   │  │
│  │  └───────────┘  └───────────┘  └───────────┘  └───────────────┘   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                    │                                     │
│                              API Routes                                  │
│                                    │                                     │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                    バックエンド要素                                  │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐               │  │
│  │  │ Better Auth │  │   Stripe    │  │  Supabase   │               │  │
│  │  │  (認証API)   │  │  (決済API)   │  │ (PostgreSQL) │               │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘               │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 構成要素一覧

| 要素 | 名称 | 形式 | 備考 |
|-----|------|------|------|
| **フロントエンド** | 公開ページ | Next.js App Router | 誰でもアクセス可能なページ群 |
| | 認証ページ | Next.js App Router | 会員登録・ログイン関連 |
| | 会員ページ | Next.js App Router | 会員専用エリア |
| | 管理者ページ | Next.js App Router | 管理者専用ダッシュボード |
| **バックエンド** | 認証API | Better Auth | 認証・セッション管理 |
| | 決済API | Stripe | サブスクリプション決済 |
| | データベース | Supabase (PostgreSQL) | データ永続化 |
| **ストレージ** | ファイルストレージ | Cloudflare R2 | 画像・PDFファイル保存 |
| **ホスティング** | Webホスティング | Vercel | Next.jsアプリケーションのホスト |

---

## 3. 方式設計

### 3.1 技術スタック一覧

| カテゴリ | 技術 | バージョン | 用途 |
|---------|------|-----------|------|
| **フレームワーク** | Next.js | 15.5.7 | App Router使用 |
| | React | 19.1.0 | UIライブラリ |
| | TypeScript | 5.x | 型安全な開発 |
| **スタイリング** | Tailwind CSS | 4.x | ユーティリティファーストCSS |
| **UIコンポーネント** | Radix UI | - | ヘッドレスコンポーネント |
| | shadcn/ui | - | UIコンポーネントライブラリ |
| **認証** | Better Auth | 1.3.23 | メール+パスワード認証 |
| **データベース** | PostgreSQL | - | Supabase提供 |
| | Drizzle ORM | 0.44.5 | スキーマ定義・クエリ構築 |
| **決済** | Stripe | 20.0.0 | サブスクリプション決済 |
| **多言語** | next-intl | 4.3.9 | 日本語・英語対応 |
| **フォーム** | React Hook Form | 7.63.0 | フォーム管理 |
| | Zod | 4.1.11 | バリデーション |

### 3.2 アーキテクチャ方式

| 項目 | 方式 | 備考 |
|------|------|------|
| **レンダリング** | SSR/SSG（App Router） | Server Componentsをデフォルトで使用 |
| **データ取得** | Server Actions | "use server"ディレクティブによるサーバー処理 |
| **状態管理** | React Server Components | サーバーサイドでのデータフェッチ |
| **キャッシュ** | Next.js Cache | revalidatePathによる無効化 |
| **API方式** | Route Handlers + Server Actions | RESTful API + サーバー関数 |

### 3.3 開発環境

| 項目 | 内容 |
|------|------|
| **推奨OS** | macOS / Windows / Linux |
| **推奨エディタ** | Visual Studio Code |
| **パッケージマネージャー** | pnpm |
| **バージョン管理** | Git / GitHub |
| **デプロイ** | Vercel（自動デプロイ） |
| **ブランチ戦略** | main（本番）、develop（開発） |

### 3.4 ディレクトリ構成

```
ik-alumni-club/
├── app/                          # Next.js App Router
│   ├── [locale]/                 # ロケール対応
│   │   ├── (main)/               # 公開ページ
│   │   ├── (auth)/               # 認証ページ
│   │   ├── admin/                # 管理者ページ
│   │   └── layout.tsx            # 共通レイアウト
│   ├── api/                      # API Routes
│   │   ├── auth/[...all]/        # Better Auth
│   │   └── stripe/               # Stripe Webhook
│   └── web/i18n/                 # 多言語設定
├── db/                           # データベース関連
│   ├── index.ts                  # Drizzle ORM初期化
│   ├── schemas/                  # スキーマ定義
│   └── migrations/               # マイグレーション
├── actions/                      # Server Actions
├── data/                         # データ取得関数
├── components/                   # Reactコンポーネント
│   ├── ui/                       # shadcn/uiコンポーネント
│   └── [機能別]/                  # 機能別コンポーネント
├── lib/                          # ユーティリティ
│   ├── auth.ts                   # Better Auth設定
│   ├── session.ts                # セッション管理
│   └── storage.ts                # ファイルアップロード
├── zod/                          # Zodスキーマ
├── types/                        # TypeScript型定義
├── messages/                     # 多言語メッセージ
│   ├── ja.json                   # 日本語
│   └── en.json                   # 英語
└── middleware.ts                 # Next.jsミドルウェア
```

---

## 4. Webサイト構成

### 4.1 サイト全体設定

| 項目 | 内容 | 備考 |
|------|------|------|
| **Root URL** | Vercelにより動的生成 | 本番環境ではカスタムドメイン設定可能 |
| **SSL/TLS** | Vercel提供のSSL証明書 | HTTPS通信を強制 |
| **レスポンシブ対応** | Tailwind CSSによる実装 | モバイルファースト設計 |
| **多言語対応** | ja（日本語）/ en（英語） | デフォルト: ja |

### 4.2 URL構成

#### 公開ページ

| URL | ページ名 | 説明 | アクセス権限 |
|-----|---------|------|------------|
| `/{locale}` | ホーム | トップページ | 全員 |
| `/{locale}/information` | お知らせ一覧 | お知らせ一覧表示 | 全員 |
| `/{locale}/information/[id]` | お知らせ詳細 | お知らせ詳細表示 | 全員※ |
| `/{locale}/schedule` | スケジュール一覧 | イベント一覧表示 | 全員 |
| `/{locale}/schedule/[id]` | スケジュール詳細 | イベント詳細表示 | 全員※ |
| `/{locale}/video` | 動画一覧 | 動画一覧表示 | 全員 |
| `/{locale}/video/[id]` | 動画詳細 | 動画詳細・再生 | 全員※ |
| `/{locale}/blog` | ブログ一覧 | ブログ一覧表示 | 全員 |
| `/{locale}/blog/[id]` | ブログ詳細 | ブログ詳細表示 | 全員※ |
| `/{locale}/profiles` | プロフィール一覧 | メンバー一覧 | 全員 |
| `/{locale}/supporters` | サポーター | サポーター紹介 | 全員 |

※ `isMemberOnly=true` のコンテンツは会員のみアクセス可

#### 認証ページ

| URL | ページ名 | 説明 |
|-----|---------|------|
| `/{locale}/login` | ログイン | 会員ログイン |
| `/{locale}/signup` | サインアップ | 会員登録案内 |
| `/{locale}/register/terms` | 規約同意 | 利用規約確認・同意 |
| `/{locale}/register/plan` | プラン選択 | 会員プラン選択 |
| `/{locale}/register/auth` | アカウント作成 | メール・パスワード入力 |
| `/{locale}/register/payment` | 決済 | Stripe決済 |
| `/{locale}/register/payment/success` | 決済完了 | 決済完了画面 |

#### 会員専用ページ

| URL | ページ名 | 説明 | アクセス権限 |
|-----|---------|------|------------|
| `/{locale}/mypage` | マイページ | 会員情報表示 | 会員 |
| `/{locale}/profile/complete` | プロフィール完成 | 詳細情報入力 | 会員（初回必須） |
| `/{locale}/newsletter` | ニュースレター一覧 | 会報一覧 | 会員 |
| `/{locale}/newsletter/[id]` | ニュースレター詳細 | 会報詳細 | 会員 |
| `/{locale}/subscribe` | サブスクリプション | プラン管理 | 会員 |

#### 管理者ページ

| URL | ページ名 | 説明 |
|-----|---------|------|
| `/{locale}/admin/login` | 管理者ログイン | 管理者専用ログイン |
| `/{locale}/admin/dashboard` | ダッシュボード | 管理トップ |
| `/{locale}/admin/blogs` | ブログ管理 | 一覧・新規・編集・削除 |
| `/{locale}/admin/videos` | 動画管理 | 一覧・新規・編集・削除 |
| `/{locale}/admin/schedules` | スケジュール管理 | 一覧・新規・編集・削除 |
| `/{locale}/admin/newsletters` | ニュースレター管理 | 一覧・新規・編集・削除 |
| `/{locale}/admin/informations` | お知らせ管理 | 一覧・新規・編集・削除 |
| `/{locale}/admin/accounts` | アカウント管理 | 会員一覧・詳細・編集 |

---

## 5. 認証・認可設計

### 5.1 認証方式

| 項目 | 内容 |
|------|------|
| **認証フレームワーク** | Better Auth |
| **認証方式** | メールアドレス + パスワード |
| **セッション管理** | Cookie（HTTPOnly） |
| **セッション有効期限** | Better Auth デフォルト設定に準拠 |

### 5.2 ユーザーロール

| ロール | 説明 | 権限 |
|--------|------|------|
| **admin** | 管理者 | 全機能へのアクセス、コンテンツ管理、ユーザー管理 |
| **member** | 一般会員 | 会員限定コンテンツの閲覧、マイページ機能 |

### 5.3 会員ステータス

| ステータス | 説明 | アクセス可能範囲 |
|-----------|------|----------------|
| **pending_profile** | プロフィール未完成 | プロフィール完成ページへリダイレクト |
| **active** | アクティブ会員 | 全会員機能 |
| **inactive** | 退会・停止 | 公開ページのみ |

### 5.4 決済ステータス

| ステータス | 説明 |
|-----------|------|
| **pending** | 決済待ち |
| **completed** | 決済完了 |
| **failed** | 決済失敗 |
| **canceled** | キャンセル |

### 5.5 アクセス制御関数

| 関数名 | 用途 | 戻り値 |
|--------|------|--------|
| `verifySession()` | ログイン確認 | セッション情報 or null |
| `verifyAdmin()` | 管理者権限確認 | 会員情報 or リダイレクト |
| `verifyActiveMember()` | アクティブ会員確認 | 会員情報 or リダイレクト |
| `canAccessMemberContent()` | 会員限定コンテンツアクセス確認 | boolean |
| `canAccessContent()` | プラン階層によるアクセス確認 | boolean |

### 5.6 プラン階層によるアクセス制御

```
hierarchyLevel の値が大きいほど上位プラン

例：
- 個人プラン: hierarchyLevel = 1
- ファミリープラン: hierarchyLevel = 2
- プレミアムプラン: hierarchyLevel = 3

上位プランは下位プランのコンテンツにもアクセス可能
```

---

## 6. データベース設計

### 6.1 データベース構成

| 項目 | 内容 |
|------|------|
| **データベースシステム** | PostgreSQL |
| **ホスティング** | Supabase |
| **ORM** | Drizzle ORM |
| **マイグレーション管理** | Drizzle Kit |

### 6.2 テーブル構成図

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           テーブル構成                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────┐      ┌─────────────────┐      ┌────────────────┐  │
│  │     users       │      │    members      │      │ member_plans   │  │
│  │  (Better Auth)  │1────1│                 │N────1│                │  │
│  ├─────────────────┤      ├─────────────────┤      ├────────────────┤  │
│  │ id              │      │ id              │      │ id             │  │
│  │ name            │      │ userId (FK)     │      │ planCode       │  │
│  │ email           │      │ email           │      │ planName       │  │
│  │ emailVerified   │      │ lastName        │      │ displayName    │  │
│  │ image           │      │ firstName       │      │ price          │  │
│  │ createdAt       │      │ planId (FK)     │      │ hierarchyLevel │  │
│  │ updatedAt       │      │ role            │      │ stripePriceId  │  │
│  └────────┬────────┘      │ status          │      │ isActive       │  │
│           │               │ paymentStatus   │      └────────────────┘  │
│           │               └─────────────────┘                          │
│           │                                                            │
│           │  1:N (Better Auth 関連テーブル)                             │
│           ▼                                                            │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  sessions  │  accounts  │  verifications  │  subscriptions     │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                   │                                     │
│                                   │ 1:N (authorId)                     │
│                                   ▼                                     │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      コンテンツテーブル群                          │   │
│  ├──────────────┬──────────────┬──────────────┬──────────────┬─────┤   │
│  │informations  │  schedules   │   videos     │    blogs     │news-│   │
│  │              │              │              │              │letters│  │
│  └──────────────┴──────────────┴──────────────┴──────────────┴─────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.3 主要テーブル一覧

#### 認証関連テーブル（Better Auth管理）

| テーブル名 | 説明 |
|-----------|------|
| users | ユーザーアカウント基本情報 |
| sessions | セッション情報 |
| accounts | OAuth/プロバイダアカウント |
| verifications | メール検証トークン |
| subscriptions | Stripeサブスクリプション情報 |

#### 会員管理テーブル

| テーブル名 | 説明 | 主要カラム |
|-----------|------|----------|
| members | 会員詳細情報 | userId, lastName, firstName, planId, role, status, paymentStatus |
| member_plans | 会員プランマスタ | planCode, planName, price, hierarchyLevel, stripePriceId |

#### コンテンツテーブル

| テーブル名 | 説明 | 共通カラム |
|-----------|------|----------|
| blogs | ブログ記事 | title, content, thumbnailUrl, published, isMemberOnly, authorId |
| videos | 動画 | title, videoUrl, thumbnailUrl, published, isMemberOnly, authorId |
| schedules | スケジュール | title, content, eventDate, published, isMemberOnly, authorId |
| newsletters | ニュースレター | issueNumber, title, content, pdfUrl, published, isMemberOnly |
| informations | お知らせ | date, title, content, imageUrl, published, isMemberOnly |

### 6.4 Enum定義

| Enum名 | 値 | 用途 |
|--------|-----|------|
| members_role | 'admin', 'member' | ユーザーロール |
| members_status | 'pending_profile', 'active', 'inactive' | 会員ステータス |
| payment_status | 'pending', 'completed', 'failed', 'canceled' | 決済ステータス |

---

## 7. 多言語対応設計

### 7.1 対応言語

| 言語コード | 言語名 | 備考 |
|-----------|--------|------|
| ja | 日本語 | デフォルト言語 |
| en | 英語 | - |

### 7.2 実装方式

| 項目 | 内容 |
|------|------|
| **フレームワーク** | next-intl |
| **URL方式** | パスセグメント方式（`/{locale}/...`） |
| **メッセージ管理** | JSONファイル（messages/ja.json, messages/en.json） |

### 7.3 ファイル構成

```
messages/
├── ja.json    # 日本語翻訳
└── en.json    # 英語翻訳

app/web/i18n/
├── routing.ts     # ロケール定義
├── request.ts     # リクエストハンドラ
├── navigation.ts  # ナビゲーション設定
└── set-locale.ts  # ロケール設定関数
```

### 7.4 使用方法

```typescript
// Server Component
import { useTranslations } from 'next-intl';

export default function Page() {
  const t = useTranslations('namespace');
  return <h1>{t('key')}</h1>;
}
```

---

## 8. 外部サービス連携

### 8.1 サービス一覧

| サービス | 用途 | 連携方式 |
|---------|------|---------|
| **Vercel** | ホスティング・デプロイ | Git連携による自動デプロイ |
| **Supabase** | データベース | PostgreSQL直接接続 |
| **Stripe** | 決済処理 | API + Webhook |
| **Cloudflare R2** | ファイルストレージ | AWS S3互換API |

### 8.2 Stripe連携

#### Checkout フロー

```
1. ユーザーがプランを選択
2. Server ActionでStripe Checkout Session作成
3. StripeのCheckout画面にリダイレクト
4. ユーザーが決済情報を入力
5. 決済完了後、success URLにリダイレクト
6. Webhookで決済完了イベントを受信
7. DBの会員情報を更新
```

#### Webhook イベント

| イベント | 処理内容 |
|---------|---------|
| checkout.session.completed | 顧客ID保存、会員ステータス更新 |
| customer.subscription.updated | サブスクリプション情報更新 |
| customer.subscription.deleted | サブスクリプション解約処理 |

### 8.3 Cloudflare R2連携

| 項目 | 内容 |
|------|------|
| **用途** | 画像・PDFファイルのアップロード・配信 |
| **SDK** | AWS SDK for S3 |
| **アップロードサイズ上限** | 25MB（Server Actions設定） |

### 8.4 環境変数

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SECRET_KEY
DATABASE_URL

# Better Auth
BETTER_AUTH_SECRET

# Stripe
STRIPE_PUBLIC_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET

# Cloudflare R2
CLOUDFLARE_S3_ENDPOINT
CLOUDFLARE_S3_ACCESS_KEY_ID
CLOUDFLARE_S3_SECRET_ACCESS_KEY
CLOUDFLARE_S3_BUCKET
CLOUDFLARE_S3_PUBLIC_URL
```

---

## 更新履歴

| 日付 | バージョン | 内容 | 作成者 |
|------|-----------|------|--------|
| 2025-12-09 | 1.0 | 初版作成 | - |

---

## 関連ドキュメント

- [要件定義書](./01_requirements-definition.md)
- 詳細設計書（今後作成予定）
- API設計書（今後作成予定）
- テスト仕様書（今後作成予定）
