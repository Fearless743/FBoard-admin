import { useState, useMemo, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { formatBytes, bytesToGb } from "@/lib/utils";

const STATUS_MAP: Record<number, { label: string; variant: "default" | "secondary" | "destructive" | "success" }> = {
  0: { label: "未运行", variant: "secondary" },
  1: { label: "无人使用/异常", variant: "destructive" },
  2: { label: "运行正常", variant: "success" },
};

export function ServerListPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Server | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleting, setDeleting] = useState<Server | null>(null);
  const [resetting, setResetting] = useState<Server | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dragEnabled, setDragEnabled] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [showVirtual, setShowVirtual] = useState(false);

  const { data, isLoading } = useQuery<any>({
    queryKey: ["servers", "nodes", page, pageSize, search, typeFilter, showVirtual],
    queryFn: () => getNodes({ current: page, pageSize, search: search || undefined, type: typeFilter === "all" ? undefined : typeFilter, show_virtual: showVirtual || undefined }),
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

  const { data: machines = [] } = useQuery({
    queryKey: ["machines"],
    queryFn: fetchMachines,
    staleTime: 300000,
  });

  const { data: serverGroups = [] } = useQuery({
    queryKey: ["server-groups"],
    queryFn: fetchGroups,
    staleTime: 300000,
  });

  const machinesMap = useMemo(() => {
    const m: Record<number, string> = {};
    (machines as any[]).forEach((x: any) => { m[x.id] = x.name; });
    return m;
  }, [machines]);

  const groupsMap = useMemo(() => {
    const m: Record<number, string> = {};
    (serverGroups as ServerGroup[]).forEach((g) => { m[g.id] = g.name; });
    return m;
  }, [serverGroups]);

  const PROTOCOL_TYPES: ProtocolType[] = protocolTypesData;

  const nodes: Server[] = data?.data || [];
  const total = data?.total || 0;

  const handleReorder = useCallback(async (ids: number[]) => {
    try {
      await sortServers(ids);
      qc.invalidateQueries({ queryKey: ["servers"] });
    } catch (e) {}
  }, [qc]);

  const sortList: any[] = sortNodes || [];

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
              onClick={() => setDragEnabled(!dragEnabled)}
            >
              <GripVertical className="h-4 w-4" />
              {dragEnabled ? "完成排序" : "编辑排序"}
            </Button>
            <Button onClick={() => setCreateOpen(true)}>
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
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
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
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Switch checked={showVirtual} onCheckedChange={setShowVirtual} className="scale-75" />
          <span>虚拟节点</span>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {dragEnabled ? (
                <>
                  <TableHead className="w-10" />
                  <TableHead className="w-16">ID</TableHead>
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
                  <TableHead className="w-20 text-center">在线</TableHead>
                  <TableHead className="w-32 text-right">{t("server.columns.actions")}</TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: dragEnabled ? 5 : 10 }).map((_, j) => (
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
                  const proto = PROTOCOL_TYPES.find((p) => p.type === n.type);
                  return (
                    <SortableRow key={n.id} id={n.id}>
                      <DragCell />
                      <TableCell className="font-mono text-xs"><Badge variant="outline">{n.id}</Badge></TableCell>
                      <TableCell className="font-medium"><div className="space-y-0.5">
                        <p className="font-medium">{n.name}</p>
                        <Badge variant="outline">{proto?.name || `#${n.type}`}</Badge>
                      </div></TableCell>
                    </SortableRow>
                  );
                })}
              </SortableContainer>
            ) : (
              <SortableContainer items={nodes} onReorder={handleReorder} enabled={false}>
                {nodes.map((n: any) => {
                const proto = PROTOCOL_TYPES.find((p) => p.type === n.type);
                const status = STATUS_MAP[n.status ?? 0];
                const trafficLimit = (n as any).transfer_enable || 0;
                const trafficUsed = ((n as any).u || 0) + ((n as any).d || 0);
                const trafficPct = trafficLimit > 0 ? ((trafficUsed / trafficLimit) * 100).toFixed(1) : null;
                return (
                  <SortableRow key={n.id} id={n.id}>
                    <TableCell className="font-mono text-xs">
                      <Badge variant="outline">{n.code || n.id}</Badge>
                    </TableCell>
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
                      <div className="space-y-0.5">
                        <p className="font-medium">{n.name}</p>
                        <Badge variant="outline">{proto?.name || `#${n.type}`}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      {n.machine_id ? (
                        <div className="flex items-center gap-1.5">
                          <span>{machinesMap[n.machine_id] || `#${n.machine_id}`}</span>
                          {(() => {
                            const machine = (machines as any[]).find((m: any) => m.id === n.machine_id);
                            return machine?.is_active ? (
                              <Badge variant="success" className="gap-1 text-[10px] px-1.5 py-0">
                                <Wifi className="h-3 w-3" /> 在线
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="gap-1 text-[10px] px-1.5 py-0">
                                <WifiOff className="h-3 w-3" /> 离线
                              </Badge>
                            );
                          })()}
                        </div>
                      ) : (
                        <Badge variant="secondary">独立部署</Badge>
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
                              await navigator.clipboard.writeText(`${n.host}:${n.port}`);
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
                    <TableCell className="text-right text-xs text-muted-foreground">
                      <div className="flex flex-col items-end gap-0.5">
                        {trafficLimit > 0 ? (
                          <>
                            <span className="tabular-nums">{formatBytes(trafficUsed)} / {formatBytes(trafficLimit)}</span>
                            {trafficPct && (
                              <span className="text-[10px]">{trafficPct}%</span>
                            )}
                          </>
                        ) : (
                          <span>{formatBytes(trafficUsed)} / ∞</span>
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
                            复制
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
        onOpenChange={(v) => {
          if (!v) {
            setEditing(null);
            setCreateOpen(false);
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