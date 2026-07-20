"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function AccountFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "all") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (key: string, value: string) => {
    const qs = createQueryString({ [key]: value });
    router.push(`${pathname}?${qs}`);
  };

  const handleReset = () => {
    router.push(pathname);
  };

  const hasFilters =
    searchParams.has("status") ||
    searchParams.has("paymentStatus") ||
    searchParams.has("isMigrated");

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        value={searchParams.get("status") ?? "all"}
        onValueChange={(v) => handleFilterChange("status", v)}
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="ステータス" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">すべてのステータス</SelectItem>
          <SelectItem value="active">アクティブ</SelectItem>
          <SelectItem value="pending_approval">承認待ち</SelectItem>
          <SelectItem value="pending_profile">プロフィール入力待ち</SelectItem>
          <SelectItem value="inactive">非アクティブ</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("paymentStatus") ?? "all"}
        onValueChange={(v) => handleFilterChange("paymentStatus", v)}
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="支払いステータス" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">すべての支払い</SelectItem>
          <SelectItem value="completed">支払済</SelectItem>
          <SelectItem value="pending">未払い</SelectItem>
          <SelectItem value="failed">失敗</SelectItem>
          <SelectItem value="canceled">キャンセル</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("isMigrated") ?? "all"}
        onValueChange={(v) => handleFilterChange("isMigrated", v)}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="ユーザー種別" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">すべて</SelectItem>
          <SelectItem value="migrated">移行ユーザー</SelectItem>
          <SelectItem value="existing">新規ユーザー</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={handleReset}>
          リセット
        </Button>
      )}
    </div>
  );
}
