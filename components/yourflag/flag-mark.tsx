type Props = {
  className?: string
}

// YOURFLAG のシンボル。オレンジ（団体）とブルー（支援者）の2本旗。
export function FlagMark({ className }: Props) {
  return (
    <svg viewBox="0 0 48 40" className={className} fill="none" aria-hidden>
      {/* orange flag */}
      <path
        d="M6 4c4 3 8 3 12 0v18c-4 3-8 3-12 0V4Z"
        fill="#FF9300"
      />
      {/* stripes */}
      <path d="M20 3.4c1.6-1 3.2-1 4.8 0v18c-1.6 1-3.2 1-4.8 0v-18Z" fill="#FF9300" />
      <path d="M25.2 3.4c1-.6 1.9-.7 2.8-.3v18c-.9-.4-1.8-.3-2.8.3v-18Z" fill="#00B0F0" />
      {/* blue flag */}
      <path
        d="M30 3c4-3 8-3 12 0v18c-4 3-8 3-12 0V3Z"
        fill="#00B0F0"
      />
    </svg>
  )
}
