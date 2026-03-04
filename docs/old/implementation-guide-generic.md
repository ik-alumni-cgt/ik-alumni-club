# CRUD機能 実装ガイド（汎用テンプレート）

**作成日**: 2025-10-26
**対象**: あらゆるCRUD機能の実装
**参考**: informations、blogs、newsletters、petテーブルの実装パターン

---

## 📋 目次

1. [概要](#概要)
2. [実装フェーズ一覧](#実装フェーズ一覧)
3. [各フェーズの詳細と注意点](#各フェーズの詳細と注意点)
4. [発生しやすい問題と解決策](#発生しやすい問題と解決策)
5. [ベストプラクティス](#ベストプラクティス)
6. [チェックリスト](#チェックリスト)

---

## 概要

### 実装の目的

このガイドは、データベーステーブルに対する作成・読み取り・更新・削除（CRUD）機能を実装するための汎用的なテンプレートです。

### 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **ORM**: Drizzle ORM
- **データベース**: PostgreSQL
- **バリデーション**: Zod
- **UI**: shadcn/ui + Tailwind CSS
- **認証**: Better Auth

### アーキテクチャパターン

```
View Layer (Pages)
    ↓
Component Layer (UI Components)
    ↓
Action Layer (Server Actions) ← POST/PUT/DELETE
    ↓
Data Layer (Data Access) ← GET
    ↓
Validation Layer (Zod)
    ↓
Database Layer (Drizzle Schema)
    ↓
PostgreSQL
```

---

## 実装フェーズ一覧

| フェーズ | 内容 | ファイル |
|---------|------|---------|
| **1. データベース層** | スキーマ定義・マイグレーション | `db/schemas/{resource}s.ts` |
| **2. バリデーション層** | Zodスキーマ定義 | `zod/{resource}.ts` |
| **3. 型定義層** | TypeScript型定義 | `types/{resource}.ts` |
| **4. データアクセス層** | GET操作 | `data/{resource}.ts` |
| **5. サーバーアクション層** | POST/PUT/DELETE操作 | `actions/{resource}.ts` |
| **6. コンポーネント層** | UI コンポーネント | `components/{resource}-*.tsx` |
| **7. ページ層** | ページコンポーネント | `app/[locale]/admin/{resource}s/**` |
| **8. 統合** | レイアウト・メニュー・表示 | `layout.tsx`, `admin-sidebar.tsx` |

> **注**: `{resource}` は実装する機能のリソース名（例: `information`, `blog`, `newsletter`）に置き換えてください。

---

## 各フェーズの詳細と注意点

### フェーズ1: データベース層の設計

#### 実装内容

**ファイル**: `db/schemas/{resource}s.ts`

```typescript
import { pgTable, text, timestamp, boolean, integer, date } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { users } from "./auth";

export const {resource}s = pgTable("{resource}s", {
  // 主キー（必須）
  id: text("id").primaryKey().$defaultFn(() => nanoid()),

  // ビジネスフィールド（機能によって異なる）
  title: text("title").notNull(),
  content: text("content").notNull(),
  // ... 他のフィールド

  // 公開状態フラグ（任意）
  published: boolean("published").notNull().default(false),

  // メタデータフィールド（推奨）
  createdBy: text("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
```

#### ⚠️ 注意点

##### 1. 主キーの設計

```typescript
// ✅ 推奨: nanoidを使用（短く、URLフレンドリー）
id: text("id").primaryKey().$defaultFn(() => nanoid())

// ❌ 避ける: UUIDは長い
id: uuid("id").defaultRandom().primaryKey()

// ❌ 避ける: 連番は予測可能でセキュリティリスク
id: serial("id").primaryKey()
```

##### 2. `date` vs `timestamp` の使い分け

| 型 | 用途 | 例 |
|---|------|---|
| `date("field_name")` | ユーザーが指定する日付（時刻不要） | 投稿日、イベント日 |
| `timestamp("field_name")` | システムが記録する正確な日時 | createdAt, updatedAt |

```typescript
// ユーザー指定の日付
publishDate: date("publish_date").notNull(),

// システム記録の日時
createdAt: timestamp("created_at").defaultNow().notNull(),
```

##### 3. 外部キー制約の `onDelete` 設定

**考慮点**: 親レコードが削除されたとき、子レコードをどうするか？

| オプション | 挙動 | 使用例 |
|----------|------|--------|
| `cascade` | 子レコードも削除 | ユーザーのセッション、一時データ |
| `set null` | 外部キーをnullに | 作成者情報（データは残す） |
| `restrict` | 親の削除を禁止 | 重要な関連データがある場合 |

```typescript
// ✅ データを残す（組織の資産）
createdBy: text("created_by").references(() => users.id, { onDelete: "set null" })

// ✅ データを削除する（個人データ）
userId: text("user_id").references(() => users.id, { onDelete: "cascade" })
```

##### 4. デフォルト値付きbooleanフィールド

```typescript
// ✅ 正しい: NOT NULL + デフォルト値
published: boolean("published").notNull().default(false)

// ❌ 誤り: オプショナル（nullを許可すると3値になる）
published: boolean("published").default(false)
```

##### 5. スキーマのインポート忘れ（重要）

**必須作業**: `db/index.ts` にスキーマを追加

```typescript
// db/index.ts
import * as {resource}Schema from './schemas/{resource}s';

export const db = drizzle({
  client,
  schema: {
    ...authSchema,
    // ... 他のスキーマ
    ...{resource}Schema,  // ← 必ず追加
  },
});
```

**忘れると**: クエリが動かない、型推論が効かない

#### マイグレーション

```bash
pnpm drizzle:generate  # マイグレーションファイル生成
pnpm drizzle:migrate   # マイグレーション実行
```

**確認ポイント**:
- [ ] テーブルが作成されたか
- [ ] 外部キー制約が正しく設定されたか
- [ ] デフォルト値が設定されたか
- [ ] インデックスが必要な場合は作成されたか

---

### フェーズ2: バリデーション層の設計

#### 実装内容

**ファイル**: `zod/{resource}.ts`

```typescript
import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { {resource}s } from "@/db/schemas/{resource}s";

export const {resource}FormSchema = createInsertSchema({resource}s, {
  // 文字列フィールド
  title: z.string().trim().min(1, "タイトルは必須です").max(255, "タイトルは255文字以内です"),
  content: z.string().trim().min(1, "内容は必須です"),

  // 日付フィールド（DATE型）
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD形式で入力してください"),

  // 数値フィールド
  order: z.number().int("整数で入力してください").positive("正の数で入力してください"),

  // オプショナルなURL
  imageUrl: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === "") return true;
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: "有効なURLを入力してください" }
    ),

  // booleanフィールド（デフォルト値なし）
  published: z.boolean(),
}).omit({
  // 自動生成・サーバー側で設定するフィールドを除外
  id: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
});

export type {Resource}FormData = z.infer<typeof {resource}FormSchema>;
```

#### ⚠️ 注意点

##### 1. `date` フィールドの型変換問題（重要）

**❌ 間違い**: `z.coerce.date()` を使用

```typescript
// PostgreSQLのDATE型は文字列を期待するのでエラー
date: z.coerce.date()
```

**✅ 正解**: 文字列として扱う

```typescript
date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD形式で入力してください")
```

**理由**:
- PostgreSQLのDATE型は `YYYY-MM-DD` 形式の文字列
- `z.coerce.date()` は `Date` オブジェクトに変換
- サーバーアクション層で `toISOString().split("T")[0]` で変換が必要
- タイムゾーン問題のリスク

**教訓**: データベースが期待する型に合わせる

##### 2. 数値フィールドでの `z.coerce` の使用（重要）

**❌ 間違い**: `z.coerce.number()` を使用

```typescript
// react-hook-formで型エラーが発生
issueNumber: z.coerce.number().int().positive()
```

**✅ 正解**: `z.number()` を使用し、フォーム側で型を保証

```typescript
// Zodスキーマ
issueNumber: z.number().int("整数で入力してください").positive("正の数で入力してください")

// フォーム側で数値を保証
defaultValues: {
  issueNumber: nextIssueNumber || 1,  // 数値を直接設定
}

// Input要素
<Input type="number" {...field} />
```

**理由**:
- `z.coerce.number()` は内部的に `unknown` 型を経由
- TypeScriptの型推論が正しく機能しない
- react-hook-formの厳密な型チェックと競合

**教訓**: react-hook-formと組み合わせる場合、`z.coerce` は避ける

##### 3. boolean フィールドのデフォルト値（重要）

**❌ 間違い**: Zodスキーマに `.default()` を追加

```typescript
// 型エラーが発生: boolean | undefined
published: z.boolean().default(false)
```

**✅ 正解**: データベーススキーマでデフォルト値を定義

```typescript
// データベーススキーマ (db/schemas/{resource}s.ts)
published: boolean("published").notNull().default(false)

// Zodスキーマ (zod/{resource}.ts)
published: z.boolean()  // .default() なし
```

**理由**:
- `createInsertSchema()` は NOT NULL 制約がないと `optional` にする
- デフォルト値があっても `boolean | undefined` 型になる
- react-hook-formの `zodResolver` が厳密な型チェックを行うためエラー

**教訓**: デフォルト値はデータベーススキーマに任せる

##### 4. URL検証の非推奨メソッド

**❌ 非推奨**: `z.string().url()`

```typescript
// Zod v4で非推奨
imageUrl: z.string().url()
```

**✅ 推奨**: カスタムバリデーション

```typescript
imageUrl: z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val || val === "") return true;
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    },
    { message: "有効なURLを入力してください" }
  )
```

##### 5. `omit()` で除外すべきフィールド

**必ず除外**:
- `id`: 自動生成（nanoid）
- `createdBy`: サーバー側で設定（改ざん防止）
- `createdAt`, `updatedAt`: 自動設定

```typescript
.omit({
  id: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
})
```

##### 6. オプショナルフィールドのInput要素での扱い

**問題**: オプショナルな文字列フィールド（`imageUrl?: string`）をInput要素に渡すと、`undefined`の警告が出る場合がある

**解決策**: `value={field.value || ""}` で空文字列にフォールバック

```tsx
<FormField
  control={form.control}
  name="imageUrl"
  render={({ field }) => (
    <FormItem>
      <FormControl>
        <Input
          {...field}
          value={field.value || ""}  // undefinedを空文字列に変換
        />
      </FormControl>
    </FormItem>
  )}
/>
```

**または**: デフォルト値設定時に `?? ""` を使う

```typescript
defaultValues: {
  imageUrl: defaultValues.imageUrl ?? "",
}
```

---

### フェーズ3: 型定義層の設計

#### 実装内容

**ファイル**: `types/{resource}.ts`

```typescript
import type { z } from "zod";
import type { {resource}s } from "@/db/schemas/{resource}s";
import type { {resource}FormSchema } from "@/zod/{resource}";

// データベースから取得したデータの型
export type {Resource} = typeof {resource}s.$inferSelect;

// フォーム入力データの型
export type {Resource}FormData = z.infer<typeof {resource}FormSchema>;

// データベースに挿入するデータの型（必要に応じて）
export type New{Resource} = typeof {resource}s.$inferInsert;
```

#### ⚠️ 注意点

##### 1. 型の推論方法

| 推論元 | メソッド | 型 | 用途 |
|--------|---------|---|------|
| Drizzle | `$inferSelect` | 読み取り用 | DBから取得したデータ |
| Drizzle | `$inferInsert` | 書き込み用 | DBに挿入するデータ |
| Zod | `z.infer<typeof schema>` | バリデーション後 | フォーム入力データ |

##### 2. 型の使い分け

| 型 | 含まれるフィールド | 使用場所 |
|----|------------------|---------|
| `{Resource}` | すべて（id, createdAt等含む） | データ表示、カード、リスト |
| `{Resource}FormData` | id, createdBy等を除外 | フォーム、サーバーアクション |
| `New{Resource}` | オプショナルを含む | 直接INSERT（稀） |

##### 3. 型のエクスポート

```typescript
// ✅ 推奨: type キーワードでエクスポート
export type {Resource} = typeof {resource}s.$inferSelect;

// ❌ 避ける: ランタイムエクスポート（型のみなのでtypeを使う）
export const {Resource} = ...
```

---

### フェーズ4: データアクセス層の設計

#### 実装内容

**ファイル**: `data/{resource}.ts`

```typescript
import "server-only";  // ← 必須
import { db } from "@/db";
import { {resource}s } from "@/db/schemas/{resource}s";
import { eq, desc, and } from "drizzle-orm";

// 公開済みデータを取得（一般ユーザー向け）
export const get{Resource}s = async () => {
  return db.query.{resource}s.findMany({
    where: eq({resource}s.published, true),
    orderBy: [desc({resource}s.createdAt)],
  });
};

// すべてのデータを取得（管理者向け）
export const getAll{Resource}s = async () => {
  return db.query.{resource}s.findMany({
    orderBy: [desc({resource}s.createdAt)],
  });
};

// 単一データを取得
export const get{Resource} = async (id: string) => {
  return db.query.{resource}s.findFirst({
    where: eq({resource}s.id, id),
  });
};

// 条件付き取得（例: ユーザーIDでフィルタ）
export const get{Resource}sByUser = async (userId: string) => {
  return db.query.{resource}s.findMany({
    where: eq({resource}s.createdBy, userId),
    orderBy: [desc({resource}s.createdAt)],
  });
};
```

#### ⚠️ 注意点

##### 1. `"server-only"` ディレクティブ（必須）

```typescript
import "server-only";  // ← 必ずファイルの先頭に追加
```

**理由**:
- データアクセス層はサーバーでのみ実行
- クライアントバンドルに含めない
- セキュリティ強化
- 誤ってクライアントコンポーネントでインポートするとビルドエラー

##### 2. GET操作のみ

**データアクセス層の責任**:
- ✅ データの読み取り（SELECT）
- ❌ データの変更（INSERT/UPDATE/DELETE）

**理由**: 変更操作は権限チェックやバリデーションが必要なため、サーバーアクション層で実装

##### 3. 並び順の設定

```typescript
// ✅ 推奨: 配列で複数の並び順を指定
orderBy: [desc({resource}s.createdAt), asc({resource}s.title)]

// ❌ 避ける: 並び順なし（予測不能な順序）
// orderBy: undefined
```

##### 4. 複雑な条件の組み合わせ

```typescript
import { and, or, like, gte } from "drizzle-orm";

// AND条件
where: and(
  eq({resource}s.published, true),
  gte({resource}s.createdAt, new Date("2025-01-01"))
)

// OR条件
where: or(
  eq({resource}s.createdBy, userId),
  eq({resource}s.published, true)
)

// LIKE検索
where: like({resource}s.title, `%${searchTerm}%`)
```

---

### フェーズ5: サーバーアクション層の設計

#### 実装内容

**ファイル**: `actions/{resource}.ts`

```typescript
"use server";  // ← 必須

import { db } from "@/db";
import { {resource}s } from "@/db/schemas/{resource}s";
import { {resource}FormSchema } from "@/zod/{resource}";
import { verifyAdmin } from "@/lib/session";  // または適切な権限チェック
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function create{Resource}(formData: {Resource}FormData) {
  // 1. 権限チェック
  const { userId } = await verifyAdmin();

  // 2. バリデーション
  const data = {resource}FormSchema.parse(formData);

  // 3. データベースに挿入
  await db.insert({resource}s).values({
    ...data,
    createdBy: userId,  // サーバー側で設定
  });

  // 4. キャッシュの再検証
  revalidatePath("/admin/{resource}s");
  revalidatePath("/");  // 公開ページも更新
}

export async function update{Resource}(id: string, formData: {Resource}FormData) {
  // 1. 権限チェック
  await verifyAdmin();

  // 2. バリデーション
  const data = {resource}FormSchema.parse(formData);

  // 3. データベースを更新
  await db.update({resource}s).set(data).where(eq({resource}s.id, id));

  // 4. キャッシュの再検証
  revalidatePath("/admin/{resource}s");
  revalidatePath(`/admin/{resource}s/${id}`);
  revalidatePath("/");
}

export async function delete{Resource}(id: string) {
  // 1. 権限チェック
  await verifyAdmin();

  // 2. データベースから削除
  await db.delete({resource}s).where(eq({resource}s.id, id));

  // 3. キャッシュの再検証
  revalidatePath("/admin/{resource}s");
  revalidatePath("/");
}
```

#### ⚠️ 注意点

##### 1. `"use server"` ディレクティブ（必須）

```typescript
"use server";  // ← 必ずファイルの先頭に追加
```

**理由**: Server Actionsとして認識されるために必須

##### 2. 権限チェック（セキュリティ上必須）

```typescript
// ✅ 必ず実行
const { userId } = await verifyAdmin();

// ❌ 絶対にスキップしない
// 権限チェックなしでDB操作すると誰でも変更可能
```

**共通化の推奨**:
```typescript
// lib/session.ts
export const verifyAdmin = async () => {
  const session = await verifySession();
  const userId = session.user.id;

  const member = await db.query.members.findFirst({
    where: eq(members.userId, userId),
  });

  if (!member || member.role !== "admin") {
    throw new Error("管理者権限が必要です");
  }

  return { userId, memberId: member.id };
};
```

##### 3. バリデーション（必須）

```typescript
// ✅ 必ず実行
const data = {resource}FormSchema.parse(formData);

// ❌ 絶対にスキップしない
// バリデーションなしでDB操作すると不正なデータが入る
```

##### 4. `createdBy` の自動設定（改ざん防止）

```typescript
// ✅ サーバー側で設定
await db.insert({resource}s).values({
  ...data,
  createdBy: userId,  // サーバー側で設定
});

// ❌ クライアントから受け取らない
// formDataにcreatedByを含めると改ざん可能
```

##### 5. キャッシュの再検証

```typescript
// ✅ 関連するパスをすべて再検証
revalidatePath("/admin/{resource}s");      // 一覧ページ
revalidatePath(`/admin/{resource}s/${id}`); // 詳細ページ
revalidatePath("/");                       // 公開ページ
```

**理由**: Next.jsのキャッシュを無効化し、最新データを表示

##### 6. エラーハンドリング

```typescript
export async function create{Resource}(formData: {Resource}FormData) {
  try {
    const { userId } = await verifyAdmin();
    const data = {resource}FormSchema.parse(formData);

    await db.insert({resource}s).values({
      ...data,
      createdBy: userId,
    });

    revalidatePath("/admin/{resource}s");
    return { success: true };
  } catch (error) {
    console.error("Error creating {resource}:", error);
    throw new Error("{Resource}の作成に失敗しました");
  }
}
```

---

### フェーズ6: コンポーネント層の設計

#### 実装内容

**必要なコンポーネント**:
1. **フォームコンポーネント**: `components/{resource}-form.tsx`
2. **カード/リストアイテム**: `components/{resource}-card.tsx`
3. **削除ボタン**: `components/delete-{resource}-button.tsx`

#### 1. フォームコンポーネント

**ファイル**: `components/{resource}-form.tsx`

```typescript
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { {resource}FormSchema } from "@/zod/{resource}";
import { create{Resource}, update{Resource} } from "@/actions/{resource}";
import type { {Resource}, {Resource}FormData } from "@/types/{resource}";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface {Resource}FormProps {
  defaultValues?: {Resource};
}

export function {Resource}Form({ defaultValues }: {Resource}FormProps) {
  const router = useRouter();
  const isEditing = !!defaultValues;

  const form = useForm<{Resource}FormData>({
    resolver: zodResolver({resource}FormSchema),
    defaultValues: defaultValues
      ? {
          title: defaultValues.title,
          content: defaultValues.content,
          published: defaultValues.published,
          // ... 他のフィールド
        }
      : {
          title: "",
          content: "",
          published: false,
          // ... 他のフィールド
        },
  });

  const onSubmit = async (data: {Resource}FormData) => {
    try {
      if (isEditing) {
        await update{Resource}(defaultValues.id, data);
        toast.success("{Resource}を更新しました");
      } else {
        await create{Resource}(data);
        toast.success("{Resource}を作成しました");
      }
      router.push("/admin/{resource}s");
      router.refresh();
    } catch (error) {
      toast.error(
        isEditing ? "{Resource}の更新に失敗しました" : "{Resource}の作成に失敗しました"
      );
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>タイトル</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>内容</FormLabel>
              <FormControl>
                <Textarea {...field} rows={10} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>公開する</FormLabel>
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? "保存中..."
              : isEditing
              ? "更新"
              : "作成"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            キャンセル
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

#### 2. カードコンポーネント

**ファイル**: `components/{resource}-card.tsx`

```typescript
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Delete{Resource}Button } from "@/components/delete-{resource}-button";
import type { {Resource} } from "@/types/{resource}";

interface {Resource}CardProps {
  {resource}: {Resource};
}

export function {Resource}Card({ {resource} }: {Resource}CardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{resource}.title</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{resource}.content</p>
        <div className="mt-4 flex gap-2">
          <Button asChild>
            <Link href={`/admin/{resource}s/${resource}.id`}>編集</Link>
          </Button>
          <Delete{Resource}Button id={{resource}.id} title={{resource}.title} />
        </div>
      </CardContent>
    </Card>
  );
}
```

#### 3. 削除ボタンコンポーネント

**ファイル**: `components/delete-{resource}-button.tsx`

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { delete{Resource} } from "@/actions/{resource}";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface Delete{Resource}ButtonProps {
  id: string;
  title: string;
}

export function Delete{Resource}Button({ id, title }: Delete{Resource}ButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await delete{Resource}(id);
      toast.success("{Resource}を削除しました");
      router.push("/admin/{resource}s");
      router.refresh();
    } catch (error) {
      toast.error("{Resource}の削除に失敗しました");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={isDeleting}>
          削除
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>本当に削除しますか?</AlertDialogTitle>
          <AlertDialogDescription>
            「{title}」を削除します。この操作は取り消せません。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>削除</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

#### ⚠️ 注意点

##### 1. フォームのデフォルト値

**作成と編集を1つのコンポーネントで対応**:

```typescript
defaultValues: defaultValues
  ? {
      // 編集時: 既存の値
      title: defaultValues.title,
      // ...
    }
  : {
      // 作成時: 初期値
      title: "",
      date: new Date().toISOString().split("T")[0],  // 今日の日付
      published: false,
      // ...
    }
```

##### 2. 日付入力フィールド

**HTML5のdate input**:
```tsx
<Input type="date" {...field} />
```

- YYYY-MM-DD形式で自動的に入力
- ブラウザのカレンダーUIを利用
- バリデーションと一致

##### 3. 数値入力フィールド

**HTML5のnumber input**:
```tsx
<Input type="number" {...field} />
```

- 数値として自動的に扱われる
- `z.coerce` 不要

##### 4. オプショナルフィールドの扱い

```tsx
<Input
  {...field}
  value={field.value || ""}  // undefinedを空文字列に変換
/>
```

##### 5. 削除確認ダイアログ（必須）

**AlertDialogを使用**:
- ユーザーに確認を求める
- 誤操作を防ぐ
- UX向上

---

### フェーズ7: ページ層の設計

#### 実装内容

**ディレクトリ構造**:
```
app/[locale]/admin/{resource}s/
├── page.tsx           # 一覧ページ
├── new/
│   └── page.tsx       # 新規作成ページ
└── [id]/
    └── page.tsx       # 編集ページ
```

#### 1. 一覧ページ

**ファイル**: `app/[locale]/admin/{resource}s/page.tsx`

```typescript
import Link from "next/link";
import { getAll{Resource}s } from "@/data/{resource}";
import { {Resource}Card } from "@/components/{resource}-card";
import { Button } from "@/components/ui/button";

export default async function Admin{Resource}sPage() {
  const {resource}s = await getAll{Resource}s();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{Resource}管理</h1>
        <Button asChild>
          <Link href="/admin/{resource}s/new">新規作成</Link>
        </Button>
      </div>

      {resources.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">{Resource}がありません</p>
          <Button asChild>
            <Link href="/admin/{resource}s/new">最初の{Resource}を作成</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {{resource}s.map(({resource}) => (
            <{Resource}Card key={{resource}.id} {resource}={{resource}} />
          ))}
        </div>
      )}
    </div>
  );
}
```

#### 2. 新規作成ページ

**ファイル**: `app/[locale]/admin/{resource}s/new/page.tsx`

```typescript
import { {Resource}Form } from "@/components/{resource}-form";

export default function New{Resource}Page() {
  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">{Resource}の新規作成</h1>
      <{Resource}Form />
    </div>
  );
}
```

#### 3. 編集ページ

**ファイル**: `app/[locale]/admin/{resource}s/[id]/page.tsx`

```typescript
import { notFound } from "next/navigation";
import { get{Resource} } from "@/data/{resource}";
import { {Resource}Form } from "@/components/{resource}-form";

interface Edit{Resource}PageProps {
  params: {
    id: string;
  };
}

export default async function Edit{Resource}Page({ params }: Edit{Resource}PageProps) {
  const {resource} = await get{Resource}(params.id);

  if (!{resource}) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">{Resource}の編集</h1>
      <{Resource}Form defaultValues={{resource}} />
    </div>
  );
}
```

#### ⚠️ 注意点

##### 1. ページの配置場所

**管理者専用機能** → `/admin/`配下に配置
**一般ユーザー向け** → ルート直下または適切なセクション

##### 2. Server Componentの活用

```typescript
// ✅ 推奨: Server Componentでデータを取得
export default async function Page() {
  const data = await getData();  // サーバーで実行
  return <Component data={data} />;
}

// ❌ 避ける: Client Componentでフェッチ（不要な場合）
```

##### 3. 空状態の処理

```tsx
{data.length === 0 ? (
  <EmptyState />
) : (
  <DataList data={data} />
)}
```

##### 4. `notFound()` の使用

```typescript
if (!resource) {
  notFound();  // 404ページを表示
}
```

##### 5. メタデータの設定（SEO）

```typescript
export const metadata = {
  title: "{Resource}管理",
  description: "{Resource}の作成・編集・削除",
};
```

---

### フェーズ8: 統合

#### 実装内容

1. **管理者レイアウトの確認**: `app/[locale]/admin/layout.tsx`
2. **サイドバーメニューの追加**: `components/admin-dashboard/admin-sidebar.tsx`
3. **公開ページへの表示**（必要に応じて）

#### 1. 管理者レイアウト

**ファイル**: `app/[locale]/admin/layout.tsx`

```typescript
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/session";
import { isAdmin } from "@/data/member";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin-dashboard/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();
  const adminCheck = await isAdmin();

  if (!adminCheck) {
    redirect("/");
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="border-b p-4">
          <h2 className="text-xl font-bold">管理画面</h2>
        </header>
        <main className="p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
```

#### 2. サイドバーメニューの追加

**ファイル**: `components/admin-dashboard/admin-sidebar.tsx`

```typescript
// 既存のメニュー項目に追加
const menuItems = [
  // ... 既存の項目
  {
    title: "{Resource}管理",
    href: "/admin/{resource}s",
    icon: SomeIcon,
  },
];
```

#### 3. 公開ページへの表示（例）

**ファイル**: `components/{resource}/public-list.tsx`

```typescript
import { get{Resource}s } from "@/data/{resource}";

export async function Public{Resource}List() {
  const {resource}s = await get{Resource}s();  // 公開済みのみ

  return (
    <div>
      <h2>{Resource}一覧</h2>
      <ul>
        {{resource}s.map(({resource}) => (
          <li key={{resource}.id}>{resource}.title</li>
        ))}
      </ul>
    </div>
  );
}
```

#### ⚠️ 注意点

##### 1. レイアウトの共通化

**メリット**:
- すべての`/admin/*`ページで自動適用
- 権限チェックを一元化
- コードの重複を排除

##### 2. Next.js Linkの使用

```tsx
// ✅ 推奨
<Link href="/admin/{resource}s">{Resource}管理</Link>

// ❌ 避ける
<a href="/admin/{resource}s">{Resource}管理</a>
```

**理由**:
- クライアント側遷移（高速）
- プリフェッチ対応
- Next.jsの最適化を活用

##### 3. Client Component vs Server Component

| 判断基準 | 使用するコンポーネント |
|---------|---------------------|
| データフェッチのみ | Server Component |
| ユーザーインタラクション（フォーム、ボタン） | Client Component |
| 状態管理が必要 | Client Component |
| Next.js hookを使用 | Client Component |

**変換方法**:
```tsx
// Before: Client Component
"use client";
export function Component() {
  const t = useTranslations("key");
  return <div>{t("label")}</div>;
}

// After: Server Component
export async function Component() {
  const t = await getTranslations("key");
  return <div>{t("label")}</div>;
}
```

---

## 発生しやすい問題と解決策

### 問題1: Date型とstring型の不一致

**発生フェーズ**: フェーズ2（バリデーション層）、フェーズ5（サーバーアクション層）

**問題内容**:
```
型 'Date' を型 'string' に割り当てることはできません
```

**原因**:
- Zodで`z.coerce.date()`を使用 → `Date`オブジェクト
- PostgreSQLのDATE型は`string`を期待

**解決策**:
```typescript
// Zodスキーマ
date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)

// サーバーアクション（変換不要）
await db.insert({resource}s).values({
  ...data,  // date は既に文字列
});
```

**教訓**: データベースの期待する型に合わせてバリデーションを設計する

---

### 問題2: 数値フィールドでの型エラー

**発生フェーズ**: フェーズ2（バリデーション層）、フェーズ6（コンポーネント層）

**問題内容**:
```
型 'Control<{ ... }, any, TFieldValues>' を型 'Control<{ ... }, any, { ...; }>' に割り当てることはできません
```

**原因**:
- `z.coerce.number()`は内部的に`unknown`型を経由
- react-hook-formの厳密な型チェックと競合

**解決策**:
```typescript
// Zodスキーマ
issueNumber: z.number().int().positive()  // z.coerce なし

// フォーム側で数値を保証
defaultValues: {
  issueNumber: nextIssueNumber || 1,  // 数値を直接設定
}

// Input要素
<Input type="number" {...field} />
```

**教訓**: react-hook-formと組み合わせる場合、`z.coerce`は避ける

---

### 問題3: booleanフィールドの型エラー

**発生フェーズ**: フェーズ2（バリデーション層）

**問題内容**:
```
Type 'boolean | undefined' is not assignable to type 'boolean'
```

**原因**:
- `createInsertSchema()`は自動的にNOT NULL制約がないフィールドを`optional`にする
- デフォルト値があっても`boolean | undefined`型になる

**解決策**:
```typescript
// データベーススキーマ
published: boolean("published").notNull().default(false)

// Zodスキーマ
published: z.boolean()  // .default() なし
```

**教訓**: デフォルト値はデータベーススキーマに任せる

---

### 問題4: スキーマのインポート忘れ

**発生フェーズ**: フェーズ1（データベース層）

**問題内容**:
- クエリが動かない
- 型推論が効かない

**原因**:
- `db/index.ts`にスキーマを追加し忘れる

**解決策**:
```typescript
// db/index.ts
import * as {resource}Schema from './schemas/{resource}s';

export const db = drizzle({
  client,
  schema: {
    ...authSchema,
    ...{resource}Schema,  // ← 必ず追加
  },
});
```

**教訓**: スキーマ作成後、必ず`db/index.ts`を更新する

---

### 問題5: 権限チェックの重複

**発生フェーズ**: フェーズ5（サーバーアクション層）

**問題内容**:
- `verifyAdmin()`が各ファイルにローカル定義
- コードの重複

**解決策**:
```typescript
// lib/session.ts に移動
export const verifyAdmin = async() => { /* ... */ }

// actions/{resource}.ts
import { verifyAdmin } from "@/lib/session";
```

**教訓**: 共通ロジックは早めに抽出・共通化する

---

### 問題6: レイアウトの重複

**発生フェーズ**: フェーズ7（ページ層）

**問題内容**:
- 各ページでサイドバーを個別実装
- コードの重複

**解決策**:
```typescript
// app/[locale]/admin/layout.tsx を作成
export default async function AdminLayout({ children }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
```

**教訓**: Next.js App Routerの`layout.tsx`を活用する

---

## ベストプラクティス

### 1. レイヤーの責任分離

| レイヤー | 責任 | やってはいけないこと |
|---------|------|------------------|
| **データベース層** | スキーマ定義 | ビジネスロジック |
| **バリデーション層** | 入力検証 | DB操作 |
| **型定義層** | 型の提供 | ロジック実装 |
| **データアクセス層** | GET操作のみ | POST/PUT/DELETE |
| **サーバーアクション層** | POST/PUT/DELETE | GET操作 |
| **コンポーネント層** | UI表示 | DB直接アクセス |
| **ページ層** | ルーティング・データ取得 | ビジネスロジック |

### 2. 命名規則

```typescript
// データベース: 複数形
export const {resource}s = pgTable("{resource}s", { ... });

// 型: 単数形、PascalCase
export type {Resource} = typeof {resource}s.$inferSelect;
export type {Resource}FormData = z.infer<typeof {resource}FormSchema>;

// 関数: 動詞 + 名詞、camelCase
export const get{Resource}s = async () => { ... };
export async function create{Resource}() { ... };

// コンポーネント: PascalCase
export function {Resource}Form() { ... }
export function {Resource}Card() { ... }
```

### 3. ファイル配置

```
プロジェクトルート/
├── app/                      # ページ・ルーティング
│   └── [locale]/
│       ├── admin/
│       │   └── {resource}s/  # 管理画面
│       └── {resource}s/      # 公開ページ（任意）
├── components/               # UIコンポーネント
│   ├── {resource}-form.tsx
│   ├── {resource}-card.tsx
│   └── delete-{resource}-button.tsx
├── actions/                  # サーバーアクション
│   └── {resource}.ts
├── data/                     # データアクセス
│   └── {resource}.ts
├── db/
│   └── schemas/              # DBスキーマ
│       └── {resource}s.ts
├── zod/                      # バリデーション
│   └── {resource}.ts
├── types/                    # 型定義
│   └── {resource}.ts
└── lib/                      # 共通ユーティリティ
    └── session.ts
```

### 4. エラーハンドリング

```typescript
// サーバーアクション
try {
  await create{Resource}(data);
  toast.success("作成しました");
  router.refresh();
} catch (error) {
  toast.error("エラーが発生しました");
  console.error(error);
}
```

### 5. セキュリティ

- ✅ すべてのサーバーアクションで権限チェック
- ✅ Zodでバリデーション
- ✅ `createdBy`はサーバー側で設定
- ✅ `"server-only"`ディレクティブを使用
- ✅ SQL Injection対策（Drizzle ORMが自動的に対応）
- ✅ XSS対策（Reactが自動的にエスケープ）

### 6. パフォーマンス

- ✅ Server Componentを優先
- ✅ `revalidatePath()`でキャッシュを適切に管理
- ✅ 必要なフィールドのみ取得（`select`）
- ✅ インデックスを適切に設定

---

## チェックリスト

### データベース層
- [ ] スキーマ定義完了（`db/schemas/{resource}s.ts`）
- [ ] 主キー設定（nanoid推奨）
- [ ] 外部キー制約設定（`onDelete`を適切に）
- [ ] デフォルト値設定（boolean、timestamp等）
- [ ] `db/index.ts`にインポート追加
- [ ] マイグレーション実行（`pnpm drizzle:generate`, `pnpm drizzle:migrate`）
- [ ] テーブル作成確認

### バリデーション層
- [ ] `createInsertSchema()`使用（`zod/{resource}.ts`）
- [ ] 必須フィールドのバリデーション
- [ ] 任意フィールドの`optional()`
- [ ] エラーメッセージ設定
- [ ] `omit()`で不要フィールド除外（id, createdBy, createdAt, updatedAt）
- [ ] `z.coerce`を避ける（date、number）
- [ ] booleanフィールドに`.default()`を付けない

### 型定義層
- [ ] `$inferSelect`で読み取り型定義（`types/{resource}.ts`）
- [ ] `z.infer`でフォーム型定義
- [ ] エクスポート確認（`export type`）

### データアクセス層
- [ ] `"server-only"`追加（`data/{resource}.ts`）
- [ ] GET操作のみ実装
- [ ] `orderBy`で並び順設定
- [ ] 適切な`where`条件
- [ ] 公開用と管理者用の関数を分ける

### サーバーアクション層
- [ ] `"use server"`追加（`actions/{resource}.ts`）
- [ ] 権限チェック実装（`verifyAdmin()`）
- [ ] Zodバリデーション実行（`.parse()`）
- [ ] エラーハンドリング
- [ ] `createdBy`自動設定
- [ ] `revalidatePath()`でキャッシュ更新

### コンポーネント層
- [ ] フォームコンポーネント作成（作成・編集共通）
- [ ] カード/リストアイテム作成
- [ ] 削除ボタン作成（確認ダイアログ付き）
- [ ] toast通知実装
- [ ] ローディング状態表示
- [ ] `"use client"`を適切に使用

### ページ層
- [ ] 一覧ページ作成
- [ ] 新規作成ページ作成
- [ ] 編集ページ作成
- [ ] 空状態の処理
- [ ] `notFound()`処理
- [ ] メタデータ設定

### 統合
- [ ] レイアウト確認（`app/[locale]/admin/layout.tsx`）
- [ ] メニュー追加（`components/admin-dashboard/admin-sidebar.tsx`）
- [ ] 権限チェック確認
- [ ] 公開ページ連携（必要に応じて）
- [ ] 動作確認（作成・編集・削除）

---

## まとめ

### 実装の流れ

1. **データベース設計書を確認** → 仕様を理解
2. **参考実装を分析** → パターンを把握
3. **フェーズごとに実装** → ボトムアップ
4. **問題が発生したら立ち止まる** → 設計を見直す
5. **共通化を意識** → DRY原則
6. **テストしながら進める** → 早期発見

### 重要なポイント

1. **型の一貫性**: データベース ↔ バリデーション ↔ TypeScript
2. **責任の分離**: 各レイヤーの役割を明確に
3. **共通化**: 重複コードは早めに抽出
4. **セキュリティ**: 権限チェック・バリデーションを徹底
5. **Next.js の機能活用**: Server Component、layout.tsx、Link

### 次のステップ

- [ ] 画像アップロード機能
- [ ] 検索機能
- [ ] ページネーション
- [ ] プレビュー機能
- [ ] マークダウン対応
- [ ] 下書き自動保存

---

**作成者**: Claude + User
**参考実装**: informations、blogs、newsletters、pet
