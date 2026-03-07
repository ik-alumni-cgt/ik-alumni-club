"use client";

import { useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { EmailEditorToolbar } from "@/components/editor/email-editor-toolbar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { sendBulkEmailAction } from "@/actions/admin/send-bulk-email";

type SelectedMember = {
  id: string;
  email: string;
  name: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedMembers: SelectedMember[];
  onSendComplete: () => void;
};

function formatRecipientLabel(members: SelectedMember[]) {
  if (members.length === 0) return "";
  if (members.length <= 3) return members.map((m) => m.name).join("、");
  return `${members[0].name} 他${members.length - 1}件`;
}

export function BulkEmailDialog({
  open,
  onOpenChange,
  selectedMembers,
  onSendComplete,
}: Props) {
  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [isBodyEmpty, setIsBodyEmpty] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const isSendingRef = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false,
        link: {
          openOnClick: false,
          HTMLAttributes: {
            class: "text-primary underline underline-offset-4",
            rel: "noopener noreferrer",
            target: "_blank",
          },
        },
      }),
      Placeholder.configure({ placeholder: "メール本文を入力してください..." }),
    ],
    content: "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setBodyHtml(editor.getHTML());
      setIsBodyEmpty(editor.isEmpty);
    },
  });

  const canProceed = subject.trim() !== "" && !isBodyEmpty;

  const handleClose = () => {
    if (isSending) return;
    onOpenChange(false);
    setSubject("");
    setBodyHtml("");
    setIsBodyEmpty(true);
    editor?.commands.clearContent();
    setConfirmOpen(false);
  };

  const handleConfirmSend = async () => {
    if (isSendingRef.current) return;
    isSendingRef.current = true;
    setIsSending(true);

    try {
      const result = await sendBulkEmailAction({
        memberIds: selectedMembers.map((m) => m.id),
        subject: subject.trim(),
        body: bodyHtml,
      });

      if (result.success) {
        const { successCount, failCount } = result;
        if (failCount === 0) {
          toast.success(`${successCount}件のメールを送信しました`);
        } else {
          toast.warning(
            `${successCount + failCount}件中${successCount}件送信成功、${failCount}件失敗`
          );
        }
        handleClose();
        onSendComplete();
      } else {
        toast.error(`送信失敗: ${result.error}`);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "予期しないエラーが発生しました";
      toast.error(`エラー: ${message}`);
    } finally {
      isSendingRef.current = false;
      setIsSending(false);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>メール送信</DialogTitle>
          </DialogHeader>

          <div className="flex-1 space-y-4 overflow-y-auto">
            <div>
              <Label className="text-sm text-muted-foreground">
                送信先: {formatRecipientLabel(selectedMembers)}
                （{selectedMembers.length}件）
              </Label>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email-subject">件名</Label>
              <Input
                id="email-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="メールの件名を入力してください"
              />
            </div>

            <div className="space-y-1.5">
              <Label>本文</Label>
              <Tabs defaultValue="edit">
                <TabsList>
                  <TabsTrigger value="edit">編集</TabsTrigger>
                  <TabsTrigger value="preview">プレビュー</TabsTrigger>
                </TabsList>
                <TabsContent value="edit">
                  <div className="border rounded-md overflow-hidden bg-background">
                    <EmailEditorToolbar editor={editor} />
                    <EditorContent
                      editor={editor}
                      className="prose prose-sm max-w-none px-4 py-3 min-h-48 focus-within:outline-none [&_.tiptap]:outline-none [&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.tiptap_p.is-editor-empty:first-child::before]:text-muted-foreground [&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none [&_.tiptap_p.is-editor-empty:first-child::before]:float-left [&_.tiptap_p.is-editor-empty:first-child::before]:h-0"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="preview">
                  <ScrollArea className="h-64 border rounded-md">
                    <div
                      className="prose prose-sm max-w-none p-4"
                      dangerouslySetInnerHTML={{ __html: bodyHtml }}
                    />
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose} disabled={isSending}>
              キャンセル
            </Button>
            <Button
              onClick={() => setConfirmOpen(true)}
              disabled={!canProceed || isSending}
            >
              確認画面へ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>送信確認</AlertDialogTitle>
            <AlertDialogDescription>
              以下の内容で{selectedMembers.length}件のメールを送信します。
              この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">件名: </span>
              {subject}
            </div>
            <div>
              <span className="font-medium">送信先: </span>
              {formatRecipientLabel(selectedMembers)}
            </div>
          </div>

          <ScrollArea className="max-h-48 border rounded-md">
            <div
              className="prose prose-sm max-w-none p-4"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          </ScrollArea>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSending}>戻る</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSend} disabled={isSending}>
              {isSending ? "送信中..." : "送信する"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
