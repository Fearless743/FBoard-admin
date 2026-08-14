import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useUrlState, listQuerySchema } from "@/hooks/use-url-state";
import {
  Plus, Pencil, Trash2, Loader2, Server, Copy, Check, Eye, EyeOff,
  Activity, Terminal, Unlink, Link2, ExternalLink, ArrowRight, ArrowUpToLine, RotateCcw,
  ScrollText, RefreshCw, Search, Wifi, WifiOff, Gauge, Network, MoreHorizontal,
  Play, Square, RefreshCcw,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, copyToClipboard } from "@/lib/utils";
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
  stopMachine,
  startMachine,
  reloadMachine,
  getMachineLogs,
  batchUpgradeMachines,
  fetchAvailableNodes,
  bindMachineNodes,
  unbindMachineNode,
  fetchProtocolTypes,
  type Machine,
  type MachineLoadStatus,
  type MachineKernelStatus,
  type MachineSummary,
  type AvailableNode,
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

/** 机器状态筛选（与后端 fetch 的 status 参数对齐） */
const MACHINE_STATUS_OPTIONS = [
  "all",
  "online",
  "offline",
  "inactive",
  "high_load",
] as const;
type MachineStatusFilterKey = (typeof MACHINE_STATUS_OPTIONS)[number];

/** 与后端 summary 一致：CPU / 内存 / 磁盘任一 ≥ 70% 视为高负载 */
function isHighLoadMachine(m: Machine): boolean {
  const load = m.load_status;
  if (!load) return false;
  const cpu = load.cpu == null ? null : Math.min(100, load.cpu);
  const mem = usagePercent(load.mem?.used, load.mem?.total);
  const disk = usagePercent(load.disk?.used, load.disk?.total);
  return [cpu, mem, disk].some((v) => v != null && v >= 70);
}

/** 状态过滤：后端已粗筛，这里做精确判断（在线走 Redis 活跃缓存，高负载走阈值） */
function matchesStatusFilter(m: Machine, status: MachineStatusFilterKey): boolean {
  switch (status) {
    case "all":
      return true;
    case "online":
      return m.is_active === true && m.is_online === true;
    case "offline":
      return m.is_active === true && m.is_online !== true;
    case "inactive":
      return m.is_active === false;
    case "high_load":
      return m.is_active === true && m.is_online === true && isHighLoadMachine(m);
    default:
      return true;
  }
}

function loadLevelClass(value: number | null | undefined): string {
  if (value == null) return "bg-muted-foreground/30";
  if (value >= 90) return "bg-destructive";
  if (value >= 70) return "bg-amber-500";
  return "bg-emerald-500";
}


function machineKernelStatus(m: Machine): MachineKernelStatus | null {
  const status = m.load_status?.kernel?.status;
  if (status === "idle" || status === "running" || status === "stopped" || status === "partial") {
    return status;
  }
  return null;
}

/** 根据上报的内核聚合状态控制运维按钮可用性（未知状态保持可操作） */
function kernelActionDisabled(
  m: Machine,
  action: "start" | "stop" | "reload" | "restart",
): boolean {
  if (!m.is_active || !m.is_online) return true;
  const status = machineKernelStatus(m);
  if (status == null) return false; // 旧节点未上报：不禁用
  const total = m.load_status?.kernel?.nodes_total ?? 0;
  if (status === "idle" || total === 0) return true;
  switch (action) {
    case "start":
      return status === "running";
    case "stop":
      return status === "stopped";
    case "reload":
      // 运维停止后 reload 会失败，要求先 start
      return status === "stopped";
    case "restart":
      return false;
    default:
      return false;
  }
}

function KernelStatusBadge({ machine }: { machine: Machine }) {
  const { t } = useTranslation();
  if (!machine.is_online || !machine.is_active) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }
  const status = machineKernelStatus(machine);
  const k = machine.load_status?.kernel;
  if (status == null) {
    return (
      <span className="text-xs text-muted-foreground" title={t("machine.columns.kernelUnknown")}>
        {t("machine.columns.kernelUnknown")}
      </span>
    );
  }
  const labelKey =
    status === "running"
      ? "machine.columns.kernelRunning"
      : status === "stopped"
        ? "machine.columns.kernelStopped"
        : status === "partial"
          ? "machine.columns.kernelPartial"
          : "machine.columns.kernelIdle";
  const variant:
    | "success"
    | "secondary"
    | "warning"
    | "outline" =
    status === "running"
      ? "success"
      : status === "stopped"
        ? "secondary"
        : status === "partial"
          ? "warning"
          : "outline";
  const detail =
    k && (k.nodes_total ?? 0) > 0
      ? t("machine.columns.kernelDetail", {
          running: k.nodes_running ?? 0,
          total: k.nodes_total ?? 0,
        })
      : undefined;
  return (
    <div className="flex flex-col items-start gap-0.5">
      <Badge variant={variant} className="font-normal">
        {t(labelKey)}
      </Badge>
      {detail ? (
        <span className="text-[10px] tabular-nums text-muted-foreground">{detail}</span>
      ) : null}
    </div>
  );
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
  // 机器列表默认每页 10 条（与其它列表 20 不同）
  const [qs, setQs, query] = useUrlState(
    listQuerySchema(
      {
        q: { type: "string", default: "", debounce: 400 },
        status: {
          type: "enum",
          values: MACHINE_STATUS_OPTIONS as readonly string[],
          default: "all",
        },
      },
      { pageSize: 10 },
    ),
  );
  const statusFilter = (MACHINE_STATUS_OPTIONS as readonly string[]).includes(
    query.status,
  )
    ? (query.status as MachineStatusFilterKey)
    : "all";
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Machine | null>(null);
  const [deleting, setDeleting] = useState<Machine | null>(null);
  const [viewing, setViewing] = useState<Machine | null>(null);
  const [viewingLogs, setViewingLogs] = useState<Machine | null>(null);
  const [upgrading, setUpgrading] = useState<Machine | null>(null);
  const [kernelOp, setKernelOp] = useState<{ machine: Machine; action: "start" | "stop" | "reload" | "restart" } | null>(null);
  const [upgradeSubmitting, setUpgradeSubmitting] = useState(false);
  const [kernelSubmitting, setKernelSubmitting] = useState(false);
  const [batchUpgradeOpen, setBatchUpgradeOpen] = useState(false);
  const [batchUpgradeSubmitting, setBatchUpgradeSubmitting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: [
      "machines",
      { page: query.page, pageSize: query.pageSize, search: query.q, status: statusFilter },
    ],
    queryFn: () =>
      fetchMachines(query.page, query.pageSize, query.q, statusFilter),
    refetchInterval: 30_000,
  });
  // 后端只做 SQL 粗筛，这里二次精确过滤（在线/高负载）
  const list: Machine[] = useMemo(
    () => (data?.data || []).filter((m) => matchesStatusFilter(m, statusFilter)),
    [data?.data, statusFilter],
  );
  const total = data?.total || 0;

  const summary: MachineSummary = useMemo(
    () =>
      data?.summary ?? {
        total: 0,
        online: 0,
        offline: 0,
        high_load: 0,
        nodes: 0,
      },
    [data?.summary],
  );

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

      <div className="mb-4 grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {isLoading && !data ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-[110px] rounded-lg" />
          ))
        ) : (
          <>
            <StatCard
              title={t("machine.overview.total")}
              value={summary.total.toLocaleString()}
              footer={t("machine.overview.total_hint", {
                count: summary.nodes,
              })}
              icon={<Server className="h-4 w-4" />}
              iconClassName="bg-sky-500/10 text-sky-600 dark:text-sky-400"
            />
            <StatCard
              title={t("machine.overview.online")}
              value={summary.online.toLocaleString()}
              footer={t("machine.overview.online_hint")}
              icon={<Wifi className="h-4 w-4" />}
              iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            />
            <StatCard
              title={t("machine.overview.offline")}
              value={summary.offline.toLocaleString()}
              footer={t("machine.overview.offline_hint")}
              icon={<WifiOff className="h-4 w-4" />}
              iconClassName="bg-rose-500/10 text-rose-600 dark:text-rose-400"
              highlight={summary.offline > 0}
            />
            <StatCard
              title={t("machine.overview.high_load")}
              value={summary.high_load.toLocaleString()}
              footer={t("machine.overview.high_load_hint")}
              icon={<Gauge className="h-4 w-4" />}
              iconClassName="bg-amber-500/10 text-amber-600 dark:text-amber-400"
              highlight={summary.high_load > 0}
            />
            <StatCard
              title={t("machine.columns.nodesHosted")}
              value={summary.nodes.toLocaleString()}
              footer={t("machine.overview.nodes_suffix")}
              icon={<Network className="h-4 w-4" />}
              iconClassName="bg-violet-500/10 text-violet-600 dark:text-violet-400"
            />
          </>
        )}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("machine.toolbar.search")}
            value={qs.q}
            onChange={(e) => setQs({ q: e.target.value })}
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) =>
            setQs({ status: v as MachineStatusFilterKey, page: 1 })
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MACHINE_STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {t(`machine.toolbar.status_${s}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">{t("machine.columns.id")}</TableHead>
              <TableHead>{t("machine.columns.name")}</TableHead>
              <TableHead className="w-24 text-center">{t("machine.columns.status")}</TableHead>
              <TableHead className="w-24 text-right">{t("machine.columns.nodesHosted")}</TableHead>
              <TableHead className="w-28">{t("machine.columns.version")}</TableHead>
              <TableHead className="w-28">{t("machine.columns.kernel")}</TableHead>
              <TableHead className="min-w-[160px]">{t("machine.columns.load")}</TableHead>
              <TableHead className="w-40">{t("machine.columns.lastSeen")}</TableHead>
              <TableHead className="w-20 text-right">{t("machine.columns.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 9 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : list.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9}>
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
                  <TableCell className="text-xs font-mono text-muted-foreground tabular-nums">
                    {m.version || m.load_status?.version || "—"}
                  </TableCell>
                  <TableCell>
                    <KernelStatusBadge machine={m} />
                  </TableCell>
                  <TableCell>
                    <LoadStatusCell load={m.load_status} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {m.last_seen_at ? formatDate(m.last_seen_at) : t("machine.columns.never")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            title={t("machine.columns.actions")}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => setViewing(m)}>
                            <Eye className="h-4 w-4" />
                            {t("machine.detail.title")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setEditing(m); setOpen(true); }}>
                            <Pencil className="h-4 w-4" />
                            {t("machine.form.edit")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setViewingLogs(m)}>
                            <ScrollText className="h-4 w-4" />
                            {t("machine.logs.title")}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            disabled={!m.is_active || !m.is_online}
                            onClick={() => setUpgrading(m)}
                          >
                            <ArrowUpToLine className="h-4 w-4" />
                            {t("machine.operations.upgrade")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={kernelActionDisabled(m, "start")}
                            onClick={() => setKernelOp({ machine: m, action: "start" })}
                          >
                            <Play className="h-4 w-4" />
                            {t("machine.operations.start")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={kernelActionDisabled(m, "reload")}
                            onClick={() => setKernelOp({ machine: m, action: "reload" })}
                          >
                            <RefreshCcw className="h-4 w-4" />
                            {t("machine.operations.reload")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={kernelActionDisabled(m, "restart")}
                            onClick={() => setKernelOp({ machine: m, action: "restart" })}
                          >
                            <RotateCcw className="h-4 w-4" />
                            {t("machine.operations.restart")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={kernelActionDisabled(m, "stop")}
                            onClick={() => setKernelOp({ machine: m, action: "stop" })}
                          >
                            <Square className="h-4 w-4" />
                            {t("machine.operations.stop")}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeleting(m)}
                          >
                            <Trash2 className="h-4 w-4" />
                            {t("machine.messages.deleteButton")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination
        page={qs.page}
        pageSize={qs.pageSize}
        total={total}
        onPageChange={(p) => setQs({ page: p })}
        onPageSizeChange={(s) => setQs({ pageSize: s, page: 1 })}
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

      <MachineLogsDialog
        machine={viewingLogs}
        onOpenChange={(v) => !v && setViewingLogs(null)}
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
        open={!!kernelOp}
        onOpenChange={(v) => {
          if (!v && !kernelSubmitting) setKernelOp(null);
        }}
        title={
          kernelOp
            ? t(`machine.operations.${kernelOp.action}Title` as const)
            : undefined
        }
        description={
          kernelOp
            ? t(`machine.operations.${kernelOp.action}Description` as const, {
                name: kernelOp.machine.name,
              })
            : undefined
        }
        confirmText={
          kernelOp ? t(`machine.operations.${kernelOp.action}` as const) : undefined
        }
        variant={
          kernelOp && (kernelOp.action === "stop" || kernelOp.action === "restart")
            ? "destructive"
            : "default"
        }
        loading={kernelSubmitting}
        onConfirm={async () => {
          if (!kernelOp || kernelSubmitting) return;
          setKernelSubmitting(true);
          const { machine, action } = kernelOp;
          try {
            if (action === "start") await startMachine(machine.id);
            else if (action === "stop") await stopMachine(machine.id);
            else if (action === "reload") await reloadMachine(machine.id);
            else await restartMachine(machine.id);
            toast.success(
              t(`machine.operations.${action}Submitted` as const, { name: machine.name }),
            );
            // 节点会在内核操作后立即上报一次 status；短延迟再刷列表以更新按钮状态
            qc.invalidateQueries({ queryKey: ["machines"] });
            window.setTimeout(() => {
              qc.invalidateQueries({ queryKey: ["machines"] });
            }, 1500);
            setKernelOp(null);
          } catch (e) {
            console.error(`[machine] kernel ${action} failed`, machine.id, e);
          } finally {
            setKernelSubmitting(false);
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
  const { t } = useTranslation();
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
        {t("common.table.noData")}
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

/* ─── 节点地址压缩显示：截断长 host，悬浮展示完整地址 ─── */
function NodeHostPort({
  host,
  port,
}: {
  host?: string | null;
  port?: number | string | null;
}) {
  if (!host) {
    return <span className="text-muted-foreground">—</span>;
  }
  const full = `${host}${port != null && port !== "" ? `:${port}` : ""}`;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-block max-w-[160px] truncate align-bottom">
          {full}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs break-all font-mono text-xs">
        {full}
      </TooltipContent>
    </Tooltip>
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
  const [bindOpen, setBindOpen] = useState(false);
  const [unbindTarget, setUnbindTarget] = useState<any | null>(null);
  const [unbindSubmitting, setUnbindSubmitting] = useState(false);
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

  useEffect(() => {
    if (machine) {
      loadToken();
      loadCmd();
      loadHistory(RANGES[rangeIdx].hours);
      loadNodes();
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

  const onUnbindNode = async () => {
    if (!machine || !unbindTarget) return;
    setUnbindSubmitting(true);
    try {
      await unbindMachineNode(machine.id, unbindTarget.id);
      toast.success(t("machine.detail.unbindSuccess", { name: unbindTarget.name }));
      setUnbindTarget(null);
      loadNodes();
    } catch (e) {
      toast.error(t("machine.detail.unbindFailed"));
    } finally {
      setUnbindSubmitting(false);
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
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
          <DialogTitle className="flex items-center gap-2 font-mono">
            <Server className="h-5 w-5" />
            {machine.name}
          </DialogTitle>
          <DialogDescription>
            {t("machine.columns.nodes")}: {machine.servers_count ?? 0} ·{" "}
            {t("machine.columns.lastSeen")}:{" "}
            {machine.last_seen_at
              ? formatDate(machine.last_seen_at)
              : t("machine.columns.never")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto space-y-4 px-6 py-4">
          {/* ─── 卡片 1: 状态摘要 ─── */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="font-mono">
                      SID:{machine.id}
                    </Badge>
                    <Badge
                      variant={!machine.is_active ? "secondary" : machine.is_online ? "success" : "destructive"}
                    >
                      {!machine.is_active
                        ? t("machine.columns.inactive")
                        : machine.is_online
                          ? t("machine.columns.online")
                          : t("machine.columns.offline")}
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
                          {t("machine.columns.cpu")} {Number(value).toFixed(0)}%
                        </span>
                      );
                    })()}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span>
                      {t("machine.columns.lastSeen")}:{" "}
                      {machine.last_seen_at
                        ? formatDate(machine.last_seen_at)
                        : t("machine.columns.never")}
                    </span>
                    <span>•</span>
                    <span>
                      {t("machine.columns.nodes")}: {machine.servers_count ?? 0}
                    </span>
                    {(machine.version || machine.load_status?.version) && (
                      <>
                        <span>•</span>
                        <span className="font-mono">
                          {t("machine.columns.version")}:{" "}
                          {machine.version || machine.load_status?.version}
                        </span>
                      </>
                    )}
                    {machineKernelStatus(machine) && (
                      <>
                        <span>•</span>
                        <span>
                          {t("machine.columns.kernel")}:{" "}
                          {t(
                            machineKernelStatus(machine) === "running"
                              ? "machine.columns.kernelRunning"
                              : machineKernelStatus(machine) === "stopped"
                                ? "machine.columns.kernelStopped"
                                : machineKernelStatus(machine) === "partial"
                                  ? "machine.columns.kernelPartial"
                                  : "machine.columns.kernelIdle",
                          )}
                          {machine.load_status?.kernel &&
                          (machine.load_status.kernel.nodes_total ?? 0) > 0
                            ? ` (${machine.load_status.kernel.nodes_running ?? 0}/${machine.load_status.kernel.nodes_total})`
                            : ""}
                        </span>
                      </>
                    )}
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
                    {t("machine.detail.addNodeToServer")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-xs"
                    onClick={() => navigate(adminPath("server/manage") + "?machineId=" + machine.id)}
                  >
                    {t("machine.detail.openNodeManage")}
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ─── 卡片 1.5: 当前负载 load_status ─── */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Activity className="h-4 w-4" />
                {t("machine.columns.load")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CurrentLoadSummary load={machine.load_status} />
            </CardContent>
          </Card>

          {/* ─── 卡片 2: 负载趋势 ─── */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <Activity className="h-4 w-4" />
                  {t("machine.detail.loadTrend")}
                </CardTitle>
                <div className="flex gap-1 rounded-md border bg-muted/40 p-0.5">
                  {RANGES.map((r, i) => (
                    <button
                      key={r.hours}
                      type="button"
                      className={cn(
                        "rounded-sm px-2 py-0.5 text-xs transition-colors",
                        i === rangeIdx
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground",
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
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <EyeOff className="h-4 w-4 text-muted-foreground" />
                {t("machine.token.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">
                {t("machine.token.description")}
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
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                  {token && showToken
                    ? t("machine.token.hide")
                    : t("machine.token.show")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 font-mono text-xs"
                  onClick={onResetToken}
                >
                  <Loader2 className="h-3.5 w-3.5" />
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
                      try {
                        await copyToClipboard(token);
                        toast.success(t("machine.token.copied"));
                      } catch {
                        toast.error(t("common.copy.failed"));
                      }
                    }}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ─── 卡片 4: 安装命令 ─── */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Terminal className="h-4 w-4 text-muted-foreground" />
                {t("machine.install.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">
                {t("machine.install.description")}
              </p>
              <div className="group relative rounded-lg border bg-muted/50 p-3">
                <code className="block whitespace-pre-wrap break-all pr-8 font-mono text-xs">
                  {installCmd || t("machine.install.loading")}
                </code>
                {installCmd && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-2 top-2 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={async () => {
                      try {
                        await copyToClipboard(installCmd);
                        setCopied("cmd");
                        toast.success(t("machine.install.copied"));
                        setTimeout(() => setCopied(null), 2000);
                      } catch {
                        toast.error(t("common.copy.failed"));
                      }
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
                  {t("machine.install.hint")}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 font-mono text-xs"
                  onClick={async () => {
                    if (!installCmd) return;
                    try {
                      await copyToClipboard(installCmd);
                      setCopied("cmd");
                      toast.success(t("machine.install.copied"));
                      setTimeout(() => setCopied(null), 2000);
                    } catch {
                      toast.error(t("common.copy.failed"));
                    }
                  }}
                >
                  <Copy className="h-3.5 w-3.5" />
                  {t("machine.install.copy")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ─── 卡片 5: 关联节点 ─── */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle className="text-sm font-semibold">
                  {t("machine.detail.associatedNodes")}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="text-xs font-mono">
                    {t("machine.detail.nodeCount", {
                      count: (nodes || []).length,
                    })}
                  </Badge>
                  <Badge variant="outline" className="text-xs font-mono">
                    {t("machine.detail.nodeEnabledCount", {
                      count: activeNodes,
                    })}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 text-xs"
                    onClick={() => setBindOpen(true)}
                  >
                    <Link2 className="h-3.5 w-3.5" />
                    {t("machine.detail.bindExistingButton")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-xs"
                    onClick={() => navigate(adminPath("server/manage") + "?machineId=" + machine.id)}
                  >
                    {t("machine.detail.openNodeManage")}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {nodesLoading ? (
                <Skeleton className="h-[120px] rounded-lg" />
              ) : !nodes || nodes.length === 0 ? (
                <div className="rounded-lg border bg-muted/20 py-8">
                  <EmptyState
                    icon={<Server className="h-8 w-8" />}
                  />
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-mono text-xs">
                          {t("machine.detail.nodeName")}
                        </TableHead>
                        <TableHead className="font-mono text-xs">
                          {t("machine.detail.nodeType")}
                        </TableHead>
                        <TableHead className="font-mono text-xs">
                          {t("machine.detail.nodeHost")}
                        </TableHead>
                        <TableHead className="text-center font-mono text-xs">
                          {t("machine.detail.nodeEnabled")}
                        </TableHead>
                        <TableHead className="w-10" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {nodes.map((n: any) => (
                        <TableRow key={n.id}>
                          <TableCell className="font-mono text-xs">
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 text-left text-primary hover:underline"
                            >
                              <Badge variant="secondary" className="font-mono text-[10px]">
                                {n.id}
                              </Badge>
                              {n.name}
                              <ExternalLink className="h-3 w-3 shrink-0" />
                            </button>
                          </TableCell>
                          <TableCell className="text-xs">
                            <Badge
                              variant="outline"
                              className="font-mono text-[10px]"
                            >
                              {n.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[200px] font-mono text-xs text-muted-foreground">
                            <NodeHostPort host={n.host} port={n.port} />
                          </TableCell>
                          <TableCell className="text-center">
                            <Switch
                              checked={n.enabled}
                              onCheckedChange={() => {
                                toast.info(t("machine.detail.toggleEnabledError"));
                              }}
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              title={t("machine.detail.unbindNode")}
                              onClick={() => setUnbindTarget(n)}
                            >
                              <Unlink className="h-3.5 w-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>

      {/* 解绑确认 */}
      <ConfirmDialog
        open={!!unbindTarget}
        onOpenChange={(v) => {
          if (!v && !unbindSubmitting) setUnbindTarget(null);
        }}
        title={t("machine.detail.unbindConfirmTitle")}
        description={
          unbindTarget
            ? t("machine.detail.unbindConfirmDescription", { name: unbindTarget.name })
            : undefined
        }
        confirmText={t("machine.detail.unbindNode")}
        variant="destructive"
        loading={unbindSubmitting}
        onConfirm={onUnbindNode}
      />

      {/* 绑定已有节点 */}
      <BindNodesDialog
        machine={machine}
        open={bindOpen}
        onOpenChange={(v) => {
          setBindOpen(v);
          if (!v) loadNodes();
        }}
      />
    </Dialog>
  );
}

/* ─── 绑定已有节点弹窗 ─── */
function BindNodesDialog({
  machine,
  open,
  onOpenChange,
}: {
  machine: Machine | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [type, setType] = useState("");
  const [nodes, setNodes] = useState<AvailableNode[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(1);
  const pageSize = 50;

  // 协议类型列表（与节点管理页一致）
  const { data: protocolTypesData = [] } = useQuery({
    queryKey: ["server", "protocol-types"],
    queryFn: fetchProtocolTypes,
    staleTime: 300000,
    enabled: open,
  });

  useEffect(() => {
    const h = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => window.clearTimeout(h);
  }, [search]);

  useEffect(() => {
    setSelected(new Set());
    setPage(1);
    setType("");
    setSearch("");
    setDebouncedSearch("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    fetchAvailableNodes({
      current: page,
      pageSize,
      search: debouncedSearch || undefined,
      type: type || undefined,
    })
      .then((res) => {
        if (cancelled) return;
        const list = Array.isArray(res) ? res : res?.data || [];
        setNodes(list);
        setTotal(res?.total ?? list.length);
      })
      .catch(() => {
        if (!cancelled) {
          setNodes([]);
          setTotal(0);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, page, debouncedSearch, type]);

  const toggleNode = useCallback((id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.size === nodes.length && nodes.length > 0) {
        nodes.forEach((n) => next.delete(n.id));
      } else {
        nodes.forEach((n) => next.add(n.id));
      }
      return next;
    });
  }, [nodes]);

  const submit = async () => {
    if (!machine || selected.size === 0) return;
    setSubmitting(true);
    try {
      const ids = Array.from(selected);
      await bindMachineNodes(machine.id, ids);
      toast.success(
        t("machine.detail.bindSuccess", {
          count: ids.length,
          name: machine.name,
        }),
      );
      onOpenChange(false);
    } catch (e) {
      toast.error(t("machine.detail.bindFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            {t("machine.detail.bindExistingTitle")}
          </DialogTitle>
          <DialogDescription>
            {machine
              ? t("machine.detail.bindExistingDescription", { name: machine.name })
              : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 flex flex-col gap-3 px-6 py-4">
          {/* 搜索 + 类型筛选 + 全选 */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[200px] flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("machine.detail.bindSearchPlaceholder")}
                className="pl-8"
              />
            </div>
            <Select value={type} onValueChange={(v) => { setType(v); setPage(1); }}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder={t("machine.detail.bindTypeAll")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t("machine.detail.bindTypeAll")}</SelectItem>
                {(Array.isArray(protocolTypesData) ? protocolTypesData : []).map((p: any) => (
                  <SelectItem key={p.type} value={p.type}>
                    {p.name || p.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
              disabled={!nodes.length}
              onClick={toggleAll}
            >
              <Check className="h-3.5 w-3.5" />
              {t("machine.detail.selectAll", { count: nodes.length })}
            </Button>
          </div>

          {/* 列表 */}
          <div className="min-h-0 flex-1 overflow-y-auto rounded-lg border">
            {loading ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : !nodes.length ? (
              <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                {debouncedSearch || type
                  ? t("machine.detail.noSearchResults")
                  : t("machine.detail.noUnboundNodes")}
              </div>
            ) : (
              <div className="divide-y">
                {nodes.map((n) => {
                  const active = selected.has(n.id);
                  return (
                    <button
                      key={n.id}
                      type="button"
                      className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-muted/50"
                      onClick={() => toggleNode(n.id)}
                    >
                      <span
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/40",
                        )}
                      >
                        {active && <Check className="h-3 w-3" />}
                      </span>
                      <Badge variant="secondary" className="font-mono text-[10px] shrink-0">
                        {n.id}
                      </Badge>
                      <span className="flex-1 truncate font-mono text-sm">
                        {n.name}
                      </span>
                      <Badge variant="outline" className="font-mono text-[10px]">
                        {n.type}
                      </Badge>
                      <span className="hidden max-w-[140px] truncate font-mono text-xs text-muted-foreground sm:inline-block align-bottom">
                        {n.host}:{n.port}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 已选 + 分页 */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">
              {t("machine.detail.selectedCount", { count: selected.size })}
            </span>
            <Pagination
              page={page}
              pageSize={pageSize}
              total={total}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 border-t px-6 py-4 shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("machine.detail.cancel")}
          </Button>
          <Button onClick={submit} disabled={submitting || selected.size === 0}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("machine.detail.bindConfirm", { count: selected.size })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ─── 运行日志弹窗 ─── */
function MachineLogsDialog({
  machine,
  onOpenChange,
}: {
  machine: Machine | null;
  onOpenChange: (v: boolean) => void;
}) {
  const { t } = useTranslation();
  const [logLines, setLogLines] = useState<string[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsMeta, setLogsMeta] = useState<{
    online?: boolean;
    stale?: boolean;
    updated_at?: number | null;
    message?: string;
  }>({});
  const logBoxRef = useRef<HTMLPreElement | null>(null);

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
        requestAnimationFrame(() => {
          if (logBoxRef.current) {
            logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight;
          }
        });
      } catch {
        toast.error(t("machine.logs.fetchFailed"));
      } finally {
        setLogsLoading(false);
      }
    },
    [machine, t],
  );

  useEffect(() => {
    if (machine) {
      loadLogs(true);
    } else {
      setLogLines([]);
      setLogsMeta({});
    }
  }, [machine, loadLogs]);

  if (!machine) return null;

  return (
    <Dialog open={!!machine} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <ScrollText className="h-5 w-5" />
            {t("machine.logs.title")}
          </DialogTitle>
          <DialogDescription>
            {machine.name}
            {logsMeta.updated_at
              ? ` · ${t("machine.logs.updatedAt", {
                  time: formatDate(logsMeta.updated_at),
                })}`
              : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto space-y-3 px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              {t("machine.logs.description")}
            </p>
            <div className="flex flex-wrap items-center gap-2">
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
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
                {t("machine.logs.refresh")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs"
                disabled={!logLines.length}
                onClick={async () => {
                  try {
                    await copyToClipboard(logLines.join("\n"));
                    toast.success(t("machine.logs.copied"));
                  } catch {
                    toast.error(t("common.copy.failed"));
                  }
                }}
              >
                <Copy className="h-3.5 w-3.5" />
                {t("machine.logs.copy")}
              </Button>
            </div>
          </div>

          {logsMeta.message ? (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              {logsMeta.message}
            </p>
          ) : null}

          {logsLoading && logLines.length === 0 ? (
            <Skeleton className="h-[420px] rounded-lg" />
          ) : (
            <pre
              ref={logBoxRef}
              className="h-[min(60vh,520px)] overflow-auto rounded-lg border bg-foreground p-3 font-mono text-[11px] leading-5 text-background"
            >
              {logLines.length === 0
                ? t("machine.logs.empty")
                : logLines.join("\n")}
            </pre>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
