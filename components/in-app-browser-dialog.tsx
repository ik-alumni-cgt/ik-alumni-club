"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Copy } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const SESSION_STORAGE_KEY = "in-app-browser-dialog-dismissed"

function isInAppBrowser(): boolean {
  if (typeof navigator === "undefined") return false
  const ua = navigator.userAgent
  return /Line\/|Instagram|FBAN|FBAV|Twitter|; wv\)|WebView/i.test(ua)
}

export function InAppBrowserDialog() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!isInAppBrowser()) return
    const dismissed = sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (dismissed) return
    setOpen(true)
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success("URLをコピーしました")
    } catch {
      toast.error("コピーに失敗しました")
    }
  }

  const handleDismiss = () => {
    sessionStorage.setItem(SESSION_STORAGE_KEY, "true")
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Webブラウザで開いてください</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                アクセスいただきありがとうございます。
              </p>
              <p>
                このままではログインや会員登録が正常に動作しない場合があります。
                下のボタンでURLをコピーして、お使いのWebブラウザ（Safari、Chromeなど）で開き直してください。
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
          <AlertDialogAction onClick={handleCopy} className="w-full">
            <Copy className="h-4 w-4 mr-2" />
            URLをコピーする
          </AlertDialogAction>
          <AlertDialogCancel onClick={handleDismiss} className="w-full">
            このまま続ける
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
