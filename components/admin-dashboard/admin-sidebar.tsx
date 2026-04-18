"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import Link from "next/link";
import NextImage from "next/image";
import { usePathname } from "next/navigation";
import logoMain from "@/components/header/logo_main.png";
import {
  mainItems,
  contentItems,
  memberItems,
  otherItems,
} from "./admin-menu-items";
import type { MenuItem } from "./admin-menu-items";

function isActiveUrl(pathname: string, url: string): boolean {
  if (url === "#") return false;
  const normalizedPathname = pathname.replace(/^\/[a-z]{2}(?=\/)/, "");
  return normalizedPathname.startsWith(url);
}

function MenuSection({ items, pathname }: { items: MenuItem[]; pathname: string }) {
  return (
    <SidebarGroup className="p-0">
      <SidebarGroupContent>
        <SidebarMenu className="gap-px px-2">
          {items.map((item) => {
            const active = isActiveUrl(pathname, item.url);
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={active}
                  className="h-9 rounded-md font-medium text-black hover:bg-sidebar-accent hover:text-sidebar-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-foreground"
                >
                  <Link href={item.url}>
                    <item.icon className="!size-4" />
                    <span className="text-[13px]">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-2 pt-2 pb-0">
        <Link
          href="/admin/dashboard"
          className="flex h-10 items-center gap-2.5 rounded-md px-2.5 hover:bg-sidebar-accent group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
        >
          <div className="flex size-5 shrink-0 items-center justify-center">
            <NextImage
              src={logoMain}
              alt="IK ALUMNI CGT"
              width={20}
              height={20}
              className="object-contain"
            />
          </div>
          <span className="truncate text-[13px] font-semibold group-data-[collapsible=icon]:hidden">
            IK ALUMNI CGT
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="pt-2">
        <MenuSection items={mainItems} pathname={pathname} />
        <MenuSection items={contentItems} pathname={pathname} />
        <SidebarSeparator className="mx-2 bg-gray-100" />
        <MenuSection items={memberItems} pathname={pathname} />
        <SidebarSeparator className="mx-2 bg-gray-100" />
        <MenuSection items={otherItems} pathname={pathname} />
      </SidebarContent>
      <SidebarRail className="after:bg-gray-100 after:w-px" />
    </Sidebar>
  );
}
