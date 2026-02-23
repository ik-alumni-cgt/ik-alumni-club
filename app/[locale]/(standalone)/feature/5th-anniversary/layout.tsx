import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "五周年記念コンサート | IK Alumni Club",
  description: "IK ALUMNI COLOR GUARD TEAM 五周年記念コンサート特設ページ",
}

export default function AnniversaryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
