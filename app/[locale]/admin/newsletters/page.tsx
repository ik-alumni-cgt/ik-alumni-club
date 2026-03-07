import { Button } from "@/components/ui/button";
import { getAllNewsletters } from "@/data/newsletter";
import { Plus } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Calendar, Lock } from "lucide-react";

export default async function AdminNewslettersPage() {
  const newsletters = await getAllNewsletters();

  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Digital Magazine管理</h1>
          <p className="text-muted-foreground">
            Digital Magazineの作成・編集・削除ができます
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/newsletters/new">
            <Plus className="mr-2 h-4 w-4" />
            新規作成
          </Link>
        </Button>
      </div>

      {newsletters.length === 0 ? (
        <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <h3 className="text-lg font-semibold">Digital Magazineがありません</h3>
            <p className="text-sm text-muted-foreground">
              新しいDigital Magazineを作成してください
            </p>
            <Button asChild className="mt-4">
              <Link href="/admin/newsletters/new">
                <Plus className="mr-2 h-4 w-4" />
                新規作成
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {newsletters.map((newsletter) => (
            <Card key={newsletter.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      第{newsletter.issueNumber}号: {newsletter.title}
                    </CardTitle>
                    <CardDescription>{newsletter.excerpt}</CardDescription>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {newsletter.published ? (
                      <Badge variant="default">公開中</Badge>
                    ) : (
                      <Badge variant="secondary">下書き</Badge>
                    )}
                    {newsletter.isMemberOnly && (
                      <Badge variant="outline" className="flex items-center gap-1 border-amber-500 text-amber-700">
                        <Lock className="h-3 w-3" />
                        会員限定
                      </Badge>
                    )}
                    {newsletter.category && (
                      <Badge variant="outline">
                        {newsletter.category === "regular" && "定期号"}
                        {newsletter.category === "special" && "特別号"}
                        {newsletter.category === "extra" && "号外"}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {newsletter.viewCount} 回閲覧
                  </div>
                  {newsletter.publishedAt && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(newsletter.publishedAt).toLocaleDateString("ja-JP")}
                    </div>
                  )}
                  {newsletter.authorName && (
                    <div>作成者: {newsletter.authorName}</div>
                  )}
                  {newsletter.pdfUrl && (
                    <div>
                      <a
                        href={newsletter.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        PDF版あり
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline">
                  <Link href={`/admin/newsletters/${newsletter.id}`}>編集</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
