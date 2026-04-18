"use client";

import {
  LayoutDashboard,
  Users,
  UserCircle,
  Bell,
  Calendar,
  CalendarDays,
  Video,
  FileText,
  Newspaper,
  Image,
  Settings,
  Building2,
  ClipboardList,
  Tags,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
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
import type { LucideIcon } from "lucide-react";

type MenuItem = {
  title: string;
  icon: LucideIcon;
  url: string;
};

const mainItems: MenuItem[] = [
  {
    title: "ダッシュボード",
    icon: LayoutDashboard,
    url: "/admin/dashboard",
  },
];

const contentItems: MenuItem[] = [
  {
    title: "お知らせ管理",
    icon: Bell,
    url: "/admin/informations",
  },
  {
    title: "Digital Magazine",
    icon: Newspaper,
    url: "/admin/newsletters",
  },
  {
    title: "ブログ管理",
    icon: FileText,
    url: "/admin/blogs",
  },
  {
    title: "動画管理",
    icon: Video,
    url: "/admin/videos",
  },
  {
    title: "スケジュール管理",
    icon: Calendar,
    url: "/admin/schedules",
  },
  {
    title: "過去のイベント",
    icon: CalendarDays,
    url: "/admin/past-events",
  },
  {
    title: "フォトライブラリ",
    icon: Image,
    url: "/admin/photo-library",
  },
  {
    title: "プロフィールメンバー",
    icon: UserCircle,
    url: "/admin/profile-members",
  },
];

const memberItems: MenuItem[] = [
  {
    title: "会員管理",
    icon: Users,
    url: "/admin/accounts",
  },
  {
    title: "システムアカウント",
    icon: ShieldCheck,
    url: "/admin/system-accounts",
  },
  {
    title: "役員ビュー",
    icon: ClipboardList,
    url: "/officer/members",
  },
];

const otherItems: MenuItem[] = [
  {
    title: "カテゴリー管理",
    icon: Tags,
    url: "/admin/categories",
  },
  {
    title: "スポンサー管理",
    icon: Building2,
    url: "/admin/sponsors",
  },
  {
    title: "お問い合わせ",
    icon: MessageSquare,
    url: "/admin/contacts",
  },
  {
    title: "設定",
    icon: Settings,
    url: "#",
  },
];

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
                  className="h-9 rounded-md font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-foreground"
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
        <SidebarSeparator className="mx-2" />
        <MenuSection items={contentItems} pathname={pathname} />
        <SidebarSeparator className="mx-2" />
        <MenuSection items={memberItems} pathname={pathname} />
        <SidebarSeparator className="mx-2" />
        <MenuSection items={otherItems} pathname={pathname} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
