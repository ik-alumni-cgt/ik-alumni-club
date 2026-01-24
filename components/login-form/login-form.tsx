"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

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

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isLineLoading, setIsLineLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await authClient.signIn.email({
        email,
        password,
      });

      console.log("ログイン成功");
      // returnUrlがあればそちらにリダイレクト、なければマイページへ
      router.push(returnUrl || "/mypage");
    } catch (error) {
      console.error("ログインエラー:", error);
      setError("メールアドレスまたはパスワードが正しくありません");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsGoogleLoading(true);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: returnUrl || "/mypage",
        newUserCallbackURL: "/register/terms", // 初回ログイン時は登録フローへ
        errorCallbackURL: "/login",
      });
    } catch (error) {
      console.error("Googleログインエラー:", error);
      setError("Googleでのログインに失敗しました");
      setIsGoogleLoading(false);
    }
  };

  const handleLineLogin = async () => {
    setError("");
    setIsLineLoading(true);

    try {
      // genericOAuth プラグインを使用（bot_prompt パラメータをサポート）
      await authClient.signIn.oauth2({
        providerId: "line",
        callbackURL: returnUrl || "/mypage",
        newUserCallbackURL: "/register/terms",
        errorCallbackURL: "/login",
      });
    } catch (error) {
      console.error("LINEログインエラー:", error);
      setError("LINEでのログインに失敗しました");
      setIsLineLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>ようこそ</CardTitle>
          <CardDescription>IK同窓会クラブにログイン</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailLogin} className="space-y-6">
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
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
            <div className="grid gap-2">
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full min-h-11" disabled={isLoading || isGoogleLoading || isLineLoading}>
              {isLoading ? "ログイン中..." : "ログイン"}
            </Button>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                または
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full min-h-11"
              onClick={handleGoogleLogin}
              disabled={isLoading || isGoogleLoading || isLineLoading}
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
              disabled={isLoading || isGoogleLoading || isLineLoading}
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
            <div className="text-center text-sm">
              アカウントをお持ちでないですか?{" "}
              <Link href="/signup" className="underline underline-offset-4">
                登録
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
