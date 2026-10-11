import { NextResponse } from "next/server";
import { getVoteCounts, isVoteClosed } from "@/data/vote";

export const dynamic = "force-dynamic";

// 会場の端末数が多くても DB へのクエリが秒間 1 回程度に収まるよう短時間だけ CDN に載せる
export async function GET() {
  const counts = await getVoteCounts();

  return NextResponse.json(
    { counts, isClosed: isVoteClosed() },
    {
      headers: {
        "Cache-Control": "public, s-maxage=2, stale-while-revalidate=2",
      },
    }
  );
}
