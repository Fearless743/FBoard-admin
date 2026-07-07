import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
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
import { dropNotice, fetchNotices, saveNotice, updateNotice, type NoticeItem } from "@/api/misc";

export function NoticeListPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<NoticeItem | null>(null);
  const [deleting, setDeleting] = useState<NoticeItem | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["notices"],
    queryFn: fetchNotices,
  });
  const list = data || [];

  return (
    <>
      <PageHeader
        title={t("notice.title")}
        description={t("notice.description")}
        actions={
          <Button onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="h-4 w-4" />
            {t("notice.form.add.button")}
          </Button>
        }
      />

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
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
                  {Array.from({ length: 4 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : list.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}><EmptyState /></TableCell>
              </TableRow>
            ) : (
              list.map((n) => (
                <TableRow key={n.id}>
                  <TableCell className="font-mono text-xs">#{n.id}</TableCell>
                  <TableCell className="font-medium">{n.title}</TableCell>
                  <TableCell className="text-center">
                    {n.show ? <Badge variant="success">ON</Badge> : <Badge variant="secondary">OFF</Badge>}
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
                        className="h-8 w-8 text-destructive"
                        onClick={() => setDeleting(n)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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

  useEffect(() => {
    if (open) {
      setTitle(notice?.title || "");
      setContent(notice?.content || "");
      setImgUrl(notice?.img_url || "");
      setShow(notice?.show !== 0);
    }
  }, [open, notice]);

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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {notice ? t("notice.form.edit.title") : t("notice.form.add.title")}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
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
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("notice.form.buttons.cancel")}
          </Button>
          <Button onClick={submit} disabled={submitting}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("notice.form.buttons.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
