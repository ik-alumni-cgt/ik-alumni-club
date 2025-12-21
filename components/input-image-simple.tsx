"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ImagePlus, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"

type Props = {
  width?: string | number
  aspectRatio?: number
  value: string | null | undefined
  onChange: (value: string) => void
  maxSize?: number
}

export function InputImageSimple({
  width = "100%",
  aspectRatio = 1,
  maxSize = 1024 * 1024 * 10, // 10MB
  value = "",
  onChange,
}: Props) {
  const [isUploading, setIsUploading] = useState(false)

  const uploadToCloudinary = useCallback(async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "")

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    )

    if (!response.ok) {
      throw new Error("Upload failed")
    }

    const data = await response.json()
    return data.secure_url
  }, [])

  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    maxSize,
    multiple: false,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
      "image/gif": [],
    },
    useFsAccessApi: false,
    onDropAccepted: async (dropped) => {
      setIsUploading(true)
      try {
        const url = await uploadToCloudinary(dropped[0])
        onChange(url)
      } catch (error) {
        console.error("Upload error:", error)
        toast.error("画像のアップロードに失敗しました")
      } finally {
        setIsUploading(false)
      }
    },
    onDropRejected: (rejections) => {
      const error = rejections[0]?.errors[0]
      if (error?.code === "file-too-large") {
        toast.error(`ファイルサイズが大きすぎます（最大${Math.round(maxSize / 1024 / 1024)}MB）`)
      } else {
        toast.error("このファイル形式はサポートされていません")
      }
    },
  })

  return (
    <div>
      <div className="relative w-fit">
        <div
          className={cn(
            "border overflow-hidden cursor-pointer rounded-md grid place-content-center relative",
            "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:outline-none ring-offset-background",
            isDragAccept ? "bg-primary scale-105" : "bg-muted",
            isUploading && "pointer-events-none opacity-50",
          )}
          style={{
            aspectRatio,
            width,
          }}
          {...getRootProps()}
        >
          {!value && !isUploading && (
            <ImagePlus className="size-8 text-muted-foreground opacity-30" />
          )}
          {isUploading && (
            <Loader2 className="size-8 text-muted-foreground animate-spin" />
          )}
          {value && !isUploading && (
            <Image
              unoptimized
              className="object-contain"
              fill
              src={value}
              alt=""
            />
          )}
          <input {...getInputProps()} />
          <span className="sr-only">画像を選択</span>
        </div>

        {value && !isUploading && (
          <Button
            type="button"
            variant="outline"
            className="absolute top-2 right-2 size-8 text-muted-foreground"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onChange("")
            }}
          >
            <X size={20} />
            <span className="sr-only">イメージを削除</span>
          </Button>
        )}
      </div>
    </div>
  )
}
