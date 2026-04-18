"use client";

import { Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Props = {
  isMemberOnly: boolean;
};

export function MemberOnlyBadgeCell({ isMemberOnly }: Props) {
  if (!isMemberOnly) {
    return null;
  }

  return (
    <Badge variant="outline" className="border-amber-500 text-amber-500">
      <Lock className="mr-1 h-3 w-3" />
      会員限定
    </Badge>
  );
}
