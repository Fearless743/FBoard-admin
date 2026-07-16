import { useEffect, useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Plus, Pencil, Trash2, Loader2, Server, Copy, Check, Eye, EyeOff,
  Activity, Terminal, Unlink, Link2, ExternalLink, ArrowRight, ArrowUpToLine, RotateCcw,
  ScrollText, RefreshCw, Search,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { IdBadge } from "@/components/common/id-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/common/empty-state";
import { Pagination } from "@/components/common/pagination";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  dropMachine,
  fetchMachines,
  getMachineHistory,
  getMachineInstallCommand,
  getMachineNodes,
  getMachineToken,
  resetMachineToken,
  saveMachine,
  upgradeMachine,
  restartMachine,
  getMachineLogs,
  batchUpgradeMachines,
  type Machine,
  type MachineLoadStatus,
} from "@/api/server";
import { formatBytes, formatDate } from "@/lib/utils";
import { adminPath } from "@/lib/paths";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function usagePercent(used?: number, total?: number): number | null {
  if (used == null || total == null || total <= 0) return null;
  return Math.min(100, Math.round((used / total) * 1000) / 10);
}

function loadLevelClass(value: number | null | undefined): string {
  if (value == null) return "bg-muted-foreground/30";
  if (value >= 90) return "bg-red-500";
  if (value >= 70) return "bg-amber-500";
  return "bg-emerald-500";
}

function LoadMeter({
  label,
  value,
}: {
  label: string;
  value: number | null;
}) {
  const text = value == null ? "—" : `${value.toFixed(value % 1 === 0 ? 0 : 1)}%`;

  return (
    <div className="flex items-center gap-1.5 leading-none">
      <span className="w-7 shrink-0 text-[10px] text-muted-foreground">{label}</span>
      <div className="h-1 min-w-[48px] flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all", loadLevelClass(value))}
          style={{ width: `${value == null ? 0 : Math.max(value, value > 0 ? 4 : 0)}%` }}
        />
      </div>
      <span className="w-8 shrink-0 text-right text-[10px] tabular-nums text-muted-foreground">
        {text}
      </span>
    </div>
  );
}

function LoadStatusCell({ load }: { load?: MachineLoadStatus | null }) {
  const { t } = useTranslation();
  if (!load) {
    return <span className="text-xs text-muted-foreground">{t("machine.columns.noData")}</span>;
  }

  const cpu = load.cpu == null ? null : Math.min(100, Math.round(load.cpu * 10) / 10);
  const mem = usagePercent(load.mem?.used, load.mem?.total);
  const disk = usagePercent(load.disk?.used, load.disk?.total);
  const swap = usagePercent(load.swap?.used, load.swap?.total);
  const updatedAt = load.updated_at ? formatDate(load.updated_at) : null;
  const memDetail =
    load.mem?.total != null
      ? `${formatBytes(load.mem.used || 0)} / ${formatBytes(load.mem.total)}`
      : undefined;
  const diskDetail =
    load.disk?.total != null
      ? `${formatBytes(load.disk.used || 0)} / ${formatBytes(load.disk.total)}`
      : undefined;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex min-w-[140px] max-w-[180px] cursor-default flex-col gap-0.5 py-0">
            <LoadMeter label={t("machine.columns.cpu")} value={cpu} />
            <LoadMeter label={t("machine.columns.memory")} value={mem} />
            <LoadMeter label={t("machine.columns.disk")} value={disk} />
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-xs space-y-1 bg-popover text-popover-foreground border text-xs shadow-md"
        >
          <p className="font-medium">{t("machine.columns.load")}</p>
          <p>
            {t("machine.columns.cpu")}: {cpu == null ? "—" : `${cpu}%`}
          </p>
          <p>
            {t("machine.columns.memory")}: {mem == null ? "—" : `${mem}%`}
            {memDetail ? ` (${memDetail})` : ""}
          </p>
          <p>
            {t("machine.columns.disk")}: {disk == null ? "—" : `${disk}%`}
            {diskDetail ? ` (${diskDetail})` : ""}
          </p>
          {swap != null && (
            <p>
              Swap: {swap}%
              {load.swap?.total
                ? ` (${formatBytes(load.swap.used || 0)} / ${formatBytes(load.swap.total)})`
                : ""}
            </p>
          )}
          {load.net && (
            <p>
              Net: ↓ {formatBytes(load.net.in_speed || 0)}/s · ↑ {formatBytes(load.net.out_speed || 0)}/s
            </p>
          )}
          {updatedAt && (
            <p className="text-muted-foreground">
              {t("machine.columns.lastReport")}: {updatedAt}
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function CurrentLoadSummary({ load }: { load?: MachineLoadStatus | null }) {
  const { t } = useTranslation();
  if (!load) {
    return (
      <div className="rounded-lg border border-dashed p-3 text-xs text-muted-foreground">
        {t("machine.columns.noData")}
      </div>
    );
  }

  const cpu = load.cpu == null ? null : Math.min(100, Math.round(load.cpu * 10) / 10);
  const mem = usagePercent(load.mem?.used, load.mem?.total);
  const disk = usagePercent(load.disk?.used, load.disk?.total);
  const swap = usagePercent(load.swap?.used, load.swap?.total);

  const items = [
    {
      key: "cpu",
      label: t("machine.columns.cpu"),
      value: cpu,
      detail: cpu == null ? "—" : `${cpu.toFixed(cpu % 1 === 0 ? 0 : 1)}%`,
    },
    {
      key: "mem",
      label: t("machine.columns.memory"),
      value: mem,
      detail:
        load.mem?.total != null
          ? `${formatBytes(load.mem.used || 0)} / ${formatBytes(load.mem.total)}`
          : mem == null
            ? "—"
            : `${mem}%`,
    },
    {
      key: "disk",
      label: t("machine.columns.disk"),
      value: disk,
      detail:
        load.disk?.total != null
          ? `${formatBytes(load.disk.used || 0)} / ${formatBytes(load.disk.total)}`
          : disk == null
            ? "—"
            : `${disk}%`,
    },
    {
      key: "swap",
      label: "Swap",
      value: swap,
      detail:
        load.swap?.total != null
          ? `${formatBytes(load.swap.used || 0)} / ${formatBytes(load.swap.total)}`
          : swap == null
            ? "—"
            : `${swap}%`,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <div key={item.key} className="rounded-lg border bg-muted/20 p-3">
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>{item.label}</span>
            <span className="tabular-nums font-medium text-foreground">
              {item.value == null ? "—" : `${item.value.toFixed(item.value % 1 === 0 ? 0 : 1)}%`}
            </span>
          </div>
          <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full", loadLevelClass(item.value))}
              style={{ width: `${item.value == null ? 0 : Math.max(item.value, item.value > 0 ? 4 : 0)}%` }}
            />
          </div>
          <p className="truncate text-[11px] text-muted-foreground tabular-nums">{item.detail}</p>
        </div>
      ))}
      {load.net && (
        <div className="col-span-2 rounded-lg border bg-muted/20 p-3 sm:col-span-4">
          <div className="mb-1 text-xs text-muted-foreground">Network</div>
          <p className="text-sm tabular-nums">
            ↓ {formatBytes(load.net.in_speed || 0)}/s · ↑ {formatBytes(load.net.out_speed || 0)}/s
          </p>
          {load.updated_at ? (
            <p className="mt-1 text-[11px] text-muted-foreground">
              {t("machine.columns.lastReport")}: {formatDate(load.updated_at)}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}

export function MachineListPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Machine | null>(null);
  const [deleting, setDeleting] = useState<Machine | null>(null);
  const [viewing, setViewing] = useState<Machine | null>(null);
  const [upgrading, setUpgrading] = useState<Machine | null>(null);
  const [restarting, setRestarting] = useState<Machine | null>(null);
  const [upgradeSubmitting, setUpgradeSubmitting] = useState(false);
  const [restartSubmitting, setRestartSubmitting] = useState(false);
  const [batchUpgradeOpen, setBatchUpgradeOpen] = useState(false);
  const [batchUpgradeSubmitting, setBatchUpgradeSubmitting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["machines", { page, pageSize, search: debouncedSearch }],
    queryFn: () => fetchMachines(page, pageSize, debouncedSearch),
  });
  const list: Machine[] = data?.data || [];
  const total = data?.total || 0;

  return (
    <>
      <PageHeader
        title={t("machine.title")}
        description={t("machine.description")}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={() => setBatchUpgradeOpen(true)}>
              <ArrowUpToLine className="h-4 w-4" />
              {t("machine.operations.batchUpgrade")}
            </Button>
            <Button onClick={() => { setEditing(null); setOpen(true); }}>
              <Plus className="h-4 w-4" />
              {t("machine.form.add")}
            </Button>
          </div>
        }
      />

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("machine.toolbar.search")}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">{t("machine.columns.id")}</TableHead>
              <TableHead>{t("machine.columns.name")}</TableHead>
              <TableHead className="w-24 text-center">{t("machine.columns.status")}</TableHead>
              <TableHead className="w-24 text-right">{t("machine.columns.nodesHosted")}</TableHead>
              <TableHead className="min-w-[160px]">{t("machine.columns.load")}</TableHead>
              <TableHead className="w-40">{t("machine.columns.lastSeen")}</TableHead>
              <TableHead className="w-40 text-right">{t("machine.columns.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : list.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <EmptyState icon={<Server className="h-10 w-10" />} />
                </TableCell>
              </TableRow>
            ) : (
              list.map((m) => (
                <TableRow key={m.id}>
                  <TableCell><IdBadge id={m.id} /></TableCell>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell className="text-center">
                    {!m.is_active ? (
                      <Badge variant="secondary">{t("machine.columns.inactive")}</Badge>
                    ) : m.is_online ? (
                      <Badge variant="success">{t("machine.columns.online")}</Badge>
                    ) : (
                      <Badge variant="destructive">{t("machine.columns.offline")}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{m.servers_count ?? 0}</TableCell>
                  <TableCell>
                    <LoadStatusCell load={m.load_status} />
                  </TableCell>
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
                        className="h-8 w-8"
                        disabled={!m.is_active || !m.is_online}
                        title={t("machine.operations.upgrade")}
                        onClick={() => setUpgrading(m)}
                      >
                        <ArrowUpToLine className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        disabled={!m.is_active || !m.is_online}
                        title={t("machine.operations.restart")}
                        onClick={() => setRestarting(m)}
                      >
                        <RotateCcw className="h-4 w-4" />
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

      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
      />

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

      <ConfirmDialog
        open={!!upgrading}
        onOpenChange={(v) => {
          if (!v && !upgradeSubmitting) setUpgrading(null);
        }}
        title={t("machine.operations.upgradeTitle")}
        description={upgrading ? t("machine.operations.upgradeDescription", { name: upgrading.name }) : undefined}
        confirmText={t("machine.operations.upgrade")}
        loading={upgradeSubmitting}
        onConfirm={async () => {
          if (!upgrading || upgradeSubmitting) return;
          setUpgradeSubmitting(true);
          try {
            await upgradeMachine(upgrading.id);
            toast.success(t("machine.operations.upgradeSubmitted", { name: upgrading.name }));
            qc.invalidateQueries({ queryKey: ["machines"] });
            setUpgrading(null);
          } catch (e) {
            // api.ts interceptor already surfaces the message via toast.error;
            // we only need to make sure it is not swallowed silently.
            console.error("[machine] upgrade failed", upgrading.id, e);
          } finally {
            setUpgradeSubmitting(false);
          }
        }}
      />

      <ConfirmDialog
        open={!!restarting}
        onOpenChange={(v) => {
          if (!v && !restartSubmitting) setRestarting(null);
        }}
        title={t("machine.operations.restartTitle")}
        description={restarting ? t("machine.operations.restartDescription", { name: restarting.name }) : undefined}
        confirmText={t("machine.operations.restart")}
        loading={restartSubmitting}
        onConfirm={async () => {
          if (!restarting || restartSubmitting) return;
          setRestartSubmitting(true);
          try {
            await restartMachine(restarting.id);
            toast.success(t("machine.operations.restartSubmitted", { name: restarting.name }));
            qc.invalidateQueries({ queryKey: ["machines"] });
            setRestarting(null);
          } catch (e) {
            console.error("[machine] restart failed", restarting.id, e);
          } finally {
            setRestartSubmitting(false);
          }
        }}
      />

      <ConfirmDialog
        open={batchUpgradeOpen}
        onOpenChange={(v) => {
          if (!v && !batchUpgradeSubmitting) setBatchUpgradeOpen(false);
        }}
        title={t("machine.operations.batchUpgradeTitle")}
        description={t("machine.operations.batchUpgradeDescription")}
        confirmText={t("machine.operations.batchUpgrade")}
        loading={batchUpgradeSubmitting}
        onConfirm={async () => {
          if (batchUpgradeSubmitting) return;
          setBatchUpgradeSubmitting(true);
          try {
            const result = await batchUpgradeMachines();
            const skipped = result?.skipped || { inactive: 0, offline: 0 };
            toast.success(t("machine.operations.batchUpgradeSubmitted", {
              submitted: result?.submitted || 0,
              inactive: skipped.inactive || 0,
              offline: skipped.offline || 0,
            }));
            qc.invalidateQueries({ queryKey: ["machines"] });
            setBatchUpgradeOpen(false);
          } catch (e) {
            console.error("[machine] batch upgrade failed", e);
          } finally {
            setBatchUpgradeSubmitting(false);
          }
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
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
          <DialogTitle>
            {machine ? t("machine.form.edit") : t("machine.form.create")}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-y-auto space-y-3 px-6 py-4">
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
        <DialogFooter className="gap-2 border-t px-6 py-4 shrink-0">
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

/* ─── 多系列组合图表 ─── */
const SERIES_COLORS: Record<string, string> = {
  cpu: "hsl(var(--primary))",
  mem: "#f59e0b",
  disk: "#ef4444",
  netIn: "#10b981",
  netOut: "#3b82f6",
};

const SERIES_LABELS: Record<string, string> = {
  cpu: "CPU",
  mem: "MEM",
  disk: "DISK",
  netIn: "↓ IN",
  netOut: "↑ OUT",
};

interface ChartPoint {
  time: string;
  cpu: number;
  mem: number;
  disk: number;
  netIn: number;
  netOut: number;
}

function formatTimeOnly(ts: number): string {
  const d = new Date(ts * 1000);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function MultiSeriesChart({
  data,
  loading,
}: {
  data: ChartPoint[];
  loading: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 600, h: 224 });
  const [visible, setVisible] = useState<Record<string, boolean>>({
    cpu: true, mem: true, disk: true, netIn: true, netOut: true,
  });
  const [tooltip, setTooltip] = useState<{
    x: number;
    idx: number;
  } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setSize({ w: Math.max(entry.contentRect.width, 100), h: 224 });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const toggle = useCallback((key: string) => {
    setVisible((v) => ({ ...v, [key]: !v[key] }));
  }, []);

  if (loading) {
    return (
      <div ref={containerRef} className="flex h-[224px] items-center justify-center">
        <Skeleton className="h-full w-full rounded-lg" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div ref={containerRef} className="flex h-[224px] items-center justify-center text-sm text-muted-foreground">
        暂无数据
      </div>
    );
  }

  const pad = { t: 5, r: 10, b: 25, l: 45 };
  const cw = size.w - pad.l - pad.r;
  const ch = size.h - pad.t - pad.b;

  // Build per-series scales
  const seriesKeys = ["cpu", "mem", "disk", "netIn", "netOut"] as const;
  const allValues = data.flatMap((d) =>
    seriesKeys.filter((k) => visible[k]).map((k) => d[k]),
  );
  const globalMax = Math.max(...allValues, 1);
  const scale = (v: number) =>
    pad.t + ch - (v / globalMax) * ch;

  const xScale = (i: number) =>
    pad.l + (i / Math.max(data.length - 1, 1)) * cw;

  const gridLines = Array.from({ length: 5 }, (_, i) => {
    const y = pad.t + (ch / 4) * i;
    const val = globalMax - (globalMax / 4) * i;
    return { y, label: val >= 1000 ? formatBytes(val) : val.toFixed(1) };
  });

  // x-axis labels
  const labelCount = Math.min(data.length, 6);
  const labelStep = Math.max(Math.floor(data.length / labelCount), 1);
  const xLabels = data.filter(
    (_, i) => i % labelStep === 0 || i === data.length - 1,
  );

  return (
    <div ref={containerRef} style={{ width: "100%" }} className="select-none">
      {/* Legend */}
      <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
        {(["cpu", "mem", "disk"] as const).map((key) => (
          <button
            key={key}
            type="button"
            className={cn(
              "inline-flex items-center gap-1 rounded px-1 py-0.5 transition-opacity hover:bg-muted",
              visible[key] ? "opacity-100" : "opacity-40",
            )}
            onClick={() => setVisible((v) => ({ ...v, [key]: !v[key] }))}
          >
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: SERIES_COLORS[key] }}
            />
            <span className="text-muted-foreground">{SERIES_LABELS[key]}</span>
          </button>
        ))}
        <span className="text-border">|</span>
        {(["netIn", "netOut"] as const).map((key) => (
          <button
            key={key}
            type="button"
            className={cn(
              "inline-flex items-center gap-1 rounded px-1 py-0.5 transition-opacity hover:bg-muted",
              visible[key] ? "opacity-100" : "opacity-40",
            )}
            onClick={() => setVisible((v) => ({ ...v, [key]: !v[key] }))}
          >
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: SERIES_COLORS[key] }}
            />
            <span className="text-muted-foreground">{SERIES_LABELS[key]}</span>
          </button>
        ))}
      </div>

      <div style={{ width: "100%", height: 224 }} className="relative">
      <svg width={size.w} height={size.h} className="overflow-visible">
        {/* Grid */}
        {gridLines.map((gl, i) => (
          <g key={i}>
            <line
              x1={pad.l}
              y1={gl.y}
              x2={size.w - pad.r}
              y2={gl.y}
              stroke="hsl(var(--border))"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            <text
              x={pad.l - 8}
              y={gl.y + 4}
              textAnchor="end"
              fill="hsl(var(--muted-foreground))"
              fontSize={10}
            >
              {gl.label}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {xLabels.map((d) => {
          const idx = data.indexOf(d);
          const x = xScale(idx);
          return (
            <text
              key={idx}
              x={x}
              y={size.h - 5}
              textAnchor="middle"
              fill="hsl(var(--muted-foreground))"
              fontSize={10}
            >
              {d.time}
            </text>
          );
        })}

        {/* Series lines + areas */}
        {seriesKeys
          .filter((k) => visible[k])
          .map((key) => {
            const pts = data.map(
              (d, i) => `${xScale(i)},${scale(d[key])}`,
            );
            const areaPath = `M${pts.join(" L ")} L${xScale(data.length - 1)},${pad.t + ch} L${pad.l},${pad.t + ch} Z`;

            // Smooth line
            let linePath = "";
            if (pts.length >= 2) {
              linePath = `M${pts[0]}`;
              for (let i = 1; i < pts.length; i++) {
                const [x0, y0] = pts[i - 1].split(",").map(Number);
                const [x1, y1] = pts[i].split(",").map(Number);
                linePath += ` C${x0 + (x1 - x0) * 0.25},${y0} ${x1 - (x1 - x0) * 0.25},${y1} ${x1},${y1}`;
              }
            }

            return (
              <g key={key}>
                <defs>
                  <linearGradient id={`fill_${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={SERIES_COLORS[key]}
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="95%"
                      stopColor={SERIES_COLORS[key]}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <path d={areaPath} fill={`url(#fill_${key})`} />
                <path
                  d={linePath}
                  fill="none"
                  stroke={SERIES_COLORS[key]}
                  strokeWidth={1.5}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </g>
            );
          })}

        {/* Hover overlay */}
        <rect
          x={pad.l}
          y={pad.t}
          width={cw}
          height={ch}
          fill="transparent"
          onMouseMove={(e) => {
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;
            const mx = e.clientX - rect.left - pad.l;
            const idx = Math.round(
              (mx / cw) * (data.length - 1),
            );
            setTooltip({
              x: xScale(Math.max(0, Math.min(data.length - 1, idx))),
              idx: Math.max(0, Math.min(data.length - 1, idx)),
            });
          }}
          onMouseLeave={() => setTooltip(null)}
        />

        {/* Tooltip */}
        {tooltip && (
          <>
            {/* Vertical line */}
            <line
              x1={tooltip.x}
              y1={pad.t}
              x2={tooltip.x}
              y2={pad.t + ch}
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={1}
              strokeDasharray="2 2"
            />
            {seriesKeys
              .filter((k) => visible[k])
              .map((key) => {
                const vy = scale(data[tooltip.idx][key]);
                return (
                  <circle
                    key={key}
                    cx={tooltip.x}
                    cy={vy}
                    r={3}
                    fill={SERIES_COLORS[key]}
                    stroke="white"
                    strokeWidth={1.5}
                  />
                );
              })}
            <foreignObject
              x={Math.min(tooltip.x + 12, size.w - 170)}
              y={Math.max(pad.t + 5, 0)}
              width={160}
              height={130}
            >
              <div
                style={{
                  background: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  padding: "8px 12px",
                  fontSize: 12,
                  color: "hsl(var(--popover-foreground))",
                  pointerEvents: "none",
                }}
              >
                <div style={{ fontWeight: 500, marginBottom: 4 }}>
                  {data[tooltip.idx].time}
                </div>
                {seriesKeys
                  .filter((k) => visible[k])
                  .map((key) => (
                    <div
                      key={key}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                      }}
                    >
                      <span style={{ color: SERIES_COLORS[key] }}>
                        {SERIES_LABELS[key]}
                      </span>
                      <span style={{ fontWeight: 500 }}>
                        {key === "netIn" || key === "netOut"
                          ? formatBytes(data[tooltip.idx][key]) + "/s"
                          : key === "cpu"
                            ? data[tooltip.idx][key].toFixed(1) + "%"
                            : data[tooltip.idx][key].toFixed(1) + "%"}
                      </span>
                    </div>
                  ))}
              </div>
            </foreignObject>
          </>
        )}
      </svg>
      </div>
    </div>
  );
}

/* ─── 机器详情侧边栏 ─── */
function MachineDetailDialog({
  machine,
  onOpenChange,
}: {
  machine: Machine | null;
  onOpenChange: (v: boolean) => void;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [showToken, setShowToken] = useState(false);
  const [installCmd, setInstallCmd] = useState<string | null>(null);
  const [copied, setCopied] = useState<"token" | "cmd" | null>(null);
  const [history, setHistory] = useState<any[] | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [nodes, setNodes] = useState<any[] | null>(null);
  const [nodesLoading, setNodesLoading] = useState(false);
  const [logLines, setLogLines] = useState<string[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsMeta, setLogsMeta] = useState<{
    online?: boolean;
    stale?: boolean;
    updated_at?: number | null;
    message?: string;
  }>({});
  const logBoxRef = useRef<HTMLPreElement | null>(null);

  // Time range state
  const RANGES = [
    { label: "1h", hours: 1 },
    { label: "6h", hours: 6 },
    { label: "12h", hours: 12 },
    { label: "24h", hours: 24 },
  ] as const;
  const [rangeIdx, setRangeIdx] = useState(1); // default 6h

  const loadToken = useCallback(async () => {
    if (!machine) return;
    try {
      const res = await getMachineToken(machine.id);
      setToken(res?.data?.token || res?.token || "");
    } catch (e) {
      toast.error(t("machine.messages.tokenFetchFailed"));
    }
  }, [machine, t]);

  const loadCmd = useCallback(async () => {
    if (!machine) return;
    try {
      const res = await getMachineInstallCommand(machine.id);
      setInstallCmd(res?.data?.command || res?.command || "");
    } catch (e) {}
  }, [machine]);

  const loadHistory = useCallback(
    async (hours: number) => {
      if (!machine) return;
      setHistoryLoading(true);
      try {
        const res = await getMachineHistory(machine.id, hours);
        const items = Array.isArray(res) ? res : res?.data || [];
        setHistory(items);
      } catch (e) {
        setHistory([]);
      } finally {
        setHistoryLoading(false);
      }
    },
    [machine],
  );

  const loadNodes = useCallback(async () => {
    if (!machine) return;
    setNodesLoading(true);
    try {
      const res = await getMachineNodes(machine.id);
      const items = Array.isArray(res) ? res : res?.data || [];
      setNodes(items);
    } catch (e) {
      setNodes([]);
    } finally {
      setNodesLoading(false);
    }
  }, [machine]);

  const loadLogs = useCallback(
    async (refresh = true) => {
      if (!machine) return;
      setLogsLoading(true);
      try {
        const res = await getMachineLogs(machine.id, { limit: 500, refresh });
        const lines = Array.isArray(res?.lines) ? res.lines : [];
        setLogLines(lines);
        setLogsMeta({
          online: res?.online,
          stale: res?.stale,
          updated_at: res?.updated_at,
          message: res?.message,
        });
        // scroll after paint
        requestAnimationFrame(() => {
          if (logBoxRef.current) {
            logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight;
          }
        });
      } catch (e) {
        toast.error(t("machine.logs.fetchFailed"));
      } finally {
        setLogsLoading(false);
      }
    },
    [machine, t],
  );

  useEffect(() => {
    if (machine) {
      loadToken();
      loadCmd();
      loadHistory(RANGES[rangeIdx].hours);
      loadNodes();
      loadLogs(true);
    } else {
      setLogLines([]);
      setLogsMeta({});
    }
  }, [machine]);

  const activeNodes = nodes?.filter((n: any) => n.enabled).length || 0;

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

  // Build chart data
  const chartData: ChartPoint[] = (history || []).map((h: any) => ({
    time: formatTimeOnly(h.recorded_at),
    cpu: Math.round(h.cpu * 100) / 100,
    mem:
      h.mem_total > 0
        ? Math.round((h.mem_used / h.mem_total) * 10000) / 100
        : 0,
    disk:
      h.disk_total > 0
        ? Math.round((h.disk_used / h.disk_total) * 10000) / 100
        : 0,
    netIn: Math.round(h.net_in_speed),
    netOut: Math.round(h.net_out_speed),
  }));

  if (!machine) return null;

  return (
    <Dialog open={!!machine} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-mono">
            <Server className="h-5 w-5" />
            {machine.name} <DialogDescription>
              节点数: {machine.servers_count ?? 0} · 最后心跳:{" "}
              {machine.last_seen_at ? formatDate(machine.last_seen_at) : "从未"}
            </DialogDescription>
          </DialogTitle>
          
        </DialogHeader>

        <div className="max-h-[70vh] space-y-4 overflow-y-auto">

        {/* ─── 卡片 1: 状态摘要 ─── */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="font-mono">
                    SID:{machine.id}
                  </Badge>
                  <Badge
                    variant={!machine.is_active ? "secondary" : machine.is_online ? "success" : "destructive"}
                    className="flex items-center gap-1"
                  >
                    <span
                      className={cn(
                        "size-2 rounded-full",
                        !machine.is_active ? "bg-muted-foreground" : machine.is_online ? "bg-emerald-500" : "bg-red-500",
                      )}
                    />
                    {!machine.is_active ? "禁用" : machine.is_online ? "在线" : "离线"}
                  </Badge>
                  {(() => {
                    const cpu = machine.load_status?.cpu;
                    if (cpu == null && !(history && history.length > 0)) return null;
                    const value =
                      cpu != null
                        ? cpu
                        : (history![history!.length - 1] as any).cpu;
                    return (
                      <span className="font-mono text-xs text-muted-foreground">
                        CPU {Number(value).toFixed(0)}%
                      </span>
                    );
                  })()}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>
                    最后心跳:{" "}
                    {machine.last_seen_at
                      ? formatDate(machine.last_seen_at)
                      : "从未"}
                  </span>
                  <span>•</span>
                  <span>节点数: {machine.servers_count ?? 0}</span>
                </div>
                {token && (
                  <p className="max-w-[520px] truncate text-xs text-muted-foreground font-mono">
                    {showToken ? token : "••••••••" + token.slice(-8)}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="default"
                  className="gap-1.5 text-xs"
                  onClick={() => {
                    const id = machine.id;
                    onOpenChange(false);
                    navigate(adminPath("server/manage") + "?createWithMachineId=" + id);
                  }}
                >
                  新增节点到此服务器
                  <ArrowRight className="size-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-xs"
                  onClick={() => navigate(adminPath("server/manage"))}
                >
                  前往节点管理
                  <ExternalLink className="size-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ─── 卡片 1.5: 当前负载 load_status ─── */}
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Activity className="size-4" />
              {t("machine.columns.load")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CurrentLoadSummary load={machine.load_status} />
          </CardContent>
        </Card>

        {/* ─── 卡片 2: 负载趋势 ─── */}
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Activity className="size-4" />
                负载趋势
              </CardTitle>
              <div className="flex gap-1">
                {RANGES.map((r, i) => (
                  <button
                    key={r.hours}
                    type="button"
                    className={cn(
                      "rounded px-2 py-0.5 text-xs transition-colors",
                      i === rangeIdx
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted",
                    )}
                    onClick={() => {
                      setRangeIdx(i);
                      loadHistory(r.hours);
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <MultiSeriesChart data={chartData} loading={historyLoading} />
          </CardContent>
        </Card>

        {/* ─── 卡片 3: Token ─── */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <EyeOff className="size-4 text-muted-foreground" />
              服务器 Token
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              此 Token 用于 Fboard-Node 向面板认证，请妥善保管。
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 font-mono text-xs"
                onClick={() => {
                  if (token) {
                    setShowToken((v) => !v);
                  } else {
                    loadToken().then(() => setShowToken(true));
                  }
                }}
              >
                {showToken ? (
                  <EyeOff className="mr-1 h-3.5 w-3.5" />
                ) : (
                  <Eye className="mr-1 h-3.5 w-3.5" />
                )}
                {token && showToken
                  ? t("machine.token.hide", "隐藏 Token")
                  : t("machine.token.show")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 font-mono text-xs"
                onClick={onResetToken}
              >
                <Loader2 className="mr-1 h-3.5 w-3.5" />
                {t("machine.token.reset")}
              </Button>
            </div>
            {showToken && token && (
              <div className="flex items-center gap-2 rounded-md border bg-muted/50 p-2">
                <code className="flex-1 font-mono text-xs break-all">{token}</code>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 shrink-0"
                  onClick={async () => {
                    await navigator.clipboard.writeText(token);
                    toast.success(t("machine.token.copied"));
                  }}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ─── 卡片 4: 安装命令 ─── */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Terminal className="size-4 text-muted-foreground" />
              安装 Fboard-Node
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              在目标服务器上执行此命令，即可用 machine mode 安装
              Fboard-Node 并接入当前服务器记录。
            </p>
            <div className="group relative rounded-lg border bg-muted/50 p-3">
              <code className="block whitespace-pre-wrap break-all pr-8 font-mono text-xs">
                {installCmd || t("machine.install.loading", "加载中...")}
              </code>
              {installCmd && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-2 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={async () => {
                    await navigator.clipboard.writeText(installCmd);
                    setCopied("cmd");
                    toast.success(t("machine.install.copied"));
                    setTimeout(() => setCopied(null), 2000);
                  }}
                >
                  {copied === "cmd" ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground">
                需要 root 或 sudo 权限，且目标服务器需为支持 systemd 的 Linux。
              </p>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 font-mono text-xs"
                onClick={async () => {
                  if (!installCmd) return;
                  await navigator.clipboard.writeText(installCmd);
                  setCopied("cmd");
                  toast.success(t("machine.install.copied"));
                  setTimeout(() => setCopied(null), 2000);
                }}
              >
                <Copy className="h-3.5 w-3.5" />
                {t("machine.install.copy")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ─── 卡片 5: 运行日志 ─── */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <ScrollText className="size-4 text-muted-foreground" />
                {t("machine.logs.title")}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                {logsMeta.updated_at ? (
                  <span className="text-xs text-muted-foreground font-mono">
                    {t("machine.logs.updatedAt", {
                      time: formatDate(logsMeta.updated_at),
                    })}
                  </span>
                ) : null}
                <Badge variant="secondary" className="text-xs font-mono">
                  {t("machine.logs.lineCount", { count: logLines.length })}
                </Badge>
                {logsMeta.stale ? (
                  <Badge variant="outline" className="text-xs">
                    {t("machine.logs.stale")}
                  </Badge>
                ) : null}
                {logsMeta.online === false ? (
                  <Badge variant="destructive" className="text-xs">
                    {t("machine.logs.offline")}
                  </Badge>
                ) : null}
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs"
                  disabled={logsLoading}
                  onClick={() => loadLogs(true)}
                >
                  {logsLoading ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="size-3.5" />
                  )}
                  {t("machine.logs.refresh")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs"
                  disabled={!logLines.length}
                  onClick={async () => {
                    await navigator.clipboard.writeText(logLines.join("\n"));
                    toast.success(t("machine.logs.copied"));
                  }}
                >
                  <Copy className="size-3.5" />
                  {t("machine.logs.copy")}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-xs text-muted-foreground">
              {t("machine.logs.description")}
            </p>
            {logsMeta.message ? (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                {logsMeta.message}
              </p>
            ) : null}
            {logsLoading && logLines.length === 0 ? (
              <Skeleton className="h-[240px] rounded-lg" />
            ) : (
              <pre
                ref={logBoxRef}
                className="h-[280px] overflow-auto rounded-lg border bg-zinc-950 p-3 font-mono text-[11px] leading-5 text-zinc-100"
              >
                {logLines.length === 0
                  ? t("machine.logs.empty")
                  : logLines.join("\n")}
              </pre>
            )}
          </CardContent>
        </Card>

        {/* ─── 卡片 6: 关联节点 ─── */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-sm font-semibold">
                关联节点
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs font-mono">
                  {(nodes || []).length} 个节点
                </Badge>
                <Badge variant="outline" className="text-xs font-mono">
                  {activeNodes} 个已激活
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-xs"
                  onClick={() => navigate(adminPath("server/manage"))}
                >
                  <Link2 className="size-3.5" />
                  关联已有节点
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-xs"
                  onClick={() => navigate(adminPath("server/manage"))}
                >
                  前往节点管理
                  <ArrowRight className="size-3.5" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {nodesLoading ? (
              <Skeleton className="h-[120px] rounded-lg" />
            ) : !nodes || nodes.length === 0 ? (
              <div className="rounded-lg border py-8">
                <EmptyState
                  icon={<Server className="h-8 w-8" />}
                />
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full min-w-[480px] text-xs">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="px-3 py-2 text-left font-mono font-medium">
                        名称
                      </th>
                      <th className="px-3 py-2 text-left font-mono font-medium">
                        类型
                      </th>
                      <th className="px-3 py-2 text-left font-mono font-medium">
                        地址
                      </th>
                      <th className="px-3 py-2 text-center font-mono font-medium">
                        已激活
                      </th>
                      <th className="w-10 px-2 py-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {nodes.map((n: any) => (
                      <tr key={n.id} className="border-b last:border-0">
                        <td className="px-3 py-2 font-mono">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 text-left text-primary hover:underline"
                          >
                            <span className="text-muted-foreground">
                              #{n.id}
                            </span>
                            {n.name}
                            <ExternalLink className="size-3 shrink-0" />
                          </button>
                        </td>
                        <td className="px-3 py-2">
                          <Badge
                            variant="outline"
                            className="font-mono text-[10px]"
                          >
                            {n.type}
                          </Badge>
                        </td>
                        <td className="px-3 py-2 font-mono text-muted-foreground">
                          {n.host}:{n.port}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <Switch
                            checked={n.enabled}
                            onCheckedChange={() => {
                              toast.info(
                                t(
                                  "machine.nodesStatus.toggleHint",
                                  "在节点管理中修改状态",
                                ),
                              );
                            }}
                          />
                        </td>
                        <td className="px-2 py-2 text-center">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-7 text-muted-foreground hover:text-destructive"
                            title="取消关联"
                          >
                            <Unlink className="size-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
