import { useState, useMemo, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
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

export function ServerListPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [editing, setEditing] = useState<Server | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createMachineId, setCreateMachineId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<Server | null>(null);
  const [resetting, setResetting] = useState<Server | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dragEnabled, setDragEnabled] = useState(false);
  const [pendingSortList, setPendingSortList] = useState<any[] | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Handle createWithMachineId URL param
  useEffect(() => {
    const raw = searchParams.get("createWithMachineId");
    if (raw) {
      const id = parseInt(raw, 10);
      if (!isNaN(id)) {
        setCreateMachineId(id);
        setCreateOpen(true);
        // Clean up the URL param
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          next.delete("createWithMachineId");
          return next;
        }, { replace: true });
      }
    }
  }, []);

  const { data, isLoading } = useQuery<any>({
    queryKey: ["servers", "nodes", page, pageSize, search, typeFilter],
    queryFn: () => getNodes({ current: page, pageSize, search: search || undefined, type: typeFilter === "all" ? undefined : typeFilter }),
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
      setSearch("");
      setTypeFilter("all");
      setDragEnabled(true);
    }
  }, [dragEnabled, pendingSortList, finishSort]);

  const getConfigUrl = (n: Server) => {
    const base = window.location.origin;
    return `${base}/admin/#/server/config/${n.id}`;
  };

  return (
    <>
      <PageHeader
        title={t("server.manage.title")}
        description={t("server.manage.description")}
        actions={
          <div className="flex flex-wrap items-center gap-2">
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
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("server.toolbar.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            disabled={dragEnabled}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter} disabled={dragEnabled}>
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
                  {Array.from({ length: dragEnabled ? 5 : 9 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (dragEnabled ? sortList : nodes).length === 0 ? (
              <TableRow>
                <TableCell colSpan={dragEnabled ? 5 : 10}>
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
                            {t(`server.status.${statusCode}`, String(statusCode))}
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
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
            onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
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