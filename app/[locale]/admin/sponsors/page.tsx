import { SponsorCard } from "@/components/sponsor-card"
import { getAllSponsors } from "@/data/sponsor"

export default async function AdminSponsorsPage() {
  const sponsors = await getAllSponsors()

  return (
    <div className="container py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">スポンサー回答管理</h1>
        <p className="text-muted-foreground">
          スポンサーからの回答を確認・管理できます
        </p>
      </div>

      {sponsors.length === 0 ? (
        <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <h3 className="text-lg font-semibold">回答がありません</h3>
            <p className="text-sm text-muted-foreground">
              まだスポンサーからの回答がありません
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sponsors.map((sponsor) => (
            <SponsorCard key={sponsor.id} sponsor={sponsor} />
          ))}
        </div>
      )}
    </div>
  )
}
