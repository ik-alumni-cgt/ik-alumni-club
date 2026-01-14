"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupFormSchema } from "@/zod/signup";
import { SignupFormData } from "@/types/signup";
import { toast } from "sonner";

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

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
import { useRegistration } from "@/contexts/RegistrationContext";
import { createMemberAfterSignup } from "@/actions/members/create-member";
import { RegistrationProgress } from "./registration-progress";

export function RegisterAuthForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { selectedPlanId, setAccountCreated, setUserId } = useRegistration();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isLineLoading, setIsLineLoading] = useState(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // プランが選択されていない場合はリダイレクト
  if (!selectedPlanId) {
    router.push("/register/plan");
    return null;
  }

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/register/payment",
        errorCallbackURL: "/register/auth",
      });
    } catch (error) {
      console.error("Googleサインアップエラー:", error);
      toast.error("Googleでの登録に失敗しました");
      setIsGoogleLoading(false);
    }
  };

  const handleLineSignup = async () => {
    setIsLineLoading(true);
    try {
      await authClient.signIn.social({
        provider: "line",
        callbackURL: "/register/payment",
        errorCallbackURL: "/register/auth",
      });
    } catch (error) {
      console.error("LINEサインアップエラー:", error);
      toast.error("LINEでの登録に失敗しました");
      setIsLineLoading(false);
    }
  };

  async function onSubmit(data: SignupFormData) {
    try {
      // Better Authでアカウント作成
      const signupResult = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (!signupResult.data?.user?.id) {
        throw new Error("アカウント作成に失敗しました");
      }

      const userId = signupResult.data.user.id;

      // memberレコード作成
      const memberResult = await createMemberAfterSignup(
        userId,
        data.email,
        selectedPlanId ?? undefined
      );

      if (!memberResult.success) {
        throw new Error(memberResult.error || "会員情報の作成に失敗しました");
      }

      toast.success("アカウントが作成されました", {
        description: `${data.name}さん、次にお支払い手続きを行います`,
      });

      // アカウント作成完了をコンテキストに保存
      setAccountCreated(true);
      setUserId(userId);

      // 支払いページへリダイレクト
      router.push("/register/payment");
    } catch (error) {
      toast.error("エラーが発生しました", {
        description:
          error instanceof Error
            ? error.message
            : "サインアップに失敗しました",
      });
      console.error("サインアップエラー:", error);
    }
  }

  const { isSubmitting } = form.formState;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <RegistrationProgress currentStep={3} className="mb-8" />
      <Card>
        <CardHeader>
          <CardTitle>アカウント作成</CardTitle>
          <CardDescription>IK ALUMNI CGT サポーターズクラブに登録</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>名前</FormLabel>
                    <FormControl>
                      <Input placeholder="山田太郎" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>メールアドレス</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="m@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>パスワード</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full min-h-11"
                disabled={isSubmitting || isGoogleLoading || isLineLoading}
              >
                {isSubmitting ? "登録中..." : "登録"}
              </Button>

              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  または
                </span>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full min-h-11"
                onClick={handleGoogleSignup}
                disabled={isSubmitting || isGoogleLoading || isLineLoading}
              >
                {isGoogleLoading ? (
                  "接続中..."
                ) : (
                  <>
                    <GoogleIcon className="mr-2 h-4 w-4" />
                    Googleで登録
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full min-h-11"
                onClick={handleLineSignup}
                disabled={isSubmitting || isGoogleLoading || isLineLoading}
              >
                {isLineLoading ? (
                  "接続中..."
                ) : (
                  <>
                    <LineIcon className="mr-2 h-5 w-5" />
                    LINEで登録
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full min-h-11"
                onClick={() => router.push("/register/plan")}
              >
                戻る
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
