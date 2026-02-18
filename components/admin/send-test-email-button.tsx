"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { sendTestEmailAction } from "@/actions/admin/send-test-email";

const TIMEOUT_MS = 15000;

export function SendTestEmailButton() {
  const [isLoading, setIsLoading] = useState(false);
  const isSendingRef = useRef(false);

  const handleClick = async () => {
    if (isSendingRef.current) return;
    isSendingRef.current = true;
    setIsLoading(true);
    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("タイムアウトしました（15秒）")), TIMEOUT_MS);
      });

      const result = await Promise.race([
        sendTestEmailAction(),
        timeoutPromise,
      ]);

      if (result.success) {
        toast.success("テストメールを送信しました（cgt.ik.est2022@gmail.com 宛）");
      } else {
        toast.error(`送信失敗: ${result.error}`);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "予期しないエラーが発生しました";
      console.error("[SendTestEmailButton] エラー:", error);
      toast.error(`エラー: ${message}`);
    } finally {
      isSendingRef.current = false;
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? "送信中..." : "テストメール送信"}
    </Button>
  );
}
