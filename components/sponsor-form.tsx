"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { sponsorFormSchema, type SponsorFormData } from "@/zod/sponsor"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { createSponsor } from "@/actions/sponsor"
import { toast } from "sonner"
import { InputImage } from "@/components/input-image"
import { useState } from "react"
import { CheckCircle } from "lucide-react"

interface SponsorFormProps {
  onSubmitSuccess?: () => void
}

export function SponsorForm({ onSubmitSuccess }: SponsorFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<SponsorFormData>({
    resolver: zodResolver(sponsorFormSchema),
    defaultValues: {
      companyName: "",
      logoUrl: "",
      representativeName: "",
      hasFlag: false,
      programConsent: false,
      websiteConsent: false,
    },
  })

  async function onSubmit(data: SponsorFormData) {
    try {
      await createSponsor(data)
      toast.success("回答を送信しました", {
        description: "ご協力ありがとうございます",
      })
      setIsSubmitted(true)
      onSubmitSuccess?.()
      form.reset()
    } catch (error) {
      toast.error("エラーが発生しました", {
        description: "回答の送信に失敗しました。もう一度お試しください。",
      })
      console.error(error)
    }
  }

  const { isSubmitting } = form.formState

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-100 p-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-4">回答ありがとうございます</h2>
        <p className="text-muted-foreground mb-2">
          ご回答いただいた内容は正常に送信されました。
        </p>
        <p className="text-muted-foreground mb-6">
          ご協力いただき、誠にありがとうございます。
        </p>
        <p className="text-sm text-muted-foreground">
          ご不明点はこちらまでご連絡ください：
          <br />
          <a
            href="mailto:cgt.ik.est2022@gmail.com"
            className="text-primary hover:underline"
          >
            cgt.ik.est2022@gmail.com
          </a>
        </p>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>会社名 *</FormLabel>
              <FormControl>
                <Input placeholder="例: 株式会社〇〇" {...field} />
              </FormControl>
              <FormDescription>
                正式な会社名を入力してください
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="logoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>会社ロゴ（任意）</FormLabel>
              <FormControl>
                <InputImage
                  width={300}
                  aspectRatio={1}
                  resultWidth={400}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                会社のロゴ画像をアップロードしてください（推奨: 正方形）
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="representativeName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>代表者名 *</FormLabel>
              <FormControl>
                <Input placeholder="例: 山田 太郎" {...field} />
              </FormControl>
              <FormDescription>
                代表者のお名前を入力してください
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hasFlag"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel>フラッグの希望 *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => field.onChange(value === "true")}
                  defaultValue={field.value ? "true" : "false"}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="flag-yes" />
                    <Label htmlFor="flag-yes">はい</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="flag-no" />
                    <Label htmlFor="flag-no">いいえ</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormDescription>
                フラッグを希望されますか？
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="programConsent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  コンサートのプログラムへの記載に同意する
                </FormLabel>
                <FormDescription>
                  コンサートのプログラムに会社名を記載してもよい場合はチェックしてください
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="websiteConsent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  ホームページへの記載に同意する
                </FormLabel>
                <FormDescription>
                  ホームページに会社名・ロゴを掲載してもよい場合はチェックしてください
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "送信中..." : "回答を送信"}
        </Button>
      </form>
    </Form>
  )
}
