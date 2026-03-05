# ユーザー向けデータ一覧・詳細ページ実装計画

## 概要
現在トップページにのみ表示されているデータタイプ（Information、Schedule、Video、Blog、Newsletter）について、専用の一覧ページと詳細ページを実装する。

## 参考実装
- **Information**: 既に一覧ページが存在（ただし3件のみ表示）
- **Pets**: 一覧・詳細ページの完全な実装例

## 実装が必要なデータタイプ

### 1. Information（お知らせ）
- **現状**: 一覧ページは存在するが3件のみ表示、詳細ページなし
- **データ取得**: `@/data/information.ts`
  - `getInformations()` - 一覧取得
  - `getInformation(id)` - 詳細取得

#### 実装タスク
- [ ] 一覧ページの修正（全件表示に変更）
  - ファイル: `app/[locale]/(main)/information/page.tsx`
  - 新規コンポーネント: `components/information/list.tsx`（全件表示用）

- [ ] 詳細ページの作成
  - ファイル: `app/[locale]/(main)/information/[id]/page.tsx`
  - コンポーネント: `components/information/detail.tsx`

- [ ] "VIEW ALL"リンクの実装
  - ファイル: `components/contents/contents-header.tsx`
  - リンク先を動的に設定できるよう修正

---

### 2. Schedule（スケジュール）
- **現状**: トップページ表示のみ
- **データ取得**: `@/data/schedule.ts`
  - `getSchedules()` - 一覧取得
  - `getSchedule(id)` - 詳細取得（要確認）

#### 実装タスク
- [ ] データ取得関数の確認・追加
  - ファイル: `data/schedule.ts`
  - `getSchedule(id)`が存在するか確認、なければ追加

- [ ] 一覧ページの作成
  - ファイル: `app/[locale]/(main)/schedule/page.tsx`
  - コンポーネント: `components/shedule/list.tsx`

- [ ] 詳細ページの作成
  - ファイル: `app/[locale]/(main)/schedule/[id]/page.tsx`
  - コンポーネント: `components/shedule/detail.tsx`

---

### 3. Video（動画）
- **現状**: トップページ表示のみ
- **データ取得**: `@/data/video.ts`
  - `getRecentVideos(limit)` - 最新動画取得
  - `getVideo(id)` - 詳細取得（要確認）

#### 実装タスク
- [ ] データ取得関数の確認・追加
  - ファイル: `data/video.ts`
  - `getAllVideos()`と`getVideo(id)`の存在確認、なければ追加

- [ ] 一覧ページの作成
  - ファイル: `app/[locale]/(main)/video/page.tsx`
  - コンポーネント: `components/video/list.tsx`

- [ ] 詳細ページの作成
  - ファイル: `app/[locale]/(main)/video/[id]/page.tsx`
  - コンポーネント: `components/video/detail.tsx`

---

### 4. Blog（ブログ）
- **現状**: トップページ表示のみ
- **データ取得**: `@/data/blog.ts`
  - `getRecentBlogs(limit)` - 最新ブログ取得
  - `getBlog(id)` - 詳細取得（要確認）

#### 実装タスク
- [ ] データ取得関数の確認・追加
  - ファイル: `data/blog.ts`
  - `getAllBlogs()`と`getBlog(id)`の存在確認、なければ追加

- [ ] 一覧ページの作成
  - ファイル: `app/[locale]/(main)/blog/page.tsx`
  - コンポーネント: `components/blog/list.tsx`

- [ ] 詳細ページの作成
  - ファイル: `app/[locale]/(main)/blog/[id]/page.tsx`
  - コンポーネント: `components/blog/detail.tsx`

---

### 5. Newsletter（ニュースレター）
- **現状**: トップページ表示のみ
- **データ取得**: `@/data/newsletter.ts`
  - `getLatestNewsletters(limit)` - 最新ニュースレター取得
  - `getNewsletter(id)` - 詳細取得（要確認）

#### 実装タスク
- [ ] データ取得関数の確認・追加
  - ファイル: `data/newsletter.ts`
  - `getAllNewsletters()`と`getNewsletter(id)`の存在確認、なければ追加

- [ ] 一覧ページの作成
  - ファイル: `app/[locale]/(main)/newsletter/page.tsx`
  - コンポーネント: `components/newsletters/list.tsx`

- [ ] 詳細ページの作成
  - ファイル: `app/[locale]/(main)/newsletter/[id]/page.tsx`
  - コンポーネント: `components/newsletters/detail.tsx`

---

## 共通実装パターン

### ディレクトリ構造
```
app/[locale]/(main)/
├── information/
│   ├── page.tsx          # 一覧ページ
│   └── [id]/
│       └── page.tsx      # 詳細ページ
├── schedule/
│   ├── page.tsx
│   └── [id]/
│       └── page.tsx
├── video/
│   ├── page.tsx
│   └── [id]/
│       └── page.tsx
├── blog/
│   ├── page.tsx
│   └── [id]/
│       └── page.tsx
└── newsletter/
    ├── page.tsx
    └── [id]/
        └── page.tsx
```

### 一覧ページの実装パターン
```tsx
import { setLocale } from "@/app/web/i18n/set-locale";
import { DataList } from "@/components/[data-type]/list";
import { getData } from "@/data/[data-type]";

export default async function DataListPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);
  const items = await getData();

  return (
    <div className="container max-w-full items-center justify-between pt-10 pb-32">
      <h1 className="main-text mb-10">タイトル</h1>
      <DataList items={items} />
    </div>
  );
}
```

### 詳細ページの実装パターン
```tsx
import { setLocale } from "@/app/web/i18n/set-locale";
import { DataDetail } from "@/components/[data-type]/detail";
import { getData } from "@/data/[data-type]";
import { notFound } from "next/navigation";

export default async function DataDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  await setLocale(params);
  const { id } = await params;
  const item = await getData(id);

  if (!item) {
    notFound();
  }

  return (
    <div className="container max-w-full items-center justify-between pt-10 pb-32">
      <DataDetail item={item} />
    </div>
  );
}
```

### ContentsHeaderの修正
```tsx
import Link from "next/link";

export function ContentsHeader({
  title,
  viewAllHref
}: {
  title: string;
  viewAllHref?: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-2">
      <div className="main-text">{title}</div>
      {viewAllHref && (
        <Link href={viewAllHref} className="view-all-text hover:opacity-70">
          VIEW ALL
        </Link>
      )}
    </div>
  );
}
```

---

## 実装順序（推奨）

1. **準備作業**
   - [ ] 各データ型のスキーマとデータ取得関数を確認
   - [ ] `ContentsHeader`コンポーネントにリンク機能を追加

2. **Information（最優先）**
   - 既存実装があるため、最も実装しやすい
   - 他のデータ型の実装テンプレートとなる

3. **Blog / Newsletter**
   - 構造が似ているため、続けて実装

4. **Schedule**
   - 画像やリンクURLなど追加情報があるため

5. **Video**
   - 動画埋め込みなど特殊な処理が必要な可能性

---

## 注意事項

1. **ルーティング**
   - すべて`(main)`レイアウト配下に配置
   - ユーザー認証が必要な場合は適切にミドルウェアを設定

2. **国際化対応**
   - `setLocale(params)`を各ページで呼び出し
   - 翻訳ファイルに必要なキーを追加

3. **レスポンシブデザイン**
   - 既存のスタイルクラス（`main-text`, `contents-title`など）を活用
   - モバイル表示を考慮したレイアウト

4. **アクセシビリティ**
   - 適切な見出しタグの使用
   - 画像にはalt属性を設定

5. **パフォーマンス**
   - Server Componentsを活用
   - 必要に応じてページネーションやInfinite Scrollを検討

---

## 検証項目

各データ型の実装後、以下を確認：

- [ ] 一覧ページで全データが表示される
- [ ] 各アイテムから詳細ページへ遷移できる
- [ ] 詳細ページで正しいデータが表示される
- [ ] トップページの"VIEW ALL"から一覧ページへ遷移できる
- [ ] 存在しないIDの詳細ページは404エラーになる
- [ ] レスポンシブデザインが正しく機能する
- [ ] 多言語対応が正しく機能する
