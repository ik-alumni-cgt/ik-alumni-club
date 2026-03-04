"use client"

import { type Editor } from "@tiptap/react"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  Link2,
  Image as ImageIcon,
  Loader2,
} from "lucide-react"
import { generateBlogImagePresignedUrl } from "@/actions/blog-image"
import { toast } from "sonner"

interface EditorToolbarProps {
  editor: Editor | null
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  if (!editor) return null

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const { presignedUrl, publicUrl } = await generateBlogImagePresignedUrl(file.type)
      const response = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      })
      if (!response.ok) {
        throw new Error(`アップロードに失敗しました (${response.status})`)
      }
      editor.chain().focus().setImage({ src: publicUrl }).run()
      toast.success("画像をアップロードしました")
    } catch (error) {
      console.error("ブログ画像アップロードエラー:", error)
      toast.error(
        error instanceof Error ? error.message : "画像のアップロードに失敗しました"
      )
    } finally {
      setIsUploading(false)
      if (imageInputRef.current) {
        imageInputRef.current.value = ""
      }
    }
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href as string | undefined
    const url = window.prompt("URLを入力してください", previousUrl ?? "")
    if (url === null) return
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }

  return (
    <div className="flex flex-wrap gap-0.5 border-b p-1.5 bg-muted/30">
      {/* 見出し */}
      <Button
        type="button"
        size="sm"
        variant={editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className="h-8 w-8 p-0"
        title="見出し1"
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant={editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className="h-8 w-8 p-0"
        title="見出し2"
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant={editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className="h-8 w-8 p-0"
        title="見出し3"
      >
        <Heading3 className="h-4 w-4" />
      </Button>

      <div className="mx-1 w-px bg-border self-stretch" />

      {/* テキスト装飾 */}
      <Button
        type="button"
        size="sm"
        variant={editor.isActive("bold") ? "secondary" : "ghost"}
        onClick={() => editor.chain().focus().toggleBold().run()}
        className="h-8 w-8 p-0"
        title="太字"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant={editor.isActive("italic") ? "secondary" : "ghost"}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className="h-8 w-8 p-0"
        title="イタリック"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant={editor.isActive("strike") ? "secondary" : "ghost"}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className="h-8 w-8 p-0"
        title="取り消し線"
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant={editor.isActive("code") ? "secondary" : "ghost"}
        onClick={() => editor.chain().focus().toggleCode().run()}
        className="h-8 w-8 p-0"
        title="インラインコード"
      >
        <Code className="h-4 w-4" />
      </Button>

      <div className="mx-1 w-px bg-border self-stretch" />

      {/* リスト */}
      <Button
        type="button"
        size="sm"
        variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className="h-8 w-8 p-0"
        title="箇条書き"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className="h-8 w-8 p-0"
        title="番号付きリスト"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <div className="mx-1 w-px bg-border self-stretch" />

      {/* ブロック要素 */}
      <Button
        type="button"
        size="sm"
        variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className="h-8 w-8 p-0"
        title="引用"
      >
        <Quote className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="h-8 w-8 p-0"
        title="水平線"
      >
        <Minus className="h-4 w-4" />
      </Button>

      <div className="mx-1 w-px bg-border self-stretch" />

      {/* リンク・画像 */}
      <Button
        type="button"
        size="sm"
        variant={editor.isActive("link") ? "secondary" : "ghost"}
        onClick={setLink}
        className="h-8 w-8 p-0"
        title="リンク"
      >
        <Link2 className="h-4 w-4" />
      </Button>

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
      />
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => imageInputRef.current?.click()}
        disabled={isUploading}
        className="h-8 w-8 p-0"
        title="画像をアップロード"
      >
        {isUploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ImageIcon className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}
