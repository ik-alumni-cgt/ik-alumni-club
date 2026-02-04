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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { updateUserEmail } from "@/actions/members/update-user-email";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle, Mail } from "lucide-react";

interface EmailRegistrationFormProps extends React.ComponentProps<"div"> {
  userId: string;
  planId?: string;
}

export function EmailRegistrationForm({
  className,
  userId,
  planId,
  ...props
}: EmailRegistrationFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // バリデーション
    if (!email || !email.includes("@")) {
      setError("有効なメールアドレスを入力してください。");
      return;
    }

    if (email !== confirmEmail) {
      setError("メールアドレスが一致しません。");
      return;
    }

    if (email.endsWith("@line.me")) {
      setError("LINEのダミーメールアドレスは使用できません。");
      return;
    }

    setIsLoading(true);

    try {
      const result = await updateUserEmail(userId, email, planId);

      if (!result.success) {
        setError(result.error || "メールアドレスの登録に失敗しました。");
        return;
      }

      // 支払いページへリダイレクト
      const paymentUrl = planId
        ? `/register/payment?planId=${planId}`
        : "/register/payment";
      router.push(paymentUrl);
    } catch (error) {
      console.error("メール登録エラー:", error);
      setError("メールアドレスの登録に失敗しました。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            メールアドレスの登録
          </CardTitle>
          <CardDescription>
            LINEアカウントにメールアドレスが登録されていないため、
            連絡先として使用するメールアドレスを入力してください。
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

            <Alert className="border-blue-200 bg-blue-50">
              <Mail className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                登録いただいたメールアドレスは、ご連絡やお知らせの送信に使用します。
              </AlertDescription>
            </Alert>

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
              <Label htmlFor="confirmEmail">メールアドレス（確認）</Label>
              <Input
                id="confirmEmail"
                type="email"
                placeholder="もう一度入力"
                required
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full min-h-11"
              disabled={isLoading}
            >
              {isLoading ? "登録中..." : "登録して次へ進む"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
