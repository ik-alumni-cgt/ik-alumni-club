"use client";

import { updateEditorName } from "@/actions/members/update-editor-name";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { editorNameFormSchema, type EditorNameFormData } from "@/zod/member-profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
  defaultValues: EditorNameFormData;
};

export function EditorNameForm({ defaultValues }: Props) {
  const router = useRouter();
  const form = useForm<EditorNameFormData>({
    resolver: zodResolver(editorNameFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: EditorNameFormData) => {
    try {
      await updateEditorName(data);
      toast.success("氏名を登録しました");
      router.push("/team-blog");
    } catch (error) {
      console.error("氏名の登録エラー:", error);
      toast.error("氏名の登録に失敗しました");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>姓</FormLabel>
              <FormControl>
                <Input {...field} placeholder="齋藤" autoComplete="family-name" />
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
                <Input {...field} placeholder="遼" autoComplete="given-name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="min-h-11" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "登録中..." : "登録して執筆をはじめる"}
        </Button>
      </form>
    </Form>
  );
}
