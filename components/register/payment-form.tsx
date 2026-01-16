"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRegistration } from "@/contexts/RegistrationContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { getMemberPlanById } from "@/actions/member-plans/get-member-plans";
import { Loader2, CreditCard, AlertCircle } from "lucide-react";
import { RegistrationProgress } from "./registration-progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { authClient } from "@/lib/auth-client";

interface PlanData {
  id: number;
  planCode: string;
  planName: string;
  displayName: string;
  description: string | null;
  price: string;
  hierarchyLevel: number;
  isBusinessPlan: boolean | null;
  features: unknown;
  color: string | null;
  isActive: boolean;
  stripePriceId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export function PaymentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedPlanId, userId, accountCreated } = useRegistration();
  const [plan, setPlan] = useState<PlanData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [effectiveUserId, setEffectiveUserId] = useState<string | null>(null);
  const [effectivePlanId, setEffectivePlanId] = useState<number | null>(null);

  // 初期チェック
  useEffect(() => {
    async function initialize() {
      // URLパラメータからplanIdを取得（ソーシャルログイン用フォールバック）
      const planIdFromUrl = searchParams.get("planId");
      const resolvedPlanId = selectedPlanId || (planIdFromUrl ? parseInt(planIdFromUrl) : null);

      // セッションからユーザー情報を取得（ソーシャルログイン用フォールバック）
      let resolvedUserId = userId;
      let isAuthenticated = accountCreated;

      if (!resolvedUserId || !isAuthenticated) {
        const session = await authClient.getSession();
        if (session?.data?.user) {
          resolvedUserId = session.data.user.id;
          isAuthenticated = true;
        }
      }

      // アカウント作成済みかチェック
      if (!isAuthenticated || !resolvedUserId) {
        toast.error("先にアカウントを作成してください");
        router.push("/register/auth");
        return;
      }

      // プラン選択済みかチェック
      if (!resolvedPlanId) {
        toast.error("先にプランを選択してください");
        router.push("/register/plan");
        return;
      }

      setEffectiveUserId(resolvedUserId);
      setEffectivePlanId(resolvedPlanId);

      // プラン情報を取得
      try {
        const result = await getMemberPlanById(resolvedPlanId);

        if (!result.success || !result.data) {
          toast.error("プラン情報が見つかりません");
          router.push("/register/plan");
          return;
        }

        if (!result.data.stripePriceId) {
          toast.error("このプランは現在ご利用いただけません");
          router.push("/register/plan");
          return;
        }

        setPlan(result.data);
      } catch (error) {
        console.error("Failed to load plan:", error);
        toast.error("プラン情報の取得に失敗しました");
        router.push("/register/plan");
      } finally {
        setIsInitializing(false);
      }
    }

    initialize();
  }, [selectedPlanId, userId, accountCreated, router, searchParams]);

  // Stripe Checkoutセッションを作成してリダイレクト
  const handlePayment = async () => {
    if (!plan?.stripePriceId || !effectiveUserId || !effectivePlanId) return;

    try {
      setIsLoading(true);

      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: plan.stripePriceId,
          successUrl: `${window.location.origin}/register/payment/success`,
          cancelUrl: `${window.location.origin}/register/payment?planId=${effectivePlanId}`,
          metadata: {
            planId: effectivePlanId,
            userId: effectiveUserId,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const data = await response.json();

      if (!data.url) {
        throw new Error("Checkout URL not found");
      }

      // Stripe Checkoutページへリダイレクト
      window.location.href = data.url;
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("支払い処理の開始に失敗しました");
      setIsLoading(false);
    }
  };

  if (isInitializing) {
    return (
      <>
        <RegistrationProgress currentStep={4} className="mb-8" />
        <Card>
          <CardContent className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </>
    );
  }

  if (!plan) return null;

  const features: string[] = Array.isArray(plan.features) ? plan.features : [];

  return (
    <>
      <RegistrationProgress currentStep={4} className="mb-8" />

      <Card>
        <CardHeader>
          <CardTitle>お支払い</CardTitle>
          <CardDescription>
            選択されたプランのお支払い手続きを行います
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* プラン詳細 */}
          <div className="border rounded-lg p-6 bg-muted/50">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold" style={{ color: plan.color || undefined }}>
                  {plan.displayName}
                </h3>
                {plan.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {plan.description}
                  </p>
                )}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  ¥{Number(plan.price).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">/月</div>
              </div>
            </div>

            {/* 機能リスト */}
            {features.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-semibold mb-2">含まれる機能:</p>
                <ul className="space-y-1">
                  {features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start text-sm">
                      <span className="text-primary mr-2">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 注意事項 */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>お支払いについて</AlertTitle>
            <AlertDescription className="text-sm space-y-2">
              <p>• Stripeの安全な決済ページに移動します</p>
              <p>• クレジットカード情報は当サイトには保存されません</p>
              <p>• 支払いはいつでもキャンセル可能です</p>
            </AlertDescription>
          </Alert>
        </CardContent>

        <CardFooter>
          <Button
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                処理中...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                ¥{Number(plan.price).toLocaleString()} を支払う
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
