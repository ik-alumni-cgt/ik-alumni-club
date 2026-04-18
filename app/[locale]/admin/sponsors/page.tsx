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
    <div>
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
