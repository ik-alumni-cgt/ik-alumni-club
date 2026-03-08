import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const MENU_ITEMS = [
  { label: "VIDEO", href: "/member/video" },
  { label: "DIGITAL MAGAZINE", href: "/member/newsletter" },
  { label: "PHOTO LIBRARY", href: "/member/photo-library" },
  { label: "EXCLUSIVE BLOG", href: "/member/blog" },
] as const;

export function SupportersClubMenu() {
  return (
    <Card className="mb-6 overflow-hidden bg-gradient-to-br from-cyan-400 via-blue-400 to-cyan-500">
      <CardHeader className="pb-4">
        <CardTitle className="text-white">SUPPORTER&apos;S CLUB</CardTitle>
        <p className="text-sm text-white/80">会員限定コンテンツ</p>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full bg-blue-500 rounded-lg p-4">
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-base font-medium text-white hover:text-white/70 transition-colors text-center py-2"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
