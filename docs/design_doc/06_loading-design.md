# 06_ローディング設計

**プロジェクト**: IK ALUMNI CGT サポーターズクラブ会員サイト
**作成日**: 2026-03-08
**バージョン**: 1.0

---

## 目次

1. [概要](#1-概要)
2. [デザイン仕様](#2-デザイン仕様)
3. [共通コンポーネント](#3-共通コンポーネント)
4. [loading.tsx 配置一覧](#4-loadingtsx-配置一覧)
5. [既存のローディング実装](#5-既存のローディング実装)

---

## 1. 概要

ページ遷移時のローディング UI を全ページ共通で提供する。
Next.js App Router の `loading.tsx` を使用し、ルートレベルおよび各セグメントレベルに配置する。

### 方針

- 共通の `LoadingSpinner` コンポーネントを使用
- 赤いスピナー + 「読み込み中...」テキスト
- 既存の Suspense fallback は変更しない（個別実装を維持）

---

## 2. デザイン仕様

### ビジュアル

- スピナー: CSS border による円形回転アニメーション
- 色: `border-red-500`（赤）
- サイズ: w-10 h-10（40x40px）
- テキスト: 「読み込み中...」（`text-sm text-muted-foreground`）
- 配置: 画面の縦方向50%の高さで中央配置

### レイアウト

```
+----------------------------------+
|                                  |
|                                  |
|           [スピナー]              |
|          読み込み中...            |
|                                  |
|                                  |
+----------------------------------+
```

---

## 3. 共通コンポーネント

**ファイル**: `components/ui/loading-spinner.tsx`

```tsx
export function LoadingSpinner() {
  return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />
        <p className="text-sm text-muted-foreground">読み込み中...</p>
      </div>
    </div>
  );
}
```

---

## 4. loading.tsx 配置一覧

全箇所で同一の実装を使用する。

```tsx
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function Loading() {
  return <LoadingSpinner />;
}
```

| No. | パス | 対象セグメント | 説明 |
|-----|------|---------------|------|
| 1 | `app/[locale]/loading.tsx` | ルート | 全ページ共通のフォールバック |
| 2 | `app/[locale]/(auth)/loading.tsx` | (auth) | 認証関連ページ（ログイン、登録等） |
| 3 | `app/[locale]/(main)/loading.tsx` | (main) | メインコンテンツページ |
| 4 | `app/[locale]/(marketing)/loading.tsx` | (marketing) | マーケティングページ |
| 5 | `app/[locale]/(standalone)/loading.tsx` | (standalone) | スタンドアロンページ |
| 6 | `app/[locale]/admin/loading.tsx` | admin | 管理画面 |
| 7 | `app/[locale]/officer/loading.tsx` | officer | 役員画面 |
| 8 | `app/[locale]/goods/loading.tsx` | goods | グッズ関連ページ |

---

## 5. 既存のローディング実装

以下の既存実装は変更せず、そのまま維持する。

| ファイル | 方式 | 表示内容 |
|---------|------|---------|
| `app/[locale]/(auth)/login/page.tsx` | Suspense fallback | `<div>Loading...</div>` |
| `app/[locale]/(auth)/migrate-login/page.tsx` | Suspense fallback | `<div>Loading...</div>` |
| `app/[locale]/(auth)/reset-password/page.tsx` | Suspense fallback | `<div>Loading...</div>` |
| `app/[locale]/(auth)/forgot-password/page.tsx` | Suspense fallback | `<div>Loading...</div>` |
| `app/[locale]/(auth)/register/payment/page.tsx` | Suspense fallback | Loader2 スピナー（Card内） |
| `app/[locale]/admin/accounts/page.tsx` | Suspense | fallback なし |
| `app/[locale]/officer/members/page.tsx` | Suspense fallback | 「読み込み中...」テキスト |
| `app/[locale]/goods/thank-you/goods-thank-you-content.tsx` | 状態管理 | CSS スピナー（赤）+ 全画面オーバーレイ |
