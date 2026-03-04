# DB設計書

## 技術スタック

- ORM: Drizzle ORM
- データベース: PostgreSQL
- ID生成: nanoid（一部テーブルはBetter Auth管理）

## Enum定義

| Enum名 | 値 | 説明 |
|--------|-----|------|
| members_role | admin, officer, member | 会員ロール |
| members_status | pending_profile, active, inactive | 会員ステータス |
| payment_status | pending, completed, failed, canceled | 支払いステータス |
| pet_type | dog, cat | ペット種別 |

## テーブル一覧

| No. | テーブル物理名 | テーブル論理名 | スキーマファイル | 説明 |
|-----|---------------|---------------|-----------------|------|
| 1 | users | ユーザー | auth.ts | Better Auth管理の認証ユーザー |
| 2 | sessions | セッション | auth.ts | Better Auth管理のセッション |
| 3 | accounts | アカウント | auth.ts | Better Auth管理のOAuthアカウント連携 |
| 4 | verifications | 認証確認 | auth.ts | Better Auth管理のメール認証等 |
| 5 | subscriptions | サブスクリプション | auth.ts | Better Auth Stripe Plugin管理 |
| 6 | members | 会員 | member.ts | 会員プロフィール・プラン・支払い情報 |
| 7 | member_plans | 会員プラン | member-plans.ts | 会員プランマスター |
| 8 | blogs | ブログ | blogs.ts | ブログ記事 |
| 9 | informations | お知らせ | informations.ts | お知らせ |
| 10 | newsletters | ニュースレター | newsletters.ts | 会報 |
| 11 | schedules | スケジュール | schedules.ts | イベントスケジュール |
| 12 | videos | 動画 | videos.ts | 動画コンテンツ |
| 13 | photo_library | フォトライブラリ | photo-library.ts | フォトアルバム |
| 14 | photo_library_images | フォトライブラリ画像 | photo-library.ts | アルバム内の個別画像 |
| 15 | sponsors | スポンサー | sponsors.ts | スポンサー企業 |
| 16 | pets | ペット | pet.ts | ペット（ゲーミフィケーション機能） |

---

## テーブル定義

### 1. ユーザー (users)

> Better Authが管理する認証ユーザーテーブル。

| No. | 物理名 | 論理名 | 型 | 備考 | 例 |
|-----|--------|--------|-----|------|-----|
| 1 | id | 主キー | text | PK | |
| 2 | name | ユーザー名 | text | 必須 | 山田太郎 |
| 3 | email | メールアドレス | text | 必須、@unique | yamada@example.com |
| 4 | email_verified | メール認証済み | boolean | 必須、@default(false) | true / false |
| 5 | image | プロフィール画像URL | text | オプショナル | |
| 6 | is_anonymous | 匿名ユーザーフラグ | boolean | オプショナル | true / false |
| 7 | stripe_customer_id | Stripe顧客ID | text | オプショナル | cus_xxxxx |
| 8 | created_at | 作成日時 | timestamp | 必須、@defaultNow() | |
| 9 | updated_at | 更新日時 | timestamp | 必須、@defaultNow()、自動更新 | |

---

### 2. セッション (sessions)

> Better Authが管理するセッションテーブル。

| No. | 物理名 | 論理名 | 型 | 備考 | 例 |
|-----|--------|--------|-----|------|-----|
| 1 | id | 主キー | text | PK | |
| 2 | expires_at | 有効期限 | timestamp | 必須 | |
| 3 | token | セッショントークン | text | 必須、@unique | |
| 4 | ip_address | IPアドレス | text | オプショナル | 192.168.1.1 |
| 5 | user_agent | ユーザーエージェント | text | オプショナル | |
| 6 | user_id | ユーザーFK | text | 必須、FK → users.id (CASCADE)、@index | |
| 7 | created_at | 作成日時 | timestamp | 必須、@defaultNow() | |
| 8 | updated_at | 更新日時 | timestamp | 必須、自動更新 | |

---

### 3. アカウント (accounts)

> Better Authが管理するOAuthアカウント連携テーブル。

| No. | 物理名 | 論理名 | 型 | 備考 | 例 |
|-----|--------|--------|-----|------|-----|
| 1 | id | 主キー | text | PK | |
| 2 | account_id | アカウントID | text | 必須 | |
| 3 | provider_id | プロバイダーID | text | 必須 | google / github |
| 4 | user_id | ユーザーFK | text | 必須、FK → users.id (CASCADE)、@index | |
| 5 | access_token | アクセストークン | text | オプショナル | |
| 6 | refresh_token | リフレッシュトークン | text | オプショナル | |
| 7 | id_token | IDトークン | text | オプショナル | |
| 8 | access_token_expires_at | アクセストークン有効期限 | timestamp | オプショナル | |
| 9 | refresh_token_expires_at | リフレッシュトークン有効期限 | timestamp | オプショナル | |
| 10 | scope | スコープ | text | オプショナル | |
| 11 | password | パスワード（ハッシュ） | text | オプショナル | |
| 12 | created_at | 作成日時 | timestamp | 必須、@defaultNow() | |
| 13 | updated_at | 更新日時 | timestamp | 必須、自動更新 | |

---

### 4. 認証確認 (verifications)

> Better Authが管理するメール認証・パスワードリセット等の確認テーブル。

| No. | 物理名 | 論理名 | 型 | 備考 | 例 |
|-----|--------|--------|-----|------|-----|
| 1 | id | 主キー | text | PK | |
| 2 | identifier | 識別子 | text | 必須、@index | |
| 3 | value | 確認値 | text | 必須 | |
| 4 | expires_at | 有効期限 | timestamp | 必須 | |
| 5 | created_at | 作成日時 | timestamp | 必須、@defaultNow() | |
| 6 | updated_at | 更新日時 | timestamp | 必須、@defaultNow()、自動更新 | |

---

### 5. サブスクリプション (subscriptions)

> Better Auth Stripe Pluginが管理するサブスクリプションテーブル。

| No. | 物理名 | 論理名 | 型 | 備考 | 例 |
|-----|--------|--------|-----|------|-----|
| 1 | id | 主キー | text | PK | |
| 2 | plan | プラン名 | text | 必須 | |
| 3 | reference_id | 参照ID | text | 必須 | |
| 4 | stripe_customer_id | Stripe顧客ID | text | オプショナル | cus_xxxxx |
| 5 | stripe_subscription_id | StripeサブスクリプションID | text | オプショナル | sub_xxxxx |
| 6 | status | ステータス | text | @default("incomplete") | active / incomplete / canceled |
| 7 | period_start | 期間開始日 | timestamp | オプショナル | |
| 8 | period_end | 期間終了日 | timestamp | オプショナル | |
| 9 | trial_start | トライアル開始日 | timestamp | オプショナル | |
| 10 | trial_end | トライアル終了日 | timestamp | オプショナル | |
| 11 | cancel_at_period_end | 期間末キャンセル | boolean | @default(false) | true / false |
| 12 | seats | シート数 | integer | オプショナル | |

---

### 6. 会員 (members)

> 会員のプロフィール・プラン・支払い情報を管理するテーブル。

| No. | 物理名 | 論理名 | 型 | 備考 | 例 |
|-----|--------|--------|-----|------|-----|
| 1 | id | 主キー | text | PK、nanoid自動生成 | |
| 2 | user_id | ユーザーFK | text | 必須、FK → users.id (CASCADE) | |
| 3 | email | メールアドレス | varchar(255) | @unique、オプショナル | yamada@example.com |
| 4 | last_name | 姓 | varchar(100) | オプショナル | 山田 |
| 5 | first_name | 名 | varchar(100) | オプショナル | 太郎 |
| 6 | last_name_kana | 姓（カナ） | varchar(100) | オプショナル | ヤマダ |
| 7 | first_name_kana | 名（カナ） | varchar(100) | オプショナル | タロウ |
| 8 | postal_code | 郵便番号 | varchar(8) | オプショナル | 100-0001 |
| 9 | prefecture | 都道府県 | varchar(50) | オプショナル | 東京都 |
| 10 | city | 市区町村 | varchar(100) | オプショナル | 千代田区 |
| 11 | address | 番地 | varchar(255) | オプショナル | 1-1-1 |
| 12 | building | 建物名 | varchar(255) | オプショナル | ○○ビル3F |
| 13 | phone_number | 電話番号 | varchar(20) | オプショナル | 090-1234-5678 |
| 14 | plan_id | 会員プランFK | integer | FK → member_plans.id (RESTRICT)、オプショナル | |
| 15 | role | ロール | members_role | 必須 | admin / officer / member |
| 16 | status | ステータス | members_status | @default("pending_profile") | pending_profile / active / inactive |
| 17 | profile_completed | プロフィール完了 | boolean | 必須、@default(false) | true / false |
| 18 | is_active | 有効フラグ | boolean | 必須、@default(true) | true / false |
| 19 | payment_status | 支払いステータス | payment_status | @default("pending") | pending / completed / failed / canceled |
| 20 | stripe_subscription_id | StripeサブスクリプションID | varchar(255) | オプショナル | sub_xxxxx |
| 21 | subscription_start_date | サブスクリプション開始日 | timestamp | オプショナル | |
| 22 | subscription_end_date | サブスクリプション終了日 | timestamp | オプショナル | |
| 23 | is_migrated | 移行済みフラグ | boolean | 必須、@default(false) | true / false |
| 24 | migrated_at | 移行日時 | timestamp | オプショナル | |
| 25 | welcome_gift_sent | 初回特典郵送済み | boolean | 必須、@default(false) | true / false |
| 26 | created_at | 作成日時 | timestamp | 必須、@defaultNow() | |
| 27 | updated_at | 更新日時 | timestamp | 必須、@defaultNow()、自動更新 | |

---

### 7. 会員プラン (member_plans)

> 会員プランのマスターテーブル。Stripe連携情報を含む。

| No. | 物理名 | 論理名 | 型 | 備考 | 例 |
|-----|--------|--------|-----|------|-----|
| 1 | id | 主キー | serial | PK、自動採番 | |
| 2 | plan_code | プランコード | varchar(50) | 必須、@unique | individual_a |
| 3 | plan_name | プラン名 | varchar(100) | 必須 | 個人会員A |
| 4 | display_name | 表示名 | varchar(100) | 必須 | 個人会員プランA |
| 5 | description | 説明 | text | オプショナル | |
| 6 | price | 価格 | decimal(10,2) | 必須 | 5000.00 |
| 7 | hierarchy_level | 階層レベル | integer | 必須 | 1 |
| 8 | is_business_plan | 法人プランフラグ | boolean | @default(false) | true / false |
| 9 | features | 機能一覧 | jsonb | オプショナル | |
| 10 | color | テーマカラー | varchar(20) | オプショナル | #3B82F6 |
| 11 | is_active | 有効フラグ | boolean | 必須、@default(true) | true / false |
| 12 | stripe_price_id | Stripe定期課金価格ID | varchar(255) | オプショナル | price_xxxxx |
| 13 | stripe_one_time_price_id | Stripe一括払い価格ID | varchar(255) | オプショナル | price_xxxxx |
| 14 | created_at | 作成日時 | timestamp | 必須、@defaultNow() | |
| 15 | updated_at | 更新日時 | timestamp | 必須、@defaultNow()、自動更新 | |

---

### 8. ブログ (blogs)

| No. | 物理名 | 論理名 | 型 | 備考 | 例 |
|-----|--------|--------|-----|------|-----|
| 1 | id | 主キー | text | PK、nanoid自動生成 | |
| 2 | title | タイトル | text | 必須 | |
| 3 | excerpt | 抜粋 | text | 必須 | |
| 4 | content | 本文 | text | 必須 | |
| 5 | thumbnail_url | サムネイルURL | text | オプショナル | |
| 6 | published | 公開フラグ | boolean | 必須、@default(false) | true / false |
| 7 | is_member_only | 会員限定フラグ | boolean | 必須、@default(false) | true / false |
| 8 | author_id | 著者FK | text | FK → users.id (SET NULL)、オプショナル | |
| 9 | author_name | 著者名 | text | オプショナル | 山田太郎 |
| 10 | view_count | 閲覧数 | integer | 必須、@default(0) | 150 |
| 11 | created_at | 作成日時 | timestamp | 必須、@defaultNow() | |
| 12 | updated_at | 更新日時 | timestamp | 必須、@defaultNow()、自動更新 | |

---

### 9. お知らせ (informations)

| No. | 物理名 | 論理名 | 型 | 備考 | 例 |
|-----|--------|--------|-----|------|-----|
| 1 | id | 主キー | text | PK、nanoid自動生成 | |
| 2 | date | 日付 | date | 必須 | 2026-03-01 |
| 3 | title | タイトル | text | 必須 | |
| 4 | content | 本文 | text | 必須 | |
| 5 | image_url | 画像URL | text | オプショナル | |
| 6 | url | リンクURL | text | オプショナル | |
| 7 | published | 公開フラグ | boolean | 必須、@default(false) | true / false |
| 8 | is_member_only | 会員限定フラグ | boolean | 必須、@default(false) | true / false |
| 9 | created_by | 作成者FK | text | FK → users.id (SET NULL)、オプショナル | |
| 10 | created_at | 作成日時 | timestamp | 必須、@defaultNow() | |
| 11 | updated_at | 更新日時 | timestamp | 必須、@defaultNow()、自動更新 | |

---

### 10. ニュースレター (newsletters)

> 会報テーブル。デフォルトで会員限定。

| No. | 物理名 | 論理名 | 型 | 備考 | 例 |
|-----|--------|--------|-----|------|-----|
| 1 | id | 主キー | text | PK、nanoid自動生成 | |
| 2 | issue_number | 号数 | integer | 必須、@unique | 12 |
| 3 | title | タイトル | text | 必須 | |
| 4 | excerpt | 抜粋 | text | 必須 | |
| 5 | content | 本文 | text | 必須 | |
| 6 | thumbnail_url | サムネイルURL | text | オプショナル | |
| 7 | pdf_url | PDFファイルURL | text | オプショナル | |
| 8 | author_id | 著者FK | text | FK → users.id (SET NULL)、オプショナル | |
| 9 | author_name | 著者名 | text | オプショナル | 山田太郎 |
| 10 | category | カテゴリ | text | オプショナル | regular / special / extra |
| 11 | view_count | 閲覧数 | integer | 必須、@default(0) | 85 |
| 12 | published | 公開フラグ | boolean | 必須、@default(false) | true / false |
| 13 | is_member_only | 会員限定フラグ | boolean | 必須、@default(true) | true / false |
| 14 | published_at | 公開日時 | timestamp | オプショナル | |
| 15 | created_at | 作成日時 | timestamp | 必須、@defaultNow() | |
| 16 | updated_at | 更新日時 | timestamp | 必須、@defaultNow()、自動更新 | |

---

### 11. スケジュール (schedules)

| No. | 物理名 | 論理名 | 型 | 備考 | 例 |
|-----|--------|--------|-----|------|-----|
| 1 | id | 主キー | text | PK、nanoid自動生成 | |
| 2 | title | タイトル | text | 必須 | |
| 3 | content | 内容 | text | 必須 | |
| 4 | event_date | イベント日時 | timestamp(tz) | 必須、タイムゾーン付き | |
| 5 | image_url | 画像URL | text | オプショナル | |
| 6 | link_url | リンクURL | text | オプショナル | |
| 7 | sort_order | 表示順 | integer | 必須、@default(0) | 1 |
| 8 | published | 公開フラグ | boolean | 必須、@default(false) | true / false |
| 9 | is_member_only | 会員限定フラグ | boolean | 必須、@default(false) | true / false |
| 10 | author_id | 著者FK | text | FK → users.id (SET NULL)、オプショナル | |
| 11 | author_name | 著者名 | text | オプショナル | 山田太郎 |
| 12 | author_email | 著者メール | text | オプショナル | yamada@example.com |
| 13 | created_at | 作成日時 | timestamp | 必須、@defaultNow() | |
| 14 | updated_at | 更新日時 | timestamp | 必須、@defaultNow()、自動更新 | |

---

### 12. 動画 (videos)

| No. | 物理名 | 論理名 | 型 | 備考 | 例 |
|-----|--------|--------|-----|------|-----|
| 1 | id | 主キー | text | PK、nanoid自動生成 | |
| 2 | title | タイトル | text | 必須 | |
| 3 | video_date | 動画日付 | date | 必須 | 2026-03-01 |
| 4 | video_url | 動画URL | text | 必須 | |
| 5 | thumbnail_url | サムネイルURL | text | オプショナル | |
| 6 | published | 公開フラグ | boolean | 必須、@default(false) | true / false |
| 7 | is_member_only | 会員限定フラグ | boolean | 必須、@default(false) | true / false |
| 8 | author_id | 著者FK | text | FK → users.id (SET NULL)、オプショナル | |
| 9 | author_name | 著者名 | text | オプショナル | 山田太郎 |
| 10 | view_count | 閲覧数 | integer | 必須、@default(0) | 200 |
| 11 | created_at | 作成日時 | timestamp | 必須、@defaultNow() | |
| 12 | updated_at | 更新日時 | timestamp | 必須、@defaultNow()、自動更新 | |

---

### 13. フォトライブラリ (photo_library)

> フォトアルバムテーブル。

| No. | 物理名 | 論理名 | 型 | 備考 | 例 |
|-----|--------|--------|-----|------|-----|
| 1 | id | 主キー | text | PK、nanoid自動生成 | |
| 2 | title | タイトル | text | 必須 | |
| 3 | description | 説明 | text | オプショナル | |
| 4 | cover_image_url | カバー画像URL | text | オプショナル | |
| 5 | published | 公開フラグ | boolean | 必須、@default(false) | true / false |
| 6 | is_member_only | 会員限定フラグ | boolean | 必須、@default(true) | true / false |
| 7 | created_by | 作成者FK | text | FK → users.id (SET NULL)、オプショナル | |
| 8 | view_count | 閲覧数 | integer | 必須、@default(0) | 50 |
| 9 | created_at | 作成日時 | timestamp | 必須、@defaultNow() | |
| 10 | updated_at | 更新日時 | timestamp | 必須、@defaultNow()、自動更新 | |

---

### 14. フォトライブラリ画像 (photo_library_images)

> アルバム内の個別画像テーブル。

| No. | 物理名 | 論理名 | 型 | 備考 | 例 |
|-----|--------|--------|-----|------|-----|
| 1 | id | 主キー | text | PK、nanoid自動生成 | |
| 2 | photo_library_id | フォトライブラリFK | text | 必須、FK → photo_library.id (CASCADE) | |
| 3 | image_url | 画像URL | text | 必須 | |
| 4 | caption | キャプション | text | オプショナル | |
| 5 | sort_order | 表示順 | integer | 必須、@default(0) | 1 |
| 6 | created_at | 作成日時 | timestamp | 必須、@defaultNow() | |

---

### 15. スポンサー (sponsors)

| No. | 物理名 | 論理名 | 型 | 備考 | 例 |
|-----|--------|--------|-----|------|-----|
| 1 | id | 主キー | text | PK、nanoid自動生成 | |
| 2 | company_name | 企業名 | text | オプショナル | 株式会社○○ |
| 3 | logo_url | ロゴURL | text | オプショナル | |
| 4 | representative_name | 代表者名 | text | 必須 | 山田太郎 |
| 5 | has_flag | 旗掲出フラグ | boolean | 必須、@default(false) | true / false |
| 6 | program_consent | プログラム掲載同意 | boolean | 必須、@default(false) | true / false |
| 7 | website_consent | Webサイト掲載同意 | boolean | 必須、@default(false) | true / false |
| 8 | created_at | 作成日時 | timestamp | 必須、@defaultNow() | |
| 9 | updated_at | 更新日時 | timestamp | 必須、@defaultNow()、自動更新 | |

---

### 16. ペット (pets)

> ゲーミフィケーション機能用のペットテーブル。

| No. | 物理名 | 論理名 | 型 | 備考 | 例 |
|-----|--------|--------|-----|------|-----|
| 1 | id | 主キー | text | PK、nanoid自動生成 | |
| 2 | name | ペット名 | text | 必須 | ポチ |
| 3 | type | 種別 | pet_type | 必須 | dog / cat |
| 4 | hp | HP | integer | 必須、@default(50) | 50 |
| 5 | owner_id | 飼い主FK | text | 必須、FK → users.id (CASCADE) | |
