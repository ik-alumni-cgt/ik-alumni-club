# Next.js 実装パターン

本ドキュメントは [プログラミング原則](programming-principles.md)（DRY, YAGNI, KISS, SoC, SRP, Fail Fast）に基づいています。

旧構造ドメインで使う実装テンプレ集。各テンプレで前提とする配置・命名は [directory-structure.md](directory-structure.md), [directory-roles.md](directory-roles.md), [file-conventions.md](file-conventions.md) を参照。

新構造（DDD モジュール）の実装テンプレは `nextjs-ddd.md`（Phase 2 完了後追加）を参照。

## 1. Server Component と Client Component

### 1.1 デフォルトは Server Component

`app/` 配下のコンポーネントはデフォルトで Server Component。`"use client"` を書いた瞬間に Client Component になる。

迷ったら Server Component で書く。Client にしか書けない事情が出てから `"use client"` を付ける。

### 1.2 `"use client"` を付ける判断基準

以下のどれかに該当する場合のみ Client Component。

- `useState` / `useEffect` / `useRef` 等の React Hook を使う
- イベントハンドラ（onClick, onChange 等）を持つ
- ブラウザ専用 API（`window`, `localStorage`, `IntersectionObserver` 等）を使う
- React Hook Form、shadcn の対話的コンポーネントを使う

### 1.3 Server から Client に props を渡すときの制約

Server Component から Client Component に props を渡すとき、シリアライズ可能な値しか渡せない。

- 渡せる: プリミティブ、配列、オブジェクト、Date、Server Component 由来の `children` JSX
- 渡せない: 関数、クラスインスタンス、Map / Set、Symbol

関数を渡したい場合は Server Action を渡すか、Client 側で wrap する。

## 2. ページコンポーネントの標準形

### 2.1 構造

```typescript
// app/[locale]/(main)/blog/page.tsx
import { setLocale } from "@/app/web/i18n/set-locale";
import { BlogList } from "@/components/blog/list";
import { getPublishedBlogs } from "@/data/blog";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);
  const t = await getTranslations("Contents");
  const items = await getPublishedBlogs();

  return (
    <div className="container mx-auto px-4 pt-10 pb-32">
      <h1 className="main-text mb-10">{t("blog")}</h1>
      <BlogList items={items} />
    </div>
  );
}
```

### 2.2 `dynamic = 'force-dynamic'` を付ける判断

- セッション情報や会員ステータスに依存して表示が変わる場合は付ける
- 純粋に静的な公開ページのみであれば付けなくてよい
- 迷ったら付ける（パフォーマンス最適化は後回し）

### 2.3 `params` の型

Next.js 15 から `params` は `Promise` で渡される。

```typescript
{ params }: { params: Promise<{ locale: string; id: string }> }
```

`await params` で値を取り出す。

### 2.4 アクセス権チェックの位置

ページ冒頭で `verify*` 系を呼ぶ。失敗時は throw またはリダイレクトされる。

```typescript
// app/[locale]/admin/blogs/page.tsx
export default async function AdminBlogsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);
  await verifyAdmin(); // 権限チェック（admin 以外は throw）

  const blogs = await getAllBlogs();

  return <AdminBlogList items={blogs} />;
}
```

## 3. Server Action のテンプレ

### 3.1 標準フロー

1. `"use server"` ディレクティブ
2. 権限チェック（`verifyAdmin` 等）
3. Zod でパース
4. DB 操作
5. `revalidatePath` でキャッシュ再検証

```typescript
// actions/blog.ts
"use server";

import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/lib/session";
import { db } from "@/db";
import { blogs } from "@/db/schemas/blogs";
import { blogFormSchema, type BlogFormData } from "@/zod/blog";

export async function createBlog(formData: BlogFormData) {
  const { userId } = await verifyAdmin();
  const data = blogFormSchema.parse(formData);

  const [newBlog] = await db
    .insert(blogs)
    .values({ ...data, authorId: userId })
    .returning();

  revalidatePath("/admin/blogs");
  revalidatePath("/blog");

  return newBlog;
}
```

### 3.2 戻り値の慣習

- 成功時: 作成・更新したエンティティを返す
- 失敗時: throw する（`null` 返却で失敗を表現しない）
- バリデーション失敗: Zod の `parse` がそのまま throw する

呼び出し側は try-catch でエラーをハンドリングし、toast 等で通知する。

### 3.3 form action として使う / クライアントから関数として呼ぶ

両方の使い方が可能。

```tsx
// 関数として呼ぶ（フォーム送信時）
const onSubmit = async (data: BlogFormData) => {
  try {
    await createBlog(data);
    toast.success("作成しました");
  } catch (error) {
    toast.error("作成に失敗しました");
  }
};
```

```tsx
// form action として渡す
<form action={createBlog}>{/* ... */}</form>
```

React Hook Form を使う場合は前者（関数として呼ぶ）が基本。

## 4. データ取得（GET）

### 4.1 配置

GET 処理は `data/[feature].ts` に書く。Server Action（`actions/`）には書かない。

### 4.2 Server Component から直接呼ぶ

```typescript
// app/[locale]/(main)/blog/page.tsx
import { getPublishedBlogs } from "@/data/blog";

export default async function BlogPage() {
  const items = await getPublishedBlogs();
  return <BlogList items={items} />;
}
```

Client Component から直接 `data/` を呼ぶことはできない（`"server-only"` で守られる）。Client が必要なときは Server Component で取得して props で渡す。

### 4.3 Drizzle query の典型パターン

```typescript
// data/blog.ts
import "server-only";
import { db } from "@/db";
import { blogs } from "@/db/schemas/blogs";
import { and, desc, eq, sql } from "drizzle-orm";

export const getPublishedBlogs = async () => {
  return db.query.blogs.findMany({
    where: eq(blogs.published, true),
    orderBy: [desc(sql`COALESCE(${blogs.publishedAt}, ${blogs.createdAt})`)],
    with: {
      author: true,
    },
  });
};
```

- `findMany` / `findFirst` を使う
- リレーションは `with: { ... }` で同時取得
- 並び替えは `orderBy: [desc(...), asc(...)]`
- 複合条件は `and(...)` / `or(...)`

### 4.4 `import "server-only"` 必須

`data/` 配下のファイルは必ず先頭に書く。

```typescript
import "server-only";
```

これがないとクライアントから誤って import されたときに DB クライアントがバンドルされる。

## 5. フォーム（React Hook Form + Zod + shadcn Form）

### 5.1 標準テンプレ

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { blogFormSchema, type BlogFormData } from "@/zod/blog";
import { createBlog, updateBlog } from "@/actions/blog";

type Props = {
  mode: "create" | "edit";
  defaultValues?: BlogFormData;
  blogId?: string;
};

export function BlogForm({ mode, defaultValues, blogId }: Props) {
  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: defaultValues ?? {
      title: "",
      content: "",
      published: false,
    },
  });

  const onSubmit = async (data: BlogFormData) => {
    try {
      if (mode === "create") {
        await createBlog(data);
        toast.success("ブログを作成しました");
      } else if (blogId) {
        await updateBlog(blogId, data);
        toast.success("ブログを更新しました");
      }
    } catch (error) {
      toast.error("エラーが発生しました");
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        <Button type="submit">{mode === "create" ? "作成" : "更新"}</Button>
      </form>
    </Form>
  );
}
```

### 5.2 `mode: "create" | "edit"` の使い分け

- 1 つのフォームコンポーネントで作成と編集を兼ねる
- `mode` で挙動を切り替え
- `defaultValues` を渡せば編集、渡さなければ作成

### 5.3 onSubmit で Server Action を呼ぶ

`useForm.handleSubmit` の中で Server Action を呼ぶ。エラーは try-catch で受けて toast 通知。

### 5.4 toast 通知

`sonner` を使う（`components/ui/sonner.tsx`）。

| 結果 | 関数 |
|---|---|
| 成功 | `toast.success("...")` |
| 失敗 | `toast.error("...")` |
| 情報 | `toast.info("...")` |

## 6. アクセス権チェック

### 6.1 `lib/session.ts` の関数（throw 系）

`verify*` 系は失敗時に throw またはリダイレクトする。Server Action / Server Component の冒頭で呼ぶ。

| 関数 | 対象 | 失敗時の挙動 | 戻り値 |
|---|---|---|---|
| `verifySession()` | ログインユーザー必須 | `/login` にリダイレクト | `session` |
| `verifyAdmin()` | admin ロール必須 | throw | `{ userId, memberId, member }` |
| `verifyOfficer()` | admin または officer | throw | `{ userId, memberId, member }` |
| `verifyActiveMember()` | active ステータスの会員 | リダイレクト or throw | `{ userId, memberId, member }` |

### 6.2 `lib/session.ts` の関数（boolean / オプショナル系）

戻り値で判定する関数。リダイレクトや throw はしない。

| 関数 | 用途 |
|---|---|
| `canAccessContent(member, level)` | プラン階層レベルでのアクセス可否（同期、boolean） |
| `canAccessMemberContent()` | 会員限定コンテンツのアクセス可否（非同期、boolean） |
| `getCurrentMember()` | 現在のユーザーの会員情報（非同期、`MemberWithPlan` または `null`） |

### 6.3 `data/member.ts` の関数

| 関数 | 用途 |
|---|---|
| `getMemberByUserId(userId)` | userId から会員情報取得 |
| `getMemberRole(userId)` | userId からロール取得 |
| `isAdmin()` | 現在のユーザーが admin か（boolean） |
| `isOfficerOrAdmin()` | 現在のユーザーが officer または admin か（boolean） |

### 6.4 `verify*` と `is*` / `can*` の使い分け

| 場面 | 使うべき関数 |
|---|---|
| Server Action / Server Component の入口で権限がない場合は処理を中断したい | `verify*` |
| 表示を切り替えるための boolean が欲しい（権限がなくても処理は続けたい） | `is*` / `can*` / `getCurrentMember` |

```typescript
// 権限がないと処理させたくない（throw OK）
export async function deleteBlog(id: string) {
  await verifyAdmin();
  await db.delete(blogs).where(eq(blogs.id, id));
}

// 権限の有無で UI を切り替える（throw NG）
export default async function BlogPage() {
  const canRead = await canAccessMemberContent();
  return <div>{canRead ? <FullContent /> : <Preview />}</div>;
}
```

## 7. キャッシュ再検証

### 7.1 `revalidatePath` を呼ぶタイミング

データを変更した直後（Server Action の最後）。

```typescript
revalidatePath("/admin/blogs");
revalidatePath("/blog");
```

### 7.2 公開ページと管理ページ両方の再検証

管理画面で更新した内容は公開ページにも反映が必要なので、両方を呼ぶ。

```typescript
// 管理側で blog を更新したら
revalidatePath("/admin/blogs");
revalidatePath(`/admin/blogs/${id}`);
revalidatePath("/blog");
revalidatePath(`/blog/${id}`);
```

詳細ページも忘れない。

## 8. 多言語対応（next-intl）

### 8.1 `setLocale` + `getTranslations` の使い方

```typescript
import { setLocale } from "@/app/web/i18n/set-locale";
import { getTranslations } from "next-intl/server";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);
  const t = await getTranslations("Contents");

  return <h1>{t("blog")}</h1>;
}
```

- ページ冒頭で `await setLocale(params)` を呼ぶ
- `getTranslations` でカテゴリを指定して翻訳関数 `t` を取得

### 8.2 `messages/ja.json` と `messages/en.json` は必ず両方更新

新しい翻訳キーを追加するときは ja.json と en.json の両方に追加する。片方だけ追加すると未翻訳の状態になる。

## 9. ファイルアップロード（Cloudflare R2）

### 9.1 storage クライアント

`lib/storage.ts` に集約。各機能から直接 R2 を呼ばない。

### 9.2 アップロード後の URL 保存

アップロード → URL を取得 → Server Action で URL を DB に保存、という 2 段階。クライアントから直接 R2 にアップロードする実装が基本。

## 10. Stripe 連携

### 10.1 サブスクリプション系は Better Auth Stripe Plugin 経由

ユーザーの subscription 情報は Better Auth が管理する `subscriptions` テーブル。独自に Stripe API を呼んで subscription を作成・更新しない。

### 10.2 直接決済は API Route

| エンドポイント | 用途 |
|---|---|
| `POST /api/stripe/create-checkout` | Stripe Checkout セッション作成（subscription / payment 両対応） |
| `POST /api/stripe/webhook` | Stripe Webhook 受信 |

### 10.3 Webhook 受信時の処理

`/api/stripe/webhook` で署名検証してから、checkout 完了 / 解約 / 支払い失敗の各イベントを処理する。Webhook を新しく追加するときは Stripe Dashboard 側のイベント設定も更新する。

## 11. 関連ドキュメント

- [directory-structure.md](directory-structure.md): 全体構造と配置判断早見表
- [directory-roles.md](directory-roles.md): 旧構造の各ディレクトリの責任詳細
- [file-conventions.md](file-conventions.md): 命名規則、export ルール、型定義方針
- [programming-principles.md](programming-principles.md): DRY / YAGNI / KISS / SoC / SRP / Fail Fast
- `nextjs-ddd.md`（Phase 2 完了後追加）: DDD モジュールのルール
