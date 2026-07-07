import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2, Server, Copy, Check, Eye, EyeOff } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  dropMachine,
  fetchMachines,
  getMachineInstallCommand,
  getMachineToken,
  resetMachineToken,
  saveMachine,
  type Machine,
} from "@/api/server";
import { formatDate } from "@/lib/utils";

export function MachineListPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Machine | null>(null);
  const [deleting, setDeleting] = useState<Machine | null>(null);
  const [viewing, setViewing] = useState<Machine | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["machines"],
    queryFn: fetchMachines,
  });
  const list: Machine[] = data || [];

  return (
    <>
      <PageHeader
        title={t("machine.title")}
        description={t("machine.description")}
        actions={
          <Button onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="h-4 w-4" />
            {t("machine.form.add")}
          </Button>
        }
      />

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">{t("machine.columns.id")}</TableHead>
              <TableHead>{t("machine.columns.name")}</TableHead>
              <TableHead className="w-24 text-center">{t("machine.columns.status")}</TableHead>
              <TableHead className="w-24 text-right">{t("machine.columns.nodesHosted")}</TableHead>
              <TableHead className="w-40">{t("machine.columns.lastSeen")}</TableHead>
              <TableHead className="w-24 text-right">{t("machine.columns.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : list.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <EmptyState icon={<Server className="h-10 w-10" />} />
                </TableCell>
              </TableRow>
            ) : (
              list.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-mono text-xs">#{m.id}</TableCell>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell className="text-center">
                    {m.is_active ? (
                      <Badge variant="success">{t("machine.columns.online")}</Badge>
                    ) : (
                      <Badge variant="secondary">{t("machine.columns.inactive")}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{m.nodes_count ?? 0}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {m.last_seen_at ? formatDate(m.last_seen_at) : t("machine.columns.never")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => setViewing(m)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => { setEditing(m); setOpen(true); }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive"
                        onClick={() => setDeleting(m)}
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

      <MachineFormDialog
        open={open}
        onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}
        machine={editing}
        onSaved={() => qc.invalidateQueries({ queryKey: ["machines"] })}
      />

      <MachineDetailDialog
        machine={viewing}
        onOpenChange={(v) => !v && setViewing(null)}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title={t("machine.messages.deleteConfirm")}
        description={t("machine.messages.deleteDescription")}
        onConfirm={async () => {
          if (!deleting) return;
          try {
            await dropMachine(deleting.id);
            toast.success(t("machine.messages.deleteSuccess"));
            qc.invalidateQueries({ queryKey: ["machines"] });
            setDeleting(null);
          } catch (e) {}
        }}
      />
    </>
  );
}

function MachineFormDialog({
  open,
  onOpenChange,
  machine,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  machine: Machine | null;
  onSaved: () => void;
}) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (machine) {
        setName(machine.name || "");
        setNotes(machine.notes || "");
        setIsActive(machine.is_active !== false);
      } else {
        setName("");
        setNotes("");
        setIsActive(true);
      }
    }
  }, [open, machine]);

  const submit = async () => {
    if (!name) {
      toast.error(t("machine.form.nameError"));
      return;
    }
    setSubmitting(true);
    try {
      await saveMachine({
        id: machine?.id,
        name,
        notes,
        is_active: isActive,
      });
      toast.success(machine ? t("machine.messages.updateSuccess") : t("machine.messages.createSuccess"));
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
            {machine ? t("machine.form.edit") : t("machine.form.create")}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>{t("machine.form.name")}</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("machine.form.namePlaceholder")}
            />
          </div>
          <div className="space-y-1.5">
            <Label>{t("machine.form.notes")}</Label>
            <Textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("machine.form.notesPlaceholder")}
            />
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <Label className="text-sm font-normal">{t("machine.form.isActive")}</Label>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("machine.form.isActiveDescription")}
              </p>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("machine.form.cancel")}
          </Button>
          <Button onClick={submit} disabled={submitting}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {machine ? t("machine.form.update") : t("machine.form.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MachineDetailDialog({
  machine,
  onOpenChange,
}: {
  machine: Machine | null;
  onOpenChange: (v: boolean) => void;
}) {
  const { t } = useTranslation();
  const [token, setToken] = useState<string | null>(null);
  const [showToken, setShowToken] = useState(false);
  const [installCmd, setInstallCmd] = useState<string | null>(null);
  const [copied, setCopied] = useState<"token" | "cmd" | null>(null);

  const loadToken = async () => {
    if (!machine) return;
    try {
      const res = await getMachineToken(machine.id);
      setToken(res?.data?.token || res?.token || "");
    } catch (e) {
      toast.error(t("machine.messages.tokenFetchFailed"));
    }
  };

  const loadCmd = async () => {
    if (!machine) return;
    try {
      const res = await getMachineInstallCommand(machine.id);
      setInstallCmd(res?.data?.command || res?.command || "");
    } catch (e) {}
  };

  const onResetToken = async () => {
    if (!machine) return;
    try {
      await resetMachineToken(machine.id);
      toast.success(t("machine.token.resetSuccess"));
      loadToken();
    } catch (e) {
      toast.error(t("machine.messages.tokenResetFailed"));
    }
  };

  if (!machine) return null;

  return (
    <Dialog open={!!machine} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{machine.name} · {t("machine.token.title")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>{t("machine.token.title")}</Label>
            {token === null ? (
              <Button variant="outline" onClick={loadToken}>
                <Eye className="h-4 w-4" />
                {t("machine.token.show")}
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  type={showToken ? "text" : "password"}
                  value={token}
                  className="font-mono text-xs"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowToken((v) => !v)}
                >
                  {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={async () => {
                    await navigator.clipboard.writeText(token);
                    setCopied("token");
                    toast.success(t("machine.token.copied"));
                    setTimeout(() => setCopied(null), 2000);
                  }}
                >
                  {copied === "token" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button size="sm" variant="outline" onClick={onResetToken}>
                  {t("machine.token.reset")}
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>{t("machine.install.title")}</Label>
            {installCmd === null ? (
              <Button variant="outline" onClick={loadCmd}>
                {t("machine.install.copy")}
              </Button>
            ) : (
              <div className="space-y-1">
                <pre className="overflow-x-auto rounded-md bg-muted p-3 font-mono text-xs">
                  {installCmd}
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    await navigator.clipboard.writeText(installCmd);
                    setCopied("cmd");
                    toast.success(t("machine.install.copied"));
                    setTimeout(() => setCopied(null), 2000);
                  }}
                >
                  {copied === "cmd" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {t("machine.install.copy")}
                </Button>
              </div>
            )}
            <p className="text-xs text-muted-foreground">{t("machine.install.hint")}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
