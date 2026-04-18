"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";

const pathLabels: Record<string, string> = {
  admin: "管理者",
  dashboard: "ダッシュボード",
  accounts: "会員管理",
  informations: "お知らせ管理",
  newsletters: "Digital Magazine",
  schedules: "スケジュール管理",
  videos: "動画管理",
  blogs: "ブログ管理",
  categories: "カテゴリー管理",
  "past-events": "過去のイベント",
  "photo-library": "フォトライブラリ",
  sponsors: "スポンサー管理",
  contacts: "お問い合わせ",
  officer: "役員",
  members: "会員一覧",
  new: "新規作成",
  edit: "編集",
};

function getBreadcrumbs(pathname: string) {
  // ロケールプレフィックスを除去
  const withoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/)/, "");
  const segments = withoutLocale.split("/").filter(Boolean);

  return segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = pathLabels[segment] ?? segment;
    const isLast = index === segments.length - 1;
    return { href, label, isLast };
  });
}

export function AdminHeader() {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b bg-[#fafafa] px-4 md:px-6">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
        <Separator orientation="vertical" className="h-5" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <Fragment key={crumb.href}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {crumb.isLast ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={crumb.href}>
                      {crumb.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
