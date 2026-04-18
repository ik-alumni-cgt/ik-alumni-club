"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { adminMenuItems } from "./admin-menu-items";

function getPageTitle(pathname: string): string {
  const normalizedPathname = pathname.replace(/^\/[a-z]{2}(?=\/)/, "");
  for (const item of adminMenuItems) {
    if (item.url !== "#" && normalizedPathname.startsWith(item.url)) {
      return item.title;
    }
  }
  return "";
}

export function AdminHeader() {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-10 shrink-0 items-center border-b border-gray-100 bg-[#fafafa] px-4 mt-2 md:px-6">
      <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
      <h1 className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold text-foreground">
        {pageTitle}
      </h1>
    </header>
  );
}
