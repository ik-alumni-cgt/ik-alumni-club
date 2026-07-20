"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminAccountFormSchema, AdminAccountFormData } from "@/zod/admin/account";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { updateAccount } from "@/actions/admin/accounts/update-account";
import { toast } from "sonner";
import { Member } from "@/types/member";
import { MemberPlan } from "@/types/member-plan";

export function AccountForm({
  account,
  memberPlans,
}: {
  account: Member & { user: { id: string; name: string; email: string; emailVerified: boolean }; plan: MemberPlan | null };
  memberPlans: MemberPlan[];
}) {
  const router = useRouter();
  const form = useForm<AdminAccountFormData>({
    resolver: zodResolver(adminAccountFormSchema),
    defaultValues: {
      lastName: account.lastName || "",
      firstName: account.firstName || "",
      lastNameKana: account.lastNameKana || "",
      firstNameKana: account.firstNameKana || "",
      postalCode: account.postalCode || "",
      prefecture: account.prefecture || "",
      city: account.city || "",
      address: account.address || "",
      building: account.building || "",
      phoneNumber: account.phoneNumber || "",
      planId: account.planId,
      role: account.role,
      status: account.status || "pending_profile",
      isActive: account.isActive,
      isEditor: account.isEditor,
    },
  });

  async function onSubmit(data: AdminAccountFormData) {
    try {
      await updateAccount(account.id, data);
      toast.success("会員情報を更新しました");
      router.push(`/admin/accounts/${account.id}`);
      router.refresh();
    } catch (error) {
      toast.error("エラーが発生しました", {
        description: "会員情報の更新に失敗しました",
      });
      console.error(error);
    }
  }

  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">個人情報</h3>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>姓</FormLabel>
                  <FormControl>
                    <Input placeholder="山田" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>名</FormLabel>
                  <FormControl>
                    <Input placeholder="太郎" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="lastNameKana"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>セイ</FormLabel>
                  <FormControl>
                    <Input placeholder="ヤマダ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="firstNameKana"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メイ</FormLabel>
                  <FormControl>
                    <Input placeholder="タロウ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>郵便番号</FormLabel>
                <FormControl>
                  <Input placeholder="1234567" {...field} />
                </FormControl>
                <FormDescription>ハイフンなしの7桁で入力してください</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="prefecture"
            render={({ field }) => (
              <FormItem>
                <FormLabel>都道府県</FormLabel>
                <FormControl>
                  <Input placeholder="東京都" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>市区町村</FormLabel>
                <FormControl>
                  <Input placeholder="渋谷区" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>町名番地</FormLabel>
                <FormControl>
                  <Input placeholder="道玄坂1-2-3" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="building"
            render={({ field }) => (
              <FormItem>
                <FormLabel>建物名（任意）</FormLabel>
                <FormControl>
                  <Input placeholder="〇〇ビル101号室" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>電話番号</FormLabel>
                <FormControl>
                  <Input placeholder="09012345678" {...field} />
                </FormControl>
                <FormDescription>ハイフンなしで入力してください</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">会員設定</h3>

          <FormField
            control={form.control}
            name="planId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>会員プラン</FormLabel>
                <Select
                  value={field.value?.toString() || "none"}
                  onValueChange={(value) => field.onChange(value === "none" ? null : parseInt(value))}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="プランを選択" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">未設定</SelectItem>
                    {memberPlans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id.toString()}>
                        {plan.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>権限</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="member">会員</SelectItem>
                    <SelectItem value="officer">役員</SelectItem>
                    <SelectItem value="admin">管理者</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ステータス</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pending_profile">プロフィール入力待ち</SelectItem>
                    <SelectItem value="active">アクティブ</SelectItem>
                    <SelectItem value="inactive">非アクティブ</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">アクティブ</FormLabel>
                  <FormDescription>
                    アクティブな会員のみシステムを利用できます
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

          <FormField
            control={form.control}
            name="isEditor"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">編集者</FormLabel>
                  <FormDescription>
                    メンバーブログの執筆を許可します。通常は招待リンク経由で自動的に付与されます
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
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            更新
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            キャンセル
          </Button>
        </div>
      </form>
    </Form>
  );
}
