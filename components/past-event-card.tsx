import { PastEvent } from "@/types/past-event";
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
import { Calendar, Lock } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

export function PastEventCard({
  pastEvent,
  showActions = false,
}: {
  pastEvent: PastEvent;
  showActions?: boolean;
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <Badge variant={pastEvent.published ? "default" : "secondary"}>
              {pastEvent.published ? "公開" : "下書き"}
            </Badge>
            {pastEvent.isMemberOnly && (
              <Badge variant="outline" className="flex items-center gap-1 border-amber-500 text-amber-700">
                <Lock className="h-3 w-3" />
                会員限定
              </Badge>
            )}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-1 h-4 w-4" />
            {format(new Date(pastEvent.eventDate), "yyyy/MM/dd HH:mm", { locale: ja })}
          </div>
        </div>
        <CardTitle className="line-clamp-2">{pastEvent.title}</CardTitle>
        <CardDescription className="line-clamp-3">
          {pastEvent.description}
        </CardDescription>
      </CardHeader>
      {pastEvent.imageUrl && (
        <CardContent>
          <div className="relative h-48 w-full">
            <Image
              src={pastEvent.imageUrl}
              alt={pastEvent.title}
              fill
              className="rounded-md object-cover"
            />
          </div>
        </CardContent>
      )}
      <CardFooter className="mt-auto flex gap-2">
        {showActions && (
          <Button asChild variant="outline" className="w-full">
            <Link href={`/admin/past-events/${pastEvent.id}`}>編集</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
