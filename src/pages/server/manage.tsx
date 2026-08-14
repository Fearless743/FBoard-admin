import { useState, useMemo, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useUrlState, listQuerySchema } from "@/hooks/use-url-state";
import {
  Plus,
  Trash2,
  Copy,
  RotateCcw,
  Search,
  Loader2,
  MoreHorizontal,
  GripVertical,
  Wifi,
  WifiOff,
  Pencil,
  Server as ServerIcon,
  ReplaceAll,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { IdBadge } from "@/components/common/id-badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { SortableContainer, SortableRow, DragCell } from "@/components/common/sortable-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  copyServer,
  dropServer,
  getNodes,
  getSortNodes,
  resetServerTraffic,
  fetchProtocolTypes,
  fetchMachines,
  fetchGroups,
  sortServers,
  batchReplaceServer,
  type Server,
  type ProtocolType,
  type ServerGroup,
} from "@/api/server";
import { ServerFormDialog } from "./server-form-dialog";
import { formatBytes, bytesToGb, copyToClipboard } from "@/lib/utils";

const STATUS_VARIANT: Record<
  number,
  "default" | "secondary" | "destructive" | "success"
> = {
  0: "secondary",
  1: "destructive",
  2: "success",
};
const STATUS_DOT: Record<number, string> = {
  0: "bg-muted-foreground",
  1: "bg-destructive",
  2: "bg-emerald-500",
};
/** i18n 缺失时的中文回退，避免页面直接露出 0/1/2 */
const STATUS_LABEL_FALLBACK: Record<number, string> = {
  0: "未运行",
  1: "无人使用或异常",
  2: "运行正常",
};

/** 批量替换可选字段（value 为后端白名单字段名，label 走 i18n） */
const BATCH_REPLACE_FIELDS = [
  { value: "name", label: "name" },
  { value: "host", label: "host" },
  { value: "port", label: "port" },
  { value: "code", label: "code" },
  { value: "group_ids", label: "group_ids" },
  { value: "route_ids", label: "route_ids" },
  { value: "tags", label: "tags" },
  { value: "protocol_settings", label: "protocol_settings" },
  { value: "custom_outbounds", label: "custom_outbounds" },
  { value: "custom_routes", label: "custom_routes" },
  { value: "cert_config", label: "cert_config" },
  { value: "rate_time_ranges", label: "rate_time_ranges" },
] as const;

export function ServerListPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  // 从 URL 读取 machineId（机器详情页跳转时传入，用于自动筛选该机器节点）
  const [machineId, setMachineId] = useState<number | null>(() => {
    const raw = searchParams.get("machineId");
    if (raw) {
      const id = parseInt(raw, 10);
      return isNaN(id) ? null : id;
    }
    return null;
  });
  // 从 URL 同步 machineId（支持浏览器前进/后退，以及直接修改地址栏）
  useEffect(() => {
    const raw = searchParams.get("machineId");
    if (raw) {
      const id = parseInt(raw, 10);
      setMachineId(isNaN(id) ? null : id);
    } else {
      setMachineId(null);
    }
  }, [searchParams]);
  // type/status 用 string：协议类型来自后端动态列表；默认 all 不写进 URL
  const [qs, setQs, query] = useUrlState(
    listQuerySchema({
      q: { type: "string", default: "", debounce: 400 },
      type: { type: "string", default: "all" },
      status: { type: "string", default: "all" },
    }),
  );
  const [editing, setEditing] = useState<Server | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createMachineId, setCreateMachineId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<Server | null>(null);
  const [resetting, setResetting] = useState<Server | null>(null);
  const [dragEnabled, setDragEnabled] = useState(false);
  const [pendingSortList, setPendingSortList] = useState<any[] | null>(null);
  const [replaceOpen, setReplaceOpen] = useState(false);
  const [replaceField, setReplaceField] = useState<string>("name");
  const [replaceSearch, setReplaceSearch] = useState("");
  const [replaceValue, setReplaceValue] = useState("");
  const [replaceLoading, setReplaceLoading] = useState(false);

  // Handle createWithMachineId URL param（一次性动作，不进列表 schema）
  useEffect(() => {
    const raw = searchParams.get("createWithMachineId");
    if (raw) {
      const id = parseInt(raw, 10);
      if (!isNaN(id)) {
        setCreateMachineId(id);
        setCreateOpen(true);
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          next.delete("createWithMachineId");
          return next;
        }, { replace: true });
      }
    }
    // 仅挂载时消费一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data, isLoading } = useQuery<any>({
    queryKey: [
      "servers",
      "nodes",
      query.page,
      query.pageSize,
      query.q,
      query.type,
      query.status,
      machineId,
    ],
    queryFn: () =>
      getNodes({
        current: query.page,
        pageSize: query.pageSize,
        search: query.q || undefined,
        type: query.type === "all" ? undefined : query.type,
        status: query.status === "all" ? undefined : Number(query.status),
        machine_id: machineId ?? undefined,
      }),
  });

  const { data: sortNodes } = useQuery({
    queryKey: ["servers", "sort-nodes"],
    queryFn: getSortNodes,
    enabled: dragEnabled,
  });

  const { data: protocolTypesData = [] } = useQuery({
    queryKey: ["server", "protocol-types"],
    queryFn: fetchProtocolTypes,
    staleTime: 300000,
  });

  const { data: machines } = useQuery({
    queryKey: ["machines"],
    queryFn: () => fetchMachines(1, 1000),
    staleTime: 300000,
  });

  const { data: serverGroups = [] } = useQuery({
    queryKey: ["server-groups"],
    queryFn: fetchGroups,
    staleTime: 300000,
  });

  const machinesMap = useMemo(() => {
    const m: Record<number, string> = {};
    const machineList: any[] = (machines as any)?.data || machines || [];
    (machineList).forEach((x: any) => { m[x.id] = x.name; });
    return m;
  }, [machines]);

  const machineList: any[] = (machines as any)?.data || machines || [];

  const groupsMap = useMemo(() => {
    const m: Record<number, string> = {};
    (serverGroups as ServerGroup[]).forEach((g) => { m[g.id] = g.name; });
    return m;
  }, [serverGroups]);

  const PROTOCOL_TYPES: ProtocolType[] = protocolTypesData;

  const nodes: Server[] = data?.data || [];
  const total = data?.total || 0;

  const remoteSortList: any[] = Array.isArray(sortNodes)
    ? sortNodes
    : (sortNodes as any)?.data || [];
  const sortList: any[] = pendingSortList ?? remoteSortList;

  // 拖拽只改本地顺序，不立刻请求接口
  const handleReorder = useCallback((ids: number[]) => {
    const reordered = ids
      .map((id) => sortList.find((n: any) => Number(n.id) === Number(id)))
      .filter(Boolean)
      .map((n: any, index: number) => ({ ...n, sort: index + 1 }));
    setPendingSortList(reordered);
  }, [sortList]);

  const finishSort = useCallback(async () => {
    if (!pendingSortList) {
      setDragEnabled(false);
      return;
    }
    try {
      await sortServers(pendingSortList.map((n: any) => Number(n.id)));
      toast.success(t("server.toolbar.sort.success"));
      setPendingSortList(null);
      setDragEnabled(false);
      await qc.invalidateQueries({ queryKey: ["servers"] });
    } catch (e) {
      // toast 已在请求层处理
    }
  }, [pendingSortList, qc, t]);

  const toggleDrag = useCallback(() => {
    if (dragEnabled) {
      // 退出排序模式：有本地变更才保存
      if (pendingSortList) {
        void finishSort();
      } else {
        setDragEnabled(false);
      }
    } else {
      setPendingSortList(null);
      setQs({ q: "", type: "all", status: "all", page: 1 });
      setDragEnabled(true);
    }
  }, [dragEnabled, pendingSortList, finishSort, setQs]);

  const getConfigUrl = (n: Server) => {
    const base = window.location.origin;
    return `${base}/admin/#/server/config/${n.id}`;
  };

  const handleReplace = async () => {
    if (!replaceSearch) {
      toast.error(t("server.toolbar.batch_replace.search_required"));
      return;
    }
    setReplaceLoading(true);
    try {
      const res = await batchReplaceServer({
        field: replaceField,
        search: replaceSearch,
        replace: replaceValue,
      });
      toast.success(
        t("server.toolbar.batch_replace.success", {
          count: (res as any)?.data?.changed ?? (res as any)?.changed ?? 0,
        }),
      );
      setReplaceOpen(false);
      await qc.invalidateQueries({ queryKey: ["servers", "nodes"] });
    } catch (e) {
      // toast 已在请求层处理
    } finally {
      setReplaceLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title={t("server.manage.title")}
        description={t("server.manage.description")}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setReplaceOpen(true)}
            >
              <ReplaceAll className="h-4 w-4" />
              {t("server.toolbar.batch_replace.menu")}
            </Button>
            <Button
              variant={dragEnabled ? "default" : "outline"}
              onClick={toggleDrag}
            >
              <GripVertical className="h-4 w-4" />
              {dragEnabled ? t("server.toolbar.sort.save") : t("server.toolbar.sort.edit")}
            </Button>
            <Button onClick={() => setCreateOpen(true)} disabled={dragEnabled}>
              <Plus className="h-4 w-4" />
              {t("server.form.add_node")}
            </Button>
          </div>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {machineId != null && (
          <div className="mb-2 flex w-full items-center gap-2 rounded-md border bg-muted/40 px-3 py-2 text-sm">
            <span className="text-muted-foreground">
              {t("server.toolbar.filteringByMachine")}
            </span>
            <span className="font-medium">
              {machinesMap[machineId] || `#${machineId}`}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto h-7 gap-1 text-xs"
              onClick={() => {
                setMachineId(null);
                setSearchParams((prev) => {
                  const next = new URLSearchParams(prev);
                  next.delete("machineId");
                  return next;
                }, { replace: true });
              }}
            >
              {t("common.clear")}
            </Button>
          </div>
        )}
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("server.toolbar.search")}
            value={qs.q}
            onChange={(e) => setQs({ q: e.target.value })}
            className="pl-9"
            disabled={dragEnabled}
          />
        </div>
        <Select
          value={qs.type}
          onValueChange={(v) => setQs({ type: v })}
          disabled={dragEnabled}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder={t("server.toolbar.type")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("common.all")}</SelectItem>
            {PROTOCOL_TYPES.map((p) => (
              <SelectItem key={p.type} value={p.type}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={qs.status}
          onValueChange={(v) => setQs({ status: v })}
          disabled={dragEnabled}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("server.toolbar.status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("common.all")}</SelectItem>
            {([0, 1, 2] as const).map((code) => (
              <SelectItem key={code} value={String(code)}>
                {t(`server.columns.status.${code}`, {
                  defaultValue: STATUS_LABEL_FALLBACK[code],
                })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {dragEnabled ? (
                <>
                  <TableHead className="w-10" />
                  <TableHead className="w-16">{t("server.columns.nodeId")}</TableHead>
                  <TableHead>{t("server.columns.node")}</TableHead>
                </>
              ) : (
                <>
                  <TableHead className="w-14">{t("server.columns.nodeId")}</TableHead>
                  <TableHead className="w-16 text-center">{t("server.columns.show")}</TableHead>
                  <TableHead>{t("server.columns.node")}</TableHead>
                  <TableHead>{t("server.columns.deployment.title")}</TableHead>
                  <TableHead className="w-[200px]">{t("server.columns.address")}</TableHead>
                  <TableHead className="text-right">{t("server.columns.rate.title")}</TableHead>
                  <TableHead>{t("server.columns.groups.title")}</TableHead>
                  <TableHead className="text-right">{t("server.columns.traffic.title")}</TableHead>
                  <TableHead className="w-20 text-center">{t("server.columns.onlineUsers.title")}</TableHead>
                  <TableHead className="w-32 text-right">{t("server.columns.actions")}</TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: dragEnabled ? 3 : 10 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (dragEnabled ? sortList : nodes).length === 0 ? (
              <TableRow>
                <TableCell colSpan={dragEnabled ? 3 : 10}>
                  <EmptyState icon={<ServerIcon className="h-10 w-10" />} />
                </TableCell>
              </TableRow>
            ) : dragEnabled ? (
              <SortableContainer items={sortList} onReorder={handleReorder} enabled={dragEnabled}>
                {sortList.map((n) => {
                  let proto = PROTOCOL_TYPES.find((p) => p.type === n.type);
                  const isVirtual = n.type === "virtual";
                  const rowId = Number(n.id);
                  return (
                    <SortableRow key={rowId} id={rowId}>
                      <DragCell />
                      <TableCell><IdBadge id={String(rowId) + (n.parent_id ? "->" + n.parent_id : "")} /></TableCell>
                      <TableCell className="font-medium">
                        <div className="space-y-0.5">
                          <p className="font-medium">{n.name}</p>
                          <Badge variant={isVirtual ? "secondary" : "outline"}>
                            {isVirtual
                              ? t("server.form.virtualNode.label")
                              : proto?.name || `#${n.type}`}
                          </Badge>
                        </div>
                      </TableCell>
                    </SortableRow>
                  );
                })}
              </SortableContainer>
            ) : (
              <SortableContainer items={nodes} onReorder={handleReorder} enabled={false}>
                {nodes.map((n: any) => {
                const proto = PROTOCOL_TYPES.find((p) => p.type === n.type);
                const statusCode = Number(n.status ?? 0);
                const statusVariant = STATUS_VARIANT[statusCode] ?? "secondary";
                const trafficLimit = (n as any).transfer_enable || 0;
                const trafficUsed = ((n as any).u || 0) + ((n as any).d || 0);
                const trafficPctNum =
                  trafficLimit > 0
                    ? Math.min(100, (trafficUsed / trafficLimit) * 100)
                    : 0;
                const trafficPct =
                  trafficLimit > 0 ? trafficPctNum.toFixed(1) : null;
                return (
                  <SortableRow key={n.code || n.id} id={n.code || n.id}>
                    <TableCell><IdBadge id={(n.code || n.id) + (n.parent_id ? "->" + n.parent_id : "")} compact /></TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={!!n.show}
                        onCheckedChange={async (v) => {
                          try {
                            const { updateServer } = await import("@/api/server");
                            await updateServer({ id: n.id, show: v ? 1 : 0 });
                            qc.invalidateQueries({ queryKey: ["servers", "nodes"] });
                          } catch (e) {}
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="min-w-0 space-y-1">
                        <p className="truncate font-medium" title={n.name}>{n.name}</p>
                        <div className="flex flex-wrap items-center gap-1">
                          <Badge variant="outline" className="h-5 font-normal">
                            {proto?.name || `#${n.type}`}
                          </Badge>
                          <Badge
                            variant={statusVariant}
                            className="h-5 gap-1 font-normal"
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[statusCode] ?? "bg-muted-foreground"}`}
                            />
                            {t(`server.columns.status.${statusCode}`, {
                              defaultValue:
                                STATUS_LABEL_FALLBACK[statusCode] ??
                                String(statusCode),
                            })}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      {n.machine_id ? (
                        <div className="flex items-center gap-1.5">
                          <span>{machinesMap[n.machine_id] || `#${n.machine_id}`}</span>
                          {(() => {
                            const machine = machineList.find((m: any) => m.id === n.machine_id);
                            const online = machine?.is_online ?? machine?.is_active;
                            return online ? (
                              <Badge variant="success" className="gap-1 text-[10px] px-1.5 py-0">
                                <Wifi className="h-3 w-3" /> {t("server.columns.deployment.online")}
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="gap-1 text-[10px] px-1.5 py-0">
                                <WifiOff className="h-3 w-3" /> {t("server.columns.deployment.offline")}
                              </Badge>
                            );
                          })()}
                        </div>
                      ) : (
                        <Badge variant="secondary">{t("server.columns.deployment.standalone")}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <div className="flex items-center gap-1">
                        <code className="truncate rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                          {n.host}:{n.port}
                        </code>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-5 w-5 shrink-0"
                          onClick={async () => {
                            try {
                              await copyToClipboard(`${n.host}:${n.port}`);
                              toast.success(t("server.columns.actions_dropdown.copy_success"));
                            } catch { toast.error(t("common.copy.failed")); }
                          }}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{n.rate}×</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {(n.group_ids || []).length ? (n.group_ids || []).map((id: number) => (
                        <Badge key={id} variant="outline" className="mr-1 text-[10px]">
                          {groupsMap[id] || `#${id}`}
                        </Badge>
                      )) : t("server.columns.groups.empty")}
                    </TableCell>
                    <TableCell className="text-right text-xs">
                      <div className="flex flex-col items-end gap-1">
                        <span className="tabular-nums text-muted-foreground">
                          {trafficLimit > 0
                            ? `${formatBytes(trafficUsed)} / ${formatBytes(trafficLimit)}`
                            : `${formatBytes(trafficUsed)} / ∞`}
                        </span>
                        {trafficLimit > 0 && (
                          <div className="flex w-24 items-center gap-1.5">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                              <div
                                className={`h-full rounded-full ${
                                  trafficPctNum >= 90
                                    ? "bg-destructive"
                                    : trafficPctNum >= 70
                                      ? "bg-amber-500"
                                      : "bg-primary"
                                }`}
                                style={{ width: `${Math.max(trafficPctNum, trafficPctNum > 0 ? 2 : 0)}%` }}
                              />
                            </div>
                            <span className="w-8 text-right text-[10px] tabular-nums text-muted-foreground">
                              {trafficPct}%
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center tabular-nums text-xs">
                      {n.online != null ? (
                        <Badge variant={n.online > 0 ? "success" : "secondary"} className="text-[10px] px-1.5">
                          {n.online}
                        </Badge>
                      ) : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem onClick={() => setEditing(n)}>
                            <Pencil className="h-4 w-4" />
                            {t("server.columns.actions_dropdown.edit")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={async () => {
                              try {
                                await copyServer(n.id);
                                toast.success(t("server.columns.actions_dropdown.copy_success"));
                                qc.invalidateQueries({ queryKey: ["servers", "nodes"] });
                              } catch (e) {}
                            }}
                          >
                            <Copy className="h-4 w-4" />
                            {t("server.columns.actions_dropdown.copy")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setResetting(n)}>
                            <RotateCcw className="h-4 w-4" />
                            {t("server.columns.actions_dropdown.reset_traffic.title")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeleting(n)}
                          >
                            <Trash2 className="h-4 w-4" />
                            {t("server.columns.actions_dropdown.delete.confirm")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </SortableRow>
                );
              })}
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

      <ServerFormDialog
        open={createOpen || !!editing}
        server={editing}
        initialMachineId={createMachineId}
        onOpenChange={(v) => {
          if (!v) {
            setEditing(null);
            setCreateOpen(false);
            setCreateMachineId(null);
          }
        }}
        onSaved={() => qc.invalidateQueries({ queryKey: ["servers", "nodes"] })}
      />

      <Dialog open={replaceOpen} onOpenChange={(v) => !v && setReplaceOpen(false)}>
        <DialogContent className="max-w-md max-h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
            <DialogTitle>{t("server.toolbar.batch_replace.title")}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            <div className="space-y-2">
              <Label>{t("server.toolbar.batch_replace.field")}</Label>
              <Select value={replaceField} onValueChange={setReplaceField}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BATCH_REPLACE_FIELDS.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {t(`server.toolbar.batch_replace.fields.${f.label}`, {
                        defaultValue: f.label,
                      })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("server.toolbar.batch_replace.search")}</Label>
              <Input
                value={replaceSearch}
                onChange={(e) => setReplaceSearch(e.target.value)}
                placeholder={t("server.toolbar.batch_replace.search_placeholder")}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("server.toolbar.batch_replace.replace")}</Label>
              <Input
                value={replaceValue}
                onChange={(e) => setReplaceValue(e.target.value)}
                placeholder={t("server.toolbar.batch_replace.replace_placeholder")}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 border-t px-6 py-4 shrink-0">
            <Button
              variant="outline"
              onClick={() => setReplaceOpen(false)}
              disabled={replaceLoading}
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleReplace}
              disabled={replaceLoading}
            >
              {replaceLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {t("server.toolbar.batch_replace.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title={t("server.columns.actions_dropdown.delete.title")}
        description={t("server.columns.actions_dropdown.delete.description")}
        confirmText={t("server.columns.actions_dropdown.delete.confirm")}
        onConfirm={async () => {
          if (!deleting) return;
          try {
            await dropServer(deleting.id);
            toast.success(t("server.columns.actions_dropdown.delete_success"));
            qc.invalidateQueries({ queryKey: ["servers", "nodes"] });
            setDeleting(null);
          } catch (e) {}
        }}
      />

      <ConfirmDialog
        open={!!resetting}
        onOpenChange={(v) => !v && setResetting(null)}
        title={t("server.columns.actions_dropdown.reset_traffic.title")}
        description={t("server.columns.actions_dropdown.reset_traffic.description")}
        confirmText={t("server.columns.actions_dropdown.reset_traffic.confirm")}
        onConfirm={async () => {
          if (!resetting) return;
          try {
            await resetServerTraffic(resetting.id);
            toast.success(t("server.columns.actions_dropdown.reset_traffic_success"));
            qc.invalidateQueries({ queryKey: ["servers", "nodes"] });
            setResetting(null);
          } catch (e) {}
        }}
      />



    </>
  );
}