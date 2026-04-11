# アプリ内ブラウザ検出・標準ブラウザ誘導 仕様書

## 概要

QRコードからアプリ内ブラウザ(WebView)でサイトを開いた際に、URLをコピーして標準ブラウザで開き直すよう誘導する。
アプリ内ブラウザではCookie/セッションの制約があり、ログインや決済が正常に動作しない問題への対策。

## 背景・課題

- QRコードをスマートフォンで読み取ると、アプリ内ブラウザ(WebView)で開かれることがある
- WebViewではCookieがSafari/Chromeと共有されず、Better Authのセッションが維持できない
- 決済(Stripe)もWebView内では正常に動作しない場合がある
- 現状: `components/supporters/in-app-browser-notice.tsx` がサポーターズページのみに存在するが、User-Agent検出なし（常時表示）

## 対応方針

アプリ内ブラウザ(WebView)をUser-Agentで自動検出し、検出時のみダイアログを表示する。
どのアプリから開かれたかは区別せず、共通のメッセージでURLコピー→標準ブラウザで開く操作を案内する。

## 技術仕様

### 1. アプリ内ブラウザ(WebView)検出

User-Agent文字列からWebView環境であることを判定する。
アプリの種類は区別しない。

主な判定対象:

| 環境 | User-Agent に含まれる文字列 |
|------|---------------------------|
| iOS WebView | Safari を含まない UIWebView / WKWebView |
| Android WebView | `; wv)` |
| LINE, Instagram, Facebook, Twitter等 | `Line/`, `Instagram`, `FBAN`, `FBAV`, `Twitter` |

判定関数:

```typescript
function isInAppBrowser(): boolean {
  const ua = navigator.userAgent
  return /Line\/|Instagram|FBAN|FBAV|Twitter|; wv\)|WebView/i.test(ua)
}
```

### 2. 表示するダイアログの内容

構成要素:
- タイトル: 「Webブラウザで開いてください」
- 説明文: 「QRコードからのアクセスありがとうございます。このままではログインや会員登録が正常に動作しない場合があります。下のボタンでURLをコピーして、お使いのWebブラウザ（Safari、Chromeなど）で開き直してください。」
- URLコピーボタン: 現在のページURLをクリップボードにコピー（コピー成功時にトースト表示）
- 「このまま続ける」ボタン: ダイアログを閉じてそのまま閲覧（強制しない）

UI:
- shadcn/ui の `AlertDialog` を使用
- コピーボタンを目立たせる（primary）、「このまま続ける」は控えめ（ghost/outline）

### 3. 表示対象ページ

認証が必要なページ（プライベートルート）を中心に表示する。

| ページ種別 | 表示 | 理由 |
|-----------|------|------|
| ログインページ | する | ログイン処理がWebViewで失敗する |
| 会員登録ページ | する | 登録・決済処理がWebViewで失敗する |
| マイページ等の認証済みページ | する | セッション維持ができない |
| サポーターズページ | する | 既存の案内を置き換え |
| トップページ・公開ページ | しない | 閲覧のみなら問題なし |

判定ロジック:
- middleware.tsの `publicRoutes` に含まれないページ + ログイン/会員登録ページで表示
- または、全ページで検出し「ログイン・会員登録・決済時に問題が発生する可能性があります」と案内

### 4. コンポーネント構成

```
components/
  in-app-browser-dialog.tsx    ... 検出 + ダイアログ表示（新規）

※既存の components/supporters/in-app-browser-notice.tsx は
  新コンポーネントに置き換え後に削除
```

### 5. 配置場所

認証系レイアウト `app/[locale]/(auth)/layout.tsx` に配置する。
必要に応じて `(main)` レイアウトにも配置。

### 6. 状態管理

- sessionStorageで「閉じた」状態を保持し、同一セッション内では再表示しない
- キー: `in-app-browser-dialog-dismissed`

## 制約事項

- iOS ではWebページからSafariを直接起動するAPIが存在しない
- あくまで「ユーザーへの案内」であり、強制的な遷移はできない
- User-Agentは将来変更される可能性があるため、定期的な確認が必要
- Android の場合は Chrome Custom Tabs で開かれることがあり、こちらは問題が少ない

## 影響範囲

- 新規コンポーネント: `components/in-app-browser-dialog.tsx`
- 変更: `app/[locale]/(auth)/layout.tsx`（ダイアログ追加）
- 変更: `app/[locale]/(main)/layout.tsx`（必要に応じて）
- 削除: `components/supporters/in-app-browser-notice.tsx`（統合後）
