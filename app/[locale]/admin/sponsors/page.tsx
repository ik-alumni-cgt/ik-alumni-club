import { getAllSponsors } from "@/data/sponsor";
import { DataTable } from "@/components/ui/data-table";
import {
  sponsorsColumns,
  type SponsorForTable,
} from "@/components/admin/tables/columns/sponsors-columns";

export default async function AdminSponsorsPage() {
  const sponsors = await getAllSponsors();

  const data: SponsorForTable[] = sponsors.map((sponsor) => ({
    id: sponsor.id,
    companyName: sponsor.companyName,
    logoUrl: sponsor.logoUrl,
    representativeName: sponsor.representativeName,
    hasFlag: sponsor.hasFlag,
    programConsent: sponsor.programConsent,
    websiteConsent: sponsor.websiteConsent,
    createdAt: sponsor.createdAt.toISOString(),
  }));

  return (
    <div className="container py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">スポンサー回答管理</h1>
        <p className="text-muted-foreground">
          スポンサーからの回答を確認・管理できます
        </p>
      </div>

      <DataTable
        columns={sponsorsColumns}
        data={data}
        searchKey="companyName"
        searchPlaceholder="企業名で検索..."
        emptyState={{
          title: "回答がありません",
          description: "まだスポンサーからの回答がありません",
        }}
      />
    </div>
  );
}
