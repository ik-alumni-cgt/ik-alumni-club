"use client"

import { type Editor } from "@tiptap/react"
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
} from "lucide-react"

interface EmailEditorToolbarProps {
  editor: Editor | null
}

export function EmailEditorToolbar({ editor }: EmailEditorToolbarProps) {
  if (!editor) return null

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
    </div>
  )
}
