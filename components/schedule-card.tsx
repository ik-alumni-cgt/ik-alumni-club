import { Schedule } from "@/types/schedule";
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
import { Calendar, ExternalLink, ArrowUpDown, Lock } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

export function ScheduleCard({
  schedule,
  showActions = false,
}: {
  schedule: Schedule;
  showActions?: boolean;
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <Badge variant={schedule.published ? "default" : "secondary"}>
              {schedule.published ? "公開" : "下書き"}
            </Badge>
            {schedule.isMemberOnly && (
              <Badge variant="outline" className="flex items-center gap-1 border-amber-500 text-amber-700">
                <Lock className="h-3 w-3" />
                会員限定
              </Badge>
            )}
            <Badge variant="outline" className="flex items-center gap-1">
              <ArrowUpDown className="h-3 w-3" />
              {schedule.sortOrder}
            </Badge>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-1 h-4 w-4" />
            {format(new Date(schedule.eventDate), "yyyy/MM/dd HH:mm", { locale: ja })}
          </div>
        </div>
        <CardTitle className="line-clamp-2">{schedule.title}</CardTitle>
        <CardDescription className="line-clamp-3">
          {schedule.content}
        </CardDescription>
      </CardHeader>
      {schedule.imageUrl && (
        <CardContent>
          <div className="relative aspect-video w-full">
            <Image
              src={schedule.imageUrl}
              alt={schedule.title}
              fill
              className="rounded-md object-cover"
            />
          </div>
        </CardContent>
      )}
      <CardFooter className="mt-auto flex gap-2">
        {showActions && (
          <Button asChild variant="outline" className="w-full">
            <Link href={`/admin/schedules/${schedule.id}`}>編集</Link>
          </Button>
        )}
        {schedule.linkUrl && (
          <Button asChild variant="ghost" size="sm">
            <a href={schedule.linkUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
