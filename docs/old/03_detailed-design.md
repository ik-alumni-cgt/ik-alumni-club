# IK ALUMNI CGT サポーターズクラブ会員サイト

## 詳細設計書

**作成日**: 2025-12-10
**バージョン**: 1.0

---

## 目次

1. [詳細設計の位置づけ](#1-詳細設計の位置づけ)
2. [データベース詳細設計](#2-データベース詳細設計)
3. [画面設計](#3-画面設計)
4. [Server Actions設計](#4-server-actions設計)
5. [API設計](#5-api設計)
6. [バリデーション設計](#6-バリデーション設計)
7. [認証・認可詳細設計](#7-認証認可詳細設計)
8. [コンポーネント設計](#8-コンポーネント設計)

---

## 1. 詳細設計の位置づけ

### 1.1 本書の目的

- 基本設計で定義した要素の詳細仕様を記述する
- 各機能の実装に必要な情報を提供する
- 画面項目、バリデーションルール、処理フローを明確化する

### 1.2 関連ドキュメント

| ドキュメント | 説明 |
|-------------|------|
| 要件定義書 | システムの目的、業務要件、機能要件、非機能要件を定義 |
| 基本設計書 | システムの基本・共通となる要素を記述 |
| テスト仕様書 | テストケースを記述（今後作成予定） |

---

## 2. データベース詳細設計

### 2.1 usersテーブル（認証基盤）

Better Authが管理するユーザー認証テーブル

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| id | text | NO | - | プライマリキー |
| name | text | NO | - | ユーザー名（表示名） |
| email | text | NO | - | メールアドレス（ユニーク） |
| email_verified | boolean | NO | false | メール認証済みフラグ |
| image | text | YES | null | プロフィール画像URL |
| created_at | timestamp | NO | now() | 作成日時 |
| updated_at | timestamp | NO | now() | 更新日時 |
| is_anonymous | boolean | YES | null | 匿名ユーザーフラグ |
| stripe_customer_id | text | YES | null | StripeカスタマーID |

**インデックス**
- PRIMARY KEY (id)
- UNIQUE (email)

---

### 2.2 sessionsテーブル

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| id | text | NO | - | プライマリキー |
| expires_at | timestamp | NO | - | セッション有効期限 |
| token | text | NO | - | セッショントークン（ユニーク） |
| created_at | timestamp | NO | now() | 作成日時 |
| updated_at | timestamp | NO | now() | 更新日時 |
| ip_address | text | YES | null | IPアドレス |
| user_agent | text | YES | null | ユーザーエージェント |
| user_id | text | NO | - | ユーザーID（FK → users.id） |

**インデックス**
- PRIMARY KEY (id)
- UNIQUE (token)
- INDEX (user_id)

**外部キー制約**
- user_id → users.id (ON DELETE CASCADE)

---

### 2.3 accountsテーブル

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| id | text | NO | - | プライマリキー |
| account_id | text | NO | - | アカウントID |
| provider_id | text | NO | - | プロバイダID |
| user_id | text | NO | - | ユーザーID（FK → users.id） |
| access_token | text | YES | null | アクセストークン |
| refresh_token | text | YES | null | リフレッシュトークン |
| id_token | text | YES | null | IDトークン |
| access_token_expires_at | timestamp | YES | null | アクセストークン有効期限 |
| refresh_token_expires_at | timestamp | YES | null | リフレッシュトークン有効期限 |
| scope | text | YES | null | スコープ |
| password | text | YES | null | ハッシュ化パスワード |
| created_at | timestamp | NO | now() | 作成日時 |
| updated_at | timestamp | NO | now() | 更新日時 |

**インデックス**
- PRIMARY KEY (id)
- INDEX (user_id)

**外部キー制約**
- user_id → users.id (ON DELETE CASCADE)

---

### 2.4 verificationsテーブル

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| id | text | NO | - | プライマリキー |
| identifier | text | NO | - | 識別子（メールアドレス等） |
| value | text | NO | - | 検証値（トークン） |
| expires_at | timestamp | NO | - | 有効期限 |
| created_at | timestamp | NO | now() | 作成日時 |
| updated_at | timestamp | NO | now() | 更新日時 |

**インデックス**
- PRIMARY KEY (id)
- INDEX (identifier)

---

### 2.5 subscriptionsテーブル

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| id | text | NO | - | プライマリキー |
| plan | text | NO | - | プラン名 |
| reference_id | text | NO | - | 参照ID |
| stripe_customer_id | text | YES | null | StripeカスタマーID |
| stripe_subscription_id | text | YES | null | StripeサブスクリプションID |
| status | text | YES | 'incomplete' | ステータス |
| period_start | timestamp | YES | null | 期間開始日 |
| period_end | timestamp | YES | null | 期間終了日 |
| trial_start | timestamp | YES | null | トライアル開始日 |
| trial_end | timestamp | YES | null | トライアル終了日 |
| cancel_at_period_end | boolean | YES | false | 期間終了時キャンセルフラグ |
| seats | integer | YES | null | シート数 |

---

### 2.6 member_plansテーブル

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| id | serial | NO | auto | プライマリキー |
| plan_code | varchar(50) | NO | - | プランコード（ユニーク） |
| plan_name | varchar(100) | NO | - | プラン内部名 |
| display_name | varchar(100) | NO | - | 表示名 |
| description | text | YES | null | プラン説明 |
| price | decimal(10,2) | NO | - | 月額料金 |
| hierarchy_level | integer | NO | - | 階層レベル（大きいほど上位） |
| is_business_plan | boolean | YES | false | 法人プランフラグ |
| features | jsonb | YES | null | 機能一覧（JSON配列） |
| color | varchar(20) | YES | null | 表示カラーコード |
| is_active | boolean | NO | true | 有効フラグ |
| stripe_price_id | varchar(255) | YES | null | Stripe価格ID |
| created_at | timestamp | NO | now() | 作成日時 |
| updated_at | timestamp | NO | now() | 更新日時 |

**インデックス**
- PRIMARY KEY (id)
- UNIQUE (plan_code)

**想定データ例**
```json
{
  "plan_code": "individual",
  "plan_name": "Individual Plan",
  "display_name": "個人プラン",
  "price": 500.00,
  "hierarchy_level": 1,
  "features": ["ニュースレター閲覧", "動画視聴", "イベント参加"]
}
```

---

### 2.7 membersテーブル

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| id | text | NO | nanoid() | プライマリキー |
| user_id | text | NO | - | ユーザーID（FK → users.id） |
| email | varchar(255) | YES | null | メールアドレス（ユニーク） |
| last_name | varchar(100) | YES | null | 姓 |
| first_name | varchar(100) | YES | null | 名 |
| last_name_kana | varchar(100) | YES | null | セイ（カタカナ） |
| first_name_kana | varchar(100) | YES | null | メイ（カタカナ） |
| postal_code | varchar(8) | YES | null | 郵便番号（ハイフンなし） |
| prefecture | varchar(50) | YES | null | 都道府県 |
| city | varchar(100) | YES | null | 市区町村 |
| address | varchar(255) | YES | null | 町名番地 |
| building | varchar(255) | YES | null | 建物名 |
| phone_number | varchar(20) | YES | null | 電話番号（ハイフンなし） |
| plan_id | integer | YES | null | プランID（FK → member_plans.id） |
| role | members_role | NO | - | ロール（admin/member） |
| status | members_status | YES | 'pending_profile' | ステータス |
| profile_completed | boolean | NO | false | プロフィール完成フラグ |
| is_active | boolean | NO | true | 有効フラグ |
| payment_status | payment_status | YES | 'pending' | 決済ステータス |
| stripe_subscription_id | varchar(255) | YES | null | StripeサブスクリプションID |
| subscription_start_date | timestamp | YES | null | サブスク開始日 |
| subscription_end_date | timestamp | YES | null | サブスク終了日 |
| created_at | timestamp | NO | now() | 作成日時 |
| updated_at | timestamp | NO | now() | 更新日時 |

**インデックス**
- PRIMARY KEY (id)
- UNIQUE (email)
- INDEX (user_id)
- INDEX (plan_id)

**外部キー制約**
- user_id → users.id (ON DELETE CASCADE)
- plan_id → member_plans.id (ON DELETE RESTRICT)

**Enum定義**
```sql
CREATE TYPE members_role AS ENUM ('admin', 'member');
CREATE TYPE members_status AS ENUM ('pending_profile', 'active', 'inactive');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'canceled');
```

---

### 2.8 blogsテーブル

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| id | text | NO | nanoid() | プライマリキー |
| title | text | NO | - | タイトル |
| excerpt | text | NO | - | 抜粋（一覧表示用） |
| content | text | NO | - | 本文 |
| thumbnail_url | text | YES | null | サムネイル画像URL |
| published | boolean | NO | false | 公開フラグ |
| is_member_only | boolean | NO | false | 会員限定フラグ |
| author_id | text | YES | null | 作成者ID（FK → users.id） |
| author_name | text | YES | null | 作成者名 |
| view_count | integer | NO | 0 | 閲覧数 |
| created_at | timestamp | NO | now() | 作成日時 |
| updated_at | timestamp | NO | now() | 更新日時 |

**外部キー制約**
- author_id → users.id (ON DELETE SET NULL)

---

### 2.9 videosテーブル

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| id | text | NO | nanoid() | プライマリキー |
| title | text | NO | - | タイトル |
| video_date | date | NO | - | 動画日付 |
| video_url | text | NO | - | YouTube URL |
| thumbnail_url | text | YES | null | サムネイル画像URL |
| published | boolean | NO | false | 公開フラグ |
| is_member_only | boolean | NO | false | 会員限定フラグ |
| author_id | text | YES | null | 作成者ID（FK → users.id） |
| author_name | text | YES | null | 作成者名 |
| view_count | integer | NO | 0 | 閲覧数 |
| created_at | timestamp | NO | now() | 作成日時 |
| updated_at | timestamp | NO | now() | 更新日時 |

**外部キー制約**
- author_id → users.id (ON DELETE SET NULL)

---

### 2.10 schedulesテーブル

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| id | text | NO | nanoid() | プライマリキー |
| title | text | NO | - | イベント名 |
| content | text | NO | - | イベント詳細 |
| event_date | timestamp with timezone | NO | - | イベント日時 |
| image_url | text | YES | null | イメージ画像URL |
| link_url | text | YES | null | 関連リンクURL |
| sort_order | integer | NO | 0 | 表示順 |
| published | boolean | NO | false | 公開フラグ |
| is_member_only | boolean | NO | false | 会員限定フラグ |
| author_id | text | YES | null | 作成者ID（FK → users.id） |
| author_name | text | YES | null | 作成者名 |
| author_email | text | YES | null | 作成者メール |
| created_at | timestamp | NO | now() | 作成日時 |
| updated_at | timestamp | NO | now() | 更新日時 |

**外部キー制約**
- author_id → users.id (ON DELETE SET NULL)

---

### 2.11 informationsテーブル

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| id | text | NO | nanoid() | プライマリキー |
| date | date | NO | - | お知らせ日付 |
| title | text | NO | - | タイトル |
| content | text | NO | - | 本文 |
| image_url | text | YES | null | 画像URL |
| url | text | YES | null | 関連URL |
| published | boolean | NO | false | 公開フラグ |
| is_member_only | boolean | NO | false | 会員限定フラグ |
| created_by | text | YES | null | 作成者ID（FK → users.id） |
| created_at | timestamp | NO | now() | 作成日時 |
| updated_at | timestamp | NO | now() | 更新日時 |

**外部キー制約**
- created_by → users.id (ON DELETE SET NULL)

---

### 2.12 newslettersテーブル

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| id | text | NO | nanoid() | プライマリキー |
| issue_number | integer | NO | - | 号数（ユニーク） |
| title | text | NO | - | タイトル |
| excerpt | text | NO | - | 概要 |
| content | text | NO | - | 本文 |
| thumbnail_url | text | YES | null | サムネイル画像URL |
| pdf_url | text | YES | null | PDFファイルURL |
| author_id | text | YES | null | 作成者ID（FK → users.id） |
| author_name | text | YES | null | 作成者名 |
| category | text | YES | null | カテゴリ（regular/special/extra） |
| view_count | integer | NO | 0 | 閲覧数 |
| published | boolean | NO | false | 公開フラグ |
| is_member_only | boolean | NO | true | 会員限定フラグ（デフォルトtrue） |
| published_at | timestamp | YES | null | 公開日時 |
| created_at | timestamp | NO | now() | 作成日時 |
| updated_at | timestamp | NO | now() | 更新日時 |

**インデックス**
- PRIMARY KEY (id)
- UNIQUE (issue_number)

**外部キー制約**
- author_id → users.id (ON DELETE SET NULL)

---

## 3. 画面設計

### 3.1 画面一覧

#### 公開ページ（21画面）

| 画面ID | 画面名 | URL | 説明 |
|--------|-------|-----|------|
| PUB-001 | ホーム | /{locale}/ | トップページ |
| PUB-002 | お知らせ一覧 | /{locale}/information | お知らせ一覧 |
| PUB-003 | お知らせ詳細 | /{locale}/information/[id] | お知らせ詳細 |
| PUB-004 | スケジュール一覧 | /{locale}/schedule | イベント一覧 |
| PUB-005 | スケジュール詳細 | /{locale}/schedule/[id] | イベント詳細 |
| PUB-006 | 動画一覧 | /{locale}/video | 動画一覧 |
| PUB-007 | 動画詳細 | /{locale}/video/[id] | 動画詳細・再生 |
| PUB-008 | ブログ一覧 | /{locale}/blog | ブログ一覧 |
| PUB-009 | ブログ詳細 | /{locale}/blog/[id] | ブログ詳細 |
| PUB-010 | プロフィール一覧 | /{locale}/profiles | メンバー一覧 |
| PUB-011 | サポーター | /{locale}/supporters | サポーター紹介・入会案内 |
| PUB-012 | ペット一覧 | /{locale}/pets | ペット一覧（デモ） |
| PUB-013 | ペット詳細 | /{locale}/pets/[id] | ペット詳細・編集 |
| PUB-014 | ペット新規登録 | /{locale}/new | ペット新規作成 |
| MEM-001 | マイページ | /{locale}/mypage | 会員情報表示 |
| MEM-002 | プロフィール完成 | /{locale}/profile/complete | 詳細情報入力 |
| MEM-003 | ニュースレター一覧 | /{locale}/newsletter | 会報一覧 |
| MEM-004 | ニュースレター詳細 | /{locale}/newsletter/[id] | 会報詳細 |
| MEM-005 | サブスクリプション | /{locale}/subscribe | プラン購読 |
| MEM-006 | サブスクリプション成功 | /{locale}/subscribe/success | 購読成功 |
| MEM-007 | サブスクリプションキャンセル | /{locale}/subscribe/cancel | 購読キャンセル |

#### 認証ページ（7画面）

| 画面ID | 画面名 | URL | 説明 |
|--------|-------|-----|------|
| AUTH-001 | ログイン | /{locale}/login | 会員ログイン |
| AUTH-002 | サインアップ | /{locale}/signup | 会員登録案内 |
| AUTH-003 | 規約同意 | /{locale}/register/terms | 利用規約確認 |
| AUTH-004 | プラン選択 | /{locale}/register/plan | 会員プラン選択 |
| AUTH-005 | アカウント作成 | /{locale}/register/auth | 認証情報入力 |
| AUTH-006 | 決済 | /{locale}/register/payment | Stripe決済 |
| AUTH-007 | 決済完了 | /{locale}/register/payment/success | 決済完了画面 |

#### 管理者ページ（20画面）

| 画面ID | 画面名 | URL | 説明 |
|--------|-------|-----|------|
| ADM-001 | 管理者ログイン | /{locale}/admin/login | 管理者ログイン |
| ADM-002 | ダッシュボード | /{locale}/admin/dashboard | 管理トップ |
| ADM-003 | ブログ管理一覧 | /{locale}/admin/blogs | ブログ一覧 |
| ADM-004 | ブログ新規作成 | /{locale}/admin/blogs/new | ブログ新規 |
| ADM-005 | ブログ編集 | /{locale}/admin/blogs/[id] | ブログ編集 |
| ADM-006 | 動画管理一覧 | /{locale}/admin/videos | 動画一覧 |
| ADM-007 | 動画新規作成 | /{locale}/admin/videos/new | 動画新規 |
| ADM-008 | 動画編集 | /{locale}/admin/videos/[id] | 動画編集 |
| ADM-009 | スケジュール管理一覧 | /{locale}/admin/schedules | スケジュール一覧 |
| ADM-010 | スケジュール新規作成 | /{locale}/admin/schedules/new | スケジュール新規 |
| ADM-011 | スケジュール編集 | /{locale}/admin/schedules/[id] | スケジュール編集 |
| ADM-012 | お知らせ管理一覧 | /{locale}/admin/informations | お知らせ一覧 |
| ADM-013 | お知らせ新規作成 | /{locale}/admin/informations/new | お知らせ新規 |
| ADM-014 | お知らせ編集 | /{locale}/admin/informations/[id] | お知らせ編集 |
| ADM-015 | ニュースレター管理一覧 | /{locale}/admin/newsletters | ニュースレター一覧 |
| ADM-016 | ニュースレター新規作成 | /{locale}/admin/newsletters/new | ニュースレター新規 |
| ADM-017 | ニュースレター編集 | /{locale}/admin/newsletters/[id] | ニュースレター編集 |
| ADM-018 | アカウント管理一覧 | /{locale}/admin/accounts | 会員一覧 |
| ADM-019 | アカウント詳細 | /{locale}/admin/accounts/[id] | 会員詳細 |
| ADM-020 | アカウント編集 | /{locale}/admin/accounts/[id]/edit | 会員編集 |

---

### 3.2 画面項目定義（公開ページ）

#### PUB-001: ホーム画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/(main)/page.tsx |
| パラメータ | locale: string |
| データ取得 | なし（静的レイアウト） |
| レンダリング | force-dynamic |

**構成コンポーネント**
| コンポーネント | 説明 |
|--------------|------|
| HeroCarousel | ヒーロー画像カルーセル |
| InformationContents | お知らせセクション |
| ScheduleContents | スケジュールセクション |
| VideoContents | 動画セクション |
| SupportersContents | サポーターセクション |

**ボタン**
- なし（各セクションへのリンクはコンポーネント内で提供）

---

#### PUB-002: お知らせ一覧画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/(main)/information/page.tsx |
| パラメータ | locale: string |
| データ取得 | getInformations() |
| レンダリング | force-dynamic |

**表示項目**
| 項目 | 説明 |
|------|------|
| お知らせカード一覧 | InformationListコンポーネント |

---

#### PUB-003: お知らせ詳細画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/(main)/information/[id]/page.tsx |
| パラメータ | locale: string, id: string |
| データ取得 | getInformation(id), canAccessMemberContent() |
| レンダリング | force-dynamic |
| アクセス制御 | 会員限定コンテンツの場合MemberOnlyContent表示 |

**表示項目**
| 項目 | 説明 |
|------|------|
| 日付 | お知らせ日付 |
| タイトル | お知らせタイトル |
| 本文 | お知らせ内容 |
| 画像 | 添付画像（ある場合） |
| 関連URL | 外部リンク（ある場合） |

---

#### PUB-004: スケジュール一覧画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/(main)/schedule/page.tsx |
| パラメータ | locale: string |
| データ取得 | getSchedules() |
| レンダリング | force-dynamic |

---

#### PUB-005: スケジュール詳細画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/(main)/schedule/[id]/page.tsx |
| パラメータ | locale: string, id: string |
| データ取得 | getSchedule(id), canAccessMemberContent() |
| レンダリング | force-dynamic |
| アクセス制御 | 会員限定コンテンツの場合MemberOnlyContent表示 |

**表示項目**
| 項目 | 説明 |
|------|------|
| イベント名 | タイトル |
| イベント日時 | 日付・時間 |
| 詳細 | イベント内容 |
| 画像 | イベント画像（ある場合） |
| リンク | 関連リンク（ある場合） |

---

#### PUB-006: 動画一覧画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/(main)/video/page.tsx |
| パラメータ | locale: string |
| データ取得 | getVideos() |
| レンダリング | force-dynamic |

---

#### PUB-007: 動画詳細画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/(main)/video/[id]/page.tsx |
| パラメータ | locale: string, id: string |
| データ取得 | getVideo(id), canAccessMemberContent() |
| レンダリング | force-dynamic |
| アクセス制御 | 会員限定コンテンツの場合MemberOnlyContent表示 |

**表示項目**
| 項目 | 説明 |
|------|------|
| タイトル | 動画タイトル |
| 日付 | 動画日付 |
| YouTube埋め込み | 動画プレーヤー |
| 閲覧数 | ビューカウント |

---

#### PUB-008: ブログ一覧画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/(main)/blog/page.tsx |
| パラメータ | locale: string |
| データ取得 | getPublishedBlogs() |
| レンダリング | force-dynamic |

---

#### PUB-009: ブログ詳細画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/(main)/blog/[id]/page.tsx |
| パラメータ | locale: string, id: string |
| データ取得 | getBlog(id), canAccessMemberContent() |
| レンダリング | force-dynamic |
| アクセス制御 | 会員限定コンテンツの場合MemberOnlyContent表示 |

**表示項目**
| 項目 | 説明 |
|------|------|
| タイトル | ブログタイトル |
| サムネイル | サムネイル画像 |
| 作成者 | 著者名 |
| 本文 | ブログ内容 |
| 閲覧数 | ビューカウント |
| 作成日 | 投稿日時 |

---

#### PUB-010: プロフィール一覧画面（チーム紹介）

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/(main)/profiles/page.tsx |
| パラメータ | locale: string |
| データ取得 | なし（ハードコード） |
| レンダリング | 静的 |
| 翻訳 | getTranslations("Contents") |

**ページ構成**
| セクション | 説明 |
|-----------|------|
| ページタイトル | t("profiles") |
| メイン画像 | チーム集合写真（profile.jpg） |
| チームロゴ | IK ALUMNI CGT ロゴ（120px / モバイル150px） |
| チーム紹介文 | 団体の沿革・活動方針 |
| メンバーセクション | "MEMBER" 見出し + メンバーグリッド |

**チーム紹介文の内容**
- 2022年発足、千葉県内唯一の一般カラーガードチーム
- チーム名「ALUMNI」の意味（卒業生）
- メンバー構成（柏市立柏高等学校の卒業生）
- 活動内容（地元柏市でのイベント出演、自主公演）
- 活動方針（大会を目標とせず、純粋にカラーガードを楽しむ）
- ミッション（カラーガードの魅力を広める）

**メンバーグリッド**
| 項目 | 内容 |
|------|------|
| レイアウト | 2列（モバイル） / 3列（sm） / 4列（md以上） |
| 間隔 | gap-6（モバイル） / gap-8（md以上） |
| メンバー数 | 19名 |

**メンバーカード項目**
| 項目 | 説明 |
|------|------|
| 画像 | メンバー写真（アスペクト比 4:3、object-cover） |
| 名前 | メンバー名（大文字表記、例: SHO, RYO） |
| 紹介文 | メンバー紹介テキスト |

**メンバーカードスタイル**
| 要素 | クラス |
|------|--------|
| カード | bg-white rounded-xl shadow-md overflow-hidden |
| 画像コンテナ | relative aspect-[4/3] w-full overflow-hidden bg-gray-100 |
| テキストエリア | p-4 |
| 名前 | font-bold text-lg |
| 紹介文 | mt-1 text-sm text-gray-600 |

**画像ファイル**
| ファイル | 説明 |
|---------|------|
| profiles/profile.jpg | チーム集合写真 |
| profiles/member/*.jpg | 各メンバーの個人写真（19枚） |

---

#### PUB-011: サポーター画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/(main)/supporters/page.tsx |
| パラメータ | なし |
| データ取得 | なし（ハードコード） |
| レンダリング | 静的 |

**構成セクション**
| セクション | 説明 |
|-----------|------|
| フォトカルーセル | 活動写真スライダー |
| 特典紹介 | 会員特典一覧 |
| プラン比較 | 個人/法人/プラチナプラン比較表 |

**ボタン**
| ボタン名 | アクション |
|---------|----------|
| 入会はこちら | /supporters へ遷移 |
| 登録手続きに進む | /register/terms へ遷移 |

---

#### PUB-012: ペット一覧画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/(main)/pets/page.tsx |
| パラメータ | locale: string, searchParams: { name?: string } |
| データ取得 | getPets() または searchPets(name) |
| レンダリング | 動的 |

**フォーム項目（検索）**
| 項目名 | 項目ID | 入力タイプ | 必須 | バリデーション |
|-------|--------|----------|------|--------------|
| 名前検索 | name | input[type="text"] | - | - |

**表示項目**
| 項目 | 説明 |
|------|------|
| ペットカード一覧 | PetCardコンポーネント |

---

#### PUB-013: ペット詳細画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/(main)/pets/[id]/page.tsx |
| パラメータ | locale: string, id: string |
| データ取得 | getPet(id) |
| レンダリング | 動的 |

**表示項目**
| 項目 | 説明 |
|------|------|
| ペットカード | 詳細表示 |
| 編集フォーム | PetForm |

**ボタン**
| ボタン名 | アクション |
|---------|----------|
| 削除 | DeletePetButton（削除確認ダイアログ） |

---

#### PUB-014: ペット新規登録画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/(main)/new/page.tsx |
| パラメータ | locale: string |
| データ取得 | なし |
| レンダリング | 静的 |

**フォーム項目**
| 項目名 | 項目ID | 入力タイプ | 必須 | バリデーション |
|-------|--------|----------|------|--------------|
| 名前 | name | input[type="text"] | ○ | 1文字以上 |
| 種類 | type | select | ○ | dog/cat |

---

### 3.3 画面項目定義（会員専用ページ）

#### MEM-001: マイページ画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/(main)/mypage/page.tsx |
| パラメータ | locale: string |
| データ取得 | verifySession(), getCurrentMember() |
| レンダリング | force-dynamic |
| アクセス制御 | ログイン必須 |

**表示項目**
| コンポーネント | 説明 | 条件 |
|--------------|------|------|
| ProfileCompletionBanner | プロフィール入力催促バナー | status === "pending_profile" |
| UserCard | ユーザー情報カード | 常時表示 |

---

#### MEM-002: プロフィール完成画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/(main)/profile/complete/page.tsx |
| パラメータ | locale: string |
| データ取得 | getCurrentMember() |
| レンダリング | force-dynamic |
| アクセス制御 | status === "pending_profile" の場合のみ表示 |
| 遷移条件 | status === "active" の場合 /mypage へリダイレクト |

**フォーム項目（ProfileCompleteForm）**
| 項目名 | 項目ID | 入力タイプ | 必須 | バリデーション |
|-------|--------|----------|------|--------------|
| 姓 | lastName | input[type="text"] | ○ | 1-100文字 |
| 名 | firstName | input[type="text"] | ○ | 1-100文字 |
| セイ | lastNameKana | input[type="text"] | ○ | カタカナ、1-100文字 |
| メイ | firstNameKana | input[type="text"] | ○ | カタカナ、1-100文字 |
| 郵便番号 | postalCode | input[type="text"] | ○ | 7桁数字 |
| 都道府県 | prefecture | select | ○ | 47都道府県から選択 |
| 市区町村 | city | input[type="text"] | ○ | 1-100文字 |
| 町名番地 | address | input[type="text"] | ○ | 1-255文字 |
| 建物名 | building | input[type="text"] | - | 0-255文字 |
| 電話番号 | phoneNumber | input[type="tel"] | ○ | 10-11桁数字 |

**ボタン**
| ボタン名 | アクション |
|---------|----------|
| 後で入力する | /mypage へ遷移 |
| 登録する | updateMemberProfile() 実行 → /mypage へ遷移 |

---

#### MEM-003: ニュースレター一覧画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/(main)/newsletter/page.tsx |
| パラメータ | locale: string |
| データ取得 | getPublishedNewsletters() |
| レンダリング | force-dynamic |
| アクセス制御 | 会員限定（isMemberOnly=true がデフォルト） |

---

#### MEM-004: ニュースレター詳細画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/(main)/newsletter/[id]/page.tsx |
| パラメータ | locale: string, id: string |
| データ取得 | getNewsletter(id), canAccessMemberContent() |
| レンダリング | force-dynamic |
| アクセス制御 | 会員限定コンテンツ |

**表示項目**
| 項目 | 説明 |
|------|------|
| 号数 | 発行番号 |
| タイトル | ニュースレタータイトル |
| サムネイル | サムネイル画像 |
| 概要 | 抜粋文 |
| 本文 | 内容 |
| PDFリンク | PDFダウンロードリンク（ある場合） |

---

#### MEM-005: サブスクリプション画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/(main)/subscribe/page.tsx |
| パラメータ | なし |
| データ取得 | なし |
| レンダリング | 静的 |

**表示項目**
| 項目 | 説明 |
|------|------|
| プラン名 | 年間会員プラン |
| 価格 | ¥36,000/年 |
| 特典リスト | CheckCircleアイコン付きリスト |

**ボタン**
| ボタン名 | アクション |
|---------|----------|
| SubscribeButton | Stripe Checkout へリダイレクト（priceId指定） |

---

#### MEM-006: サブスクリプション成功画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/(main)/subscribe/success/page.tsx |
| パラメータ | なし |
| データ取得 | なし |
| レンダリング | 静的 |

**表示項目**
| 項目 | 説明 |
|------|------|
| 成功アイコン | CheckCircle |
| メッセージ | 購読完了メッセージ |

**ボタン**
| ボタン名 | アクション |
|---------|----------|
| マイページへ | /mypage へ遷移 |
| ホームへ | / へ遷移 |

---

#### MEM-007: サブスクリプションキャンセル画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/(main)/subscribe/cancel/page.tsx |
| パラメータ | なし |
| データ取得 | なし |
| レンダリング | 静的 |

**表示項目**
| 項目 | 説明 |
|------|------|
| キャンセルアイコン | XCircle |
| メッセージ | キャンセルメッセージ |

**ボタン**
| ボタン名 | アクション |
|---------|----------|
| プランを見る | /subscribe へ遷移 |
| ホームへ | / へ遷移 |

---

### 3.4 画面項目定義（認証ページ）

#### AUTH-001: ログイン画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/(auth)/login/page.tsx |
| パラメータ | locale: string |
| コンポーネント | LoginForm |
| データ取得 | なし |

**フォーム項目**
| 項目名 | 項目ID | 入力タイプ | 必須 | バリデーション |
|-------|--------|----------|------|--------------|
| メールアドレス | email | input[type="email"] | ○ | メール形式 |
| パスワード | password | input[type="password"] | ○ | 1文字以上 |

**ボタン**
| ボタン名 | アクション |
|---------|----------|
| ログイン | authClient.signIn.email() 実行 |
| 登録 | /signup へ遷移 |

**エラーメッセージ**
| 条件 | メッセージ |
|------|----------|
| 認証失敗 | 「メールアドレスまたはパスワードが正しくありません」 |

**リダイレクト**
- 成功時: returnUrl（あれば）または /mypage

---

#### AUTH-002: サインアップ画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/(auth)/signup/page.tsx |
| パラメータ | locale: string |
| コンポーネント | SignupForm |
| データ取得 | なし |

**フォーム項目**
| 項目名 | 項目ID | 入力タイプ | 必須 | バリデーション |
|-------|--------|----------|------|--------------|
| 名前 | name | input[type="text"] | ○ | 1-50文字 |
| メールアドレス | email | input[type="email"] | ○ | メール形式 |
| パスワード | password | input[type="password"] | ○ | 8-100文字、大文字・小文字・数字必須 |

**ボタン**
| ボタン名 | アクション |
|---------|----------|
| 登録 | authClient.signUp.email() 実行 |
| ログイン | /login へ遷移 |

---

#### AUTH-003: 規約同意画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/(auth)/register/terms/page.tsx |
| パラメータ | locale: string |
| コンポーネント | TermsAgreementForm |
| データ取得 | なし |
| 登録ステップ | 1/4 |

**構成要素**
| 要素 | 説明 |
|------|------|
| RegistrationProgress | 進捗バー（ステップ1） |
| ScrollArea | 規約本文（スクロール必須） |
| Checkbox | 同意チェックボックス |

**フォーム項目**
| 項目名 | 項目ID | 入力タイプ | 必須 | バリデーション |
|-------|--------|----------|------|--------------|
| 規約同意 | agreedToTerms | checkbox | ○ | true必須 |

**制約**
- 規約を最後までスクロールしないとチェックボックス有効化されない

**ボタン**
| ボタン名 | アクション | 条件 |
|---------|----------|------|
| 戻る | /signup へ遷移 | - |
| 同意して次へ | /register/plan へ遷移 | チェック済み |

---

#### AUTH-004: プラン選択画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/(auth)/register/plan/page.tsx |
| パラメータ | locale: string |
| コンポーネント | PlanSelectionForm |
| データ取得 | getMemberPlans()（stripePriceIdがあるプランのみ） |
| 登録ステップ | 2/4 |
| 前提条件 | termsAgreed === true（なければ/register/termsへリダイレクト） |

**フォーム項目**
| 項目名 | 項目ID | 入力タイプ | 必須 | バリデーション |
|-------|--------|----------|------|--------------|
| プラン選択 | planId | RadioGroup | ○ | 正の整数 |

**プランカード表示項目**
| 項目 | 説明 |
|------|------|
| 表示名 | displayName（カラー付き） |
| 価格 | ¥XX,XXX/月 |
| 法人バッジ | isBusinessPlan=true の場合表示 |
| 説明 | description |
| 機能リスト | features配列をCheckアイコン付きで表示 |

**ボタン**
| ボタン名 | アクション |
|---------|----------|
| 戻る | /register/terms へ遷移 |
| 次へ | /register/auth へ遷移 |

---

#### AUTH-005: アカウント作成画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/(auth)/register/auth/page.tsx |
| パラメータ | locale: string |
| コンポーネント | RegisterAuthForm |
| データ取得 | なし |
| 登録ステップ | 3/4 |
| 前提条件 | selectedPlanId存在（なければ/register/planへリダイレクト） |

**フォーム項目**
| 項目名 | 項目ID | 入力タイプ | 必須 | バリデーション |
|-------|--------|----------|------|--------------|
| 名前 | name | input[type="text"] | ○ | 1-50文字 |
| メールアドレス | email | input[type="email"] | ○ | メール形式 |
| パスワード | password | input[type="password"] | ○ | 8-100文字、大文字・小文字・数字必須 |

**処理フロー**
```
1. authClient.signUp.email() でアカウント作成
2. createMemberAfterSignup() で会員レコード作成
3. setAccountCreated(true), setUserId(userId) をコンテキストに保存
4. /register/payment へリダイレクト
```

**ボタン**
| ボタン名 | アクション |
|---------|----------|
| 戻る | /register/plan へ遷移 |
| 登録 | アカウント作成処理実行 |
| ログイン | /login へ遷移 |

---

#### AUTH-006: 決済画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/(auth)/register/payment/page.tsx |
| パラメータ | locale: string |
| コンポーネント | PaymentForm |
| データ取得 | getMemberPlanById(selectedPlanId) |
| 登録ステップ | 4/4 |
| 前提条件 | accountCreated === true, userId存在, selectedPlanId存在 |

**表示項目**
| 項目 | 説明 |
|------|------|
| プラン名 | displayName |
| 価格 | ¥XX,XXX/月 |
| 機能リスト | features配列 |
| 注意事項 | Stripe決済についての説明 |

**ボタン**
| ボタン名 | アクション |
|---------|----------|
| あとで支払う | /mypage へ遷移（スキップ） |
| ¥XX,XXX を支払う | /api/stripe/create-checkout → Stripe Checkoutへリダイレクト |

---

#### AUTH-007: 決済完了画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/(auth)/register/payment/success/page.tsx |
| パラメータ | locale: string |
| データ取得 | なし |

**表示項目**
| 項目 | 説明 |
|------|------|
| 成功アイコン | CheckCircle |
| タイトル | 「お支払いが完了しました」 |
| メッセージ | 会員登録完了メッセージ |

**ボタン**
| ボタン名 | アクション |
|---------|----------|
| マイページへ | /mypage へ遷移 |

---

### 3.5 画面項目定義（管理者ページ）

#### ADM-001: 管理者ログイン画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/admin/login/page.tsx |
| パラメータ | locale: string |
| コンポーネント | AdminLoginForm |
| データ取得 | なし |

**フォーム項目**
| 項目名 | 項目ID | 入力タイプ | 必須 | バリデーション |
|-------|--------|----------|------|--------------|
| メールアドレス | email | input[type="email"] | ○ | メール形式 |
| パスワード | password | input[type="password"] | ○ | 1文字以上 |

---

#### ADM-002: ダッシュボード画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/admin/dashboard/page.tsx |
| パラメータ | locale: string |
| コンポーネント | AdminDashboard |
| データ取得 | verifySession(), isAdmin() |
| アクセス制御 | 管理者のみ（role==="admin"）、非管理者は / へリダイレクト |

---

#### ADM-003: ブログ管理一覧画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/admin/blogs/page.tsx |
| パラメータ | なし |
| データ取得 | getAllBlogs() |
| アクセス制御 | 管理者のみ |

**表示項目**
| 項目 | 説明 |
|------|------|
| ブログカードグリッド | BlogCard（admin mode） |

**ボタン**
| ボタン名 | アクション |
|---------|----------|
| 新規作成 | /admin/blogs/new へ遷移 |

---

#### ADM-004: ブログ新規作成画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/admin/blogs/new/page.tsx |
| パラメータ | なし |
| コンポーネント | BlogForm（mode: "create"） |
| データ取得 | なし |
| アクセス制御 | 管理者のみ |

**フォーム項目**
| 項目名 | 項目ID | 入力タイプ | 必須 | バリデーション |
|-------|--------|----------|------|--------------|
| タイトル | title | input[type="text"] | ○ | 1-255文字 |
| 抜粋 | excerpt | textarea | ○ | 1-500文字 |
| 本文 | content | textarea | ○ | 1文字以上 |
| サムネイル | thumbnailUrl | file/url | - | 有効なURL形式 |
| 公開状態 | published | checkbox | - | boolean |
| 会員限定 | isMemberOnly | checkbox | - | boolean |

**ボタン**
| ボタン名 | アクション |
|---------|----------|
| 戻る | /admin/blogs へ遷移 |
| 保存 | createBlog() 実行 |

---

#### ADM-005: ブログ編集画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/admin/blogs/[id]/page.tsx |
| パラメータ | id: string |
| コンポーネント | BlogForm（mode: "edit"）, BlogCard, DeleteBlogButton |
| データ取得 | getBlog(id) |
| アクセス制御 | 管理者のみ |

**表示項目**
| 項目 | 説明 |
|------|------|
| プレビューカード | BlogCard（現在の状態表示） |
| 編集フォーム | BlogForm（既存データ入力済み） |

**ボタン**
| ボタン名 | アクション |
|---------|----------|
| 戻る | /admin/blogs へ遷移 |
| 削除 | DeleteBlogButton（確認ダイアログ付き） |
| 保存 | updateBlog() 実行 |

---

#### ADM-006: 動画管理一覧画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/admin/videos/page.tsx |
| パラメータ | なし |
| データ取得 | getAllVideos() |

**ボタン**
| ボタン名 | アクション |
|---------|----------|
| 新規作成 | /admin/videos/new へ遷移 |

---

#### ADM-007: 動画新規作成画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/admin/videos/new/page.tsx |
| パラメータ | なし |
| コンポーネント | VideoForm |
| データ取得 | なし |

**フォーム項目**
| 項目名 | 項目ID | 入力タイプ | 必須 | バリデーション |
|-------|--------|----------|------|--------------|
| タイトル | title | input[type="text"] | ○ | 1-255文字 |
| 動画日付 | videoDate | input[type="date"] | ○ | YYYY-MM-DD形式 |
| YouTube URL | videoUrl | input[type="url"] | ○ | youtube.com/youtu.be ドメイン |
| サムネイル | thumbnailUrl | file/url | - | 有効なURL形式 |
| 公開状態 | published | checkbox | - | boolean |
| 会員限定 | isMemberOnly | checkbox | - | boolean |

---

#### ADM-008: 動画編集画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/admin/videos/[id]/page.tsx |
| パラメータ | id: string |
| コンポーネント | VideoForm |
| データ取得 | getVideo(id) |

---

#### ADM-009: スケジュール管理一覧画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/admin/schedules/page.tsx |
| パラメータ | なし |
| データ取得 | getAllSchedules() |

**ボタン**
| ボタン名 | アクション |
|---------|----------|
| 新規作成 | /admin/schedules/new へ遷移 |

---

#### ADM-010: スケジュール新規作成画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/admin/schedules/new/page.tsx |
| パラメータ | なし |
| コンポーネント | ScheduleForm |
| データ取得 | なし |

**フォーム項目**
| 項目名 | 項目ID | 入力タイプ | 必須 | バリデーション |
|-------|--------|----------|------|--------------|
| イベント名 | title | input[type="text"] | ○ | 1-255文字 |
| イベント詳細 | content | textarea | ○ | 1文字以上 |
| イベント日時 | eventDate | input[type="datetime-local"] | ○ | YYYY-MM-DDTHH:MM形式 |
| 画像 | imageUrl | file/url | - | 有効なURL形式 |
| 関連リンク | linkUrl | input[type="url"] | - | 有効なURL形式 |
| 表示順 | sortOrder | input[type="number"] | ○ | 整数 |
| 公開状態 | published | checkbox | - | boolean |
| 会員限定 | isMemberOnly | checkbox | - | boolean |

---

#### ADM-011: スケジュール編集画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/admin/schedules/[id]/page.tsx |
| パラメータ | id: string |
| コンポーネント | ScheduleForm |
| データ取得 | getSchedule(id) |

---

#### ADM-012: お知らせ管理一覧画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/admin/informations/page.tsx |
| パラメータ | なし |
| データ取得 | getAllInformations() |

**ボタン**
| ボタン名 | アクション |
|---------|----------|
| 新規作成 | /admin/informations/new へ遷移 |

---

#### ADM-013: お知らせ新規作成画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/admin/informations/new/page.tsx |
| パラメータ | なし |
| コンポーネント | InformationForm |
| データ取得 | なし |

**フォーム項目**
| 項目名 | 項目ID | 入力タイプ | 必須 | バリデーション |
|-------|--------|----------|------|--------------|
| 日付 | date | input[type="date"] | ○ | YYYY-MM-DD形式 |
| タイトル | title | input[type="text"] | ○ | 1-255文字 |
| 本文 | content | textarea | ○ | 1文字以上 |
| 画像 | imageUrl | file/url | - | 有効なURL形式 |
| 関連URL | url | input[type="url"] | - | 有効なURL形式 |
| 公開状態 | published | checkbox | - | boolean |
| 会員限定 | isMemberOnly | checkbox | - | boolean |

---

#### ADM-014: お知らせ編集画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/admin/informations/[id]/page.tsx |
| パラメータ | id: string |
| コンポーネント | InformationForm, InformationCard, DeleteInformationButton |
| データ取得 | getInformation(id) |

---

#### ADM-015: ニュースレター管理一覧画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/admin/newsletters/page.tsx |
| パラメータ | なし |
| データ取得 | getAllNewsletters() |

**表示項目（カード）**
| 項目 | 説明 |
|------|------|
| 号数 | issueNumber |
| タイトル | title |
| ステータスバッジ | 公開/下書き、会員限定、カテゴリ |
| 閲覧数 | viewCount |
| 公開日 | publishedAt |

**ボタン**
| ボタン名 | アクション |
|---------|----------|
| 新規作成 | /admin/newsletters/new へ遷移 |
| 編集 | /admin/newsletters/[id] へ遷移 |

---

#### ADM-016: ニュースレター新規作成画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/admin/newsletters/new/page.tsx |
| パラメータ | なし |
| コンポーネント | NewsletterForm（mode: "create"） |
| データ取得 | getNextIssueNumber() |

**フォーム項目**
| 項目名 | 項目ID | 入力タイプ | 必須 | バリデーション |
|-------|--------|----------|------|--------------|
| 号数 | issueNumber | input[type="number"] | ○ | 正の整数（自動採番） |
| タイトル | title | input[type="text"] | ○ | 1-255文字 |
| 概要 | excerpt | textarea | ○ | 1-500文字 |
| 本文 | content | textarea | ○ | 1文字以上 |
| サムネイル | thumbnailUrl | file/url | - | 有効なURL形式 |
| PDFファイル | pdfUrl | file/url | - | 有効なURL形式 |
| カテゴリ | category | select | - | regular/special/extra |
| 公開状態 | published | checkbox | - | boolean |
| 会員限定 | isMemberOnly | checkbox | - | boolean |

---

#### ADM-017: ニュースレター編集画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/admin/newsletters/[id]/page.tsx |
| パラメータ | id: string |
| コンポーネント | NewsletterForm（mode: "edit"） |
| データ取得 | getNewsletter(id) |

**ボタン**
| ボタン名 | アクション |
|---------|----------|
| 戻る | /admin/newsletters へ遷移 |
| 削除 | AlertDialog確認後、削除実行 |
| 保存 | updateNewsletter() 実行 |

---

#### ADM-018: アカウント管理一覧画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/admin/accounts/page.tsx |
| パラメータ | なし |
| データ取得 | getAllAccounts() |

**テーブル表示項目**
| カラム | 説明 |
|-------|------|
| 氏名 | lastName + firstName |
| メール | email |
| プラン | plan.displayName |
| ロール | role（バッジ） |
| ステータス | status（バッジ） |
| 登録日 | createdAt |

**ボタン**
| ボタン名 | アクション |
|---------|----------|
| 詳細 | /admin/accounts/[id] へ遷移 |

---

#### ADM-019: アカウント詳細画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/admin/accounts/[id]/page.tsx |
| パラメータ | id: string |
| データ取得 | getAccountById(id) |

**表示カード**
| カード名 | 表示項目 |
|---------|---------|
| 基本情報 | ID、作成日時、更新日時 |
| 認証情報 | メールアドレス、認証状態 |
| 個人情報 | 氏名、ふりがな、住所、郵便番号、電話番号 |
| 会員情報 | プラン、ロール、ステータス、プロフィール完了、有効状態 |

**ボタン**
| ボタン名 | アクション |
|---------|----------|
| 編集 | /admin/accounts/[id]/edit へ遷移 |
| 削除 | DeleteAccountButton（確認ダイアログ付き） |

---

#### ADM-020: アカウント編集画面

| 項目 | 内容 |
|------|------|
| ファイル | app/[locale]/admin/accounts/[id]/edit/page.tsx |
| パラメータ | id: string |
| コンポーネント | AccountForm |
| データ取得 | getAccountById(id), getAllMemberPlans() |

**フォーム項目**
| 項目名 | 項目ID | 入力タイプ | 必須 | バリデーション |
|-------|--------|----------|------|--------------|
| 姓 | lastName | input[type="text"] | - | - |
| 名 | firstName | input[type="text"] | - | - |
| セイ | lastNameKana | input[type="text"] | - | - |
| メイ | firstNameKana | input[type="text"] | - | - |
| 郵便番号 | postalCode | input[type="text"] | - | - |
| 都道府県 | prefecture | select | - | - |
| 市区町村 | city | input[type="text"] | - | - |
| 町名番地 | address | input[type="text"] | - | - |
| 建物名 | building | input[type="text"] | - | - |
| 電話番号 | phoneNumber | input[type="tel"] | - | - |
| プラン | planId | select | - | プラン一覧から選択 |
| ロール | role | select | - | admin/member |
| ステータス | status | select | - | pending_profile/active/inactive |

**ボタン**
| ボタン名 | アクション |
|---------|----------|
| 戻る | /admin/accounts/[id] へ遷移 |
| 保存 | updateAccount() 実行 |

---

## 4. Server Actions設計

### 4.1 ブログ関連

#### createBlog

| 項目 | 内容 |
|------|------|
| ファイル | actions/blog.ts |
| 機能概要 | ブログ記事を新規作成 |
| 認可 | 管理者のみ（verifyAdmin） |

**処理フロー**
```
1. 管理者権限チェック（verifyAdmin）
2. バリデーション（blogFormSchema.parse）
3. ユーザー情報取得（authorName設定用）
4. 画像アップロード処理（dataURL→R2）
5. データベース挿入
6. キャッシュ再検証（/admin/blogs, /blogs）
7. 作成結果を返却
```

**入力パラメータ（BlogFormData）**
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| title | string | ○ | タイトル |
| excerpt | string | ○ | 抜粋 |
| content | string | ○ | 本文 |
| thumbnailUrl | string | - | サムネイルURL/dataURL |
| published | boolean | ○ | 公開フラグ |
| isMemberOnly | boolean | ○ | 会員限定フラグ |

**戻り値**
- 成功時: 作成されたブログオブジェクト
- 失敗時: Error throw

---

#### updateBlog

| 項目 | 内容 |
|------|------|
| ファイル | actions/blog.ts |
| 機能概要 | ブログ記事を更新 |
| 認可 | 管理者のみ（verifyAdmin） |

**処理フロー**
```
1. 管理者権限チェック
2. バリデーション
3. 画像アップロード処理
4. データベース更新
5. キャッシュ再検証
6. 更新結果を返却
```

---

#### deleteBlog

| 項目 | 内容 |
|------|------|
| ファイル | actions/blog.ts |
| 機能概要 | ブログ記事を削除 |
| 認可 | 管理者のみ |

**入力パラメータ**
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | string | ○ | ブログID |

---

#### incrementViewCount

| 項目 | 内容 |
|------|------|
| ファイル | actions/blog.ts |
| 機能概要 | 閲覧数をインクリメント |
| 認可 | 不要（一般ユーザーも実行可能） |

---

#### toggleBlogPublish

| 項目 | 内容 |
|------|------|
| ファイル | actions/blog.ts |
| 機能概要 | 公開状態を切り替え |
| 認可 | 管理者のみ |

---

### 4.2 動画関連

#### createVideo

| 項目 | 内容 |
|------|------|
| ファイル | actions/video.ts |
| 機能概要 | 動画を新規作成 |
| 認可 | 管理者のみ |

**入力パラメータ（VideoFormData）**
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| title | string | ○ | タイトル |
| videoDate | string | ○ | 動画日付（YYYY-MM-DD） |
| videoUrl | string | ○ | YouTube URL |
| thumbnailUrl | string | - | サムネイルURL |
| published | boolean | ○ | 公開フラグ |
| isMemberOnly | boolean | ○ | 会員限定フラグ |

---

### 4.3 スケジュール関連

#### createSchedule

| 項目 | 内容 |
|------|------|
| ファイル | actions/schedule.ts |
| 機能概要 | スケジュールを新規作成 |
| 認可 | 管理者のみ |

**入力パラメータ（ScheduleFormData）**
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| title | string | ○ | イベント名 |
| content | string | ○ | イベント詳細 |
| eventDate | string | ○ | 日時（YYYY-MM-DDTHH:MM） |
| imageUrl | string | - | 画像URL |
| linkUrl | string | - | 関連リンク |
| sortOrder | number | ○ | 表示順 |
| published | boolean | ○ | 公開フラグ |
| isMemberOnly | boolean | ○ | 会員限定フラグ |

---

### 4.4 お知らせ関連

#### createInformation

| 項目 | 内容 |
|------|------|
| ファイル | actions/information.ts |
| 機能概要 | お知らせを新規作成 |
| 認可 | 管理者のみ |

**入力パラメータ（InformationFormData）**
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| date | string | ○ | 日付（YYYY-MM-DD） |
| title | string | ○ | タイトル |
| content | string | ○ | 本文 |
| imageUrl | string | - | 画像URL |
| url | string | - | 関連URL |
| published | boolean | ○ | 公開フラグ |
| isMemberOnly | boolean | ○ | 会員限定フラグ |

---

### 4.5 ニュースレター関連

#### createNewsletter

| 項目 | 内容 |
|------|------|
| ファイル | actions/newsletter.ts |
| 機能概要 | ニュースレターを新規作成 |
| 認可 | 管理者のみ |

**入力パラメータ（NewsletterFormData）**
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| issueNumber | number | ○ | 号数 |
| title | string | ○ | タイトル |
| excerpt | string | ○ | 概要 |
| content | string | ○ | 本文 |
| thumbnailUrl | string | - | サムネイルURL |
| pdfUrl | string | - | PDFファイルURL |
| category | string | - | カテゴリ |
| published | boolean | ○ | 公開フラグ |
| isMemberOnly | boolean | ○ | 会員限定フラグ |

---

### 4.6 会員関連

#### updateProfile

| 項目 | 内容 |
|------|------|
| ファイル | actions/members/update-profile.ts |
| 機能概要 | 会員プロフィールを更新 |
| 認可 | ログイン済みユーザー |

**処理フロー**
```
1. セッション検証
2. バリデーション（memberProfileFormSchema）
3. 会員情報取得
4. データベース更新
   - プロフィール情報更新
   - profileCompleted = true
   - status = 'active'
5. キャッシュ再検証
```

---

### 4.7 管理者向け会員管理

#### updateAccount

| 項目 | 内容 |
|------|------|
| ファイル | actions/admin/accounts/update-account.ts |
| 機能概要 | 会員情報を管理者が更新 |
| 認可 | 管理者のみ |

#### deleteAccount

| 項目 | 内容 |
|------|------|
| ファイル | actions/admin/accounts/delete-account.ts |
| 機能概要 | 会員を削除 |
| 認可 | 管理者のみ |

---

## 5. API設計

### 5.1 認証API

Better Authが提供するAPIエンドポイント

| エンドポイント | メソッド | 説明 |
|---------------|---------|------|
| /api/auth/[...all] | GET/POST | Better Auth統合エンドポイント |

---

### 5.2 Stripe決済API

#### POST /api/stripe/create-checkout

**機能概要**: Stripe Checkout Sessionを作成

**認可**: ログイン済みユーザー

**リクエスト**
```json
{
  "priceId": "price_xxxx",
  "successUrl": "/subscribe/success",
  "cancelUrl": "/subscribe/cancel",
  "metadata": {}
}
```

**レスポンス（成功）**
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

**レスポンス（エラー）**
| ステータス | 内容 |
|-----------|------|
| 401 | 未認証 |
| 400 | Price ID不足 |
| 500 | セッション作成失敗 |

---

#### POST /api/stripe/webhook

**機能概要**: Stripeからのイベント通知を処理

**認証**: Stripe署名検証

**処理対象イベント**

| イベント | 処理内容 |
|---------|---------|
| checkout.session.completed | 決済完了処理 |
| customer.subscription.deleted | サブスクリプション解約処理 |
| invoice.payment_failed | 支払い失敗処理 |

**checkout.session.completed処理フロー**
```
1. Stripe署名検証
2. セッションからuserId取得
3. サブスクリプション情報取得
4. membersテーブル更新
   - paymentStatus = 'completed'
   - stripeSubscriptionId設定
   - subscriptionStartDate/EndDate設定
```

**customer.subscription.deleted処理フロー**
```
1. サブスクリプションID取得
2. membersテーブル更新
   - paymentStatus = 'canceled'
   - subscriptionEndDate = 現在日時
```

---

## 6. バリデーション設計

### 6.1 ブログフォーム（blogFormSchema）

| フィールド | ルール | エラーメッセージ |
|-----------|--------|----------------|
| title | 必須、1-255文字、trim | 「タイトルを入力してください」「タイトルは255文字以内で入力してください」 |
| excerpt | 必須、1-500文字、trim | 「抜粋を入力してください」「抜粋は500文字以内で入力してください」 |
| content | 必須、1文字以上、trim | 「本文を入力してください」 |
| thumbnailUrl | 任意、有効なURL形式 | 「有効なURLを入力してください」 |
| published | boolean | - |
| isMemberOnly | boolean | - |

---

### 6.2 動画フォーム（videoFormSchema）

| フィールド | ルール | エラーメッセージ |
|-----------|--------|----------------|
| title | 必須、1-255文字 | 「動画タイトルを入力してください」 |
| videoDate | 必須、YYYY-MM-DD形式 | 「YYYY-MM-DD形式で入力してください」 |
| videoUrl | 必須、youtube.com/youtu.beドメイン | 「有効なYouTube URLを入力してください」 |
| thumbnailUrl | 任意、有効なURL形式 | 「有効なURLを入力してください」 |
| published | boolean | - |
| isMemberOnly | boolean | - |

---

### 6.3 スケジュールフォーム（scheduleFormSchema）

| フィールド | ルール | エラーメッセージ |
|-----------|--------|----------------|
| title | 必須、1-255文字 | 「イベント名を入力してください」 |
| content | 必須、1文字以上 | 「イベント詳細を入力してください」 |
| eventDate | 必須、YYYY-MM-DDTHH:MM形式 | 「日時を正しく入力してください」 |
| imageUrl | 任意、有効なURL形式 | 「有効なURLを入力してください」 |
| linkUrl | 任意、有効なURL形式 | 「有効なURLを入力してください」 |
| sortOrder | 必須、整数 | - |
| published | boolean | - |
| isMemberOnly | boolean | - |

---

### 6.4 お知らせフォーム（informationFormSchema）

| フィールド | ルール | エラーメッセージ |
|-----------|--------|----------------|
| date | 必須、YYYY-MM-DD形式 | 「YYYY-MM-DD形式で入力してください」 |
| title | 必須、1-255文字 | 「タイトルを入力してください」 |
| content | 必須、1文字以上 | 「本文を入力してください」 |
| imageUrl | 任意、有効なURL形式 | 「有効なURLを入力してください」 |
| url | 任意、有効なURL形式 | 「有効なURLを入力してください」 |
| published | boolean | - |
| isMemberOnly | boolean | - |

---

### 6.5 ニュースレターフォーム（newsletterFormSchema）

| フィールド | ルール | エラーメッセージ |
|-----------|--------|----------------|
| issueNumber | 必須、正の整数 | 「号数は正の数で入力してください」 |
| title | 必須、1-255文字 | 「タイトルを入力してください」 |
| excerpt | 必須、1-500文字 | 「概要を入力してください」 |
| content | 必須、1文字以上 | 「本文を入力してください」 |
| thumbnailUrl | 任意、有効なURL形式 | 「有効なURLを入力してください」 |
| pdfUrl | 任意、有効なURL形式 | 「有効なURLを入力してください」 |
| category | 任意、regular/special/extra | - |
| published | boolean | - |
| isMemberOnly | boolean | - |

---

### 6.6 会員プロフィールフォーム（memberProfileFormSchema）

| フィールド | ルール | エラーメッセージ |
|-----------|--------|----------------|
| lastName | 必須、1-100文字 | 「姓を入力してください」 |
| firstName | 必須、1-100文字 | 「名を入力してください」 |
| lastNameKana | 必須、1-100文字、カタカナのみ | 「セイを入力してください」「カタカナで入力してください」 |
| firstNameKana | 必須、1-100文字、カタカナのみ | 「メイを入力してください」「カタカナで入力してください」 |
| postalCode | 必須、7桁数字 | 「郵便番号は7桁の数字で入力してください（ハイフンなし）」 |
| prefecture | 必須、1-50文字 | 「都道府県を選択してください」 |
| city | 必須、1-100文字 | 「市区町村を入力してください」 |
| address | 必須、1-255文字 | 「町名番地を入力してください」 |
| building | 任意、0-255文字 | 「建物名は255文字以内で入力してください」 |
| phoneNumber | 必須、10-11桁数字（0から始まる） | 「有効な電話番号を入力してください（ハイフンなし、10〜11桁）」 |

**正規表現パターン**
```javascript
// カタカナチェック
/^[ァ-ヶー\s]+$/

// 郵便番号チェック
/^\d{7}$/

// 電話番号チェック
/^0\d{9,10}$/
```

---

## 7. 認証・認可詳細設計

### 7.1 ミドルウェア処理フロー

```
middleware.ts の処理フロー

1. セッションCookie取得
2. パスからロケールを除去
3. ルート種別判定
   ├── 管理者ルート判定（/admin/*）
   │   ├── 管理者ログインページ → 通過
   │   └── その他管理者ページ
   │       ├── セッションなし → /admin/login へリダイレクト
   │       └── セッションあり → 通過
   └── 一般ルート判定
       ├── 公開ルート → 通過
       └── プライベートルート
           ├── セッションなし → /login へリダイレクト（returnUrl付与）
           └── セッションあり → 通過
4. 国際化ミドルウェア実行
```

**公開ルート一覧**
```javascript
const publicRoutes = [
  "/login",
  "/signup",
  "/",
  "/information",
  "/schedule",
  "/video",
  "/blog",
  "/profiles",
  "/contact",
  "/supporters",
  "/register/terms",
  "/register/plan",
  "/register/auth",
];
```

---

### 7.2 セッション検証関数

#### verifySession()

```typescript
/**
 * ログイン確認
 * 未ログイン時は /login へリダイレクト
 * @returns セッション情報
 */
export const verifySession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return session;
}
```

---

#### verifyAdmin()

```typescript
/**
 * 管理者権限確認
 * 管理者でない場合はエラーをスロー
 * @returns { userId, memberId, member }
 */
export const verifyAdmin = async () => {
  const session = await verifySession();
  const userId = session.user.id;

  const member = await db.query.members.findFirst({
    where: eq(members.userId, userId),
  });

  if (!member || member.role !== "admin") {
    throw new Error("管理者権限が必要です");
  }

  return { userId, memberId: member.id, member };
}
```

---

#### verifyActiveMember()

```typescript
/**
 * アクティブ会員確認
 * status !== 'active' の場合は適切にリダイレクト/エラー
 * @returns { userId, memberId, member }
 */
export const verifyActiveMember = async () => {
  const session = await verifySession();
  const userId = session.user.id;

  const member = await db.query.members.findFirst({
    where: eq(members.userId, userId),
    with: { plan: true },
  });

  if (!member) {
    throw new Error("会員情報が見つかりません");
  }

  if (member.status !== "active") {
    if (member.status === "pending_profile") {
      redirect("/profile/complete");
    }
    if (member.status === "inactive") {
      throw new Error("このアカウントは無効化されています");
    }
    throw new Error("コンテンツにアクセスするには会員登録を完了してください");
  }

  return { userId, memberId: member.id, member };
}
```

---

#### canAccessContent()

```typescript
/**
 * プラン階層によるアクセス権限チェック
 * @param member 会員情報（プラン含む）
 * @param requiredPlanLevel 必要なプラン階層レベル
 * @returns アクセス可否
 */
export const canAccessContent = (
  member: MemberWithPlan,
  requiredPlanLevel: number
): boolean => {
  // 管理者は全てアクセス可能
  if (member.role === "admin") {
    return true;
  }

  // ステータスチェック
  if (member.status !== "active") {
    return false;
  }

  // プラン未設定
  if (!member.plan) {
    return false;
  }

  // 階層チェック（大きいほど上位）
  return member.plan.hierarchyLevel >= requiredPlanLevel;
}
```

---

#### canAccessMemberContent()

```typescript
/**
 * 会員限定コンテンツアクセス可否チェック
 * セッションがない/会員でない場合は false
 * @returns boolean
 */
export const canAccessMemberContent = async (): Promise<boolean> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return false;
    }

    const member = await db.query.members.findFirst({
      where: eq(members.userId, session.user.id),
      with: { plan: true },
    });

    if (!member || member.status !== "active") {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error checking member access:", error);
    return false;
  }
}
```

---

### 7.3 会員登録フロー

```
会員登録フロー

1. /signup
   └── 会員登録案内画面
       └── 「会員登録」ボタン → /register/terms

2. /register/terms
   └── 利用規約確認・同意
       └── 「同意して次へ」→ /register/plan

3. /register/plan
   └── プラン選択
       └── プラン選択 → /register/auth

4. /register/auth
   └── メール・パスワード入力
       └── Better Auth signUp実行
       └── 成功 → /register/payment

5. /register/payment
   └── Stripe Checkout へリダイレクト
       └── 決済完了 → /register/payment/success
       └── キャンセル → /register/payment（戻る）

6. /register/payment/success
   └── 決済完了確認
       └── 「続ける」→ /profile/complete

7. /profile/complete
   └── プロフィール詳細入力
       └── 保存 → /mypage
       └── status: pending_profile → active
```

---

## 8. コンポーネント設計

### 8.1 共通UIコンポーネント（shadcn/ui）

| コンポーネント | ファイル | 用途 |
|--------------|---------|------|
| Button | components/ui/button.tsx | ボタン |
| Input | components/ui/input.tsx | テキスト入力 |
| Textarea | components/ui/textarea.tsx | 複数行テキスト入力 |
| Select | components/ui/select.tsx | セレクトボックス |
| Checkbox | components/ui/checkbox.tsx | チェックボックス |
| Form | components/ui/form.tsx | フォームコンテナ |
| Card | components/ui/card.tsx | カードコンテナ |
| Table | components/ui/table.tsx | テーブル |
| Dialog | components/ui/dialog.tsx | モーダルダイアログ |
| Toast | components/ui/sonner.tsx | トースト通知 |
| Tabs | components/ui/tabs.tsx | タブ切り替え |
| Accordion | components/ui/accordion.tsx | アコーディオン |
| Calendar | components/ui/calendar.tsx | カレンダー |
| DatePicker | components/ui/date-picker.tsx | 日付選択 |
| DropdownMenu | components/ui/dropdown-menu.tsx | ドロップダウンメニュー |

---

### 8.2 機能別コンポーネント

#### ヘッダー・フッター

| コンポーネント | ファイル | 説明 |
|--------------|---------|------|
| Header | components/header/ | 共通ヘッダー |
| Footer | components/footer/ | 共通フッター |
| LocaleToggle | components/locale-toggle/ | 言語切り替え |

#### ブログ関連

| コンポーネント | ファイル | 説明 |
|--------------|---------|------|
| BlogCard | components/blog/blog-card.tsx | ブログカード表示 |
| BlogForm | components/blog/blog-form.tsx | ブログ作成・編集フォーム |
| DeleteBlogButton | components/delete-blog-button.tsx | ブログ削除ボタン |

#### 動画関連

| コンポーネント | ファイル | 説明 |
|--------------|---------|------|
| VideoCard | components/video/video-card.tsx | 動画カード表示 |
| VideoForm | components/video/video-form.tsx | 動画作成・編集フォーム |
| DeleteVideoButton | components/delete-video-button.tsx | 動画削除ボタン |
| TogglePublishVideoButton | components/toggle-publish-video-button.tsx | 公開状態切替ボタン |

#### スケジュール関連

| コンポーネント | ファイル | 説明 |
|--------------|---------|------|
| ScheduleCard | components/schedule/schedule-card.tsx | スケジュールカード |
| ScheduleForm | components/schedule/schedule-form.tsx | スケジュールフォーム |
| DeleteScheduleButton | components/delete-schedule-button.tsx | 削除ボタン |
| TogglePublishScheduleButton | components/toggle-publish-schedule-button.tsx | 公開状態切替 |

#### お知らせ関連

| コンポーネント | ファイル | 説明 |
|--------------|---------|------|
| InformationCard | components/information/information-card.tsx | お知らせカード |
| InformationForm | components/information/information-form.tsx | お知らせフォーム |
| DeleteInformationButton | components/delete-information-button.tsx | 削除ボタン |

#### ニュースレター関連

| コンポーネント | ファイル | 説明 |
|--------------|---------|------|
| NewsletterForm | components/newsletter/newsletter-form.tsx | ニュースレターフォーム |

#### 会員関連

| コンポーネント | ファイル | 説明 |
|--------------|---------|------|
| LoginForm | components/login-form/ | ログインフォーム |
| AdminLoginForm | components/admin-login-form/ | 管理者ログインフォーム |
| ProfileCompletionBanner | components/profile/profile-completion-banner.tsx | プロフィール完成バナー |
| MemberOnlyContent | components/member-only-content.tsx | 会員限定コンテンツラッパー |
| UserCard | components/user-card.tsx | ユーザーカード |
| AccountForm | components/account-form.tsx | アカウント管理フォーム |
| DeleteAccountButton | components/delete-account-button.tsx | アカウント削除ボタン |

#### ファイル入力

| コンポーネント | ファイル | 説明 |
|--------------|---------|------|
| InputFile | components/input-file.tsx | ファイル入力 |
| InputImage | components/input-image.tsx | 画像入力（プレビュー付き） |

#### 登録フロー

| コンポーネント | ファイル | 説明 |
|--------------|---------|------|
| RegisterTerms | components/register/ | 規約同意コンポーネント |
| RegisterPlan | components/register/ | プラン選択コンポーネント |
| RegisterAuth | components/register/ | 認証情報入力コンポーネント |
| RegistrationContext | contexts/RegistrationContext.tsx | 登録フロー状態管理 |

---

### 8.3 コンポーネント命名規則

| 種類 | 命名規則 | 例 |
|------|---------|-----|
| ページコンポーネント | PascalCase | BlogPage, AdminDashboard |
| 機能コンポーネント | PascalCase（機能名-形式） | BlogCard, BlogForm |
| UIコンポーネント | PascalCase | Button, Input, Card |
| アクションボタン | 動詞-対象-Button | DeleteBlogButton, TogglePublishVideoButton |
| フォーム | 対象-Form | BlogForm, AccountForm |
| カード | 対象-Card | BlogCard, VideoCard |

---

## 更新履歴

| 日付 | バージョン | 内容 | 作成者 |
|------|-----------|------|--------|
| 2025-12-10 | 1.0 | 初版作成 | - |

---

## 関連ドキュメント

- [要件定義書](./01_requirements-definition.md)
- [基本設計書](./02_basic-design.md)
- テスト仕様書（今後作成予定）
