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
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // トークンがない場合はエラー表示
  if (!token) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle>無効なリンクです</CardTitle>
            <CardDescription>
              パスワードリセットリンクが無効または期限切れです
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                このリンクは無効または期限切れです。
                再度パスワードリセットをリクエストしてください。
              </AlertDescription>
            </Alert>
            <div className="text-center">
              <Link
                href="/forgot-password"
                className="text-sm underline underline-offset-4"
              >
                パスワードリセットを再リクエスト
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // パスワード確認
    if (password !== confirmPassword) {
      setError("パスワードが一致しません");
      return;
    }

    // パスワード強度チェック
    if (password.length < 8) {
      setError("パスワードは8文字以上で入力してください");
      return;
    }

    setIsLoading(true);

    try {
      const result = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (result.error) {
        if (result.error.code === "INVALID_TOKEN") {
          setError("リンクが無効または期限切れです。再度リセットをリクエストしてください。");
        } else {
          setError(result.error.message || "パスワードのリセットに失敗しました");
        }
        return;
      }

      setIsSuccess(true);
      // 3秒後にログインページへリダイレクト
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error) {
      console.error("Password reset error:", error);
      setError("パスワードのリセットに失敗しました。再度お試しください。");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle>パスワードを変更しました</CardTitle>
            <CardDescription>
              新しいパスワードでログインできます
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                パスワードが正常に変更されました。
                まもなくログインページに移動します...
              </AlertDescription>
            </Alert>
            <div className="text-center">
              <Link
                href="/login"
                className="text-sm underline underline-offset-4"
              >
                今すぐログインする
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>新しいパスワードを設定</CardTitle>
          <CardDescription>
            新しいパスワードを入力してください
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <Label htmlFor="confirmPassword">パスワードの確認</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="もう一度入力してください"
              />
            </div>
            <Button
              type="submit"
              className="w-full min-h-11"
              disabled={isLoading}
            >
              {isLoading ? "変更中..." : "パスワードを変更"}
            </Button>
            <div className="text-center text-sm">
              <Link
                href="/login"
                className="underline underline-offset-4"
              >
                ログインページに戻る
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
