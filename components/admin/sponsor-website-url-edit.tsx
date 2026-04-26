"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateSponsorWebsiteUrl } from "@/actions/sponsor"

type Props = {
  sponsorId: string
  initialWebsiteUrl: string | null
}

export function SponsorWebsiteUrlEdit({ sponsorId, initialWebsiteUrl }: Props) {
  const router = useRouter()
  const [websiteUrl, setWebsiteUrl] = useState<string>(initialWebsiteUrl ?? "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isDirty = (websiteUrl.trim() || null) !== (initialWebsiteUrl || null)

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      await updateSponsorWebsiteUrl(sponsorId, websiteUrl || null)
      toast.success("企業URLを更新しました")
      router.refresh()
    } catch (error) {
      toast.error("エラーが発生しました", {
        description:
          error instanceof Error ? error.message : "URLの更新に失敗しました",
      })
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-2">
      <Input
        type="url"
        placeholder="例: https://example.com"
        value={websiteUrl}
        onChange={(e) => setWebsiteUrl(e.target.value)}
      />
      <Button
        type="button"
        size="sm"
        onClick={handleSave}
        disabled={!isDirty || isSubmitting}
      >
        {isSubmitting ? "保存中..." : "URLを保存"}
      </Button>
    </div>
  )
}
