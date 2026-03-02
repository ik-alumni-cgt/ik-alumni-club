"use client";

import { useTransition } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { toggleWelcomeGift } from "@/actions/officer/toggle-welcome-gift";

type Props = {
  memberId: string;
  initialChecked: boolean;
};

export function WelcomeGiftCheckbox({ memberId, initialChecked }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (checked: boolean) => {
    startTransition(async () => {
      await toggleWelcomeGift(memberId, checked);
    });
  };

  return (
    <Checkbox
      defaultChecked={initialChecked}
      disabled={isPending}
      onCheckedChange={handleChange}
      aria-label="初回特典郵送済みにする"
    />
  );
}
