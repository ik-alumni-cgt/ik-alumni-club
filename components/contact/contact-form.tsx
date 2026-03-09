"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, type ContactFormData } from "@/zod/contact";
import {
  contactCategoryValues,
  CONTACT_CATEGORY_LABELS,
} from "@/components/contact/constants";
import { submitContact } from "@/actions/contact";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ContactFormProps = {
  defaultName?: string;
  defaultEmail?: string;
};

export function ContactForm({ defaultName, defaultEmail }: ContactFormProps) {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: defaultName ?? "",
      email: defaultEmail ?? "",
      category: undefined,
      subject: "",
      body: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: ContactFormData) {
    const result = await submitContact(data);

    if (result.success) {
      toast("お問い合わせを送信しました", {
        description: "確認メールをお送りしましたのでご確認ください。",
      });
      form.reset({
        name: defaultName ?? "",
        email: defaultEmail ?? "",
        category: undefined,
        subject: "",
        body: "",
      });
    } else {
      toast.error("送信に失敗しました", {
        description: result.error,
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>お問い合わせ</CardTitle>
        <CardDescription>
          ご質問・ご要望などがございましたらお気軽にご連絡ください。
        </CardDescription>
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
                      placeholder="example@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>カテゴリ</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="カテゴリを選択してください" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {contactCategoryValues.map((value) => (
                        <SelectItem key={value} value={value}>
                          {CONTACT_CATEGORY_LABELS[value]}
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
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>件名</FormLabel>
                  <FormControl>
                    <Input placeholder="件名を入力してください" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>お問い合わせ内容</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="お問い合わせ内容を入力してください"
                      rows={8}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full min-h-11"
              disabled={isSubmitting}
            >
              {isSubmitting ? "送信中..." : "送信する"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
