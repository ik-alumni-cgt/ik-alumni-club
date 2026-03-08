"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { createCategory } from "@/actions/category";
import { toast } from "sonner";
import type { CategoryWithChildren } from "@/types/category";

type Props = {
  categoriesTree: CategoryWithChildren[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
};

export function CategorySelect({
  categoriesTree,
  selectedIds,
  onChange,
}: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newParentId, setNewParentId] = useState<string>("none");
  const [isCreating, setIsCreating] = useState(false);
  const [localTree, setLocalTree] = useState(categoriesTree);

  // 全カテゴリーをフラットに取得
  const allCategories = localTree.flatMap((parent) => [
    parent,
    ...parent.children,
  ]);

  const selectedCategories = allCategories.filter((c) =>
    selectedIds.includes(c.id),
  );

  const handleToggle = (categoryId: string) => {
    if (selectedIds.includes(categoryId)) {
      onChange(selectedIds.filter((id) => id !== categoryId));
    } else {
      onChange([...selectedIds, categoryId]);
    }
  };

  const handleRemove = (categoryId: string) => {
    onChange(selectedIds.filter((id) => id !== categoryId));
  };

  const handleNameChange = (name: string) => {
    setNewName(name);
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9fff]+/g, "-")
      .replace(/^-|-$/g, "");
    setNewSlug(slug);
  };

  const handleCreate = async () => {
    if (!newName.trim() || !newSlug.trim()) return;

    setIsCreating(true);
    try {
      const created = await createCategory({
        name: newName.trim(),
        slug: newSlug.trim(),
        parentId: newParentId === "none" ? null : newParentId,
        sortOrder: 0,
      });

      // ローカルツリーを更新
      const parentId = newParentId === "none" ? null : newParentId;
      if (parentId) {
        setLocalTree((prev) =>
          prev.map((p) =>
            p.id === parentId
              ? { ...p, children: [...p.children, { ...created, children: [] }] }
              : p,
          ),
        );
      } else {
        setLocalTree((prev) => [...prev, { ...created, children: [] }]);
      }

      // 新しいカテゴリーを選択状態に
      onChange([...selectedIds, created.id]);

      toast.success(`「${created.name}」を追加しました`);
      setNewName("");
      setNewSlug("");
      setNewParentId("none");
      setDialogOpen(false);
    } catch {
      toast.error("カテゴリーの作成に失敗しました");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* 選択済みカテゴリーのバッジ */}
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map((category) => (
            <Badge key={category.id} variant="secondary" className="gap-1">
              {category.name}
              <button
                type="button"
                onClick={() => handleRemove(category.id)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* カテゴリーチェックボックスリスト */}
      <div className="max-h-60 overflow-y-auto rounded-md border p-3">
        {localTree.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            カテゴリーがありません
          </p>
        ) : (
          <div className="space-y-3">
            {localTree.map((parent) => (
              <div key={parent.id}>
                <div className="flex items-center space-x-2 py-1">
                  <Checkbox
                    id={`cat-${parent.id}`}
                    checked={selectedIds.includes(parent.id)}
                    onCheckedChange={() => handleToggle(parent.id)}
                  />
                  <label
                    htmlFor={`cat-${parent.id}`}
                    className="cursor-pointer text-sm font-semibold"
                  >
                    {parent.name}
                  </label>
                </div>
                {parent.children.length > 0 && (
                  <div className="ml-6 space-y-1">
                    {parent.children.map((child) => (
                      <div
                        key={child.id}
                        className="flex items-center space-x-2 py-1"
                      >
                        <Checkbox
                          id={`cat-${child.id}`}
                          checked={selectedIds.includes(child.id)}
                          onCheckedChange={() => handleToggle(child.id)}
                        />
                        <label
                          htmlFor={`cat-${child.id}`}
                          className="cursor-pointer text-sm"
                        >
                          {child.name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* カテゴリー追加ボタン */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-2 w-full"
            >
              <Plus className="mr-1 h-3 w-3" />
              カテゴリーを追加
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>カテゴリーを追加</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>カテゴリー名 *</Label>
                <Input
                  value={newName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="カテゴリー名を入力"
                />
              </div>
              <div className="space-y-2">
                <Label>スラッグ *</Label>
                <Input
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  placeholder="category-slug"
                />
                <p className="text-xs text-muted-foreground">
                  カテゴリー名から自動生成されます
                </p>
              </div>
              <div className="space-y-2">
                <Label>親カテゴリー</Label>
                <Select value={newParentId} onValueChange={setNewParentId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      なし（親カテゴリーとして作成）
                    </SelectItem>
                    {localTree.map((parent) => (
                      <SelectItem key={parent.id} value={parent.id}>
                        {parent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  キャンセル
                </Button>
              </DialogClose>
              <Button
                type="button"
                onClick={handleCreate}
                disabled={isCreating || !newName.trim() || !newSlug.trim()}
              >
                {isCreating ? "追加中..." : "追加"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
