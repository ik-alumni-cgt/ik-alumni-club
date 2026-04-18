"use client";

type Props = {
  date: string | null;
  showTime?: boolean;
};

export function DateCell({ date, showTime = false }: Props) {
  if (!date) {
    return <span className="text-muted-foreground">-</span>;
  }

  const d = new Date(date);

  if (showTime) {
    return (
      <span className="text-sm text-muted-foreground">
        {d.toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    );
  }

  return (
    <span className="text-sm text-muted-foreground">
      {d.toLocaleDateString("ja-JP")}
    </span>
  );
}
