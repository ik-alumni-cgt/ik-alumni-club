import { getAllPastEvents } from "@/data/past-event";
import { PastEventCard } from "@/components/past-event-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AdminPastEventsPage() {
  const pastEvents = await getAllPastEvents();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">過去のイベント管理</h1>
        <Button asChild>
          <Link href="/admin/past-events/new">新規作成</Link>
        </Button>
      </div>

      {pastEvents.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg mb-4">過去のイベントがありません</h3>
          <Button asChild>
            <Link href="/admin/past-events/new">新規作成</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {pastEvents.map((pastEvent) => (
            <PastEventCard key={pastEvent.id} pastEvent={pastEvent} showActions />
          ))}
        </div>
      )}
    </div>
  );
}
