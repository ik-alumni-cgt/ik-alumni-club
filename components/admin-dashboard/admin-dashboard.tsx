import {
  Users,
  UserCheck,
  UserX,
  CreditCard,
  FileText,
  Newspaper,
  Video,
  Calendar,
  Image,
  MessageSquare,
  Bell,
  CalendarDays,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import type { DashboardStats } from "@/data/dashboard";

type MetricCardProps = {
  title: string;
  value: number;
  icon: React.ReactNode;
  href?: string;
  description?: string;
};

function MetricCard({ title, value, icon, href, description }: MetricCardProps) {
  const content = (
    <CardContent className="flex items-center gap-4 p-5">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-brand/10 text-brand">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-semibold">{value.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground/70">
            {description}
          </p>
        )}
      </div>
    </CardContent>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        <Card className="transition-colors hover:bg-muted/50">{content}</Card>
      </Link>
    );
  }

  return <Card>{content}</Card>;
}

type Props = {
  stats: DashboardStats;
  userName: string;
};

export function AdminDashboard({ stats, userName }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">
          {userName}さん、こんにちは
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          管理画面の概要です
        </p>
      </div>

      {/* 会員統計 */}
      <section>
        <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          会員統計
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="総会員数"
            value={stats.members.total}
            icon={<Users className="size-6" />}
            href="/admin/accounts"
          />
          <MetricCard
            title="アクティブ会員"
            value={stats.members.active}
            icon={<UserCheck className="size-6" />}
            href="/admin/accounts"
          />
          <MetricCard
            title="プロフィール未入力"
            value={stats.members.pendingProfile}
            icon={<UserX className="size-6" />}
            href="/admin/accounts"
          />
          <MetricCard
            title="支払済み"
            value={stats.payment.completed}
            icon={<CreditCard className="size-6" />}
            href="/admin/accounts"
            description={
              stats.payment.pending > 0
                ? `未払い: ${stats.payment.pending}件`
                : undefined
            }
          />
        </div>
      </section>

      {/* 会員内訳 */}
      <section>
        <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          会員内訳
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/admin/accounts" className="block">
            <Card className="transition-colors hover:bg-muted/50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">移行会員</span>
                  <span className="text-xl font-semibold">
                    {stats.memberType.migrated}
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-amber-500"
                    style={{
                      width: `${stats.members.total > 0 ? (stats.memberType.migrated / stats.members.total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin/accounts" className="block">
            <Card className="transition-colors hover:bg-muted/50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">新規会員</span>
                  <span className="text-xl font-semibold">
                    {stats.memberType.new}
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{
                      width: `${stats.members.total > 0 ? (stats.memberType.new / stats.members.total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin/accounts" className="block">
            <Card className="transition-colors hover:bg-muted/50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    支払い失敗
                  </span>
                  <span className="text-xl font-semibold text-destructive">
                    {stats.payment.failed}
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-destructive"
                    style={{
                      width: `${stats.members.total > 0 ? (stats.payment.failed / stats.members.total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* コンテンツ統計 */}
      <section>
        <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          コンテンツ
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="お知らせ"
            value={stats.content.informations}
            icon={<Bell className="size-6" />}
            href="/admin/informations"
          />
          <MetricCard
            title="Digital Magazine"
            value={stats.content.newsletters}
            icon={<Newspaper className="size-6" />}
            href="/admin/newsletters"
          />
          <MetricCard
            title="ブログ"
            value={stats.content.blogs}
            icon={<FileText className="size-6" />}
            href="/admin/blogs"
          />
          <MetricCard
            title="動画"
            value={stats.content.videos}
            icon={<Video className="size-6" />}
            href="/admin/videos"
          />
          <MetricCard
            title="スケジュール"
            value={stats.content.schedules}
            icon={<Calendar className="size-6" />}
            href="/admin/schedules"
          />
          <MetricCard
            title="過去のイベント"
            value={stats.content.pastEvents}
            icon={<CalendarDays className="size-6" />}
            href="/admin/past-events"
          />
          <MetricCard
            title="フォトライブラリ"
            value={stats.content.photos}
            icon={<Image className="size-6" />}
            href="/admin/photo-library"
          />
          <MetricCard
            title="お問い合わせ"
            value={stats.contacts}
            icon={<MessageSquare className="size-6" />}
            href="/admin/contacts"
          />
        </div>
      </section>
    </div>
  );
}
