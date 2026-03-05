# スマホ表示対応 実装タスク一覧

## 📌 概要

[mobile-responsive-refactoring.md](./mobile-responsive-refactoring.md) で定義された要件に基づく、具体的な実装タスクの一覧です。

**作成日**: 2025-11-09
**総タスク数**: 26タスク
**総工数**: 7時間

---

## 🎯 フェーズ1: 基盤整備（最重要）

### グローバルスタイル修正

#### Task 1.1: コンテナのレスポンシブ化
**優先度**: 🔴 最高
**工数**: 0.5時間
**担当ファイル**: `app/globals.css`

**実装内容**:
```css
/* 現状（126-128行目） */
@utility container {
  @apply px-[60px];
}

/* 改修後 */
@utility container {
  @apply px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[60px];
}
```

**チェックリスト**:
- [ ] `app/globals.css`の126-128行目を修正
- [ ] ローカル環境で確認（ブラウザDevTools）
- [ ] iPhone SE（375px）で余白確認
- [ ] iPad（768px）で余白確認
- [ ] デスクトップ（1280px）で余白確認
- [ ] 横スクロールが発生しないことを確認

**注意事項**:
- 管理者画面への影響を確認
- 既存ページのレイアウト崩れがないか確認

---

#### Task 1.2: タイポグラフィのレスポンシブ化
**優先度**: 🔴 最高
**工数**: 0.5時間
**担当ファイル**: `app/theme/typography.css`

**実装内容**:

##### 1.2.1: `.header-text` の修正
```css
/* 現状（2-5行目） */
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

##### 1.2.2: `.main-text` の修正
```css
/* 現状（6-9行目） */
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

##### 1.2.3: `.view-all-text` の修正
```css
/* 現状（10-13行目） */
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

##### 1.2.4: `.date-text` の修正
```css
/* 現状（14-16行目） */
.date-text {
  font-size: 10px;
}

/* 改修後 */
.date-text {
  @apply text-[10px] md:text-xs;
}
```

##### 1.2.5: `.contents-title` の修正
```css
/* 現状（17-19行目） */
.contents-title {
  font-size: 14px;
}

/* 改修後 */
.contents-title {
  @apply text-sm md:text-base;
}
```

##### 1.2.6: `.calendar-card-title` の修正
```css
/* 現状（36-38行目） */
.calendar-card-title {
  font-size: 16px;
}

/* 改修後 */
.calendar-card-title {
  @apply text-sm md:text-base;
}
```

##### 1.2.7: `.link-title` の修正
```css
/* 現状（39-41行目） */
.link-title {
  font-size: 14px;
}

/* 改修後 */
.link-title {
  @apply text-xs md:text-sm;
}
```

**チェックリスト**:
- [ ] 全7つのクラスを修正
- [ ] ローカル環境でビルド確認
- [ ] ホームページでフォントサイズ確認
- [ ] スマホ（375px）で可読性確認
- [ ] タブレット（768px）で可読性確認
- [ ] デスクトップ（1280px）で可読性確認

**注意事項**:
- カードテキスト（`.month-card-text`等）は後で調整（Task 2.1と連動）

---

### ヘッダーコンポーネント改修

#### Task 1.3: ハンバーガーメニュー実装
**優先度**: 🔴 最高
**工数**: 2.0時間
**担当ファイル**: `components/header/header.tsx`

**実装内容**:

##### 1.3.1: 必要なコンポーネントのインポート
```tsx
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
```

##### 1.3.2: ヘッダー高さの調整
```tsx
// 現状（31行目）
<div className="container max-w-full flex h-[140px] items-center justify-between">

// 改修後
<div className="container max-w-full flex h-[80px] md:h-[140px] items-center justify-between">
```

##### 1.3.3: ロゴサイズの調整
```tsx
// 現状（33-39行目）
<Image
  src={logo}
  alt=""
  width={100}
  height={100}
  placeholder="blur"
  className="dark:brightness-[0.2] dark:grayscale"
/>

// 改修後
<Image
  src={logo}
  alt=""
  width={60}
  height={60}
  placeholder="blur"
  className="md:w-[100px] md:h-[100px] dark:brightness-[0.2] dark:grayscale"
/>
```

##### 1.3.4: モバイルメニューの実装
```tsx
{/* モバイル: ハンバーガーメニュー */}
<div className="md:hidden">
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="ghost" size="icon" aria-label="メニューを開く">
        <Menu className="h-6 w-6" />
      </Button>
    </SheetTrigger>
    <SheetContent side="right" className="w-[300px]">
      <nav className="flex flex-col gap-4 mt-8">
        <Link href="/" className="text-base font-medium hover:underline">
          {t("home")}
        </Link>
        <Link href="/information" className="text-base font-medium hover:underline">
          {t("information")}
        </Link>
        <Link href="/events" className="text-base font-medium hover:underline">
          {t("schedule")}
        </Link>
        <Link href="/videos" className="text-base font-medium hover:underline">
          {t("video")}
        </Link>
        <Link href="/blog" className="text-base font-medium hover:underline">
          {t("blog")}
        </Link>
        <Link href="/newsletters" className="text-base font-medium hover:underline">
          {t("newsletters")}
        </Link>
        <Link href="/contact" className="text-base font-medium hover:underline">
          {t("contact")}
        </Link>

        <Separator className="my-2" />

        {/* SNSアイコン */}
        <div className="flex gap-4 justify-center">
          <Image src={xBlack} alt="X (Twitter)" height={24} width={24} />
          <Image src={instagramBlack} alt="Instagram" height={24} width={24} />
          <Image src={youtubeBlack} alt="YouTube" height={24} width={24} />
          <Image src={tiktokBlack} alt="TikTok" height={24} width={24} />
        </div>

        <Separator className="my-2" />

        {/* ログイン/ログアウトボタン */}
        {session?.user ? (
          <>
            <Link href="/mypage" className="w-full">
              <Button variant="outline" className="w-full min-h-11">
                <User className="h-4 w-4 mr-2" />
                {t("mypage")}
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full min-h-11"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t("logout")}
            </Button>
          </>
        ) : (
          <>
            <Link href="/signup" className="w-full">
              <Button className="w-full min-h-11 bg-brand">
                {t("joinUs")}
              </Button>
            </Link>
            <Link href="/login" className="w-full">
              <Button variant="outline" className="w-full min-h-11 border-brand">
                {t("login")}
              </Button>
            </Link>
          </>
        )}
      </nav>
    </SheetContent>
  </Sheet>
</div>
```

##### 1.3.5: デスクトップメニューの非表示制御
```tsx
{/* デスクトップ: 従来の水平メニュー */}
<div className="hidden md:flex md:flex-col md:flex-1">
  {/* 既存の構造を維持 */}
  <div className="flex gap-6 h-[70px] items-center justify-end">
    {/* ... */}
  </div>
  <div className="flex gap-6 h-[70px] items-center justify-end">
    {/* ... */}
  </div>
</div>
```

**チェックリスト**:
- [ ] Sheet コンポーネントのインポート
- [ ] ヘッダー高さの調整
- [ ] ロゴサイズの調整
- [ ] ハンバーガーメニューの実装
- [ ] メニュー内リンクの実装
- [ ] SNSアイコンの配置
- [ ] ログイン/ログアウトボタンの実装
- [ ] デスクトップメニューの非表示制御（`hidden md:flex`）
- [ ] スマホでメニューの開閉確認
- [ ] タブレットで水平メニュー表示確認
- [ ] デスクトップで水平メニュー表示確認
- [ ] キーボード操作確認（Escでメニュー閉じる）
- [ ] アクセシビリティ確認（aria-label等）

**注意事項**:
- メニューを閉じるロジックはSheetコンポーネントが自動で処理
- リンククリック時にメニューを閉じる場合は、状態管理を追加

---

#### Task 1.4: フェーズ1のテスト
**優先度**: 🔴 最高
**工数**: 0.5時間

**テスト項目**:
- [ ] iPhone SE（375px）でページ表示確認
- [ ] ハンバーガーメニューの開閉
- [ ] メニュー内のリンククリック
- [ ] コンテナパディングの確認
- [ ] フォントサイズの可読性確認
- [ ] iPad（768px）で表示確認
- [ ] デスクトップ（1280px）で表示確認
- [ ] 管理者画面の表示確認（レイアウト崩れなし）
- [ ] ブラウザコンソールエラーなし
- [ ] ビルドエラーなし

---

## 🎯 フェーズ2: コンテンツ最適化（重要）

### コンテンツカード修正

#### Task 2.1: スケジュールカードのレスポンシブ化
**優先度**: 🟡 高
**工数**: 0.5時間
**担当ファイル**: `components/shedule/card.tsx`

**実装内容**:

##### 2.1.1: カード全体の幅調整
```tsx
// 現状（29行目）
<div className="flex max-w-[342px] rounded-[25px] shadow-md overflow-hidden">

// 改修後
<div className="flex w-full max-w-full sm:max-w-[342px] rounded-[25px] shadow-md overflow-hidden">
```

##### 2.1.2: 左カラム（日付）の調整
```tsx
// 現状（30行目）
<div className="bg-brand h-[192px] w-[100px] flex flex-col items-center pt-4">

// 改修後
<div className="bg-brand h-[150px] sm:h-[192px] w-[80px] sm:w-[100px] flex flex-col items-center pt-3 sm:pt-4">
```

##### 2.1.3: 月・日・曜日のテキストサイズ調整
```tsx
// 現状（31-33行目）
<div className="month-card-text">{month}</div>
<div className="day-card-text">{day}</div>
<div className="week-card-text">[{weekDay}]</div>

// 改修後
<div className="month-card-text text-lg sm:text-2xl">{month}</div>
<div className="day-card-text text-2xl sm:text-[32px]">{day}</div>
<div className="week-card-text text-[10px] sm:text-xs">[{weekDay}]</div>
```

##### 2.1.4: 右カラム（コンテンツ）の調整
```tsx
// 現状（35行目）
<div className="bg-white h-[192px] w-[242px] flex flex-col p-4 gap-[10px]">

// 改修後
<div className="bg-white h-[150px] sm:h-[192px] flex-1 sm:w-[242px] flex flex-col p-3 sm:p-4 gap-2 sm:gap-[10px]">
```

##### 2.1.5: 画像サイズの調整
```tsx
// 現状（39-44行目）
<Image
  src={imageUrl}
  alt={title}
  width={210}
  height={100}
  className="object-cover"
/>

// 改修後
<Image
  src={imageUrl}
  alt={title}
  width={210}
  height={80}
  className="object-cover sm:h-[100px]"
/>
```

**チェックリスト**:
- [ ] カード全体の幅を`w-full max-w-full sm:max-w-[342px]`に変更
- [ ] 左カラムの幅・高さをレスポンシブ化
- [ ] テキストサイズをレスポンシブ化
- [ ] 右カラムを`flex-1`で可変幅に
- [ ] 画像サイズを調整
- [ ] スマホ（375px）でカード表示確認
- [ ] タブレット（768px）でカード表示確認
- [ ] デスクトップ（1280px）でカード表示確認
- [ ] カードがコンテナからはみ出さないことを確認

---

### フッターコンポーネント改修

#### Task 2.2: フッターレイアウトのレスポンシブ化
**優先度**: 🟡 高
**工数**: 1.0時間
**担当ファイル**: `components/footer/footer.tsx`

**実装内容**:

##### 2.2.1: リンク配列の定義
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
    { label: "特定商取引法", href: "/legal" },
  ];
```

##### 2.2.2: フッター全体の余白調整
```tsx
// 現状（12行目）
<footer className="w-full border-t bg-background mt-32">

// 改修後
<footer className="w-full border-t bg-background mt-16 md:mt-32">
```

##### 2.2.3: 上部パディングの調整
```tsx
// 現状（13行目）
<div className="pt-[50px]">

// 改修後
<div className="pt-8 md:pt-[50px]">
```

##### 2.2.4: SNSアイコンセクションの調整
```tsx
// 現状（14行目）
<div className="flex gap-4 items-center justify-center max-w-full px-0 mb-[32px]">

// 改修後
<div className="flex gap-4 items-center justify-center mb-6 md:mb-8">
```

##### 2.2.5: リンクセクションのレスポンシブ化
```tsx
// 現状（20行目）
<div className="flex flex-wrap gap-[48px] items-center justify-center max-w-full px-[92px] mb-[50px]">
  <div className="header-text whitespace-nowrap">お支払い</div>
  {/* ... 13個の「お支払い」 */}
</div>

// 改修後
<div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-4 md:gap-12 items-center justify-center px-4 md:px-[92px] mb-8 md:mb-[50px]">
  {links.map((link, index) => (
    <Link
      key={index}
      href={link.href}
      className="header-text whitespace-nowrap hover:underline transition-colors"
    >
      {link.label}
    </Link>
  ))}
</div>
```

##### 2.2.6: コピーライトセクションの調整
```tsx
// 現状（35行目）
<div className="flex flex-col md:flex-row gap-4 items-center justify-center max-w-full">
  <div className="header-text whitespace-nowrap py-[16px]">
    ©️IK ALUMNI CGT
  </div>
</div>

// 改修後
<div className="flex justify-center pb-4 md:pb-0">
  <div className="header-text py-4">
    ©️IK ALUMNI CGT
  </div>
</div>
```

**チェックリスト**:
- [ ] リンク配列を定義（実際のページへのリンク）
- [ ] フッター上部余白をレスポンシブ化
- [ ] 内部パディングをレスポンシブ化
- [ ] SNSアイコン下余白をレスポンシブ化
- [ ] リンクをグリッド→フレックスのレスポンシブレイアウトに
- [ ] コピーライトセクションを簡略化
- [ ] スマホでグリッド2列表示確認
- [ ] タブレットでグリッド3列表示確認
- [ ] デスクトップでフレックス表示確認
- [ ] 全リンクがクリック可能であることを確認

**注意事項**:
- `/terms`, `/privacy`, `/legal` ページが未実装の場合は後で作成
- リンク配列は必要に応じて調整可能

---

### ホームページレイアウト改修

#### Task 2.3: ホームページのレスポンシブ化
**優先度**: 🟡 高
**工数**: 0.5時間
**担当ファイル**: `app/[locale]/(main)/page.tsx`

**実装内容**:

##### 2.3.1: ヒーローセクションの調整
```tsx
// 現状（19行目）
<div className="relative w-full h-screen -mt-35 mb-32">

// 改修後
<div className="relative w-full h-[50vh] sm:h-[70vh] md:h-screen -mt-20 md:-mt-35 mb-16 md:mb-32">
```

##### 2.3.2: Informationセクションの余白調整
```tsx
// 現状（29行目）
<div className="mb-32">
  <InformationContents />
</div>

// 改修後
<div className="mb-16 md:mb-32">
  <InformationContents />
</div>
```

##### 2.3.3: Scheduleセクションの余白調整
```tsx
// 現状（32行目）
<div className="mb-32">
  <ScheduleContents />
</div>

// 改修後
<div className="mb-16 md:mb-32">
  <ScheduleContents />
</div>
```

##### 2.3.4: Videoセクションの余白調整
```tsx
// 現状（35行目）
<div className="mb-32">
  <VideoContents />
</div>

// 改修後
<div className="mb-16 md:mb-32">
  <VideoContents />
</div>
```

##### 2.3.5: Blog・Newsletterグリッドの調整
```tsx
// 現状（38行目）
<div className="grid grid-cols-1 md:grid-cols-2 gap-15 mb-32">

// 改修後
<div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-15 mb-16 md:mb-32">
```

**チェックリスト**:
- [ ] ヒーローセクションの高さをレスポンシブ化
- [ ] ヒーローセクションの上マージン調整
- [ ] 全セクションの下マージンをレスポンシブ化（4箇所）
- [ ] グリッドのギャップをレスポンシブ化
- [ ] スマホでヒーロー画像の高さ確認（50vh）
- [ ] タブレットでヒーロー画像の高さ確認（70vh）
- [ ] デスクトップでヒーロー画像の高さ確認（100vh）
- [ ] セクション間隔が適切であることを確認

---

#### Task 2.4: フェーズ2のテスト
**優先度**: 🟡 高
**工数**: 0.5時間

**テスト項目**:
- [ ] ホームページ全体の表示確認（スマホ、タブレット、デスクトップ）
- [ ] スケジュールカードの表示確認（3デバイス）
- [ ] フッターリンクの表示確認（3デバイス）
- [ ] フッターリンクのクリック確認
- [ ] ヒーローセクションの高さ確認（3デバイス）
- [ ] セクション間隔の確認
- [ ] 横スクロール発生しないことを確認
- [ ] ブラウザコンソールエラーなし

---

## 🎯 フェーズ3: 最適化・仕上げ（推奨）

### 細かい調整

#### Task 3.1: コンテンツヘッダーの配置改善
**優先度**: 🟢 中
**工数**: 0.25時間
**担当ファイル**: `components/contents/contents-header.tsx`

**実装内容**:
```tsx
// 現状（3-6行目）
<div className="flex justify-between items-center w-full">
  <div className="main-text">{title}</div>
  <div className="view-all-text">VIEW ALL</div>
</div>

// 改修後
<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-2">
  <div className="main-text">{title}</div>
  <div className="view-all-text">VIEW ALL</div>
</div>
```

**チェックリスト**:
- [ ] スマホで縦並び表示確認
- [ ] タブレット以上で横並び表示確認
- [ ] ギャップが適切であることを確認

---

#### Task 3.2: マイページの余白調整
**優先度**: 🟢 中
**工数**: 0.25時間
**担当ファイル**: `app/[locale]/(main)/mypage/page.tsx`

**実装内容**:

##### 3.2.1: コンテナパディングの調整
```tsx
// 現状（20行目）
<div className="container py-6">

// 改修後
<div className="container py-4 md:py-6">
```

##### 3.2.2: タイトルサイズの調整
```tsx
// 現状（21行目）
<h1 className="text-2xl font-bold mb-6">マイページ</h1>

// 改修後
<h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">マイページ</h1>
```

**チェックリスト**:
- [ ] パディング調整確認
- [ ] タイトルサイズ確認（スマホ、デスクトップ）
- [ ] 下マージン確認

---

#### Task 3.3: ボタンのタッチフレンドリー化（オプション）
**優先度**: 🟢 低
**工数**: 0.5時間
**担当ファイル**: 複数のフォームコンポーネント

**実装内容**:

##### 3.3.1: ログインフォームのボタン
**ファイル**: `components/login-form/login-form.tsx`

```tsx
// 現状（84行目）
<Button type="submit" className="w-full" disabled={isLoading}>

// 改修後
<Button type="submit" className="w-full min-h-11" disabled={isLoading}>
```

##### 3.3.2: 登録フォームのボタン
**ファイル**: `components/register/register-auth-form.tsx`

```tsx
// 全てのButtonに `min-h-11` を追加
<Button type="submit" className="flex-1 min-h-11" disabled={isSubmitting}>
<Button type="button" variant="outline" className="flex-1 min-h-11">
```

##### 3.3.3: プラン選択フォームのボタン
**ファイル**: `components/register/plan-selection-form.tsx`

```tsx
// 全てのButtonに `min-h-11` を追加
<Button type="submit" disabled={isLoading} className="min-h-11">
<Button type="button" variant="outline" className="min-h-11">
```

**対象ファイル一覧**:
1. `components/login-form/login-form.tsx`
2. `components/register/register-auth-form.tsx`
3. `components/register/plan-selection-form.tsx`
4. `components/register/terms-agreement-form.tsx`（存在する場合）
5. `components/profile/profile-complete-form.tsx`（存在する場合）

**チェックリスト**:
- [ ] 全フォームボタンに`min-h-11`を追加
- [ ] スマホでボタンのタップしやすさ確認
- [ ] ボタンサイズが44px以上であることを確認
- [ ] デスクトップでレイアウト崩れがないことを確認

---

#### Task 3.4: フェーズ3のテスト
**優先度**: 🟢 中
**工数**: 0.5時間

**テスト項目**:
- [ ] コンテンツヘッダーの配置確認（スマホ、タブレット）
- [ ] マイページの表示確認（スマホ、デスクトップ）
- [ ] 全フォームボタンのタップ確認（スマホ）
- [ ] ボタンサイズ測定（DevToolsで44px以上）
- [ ] 全体的なUX確認

---

## 🧪 最終テスト・検証

### Task 4.1: デバイステスト
**優先度**: 🔴 最高
**工数**: 0.5時間

**テストデバイス**:
- [ ] iPhone SE（375px × 667px）
- [ ] iPhone 14 Pro（393px × 852px）
- [ ] iPad（768px × 1024px）
- [ ] デスクトップ（1280px × 1024px）
- [ ] 大型デスクトップ（1920px × 1080px）

**テスト方法**:
- Chrome DevTools Device Mode
- Safari Responsive Design Mode
- 実機テスト（可能であれば）

**全ページテスト**:
1. [ ] ホームページ（`/`）
2. [ ] お知らせ一覧（`/information`）
3. [ ] スケジュール一覧（`/events`）
4. [ ] 動画一覧（`/videos`）
5. [ ] ブログ一覧（`/blog`）
6. [ ] ログインページ（`/login`）
7. [ ] 会員登録ページ（`/signup`、`/register/*`）
8. [ ] マイページ（`/mypage`）

---

### Task 4.2: ブラウザ互換性テスト
**優先度**: 🟡 高
**工数**: 0.5時間

**テストブラウザ**:
- [ ] Safari (iOS) - iPhone実機またはシミュレータ
- [ ] Chrome (Android) - エミュレータまたは実機
- [ ] Chrome (Desktop) - 最新版
- [ ] Safari (macOS) - 最新版
- [ ] Firefox (Desktop) - 最新版（推奨）
- [ ] Edge (Desktop) - 最新版（推奨）

**確認項目**:
- [ ] レイアウト崩れなし
- [ ] ハンバーガーメニューの動作
- [ ] フォントの表示
- [ ] 画像の表示
- [ ] リンクのクリック
- [ ] フォーム送信

---

### Task 4.3: パフォーマンステスト
**優先度**: 🟢 中
**工数**: 0.5時間

**測定ツール**:
- Lighthouse（Chrome DevTools）
- WebPageTest（https://www.webpagetest.org/）

**測定項目**:
- [ ] 初回ロード時間 < 3秒
- [ ] ページ遷移 < 1秒
- [ ] CLS（Cumulative Layout Shift） < 0.1
- [ ] LCP（Largest Contentful Paint） < 2.5秒
- [ ] FID（First Input Delay） < 100ms

**最適化項目**（必要に応じて）:
- [ ] 画像の最適化（Next.js Imageで自動）
- [ ] フォントのプリロード
- [ ] 不要なJavaScriptの削減

---

### Task 4.4: アクセシビリティテスト
**優先度**: 🟡 高
**工数**: 0.5時間

**テストツール**:
- axe DevTools（Chrome拡張）
- Lighthouse Accessibility（Chrome DevTools）
- キーボードナビゲーション（手動）

**確認項目**:
- [ ] ハンバーガーメニューにaria-labelがある
- [ ] フォーカストラップが正常に動作
- [ ] Escキーでメニューが閉じる
- [ ] Tabキーでフォーカス移動が正常
- [ ] コントラスト比が十分（WCAG AA準拠）
- [ ] スクリーンリーダー対応（可能であれば）

---

## 📝 ドキュメント更新

### Task 5.1: CLAUDE.md の更新
**優先度**: 🟡 高
**工数**: 0.25時間
**担当ファイル**: `CLAUDE.md`

**追加内容**:
```markdown
## スマホ表示対応

### 対応状況
- ✅ ユーザー向けページのレスポンシブ対応完了（2025-11-09）
- ✅ ハンバーガーメニュー実装
- ✅ グローバルスタイルのレスポンシブ化
- ✅ タイポグラフィのレスポンシブ化

### 対応デバイス
- モバイル（375px～）
- タブレット（768px～）
- デスクトップ（1280px～）

### 詳細ドキュメント
- [スマホ表示対応 要件定義](./docs/mobile-responsive-refactoring.md)
- [実装タスク一覧](./docs/mobile-responsive-implementation-tasks.md)
```

**チェックリスト**:
- [ ] スマホ対応セクションを追加
- [ ] 対応状況を記載
- [ ] 関連ドキュメントへのリンクを追加

---

### Task 5.2: レスポンシブデザインガイドの作成（オプション）
**優先度**: 🟢 低
**工数**: 1.0時間
**担当ファイル**: `docs/responsive-design-guide.md`（新規）

**作成内容**:
1. ブレークポイント定義
2. コンポーネントパターン
3. ベストプラクティス
4. コーディング規約

**チェックリスト**:
- [ ] ブレークポイント一覧を記載
- [ ] よく使うパターンを記載
- [ ] 例示コード付き
- [ ] 注意事項を記載

---

## 📊 タスクサマリー

### フェーズ別タスク数

| フェーズ | タスク数 | 工数 | 優先度 |
|---------|---------|------|--------|
| フェーズ1 | 4 | 3.5h | 🔴 最高 |
| フェーズ2 | 4 | 2.5h | 🟡 高 |
| フェーズ3 | 4 | 1.5h | 🟢 中 |
| テスト | 4 | 2.0h | 🔴 最高 |
| ドキュメント | 2 | 1.25h | 🟡 高 |
| **合計** | **18** | **10.75h** | - |

### 優先度別タスク数

| 優先度 | タスク数 | 工数 |
|--------|---------|------|
| 🔴 最高 | 6 | 5.5h |
| 🟡 高 | 7 | 3.75h |
| 🟢 中/低 | 5 | 1.5h |
| **合計** | **18** | **10.75h** |

---

## ✅ タスク実行チェックリスト

### 準備
- [ ] ブランチ作成（`feature/mobile-responsive`）
- [ ] 要件定義の再確認
- [ ] 開発環境の起動

### フェーズ1（必須）
- [ ] Task 1.1: コンテナのレスポンシブ化
- [ ] Task 1.2: タイポグラフィのレスポンシブ化
- [ ] Task 1.3: ハンバーガーメニュー実装
- [ ] Task 1.4: フェーズ1のテスト

### フェーズ2（重要）
- [ ] Task 2.1: スケジュールカードのレスポンシブ化
- [ ] Task 2.2: フッターレイアウトのレスポンシブ化
- [ ] Task 2.3: ホームページのレスポンシブ化
- [ ] Task 2.4: フェーズ2のテスト

### フェーズ3（推奨）
- [ ] Task 3.1: コンテンツヘッダーの配置改善
- [ ] Task 3.2: マイページの余白調整
- [ ] Task 3.3: ボタンのタッチフレンドリー化
- [ ] Task 3.4: フェーズ3のテスト

### 最終テスト
- [ ] Task 4.1: デバイステスト
- [ ] Task 4.2: ブラウザ互換性テスト
- [ ] Task 4.3: パフォーマンステスト
- [ ] Task 4.4: アクセシビリティテスト

### ドキュメント
- [ ] Task 5.1: CLAUDE.md の更新
- [ ] Task 5.2: レスポンシブデザインガイドの作成（オプション）

### リリース準備
- [ ] 全テスト合格確認
- [ ] ビルドエラーなし確認
- [ ] コミット・プッシュ
- [ ] プルリクエスト作成
- [ ] コードレビュー依頼

---

## 🚀 実装開始手順

### 1. ブランチ作成
```bash
git checkout develop
git pull origin develop
git checkout -b feature/mobile-responsive
```

### 2. 開発環境起動
```bash
npm run dev
```

### 3. タスク実行
- フェーズ1から順に実行
- 各タスク完了後にコミット
- こまめにテスト

### 4. コミットメッセージ例
```bash
git commit -m "feat: グローバルコンテナのレスポンシブ化"
git commit -m "feat: タイポグラフィのレスポンシブ化"
git commit -m "feat: ハンバーガーメニュー実装"
git commit -m "feat: スケジュールカードのレスポンシブ化"
git commit -m "feat: フッターのレスポンシブ化"
git commit -m "feat: ホームページのレスポンシブ化"
git commit -m "test: モバイルレスポンシブテスト完了"
git commit -m "docs: CLAUDE.md更新（スマホ対応完了）"
```

### 5. プルリクエスト
```bash
git push origin feature/mobile-responsive
```

その後、GitHubでプルリクエストを作成

---

## 📞 問題発生時の対応

### よくある問題と解決策

#### 問題1: Sheetコンポーネントがインポートできない
**原因**: shadcn/uiのSheetがインストールされていない
**解決策**:
```bash
npx shadcn@latest add sheet
npx shadcn@latest add separator
```

#### 問題2: タイポグラフィクラスが効かない
**原因**: Tailwindの`@apply`が認識されていない
**解決策**:
- ビルドを再起動（`npm run dev`を停止して再起動）
- キャッシュクリア（`.next`フォルダを削除）

#### 問題3: 管理者画面のレイアウトが崩れた
**原因**: グローバルスタイルの影響
**解決策**:
- 管理者画面で`container`クラスを使用している箇所を確認
- `!px-8`などでオーバーライド

#### 問題4: モバイルでフォントが小さすぎる/大きすぎる
**原因**: レスポンシブサイズの調整不足
**解決策**:
- `typography.css`のサイズを微調整
- 例: `text-sm md:text-base` → `text-base md:text-lg`

---

## 📚 参考リンク

- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [shadcn/ui Sheet Component](https://ui.shadcn.com/docs/components/sheet)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Apple Human Interface Guidelines - Touch Targets](https://developer.apple.com/design/human-interface-guidelines/layout#iOS-iPadOS)
- [WCAG 2.1 Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**最終更新**: 2025-11-09
**作成者**: Claude
**レビュアー**: -
