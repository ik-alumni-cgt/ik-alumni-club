import { NewsletterForm } from "@/components/newsletter-form";
import { Button } from "@/components/ui/button";
import { getNextIssueNumber } from "@/data/newsletter";
import { getCategoriesTree } from "@/data/category";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NewNewsletterPage() {
  const [nextIssueNumber, categoriesTree] = await Promise.all([
    getNextIssueNumber(),
    getCategoriesTree(),
  ]);

  return (
    <div className="container max-w-3xl">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/admin/newsletters">
            <ArrowLeft className="mr-2 h-4 w-4" />
            一覧に戻る
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Digital Magazine作成</h1>
        <p className="text-muted-foreground">
          新しいDigital Magazine（第{nextIssueNumber}号）を作成します
        </p>
      </div>

      <NewsletterForm
        mode="create"
        nextIssueNumber={nextIssueNumber}
        categoriesTree={categoriesTree}
      />
    </div>
  );
}
