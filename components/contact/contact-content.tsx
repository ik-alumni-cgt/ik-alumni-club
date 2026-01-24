import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ContactContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>お問い合わせ</CardTitle>
        <CardDescription>
          ご質問・ご要望などがございましたらお気軽にご連絡ください。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            お問い合わせは下記メールアドレスまでご連絡をお願いいたします。
          </p>
          <div className="flex justify-center">
            <a
              href="mailto:cgt.ik.est2022@gmail.com"
              className="text-primary hover:underline font-medium"
            >
              cgt.ik.est2022@gmail.com
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-4">
          <Button asChild className="w-full min-h-11">
            <Link href="/">Homeに戻る</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
