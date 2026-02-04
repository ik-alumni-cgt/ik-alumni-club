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
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email");
  const [email, setEmail] = useState("");

  // URLパラメータからメールアドレスを設定
  useEffect(() => {
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [emailFromUrl]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await authClient.forgetPassword({
        email,
        redirectTo: "/reset-password",
      });

      if (result.error) {
        // エラーでも成功メッセージを表示（セキュリティ上の理由）
        console.error("Password reset error:", result.error);
      }

      // ユーザーが存在するかどうかに関わらず成功メッセージを表示
      setIsSuccess(true);
    } catch (error) {
      console.error("Password reset error:", error);
      // セキュリティ上の理由で具体的なエラーは表示しない
      setIsSuccess(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle>メールを送信しました</CardTitle>
            <CardDescription>
              パスワードリセットの手順をご確認ください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                入力されたメールアドレスにパスワードリセット用のリンクを送信しました。
                メールをご確認ください。
              </AlertDescription>
            </Alert>
            <p className="text-sm text-muted-foreground">
              メールが届かない場合は、迷惑メールフォルダをご確認いただくか、
              しばらく待ってから再度お試しください。
            </p>
            <div className="text-center">
              <Link
                href="/login"
                className="text-sm underline underline-offset-4"
              >
                ログインページに戻る
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
          <CardTitle>パスワードをお忘れですか？</CardTitle>
          <CardDescription>
            登録したメールアドレスを入力してください。
            パスワードリセット用のリンクをお送りします。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
            <Button
              type="submit"
              className="w-full min-h-11"
              disabled={isLoading}
            >
              {isLoading ? "送信中..." : "リセットリンクを送信"}
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
