interface AnniversaryCardProps {
  children: React.ReactNode
  className?: string
}

/** 赤グラデーション透過カード - 五周年記念ページ共通コンポーネント */
export function AnniversaryCard({
  children,
  className = "",
}: AnniversaryCardProps) {
  return (
    <div
      className={`relative rounded-lg px-8 py-12 md:px-16 md:py-16 text-center overflow-hidden ${className}`}
    >
      {/* 透過グラデーション背景 */}
      <div className="absolute inset-0 bg-gradient-red opacity-80" />
      {/* コンテンツ */}
      <div className="relative">{children}</div>
    </div>
  )
}
