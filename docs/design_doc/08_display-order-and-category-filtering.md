# 表示順管理とカテゴリフィルタリング仕様

## 概要

会員向け一覧ページ（動画、ブログ、お知らせ、ニュースレター、過去のイベント等）について、以下を実現する。

- 管理画面で表示順を任意に並び替えられるようにする
- カテゴリ（既存スキーマ）を活用したフィルタリングを会員向けページに導入する
- カテゴリ自体の管理 UI（CRUD、並び替え、親子関係）を整備する

## 背景

- カテゴリの DB スキーマ（`categories` + リソース別中間テーブル）は既に整備済みだが、フロントの一覧ページにフィルタ UI がない。
- `videos` / `blog` / `information` / `newsletters` / `pastEvents` には `sortOrder` カラムがなく、表示順を管理できない（`schedules` / `photoLibraryImages` / `profileMembers` / `categories` には既にある）。
- 管理画面のテーブル（TanStack Table）にドラッグ＆ドロップ並び替え UI が存在しない。
- カテゴリ管理画面が存在しない。

## 対象リソース

- video
- blog
- information
- newsletters
- past-events
- （schedules、photo-library は `sortOrder` 既存。フィルタ UI のみ追加）

## 方針

- 表示順は整数 `sortOrder` カラムで管理する。隣接更新やランクベース（lexorank、fractional indexing）は当面の規模では過剰なため採用しない。
- 並び替え UI には `@dnd-kit/core` と `@dnd-kit/sortable` を導入する（React 19 互換、メンテ状況が良好）。
- カテゴリフィルタの状態は URL クエリで保持する。SSR 親和性、共有可能性、リロード耐性のため。
- カテゴリは現状の「リソースごとに独立した中間テーブル」を維持する。横断検索の要件は現時点で存在しない（YAGNI）。
- 既存の `schedules` で実装済みの `orderBy(asc(sortOrder), ...)` 二段ソートパターンを全リソースに適用する。

## 仕様

### 1. DB スキーマ変更

#### 1.1 sortOrder カラム追加

対象テーブル: `videos`, `blog`, `information`, `newsletters`, `past_events`

```typescript
sortOrder: integer("sort_order").notNull().default(0),
```

- 初期値は 0。マイグレーション後、既存レコードに対して `createdAt` 降順を初期値として 100 単位で採番する（`100, 200, 300, ...`）。
- 採番を 100 単位にすることで、隣接挿入時の全件再採番を遅延できる。
- 同値時のフォールバックとして `createdAt` 降順を併用する。

#### 1.2 categories.slug カラム追加

```typescript
slug: text("slug").notNull().unique(),
```

- URL クエリで使用する識別子（例: `/video?category=event`）。
- 既存レコードには `name` から自動生成した値を初期投入する。
- 一意制約を付与する。

#### 1.3 インデックス

各リソーステーブルに次のインデックスを追加する。

```typescript
index("idx_<table>_sort_order").on(table.sortOrder)
```

カテゴリ JOIN を伴う絞り込みが頻出するため、中間テーブルにも以下を確認する。

```typescript
index("idx_<resource>_categories_category_id").on(table.categoryId)
```

### 2. データ取得層（data/）

#### 2.1 ソート

`data/video.ts` 等の各 query 関数で次の `orderBy` を適用する。

```typescript
.orderBy(asc(videos.sortOrder), desc(videos.createdAt))
```

#### 2.2 カテゴリフィルタ

クエリパラメータとして `categorySlug` を受け取り、指定があれば JOIN で絞り込む。多対多のため重複行が発生するので `groupBy` または `EXISTS` サブクエリで対処する。

```typescript
type GetVideosParams = {
  categorySlug?: string;
  sort?: "custom" | "newest";
};

export async function getVideos({ categorySlug, sort = "custom" }: GetVideosParams) {
  const orderClause = sort === "newest"
    ? [desc(videos.videoDate), desc(videos.createdAt)]
    : [asc(videos.sortOrder), desc(videos.createdAt)];

  if (!categorySlug) {
    return db.select().from(videos).orderBy(...orderClause);
  }

  return db
    .selectDistinct()
    .from(videos)
    .innerJoin(videoCategories, eq(videoCategories.videoId, videos.id))
    .innerJoin(categories, eq(categories.id, videoCategories.categoryId))
    .where(eq(categories.slug, categorySlug))
    .orderBy(...orderClause);
}
```

### 3. 管理画面

#### 3.1 並び替え UI

`components/admin/sortable-table/` を新設し、TanStack Table と dnd-kit を統合した汎用コンポーネントを提供する。

- 行の左端にドラッグハンドルを表示する。
- ドロップ完了時にクライアント側で配列を並び替え、新しい順序に基づいた `{ id, sortOrder }[]` を Server Action に送信する。
- 楽観的更新（optimistic update）で UI 反映を即時化し、失敗時はロールバックする。
- 初期実装は対象リソース 1 つで PoC とし、Rule of Three を満たした時点で共通化する。

#### 3.2 Server Action

`actions/admin/reorder-<resource>.ts` を各リソース分作成する。

```typescript
"use server";

export async function reorderVideos(orders: { id: string; sortOrder: number }[]) {
  await verifyAdmin();

  await db.transaction(async (tx) => {
    for (const { id, sortOrder } of orders) {
      await tx.update(videos).set({ sortOrder }).where(eq(videos.id, id));
    }
  });

  revalidatePath("/admin/videos");
  revalidatePath("/video");
}
```

- 1 トランザクション内で全件更新する。
- バリデーションは zod スキーマで行う（id の存在、sortOrder の型）。
- 100 単位での再採番をサーバー側で行うことで、フロントは順序のみ送信すれば良い設計とする。

#### 3.3 カテゴリ管理画面

`/admin/categories` を新設する。

機能:

- カテゴリ一覧（親子構造をツリー表示）
- カテゴリの作成、編集、削除
- 親カテゴリの付け替え
- ドラッグ＆ドロップによる `sortOrder` の並び替え
- スラッグの編集（既存リンクへの影響を警告する）

削除時の振る舞い:

- 子カテゴリが存在する場合は削除を拒否する
- 中間テーブル経由でリソースに紐付いている場合も削除を拒否する
- FK 制約は `onDelete: "restrict"` で定義する

### 4. 会員向け一覧ページ

#### 4.1 URL 設計

```
/video?category=<slug>&sort=<custom|newest>
```

- `category` 未指定時は全件
- `sort` 未指定時は `custom`（管理画面で設定した順序）
- 状態は URL クエリのみで保持する。Cookie や localStorage は使用しない。

#### 4.2 フィルタ UI

- 横スクロール可能なピル（Chip）形式で配置する
- 「すべて」を含むカテゴリの一覧を表示する
- 親子カテゴリがある場合、第一階層のみをピルに表示し、選択時に第二階層をサブピルとして表示する
- モバイルでも操作しやすい高さ（44px 以上のタップ領域）を確保する

#### 4.3 ソート切替（オプション）

会員側でのソート切替が必要な場合、ピルの右側にセレクトボックスを配置する。

選択肢例:

- 表示順（custom）
- 新着順（newest）

要否は要件確定後に判断する。当面は管理画面で設定した順序のみとする。

### 5. ライブラリ追加

```
@dnd-kit/core
@dnd-kit/sortable
@dnd-kit/utilities
```

`react-beautiful-dnd` は React 19 でのメンテナンス状況を踏まえて採用しない。

## 実装順序

1. `categories.slug` カラム追加と既存データへの slug 投入マイグレーション
2. カテゴリ管理画面（`/admin/categories`）の新設
3. 各リソーステーブルへの `sortOrder` カラム追加マイグレーション
4. data/ 層の `orderBy` を `sortOrder` 込みに統一
5. 会員向け一覧ページにカテゴリフィルタピルを実装（video で PoC）
6. video のフィルタ実装が安定したら他リソースへ横展開
7. dnd-kit 導入と管理画面の並び替え UI 実装（video で PoC）
8. 並び替え UI を他リソースへ横展開、共通コンポーネント化
9. 必要に応じて会員側のソート切替 UI を追加

## 影響範囲

- 既存マイグレーションへの追加であり、データ削除を伴う変更はない
- 会員向け一覧の URL クエリは新規追加のため、既存リンクへの影響なし
- 管理画面の既存テーブル UI は維持し、並び替えタブまたはモードを追加する形にする

## 未確定事項

- 会員側のソート切替 UI の要否
- カテゴリの横断検索の将来要件（将来必要になった時点で再設計する）
- スラッグ変更時の旧 URL からのリダイレクト要否

## 関連ドキュメント

- 02_database-design.md
- 04_api-list.md
- .claude/rules/nextjs-architecture.md
- .claude/rules/programming-principles.md
