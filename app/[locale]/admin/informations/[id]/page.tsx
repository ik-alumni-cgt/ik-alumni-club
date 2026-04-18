import { InformationForm } from "@/components/information-form";
import { InformationCard } from "@/components/information-card";
import { DeleteInformationButton } from "@/components/delete-information-button";
import { Button } from "@/components/ui/button";
import { getInformation } from "@/data/information";
import { getCategoriesTree, getInformationCategoryIds } from "@/data/category";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditInformationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [information, categoriesTree, initialCategoryIds] = await Promise.all([
    getInformation(id),
    getCategoriesTree(),
    getInformationCategoryIds(id),
  ]);

  if (!information) {
    notFound();
  }

  return (
    <div className="container max-w-3xl">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/admin/informations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            一覧に戻る
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">お知らせ編集</h1>
        <p className="text-muted-foreground">お知らせを編集します</p>
      </div>

      <div className="mb-6">
        <h2 className="mb-3 text-lg font-semibold">プレビュー</h2>
        <InformationCard information={information} />
      </div>

      <div className="mb-6">
        <h2 className="mb-3 text-lg font-semibold">編集</h2>
        <InformationForm
          defaultValues={information}
          categoriesTree={categoriesTree}
          initialCategoryIds={initialCategoryIds}
        />
      </div>

      <div className="border-t pt-6">
        <h2 className="mb-3 text-lg font-semibold text-destructive">
          危険な操作
        </h2>
        <DeleteInformationButton
          informationId={information.id}
          informationTitle={information.title}
        />
      </div>
    </div>
  );
}
