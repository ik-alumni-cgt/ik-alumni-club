"use client";

import { Badge } from "@/components/ui/badge";

type Props = {
  published: boolean;
};

export function PublishedBadgeCell({ published }: Props) {
  return published ? (
    <Badge variant="default">公開</Badge>
  ) : (
    <Badge variant="secondary">下書き</Badge>
  );
}
