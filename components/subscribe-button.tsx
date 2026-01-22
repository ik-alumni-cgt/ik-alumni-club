"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, Building } from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface SubscribeButtonProps {
  priceId: string;
  mode?: "subscription" | "payment";
  label?: string;
  description?: string;
}

export function SubscribeButton({
  priceId,
  mode = "subscription",
  label,
  description,
}: SubscribeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);

      if (mode === "subscription") {
        // Better Auth の subscription.upgrade API を使用（サブスク決済）
        await authClient.subscription.upgrade({
          plan: "annual",
          successUrl: `${window.location.origin}/subscribe/success`,
          cancelUrl: `${window.location.origin}/subscribe/cancel`,
        });
      } else {
        // 単発決済は直接API呼び出し
        const response = await fetch("/api/stripe/create-checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            priceId,
            mode: "payment",
            successUrl: `${window.location.origin}/subscribe/success`,
            cancelUrl: `${window.location.origin}/subscribe/cancel`,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create checkout session");
        }

        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error("No checkout URL returned");
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("決済の開始に失敗しました");
      setIsLoading(false);
    }
  };

  const defaultLabel = mode === "subscription"
    ? "クレジットカードで支払う"
    : "銀行振込・コンビニで支払う";

  const Icon = mode === "subscription" ? CreditCard : Building;

  return (
    <div className="space-y-2">
      <Button
        onClick={handleSubscribe}
        disabled={isLoading}
        size="lg"
        variant={mode === "subscription" ? "default" : "outline"}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            処理中...
          </>
        ) : (
          <>
            <Icon className="mr-2 h-4 w-4" />
            {label || defaultLabel}
          </>
        )}
      </Button>
      {description && (
        <p className="text-xs text-muted-foreground text-center">{description}</p>
      )}
    </div>
  );
}
