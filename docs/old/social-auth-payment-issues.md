# ソーシャルログイン登録フローの問題点と解決策

## 概要

現在の登録フローにおいて、ソーシャルログイン（Google/LINE）を使用した場合に、支払いとアカウントの連携に問題があります。

---

## 登録フローの流れ

```
/register/terms (規約同意)
  ↓
/register/plan (プラン選択)
  ↓
/register/auth (アカウント作成 - メール/Google/LINE)
  ↓
/register/payment (支払い手続き)
  ↓
Stripe Checkout → 支払い
  ↓
Webhook処理 → memberレコード更新
```

---

## 問題点

### 問題1: ソーシャルログインで memberレコードが作成されない

**メール登録の場合（正常）：**

```typescript
// register-auth-form.tsx
const signupResult = await authClient.signUp.email({...});
const userId = signupResult.data.user.id;

// ✅ memberレコードが作成される
const memberResult = await createMemberAfterSignup(
  userId,
  data.email,
  selectedPlanId ?? undefined
);
```

**ソーシャルログインの場合（問題あり）：**

```typescript
// register-auth-form.tsx
const handleGoogleSignup = async () => {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: "/register/payment", // 直接支払いページへ
    errorCallbackURL: "/register/auth",
  });
  // ❌ memberレコード作成処理がない
};
```

**影響：**
- memberレコードが存在しないため、Webhook処理でUPDATEが失敗
- 支払い完了しても会員情報が更新されない

---

### 問題2: RegistrationContextの状態がリダイレクトで失われる

**原因：**
- ソーシャルログインはOAuthリダイレクト（外部サイト経由）を使用
- リダイレクト後、ページが完全にリロードされる
- `RegistrationContext`（ローカルストレージベース）の状態がリセットされる可能性

**影響する状態：**
- `selectedPlanId` - 選択したプランID
- `termsAgreed` - 規約同意状態
- `userId` - ユーザーID
- `accountCreated` - アカウント作成完了フラグ

---

### 問題3: Webhook処理がmemberレコードの存在を前提としている

```typescript
// app/api/stripe/webhook/route.ts
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.client_reference_id || session.metadata?.userId;

  // ❌ UPDATE のみで INSERT がない
  await db
    .update(members)
    .set({
      paymentStatus: "completed",
      stripeSubscriptionId: subscriptionId,
      subscriptionStartDate: new Date(...),
      subscriptionEndDate: new Date(...),
    })
    .where(eq(members.userId, userId));
}
```

**影響：**
- memberレコードが存在しない場合、更新が行われない
- 支払いは完了しているが、システム上は未払い状態のまま

---

### 問題4: 支払いページでのセッション検証

```typescript
// app/api/stripe/create-checkout/route.ts
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // ...
}
```

**影響：**
- ソーシャルログイン直後にセッションが確立されていない場合、401エラー
- 支払い手続きが開始できない

---

## 解決策

### 解決策A: コールバックページを作成（推奨）

ソーシャルログイン後に中間ページを経由してmemberレコードを作成する。

**1. callbackURLにプランIDを含める**

```typescript
// register-auth-form.tsx
const handleGoogleSignup = async () => {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: `/register/callback?planId=${selectedPlanId}`,
    errorCallbackURL: "/register/auth",
  });
};
```

**2. コールバックページを作成**

```typescript
// app/[locale]/(auth)/register/callback/page.tsx
export default async function RegisterCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ planId?: string }>;
}) {
  const { planId } = await searchParams;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/register/auth");
  }

  // memberレコード作成
  await createMemberAfterSignup(
    session.user.id,
    session.user.email,
    planId ? parseInt(planId) : undefined
  );

  // 支払いページへリダイレクト
  redirect(`/register/payment?planId=${planId}`);
}
```

**3. 支払いページでURLパラメータからプランIDを取得**

```typescript
// payment-form.tsx
const searchParams = useSearchParams();
const planIdFromUrl = searchParams.get("planId");
const effectivePlanId = selectedPlanId || (planIdFromUrl ? parseInt(planIdFromUrl) : null);
```

---

### 解決策B: Better Auth の hooks を使用

Better Auth のサーバーサイドフックでソーシャルログイン完了時にmemberレコードを自動作成する。

```typescript
// lib/auth.ts
export const auth = betterAuth({
  // ...
  hooks: {
    after: [
      {
        matcher: (context) => context.path === "/callback/:provider",
        handler: async (context) => {
          const user = context.context.session?.user;
          if (user) {
            await createMemberAfterSignup(user.id, user.email);
          }
        },
      },
    ],
  },
});
```

**注意点：**
- プランIDをURLパラメータで渡す必要がある
- hooks内でリクエストパラメータにアクセスする方法を確認する必要あり

---

### 解決策C: Webhook処理でmemberレコードを自動作成

Webhook処理時にmemberレコードが存在しない場合は作成する。

```typescript
// app/api/stripe/webhook/route.ts
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.client_reference_id || session.metadata?.userId;
  const planId = session.metadata?.planId;
  const email = session.customer_email;

  // 既存のmemberレコードをチェック
  const existingMember = await db
    .select()
    .from(members)
    .where(eq(members.userId, userId))
    .limit(1);

  if (existingMember.length === 0) {
    // memberレコードが存在しない場合は作成
    await db.insert(members).values({
      id: crypto.randomUUID(),
      userId,
      email,
      planId: planId ? parseInt(planId) : null,
      paymentStatus: "completed",
      stripeSubscriptionId: subscriptionId,
      // ...
    });
  } else {
    // 既存の場合は更新
    await db.update(members)
      .set({
        paymentStatus: "completed",
        stripeSubscriptionId: subscriptionId,
        // ...
      })
      .where(eq(members.userId, userId));
  }
}
```

---

## 推奨される実装順序

### Phase 1: 即座に対応（Critical）

1. **解決策A**を実装 - コールバックページの作成
2. ソーシャルログインのcallbackURLを更新
3. 支払いページでURLパラメータからプランIDを取得

### Phase 2: 短期対応（High）

1. **解決策C**を実装 - Webhookでのフォールバック処理
2. 支払い成功ページでのセッション検証追加

### Phase 3: 中期対応（Medium）

1. RegistrationContextの状態永続化の改善
2. エラーハンドリングの強化
3. ログ・監視の追加

---

## 関連ファイル

| ファイル | 説明 |
|---------|------|
| `components/register/register-auth-form.tsx` | アカウント作成フォーム（ソーシャルログイン含む） |
| `components/register/payment-form.tsx` | 支払いフォーム |
| `app/api/stripe/create-checkout/route.ts` | Stripe Checkout作成API |
| `app/api/stripe/webhook/route.ts` | Stripe Webhookハンドラー |
| `actions/members/create-member.ts` | memberレコード作成関数 |
| `contexts/RegistrationContext.tsx` | 登録フロー状態管理 |
| `lib/auth.ts` | Better Auth設定 |
| `db/schemas/member.ts` | memberテーブルスキーマ |

---

## テスト項目

実装後に以下のシナリオをテストする：

1. **メール登録 → 支払い完了** - 既存フローが壊れていないことを確認
2. **Google登録 → 支払い完了** - memberレコードが作成され、支払いが連携されることを確認
3. **LINE登録 → 支払い完了** - 同上
4. **途中でブラウザを閉じた場合** - 再開できることを確認
5. **支払いキャンセル → 再試行** - 正常に処理されることを確認
