"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LineIcon } from "@/components/team-login-form/line-icon";

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
      // 通常の登録・課金フロー（/register/terms）を経由させない。
      // コールバックで会員レコードを用意し、ゲート判定は /team-blog 側で行う。
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
              編集者権限が付与されたアカウントのみ利用できます。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
