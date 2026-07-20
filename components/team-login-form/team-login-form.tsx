"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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

export function TeamLoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [error, setError] = useState("");
  const [isLineLoading, setIsLineLoading] = useState(false);

  const handleLineLogin = async () => {
    setError("");
    setIsLineLoading(true);

    try {
      // 新規・既存いずれのユーザーも専用コールバックへ集約し、
      // 通常の登録・課金フロー（/register/terms）を経由させない
      await authClient.signIn.oauth2({
        providerId: "line",
        callbackURL: "/team-login/callback",
        newUserCallbackURL: "/team-login/callback",
        errorCallbackURL: "/team-login",
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
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-2xl font-bold">メンバーログイン</h1>
              <p className="text-muted-foreground text-balance mt-2">
                チームメンバー専用のログインです。LINE でログインしてください。
              </p>
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}
            <Button
              type="button"
              variant="outline"
              className="w-full min-h-11"
              onClick={handleLineLogin}
              disabled={isLineLoading}
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
            <p className="text-center text-sm text-muted-foreground">
              初回ログイン後、管理者の承認をお待ちください。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
