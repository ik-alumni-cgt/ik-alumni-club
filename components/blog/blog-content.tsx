"use client"

import { useState, useEffect } from "react"
import DOMPurify from "dompurify"

export function BlogContent({ html }: { html: string }) {
  // 初期値はSSRと同じ生HTMLにしてハイドレーションミスマッチを防ぐ
  // マウント後にDOMPurifyでサニタイズする
  const [sanitized, setSanitized] = useState(html)

  useEffect(() => {
    setSanitized(DOMPurify.sanitize(html))
  }, [html])

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: sanitized,
      }}
    />
  )
}
