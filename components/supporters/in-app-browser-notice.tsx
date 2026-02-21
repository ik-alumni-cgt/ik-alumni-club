"use client"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"

const SUPPORTERS_URL = "https://www.ik-alumni-cgt.com/supporters"

export function InAppBrowserNotice() {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORTERS_URL)
      toast.success("URLをコピーしました")
    } catch {
      toast.error("コピーに失敗しました")
    }
  }

  return (
    <div className="mb-8 rounded-lg bg-white/10 backdrop-blur-sm p-4 text-center">
      <p className="text-sm text-white mb-2">
        ※他のアプリで開いた場合、エラーが出る場合がございます。
      </p>
      <p className="text-sm text-white mb-3">
        （スマートフォンのQRコード読み取りアプリやLINE等）
      </p>
      <p className="text-sm text-white mb-3">
        お手数ですが、ブラウザアプリ（Safariなど）でこのURLを開くか、
        <br />
        URLをコピーしてブラウザアプリに貼り付けて開いてください。
      </p>
      <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
        <a
          href={SUPPORTERS_URL}
          className="text-sm font-medium text-white underline underline-offset-4 hover:text-white/90 break-all"
        >
          {SUPPORTERS_URL}
        </a>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="shrink-0 border-2 border-white bg-white/90 text-blue-600 hover:bg-white hover:text-blue-700"
        >
          <Copy className="h-4 w-4 mr-1" />
          コピー
        </Button>
      </div>
    </div>
  )
}
