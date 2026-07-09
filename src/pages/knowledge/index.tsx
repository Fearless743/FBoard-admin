import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2, BookOpen, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/common/empty-state";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { SortableContainer, SortableRow, DragCell } from "@/components/common/sortable-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  dropKnowledge,
  fetchKnowledges,
  fetchKnowledgeCategories,
  saveKnowledge,
  showKnowledge,
  sortKnowledge,
  type KnowledgeItem,
} from "@/api/misc";

const LANGS = ["zh-CN", "zh-TW", "en-US", "ja-JP", "ko-KR", "vi-VN", "ru-RU"];

export function KnowledgeListPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<KnowledgeItem | null>(null);
  const [deleting, setDeleting] = useState<KnowledgeItem | null>(null);
  const [dragEnabled, setDragEnabled] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["knowledge"],
    queryFn: fetchKnowledges,
  });
  const list: KnowledgeItem[] = data || [];
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { data: categories } = useQuery({ queryKey: ["knowledge", "categories"], queryFn: fetchKnowledgeCategories });
  const filtered = categoryFilter === "all" ? list : list.filter(k => k.category === categoryFilter);

  const handleReorder = useCallback(async (ids: number[]) => {
    try {
      await sortKnowledge({ ids });
      qc.invalidateQueries({ queryKey: ["knowledge"] });
    } catch (e) {}
  }, [qc]);

  return (
    <>
      <PageHeader
        title={t("knowledge.title")}
        description={t("knowledge.description")}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant={dragEnabled ? "default" : "outline"}
              onClick={() => setDragEnabled(!dragEnabled)}
            >
              <GripVertical className="h-4 w-4" />
              {dragEnabled ? "完成排序" : "编辑排序"}
            </Button>
            <Button onClick={() => { setEditing(null); setOpen(true); }}>
              <Plus className="h-4 w-4" />
              {t("knowledge.form.add")}
            </Button>
          </div>
        }
      />

      <div className="mb-4 flex items-center gap-2">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="全部分类" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部分类</SelectItem>
            {categories?.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {dragEnabled && <TableHead className="w-10" />}
              <TableHead className="w-16">{t("knowledge.columns.id")}</TableHead>
              <TableHead>{t("knowledge.columns.title")}</TableHead>
              <TableHead>{t("knowledge.columns.category")}</TableHead>
              <TableHead className="w-32">{t("knowledge.form.language")}</TableHead>
              <TableHead className="w-24 text-center">{t("knowledge.columns.status")}</TableHead>
              <TableHead className="w-24 text-right">{t("knowledge.columns.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: dragEnabled ? 7 : 6 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : list.length === 0 ? (
              <TableRow>
                <TableCell colSpan={dragEnabled ? 7 : 6}>
                  <EmptyState icon={<BookOpen className="h-10 w-10" />} />
                </TableCell>
              </TableRow>
            ) : (
              <SortableContainer items={filtered} onReorder={handleReorder} enabled={dragEnabled}>
                {filtered.map((k) => (
                <SortableRow key={k.id} id={k.id}>
                  <DragCell />
                  <TableCell className="font-mono text-xs">#{k.id}</TableCell>
                  <TableCell className="font-medium">{k.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{k.category || "—"}</Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    {t(`knowledge.languages.${k.language}`, k.language)}
                  </TableCell>
                  <TableCell className="text-center">
                    {k.show ? <Badge variant="success">ON</Badge> : <Badge variant="secondary">OFF</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={async () => {
                          try {
                            await showKnowledge({ id: k.id, show: k.show ? 0 : 1 });
                            qc.invalidateQueries({ queryKey: ["knowledge"] });
                          } catch (e) {}
                        }}
                      >
                        <Switch checked={!!k.show} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => { setEditing(k); setOpen(true); }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive"
                        onClick={() => setDeleting(k)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </SortableRow>
              ))}
              </SortableContainer>
            )}
          </TableBody>
        </Table>
      </div>

      <KnowledgeFormDialog
        open={open}
        onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}
        item={editing}
        onSaved={() => qc.invalidateQueries({ queryKey: ["knowledge"] })}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title={t("knowledge.messages.deleteConfirm")}
        description={t("knowledge.messages.deleteDescription")}
        onConfirm={async () => {
          if (!deleting) return;
          try {
            await dropKnowledge(deleting.id);
            toast.success(t("common.delete.success"));
            qc.invalidateQueries({ queryKey: ["knowledge"] });
            setDeleting(null);
          } catch (e) {}
        }}
      />
    </>
  );
}

function KnowledgeFormDialog({
  open,
  onOpenChange,
  item,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  item: KnowledgeItem | null;
  onSaved: () => void;
}) {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("zh-CN");
  const [content, setContent] = useState("");
  const [show, setShow] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (item) {
        setTitle(item.title || "");
        setCategory(item.category || "");
        setLanguage(item.language || "zh-CN");
        setContent(item.content || "");
        setShow(item.show !== 0);
      } else {
        setTitle("");
        setCategory("");
        setLanguage("zh-CN");
        setContent("");
        setShow(true);
      }
    }
  }, [open, item]);

  const submit = async () => {
    if (!title) {
      toast.error(t("knowledge.form.titlePlaceholder"));
      return;
    }
    setSubmitting(true);
    try {
      await saveKnowledge({
        id: item?.id,
        title,
        category,
        language,
        content,
        show: show ? 1 : 0,
      });
      toast.success(t("knowledge.messages.operationSuccess"));
      onSaved();
      onOpenChange(false);
    } catch (e) {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {item ? t("knowledge.form.edit") : t("knowledge.form.add")}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>{t("knowledge.form.title")}</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("knowledge.form.titlePlaceholder")}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label>{t("knowledge.form.category")}</Label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder={t("knowledge.form.categoryPlaceholder")}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("knowledge.form.language")}</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGS.map((l) => (
                    <SelectItem key={l} value={l}>
                      {t(`knowledge.languages.${l}`, l)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>{t("knowledge.form.content")}</Label>
            <Textarea rows={8} value={content} onChange={(e) => setContent(e.target.value)} />
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <Label className="text-sm font-normal">{t("knowledge.form.show")}</Label>
            <Switch checked={show} onCheckedChange={setShow} />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("knowledge.form.cancel")}
          </Button>
          <Button onClick={submit} disabled={submitting}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("knowledge.form.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
