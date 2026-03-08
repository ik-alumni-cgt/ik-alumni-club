"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { memberProfileFormSchema, type MemberProfileFormData } from "@/zod/member-profile";
import { updateMemberProfile } from "@/actions/members/update-profile";
import { usePostalCode } from "@/hooks/use-postal-code";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { Member } from "@/types/member";

type ProfileEditFormProps = {
  member: Member;
};

// 都道府県リスト
const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県",
  "岐阜県", "静岡県", "愛知県", "三重県",
  "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
  "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県",
  "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県",
  "沖縄県",
];

export function ProfileEditForm({ member }: ProfileEditFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // 初回入力かどうか
  const isFirstTime = member.status === "pending_profile";

  const form = useForm<MemberProfileFormData>({
    resolver: zodResolver(memberProfileFormSchema),
    defaultValues: {
      lastName: member.lastName || "",
      firstName: member.firstName || "",
      lastNameKana: member.lastNameKana || "",
      firstNameKana: member.firstNameKana || "",
      postalCode: member.postalCode || "",
      prefecture: member.prefecture || "",
      city: member.city || "",
      address: member.address || "",
      building: member.building || "",
      phoneNumber: member.phoneNumber || "",
    },
  });

  // 郵便番号から住所を自動入力
  const postalCode = form.watch("postalCode");

  const handleAddressFound = useCallback(
    (address: { prefecture: string; city: string; town: string }) => {
      form.setValue("prefecture", address.prefecture, {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue("city", address.city, {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue("address", address.town, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [form],
  );

  const { isLoading: isPostalCodeLoading } = usePostalCode(
    postalCode,
    handleAddressFound,
  );

  const onSubmit = async (data: MemberProfileFormData) => {
    setIsLoading(true);
    try {
      const result = await updateMemberProfile(data);

      if (!result.success) {
        throw new Error(result.error || "更新に失敗しました");
      }

      toast.success(isFirstTime ? "プロフィール情報を登録しました" : "プロフィール情報を更新しました", {
        description: isFirstTime ? "会員限定コンテンツにアクセスできるようになりました" : undefined,
      });

      router.push(isFirstTime ? "/mypage" : "/profile");
      router.refresh();
    } catch (error) {
      toast.error("エラーが発生しました", {
        description: error instanceof Error ? error.message : "プロフィールの更新に失敗しました",
      });
      console.error("プロフィール更新エラー:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (isFirstTime) {
      router.push("/mypage");
    } else {
      router.push("/profile");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isFirstTime ? "プロフィール情報の入力" : "会員情報の編集"}</CardTitle>
        <CardDescription>
          {isFirstTime
            ? "会員限定コンテンツにアクセスするため、詳細な情報を入力してください。"
            : "会員情報を編集できます。"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* 氏名 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">氏名</h3>
              <div className="grid gap-4 md:grid-cols-2">
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

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="lastNameKana"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>セイ（カタカナ）</FormLabel>
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
                      <FormLabel>メイ（カタカナ）</FormLabel>
                      <FormControl>
                        <Input placeholder="タロウ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 住所 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">住所</h3>
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>郵便番号</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input placeholder="1234567" {...field} maxLength={7} />
                      </FormControl>
                      {isPostalCodeLoading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <FormDescription>ハイフンなし7桁の数字</FormDescription>
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="選択してください" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PREFECTURES.map((pref) => (
                          <SelectItem key={pref} value={pref}>
                            {pref}
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
                      <Input placeholder="渋谷1-2-3" {...field} />
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
                    <FormLabel>建物名・部屋番号（任意）</FormLabel>
                    <FormControl>
                      <Input placeholder="渋谷マンション101号室" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 連絡先 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">連絡先</h3>
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>電話番号</FormLabel>
                    <FormControl>
                      <Input placeholder="09012345678" {...field} maxLength={11} />
                    </FormControl>
                    <FormDescription>ハイフンなしで入力してください</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-4">
              <Button type="submit" className="w-full min-h-11" disabled={isLoading}>
                {isLoading ? "保存中..." : "保存する"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full min-h-11"
                onClick={handleCancel}
                disabled={isLoading}
              >
                {isFirstTime ? "後で入力する" : "キャンセル"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
