import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

type SponsorFormBannerProps = {
  className?: string;
};

export function SponsorFormBanner({ className }: SponsorFormBannerProps) {
  return (
    <Alert variant="default" className={cn(className)}>
      <Building2 className="h-4 w-4" />
      <AlertTitle>法人情報の入力が必要です</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-3">
          法人会員の特典（プログラム・ホームページへのロゴ掲載、フラッグ作成など）をご利用いただくために、法人情報の入力をお願いいたします。
        </p>
        <Button asChild size="sm">
          <Link href="/sponsor-form">法人情報を入力する</Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}
