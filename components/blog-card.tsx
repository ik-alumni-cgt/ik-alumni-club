import { Blog } from "@/types/blog";
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
import { Calendar, Eye, Lock } from "lucide-react";

export function BlogCard({
  blog,
  isAdmin = false,
}: {
  blog: Blog;
  isAdmin?: boolean;
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <Badge variant={blog.published ? "default" : "secondary"}>
              {blog.published ? "公開" : "下書き"}
            </Badge>
            {blog.isMemberOnly && (
              <Badge variant="outline" className="flex items-center gap-1 border-amber-500 text-amber-700">
                <Lock className="h-3 w-3" />
                会員限定
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Eye className="mr-1 h-4 w-4" />
              {blog.viewCount}
            </div>
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              {new Date(blog.createdAt).toLocaleDateString("ja-JP")}
            </div>
          </div>
        </div>
        <CardTitle className="line-clamp-2">{blog.title}</CardTitle>
        <CardDescription className="line-clamp-3">
          {blog.excerpt}
        </CardDescription>
      </CardHeader>
      {blog.thumbnailUrl && (
        <CardContent>
          <div className="relative aspect-video w-full">
            <Image
              src={blog.thumbnailUrl}
              alt={blog.title}
              fill
              className="rounded-md object-cover"
            />
          </div>
        </CardContent>
      )}
      <CardFooter className="mt-auto flex gap-2">
        {isAdmin ? (
          <Button asChild variant="outline" className="w-full">
            <Link href={`/admin/blogs/${blog.id}`}>編集</Link>
          </Button>
        ) : (
          <Button asChild className="w-full">
            <Link href={`/blogs/${blog.id}`}>続きを読む</Link>
          </Button>
        )}
      </CardFooter>
      {blog.authorName && (
        <CardFooter className="pt-0 text-sm text-muted-foreground">
          投稿者: {blog.authorName}
        </CardFooter>
      )}
    </Card>
  );
}
