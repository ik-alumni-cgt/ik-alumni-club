interface AnniversaryCardProps {
  children: React.ReactNode
  className?: string
}

/** 暗色透過 + 金枠カード - 五周年記念ページ共通コンポーネント */
export function AnniversaryCard({
  children,
  className = "",
}: AnniversaryCardProps) {
  return (
    <div
      className={`relative rounded-lg border border-[#c9a227]/50 px-8 py-12 md:px-16 md:py-16 text-center overflow-hidden ${className}`}
    >
      {/* 暗色の透過背景 */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      {/* コンテンツ */}
      <div className="relative">{children}</div>
    </div>
  )
}
