# ヒーローカルーセル管理機能 仕様書

## 概要

トップページ（`/`）のヒーロー領域に表示されている2つのコンポーネント（前面カルーセルと背景スライドショー）の画像を、admin 管理画面から CRUD 可能にする。
現状はソースコードに画像ファイルとリンク先がハードコードされており、変更にデプロイが必要。本機能により管理者が画面上で更新できるようにする。

## 対象範囲

管理対象は以下2つのコンポーネント。それぞれ独立した管理画面・テーブルとして扱う。

| 対象 | コンポーネント | 現状 |
|------|---------------|------|
| 前面カルーセル | `components/hero/hero-carousel.tsx` | 5枚の画像をハードコード（`hero1.jpg` 〜 `hero5.jpg`）、各画像に `href` を保持 |
| 背景スライドショー | `components/hero/hero-bg-slideshow.tsx` | 44枚の画像を `public/hero-bg/` から参照、リンクなし |

## 機能要件

### 共通要件

- 操作権限: `admin` のみ（`verifyAdmin()` を使用）
- 画像枚数: データに登録された件数だけ表示する（固定枚数なし）
- 画像ストレージ: Cloudflare R2（既存の `lib/storage.ts` を流用）
- 表示反映: 登録/更新/削除と同時にトップページへ反映する（`revalidatePath("/", "layout")`）
- 公開フラグ: `isPublished` を持ち、`false` のものはトップページに表示しない
- 表示順: `sortOrder`（数値）で制御。管理画面で並び替え可能

### 前面カルーセル（hero_carousels）

管理項目:

| 項目 | 型 | 必須 | 説明 |
|------|-----|------|------|
| imageUrl | string | 必須 | R2 にアップロードされた画像URL |
| linkUrl | string | 任意 | クリック時の遷移先URL（外部URL直接指定） |
| sortOrder | number | 必須 | 表示順 |
| isPublished | boolean | 必須 | 公開フラグ（デフォルト true） |

- alt テキストは管理しない（固定文字列で代替する）
- 内部リンク選択機能は持たない（URL を文字列として直接入力）
- linkUrl が空の場合はクリック不可の表示にする

### 背景スライドショー（hero_backgrounds）

管理項目:

| 項目 | 型 | 必須 | 説明 |
|------|-----|------|------|
| imageUrl | string | 必須 | R2 にアップロードされた画像URL |
| sortOrder | number | 必須 | 表示順（フェード切替の順序） |
| isPublished | boolean | 必須 | 公開フラグ（デフォルト true） |

- リンク機能なし
- 5秒間隔で順次フェード切替する既存仕様は維持

## 画面設計

### 管理画面ルーティング

新規追加する admin 配下のルート:

```
app/[locale]/admin/hero-carousels/
├── page.tsx            一覧
├── new/
│   └── page.tsx        新規作成
└── [id]/
    └── page.tsx        編集

app/[locale]/admin/hero-backgrounds/
├── page.tsx            一覧
├── new/
│   └── page.tsx        新規作成
└── [id]/
    └── page.tsx        編集
```

既存の `admin/sponsors`, `admin/blogs` の構成に合わせる。

### 一覧画面

- カラム: サムネイル / 表示順 / 公開状態 / リンクURL（カルーセルのみ） / 操作（編集/削除）
- 表示順での並び替え機能
- 「新規追加」ボタン

### 新規作成・編集画面

フォーム項目:

- 前面カルーセル: 画像アップロード、linkUrl（テキスト入力）、sortOrder、isPublished
- 背景スライドショー: 画像アップロード、sortOrder、isPublished

画像アップロードは既存の `components/input-image-simple.tsx` を流用する。

## データ設計

### DB スキーマ

`db/schemas/hero-carousels.ts` を新規作成:

```typescript
import { pgTable, text, integer, boolean, timestamp } from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"

export const heroCarousels = pgTable("hero_carousels", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  imageUrl: text("image_url").notNull(),
  linkUrl: text("link_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})
```

`db/schemas/hero-backgrounds.ts` を新規作成:

```typescript
import { pgTable, text, integer, boolean, timestamp } from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"

export const heroBackgrounds = pgTable("hero_backgrounds", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  imageUrl: text("image_url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})
```

### マイグレーション

```bash
PATH="/opt/homebrew/bin:$PATH" /opt/homebrew/bin/pnpm drizzle-kit generate
PATH="/opt/homebrew/bin:$PATH" /opt/homebrew/bin/pnpm drizzle-kit migrate
```

### 既存データの移行

初回マイグレーション後に、ハードコードされている画像をR2へアップロードしてレコードを作成する初期データ投入を行う。
（実施手段はマイグレーション SQL もしくは管理画面からの手動登録のいずれかを選択。本仕様では管理画面からの手動登録を前提とする）

## ファイル構成

### Server Actions（admin 用）

```
actions/admin/hero-carousels/
├── create.ts        新規作成
├── update.ts        更新
└── delete.ts        削除

actions/admin/hero-backgrounds/
├── create.ts        新規作成
├── update.ts        更新
└── delete.ts        削除
```

各 Server Action 冒頭で `verifyAdmin()` を呼び、最後に `revalidatePath("/", "layout")` でトップ反映する。

### データ取得

```
data/hero-carousel.ts        公開中 + 並び順で取得
data/hero-background.ts      公開中 + 並び順で取得
```

例:

```typescript
export async function getPublishedHeroCarousels() {
  return db
    .select()
    .from(heroCarousels)
    .where(eq(heroCarousels.isPublished, true))
    .orderBy(asc(heroCarousels.sortOrder))
}
```

### バリデーション

```
app/[locale]/admin/hero-carousels/schemas.ts
app/[locale]/admin/hero-backgrounds/schemas.ts
```

Zod でフォーム入力をバリデーション。

### 既存コンポーネントの修正

- `components/hero/hero-carousel.tsx`: `images` 配列のハードコードを削除し、props もしくは Server Component 経由で DB から取得した配列を受け取る形に変更
- `components/hero/hero-bg-slideshow.tsx`: 同上。`imageNumbers`, `imageExtensions`, `images` を削除し、props で受け取る
- `app/[locale]/(main)/page.tsx`: Server 側で `getPublishedHeroCarousels()` と `getPublishedHeroBackgrounds()` を呼び、子コンポーネントに渡す

## 画像アップロード方式

既存の `actions/blog-image.ts` の Presigned PUT URL 方式を参考に、ヒーロー画像用のキー（`hero/carousels/{nanoid}`, `hero/backgrounds/{nanoid}`）でアップロードする。
クライアントは R2 へ直接 PUT し、戻ってきた publicUrl を Server Action に渡してDBへ保存する。

## 表示順の扱い

- 一覧画面では `sortOrder ASC` で並べる
- 編集画面で sortOrder を数値入力で変更可能
- 重複した値の挙動は ID 昇順をフォールバックとする
- 並び替え用UI（ドラッグ&ドロップ）は本フェーズでは持たず、数値入力のみで対応する

## 非機能要件

- 画像最大サイズ: 既存の `InputImageSimple` のデフォルト 10MB に従う
- 対応画像形式: jpeg, png, webp, gif（既存 `InputImageSimple` に従う）
- レスポンシブ表示は既存コンポーネントの実装をそのまま維持する

## 影響範囲

- 削除予定ファイル（移行完了後）:
  - `components/hero/hero1.jpg` 〜 `hero5.jpg`
  - `public/hero-bg/` 配下の44枚
- 修正対象:
  - `components/hero/hero-carousel.tsx`
  - `components/hero/hero-bg-slideshow.tsx`
  - `app/[locale]/(main)/page.tsx`
- 追加対象:
  - DB スキーマ 2件
  - admin 配下のページ（カルーセル/背景スライドショー）
  - Server Actions、データ取得、Zodスキーマ

## 実装順序

1. DBスキーマ作成 + マイグレーション
2. データ取得関数（`data/hero-carousel.ts`, `data/hero-background.ts`）
3. Server Actions（CRUD）
4. admin 画面（一覧 / 新規 / 編集）
5. 既存コンポーネントを DB ベースに修正
6. R2 へ既存画像を移行（管理画面から手動登録）
7. 旧画像ファイルを削除

## 未確定事項

なし
