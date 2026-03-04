# ユーザー向けページ スマホ表示対応 リファクタリング要件定義

## 📌 概要

本ドキュメントは、IK ALUMNI CGT サポーターズクラブ会員サイトのユーザー向けページにおけるスマホ表示対応のリファクタリング要件をまとめたものです。

**作成日**: 2025-11-09
**対象範囲**: ユーザー向けページ（管理者画面を除く）
**目的**: スマホでの閲覧体験を最適化し、レスポンシブデザインを実現する

---

## 1. 現状分析

### 1.1 対象ページの特定

#### ユーザー向けページ（管理者画面を除く）

**パブリックページ**:
- `/` - ホームページ
- `/information` - お知らせ一覧
- `/events` - スケジュール一覧
- `/videos` - 動画一覧
- `/blog` - ブログ一覧（会員限定）
- `/newsletters` - ニュースレター一覧（会員限定）
- `/contact` - お問い合わせ

**認証ページ**:
- `/login` - ログインページ
- `/signup` - 会員登録案内ページ

**会員登録フロー**:
- `/register/terms` - 会員規約
- `/register/plan` - プラン選択
- `/register/auth` - アカウント作成

**会員専用ページ**:
- `/mypage` - マイページ
- `/profile/*` - プロフィール関連

### 1.2 現在のスタイリング手法

#### 採用技術
- **Tailwind CSS v4**（最新版）
- **shadcn/ui コンポーネント**（Radix UI ベース）
- **カスタムタイポグラフィクラス**（`app/theme/typography.css`）
- **カスタムコンテナユーティリティ**（`px-[60px]`）

#### 既存のレスポンシブ対応状況

| コンポーネント | 対応状況 | 詳細 |
|--------------|---------|------|
| ログイン・会員登録フォーム | ✅ 対応済み | `md:grid-cols-2`でグリッドレイアウト、スマホでは画像非表示 |
| プラン選択 | ✅ 対応済み | `md:grid-cols-2`でカードレイアウト |
| ヘッダー | ❌ 未対応 | デスクトップ専用、スマホ未対応 |
| フッター | △ 部分対応 | レスポンシブだがスマホで最適化されていない |
| ホームページコンテンツ | ❌ 未対応 | スマホレイアウト未定義 |
| コンテンツカード | ❌ 未対応 | 固定幅（`max-w-[342px]`）でスマホで切れる可能性 |

### 1.3 スマホ対応の問題点

#### 🔴 重大な問題

##### 1. ヘッダーナビゲーション
**ファイル**: [components/header/header.tsx:30-100](../components/header/header.tsx#L30-L100)

**問題**:
- 水平に10個以上のリンクとSNSアイコンが並ぶ
- スマホでは横スクロールまたは要素が重なる
- ハンバーガーメニュー未実装

**影響度**: 高（ナビゲーション不能）

---

##### 2. コンテナの固定パディング
**ファイル**: [app/globals.css:126-128](../app/globals.css#L126-L128)

**現状コード**:
```css
@utility container {
  @apply px-[60px];
}
```

**問題**:
- `container`クラスに`px-[60px]`が固定設定
- スマホでは左右60pxは広すぎて画面が狭くなる
- iPhone SE（375px幅）では実質コンテンツ幅が255pxしかない

**影響度**: 高（コンテンツ表示領域が狭い）

---

##### 3. タイポグラフィの固定サイズ
**ファイル**: [app/theme/typography.css](../app/theme/typography.css)

**現状コード**:
```css
.header-text {
  font-size: 16px;
  font-family: var(--font-academy);
}
.main-text {
  font-size: 40px;
  font-family: var(--font-academy);
}
.view-all-text {
  font-size: 16px;
  font-family: var(--font-academy);
}
```

**問題**:
- すべてのフォントサイズがpx固定
- スマホでは読みづらいサイズがある（`.main-text: 40px`など）
- レスポンシブ対応がされていない

**影響度**: 中（可読性の問題）

---

#### 🟡 中程度の問題

##### 4. スケジュールカード
**ファイル**: [components/shedule/card.tsx:29](../components/shedule/card.tsx#L29)

**現状コード**:
```tsx
<div className="flex max-w-[342px] rounded-[25px] shadow-md overflow-hidden">
```

**問題**:
- `max-w-[342px]`の固定幅
- スマホでコンテナからはみ出る可能性

**影響度**: 中（レイアウト崩れ）

---

##### 5. ホームページレイアウト
**ファイル**: [app/[locale]/(main)/page.tsx:38](../app/[locale]/(main)/page.tsx#L38)

**現状コード**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-15 mb-32">
  <BlogContents />
  <NewsLettersContents />
</div>
```

**問題**:
- スマホでは縦に長くなりすぎる
- セクション間隔（`mb-32`）がスマホには大きすぎる

**影響度**: 中（UX の問題）

---

##### 6. フッターリンク
**ファイル**: [components/footer/footer.tsx:20-33](../components/footer/footer.tsx#L20-L33)

**問題**:
- 13個のリンクが`flex-wrap`で折り返し
- スマホで整理されていない配置
- すべて「お支払い」というダミーテキスト

**影響度**: 中（情報設計の問題）

---

## 2. リファクタリング方針

### 2.1 設計原則

#### 1. モバイルファースト設計
- スマホ表示を基準にデザイン
- デスクトップは拡張として実装
- `min-width`のメディアクエリを使用（Tailwind標準）

#### 2. レスポンシブタイポグラフィ
- 固定pxサイズを廃止
- Tailwindのレスポンシブユーティリティ使用（`text-sm md:text-base`など）
- `@apply`ディレクティブでカスタムクラスに適用

#### 3. 柔軟なレイアウト
- 固定幅を削除し、`max-w-*`と`w-full`で対応
- コンテナパディングをブレークポイント別に設定
- グリッドレイアウトを積極的に活用

#### 4. タッチフレンドリーUI
- タップターゲットは最低44x44px（Apple Human Interface Guidelines準拠）
- ナビゲーションはハンバーガーメニュー化
- ボタンに十分な余白を確保

### 2.2 ブレークポイント定義

Tailwind CSS v4のデフォルトブレークポイントを使用:

| プレフィックス | 最小幅 | デバイス想定 |
|---------------|--------|------------|
| なし（デフォルト） | 0px | モバイル（縦） |
| `sm:` | 640px | モバイル（横）、小型タブレット |
| `md:` | 768px | タブレット |
| `lg:` | 1024px | 小型デスクトップ |
| `xl:` | 1280px | デスクトップ |
| `2xl:` | 1536px | 大型デスクトップ |

### 2.3 技術スタック（変更なし）

- Tailwind CSS v4
- shadcn/ui
- Next.js App Router
- React 19

---

## 3. 具体的な改修要件

### 3.1 グローバルスタイル修正

#### A. コンテナのレスポンシブ化

**ファイル**: [app/globals.css:126-128](../app/globals.css#L126-L128)

**現状**:
```css
@utility container {
  @apply px-[60px];
}
```

**改修後**:
```css
@utility container {
  @apply px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[60px];
}
```

**変更内容**:
| ブレークポイント | パディング | 画面幅（例） | コンテンツ幅（例） |
|----------------|-----------|------------|-------------------|
| モバイル | `16px` | 375px | 343px |
| `sm:` | `24px` | 640px | 592px |
| `md:` | `32px` | 768px | 704px |
| `lg:` | `48px` | 1024px | 928px |
| `xl:` | `60px` | 1280px | 1160px |

---

#### B. タイポグラフィのレスポンシブ化

**ファイル**: [app/theme/typography.css](../app/theme/typography.css)

**改修方針**: 固定pxサイズを削除し、`@apply`でTailwindのレスポンシブクラスに置き換え

**改修対象クラス**:

##### 1. `.header-text`
```css
/* 現状 */
.header-text {
  font-size: 16px;
  font-family: var(--font-academy);
}

/* 改修後 */
.header-text {
  @apply text-sm md:text-base;
  font-family: var(--font-academy);
}
```

##### 2. `.main-text`
```css
/* 現状 */
.main-text {
  font-size: 40px;
  font-family: var(--font-academy);
}

/* 改修後 */
.main-text {
  @apply text-2xl md:text-3xl lg:text-4xl;
  font-family: var(--font-academy);
}
```

##### 3. `.view-all-text`
```css
/* 現状 */
.view-all-text {
  font-size: 16px;
  font-family: var(--font-academy);
}

/* 改修後 */
.view-all-text {
  @apply text-xs md:text-sm;
  font-family: var(--font-academy);
}
```

##### 4. `.date-text`
```css
/* 現状 */
.date-text {
  font-size: 10px;
}

/* 改修後 */
.date-text {
  @apply text-[10px] md:text-xs;
}
```

##### 5. `.contents-title`
```css
/* 現状 */
.contents-title {
  font-size: 14px;
}

/* 改修後 */
.contents-title {
  @apply text-sm md:text-base;
}
```

##### 6. `.calendar-card-title`
```css
/* 現状 */
.calendar-card-title {
  font-size: 16px;
}

/* 改修後 */
.calendar-card-title {
  @apply text-sm md:text-base;
}
```

##### 7. `.link-title`
```css
/* 現状 */
.link-title {
  font-size: 14px;
}

/* 改修後 */
.link-title {
  @apply text-xs md:text-sm;
}
```

**注意**: カードテキスト（`.month-card-text`, `.day-card-text`, `.week-card-text`）はカードサイズに依存するため、カード修正時に合わせて調整

---

### 3.2 ヘッダーコンポーネント改修

**ファイル**: [components/header/header.tsx](../components/header/header.tsx)

#### 改修内容

##### 1. ハンバーガーメニューの実装

**使用コンポーネント**: shadcn/ui `Sheet`コンポーネント

**実装方針**:
- スマホ（`md`未満）: ハンバーガーメニュー
- デスクトップ（`md`以上）: 従来の水平メニュー

**実装イメージ**:
```tsx
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-[80px] md:h-[140px] items-center justify-between">
        {/* ロゴ */}
        <Image
          src={logo}
          alt=""
          width={60}
          height={60}
          className="md:w-[100px] md:h-[100px]"
        />

        {/* モバイル: ハンバーガーメニュー */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/">{t("home")}</Link>
                <Link href="/information">{t("information")}</Link>
                <Link href="/events">{t("schedule")}</Link>
                <Link href="/videos">{t("video")}</Link>
                <Link href="/blog">{t("blog")}</Link>
                <Link href="/newsletters">{t("newsletters")}</Link>
                <Link href="/contact">{t("contact")}</Link>

                <Separator className="my-4" />

                {/* SNSアイコン */}
                <div className="flex gap-4">
                  <Image src={xBlack} alt="" height={24} />
                  <Image src={instagramBlack} alt="" height={24} />
                  <Image src={youtubeBlack} alt="" height={24} />
                  <Image src={tiktokBlack} alt="" height={24} />
                </div>

                <Separator className="my-4" />

                {/* ログイン/ログアウトボタン */}
                {session?.user ? (
                  <>
                    <Link href="/mypage">
                      <Button variant="outline" className="w-full">
                        {t("mypage")}
                      </Button>
                    </Link>
                    <Button variant="outline" onClick={handleLogout} className="w-full">
                      {t("logout")}
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/signup">
                      <Button className="w-full">{t("joinUs")}</Button>
                    </Link>
                    <Link href="/login">
                      <Button variant="outline" className="w-full">{t("login")}</Button>
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* デスクトップ: 従来の水平メニュー */}
        <div className="hidden md:flex md:flex-col md:flex-1">
          {/* 既存のナビゲーション構造を維持 */}
        </div>
      </div>
    </header>
  );
}
```

##### 2. ヘッダー高さの調整

```tsx
// 現状
<div className="container max-w-full flex h-[140px] items-center justify-between">

// 改修後
<div className="container max-w-full flex h-[80px] md:h-[140px] items-center justify-between">
```

##### 3. ロゴサイズの調整

```tsx
// 現状
<Image src={logo} alt="" width={100} height={100} />

// 改修後
<Image
  src={logo}
  alt=""
  width={60}
  height={60}
  className="md:w-[100px] md:h-[100px]"
/>
```

##### 4. SNSアイコンの配置

- **スマホ**: ハンバーガーメニュー内に表示
- **デスクトップ**: ヘッダーとフッター両方に表示（現状維持）

---

### 3.3 フッターコンポーネント改修

**ファイル**: [components/footer/footer.tsx](../components/footer/footer.tsx)

#### 改修内容

##### 1. リンク整理と実装

**現状**: すべて「お支払い」というダミーテキストが13個

**改修後**: 実際のリンクに置き換え

```tsx
export function Footer() {
  const links = [
    { label: "ホーム", href: "/" },
    { label: "お知らせ", href: "/information" },
    { label: "スケジュール", href: "/events" },
    { label: "動画", href: "/videos" },
    { label: "ブログ", href: "/blog" },
    { label: "会報", href: "/newsletters" },
    { label: "お問い合わせ", href: "/contact" },
    { label: "利用規約", href: "/terms" },
    { label: "プライバシーポリシー", href: "/privacy" },
    { label: "特定商取引法に基づく表記", href: "/legal" },
  ];

  return (
    <footer className="w-full border-t bg-background mt-16 md:mt-32">
      <div className="pt-8 md:pt-[50px]">
        {/* SNSアイコン */}
        <div className="flex gap-4 items-center justify-center mb-6 md:mb-8">
          <Image src={xBlack} alt="" height={24} />
          <Image src={instagramBlack} alt="" height={24} />
          <Image src={youtubeBlack} alt="" height={24} />
          <Image src={tiktokBlack} alt="" height={24} />
        </div>

        {/* リンク */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-4 md:gap-12 items-center justify-center px-4 md:px-[92px] mb-8 md:mb-[50px]">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="header-text whitespace-nowrap hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* コピーライト */}
        <div className="flex justify-center pb-4 md:pb-0">
          <div className="header-text py-4">
            ©️IK ALUMNI CGT
          </div>
        </div>
      </div>
    </footer>
  );
}
```

##### 2. レイアウト変更

| ブレークポイント | レイアウト | カラム数 |
|----------------|-----------|---------|
| モバイル | Grid | 2列 |
| `sm:` | Grid | 3列 |
| `md:` 以上 | Flex + Wrap | 自動折り返し |

##### 3. 余白調整

- `mt-16 md:mt-32`: フッター上部の余白
- `pt-8 md:pt-[50px]`: フッター内部の上パディング
- `mb-6 md:mb-8`: SNSアイコン下の余白

---

### 3.4 コンテンツカード改修

#### A. スケジュールカード

**ファイル**: [components/shedule/card.tsx](../components/shedule/card.tsx)

**現状**:
```tsx
<div className="flex max-w-[342px] rounded-[25px] shadow-md overflow-hidden">
```

**改修後**:
```tsx
<div className="flex w-full max-w-full sm:max-w-[342px] rounded-[25px] shadow-md overflow-hidden">
```

**カードサイズの調整**:
```tsx
<div className="flex w-full max-w-full sm:max-w-[342px] rounded-[25px] shadow-md overflow-hidden">
  <div className="bg-brand h-[150px] sm:h-[192px] w-[80px] sm:w-[100px] flex flex-col items-center pt-4">
    <div className="month-card-text text-lg sm:text-2xl">{month}</div>
    <div className="day-card-text text-2xl sm:text-[32px]">{day}</div>
    <div className="week-card-text text-[10px] sm:text-xs">[{weekDay}]</div>
  </div>
  <div className="bg-white h-[150px] sm:h-[192px] flex-1 sm:w-[242px] flex flex-col p-3 sm:p-4 gap-2 sm:gap-[10px]">
    <div className="calendar-card-title">{title}</div>
    <div className="flex justify-center">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={title}
          width={210}
          height={80}
          className="object-cover sm:h-[100px]"
        />
      ) : (
        <Image
          src="/components/shedule/Rectangle 5.svg"
          alt="Rectangle"
          width={210}
          height={80}
          className="sm:h-[100px]"
        />
      )}
    </div>
    {linkUrl ? (
      <a
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="link-title hover:underline"
      >
        {t("click_here_for_details")}
      </a>
    ) : (
      <div className="link-title">{t("click_here_for_details")}</div>
    )}
  </div>
</div>
```

**変更点**:
- カード全体: `w-full max-w-full sm:max-w-[342px]`
- 高さ: `h-[150px] sm:h-[192px]`
- 左カラム幅: `w-[80px] sm:w-[100px]`
- 右カラム: `flex-1`で可変幅
- パディング: `p-3 sm:p-4`

---

#### B. コンテンツヘッダー

**ファイル**: [components/contents/contents-header.tsx](../components/contents/contents-header.tsx)

**現状**:
```tsx
<div className="flex justify-between items-center w-full">
  <div className="main-text">{title}</div>
  <div className="view-all-text">VIEW ALL</div>
</div>
```

**改修後**:
```tsx
<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-2">
  <div className="main-text">{title}</div>
  <div className="view-all-text">VIEW ALL</div>
</div>
```

**変更点**:
- スマホ: 縦並び（`flex-col`）、左揃え（`items-start`）
- タブレット以上: 横並び（`sm:flex-row`）、中央揃え（`sm:items-center`）
- ギャップ追加: `gap-2`

---

### 3.5 ホームページレイアウト改修

**ファイル**: [app/[locale]/(main)/page.tsx](../app/[locale]/(main)/page.tsx)

#### 改修内容

##### 1. ヒーローセクション

**現状**:
```tsx
<div className="relative w-full h-screen -mt-35 mb-32">
```

**改修後**:
```tsx
<div className="relative w-full h-[50vh] sm:h-[70vh] md:h-screen -mt-20 md:-mt-35 mb-16 md:mb-32">
```

**変更点**:
- 高さ: スマホ`50vh` → タブレット`70vh` → デスクトップ`100vh`
- 上マージン: スマホ`-mt-20` → デスクトップ`-mt-35`
- 下マージン: スマホ`mb-16` → デスクトップ`mb-32`

##### 2. セクション間隔

**現状**:
```tsx
<div className="mb-32">
  <InformationContents />
</div>
```

**改修後**:
```tsx
<div className="mb-16 md:mb-32">
  <InformationContents />
</div>
```

**全セクションに適用**:
- `InformationContents`
- `ScheduleContents`
- `VideoContents`
- ブログ・ニュースレターグリッド

##### 3. グリッドレイアウト

**現状維持**（既にレスポンシブ）:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-15 mb-32">
  <BlogContents />
  <NewsLettersContents />
</div>
```

**調整**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-15 mb-16 md:mb-32">
  <BlogContents />
  <NewsLettersContents />
</div>
```

---

### 3.6 フォームページ改修

**対象ファイル**:
- [components/login-form/login-form.tsx](../components/login-form/login-form.tsx)
- [components/register/register-auth-form.tsx](../components/register/register-auth-form.tsx)
- [components/register/plan-selection-form.tsx](../components/register/plan-selection-form.tsx)

#### 改修内容

✅ **現状で十分なレスポンシブ対応済み**

既存の実装:
- `md:grid-cols-2`でグリッド分割
- スマホで画像非表示（`hidden md:block`）
- プラン選択もレスポンシブグリッド（`md:grid-cols-2`）

#### 追加改善（オプション）

##### 1. ボタンのタッチフレンドリー化

**現状**:
```tsx
<Button type="submit" className="w-full">
  ログイン
</Button>
```

**改修後**:
```tsx
<Button type="submit" className="w-full min-h-11">
  ログイン
</Button>
```

**適用箇所**:
- すべてのフォームボタン
- ナビゲーションボタン

##### 2. フォームパディングの調整

**現状**:
```tsx
<form onSubmit={handleEmailLogin} className="p-6 md:p-8">
```

**改修後**:
```tsx
<form onSubmit={handleEmailLogin} className="p-4 sm:p-6 md:p-8">
```

---

### 3.7 マイページ改修

**ファイル**: [app/[locale]/(main)/mypage/page.tsx](../app/[locale]/(main)/mypage/page.tsx)

#### 改修内容

**現状**:
```tsx
<div className="container py-6">
  <h1 className="text-2xl font-bold mb-6">マイページ</h1>
  ...
</div>
```

**改修後**:
```tsx
<div className="container py-4 md:py-6">
  <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">マイページ</h1>
  ...
</div>
```

**変更点**:
- パディング: `py-4 md:py-6`
- タイトルサイズ: `text-xl md:text-2xl`
- 下マージン: `mb-4 md:mb-6`

---

## 4. 実装優先順位

### フェーズ1（最重要・即対応）

#### 優先度: 🔴 高

| No | タスク | ファイル | 工数 | 影響範囲 |
|----|-------|---------|------|---------|
| 1 | グローバルコンテナのレスポンシブ化 | `app/globals.css` | 0.5h | 全ページ |
| 2 | ヘッダーのハンバーガーメニュー実装 | `components/header/header.tsx` | 2.0h | 全ユーザー向けページ |
| 3 | タイポグラフィのレスポンシブ化 | `app/theme/typography.css` | 0.5h | 全ページ |

**フェーズ1合計**: 3時間

---

### フェーズ2（重要）

#### 優先度: 🟡 中

| No | タスク | ファイル | 工数 | 影響範囲 |
|----|-------|---------|------|---------|
| 4 | スケジュールカードの幅修正 | `components/shedule/card.tsx` | 0.5h | ホーム、スケジュール一覧 |
| 5 | フッターのレイアウト改善 | `components/footer/footer.tsx` | 1.0h | 全ページ |
| 6 | ホームページの余白調整 | `app/[locale]/(main)/page.tsx` | 0.5h | ホームページ |

**フェーズ2合計**: 2時間

---

### フェーズ3（最適化）

#### 優先度: 🟢 低

| No | タスク | ファイル | 工数 | 影響範囲 |
|----|-------|---------|------|---------|
| 7 | コンテンツヘッダーの配置改善 | `components/contents/contents-header.tsx` | 0.25h | コンテンツセクション |
| 8 | マイページの余白調整 | `app/[locale]/(main)/mypage/page.tsx` | 0.25h | マイページ |
| 9 | ボタンのタッチフレンドリー化 | 全フォーム | 0.5h | フォーム系ページ |

**フェーズ3合計**: 1時間

---

### テスト・検証

| No | タスク | 工数 |
|----|-------|------|
| 10 | デバイステスト（iPhone SE、iPad、Desktop） | 0.5h |
| 11 | ブラウザテスト（Safari、Chrome、Firefox） | 0.5h |

**テスト合計**: 1時間

---

### 総工数

| フェーズ | 工数 |
|---------|------|
| フェーズ1 | 3時間 |
| フェーズ2 | 2時間 |
| フェーズ3 | 1時間 |
| テスト | 1時間 |
| **合計** | **7時間** |

---

## 5. テスト要件

### 5.1 テストデバイス

#### 必須デバイス

| デバイス | 画面幅 | 画面高さ | 用途 |
|---------|--------|---------|------|
| iPhone SE | 375px | 667px | 最小幅テスト |
| iPhone 14 Pro | 393px | 852px | 標準モバイル |
| iPad | 768px | 1024px | タブレット |
| デスクトップ | 1280px | 1024px | 標準デスクトップ |
| 大型デスクトップ | 1920px | 1080px | 大画面 |

#### テスト方法

1. **実機テスト** (推奨)
   - iPhone実機
   - iPad実機

2. **ブラウザDevTools**
   - Chrome DevTools Device Mode
   - Safari Responsive Design Mode
   - Firefox Responsive Design Mode

3. **オンラインツール**
   - BrowserStack
   - Responsive Viewer拡張機能

### 5.2 テスト項目

#### A. ヘッダーナビゲーション

| No | テスト項目 | 期待結果 | スマホ | タブレット | デスクトップ |
|----|-----------|---------|--------|-----------|-------------|
| 1 | ハンバーガーメニュー表示 | md未満で表示される | ✅ | - | - |
| 2 | 水平メニュー表示 | md以上で表示される | - | ✅ | ✅ |
| 3 | メニューの開閉 | スムーズに開閉できる | ✅ | - | - |
| 4 | ナビゲーションリンク | 全てのリンクが表示される | ✅ | ✅ | ✅ |
| 5 | ロゴサイズ | 適切なサイズで表示される | ✅ | ✅ | ✅ |
| 6 | SNSアイコン配置 | 適切な位置に表示される | ✅ | ✅ | ✅ |

---

#### B. レイアウト

| No | テスト項目 | 期待結果 | スマホ | タブレット | デスクトップ |
|----|-----------|---------|--------|-----------|-------------|
| 1 | コンテンツ幅 | 画面幅に収まる | ✅ | ✅ | ✅ |
| 2 | 横スクロール | 発生しない | ✅ | ✅ | ✅ |
| 3 | コンテナパディング | 適切な余白が確保されている | ✅ | ✅ | ✅ |
| 4 | カードレイアウト | 画面からはみ出さない | ✅ | ✅ | ✅ |
| 5 | グリッドレイアウト | 適切なカラム数 | ✅ | ✅ | ✅ |
| 6 | セクション間隔 | 適切な余白 | ✅ | ✅ | ✅ |

---

#### C. タイポグラフィ

| No | テスト項目 | 期待結果 | スマホ | タブレット | デスクトップ |
|----|-----------|---------|--------|-----------|-------------|
| 1 | 見出しサイズ | 読みやすいサイズ | ✅ | ✅ | ✅ |
| 2 | 本文サイズ | 読みやすいサイズ | ✅ | ✅ | ✅ |
| 3 | 行間 | 適切な行間 | ✅ | ✅ | ✅ |
| 4 | テキストの折り返し | 適切に折り返される | ✅ | ✅ | ✅ |

---

#### D. タッチ操作（モバイル・タブレット）

| No | テスト項目 | 期待結果 | スマホ | タブレット |
|----|-----------|---------|--------|-----------|
| 1 | ボタンサイズ | 最低44x44px | ✅ | ✅ |
| 2 | リンクのタップ領域 | 十分な領域が確保されている | ✅ | ✅ |
| 3 | スクロール | スムーズにスクロールできる | ✅ | ✅ |
| 4 | メニュー開閉 | タップで正常に動作する | ✅ | ✅ |
| 5 | フォーム入力 | 入力しやすい | ✅ | ✅ |

---

#### E. パフォーマンス

| No | テスト項目 | 期待結果 | 目標値 |
|----|-----------|---------|--------|
| 1 | 初回ロード時間 | 3秒以内 | < 3s |
| 2 | ページ遷移 | スムーズ | < 1s |
| 3 | 画像読み込み | 遅延読み込みが機能 | - |
| 4 | CLS（Cumulative Layout Shift） | レイアウトシフトが少ない | < 0.1 |

---

#### F. ブラウザ互換性

| ブラウザ | バージョン | 対応状況 |
|---------|-----------|---------|
| Safari (iOS) | 最新 | ✅ 必須 |
| Chrome (Android) | 最新 | ✅ 必須 |
| Chrome (Desktop) | 最新 | ✅ 必須 |
| Safari (macOS) | 最新 | ✅ 必須 |
| Firefox | 最新 | ⚪ 推奨 |
| Edge | 最新 | ⚪ 推奨 |

---

## 6. 懸念事項と対策

### 6.1 既存の管理者画面への影響

#### 懸念
グローバルスタイル（`container`、タイポグラフィクラス）の変更が管理者画面に影響する可能性

#### 対策

1. **管理者画面のレイアウト分離**
   - 管理者画面は別レイアウト（`(dashboard)`グループ）
   - shadcn/ui の`Sidebar`コンポーネントを使用
   - `container`クラスを使用していない

2. **影響範囲の確認**
   ```bash
   # 管理者画面でcontainerクラスを使用している箇所を確認
   grep -r "container" app/\[locale\]/admin
   ```

3. **オーバーライド方法**
   - 使用箇所があれば個別に`px-*`クラスでオーバーライド
   ```tsx
   <div className="container !px-8">
     {/* 管理者画面のコンテンツ */}
   </div>
   ```

#### 検証項目
- [ ] 管理者ダッシュボードのレイアウト崩れなし
- [ ] お知らせ管理画面のレイアウト崩れなし
- [ ] スケジュール管理画面のレイアウト崩れなし
- [ ] 動画管理画面のレイアウト崩れなし
- [ ] ブログ管理画面のレイアウト崩れなし
- [ ] ニュースレター管理画面のレイアウト崩れなし
- [ ] ユーザー管理画面のレイアウト崩れなし

---

### 6.2 タイポグラフィクラスの大量使用

#### 懸念
`.main-text`などのカスタムクラスを多数のコンポーネントで使用しているため、変更の影響範囲が広い

#### 対策案

##### 方針A: カスタムクラス内でTailwindクラスを使用（推奨）

**メリット**:
- 既存のクラス名を維持
- 変更箇所が少ない（`typography.css`のみ）
- コンポーネント側の修正不要

**デメリット**:
- カスタムクラスの依存が継続

**実装例**:
```css
.main-text {
  @apply text-2xl md:text-3xl lg:text-4xl;
  font-family: var(--font-academy);
}
```

---

##### 方針B: 段階的に Tailwind クラスへ移行

**メリット**:
- 長期的にメンテナンス性が向上
- Tailwindの標準に準拠

**デメリット**:
- 変更箇所が多い
- 時間がかかる

**実装方針**:
1. 新規コンポーネント: Tailwindクラス直接使用
2. 既存コンポーネント: カスタムクラス維持
3. 段階的にリファクタリング

---

#### 推奨方針

**方針A（カスタムクラス内でレスポンシブ化）を推奨**

**理由**:
- 既存の実装を最大限活用
- リスクが低い
- 短期間で対応可能

**将来的な移行計画**:
- フェーズ4（将来）として、Tailwindクラスへの移行を検討
- コンポーネント単位で段階的に移行

---

### 6.3 画像の最適化

#### 懸念
ヒーロー画像などの大きな画像がモバイルで遅い可能性

#### 対策

1. **Next.js Image コンポーネントの活用**（既に実装済み）
   - 自動的に最適化
   - レスポンシブ画像の生成

2. **優先度設定**
   ```tsx
   <Image
     src={heroBg}
     alt="Hero Background"
     fill
     priority  // ヒーロー画像は優先読み込み
   />
   ```

3. **遅延読み込み**
   ```tsx
   <Image
     src={thumbnail}
     alt=""
     loading="lazy"  // その他の画像は遅延読み込み
   />
   ```

---

### 6.4 フォント読み込みの最適化

#### 懸念
カスタムフォント（Academy、Senobi Gothic）の読み込みがモバイルで遅い可能性

#### 対策

1. **フォントのプリロード**（`app/layout.tsx`で設定）
   ```tsx
   import { Academy_Engraved_LET_Plain } from "next/font/local";
   import { Senobi_Gothic } from "next/font/local";

   const academyFont = Academy_Engraved_LET_Plain({
     subsets: ["latin"],
     display: "swap",  // フォント読み込み中にフォールバックフォントを表示
   });
   ```

2. **フォントの subset 指定**
   - 必要な文字セットのみ読み込み

---

### 6.5 ハンバーガーメニューのアクセシビリティ

#### 懸念
スクリーンリーダーユーザーがハンバーガーメニューを使いにくい可能性

#### 対策

1. **ARIA属性の追加**
   ```tsx
   <SheetTrigger asChild>
     <Button
       variant="ghost"
       size="icon"
       aria-label="メニューを開く"
       aria-expanded={isOpen}
     >
       <Menu className="h-6 w-6" />
     </Button>
   </SheetTrigger>
   ```

2. **キーボード操作対応**
   - `Esc`キーでメニューを閉じる（shadcn/ui Sheetで標準対応）
   - `Tab`キーでフォーカス移動

3. **フォーカストラップ**
   - メニュー内でフォーカスをトラップ（shadcn/ui Sheetで標準対応）

---

## 7. 成果物

### 7.1 修正ファイル一覧

| No | ファイルパス | 修正内容 | フェーズ |
|----|------------|---------|---------|
| 1 | `app/globals.css` | コンテナのレスポンシブ化 | フェーズ1 |
| 2 | `app/theme/typography.css` | タイポグラフィのレスポンシブ化 | フェーズ1 |
| 3 | `components/header/header.tsx` | ハンバーガーメニュー実装 | フェーズ1 |
| 4 | `components/footer/footer.tsx` | フッターレイアウト改善 | フェーズ2 |
| 5 | `components/shedule/card.tsx` | カード幅修正 | フェーズ2 |
| 6 | `app/[locale]/(main)/page.tsx` | ホームページ余白調整 | フェーズ2 |
| 7 | `components/contents/contents-header.tsx` | ヘッダー配置改善 | フェーズ3 |
| 8 | `app/[locale]/(main)/mypage/page.tsx` | マイページ余白調整 | フェーズ3 |
| 9 | `components/ui/button.tsx` | ボタンのタッチフレンドリー化（オプション） | フェーズ3 |

### 7.2 新規ドキュメント

| No | ファイル名 | 内容 |
|----|-----------|------|
| 1 | `docs/mobile-responsive-refactoring.md` | 本ドキュメント |
| 2 | `docs/responsive-design-guide.md`（新規） | レスポンシブデザインガイドライン |

### 7.3 既存ドキュメント更新

| No | ファイル名 | 更新内容 |
|----|-----------|---------|
| 1 | `CLAUDE.md` | スマホ対応完了の記載 |
| 2 | `README.md` | レスポンシブデザインの説明追加 |

---

## 8. 実装スケジュール

### 8.1 タイムライン

| フェーズ | タスク | 工数 | 累計 | 実施日（想定） |
|---------|-------|------|------|--------------|
| **準備** | 要件定義確認 | 0.5h | 0.5h | Day 1 午前 |
| **フェーズ1** | グローバルスタイル修正 | 0.5h | 1.0h | Day 1 午前 |
| | ヘッダー改修 | 2.0h | 3.0h | Day 1 午後 |
| | タイポグラフィ修正 | 0.5h | 3.5h | Day 1 午後 |
| | フェーズ1テスト | 0.5h | 4.0h | Day 1 夕方 |
| **フェーズ2** | カード修正 | 0.5h | 4.5h | Day 2 午前 |
| | フッター改修 | 1.0h | 5.5h | Day 2 午前 |
| | ホームページ調整 | 0.5h | 6.0h | Day 2 午後 |
| | フェーズ2テスト | 0.5h | 6.5h | Day 2 午後 |
| **フェーズ3** | 細かい調整 | 1.0h | 7.5h | Day 3 午前 |
| | 最終テスト | 1.0h | 8.5h | Day 3 午後 |
| **完了** | ドキュメント更新 | 0.5h | 9.0h | Day 3 午後 |

### 8.2 マイルストーン

| マイルストーン | 完了条件 | 期日（想定） |
|--------------|---------|------------|
| MS1: フェーズ1完了 | ヘッダー、コンテナ、タイポグラフィのレスポンシブ化完了 | Day 1 終了時 |
| MS2: フェーズ2完了 | カード、フッター、ホームページの調整完了 | Day 2 終了時 |
| MS3: 全体完了 | 全フェーズ完了、テスト合格、ドキュメント更新 | Day 3 終了時 |

---

## 9. リリース計画

### 9.1 リリース方針

#### リリース方法
- **段階的リリース**（フェーズ単位でリリース）
- 各フェーズ完了後にステージング環境でテスト
- 問題なければプロダクション環境へデプロイ

#### リリース順序

1. **フェーズ1**: グローバルスタイル + ヘッダー
   - 影響範囲が大きいため優先
   - 十分なテストを実施

2. **フェーズ2**: カード + フッター + ホームページ
   - フェーズ1の安定性確認後にリリース

3. **フェーズ3**: 最適化
   - 細かい調整のため、まとめてリリース可能

### 9.2 ロールバック計画

#### ロールバック条件
- 重大なバグ（ページ表示不能、ナビゲーション不能）
- パフォーマンス著しく低下
- ユーザーからの重大なフィードバック

#### ロールバック手順
1. Git で前のコミットに戻す
   ```bash
   git revert <commit-hash>
   ```
2. 再デプロイ
3. 問題の原因を調査・修正
4. 再度テスト後にリリース

---

## 10. 関連ドキュメント

| ドキュメント | 説明 | パス |
|------------|------|------|
| URL設計 | ページ構成とルーティング | [docs/url-design.md](./url-design.md) |
| ページ構成一覧 | 全ページの機能一覧 | [docs/pages-overview.md](./pages-overview.md) |
| データベース設計 | テーブル設計 | [docs/database-design-sql.md](./database-design-sql.md) |
| アカウント設計 | 会員登録・認証フロー | [docs/account-design.md](./account-design.md) |

---

## 11. FAQ

### Q1: 管理者画面もレスポンシブ対応が必要ですか？

**A**: いいえ。本リファクタリングの対象はユーザー向けページのみです。管理者画面は主にデスクトップでの利用を想定しているため、対象外としています。

---

### Q2: タイポグラフィクラスを完全に削除して Tailwind クラスに置き換えるべきですか？

**A**: いいえ。既存のカスタムクラス（`.main-text`など）は維持し、内部で`@apply`を使ってレスポンシブ化する方針を推奨しています（方針A）。これにより変更箇所を最小限に抑え、リスクを低減できます。

---

### Q3: ヒーロー画像のサイズはどうすればよいですか？

**A**: Next.js の Image コンポーネントが自動的に最適化するため、元画像は高解像度（推奨: 1920x1080px以上）を用意してください。モバイル用に別画像を用意する必要はありません。

---

### Q4: ハンバーガーメニューのアイコンはどのライブラリを使いますか？

**A**: `lucide-react`の`Menu`アイコンを使用します（shadcn/uiの標準）。

---

### Q5: フッターのリンクは実際にどのページにリンクすべきですか？

**A**: 以下のページを想定しています：
- ホーム（`/`）
- お知らせ（`/information`）
- スケジュール（`/events`）
- 動画（`/videos`）
- ブログ（`/blog`）
- 会報（`/newsletters`）
- お問い合わせ（`/contact`）
- 利用規約（`/terms`）
- プライバシーポリシー（`/privacy`）
- 特定商取引法（`/legal`）

未実装のページがある場合は、実装後にリンクを追加してください。

---

### Q6: コンテナの`px-4`は狭すぎませんか？

**A**: iPhone SE（375px）で16pxのパディングは標準的です。Google Material Design でも推奨されている値です。必要に応じて`px-6`（24px）に調整可能です。

---

### Q7: テストはどこまで実施すればよいですか？

**A**: 最低限、以下のデバイスでテストしてください：
- iPhone SE（最小幅）
- iPad（タブレット）
- デスクトップ（1280px）

実機がない場合は、Chrome DevTools の Device Mode で代用可能です。

---

## 12. 変更履歴

| 日付 | バージョン | 変更内容 | 作成者 |
|------|-----------|---------|--------|
| 2025-11-09 | 1.0 | 初版作成 | Claude |

---

**最終更新**: 2025-11-09
**レビュアー**: -
**承認者**: -
