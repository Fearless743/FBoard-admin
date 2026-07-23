import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUrlState, listQuerySchema } from "@/hooks/use-url-state";
import { Plus, Pencil, Trash2, Loader2, GripVertical, Search, Megaphone } from "lucide-react";
import { toast } from "sonner";
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
import { Pagination } from "@/components/common/pagination";
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
import { fetchNoticeDetail, dropNotice, fetchNotices, saveNotice, updateNotice, toggleNoticeShow, sortNotices, type NoticeItem } from "@/api/misc";

const SORT_PAGE_SIZE = 1000;

export function NoticeListPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<NoticeItem | null>(null);
  const [deleting, setDeleting] = useState<NoticeItem | null>(null);
  const [dragEnabled, setDragEnabled] = useState(false);
  const [pendingList, setPendingList] = useState<any[] | null>(null);
  const [qs, setQs, query] = useUrlState(
    listQuerySchema({
      q: { type: "string", default: "", debounce: 400 },
    }),
  );

  // 拖拽排序临时拉大 pageSize，不写进 URL
  const effectivePageSize = dragEnabled ? SORT_PAGE_SIZE : query.pageSize;
  const effectivePage = dragEnabled ? 1 : query.page;

  const { data, isLoading } = useQuery({
    queryKey: ["notices", { page: effectivePage, pageSize: effectivePageSize, q: query.q, dragEnabled }],
    queryFn: () =>
      fetchNotices({
        current: effectivePage,
        pageSize: effectivePageSize,
        search: query.q || undefined,
      }),
  });
  const list = data?.data || [];
  const total = data?.total || 0;
  const displayList = pendingList ?? list;

  // 拖拽只改本地顺序，点「完成排序」再提交
  const handleReorder = useCallback((ids: number[]) => {
    const reordered = ids
      .map((id) => displayList.find((i: any) => Number(i.id) === Number(id)))
      .filter(Boolean);
    setPendingList(reordered);
  }, [displayList]);

  const finishSort = useCallback(async () => {
    if (!pendingList) {
      setDragEnabled(false);
      return;
    }
    try {
      await sortNotices(pendingList.map((i: any) => Number(i.id)));
      toast.success(t("common.http.success"));
      setPendingList(null);
      setDragEnabled(false);
      await qc.invalidateQueries({ queryKey: ["notices"] });
    } catch (e) {}
  }, [pendingList, qc, t]);

  const toggleDrag = useCallback(() => {
    if (dragEnabled) {
      // 正在退出排序模式 → 如果有变更则保存
      if (pendingList) {
        void finishSort();
      } else {
        setDragEnabled(false);
      }
    } else {
      setPendingList(null);
      setQs({ q: "", page: 1 });
      setDragEnabled(true);
    }
  }, [dragEnabled, pendingList, finishSort, setQs]);

  return (
    <>
      <PageHeader
        title={t("notice.title")}
        description={t("notice.description")}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant={dragEnabled ? "default" : "outline"}
              onClick={toggleDrag}
            >
              <GripVertical className="h-4 w-4" />
              {dragEnabled ? t("common.sort.done") : t("common.sort.edit")}
            </Button>
            <Button onClick={() => { setEditing(null); setOpen(true); }} disabled={dragEnabled}>
              <Plus className="h-4 w-4" />
              {t("notice.form.add.button")}
            </Button>
          </div>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("notice.table.toolbar.search")}
            value={qs.q}
            onChange={(e) => setQs({ q: e.target.value })}
            className="pl-9"
            disabled={dragEnabled}
          />
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {dragEnabled && <TableHead className="w-10" />}
              <TableHead className="w-16">{t("notice.table.columns.id")}</TableHead>
              <TableHead>{t("notice.table.columns.title")}</TableHead>
              <TableHead className="w-24 text-center">{t("notice.table.columns.show")}</TableHead>
              <TableHead className="w-24 text-right">{t("notice.table.columns.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: dragEnabled ? 5 : 4 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : displayList.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={dragEnabled ? 5 : 4}>
                  <EmptyState
                    icon={<Megaphone className="h-10 w-10" />}
                    message={t("common.table.noData")}
                  />
                </TableCell>
              </TableRow>
            ) : (
              <SortableContainer items={displayList} onReorder={handleReorder} enabled={dragEnabled}>
                {displayList.map((n) => (
                <SortableRow key={n.id} id={n.id}>
                  <DragCell />
                  <TableCell><IdBadge id={n.id} /></TableCell>
                  <TableCell className="font-medium">{n.title}</TableCell>
                  <TableCell className="text-center">
                    <Switch checked={!!n.show} onCheckedChange={async (checked) => {
                      try {
                        await toggleNoticeShow(n.id, checked ? 1 : 0);
                        qc.invalidateQueries({ queryKey: ["notices"] });
                      } catch (e) {}
                    }} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => { setEditing(n); setOpen(true); }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleting(n)}
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
        {!dragEnabled && (
          <Pagination
            page={qs.page}
            pageSize={qs.pageSize}
            total={total}
            onPageChange={(p) => setQs({ page: p })}
            onPageSizeChange={(s) => setQs({ pageSize: s, page: 1 })}
          />
        )}
      </div>

      <NoticeFormDialog
        open={open}
        onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}
        notice={editing}
        onSaved={() => qc.invalidateQueries({ queryKey: ["notices"] })}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title={t("notice.table.actions.delete.title")}
        description={t("notice.table.actions.delete.description")}
        onConfirm={async () => {
          if (!deleting) return;
          try {
            await dropNotice(deleting.id);
            toast.success(t("notice.table.actions.delete.success"));
            qc.invalidateQueries({ queryKey: ["notices"] });
            setDeleting(null);
          } catch (e) {}
        }}
      />
    </>
  );
}

function NoticeFormDialog({
  open,
  onOpenChange,
  notice,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  notice: NoticeItem | null;
  onSaved: () => void;
}) {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [show, setShow] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // 编辑时从后端获取完整详情（含 content、img_url）
  const loadDetail = async (id: number) => {
    setLoadingDetail(true);
    try {
      const detail = await fetchNoticeDetail(id);
      setTitle(detail.title || "");
      setContent(detail.content || "");
      setImgUrl(detail.img_url || "");
      setShow(detail.show !== 0);
    } catch (e) {
      toast.error(t("notice.messages.loadError"));
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    if (open) {
      if (notice) {
        // 列表中的 notice 不含 content/img_url，需单独加载
        loadDetail(notice.id);
      } else {
        setTitle("");
        setContent("");
        setImgUrl("");
        setShow(true);
      }
    }
  }, [open, notice?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = async () => {
    if (!title) {
      toast.error(t("notice.form.fields.title.placeholder"));
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        title,
        content,
        img_url: imgUrl,
        show: show ? 1 : 0,
      };
      if (notice) {
        await updateNotice({ ...payload, show: payload.show as 0 | 1, id: notice.id });
      } else {
        await saveNotice({ ...payload, show: payload.show as 0 | 1 });
      }
      toast.success(t("notice.form.buttons.success"));
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
            {notice ? t("notice.form.edit.title") : t("notice.form.add.title")}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-y-auto space-y-3 px-6 py-4">
          {loadingDetail ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (<>
          <div className="space-y-1.5">
            <Label>{t("notice.form.fields.title.label")}</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("notice.form.fields.title.placeholder")}
            />
          </div>
          <div className="space-y-1.5">
            <Label>{t("notice.form.fields.content.label")}</Label>
            <Textarea rows={5} value={content} onChange={(e) => setContent(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{t("notice.form.fields.img_url.label")}</Label>
            <Input
              value={imgUrl}
              onChange={(e) => setImgUrl(e.target.value)}
              placeholder={t("notice.form.fields.img_url.placeholder")}
            />
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <Label className="text-sm font-normal">{t("notice.form.fields.show.label")}</Label>
            <Switch checked={show} onCheckedChange={setShow} />
          </div>
          </>)}
        </div>
        <DialogFooter className="gap-2 border-t px-6 py-4 shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("notice.form.buttons.cancel")}
          </Button>
          <Button onClick={submit} disabled={submitting || loadingDetail}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("notice.form.buttons.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
