import { ContentsHeader } from "@/components/contents/contents-header";
import { ContentsCard } from "@/components/contents/contents-card";
import { getTranslations } from "next-intl/server";
import { getRecentBlogs } from "@/data/blog";
import Link from "next/link";
import { format } from "date-fns";

export async function BlogContents() {
  const t = await getTranslations("Contents");
  const blogs = await getRecentBlogs(3);

  return (
    <div className="flex flex-col">
      <ContentsHeader title={t("blog")} viewAllHref="/blog" />
      <div className="flex flex-col gap-[30px] mt-[60px]">
        {blogs.length === 0 ? (
          <p>配信までしばらくお待ちください</p>
        ) : (
          blogs.map((blog) => (
            <Link key={blog.id} href={`/blog/${blog.id}`}>
              <ContentsCard
                title={blog.title}
                date={format(new Date(blog.createdAt), "yyyy/MM/dd")}
              />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
