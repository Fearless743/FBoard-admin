import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2, BookOpen, GripVertical } from "lucide-react";
import { toast } from "sonner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { IdBadge } from "@/components/common/id-badge";
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
  fetchKnowledgeDetail,
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
  const [pendingList, setPendingList] = useState<KnowledgeItem[] | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["knowledge"],
    queryFn: fetchKnowledges,
  });
  const list: KnowledgeItem[] = data || [];
  const [categoryFilter, setCategoryFilter] = useState("all");
  const displayList = pendingList ?? (categoryFilter === "all" ? list : list.filter(k => k.category === categoryFilter));
  const { data: categories } = useQuery({ queryKey: ["knowledge", "categories"], queryFn: fetchKnowledgeCategories });

  const handleReorder = useCallback((ids: number[]) => {
    const fullList = pendingList ?? list;
    const reordered = ids.map((id) => fullList.find((i) => i.id === id)!).filter(Boolean);
    setPendingList(reordered);
  }, [list, pendingList]);

  const finishSort = useCallback(async () => {
    if (!pendingList) {
      setDragEnabled(false);
      return;
    }
    try {
      await sortKnowledge({ ids: pendingList.map((i) => i.id) });
      qc.invalidateQueries({ queryKey: ["knowledge"] });
      setPendingList(null);
      setDragEnabled(false);
    } catch (e) {}
  }, [pendingList, qc]);

  const toggleDrag = useCallback(() => {
    if (dragEnabled) {
      if (pendingList) {
        finishSort();
      } else {
        setDragEnabled(false);
      }
    } else {
      setPendingList(null);
      setDragEnabled(true);
    }
  }, [dragEnabled, pendingList, finishSort]);

  return (
    <>
      <PageHeader
        title={t("knowledge.title")}
        description={t("knowledge.description")}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant={dragEnabled ? "default" : "outline"}
              onClick={toggleDrag}
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
              <TableHead className="w-20 text-center">{t("knowledge.columns.status")}</TableHead>
              <TableHead>{t("knowledge.columns.title")}</TableHead>
              <TableHead>{t("knowledge.columns.category")}</TableHead>
              <TableHead className="w-24 text-right">{t("knowledge.columns.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: dragEnabled ? 6 : 5 }).map((_, j) => (
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
              <SortableContainer items={displayList} onReorder={handleReorder} enabled={dragEnabled}>
                {displayList.map((k) => (
                <SortableRow key={k.id} id={k.id}>
                  <DragCell />
                  <TableCell><IdBadge id={k.id} /></TableCell>
                  <TableCell className="text-center">
                    <Switch checked={!!k.show} onCheckedChange={async (checked) => {
                      try {
                        await showKnowledge({ id: k.id, show: checked ? 1 : 0 });
                        qc.invalidateQueries({ queryKey: ["knowledge"] });
                      } catch (e) {}
                    }} />
                  </TableCell>
                  <TableCell className="font-medium">{k.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{k.category || "—"}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
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
  const [loadingDetail, setLoadingDetail] = useState(false);

  // 编辑时从后端获取完整详情
  const loadDetail = async (id: number) => {
    setLoadingDetail(true);
    try {
      const detail = await fetchKnowledgeDetail(id);
      setTitle(detail.title || "");
      setCategory(detail.category || "");
      setLanguage(detail.language || "zh-CN");
      setContent((detail as any).body || detail.content || "");
      setShow(detail.show !== 0);
    } catch (e) {
      toast.error(t("knowledge.messages.loadError"));
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    if (open) {
      if (item) {
        loadDetail(item.id);
      } else {
        setTitle("");
        setCategory("");
        setLanguage("zh-CN");
        setContent("");
        setShow(true);
      }
    }
  }, [open, item?.id]); // eslint-disable-line react-hooks/exhaustive-deps

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
        body: content,
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
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
          <DialogTitle>
            {item ? t("knowledge.form.edit") : t("knowledge.form.add")}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-y-auto space-y-3 px-6 py-4">
          {loadingDetail ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (<>
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
            <div className="knowledge-editor">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ color: [] }, { background: [] }],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["blockquote", "code-block"],
                    ["link", "image"],
                    ["clean"],
                  ],
                }}
                style={{ height: "300px" }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <Label className="text-sm font-normal">{t("knowledge.form.show")}</Label>
            <Switch checked={show} onCheckedChange={setShow} />
          </div>
          </>)}
        </div>
        <DialogFooter className="gap-2 border-t px-6 py-4 shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("knowledge.form.cancel")}
          </Button>
          <Button onClick={submit} disabled={submitting || loadingDetail}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("knowledge.form.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
