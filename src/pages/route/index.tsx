import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2, Route as RouteIcon } from "lucide-react";
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
import { dropRoute, fetchRoutes, saveRoute, type ServerRoute } from "@/api/server";

const ACTIONS = ["dns", "block", "direct", "proxy"] as const;

export function RouteListPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ServerRoute | null>(null);
  const [deleting, setDeleting] = useState<ServerRoute | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["server", "routes"],
    queryFn: fetchRoutes,
  });
  const list: ServerRoute[] = data || [];

  return (
    <>
      <PageHeader
        title={t("route.title")}
        description={t("route.description")}
        actions={
          <Button onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="h-4 w-4" />
            {t("route.form.add")}
          </Button>
        }
      />

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">{t("route.columns.id")}</TableHead>
              <TableHead>{t("route.columns.remarks")}</TableHead>
              <TableHead className="w-24">{t("route.columns.action")}</TableHead>
              <TableHead className="w-32">{t("route.columns.matchRules", { count: 0 })}</TableHead>
              <TableHead className="w-24 text-right">{t("route.columns.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : list.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <EmptyState icon={<RouteIcon className="h-10 w-10" />} />
                </TableCell>
              </TableRow>
            ) : (
              list.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">#{r.id}</TableCell>
                  <TableCell className="font-medium">{r.remarks}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{t(`route.actions.${r.action}`)}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {t("route.columns.matchRules", { count: (r.match || []).length })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => { setEditing(r); setOpen(true); }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive"
                        onClick={() => setDeleting(r)}
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

      <RouteFormDialog
        open={open}
        onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}
        route={editing}
        onSaved={() => qc.invalidateQueries({ queryKey: ["server", "routes"] })}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title={t("route.messages.deleteConfirm")}
        description={t("route.messages.deleteDescription")}
        onConfirm={async () => {
          if (!deleting) return;
          try {
            await dropRoute(deleting.id);
            toast.success(t("route.messages.deleteSuccess"));
            qc.invalidateQueries({ queryKey: ["server", "routes"] });
            setDeleting(null);
          } catch (e) {}
        }}
      />
    </>
  );
}

function RouteFormDialog({
  open,
  onOpenChange,
  route,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  route: ServerRoute | null;
  onSaved: () => void;
}) {
  const { t } = useTranslation();
  const [remarks, setRemarks] = useState("");
  const [match, setMatch] = useState("");
  const [action, setAction] = useState<"dns" | "block" | "direct" | "proxy">("block");
  const [actionValue, setActionValue] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setRemarks(route?.remarks || "");
      setMatch((route?.match || []).join("\n"));
      setAction(route?.action || "block");
      setActionValue(route?.action_value || "");
    }
  }, [open, route]);

  const submit = async () => {
    if (!remarks) {
      toast.error(t("route.form.validation.remarks"));
      return;
    }
    setSubmitting(true);
    try {
      const payload: any = {
        id: route?.id,
        remarks,
        match: match.split("\n").map((s) => s.trim()).filter(Boolean),
        action,
        action_value: actionValue || undefined,
      };
      await saveRoute(payload);
      toast.success(route ? t("route.messages.updateSuccess") : t("route.messages.createSuccess"));
      onSaved();
      onOpenChange(false);
    } catch (e) {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {route ? t("route.form.edit") : t("route.form.add")}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>{t("route.form.remarks")}</Label>
            <Input
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder={t("route.form.remarksPlaceholder")}
            />
          </div>
          <div className="space-y-1.5">
            <Label>{t("route.form.match")}</Label>
            <Textarea
              rows={4}
              value={match}
              onChange={(e) => setMatch(e.target.value)}
              placeholder={t("route.form.matchPlaceholder")}
            />
          </div>
          <div className="space-y-1.5">
            <Label>{t("route.form.action")}</Label>
            <Select value={action} onValueChange={(v: any) => setAction(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACTIONS.map((a) => (
                  <SelectItem key={a} value={a}>
                    {t(`route.actions.${a}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {action === "dns" && (
            <div className="space-y-1.5">
              <Label>{t("route.form.dns")}</Label>
              <Input
                value={actionValue}
                onChange={(e) => setActionValue(e.target.value)}
                placeholder={t("route.form.dnsPlaceholder")}
              />
            </div>
          )}
          {action === "proxy" && (
            <div className="space-y-1.5">
              <Label>{t("route.form.proxy")}</Label>
              <Input
                value={actionValue}
                onChange={(e) => setActionValue(e.target.value)}
                placeholder={t("route.form.proxyPlaceholder")}
              />
            </div>
          )}
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("route.form.cancel")}
          </Button>
          <Button onClick={submit} disabled={submitting}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("route.form.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
