import { verifyAdmin } from "@/lib/session";
import { getContact } from "@/data/contact";
import {
  CONTACT_CATEGORY_LABELS,
  type ContactCategory,
} from "@/components/contact/constants";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default async function AdminContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await verifyAdmin();
  const { id } = await params;
  const contact = await getContact(id);

  if (!contact) {
    notFound();
  }

  const categoryLabel =
    CONTACT_CATEGORY_LABELS[contact.category as ContactCategory] ??
    contact.category;

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/admin/contacts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            一覧に戻る
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>お問い合わせ詳細</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">名前</p>
              <p className="mt-1">{contact.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                メールアドレス
              </p>
              <p className="mt-1">
                <a
                  href={`mailto:${contact.email}`}
                  className="text-primary hover:underline"
                >
                  {contact.email}
                </a>
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                カテゴリ
              </p>
              <p className="mt-1">{categoryLabel}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                受付日時
              </p>
              <p className="mt-1">
                {contact.createdAt.toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">件名</p>
            <p className="mt-1">{contact.subject}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">
              お問い合わせ内容
            </p>
            <div className="mt-1 whitespace-pre-wrap rounded-md border bg-muted/50 p-4">
              {contact.body}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
