# IK ALUMNI CGT サポーターズクラブ会員サイト

## コーディング規約

**作成日**: 2025-12-10
**バージョン**: 1.0

---

## 目次

1. [コーディング規約の目的](#1-コーディング規約の目的)
2. [全般的な規則](#2-全般的な規則)
3. [TypeScript/JavaScript規約](#3-typescriptjavascript規約)
4. [React/Next.js規約](#4-reactnextjs規約)
5. [ディレクトリ・ファイル構成規約](#5-ディレクトリファイル構成規約)
6. [コンポーネント設計規約](#6-コンポーネント設計規約)
7. [データ層規約](#7-データ層規約)
8. [スタイリング規約](#8-スタイリング規約)
9. [命名規則](#9-命名規則)
10. [コメント・ドキュメント規約](#10-コメントドキュメント規約)
11. [セキュリティ規約](#11-セキュリティ規約)
12. [テスト規約](#12-テスト規約)

---

## 1. コーディング規約の目的

### 1.1 本書の目的

- コードの品質と一貫性を保つための基準を定義する
- 開発チーム内での共通認識を形成する
- 保守性・可読性の高いコードベースを維持する

### 1.2 適用範囲

本規約は、本プロジェクトの全てのソースコードに適用する。

---

## 2. 全般的な規則

### 2.1 言語設定

| 項目 | 設定 |
|------|------|
| **ソースコード** | TypeScript（strictモード有効） |
| **コメント** | 日本語 |
| **コミットメッセージ** | 日本語 |
| **変数・関数名** | 英語（キャメルケース） |

### 2.2 フォーマット

| 項目 | 設定 |
|------|------|
| **インデント** | スペース2つ |
| **行末セミコロン** | なし |
| **文字列** | ダブルクォート（"） |
| **最大行長** | 100文字（推奨） |
| **末尾カンマ** | あり（ES5互換） |

### 2.3 ツール設定

| ツール | 用途 |
|--------|------|
| **ESLint** | コード品質チェック（next/core-web-vitals, next/typescript準拠） |
| **TypeScript** | 型チェック（strictモード） |
| **Prettier** | 未使用（ESLintで統一） |

---

## 3. TypeScript/JavaScript規約

### 3.1 型定義

#### 必須事項

```typescript
// ✅ Good: 明示的な型定義
const userName: string = "Taro"
const userAge: number = 25

// ✅ Good: 関数の引数と戻り値に型を定義
function calculateTotal(price: number, quantity: number): number {
  return price * quantity
}

// ❌ Bad: any型の使用
const data: any = fetchData()
```

#### 型定義ファイルの配置

```
types/
├── member.ts        # 会員関連の型
├── blog.ts          # ブログ関連の型
├── video.ts         # 動画関連の型
└── ...
```

#### 型のインポート

```typescript
// ✅ Good: type修飾子を使用
import type { Member, MemberWithPlan } from "@/types/member"

// ❌ Bad: type修飾子なしでのimport
import { Member } from "@/types/member"
```

### 3.2 変数宣言

```typescript
// ✅ Good: constを優先使用
const items = ["a", "b", "c"]

// ✅ Good: 再代入が必要な場合のみlet
let count = 0
count++

// ❌ Bad: varは使用しない
var oldStyle = "deprecated"
```

### 3.3 非同期処理

```typescript
// ✅ Good: async/awaitを使用
async function fetchUser(id: string): Promise<User> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  })
  return user
}

// ❌ Bad: ネストしたPromise chain
function fetchUser(id: string) {
  return db.query.users.findFirst({ where: eq(users.id, id) })
    .then(user => {
      return processUser(user).then(result => {
        return result
      })
    })
}
```

### 3.4 エラーハンドリング

```typescript
// ✅ Good: try-catchで適切にハンドリング
async function createBlog(data: BlogFormData) {
  try {
    const result = await db.insert(blogs).values(data).returning()
    return result
  } catch (error) {
    console.error("ブログ作成エラー:", error)
    throw new Error("ブログの作成に失敗しました")
  }
}

// ❌ Bad: エラーを握りつぶす
async function createBlog(data: BlogFormData) {
  try {
    return await db.insert(blogs).values(data).returning()
  } catch (error) {
    return null // エラーが分からない
  }
}
```

---

## 4. React/Next.js規約

### 4.1 コンポーネントの種類と使い分け

| 種類 | 用途 | ディレクティブ |
|------|------|--------------|
| **Server Component** | データフェッチ、SEO、静的コンテンツ | なし（デフォルト） |
| **Client Component** | インタラクション、フォーム、状態管理 | `"use client"` |

```typescript
// ✅ Good: Server Component（デフォルト）
// app/[locale]/(main)/blog/page.tsx
export default async function BlogPage() {
  const items = await getPublishedBlogs()
  return <BlogList items={items} />
}

// ✅ Good: Client Component
// components/blog-form.tsx
"use client"

import { useForm } from "react-hook-form"

export function BlogForm() {
  const form = useForm()
  // ...
}
```

### 4.2 Server Actions

#### 基本ルール

- `"use server"` ディレクティブを使用
- **GET処理にはServer Actionsを使用しない**（`data/` ディレクトリの関数を使用）
- 権限チェックを必ず実行

```typescript
// ✅ Good: Server Action（POST/PUT/DELETE処理）
// actions/blog.ts
"use server"

import { verifyAdmin } from "@/lib/session"
import { revalidatePath } from "next/cache"

export async function createBlog(formData: BlogFormData) {
  // 1. 権限チェック
  await verifyAdmin()

  // 2. バリデーション
  const data = blogFormSchema.parse(formData)

  // 3. データベース操作
  const [newBlog] = await db.insert(blogs).values(data).returning()

  // 4. キャッシュ再検証
  revalidatePath("/admin/blogs")
  revalidatePath("/blogs")

  return newBlog
}
```

### 4.3 データ取得（GET処理）

```typescript
// ✅ Good: data/ ディレクトリに配置
// data/blog.ts
import "server-only"
import { db } from "@/db"

export const getPublishedBlogs = async () => {
  return db.query.blogs.findMany({
    where: eq(blogs.published, true),
    orderBy: [desc(blogs.createdAt)],
  })
}

// ❌ Bad: Server ActionでGET処理
// actions/blog.ts
"use server"
export async function getBlogs() {
  return db.query.blogs.findMany()
}
```

### 4.4 ページコンポーネント

```typescript
// ✅ Good: 標準的なページ構成
// app/[locale]/(main)/blog/page.tsx
import { setLocale } from "@/app/web/i18n/set-locale"
import { BlogList } from "@/components/blog/list"
import { getPublishedBlogs } from "@/data/blog"
import { getTranslations } from "next-intl/server"

export const dynamic = 'force-dynamic'

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  await setLocale(params)
  const t = await getTranslations("Contents")
  const items = await getPublishedBlogs()

  return (
    <div className="container mx-auto px-4 pt-10 pb-32">
      <h1 className="main-text mb-10">{t("blog")}</h1>
      <BlogList items={items} />
    </div>
  )
}
```

### 4.5 フォーム処理

```typescript
// ✅ Good: React Hook Form + Zod
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { blogFormSchema, type BlogFormData } from "@/zod/blog"

export function BlogForm({ mode }: { mode: "create" | "edit" }) {
  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      content: "",
      published: false,
    },
  })

  const onSubmit = async (data: BlogFormData) => {
    try {
      if (mode === "create") {
        await createBlog(data)
        toast.success("ブログを作成しました")
      }
    } catch (error) {
      toast.error("エラーが発生しました")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* フォームフィールド */}
      </form>
    </Form>
  )
}
```

---

## 5. ディレクトリ・ファイル構成規約

### 5.1 ディレクトリ構成

```
ik-alumni-club/
├── app/                          # Next.js App Router
│   ├── [locale]/                 # ロケール対応
│   │   ├── (main)/               # 公開ページ（Route Group）
│   │   ├── (auth)/               # 認証ページ（Route Group）
│   │   └── admin/                # 管理者ページ
│   ├── api/                      # API Routes
│   └── web/i18n/                 # 多言語設定
├── actions/                      # Server Actions（POST/PUT/DELETE）
├── data/                         # データ取得関数（GET）
├── components/                   # Reactコンポーネント
│   ├── ui/                       # shadcn/uiコンポーネント
│   └── [機能別]/                  # 機能別コンポーネント
├── db/                           # データベース関連
│   ├── index.ts                  # Drizzle ORM初期化
│   ├── schemas/                  # スキーマ定義
│   └── migrations/               # マイグレーション
├── lib/                          # ユーティリティ
├── zod/                          # Zodバリデーションスキーマ
├── types/                        # TypeScript型定義
├── messages/                     # 多言語メッセージ
└── middleware.ts                 # Next.jsミドルウェア
```

### 5.2 ファイル配置ルール

| カテゴリ | 配置場所 | 例 |
|---------|---------|-----|
| **ページ** | `app/[locale]/...` | `app/[locale]/(main)/blog/page.tsx` |
| **Server Actions** | `actions/` | `actions/blog.ts` |
| **データ取得** | `data/` | `data/blog.ts` |
| **UIコンポーネント** | `components/ui/` | `components/ui/button.tsx` |
| **機能コンポーネント** | `components/[機能名]/` | `components/blog/list.tsx` |
| **DBスキーマ** | `db/schemas/` | `db/schemas/blogs.ts` |
| **バリデーション** | `zod/` | `zod/blog.ts` |
| **型定義** | `types/` | `types/blog.ts` |

---

## 6. コンポーネント設計規約

### 6.1 コンポーネントの命名

| 種類 | 命名規則 | 例 |
|------|---------|-----|
| **コンポーネント** | PascalCase | `BlogForm`, `VideoList` |
| **ファイル名** | kebab-case | `blog-form.tsx`, `video-list.tsx` |
| **フック** | use + PascalCase | `useAuth`, `useForm` |

### 6.2 コンポーネントの構造

```typescript
// ✅ Good: 標準的なコンポーネント構造
"use client"

// 1. インポート（外部→内部の順）
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import type { BlogFormData } from "@/types/blog"

// 2. 型定義（Propsなど）
interface BlogFormProps {
  defaultValues?: BlogFormData
  mode: "create" | "edit"
}

// 3. コンポーネント本体（export function推奨）
export function BlogForm({ defaultValues, mode }: BlogFormProps) {
  // 3.1 Hooks
  const form = useForm()

  // 3.2 イベントハンドラ
  const onSubmit = async (data: BlogFormData) => {
    // ...
  }

  // 3.3 JSX
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* ... */}
    </form>
  )
}
```

### 6.3 Props設計

```typescript
// ✅ Good: インターフェースで明示的に定義
interface CardProps {
  title: string
  description?: string
  children: React.ReactNode
}

// ❌ Bad: インライン型定義
function Card({ title, description }: { title: string; description?: string }) {
  // ...
}
```

---

## 7. データ層規約

### 7.1 Drizzle ORMスキーマ

```typescript
// ✅ Good: db/schemas/blogs.ts
import { pgTable, text, boolean, integer, timestamp } from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"
import { relations } from "drizzle-orm"

export const blogs = pgTable("blogs", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  title: text("title").notNull(),
  content: text("content").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  published: boolean("published").notNull().default(false),
  isMemberOnly: boolean("is_member_only").notNull().default(false),
  authorId: text("author_id").references(() => users.id, { onDelete: "set null" }),
  viewCount: integer("view_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

export const blogRelations = relations(blogs, ({ one }) => ({
  author: one(users, {
    fields: [blogs.authorId],
    references: [users.id],
  }),
}))
```

### 7.2 Zodスキーマ

```typescript
// ✅ Good: zod/blog.ts
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"
import { blogs } from "@/db/schemas/blogs"

export const blogFormSchema = createInsertSchema(blogs, {
  title: z
    .string()
    .trim()
    .min(1, "タイトルを入力してください")
    .max(255, "タイトルは255文字以内で入力してください"),
  content: z
    .string()
    .trim()
    .min(1, "本文を入力してください"),
}).omit({
  id: true,
  authorId: true,
  createdAt: true,
  updatedAt: true,
})

export type BlogFormData = z.infer<typeof blogFormSchema>
```

### 7.3 型定義

```typescript
// ✅ Good: types/blog.ts
import { blogs } from "@/db/schemas/blogs"

// Drizzleから推論
export type Blog = typeof blogs.$inferSelect
export type NewBlog = typeof blogs.$inferInsert

// 拡張型
export type BlogWithAuthor = Blog & {
  author: User | null
}
```

---

## 8. スタイリング規約

### 8.1 Tailwind CSS

```tsx
// ✅ Good: Tailwind CSSのユーティリティクラス
<div className="container mx-auto px-4 pt-10 pb-32">
  <h1 className="text-2xl font-bold mb-4">タイトル</h1>
  <p className="text-gray-600 dark:text-gray-400">本文</p>
</div>

// ❌ Bad: インラインスタイル
<div style={{ maxWidth: '1200px', margin: '0 auto' }}>
  <h1 style={{ fontSize: '24px' }}>タイトル</h1>
</div>
```

### 8.2 レスポンシブデザイン

```tsx
// ✅ Good: モバイルファースト
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* カード */}
</div>

// ブレークポイント
// sm: 640px
// md: 768px
// lg: 1024px
// xl: 1280px
// 2xl: 1536px
```

### 8.3 ダークモード対応

```tsx
// ✅ Good: dark: プレフィックスを使用
<div className="bg-white dark:bg-gray-900">
  <p className="text-gray-900 dark:text-gray-100">テキスト</p>
</div>
```

---

## 9. 命名規則

### 9.1 一般的な命名規則

| 対象 | 規則 | 例 |
|------|------|-----|
| **変数・関数** | camelCase | `userName`, `getBlogs` |
| **定数** | SCREAMING_SNAKE_CASE | `MAX_FILE_SIZE`, `API_URL` |
| **コンポーネント** | PascalCase | `BlogForm`, `UserCard` |
| **型・インターフェース** | PascalCase | `Member`, `BlogFormData` |
| **ファイル（コンポーネント）** | kebab-case | `blog-form.tsx` |
| **ファイル（スキーマ）** | kebab-case | `member-plans.ts` |
| **ディレクトリ** | kebab-case | `admin-dashboard/` |
| **DBカラム** | snake_case | `created_at`, `is_member_only` |

### 9.2 関数の命名パターン

| パターン | 用途 | 例 |
|---------|------|-----|
| `get*` | データ取得 | `getBlogs`, `getMember` |
| `create*` | 新規作成 | `createBlog`, `createMember` |
| `update*` | 更新 | `updateBlog`, `updateProfile` |
| `delete*` | 削除 | `deleteBlog`, `deleteAccount` |
| `toggle*` | 状態切替 | `togglePublish`, `toggleMemberOnly` |
| `verify*` | 検証・認証 | `verifySession`, `verifyAdmin` |
| `can*` | 権限チェック | `canAccessContent`, `canEdit` |
| `handle*` | イベントハンドラ | `handleSubmit`, `handleClick` |
| `on*` | コールバック（Props） | `onChange`, `onSubmit` |

### 9.3 Boolean変数の命名

```typescript
// ✅ Good: is/has/can/shouldプレフィックス
const isLoading = true
const hasPermission = false
const canEdit = true
const shouldRefresh = false

// ❌ Bad: 曖昧な命名
const loading = true
const permission = false
```

---

## 10. コメント・ドキュメント規約

### 10.1 JSDocコメント

```typescript
// ✅ Good: 関数にはJSDocを付与（複雑な処理の場合）
/**
 * ブログ記事を新規作成
 * @param formData - フォームから送信されたデータ
 * @returns 作成されたブログ記事
 * @throws {Error} 管理者権限がない場合
 */
export async function createBlog(formData: BlogFormData) {
  // ...
}

// ✅ Good: 処理ステップを明示
export async function createBlog(formData: BlogFormData) {
  // 1. 管理者権限チェック
  const { userId } = await verifyAdmin()

  // 2. バリデーション
  const data = blogFormSchema.parse(formData)

  // 3. データベースに挿入
  const [newBlog] = await db.insert(blogs).values(data).returning()

  // 4. キャッシュ再検証
  revalidatePath("/admin/blogs")

  return newBlog
}
```

### 10.2 TODO/FIXMEコメント

```typescript
// TODO: 将来的にリッチエディタ対応予定
// FIXME: パフォーマンス改善が必要
// NOTE: このロジックは〇〇の理由で必要
```

---

## 11. セキュリティ規約

### 11.1 認証・認可

```typescript
// ✅ Good: Server Actionsでは必ず権限チェック
export async function createBlog(formData: BlogFormData) {
  // 管理者権限チェック（必須）
  await verifyAdmin()

  // 処理続行
}

// ✅ Good: 会員限定コンテンツのアクセス制御
export async function getBlogDetail(id: string) {
  const blog = await getBlog(id)

  if (blog.isMemberOnly) {
    const canAccess = await canAccessMemberContent()
    if (!canAccess) {
      redirect("/login")
    }
  }

  return blog
}
```

### 11.2 入力値の検証

```typescript
// ✅ Good: Zodでバリデーション
export async function createBlog(formData: BlogFormData) {
  const data = blogFormSchema.parse(formData) // バリデーション
  // ...
}

// ❌ Bad: バリデーションなしで直接使用
export async function createBlog(formData: BlogFormData) {
  await db.insert(blogs).values(formData) // 危険
}
```

### 11.3 機密情報の取り扱い

```typescript
// ✅ Good: 環境変数で管理
const stripeSecretKey = process.env.STRIPE_SECRET_KEY

// ❌ Bad: ハードコーディング
const stripeSecretKey = "sk_test_xxxx"
```

---

## 12. テスト規約

### 12.1 テストファイル配置

| 種類 | 配置場所 | 命名 |
|------|---------|------|
| **ユニットテスト** | `__tests__/` または 同階層 | `*.test.ts` |
| **Storybook** | 同階層 | `*.stories.tsx` |
| **E2Eテスト** | `e2e/` | `*.spec.ts` |

### 12.2 テストの記述

```typescript
// ✅ Good: 日本語でテストケースを記述
describe("BlogForm", () => {
  it("タイトルが空の場合、エラーメッセージが表示される", () => {
    // ...
  })

  it("正常に送信できる", async () => {
    // ...
  })
})
```

### 12.3 Storybook

```typescript
// ✅ Good: コンポーネントのStory
// components/blog-card.stories.tsx
import type { Meta, StoryObj } from "@storybook/react"
import { BlogCard } from "./blog-card"

const meta = {
  title: "Components/BlogCard",
  component: BlogCard,
} satisfies Meta<typeof BlogCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: "サンプルブログ",
    excerpt: "これはサンプルの抜粋です",
  },
}
```

---

## 更新履歴

| 日付 | バージョン | 内容 | 作成者 |
|------|-----------|------|--------|
| 2025-12-10 | 1.0 | 初版作成 | - |

---

## 関連ドキュメント

- [要件定義書](./01_requirements-definition.md)
- [基本設計書](./02_basic-design.md)
- [詳細設計書](./03_detailed-design.md)
