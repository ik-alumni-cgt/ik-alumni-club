"use client";

import {
  LayoutDashboard,
  Users,
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
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

type MenuItem = {
  title: string;
  icon: LucideIcon;
  url: string;
};

type MenuGroup = {
  label: string;
  items: MenuItem[];
};

const menuGroups: MenuGroup[] = [
  {
    label: "メイン",
    items: [
      {
        title: "ダッシュボード",
        icon: LayoutDashboard,
        url: "/admin/dashboard",
      },
    ],
  },
  {
    label: "コンテンツ管理",
    items: [
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
    ],
  },
  {
    label: "会員管理",
    items: [
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
    ],
  },
  {
    label: "その他",
    items: [
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
    ],
  },
];

function isActiveUrl(pathname: string, url: string): boolean {
  if (url === "#") return false;
  // ロケールプレフィックスを除去して比較
  const normalizedPathname = pathname.replace(/^\/[a-z]{2}(?=\/)/, "");
  return normalizedPathname.startsWith(url);
}

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-3 px-3 py-4">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand text-white">
            <ShieldCheck className="size-5" />
          </div>
          <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-semibold">管理者パネル</span>
            <span className="truncate text-xs text-sidebar-foreground/60">
              Alumni Club
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {menuGroups.map((group, groupIndex) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = isActiveUrl(pathname, item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        isActive={active}
                        className="rounded-lg"
                      >
                        <Link href={item.url}>
                          <item.icon className="size-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <div className="px-3 py-3 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
          <p className="text-xs text-sidebar-foreground/50 group-data-[collapsible=icon]:hidden">
            IK Alumni Club Admin
          </p>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
