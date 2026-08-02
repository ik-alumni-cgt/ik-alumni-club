"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LineIcon } from "@/components/team-login-form/line-icon";

export function InviteLoginForm({ token }: { token: string }) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLineLogin = async () => {
    setError("");
    setIsLoading(true);

    try {
      // 招待の受領はログイン後のコールバックで行う
      const callbackURL = `/team-invite/${token}/accept`;
      await authClient.signIn.oauth2({
        providerId: "line",
        callbackURL,
        newUserCallbackURL: callbackURL,
        errorCallbackURL: `/team-invite/${token}`,
      });
    } catch (error) {
      console.error("LINEログインエラー:", error);
      setError("LINEでのログインに失敗しました");
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold">メンバーブログへの招待</h1>
            <p className="text-muted-foreground text-balance mt-2">
              LINE でログインすると、ブログの執筆をはじめられます。
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
            disabled={isLoading}
          >
            {isLoading ? (
              "接続中..."
            ) : (
              <>
                <LineIcon className="mr-2 h-5 w-5" />
                LINEでログイン
              </>
            )}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            ログイン後、氏名のご登録をお願いします。
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
