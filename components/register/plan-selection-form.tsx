"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRegistration } from "@/contexts/RegistrationContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import type { MemberPlan } from "@/types/member-plan";
import { RegistrationProgress } from "./registration-progress";
import kojinImg from "@/app/[locale]/(main)/supporters/kojin.png";
import houjinImg from "@/app/[locale]/(main)/supporters/houjin.png";
import puratinaImg from "@/app/[locale]/(main)/supporters/puratina.png";

type PlanSelectionFormProps = {
  plans: MemberPlan[];
};

export function PlanSelectionForm({ plans }: PlanSelectionFormProps) {
  const router = useRouter();
  const { setSelectedPlanId, termsAgreed } = useRegistration();
  const [isLoading, setIsLoading] = useState(false);
  const [showPlatinumDialog, setShowPlatinumDialog] = useState(false);

  // 会員規約に同意していない場合はリダイレクト
  useEffect(() => {
    if (!termsAgreed) {
      router.push("/register/terms");
    }
  }, [termsAgreed, router]);

  // リダイレクト中は何も表示しない
  if (!termsAgreed) {
    return null;
  }

  const handlePlanSelect = (planCode: string) => {
    if (planCode === "platinum") {
      setShowPlatinumDialog(true);
      return;
    }

    const selectedPlan = plans.find(p => p.planCode === planCode);
    if (selectedPlan) {
      proceedWithPlan(selectedPlan.id);
    }
  };

  const handlePlatinumTypeSelect = (type: "individual" | "business") => {
    const planCode = type === "individual" ? "platinum_individual" : "platinum_business";
    const selectedPlan = plans.find(p => p.planCode === planCode);
    if (selectedPlan) {
      setShowPlatinumDialog(false);
      proceedWithPlan(selectedPlan.id);
    }
  };

  const proceedWithPlan = (planId: number) => {
    setIsLoading(true);
    try {
      const selectedPlan = plans.find(p => p.id === planId);

      if (selectedPlan && !selectedPlan.stripePriceId) {
        console.error("Selected plan does not have a Stripe Price ID");
        setIsLoading(false);
        return;
      }

      setSelectedPlanId(planId);
      router.push("/register/auth");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <RegistrationProgress currentStep={2} className="mb-8" />
      <Card>
        <CardHeader>
          <CardTitle>会員プラン選択</CardTitle>
          <CardDescription>
            ご希望のプランを選択してください。プランは後から変更することも可能です。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 個人会員 */}
            <button
              type="button"
              onClick={() => handlePlanSelect("individual")}
              disabled={isLoading}
              className="relative rounded-2xl overflow-hidden group hover:ring-2 hover:ring-primary transition-all duration-300 disabled:opacity-50"
            >
              <Image
                src={kojinImg}
                alt="個人会員"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
            </button>

            {/* 法人会員 */}
            <button
              type="button"
              onClick={() => handlePlanSelect("business")}
              disabled={isLoading}
              className="relative rounded-2xl overflow-hidden group hover:ring-2 hover:ring-primary transition-all duration-300 disabled:opacity-50"
            >
              <Image
                src={houjinImg}
                alt="法人会員"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
            </button>

            {/* プラチナ会員 */}
            <button
              type="button"
              onClick={() => handlePlanSelect("platinum")}
              disabled={isLoading}
              className="relative rounded-2xl overflow-hidden group hover:ring-2 hover:ring-primary transition-all duration-300 disabled:opacity-50"
            >
              <Image
                src={puratinaImg}
                alt="プラチナ会員"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
            </button>
          </div>

          <CardFooter className="flex justify-start px-0 pt-6">
            <Button
              type="button"
              variant="outline"
              className="min-h-11"
              onClick={() => router.push("/register/terms")}
            >
              戻る
            </Button>
          </CardFooter>
        </CardContent>
      </Card>

      {/* プラチナ会員の法人/個人選択ダイアログ */}
      <Dialog open={showPlatinumDialog} onOpenChange={setShowPlatinumDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>プラチナ会員の種別を選択</DialogTitle>
            <DialogDescription>
              個人としてご入会か、法人としてご入会かをお選びください。
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2"
              onClick={() => handlePlatinumTypeSelect("individual")}
            >
              <span className="text-lg font-bold">個人</span>
              <span className="text-xs text-muted-foreground">¥30,000/年</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2"
              onClick={() => handlePlatinumTypeSelect("business")}
            >
              <span className="text-lg font-bold">法人</span>
              <span className="text-xs text-muted-foreground">¥30,000/年</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
