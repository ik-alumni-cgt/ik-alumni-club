"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { authClient } from "@/lib/auth-client";
import { checkMigratedUser } from "@/actions/members/check-migrated-user";
import { setMigratedUserPassword } from "@/actions/members/set-migrated-user-password";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { AlertCircle, KeyRound } from "lucide-react";

function LineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        d="M12 2C6.48 2 2 5.82 2 10.5c0 4.12 3.52 7.57 8.26 8.35.32.07.76.21.87.48.1.25.06.63.03.88l-.14.84c-.04.25-.2.99.87.54s5.77-3.4 7.87-5.82C21.67 13.64 22 12.11 22 10.5 22 5.82 17.52 2 12 2zm-3.5 11.5h-2a.5.5 0 01-.5-.5v-4a.5.5 0 011 0v3.5h1.5a.5.5 0 010 1zm2 0a.5.5 0 01-.5-.5v-4a.5.5 0 011 0v4a.5.5 0 01-.5.5zm4.5 0h-2a.5.5 0 01-.5-.5v-4a.5.5 0 011 0v3.5h1.5a.5.5 0 010 1zm3-2.5a.5.5 0 010 1h-1.5v1h1.5a.5.5 0 010 1h-2a.5.5 0 01-.5-.5v-4a.5.5 0 01.5-.5h2a.5.5 0 010 1h-1.5v1h1.5z"
        fill="#06C755"
      />
    </svg>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

type Step = "email" | "options" | "set-password";

export function MigratedUserLoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isLineLoading, setIsLineLoading] = useState(false);
  const [isSettingPassword, setIsSettingPassword] = useState(false);

  // メールアドレス確認
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await checkMigratedUser(email);

      if (!result.success) {
        setError("確認中にエラーが発生しました。もう一度お試しください。");
        return;
      }

      if (!result.userExists) {
        setError("このメールアドレスは登録されていません。");
        return;
      }

      if (!result.isMigrated) {
        // 通常ユーザーの場合は通常のログインページへ
        router.push(`/login?email=${encodeURIComponent(email)}`);
        return;
      }

      // 移行ユーザーの場合はオプション画面へ
      setStep("options");
    } catch (error) {
      console.error("確認エラー:", error);
      setError("確認中にエラーが発生しました。");
    } finally {
      setIsLoading(false);
    }
  };

  // パスワード設定
  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // バリデーション
    if (password.length < 8) {
      setError("パスワードは8文字以上で入力してください。");
      return;
    }

    if (password !== confirmPassword) {
      setError("パスワードが一致しません。");
      return;
    }

    setIsSettingPassword(true);

    try {
      const result = await setMigratedUserPassword(email, password);

      if (!result.success) {
        setError(result.error || "パスワードの設定に失敗しました。");
        return;
      }

      // パスワード設定成功後、自動でログイン
      await authClient.signIn.email({
        email,
        password,
      });

      router.push("/mypage");
    } catch (error) {
      console.error("パスワード設定エラー:", error);
      setError("パスワードの設定に失敗しました。");
    } finally {
      setIsSettingPassword(false);
    }
  };

  // Googleログイン
  const handleGoogleLogin = async () => {
    setError("");
    setIsGoogleLoading(true);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/mypage",
        errorCallbackURL: "/migrate-login",
      });
    } catch (error) {
      console.error("Googleログインエラー:", error);
      setError("Googleでのログインに失敗しました");
      setIsGoogleLoading(false);
    }
  };

  // LINEログイン
  const handleLineLogin = async () => {
    setError("");
    setIsLineLoading(true);

    try {
      // 移行ユーザーのメールアドレスをコールバックURLに含める
      const callbackURL = `/migrate-login/callback?email=${encodeURIComponent(email)}`;

      await authClient.signIn.oauth2({
        providerId: "line",
        callbackURL,
        errorCallbackURL: "/migrate-login",
      });
    } catch (error) {
      console.error("LINEログインエラー:", error);
      setError("LINEでのログインに失敗しました");
      setIsLineLoading(false);
    }
  };

  // Step 1: メールアドレス入力
  if (step === "email") {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle>移行ユーザーログイン</CardTitle>
            <CardDescription>
              旧システムからの移行ユーザー向けのログインページです。
              登録済みのメールアドレスを入力してください。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid gap-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="w-full min-h-11"
                disabled={isLoading}
              >
                {isLoading ? "確認中..." : "次へ"}
              </Button>

              <div className="text-center text-sm">
                <Link
                  href="/login"
                  className="underline underline-offset-4 text-muted-foreground hover:text-primary"
                >
                  通常のログインページへ
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 2: ログイン方法選択
  if (step === "options") {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle>ログイン方法を選択</CardTitle>
            <CardDescription>
              <span className="font-medium">{email}</span> でログインします
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Alert className="border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">
                旧システムからの移行ユーザーです
              </AlertTitle>
              <AlertDescription className="text-amber-700">
                新システムへの移行に伴い、以下のいずれかの方法でログインしてください。
              </AlertDescription>
            </Alert>

            {/* 方法1: パスワード設定 */}
            <div className="space-y-3">
              <p className="font-medium text-sm">方法1: パスワードを設定してログイン</p>
              <Button
                onClick={() => setStep("set-password")}
                variant="outline"
                className="w-full min-h-11"
                disabled={isGoogleLoading || isLineLoading}
              >
                <KeyRound className="mr-2 h-4 w-4" />
                パスワードを設定する
              </Button>
            </div>

            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                または
              </span>
            </div>

            {/* 方法2: ソーシャルログイン */}
            <div className="space-y-3">
              <p className="font-medium text-sm">方法2: ソーシャルログイン</p>
              <p className="text-xs text-muted-foreground mb-3">
                同じメールアドレスのアカウントに自動的に紐付けられます
              </p>

              <Button
                type="button"
                variant="outline"
                className="w-full min-h-11"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading || isLineLoading}
              >
                {isGoogleLoading ? (
                  "接続中..."
                ) : (
                  <>
                    <GoogleIcon className="mr-2 h-4 w-4" />
                    Googleでログイン
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full min-h-11"
                onClick={handleLineLogin}
                disabled={isGoogleLoading || isLineLoading}
              >
                {isLineLoading ? (
                  "接続中..."
                ) : (
                  <>
                    <LineIcon className="mr-2 h-5 w-5" />
                    LINEでログイン
                  </>
                )}
              </Button>
            </div>

            <div className="text-center pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStep("email");
                  setError("");
                }}
              >
                メールアドレスを変更
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 3: パスワード設定フォーム
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>パスワードを設定</CardTitle>
          <CardDescription>
            <span className="font-medium">{email}</span> のパスワードを設定してください
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSetPassword} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-2">
              <Label htmlFor="password">新しいパスワード</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8文字以上"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">パスワード（確認）</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="もう一度入力"
              />
            </div>

            <Button
              type="submit"
              className="w-full min-h-11"
              disabled={isSettingPassword}
            >
              {isSettingPassword ? "設定中..." : "パスワードを設定してログイン"}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStep("options");
                  setPassword("");
                  setConfirmPassword("");
                  setError("");
                }}
              >
                戻る
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
