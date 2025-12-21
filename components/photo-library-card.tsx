import type { PhotoLibraryWithImages } from "@/types/photo-library";
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
import { Calendar, Eye, Lock, ImageIcon } from "lucide-react";

export function PhotoLibraryCard({
  photo,
  isAdmin = false,
}: {
  photo: PhotoLibraryWithImages;
  isAdmin?: boolean;
}) {
  const thumbnailUrl = photo.coverImageUrl || photo.images[0]?.imageUrl;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <Badge variant={photo.published ? "default" : "secondary"}>
              {photo.published ? "公開" : "下書き"}
            </Badge>
            {photo.isMemberOnly && (
              <Badge variant="outline" className="flex items-center gap-1 border-amber-500 text-amber-700">
                <Lock className="h-3 w-3" />
                会員限定
              </Badge>
            )}
            {photo.images.length > 0 && (
              <Badge variant="secondary">
                {photo.images.length}枚
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Eye className="mr-1 h-4 w-4" />
              {photo.viewCount}
            </div>
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              {new Date(photo.createdAt).toLocaleDateString("ja-JP")}
            </div>
          </div>
        </div>
        <CardTitle className="line-clamp-2">{photo.title}</CardTitle>
        {photo.description && (
          <CardDescription className="line-clamp-2">
            {photo.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="relative h-48 w-full">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={photo.title}
              fill
              className="rounded-md object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-md">
              <ImageIcon className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="mt-auto flex gap-2">
        {isAdmin ? (
          <Button asChild variant="outline" className="w-full">
            <Link href={`/admin/photo-library/${photo.id}`}>編集</Link>
          </Button>
        ) : (
          <Button asChild className="w-full">
            <Link href={`/photo-library/${photo.id}`}>詳細を見る</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
