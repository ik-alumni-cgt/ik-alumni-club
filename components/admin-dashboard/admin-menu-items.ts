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
  GalleryHorizontal,
  Images,
  Settings,
  Building2,
  ClipboardList,
  Tags,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type MenuItem = {
  title: string;
  icon: LucideIcon;
  url: string;
};

export const mainItems: MenuItem[] = [
  {
    title: "ダッシュボード",
    icon: LayoutDashboard,
    url: "/admin/dashboard",
  },
];

export const contentItems: MenuItem[] = [
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
    title: "ヒーローカルーセル",
    icon: GalleryHorizontal,
    url: "/admin/hero-carousel",
  },
  {
    title: "メイン写真",
    icon: Images,
    url: "/admin/hero-background",
  },
  {
    title: "プロフィールメンバー",
    icon: UserCircle,
    url: "/admin/profile-members",
  },
];

export const memberItems: MenuItem[] = [
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

export const otherItems: MenuItem[] = [
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

export const adminMenuItems: MenuItem[] = [
  ...mainItems,
  ...contentItems,
  ...memberItems,
  ...otherItems,
];
