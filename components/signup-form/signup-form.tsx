"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signupFormSchema } from "@/zod/signup"
import { SignupFormData } from "@/types/signup"
import { toast } from "sonner"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: SignupFormData) {
    try {
      await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      toast("アカウントが作成されました", {
        description: `${data.name}さん、IK同窓会クラブへようこそ`,
      });
      form.reset();
      router.push("/mypage");
    } catch (error) {
      toast.error("エラーが発生しました", {
        description: error instanceof Error ? error.message : "サインアップに失敗しました",
      });
      console.error("サインアップエラー:", error);
    }
  }

  const { isSubmitting } = form.formState;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>アカウント登録</CardTitle>
          <CardDescription>IK同窓会クラブに登録</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

              <Button type="submit" className="w-full min-h-11" disabled={isSubmitting}>
                {isSubmitting ? "登録中..." : "登録"}
              </Button>

              <div className="text-center text-sm">
                すでにアカウントをお持ちですか?{" "}
                <Link href="/login" className="underline underline-offset-4">
                  ログイン
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
