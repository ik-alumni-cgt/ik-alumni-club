# IK ALUMNI CGT サポーターズクラブ - SQL型データベース設計書

**作成日**: 2025-10-06
**対象DBMS**: PostgreSQL / MySQL
**バージョン**: 1.0

---

## 📋 目次

1. [概要](#概要)
2. [データモデル設計方針](#データモデル設計方針)
3. [エンティティ定義](#エンティティ定義)
4. [リレーションシップ](#リレーションシップ)
5. [ER図](#er図)
6. [正規化とデータ整合性](#正規化とデータ整合性)
7. [インデックス戦略](#インデックス戦略)
8. [セキュリティとアクセス制御](#セキュリティとアクセス制御)
9. [Firestoreとの比較](#firestoreとの比較)
10. [マイグレーション考慮事項](#マイグレーション考慮事項)

---

## 概要

本書は、現在Firestore（NoSQL）で実装されている「IK ALUMNI CGT サポーターズクラブ会員サイト」のデータベースを、リレーショナルデータベース（RDBMS）に移行する場合の設計書です。

### 設計目標

- **データ整合性**: 外部キー制約による参照整合性の保証
- **クエリ効率**: JOINを活用した柔軟なデータ取得
- **スケーラビリティ**: 適切なインデックス設計とパーティショニング
- **保守性**: 正規化による冗長性の排除
- **拡張性**: 将来的な機能追加に対応可能な構造

---

## データモデル設計方針

### 正規化レベル

**第3正規形（3NF）を基本** とし、以下の例外を設ける：

- **パフォーマンス最適化**: 頻繁にアクセスされる作成者名などは非正規化
- **履歴管理**: 削除された作成者情報を保持するため、一部のカラムを冗長化

### 主キー戦略

- **UUID（v4）**: グローバルユニーク性が必要なエンティティ（members, contents等）
- **Serial（Auto Increment）**: マスタデータ（member_plans, tags等）
- **複合キー**: 中間テーブル（content_tags）

### 外部キー制約

すべてのリレーションシップに外部キー制約を設定し、参照整合性を保証する。

### 削除時の動作

- **CASCADE**: 親が削除されたら子も削除（例: content削除時のcontent_tags）
- **SET NULL**: 親が削除されても子は残す（例: member削除時のcontents.author_id）
- **RESTRICT**: 子が存在する場合は親を削除不可（例: member_plans）

---

## エンティティ定義

### 1. members（会員）

**目的**: 会員の基本情報とアカウント管理

#### カラム定義

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | UUID | PK | 内部ID |
| uid | VARCHAR(128) | UNIQUE, NOT NULL | Firebase Auth UID |
| email | VARCHAR(255) | UNIQUE, NOT NULL | メールアドレス |
| last_name | VARCHAR(100) | NOT NULL | 姓 |
| first_name | VARCHAR(100) | NOT NULL | 名 |
| last_name_kana | VARCHAR(100) | NOT NULL | セイ（カタカナ） |
| first_name_kana | VARCHAR(100) | NOT NULL | メイ（カタカナ） |
| postal_code | VARCHAR(8) | NOT NULL | 郵便番号（ハイフンなし） |
| prefecture | VARCHAR(50) | NOT NULL | 都道府県 |
| city | VARCHAR(100) | NOT NULL | 市区町村 |
| address | VARCHAR(255) | NOT NULL | 町名番地 |
| building | VARCHAR(255) | NULL | 建物名・部屋番号 |
| phone_number | VARCHAR(20) | NOT NULL | 電話番号 |
| plan_id | INTEGER | FK, NOT NULL | 会員プランID |
| role | VARCHAR(20) | NOT NULL, DEFAULT 'member' | 権限（admin/member） |
| is_active | BOOLEAN | NOT NULL, DEFAULT true | アカウント有効状態 |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 更新日時 |

#### インデックス

- PRIMARY KEY: `id`
- UNIQUE INDEX: `uid`, `email`
- INDEX: `plan_id`, `is_active`
- COMPOSITE INDEX: `(is_active, plan_id)` - アクティブ会員のプラン別集計用

#### ビジネスルール

- `role` は 'admin' または 'member' のみ許可（CHECK制約）
- `uid` はFirebase Authenticationから発行された値を使用
- `postal_code` は数字7桁（バリデーションはアプリ層で実施）
- 退会時は `is_active` を `false` に設定（論理削除）

---

### 2. member_plans（会員プラン）

**目的**: 会員プランのマスタデータ管理

#### カラム定義

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | SERIAL | PK | プランID |
| plan_code | VARCHAR(50) | UNIQUE, NOT NULL | プランコード |
| plan_name | VARCHAR(100) | NOT NULL | プラン名（英語） |
| display_name | VARCHAR(100) | NOT NULL | 表示名（日本語） |
| description | TEXT | NULL | プラン説明 |
| price | DECIMAL(10, 2) | NOT NULL | 月額料金 |
| hierarchy_level | INTEGER | NOT NULL | 階層レベル（1-3） |
| is_business_plan | BOOLEAN | DEFAULT false | 法人プランフラグ |
| features | JSONB/JSON | NULL | 特典リスト（JSON） |
| color | VARCHAR(20) | NULL | UI表示用カラーコード |
| is_active | BOOLEAN | DEFAULT true | プラン有効状態 |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 更新日時 |

#### 初期データ

| plan_code | display_name | price | hierarchy_level | is_business_plan |
|-----------|--------------|-------|-----------------|------------------|
| individual | 個人会員 | 3000.00 | 1 | false |
| business | 法人会員 | 10000.00 | 2 | true |
| platinum_individual | プラチナ個人会員 | 8000.00 | 3 | false |
| platinum_business | プラチナ法人会員 | 20000.00 | 3 | true |

#### ビジネスルール

- **階層レベル**: 1=Individual, 2=Business, 3=Platinum
- **アクセス制御**: `hierarchy_level` が大きいほど下位プランのコンテンツにもアクセス可能
- プランの削除は制限（会員が紐づいている場合はRESTRICT）

---

### 3. contents（会員限定コンテンツ）

**目的**: 会員向けの記事・動画・ドキュメント管理

#### カラム定義

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | UUID | PK | コンテンツID |
| title | VARCHAR(255) | NOT NULL | タイトル |
| description | TEXT | NULL | 概要 |
| content_type | VARCHAR(50) | NOT NULL | 種別（article/video/document/newsletter） |
| required_plan_id | INTEGER | FK, NOT NULL | 必要プランID |
| author_id | UUID | FK, NULL | 作成者ID |
| author_name | VARCHAR(255) | NULL | 作成者名（非正規化） |
| excerpt | TEXT | NULL | 抜粋（ブログ用） |
| category | VARCHAR(100) | NULL | カテゴリ（ブログ用） |
| read_time | INTEGER | NULL | 読了時間（分） |
| is_premium | BOOLEAN | DEFAULT false | プレミアムコンテンツフラグ |
| content | TEXT | NULL | 本文（HTML） |
| thumbnail_url | TEXT | NULL | サムネイル画像URL |
| file_url | TEXT | NULL | 添付ファイルURL |
| published | BOOLEAN | DEFAULT false | 公開状態 |
| published_at | TIMESTAMP WITH TIME ZONE | NULL | 公開日時 |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 更新日時 |

#### インデックス

- PRIMARY KEY: `id`
- INDEX: `content_type`, `required_plan_id`, `author_id`
- COMPOSITE INDEX: `(published, published_at DESC)` - 公開コンテンツの一覧取得用
- FULLTEXT INDEX: `(title, description, content)` - 全文検索用

#### ビジネスルール

- `content_type` は 'article', 'video', 'document', 'newsletter' のいずれか
- 下書き保存時は `published = false`
- 公開時に `published_at` を自動設定
- 作成者が削除された場合も記事は保持（`author_id` は SET NULL）

---

### 4. tags（タグマスタ）

**目的**: コンテンツのタグ管理

#### カラム定義

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | SERIAL | PK | タグID |
| tag_name | VARCHAR(100) | UNIQUE, NOT NULL | タグ名 |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 作成日時 |

#### ビジネスルール

- タグ名は重複不可（UNIQUE制約）
- 未使用のタグも残す（削除しない）

---

### 5. content_tags（コンテンツ・タグ関連付け）

**目的**: コンテンツとタグの多対多リレーション

#### カラム定義

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| content_id | UUID | FK, PK | コンテンツID |
| tag_id | INTEGER | FK, PK | タグID |

#### インデックス

- PRIMARY KEY: `(content_id, tag_id)`
- INDEX: `content_id`, `tag_id`

#### ビジネスルール

- コンテンツ削除時は関連タグも削除（CASCADE）
- タグ削除時は関連付けも削除（CASCADE）

---

### 6. informations（お知らせ）

**目的**: 公開ニュース・お知らせの管理

#### カラム定義

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | UUID | PK | お知らせID |
| date | DATE | NOT NULL | 投稿日 |
| title | VARCHAR(255) | NOT NULL | タイトル |
| content | TEXT | NOT NULL | 本文 |
| image_url | TEXT | NULL | アイキャッチ画像URL |
| url | TEXT | NULL | 外部リンクURL |
| published | BOOLEAN | DEFAULT false | 公開状態 |
| created_by | UUID | FK, NULL | 作成者ID |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 更新日時 |

#### インデックス

- PRIMARY KEY: `id`
- INDEX: `date DESC`
- COMPOSITE INDEX: `(published, date DESC)` - 公開お知らせ一覧用

#### ビジネスルール

- `published = true` のもののみ一般公開
- `date` は投稿日であり、`created_at` とは異なる場合がある

---

### 7. schedules（イベントスケジュール）

**目的**: イベント・公演スケジュールの管理

#### カラム定義

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | UUID | PK | スケジュールID |
| title | VARCHAR(255) | NOT NULL | イベント名 |
| content | TEXT | NOT NULL | イベント詳細 |
| event_date | TIMESTAMP WITH TIME ZONE | NOT NULL | イベント日時 |
| image_url | TEXT | NULL | イベント画像URL |
| link_url | TEXT | NULL | 詳細ページURL |
| sort_order | INTEGER | DEFAULT 0 | 表示順 |
| published | BOOLEAN | DEFAULT false | 公開状態 |
| author_id | UUID | FK, NULL | 作成者ID |
| author_name | VARCHAR(255) | NULL | 作成者名（非正規化） |
| author_email | VARCHAR(255) | NULL | 作成者メール（非正規化） |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 更新日時 |

#### インデックス

- PRIMARY KEY: `id`
- INDEX: `event_date`, `published`
- COMPOSITE INDEX: `(published, event_date)`, `(sort_order, event_date)`

#### ビジネスルール

- `event_date` が未来のイベントのみ表示するケースが多い
- `sort_order` で手動の並び順制御が可能
- 内部イベント（`published = false`）は管理者のみ閲覧可能

---

### 8. videos（動画コンテンツ）

**目的**: YouTube等の動画コンテンツ管理

#### カラム定義

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | UUID | PK | 動画ID |
| title | VARCHAR(255) | NOT NULL | 動画タイトル |
| video_date | DATE | NOT NULL | 投稿日 |
| video_url | TEXT | NOT NULL | YouTube URL |
| thumbnail_url | TEXT | NULL | サムネイル画像URL |
| published | BOOLEAN | DEFAULT false | 公開状態 |
| author_id | UUID | FK, NULL | 作成者ID |
| author_name | VARCHAR(255) | NULL | 作成者名（非正規化） |
| view_count | INTEGER | DEFAULT 0 | 閲覧数（将来的な拡張用） |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 更新日時 |

#### インデックス

- PRIMARY KEY: `id`
- INDEX: `video_date DESC`
- COMPOSITE INDEX: `(published, video_date DESC)`

#### ビジネスルール

- `video_url` はYouTube限定公開URLを想定
- `view_count` は将来的な統計機能用（現在は未使用）

---

### 9. blogs（ブログ記事）

**目的**: メンバーインタビューや舞台裏記事の管理

#### カラム定義

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | UUID | PK | 記事ID |
| title | VARCHAR(255) | NOT NULL | 記事タイトル |
| excerpt | TEXT | NOT NULL | 抜粋 |
| content | TEXT | NOT NULL | 本文（HTML） |
| thumbnail_url | TEXT | NULL | サムネイル画像URL |
| published | BOOLEAN | DEFAULT false | 公開状態 |
| author_id | UUID | FK, NULL | 作成者ID |
| author_name | VARCHAR(255) | NULL | 作成者名（非正規化） |
| author_role | VARCHAR(50) | NULL | 作成者役割 |
| slug | VARCHAR(255) | UNIQUE, NULL | URL用スラッグ |
| view_count | INTEGER | DEFAULT 0 | 閲覧数 |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 更新日時 |

#### インデックス

- PRIMARY KEY: `id`
- UNIQUE INDEX: `slug`
- COMPOSITE INDEX: `(published, created_at DESC)`
- FULLTEXT INDEX: `(title, excerpt, content)`

#### ビジネスルール

- `slug` はSEO対策のURL用（例: `/blog/interview-yamada-hanako`）
- `slug` が未設定の場合は `id` をフォールバック使用

---

### 10. newsletters（会報）

**目的**: 定期会報の管理

#### カラム定義

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | UUID | PK | 会報ID |
| issue_number | INTEGER | UNIQUE, NOT NULL | 号数 |
| title | VARCHAR(255) | NOT NULL | タイトル |
| excerpt | TEXT | NOT NULL | 概要 |
| content | TEXT | NOT NULL | 本文（HTML） |
| pdf_url | TEXT | NULL | PDF版URL |
| published | BOOLEAN | DEFAULT false | 公開状態 |
| published_at | TIMESTAMP WITH TIME ZONE | NULL | 公開日時 |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 更新日時 |

#### インデックス

- PRIMARY KEY: `id`
- UNIQUE INDEX: `issue_number`
- COMPOSITE INDEX: `(published, published_at DESC)`

#### ビジネスルール

- `issue_number` は連番（1, 2, 3...）
- PDF版がある場合は `pdf_url` に格納
- 会員限定コンテンツのため、アクセス制御はアプリケーション層で実施

---

## リレーションシップ

### エンティティ関連図（簡易版）

```
┌─────────────┐
│ member_plans│
│  (マスタ)   │
└──────┬──────┘
       │ 1
       │
       │ N
┌──────┴──────┐
│   members   │
│   (会員)    │
└──────┬──────┘
       │ 1
       ├─────────────────┐
       │                 │
       │ N               │ N
┌──────┴──────┐   ┌──────┴──────┐
│  contents   │   │informations │
│(会員コンテンツ)│   │ (お知らせ)  │
└──────┬──────┘   └─────────────┘
       │ N
       │
       │ N
┌──────┴──────┐
│content_tags │
│  (中間)     │
└──────┬──────┘
       │ N
       │
       │ 1
┌──────┴──────┐
│    tags     │
│  (マスタ)   │
└─────────────┘

その他のエンティティ:
- schedules (events)
- videos
- blogs
- newsletters
※これらは独立したコンテンツ管理テーブル
```

### リレーションシップ詳細

| 親テーブル | 子テーブル | カーディナリティ | 外部キー | 削除時動作 |
|-----------|-----------|----------------|---------|-----------|
| member_plans | members | 1:N | members.plan_id | RESTRICT |
| members | contents | 1:N | contents.author_id | SET NULL |
| member_plans | contents | 1:N | contents.required_plan_id | RESTRICT |
| members | informations | 1:N | informations.created_by | SET NULL |
| members | schedules | 1:N | schedules.author_id | SET NULL |
| members | videos | 1:N | videos.author_id | SET NULL |
| members | blogs | 1:N | blogs.author_id | SET NULL |
| contents | content_tags | 1:N | content_tags.content_id | CASCADE |
| tags | content_tags | 1:N | content_tags.tag_id | CASCADE |

---

## ER図

### 主要エンティティのER図

```
┌─────────────────────────────────┐
│ member_plans                    │
├─────────────────────────────────┤
│ PK id (SERIAL)                  │
│ UK plan_code                    │
│    plan_name                    │
│    display_name                 │
│    price                        │
│    hierarchy_level              │
│    is_business_plan             │
└─────────────────────────────────┘
              │ 1
              │
              │ N
┌─────────────▼───────────────────┐
│ members                         │
├─────────────────────────────────┤
│ PK id (UUID)                    │
│ UK uid                          │
│ UK email                        │
│    last_name, first_name        │
│    last_name_kana, first_name_kana│
│    postal_code, prefecture      │
│    city, address, building      │
│    phone_number                 │
│ FK plan_id → member_plans.id    │
│    role (admin/member)          │
│    is_active                    │
│    created_at, updated_at       │
└─────────────┬───────────────────┘
              │ 1
              │
              │ N
┌─────────────▼───────────────────┐       ┌─────────────────┐
│ contents                        │       │ member_plans    │
├─────────────────────────────────┤       ├─────────────────┤
│ PK id (UUID)                    │       │ PK id           │
│    title, description           │       └────────┬────────┘
│    content_type                 │                │ 1
│ FK required_plan_id ────────────┼────────────────┘
│ FK author_id → members.id       │                │ N
│    author_name (denorm)         │
│    content, thumbnail_url       │
│    published, published_at      │
│    created_at, updated_at       │
└─────────────┬───────────────────┘
              │ N
              │
              │ N
┌─────────────▼───────────────────┐
│ content_tags                    │
├─────────────────────────────────┤
│ PK (content_id, tag_id)         │
│ FK content_id → contents.id     │
│ FK tag_id → tags.id             │
└─────────────┬───────────────────┘
              │ N
              │
              │ 1
┌─────────────▼───────────────────┐
│ tags                            │
├─────────────────────────────────┤
│ PK id (SERIAL)                  │
│ UK tag_name                     │
│    created_at                   │
└─────────────────────────────────┘
```

---

## 正規化とデータ整合性

### 正規化の適用状況

#### 第1正規形（1NF）
✅ すべてのカラムがアトミック（分割不可能）な値を持つ
- Firestoreの配列フィールド（tags）は中間テーブル化
- 埋め込みオブジェクト（author）は個別カラムまたは外部キーに分割

#### 第2正規形（2NF）
✅ 部分関数従属性を排除
- 主キーの一部に依存するカラムは存在しない
- 複合主キーを持つテーブル（content_tags）は適切に設計

#### 第3正規形（3NF）
✅ 推移的関数従属性を排除
- member_plans を分離し、プラン情報の重複を排除
- tags をマスタテーブル化

#### 非正規化の戦略的適用

以下のカラムは**意図的に非正規化**している：

| テーブル | カラム | 理由 |
|---------|--------|------|
| contents | author_name | 作成者削除後も表示を維持 |
| schedules | author_name, author_email | 履歴保持 |
| videos | author_name | 頻繁なJOINの回避 |
| blogs | author_name, author_role | 読み取り性能向上 |

### データ整合性制約

#### NOT NULL制約
必須項目には NOT NULL を設定し、NULL値の混入を防止

#### UNIQUE制約
- members.uid, members.email
- member_plans.plan_code
- tags.tag_name
- blogs.slug
- newsletters.issue_number

#### CHECK制約
- members.role IN ('admin', 'member')
- contents.content_type IN ('article', 'video', 'document', 'newsletter')
- member_plans.hierarchy_level BETWEEN 1 AND 3

#### 外部キー制約
すべてのリレーションシップに外部キー制約を設定

---

## インデックス戦略

### 単一カラムインデックス

すべてのテーブルで以下のカラムにインデックスを作成：

- **PRIMARY KEY**: 自動作成
- **UNIQUE制約**: 自動作成
- **外部キー**: 明示的に作成（パフォーマンス向上）
- **WHERE句頻出カラム**: published, is_active等

### 複合インデックス

頻繁に実行されるクエリに基づき、以下の複合インデックスを作成：

| テーブル | インデックス | 用途 |
|---------|-------------|------|
| contents | (published, published_at DESC) | 公開コンテンツ一覧 |
| members | (is_active, plan_id) | アクティブ会員のプラン別集計 |
| informations | (published, date DESC) | 公開お知らせ一覧 |
| schedules | (published, event_date) | 公開イベント一覧 |
| schedules | (sort_order, event_date) | カスタムソート |
| videos | (published, video_date DESC) | 公開動画一覧 |
| blogs | (published, created_at DESC) | 公開記事一覧 |
| newsletters | (published, published_at DESC) | 公開会報一覧 |

### 全文検索インデックス

#### PostgreSQL（推奨）

```sql
-- GIN インデックスを使用した日本語対応全文検索
CREATE INDEX idx_contents_fulltext ON contents
USING GIN(to_tsvector('japanese',
  COALESCE(title, '') || ' ' ||
  COALESCE(description, '') || ' ' ||
  COALESCE(content, '')));

CREATE INDEX idx_blogs_fulltext ON blogs
USING GIN(to_tsvector('japanese',
  COALESCE(title, '') || ' ' ||
  COALESCE(excerpt, '') || ' ' ||
  COALESCE(content, '')));
```

#### MySQL

```sql
-- FULLTEXT インデックス（InnoDB, MyISAM）
ALTER TABLE contents ADD FULLTEXT INDEX idx_contents_search
  (title, description, content) WITH PARSER ngram;

ALTER TABLE blogs ADD FULLTEXT INDEX idx_blogs_search
  (title, excerpt, content) WITH PARSER ngram;
```

### インデックス運用指針

- **定期的な統計情報更新**: ANALYZE（PostgreSQL）/ ANALYZE TABLE（MySQL）
- **不要インデックスの削除**: 使用頻度をモニタリング
- **カーディナリティの考慮**: 選択性の高いカラムを優先

---

## セキュリティとアクセス制御

### 認証・認可の設計

#### 認証層
- **Firebase Authentication** を継続使用
- `members.uid` にFirebase UIDを格納
- セッション管理はFirebase SDKに委譲

#### 認可層（アプリケーション側で実装）

##### ロールベースアクセス制御（RBAC）

| ロール | 権限 |
|--------|------|
| admin | すべてのデータへのCRUD権限 |
| member | 自分のデータの読み書き、公開コンテンツの閲覧 |

##### プランベースアクセス制御

```sql
-- 会員がアクセス可能なコンテンツを取得するビュー
CREATE VIEW accessible_contents AS
SELECT
    m.id AS member_id,
    c.*
FROM members m
CROSS JOIN contents c
JOIN member_plans mp_user ON m.plan_id = mp_user.id
JOIN member_plans mp_content ON c.required_plan_id = mp_content.id
WHERE
    m.is_active = true
    AND c.published = true
    AND mp_user.hierarchy_level >= mp_content.hierarchy_level;
```

### Row Level Security（PostgreSQL推奨）

PostgreSQLでは、RLSを使用してデータベース層でアクセス制御を実装可能：

```sql
-- RLSの有効化
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- 自分自身のレコードのみ更新可能
CREATE POLICY members_update_own ON members
FOR UPDATE
USING (uid = current_setting('app.current_user_uid')::TEXT);

-- 管理者はすべてのレコードにアクセス可能
CREATE POLICY members_admin_all ON members
FOR ALL
TO admin_role
USING (true);
```

### データ暗号化

- **通信**: TLS/SSL必須
- **保存データ**:
  - パスワード: Firebase Authで管理（bcrypt）
  - 個人情報: データベース透過暗号化（TDE）の利用を推奨
  - 機密フィールド: アプリケーション層での暗号化も検討

### 監査ログ

重要操作（会員情報変更、権限変更等）のログテーブルを作成：

```
audit_logs テーブル:
- id (UUID)
- table_name (変更対象テーブル)
- record_id (変更対象レコードID)
- action (INSERT/UPDATE/DELETE)
- old_values (変更前の値、JSON)
- new_values (変更後の値、JSON)
- changed_by (操作者UID)
- changed_at (操作日時)
```

---

## Firestoreとの比較

### アーキテクチャの違い

| 項目 | Firestore（NoSQL） | RDBMS（SQL） |
|------|-------------------|--------------|
| **データモデル** | ドキュメント指向 | テーブル・行指向 |
| **スキーマ** | スキーマレス（柔軟） | 厳格なスキーマ（型安全） |
| **リレーション** | 参照 or 埋め込み | 外部キー制約 |
| **クエリ** | 複合インデックス必須 | JOINで柔軟に対応 |
| **トランザクション** | 限定的（同一ドキュメント群） | ACID完全対応 |
| **スケーリング** | 自動（水平スケーリング） | 手動（垂直/水平） |
| **集計処理** | 苦手（サーバー側で実施） | 得意（GROUP BY, SUM等） |
| **全文検索** | 外部サービス必須 | FULLTEXT INDEX利用可 |
| **学習コスト** | 低（シンプルなAPI） | 中（SQL学習必要） |

### 具体的な設計の変更点

#### 1. 配列フィールドの扱い

**Firestore**:
```javascript
{
  id: "content-001",
  title: "タイトル",
  tags: ["tag1", "tag2", "tag3"]  // 配列で保持
}
```

**RDBMS**:
```sql
-- tagsテーブル
id | tag_name
1  | tag1
2  | tag2

-- content_tagsテーブル（中間）
content_id         | tag_id
content-001        | 1
content-001        | 2
```

#### 2. 埋め込みオブジェクトの扱い

**Firestore**:
```javascript
{
  id: "schedule-001",
  title: "イベント",
  author: {
    id: "user-001",
    name: "山田太郎",
    email: "yamada@example.com"
  }
}
```

**RDBMS（外部キー + 非正規化）**:
```sql
-- schedulesテーブル
id          | title    | author_id | author_name | author_email
schedule-001| イベント | user-001  | 山田太郎    | yamada@...
```

#### 3. プラン階層のアクセス制御

**Firestore**:
```javascript
// アプリケーション側で階層定義
const planHierarchy = {
  individual: ['individual'],
  business: ['individual', 'business'],
  platinum: ['individual', 'business', 'platinum']
};
```

**RDBMS**:
```sql
-- member_plansテーブルに hierarchy_level カラムを追加
-- SQLで階層比較
WHERE user_plan.hierarchy_level >= content_plan.hierarchy_level
```

### 移行時のメリット・デメリット

#### メリット

✅ **データ整合性の向上**
- 外部キー制約による参照整合性の保証
- CHECK制約による不正データの排除

✅ **複雑なクエリへの対応**
- JOINによる柔軟なデータ取得
- 集計・分析クエリの実行が容易

✅ **トランザクション処理**
- ACID特性の完全サポート
- 複数テーブルにまたがる更新の安全性

✅ **コスト予測性**
- 固定的なインフラコスト
- 読み書き回数による従量課金がない

✅ **運用ツールの充実**
- pgAdmin, MySQL Workbench等のGUIツール
- バックアップ・リストアの標準化

#### デメリット

❌ **スケーラビリティの管理**
- 水平スケーリングには設計・運用の工夫が必要
- Firestoreのような自動スケーリングは不可

❌ **インフラ管理の負担**
- サーバーの監視・メンテナンスが必要
- パッチ適用・バージョンアップの計画

❌ **リアルタイム性**
- Firestoreのリアルタイムリスナーに相当する機能は別途実装が必要
- WebSocket等の追加実装が必要

❌ **学習コスト**
- SQLの習得が必要
- パフォーマンスチューニングのノウハウ

---

## マイグレーション考慮事項

### データ移行戦略

#### フェーズ1: 準備

1. **スキーマ設計の確定**
   - 本設計書のレビューと承認
   - テーブル定義の最終化

2. **テスト環境の構築**
   - RDBMSのセットアップ
   - マイグレーションスクリプトの開発環境

3. **データマッピング定義**
   - Firestore ↔ RDBMS のフィールド対応表作成
   - データ型変換ルールの策定

#### フェーズ2: 移行スクリプト開発

1. **データ抽出**
   - Firestore Admin SDKでデータ取得
   - JSON形式でエクスポート

2. **データ変換**
   - Timestamp → TIMESTAMP WITH TIME ZONE
   - 配列 → 中間テーブルレコード
   - 埋め込みオブジェクト → 外部キー + 非正規化カラム

3. **データロード**
   - SQLのINSERT文生成
   - トランザクション単位でのバッチ投入

#### フェーズ3: 検証

1. **データ整合性チェック**
   - レコード数の一致確認
   - サンプルデータの比較検証
   - 外部キー制約のチェック

2. **パフォーマンステスト**
   - 想定クエリの実行速度測定
   - インデックスの効果検証

3. **アプリケーション結合テスト**
   - API層の動作確認
   - エンドツーエンドテスト

#### フェーズ4: 本番移行

1. **メンテナンスウィンドウの設定**
   - ユーザーへの事前通知
   - サービス停止時間の最小化

2. **段階的移行（推奨）**
   - 読み取り専用APIから順次切り替え
   - 並行運用期間の設定

3. **ロールバック計画**
   - Firestoreデータの保持
   - 切り戻し手順の文書化

### データ型変換表

| Firestore型 | PostgreSQL型 | MySQL型 | 備考 |
|------------|-------------|---------|------|
| string | VARCHAR / TEXT | VARCHAR / TEXT | 長さに応じて選択 |
| number | INTEGER / BIGINT | INT / BIGINT | 整数値 |
| number | DECIMAL | DECIMAL | 浮動小数点 |
| boolean | BOOLEAN | TINYINT(1) | - |
| timestamp | TIMESTAMP WITH TIME ZONE | TIMESTAMP | タイムゾーン考慮 |
| array | 中間テーブル | 中間テーブル | 正規化 |
| map (object) | JSONB | JSON | または個別カラム化 |
| reference | UUID (FK) | CHAR(36) | 外部キー |

### セキュリティルールの移行

Firestoreのセキュリティルールは、以下の方法で実装：

1. **アプリケーション層**
   - ミドルウェアでの認可チェック
   - 最も一般的なアプローチ

2. **データベース層（PostgreSQL）**
   - Row Level Security (RLS)
   - より強固なセキュリティ

3. **ハイブリッド**
   - 両方を組み合わせた多層防御

### パフォーマンス最適化

#### 初期設定

- **コネクションプール**: 適切なサイズ設定（例: 10-20）
- **クエリキャッシュ**: 有効化（MySQL）
- **バッファプール**: メモリの50-70%割り当て

#### 運用フェーズ

- **スロークエリログ**: 性能問題の早期発見
- **EXPLAIN ANALYZE**: クエリ実行計画の分析
- **定期的なVACUUM**: PostgreSQLのメンテナンス

---

## まとめ

本設計書は、Firestore（NoSQL）からRDBMS（SQL）への移行を想定した、完全なデータベース設計を提供します。

### 設計の特徴

- **第3正規形を基本** としつつ、パフォーマンスのため戦略的に非正規化
- **外部キー制約** による強固なデータ整合性
- **複合インデックス** による高速なクエリ実行
- **ビューとRLS** によるセキュアなアクセス制御
- **拡張性** を考慮した柔軟な設計

### 推奨DBMS

- **PostgreSQL 14以降**: 高機能、JSONB対応、RLS、GIN Index
- **MySQL 8.0以降**: 普及率が高い、全文検索（ngram）対応

### 次のステップ

1. 設計レビューと承認
2. テスト環境での実装
3. マイグレーションスクリプトの開発
4. 段階的な本番移行

---

**更新履歴**
- 2025-10-06: 初版作成
