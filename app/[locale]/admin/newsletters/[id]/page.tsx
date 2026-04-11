import { NewsletterForm } from "@/components/newsletter-form";
import { Button } from "@/components/ui/button";
import { getNewsletter } from "@/data/newsletter";
import { getCategoriesTree, getNewsletterCategoryIds } from "@/data/category";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteNewsletter } from "@/actions/newsletter";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function EditNewsletterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [newsletter, categoriesTree, initialCategoryIds] = await Promise.all([
    getNewsletter(id),
    getCategoriesTree(),
    getNewsletterCategoryIds(id),
  ]);

  if (!newsletter) {
    notFound();
  }

  async function handleDelete() {
    "use server";
    await deleteNewsletter(id);
    revalidatePath("/admin/newsletters");
    redirect("/admin/newsletters");
  }

  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/admin/newsletters">
            <ArrowLeft className="mr-2 h-4 w-4" />
            一覧に戻る
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Digital Magazine編集</h1>
        <p className="text-muted-foreground">
          第{newsletter.issueNumber}号を編集します
        </p>
      </div>

      <div className="mb-6">
        <h2 className="mb-3 text-lg font-semibold">プレビュー</h2>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge>第{newsletter.issueNumber}号</Badge>
              {newsletter.published ? (
                <Badge variant="default">公開中</Badge>
              ) : (
                <Badge variant="secondary">下書き</Badge>
              )}
              {newsletter.category && (
                <Badge variant="outline">
                  {newsletter.category === "regular" && "定期号"}
                  {newsletter.category === "special" && "特別号"}
                  {newsletter.category === "extra" && "号外"}
                </Badge>
              )}
            </div>
            <CardTitle>{newsletter.title}</CardTitle>
            <CardDescription>{newsletter.excerpt}</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: newsletter.content }}
            />
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <h2 className="mb-3 text-lg font-semibold">編集</h2>
        <NewsletterForm
          mode="edit"
          defaultValues={{
            id: newsletter.id,
            issueNumber: newsletter.issueNumber,
            title: newsletter.title,
            excerpt: newsletter.excerpt,
            content: newsletter.content,
            thumbnailUrl: newsletter.thumbnailUrl || "",
            pdfUrl: newsletter.pdfUrl || "",
            category: newsletter.category as "regular" | "special" | "extra" | undefined,
            publishedAt: newsletter.publishedAt
              ? newsletter.publishedAt.toISOString().split("T")[0]
              : "",
            published: newsletter.published,
            isMemberOnly: newsletter.isMemberOnly,
          }}
          categoriesTree={categoriesTree}
          initialCategoryIds={initialCategoryIds}
        />
      </div>

      <div className="border-t pt-6">
        <h2 className="mb-3 text-lg font-semibold text-destructive">
          危険な操作
        </h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              削除
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>本当に削除しますか?</AlertDialogTitle>
              <AlertDialogDescription>
                「第{newsletter.issueNumber}号: {newsletter.title}
                」を削除します。この操作は取り消せません。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>キャンセル</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                削除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
