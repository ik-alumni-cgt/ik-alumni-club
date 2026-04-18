"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PublishedBadgeCell } from "@/components/admin/tables/cells/published-badge-cell";
import { MemberOnlyBadgeCell } from "@/components/admin/tables/cells/member-only-badge-cell";
import { DateCell } from "@/components/admin/tables/cells/date-cell";
import type { ContentForTable } from "@/components/admin/tables/columns/content-columns";

type Props = {
  content: ContentForTable;
  editBasePath: string;
};

export function ContentDetailPanel({ content, editBasePath }: Props) {
  return (
    <div className="space-y-6">
      {content.imageUrl && (
        <div className="relative aspect-video w-full overflow-hidden rounded-md">
          <Image
            src={content.imageUrl}
            alt={content.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">タイトル</p>
        <p className="text-base font-medium">{content.title}</p>
      </div>

      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">ステータス</p>
        <div className="flex items-center gap-1.5 pt-1">
          <PublishedBadgeCell published={content.published} />
          <MemberOnlyBadgeCell isMemberOnly={content.isMemberOnly} />
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">更新日</p>
        <DateCell date={content.updatedAt} />
      </div>

      <Separator />

      <Button asChild className="w-full">
        <Link href={`${editBasePath}/${content.id}`}>編集する</Link>
      </Button>
    </div>
  );
}
