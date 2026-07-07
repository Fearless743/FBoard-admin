import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Trash2,
  Copy,
  RotateCcw,
  Server as ServerIcon,
  Search,
  Loader2,
  Eye,
  MoreHorizontal,
  GripVertical,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
  batchDeleteServer,
  copyServer,
  dropServer,
  getNodes,
  resetServerTraffic,
  fetchProtocolTypes,
  fetchMachines,
  type Server,
  type ProtocolType,
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
  const [batchDelete, setBatchDelete] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selected, setSelected] = useState<number[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["servers", "nodes"],
    queryFn: getNodes,
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

  const machinesMap = useMemo(() => {
    const m: Record<number, string> = {};
    (machines as any[]).forEach((x: any) => { m[x.id] = x.name; });
    return m;
  }, [machines]);

  const PROTOCOL_TYPES: ProtocolType[] = protocolTypesData;

  const nodes: Server[] = data || [];
  const filtered = useMemo(() => {
    return nodes.filter((n) => {
      if (typeFilter !== "all" && String(n.type) !== typeFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        if (
          !(
            (n.name || "").toLowerCase().includes(s) ||
            (n.host || "").toLowerCase().includes(s) ||
            String(n.id).includes(s)
          )
        ) {
          return false;
        }
      }
      return true;
    });
  }, [nodes, search, typeFilter]);

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
            {selected.length > 0 && (
              <>
                <Button variant="outline" onClick={() => setBatchDelete(true)}>
                  <Trash2 className="h-4 w-4" />
                  {t("server.toolbar.batch_delete.button", { count: selected.length })}
                </Button>
              </>
            )}
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
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={filtered.length > 0 && selected.length === filtered.length}
                  onCheckedChange={(c) => setSelected(c === true ? filtered.map((n) => n.id) : [])}
                />
              </TableHead>
              <TableHead className="w-14">{t("server.columns.nodeId")}</TableHead>
              <TableHead className="w-12 text-center">{t("server.columns.show")}</TableHead>
              <TableHead>{t("server.columns.node")}</TableHead>
              <TableHead>{t("server.columns.deployment.title")}</TableHead>
              <TableHead>{t("server.columns.address")}</TableHead>
              <TableHead className="text-right">{t("server.columns.sort")}</TableHead>
              <TableHead className="text-right">{t("server.columns.rate.title")}</TableHead>
              <TableHead>{t("server.columns.groups.title")}</TableHead>
              <TableHead className="text-right">{t("server.columns.traffic.title")}</TableHead>
              <TableHead className="w-32 text-right">{t("server.columns.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 11 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11}>
                  <EmptyState icon={<ServerIcon className="h-10 w-10" />} />
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((n) => {
                const proto = PROTOCOL_TYPES.find((p) => p.type === n.type);
                const status = STATUS_MAP[n.status ?? 0];
                const trafficLimit = n.traffic_limit || 0;
                const trafficUsed = n.traffic_used ?? 0;
                const trafficPct = trafficLimit > 0 ? ((trafficUsed / trafficLimit) * 100).toFixed(1) : null;
                return (
                  <TableRow key={n.id}>
                    <TableCell>
                      <Checkbox
                        checked={selected.includes(n.id)}
                        onCheckedChange={(c) =>
                          setSelected((s) =>
                            c === true ? [...new Set([...s, n.id])] : s.filter((x) => x !== n.id)
                          )
                        }
                      />
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {n.code || n.id}
                    </TableCell>
                    <TableCell className="text-center">
                      {n.show ? (
                        <Badge variant="success">ON</Badge>
                      ) : (
                        <Badge variant="secondary">OFF</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="font-medium">{n.name}</p>
                        <Badge variant="outline">{proto?.name || `#${n.type}`}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {n.machine_id ? machinesMap[n.machine_id] || `#${n.machine_id}` : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                          {n.host}:{n.port}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
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
                    <TableCell className="text-right text-xs tabular-nums">
                      {n.sort ?? 0}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{n.rate}×</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {(n.group_ids || []).length ? `#${(n.group_ids || []).join(", #")}` : t("server.columns.groups.empty")}
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
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem onClick={() => {
                            const url = getConfigUrl(n);
                            window.open(url, "_blank");
                          }}>
                            <Eye className="h-4 w-4" />
                            查看配置
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
                            复制
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setResetting(n)}>
                            <RotateCcw className="h-4 w-4" />
                            {t("server.columns.actions_dropdown.reset_traffic.title")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEditing(n)}>
                            {t("server.columns.actions_dropdown.edit")}
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
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
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

      <ConfirmDialog
        open={batchDelete}
        onOpenChange={setBatchDelete}
        title={t("server.toolbar.batch_delete.title", { count: selected.length })}
        description={t("server.toolbar.batch_delete.description", { count: selected.length })}
        confirmText={t("server.toolbar.batch_delete.confirm")}
        onConfirm={async () => {
          try {
            await batchDeleteServer(selected);
            toast.success(t("server.toolbar.batch_delete_success", { count: selected.length }));
            setSelected([]);
            qc.invalidateQueries({ queryKey: ["servers", "nodes"] });
            setBatchDelete(false);
          } catch (e) {}
        }}
      />
    </>
  );
}
