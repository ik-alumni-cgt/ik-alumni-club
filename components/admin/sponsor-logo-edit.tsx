"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { InputImageSimple } from "@/components/input-image-simple"
import { updateSponsorLogo } from "@/actions/sponsor"

type Props = {
  sponsorId: string
  initialLogoUrl: string | null
}

export function SponsorLogoEdit({ sponsorId, initialLogoUrl }: Props) {
  const router = useRouter()
  const [logoUrl, setLogoUrl] = useState<string>(initialLogoUrl ?? "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isDirty = (logoUrl || null) !== (initialLogoUrl || null)

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      await updateSponsorLogo(sponsorId, logoUrl || null)
      toast.success("ロゴを更新しました")
      router.refresh()
    } catch (error) {
      toast.error("エラーが発生しました", {
        description: "ロゴの更新に失敗しました",
      })
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <InputImageSimple
        width={300}
        value={logoUrl}
        onChange={setLogoUrl}
      />
      <Button
        type="button"
        onClick={handleSave}
        disabled={!isDirty || isSubmitting}
      >
        {isSubmitting ? "保存中..." : "ロゴを保存"}
      </Button>
    </div>
  )
}
