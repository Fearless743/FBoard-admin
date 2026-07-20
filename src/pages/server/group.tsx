import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2, Users, Server } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
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
import { IdBadge } from "@/components/common/id-badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { dropGroup, fetchGroups, saveGroup, type ServerGroup } from "@/api/server";

export function GroupListPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ServerGroup | null>(null);
  const [deleting, setDeleting] = useState<ServerGroup | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["server", "groups"],
    queryFn: fetchGroups,
  });
  const groups = data || [];

  return (
    <>
      <PageHeader
        title={t("group.title")}
        description={t("group.description")}
        actions={
          <Button onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="h-4 w-4" />
            {t("group.form.add")}
          </Button>
        }
      />

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">{t("group.columns.id")}</TableHead>
              <TableHead>{t("group.columns.name")}</TableHead>
              <TableHead className="w-40 text-center">
                {t("group.columns.usersCount")}
              </TableHead>
              <TableHead className="w-40 text-center">
                {t("group.columns.serverCount")}
              </TableHead>
              <TableHead className="w-32 text-right">{t("group.columns.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                  <TableCell><Skeleton className="ml-auto h-4 w-10" /></TableCell>
                  <TableCell><Skeleton className="ml-auto h-4 w-10" /></TableCell>
                  <TableCell><Skeleton className="ml-auto h-4 w-20" /></TableCell>
                </TableRow>
              ))
            ) : groups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}><EmptyState /></TableCell>
              </TableRow>
            ) : (
              groups.map((g) => (
                <TableRow key={g.id}>
                  <TableCell><IdBadge id={g.id} /></TableCell>
                  <TableCell className="font-medium">{g.name}</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={(g.users_count ?? 0) > 0 ? "secondary" : "outline"}
                      className="h-5 gap-1 select-none font-normal tabular-nums"
                      title={t("group.columns.usersCount")}
                    >
                      <Users className="h-3 w-3" />
                      {g.users_count ?? 0}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={(g.server_count ?? 0) > 0 ? "secondary" : "outline"}
                      className="h-5 gap-1 select-none font-normal tabular-nums"
                      title={t("group.columns.serverCount")}
                    >
                      <Server className="h-3 w-3" />
                      {g.server_count ?? 0}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => { setEditing(g); setOpen(true); }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleting(g)}
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

      <GroupFormDialog
        open={open}
        onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}
        group={editing}
        onSaved={() => qc.invalidateQueries({ queryKey: ["server", "groups"] })}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title={t("group.messages.deleteConfirm")}
        description={t("group.messages.deleteDescription")}
        onConfirm={async () => {
          if (!deleting) return;
          try {
            await dropGroup(deleting.id);
            toast.success(t("common.delete.success"));
            qc.invalidateQueries({ queryKey: ["server", "groups"] });
            setDeleting(null);
          } catch (e) {}
        }}
      />
    </>
  );
}

function GroupFormDialog({
  open,
  onOpenChange,
  group,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  group: ServerGroup | null;
  onSaved: () => void;
}) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) setName(group?.name || "");
  }, [open, group]);

  const submit = async () => {
    if (!name.trim()) {
      toast.error(t("group.form.namePlaceholder"));
      return;
    }
    setSubmitting(true);
    try {
      await saveGroup({ id: group?.id, name });
      toast.success(group ? t("group.messages.updateSuccess") : t("group.messages.createSuccess"));
      onSaved();
      onOpenChange(false);
      setName("");
    } catch (e) {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
          <DialogTitle>
            {group ? t("group.form.edit") : t("group.form.add")}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5 px-6 py-4">
          <Label>{t("group.form.name")}</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("group.form.namePlaceholder")}
          />
        </div>
        <DialogFooter className="gap-2 border-t px-6 py-4 shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("group.form.cancel")}
          </Button>
          <Button onClick={submit} disabled={submitting}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {group ? t("group.form.update") : t("group.form.create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
