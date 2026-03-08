"use client";

import Image from "next/image";
import { PlanCode } from "@/types/member-plan";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreditCard } from "lucide-react";

const PLAN_CODE_TO_IMAGE: Record<PlanCode, string> = {
  individual: "individual_membership_card.jpg",
  business: "business_membership_card.jpg",
  platinum_individual: "platinum_membership_card.jpg",
  platinum_business: "platinum_membership_card.jpg",
};

type MembershipCardImageProps = {
  planCode: PlanCode;
};

export function MembershipCardImage({ planCode }: MembershipCardImageProps) {
  const imageFile = PLAN_CODE_TO_IMAGE[planCode];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mb-6 min-h-11">
          <CreditCard className="mr-2 h-4 w-4" />
          会員カードを表示
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-lg border-none bg-transparent p-0 shadow-none"
        showCloseButton={false}
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">会員カード</DialogTitle>
        <Image
          src={`/membership-cards/${imageFile}`}
          alt="会員カード"
          width={1280}
          height={800}
          className="w-full h-auto rounded-lg"
        />
        <DialogClose asChild>
          <Button variant="secondary" className="w-full min-h-11">
            閉じる
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
