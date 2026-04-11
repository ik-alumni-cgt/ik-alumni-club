import { Information } from "@/types/information";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ExternalLink, Lock } from "lucide-react";

export function InformationCard({
  information,
  showActions = false,
}: {
  information: Information;
  showActions?: boolean;
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <Badge variant={information.published ? "default" : "secondary"}>
              {information.published ? "公開" : "下書き"}
            </Badge>
            {information.isMemberOnly && (
              <Badge variant="outline" className="flex items-center gap-1 border-amber-500 text-amber-700">
                <Lock className="h-3 w-3" />
                会員限定
              </Badge>
            )}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-1 h-4 w-4" />
            {information.date}
          </div>
        </div>
        <CardTitle className="line-clamp-2">{information.title}</CardTitle>
        <CardDescription className="line-clamp-3">
          {information.content}
        </CardDescription>
      </CardHeader>
      {information.imageUrl && (
        <CardContent>
          <div className="relative aspect-video w-full">
            <Image
              src={information.imageUrl}
              alt={information.title}
              fill
              className="rounded-md object-cover"
            />
          </div>
        </CardContent>
      )}
      <CardFooter className="mt-auto flex gap-2">
        {showActions && (
          <Button asChild variant="outline" className="w-full">
            <Link href={`/admin/informations/${information.id}`}>編集</Link>
          </Button>
        )}
        {information.url && (
          <Button asChild variant="ghost" size="sm">
            <a href={information.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
