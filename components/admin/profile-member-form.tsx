"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { profileMemberFormSchema, type ProfileMemberFormData } from "@/zod/admin/profile-member"
import { createProfileMember, updateProfileMember } from "@/actions/admin/profile-member"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { InputImage } from "@/components/input-image"

interface ProfileMemberFormProps {
  defaultValues?: ProfileMemberFormData & { id?: string }
  mode: "create" | "edit"
}

export function ProfileMemberForm({ defaultValues, mode }: ProfileMemberFormProps) {
  const router = useRouter()
  const form = useForm<ProfileMemberFormData>({
    resolver: zodResolver(profileMemberFormSchema),
    defaultValues: defaultValues || {
      name: "",
      description: "",
      imageUrl: "",
      sortOrder: 0,
      isVisible: true,
      memberId: null,
    },
  })

  const onSubmit = async (data: ProfileMemberFormData) => {
    try {
      if (mode === "create") {
        await createProfileMember(data)
        toast.success("メンバーを追加しました")
      } else if (defaultValues?.id) {
        await updateProfileMember(defaultValues.id, data)
        toast.success("メンバーを更新しました")
      }
      router.push("/admin/profile-members")
      router.refresh()
    } catch (error) {
      toast.error("エラーが発生しました", {
        description: `メンバーの${mode === "create" ? "追加" : "更新"}に失敗しました`,
      })
      console.error(error)
    }
  }

  const { isSubmitting } = form.formState

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>名前 *</FormLabel>
              <FormControl>
                <Input placeholder="例: SHO" {...field} />
              </FormControl>
              <FormDescription>
                プロフィールページに表示される名前です
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>紹介文 *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="メンバーの紹介文を入力してください"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>プロフィール画像</FormLabel>
              <FormControl>
                <InputImage
                  width={300}
                  aspectRatio={4 / 3}
                  resultWidth={600}
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                4:3のアスペクト比で表示されます
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sortOrder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>表示順</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                数値が小さいほど先に表示されます
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isVisible"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">公開状態</FormLabel>
                <FormDescription>
                  ONにするとプロフィールページに表示されます
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            キャンセル
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "保存中..."
              : mode === "create"
              ? "追加"
              : "更新"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
