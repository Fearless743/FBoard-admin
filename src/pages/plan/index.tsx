import { useState, useMemo, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Search, Users, UserCheck, GripVertical, Package } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { IdBadge } from "@/components/common/id-badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
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
import { dropPlan, fetchPlans, sortPlans, updatePlan, type Plan } from "@/api/plan";
import { PlanFormDialog } from "./plan-form-dialog";

const SORT_PAGE_SIZE = 1000;

export function PlanListPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Plan | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleting, setDeleting] = useState<Plan | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [toggleLoading, setToggleLoading] = useState<Record<string, boolean>>({});
  const [dragEnabled, setDragEnabled] = useState(false);
  const [pendingList, setPendingList] = useState<Plan[] | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const effectivePageSize = dragEnabled ? SORT_PAGE_SIZE : pageSize;
  const effectivePage = dragEnabled ? 1 : page;

  const { data, isLoading } = useQuery({
    queryKey: ["plans", { page: effectivePage, pageSize: effectivePageSize, debouncedSearch, dragEnabled }],
    queryFn: () => fetchPlans(effectivePage, effectivePageSize, debouncedSearch),
  });

  const plans = useMemo(() => {
    return (data?.data || []).slice().sort((a: Plan, b: Plan) => (a.sort || 0) - (b.sort || 0));
  }, [data]);
  const total = data?.total || 0;
  const displayList = pendingList ?? plans;

  // 拖拽只改本地顺序，点「完成排序」再提交
  const handleReorder = useCallback((ids: number[]) => {
    const reordered = ids
      .map((id) => displayList.find((i) => Number(i.id) === Number(id)))
      .filter(Boolean) as Plan[];
    setPendingList(reordered);
  }, [displayList]);

  const finishSort = useCallback(async () => {
    if (!pendingList) {
      setDragEnabled(false);
      return;
    }
    try {
      await sortPlans(pendingList.map((i) => Number(i.id)));
      toast.success(t("common.http.success"));
      setPendingList(null);
      setDragEnabled(false);
      await qc.invalidateQueries({ queryKey: ["plans"] });
    } catch (e) {}
  }, [pendingList, qc, t]);

  const toggleDrag = useCallback(() => {
    if (dragEnabled) {
      if (pendingList) {
        void finishSort();
      } else {
        setDragEnabled(false);
      }
    } else {
      setPendingList(null);
      setSearch("");
      setDebouncedSearch("");
      setDragEnabled(true);
    }
  }, [dragEnabled, pendingList, finishSort]);

  return (
    <>
      <PageHeader
        title={t("subscribe.plan.title")}
        description={t("subscribe.plan.page.description")}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant={dragEnabled ? "default" : "outline"}
              onClick={toggleDrag}
            >
              <GripVertical className="h-4 w-4" />
              {dragEnabled ? t("common.sort.done") : t("common.sort.edit")}
            </Button>
            <Button onClick={() => setCreateOpen(true)} disabled={dragEnabled}>
              <Plus className="h-4 w-4" />
              {t("subscribe.plan.add")}
            </Button>
          </div>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("subscribe.plan.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            disabled={dragEnabled}
          />
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {dragEnabled && <TableHead className="w-10"></TableHead>}
              <TableHead className="w-14">{t("subscribe.plan.columns.id")}</TableHead>
              <TableHead className="w-16 text-center">{t("subscribe.plan.columns.show")}</TableHead>
              <TableHead className="w-16 text-center">{t("subscribe.plan.columns.sell")}</TableHead>
              <TableHead className="w-16 text-center">{t("subscribe.plan.columns.renew")}</TableHead>
              <TableHead>{t("subscribe.plan.columns.name")}</TableHead>
              <TableHead className="text-center w-16">{t("subscribe.plan.columns.stats")}</TableHead>
              <TableHead className="text-right">{t("subscribe.plan.columns.price")}</TableHead>
              <TableHead className="text-right">{t("subscribe.plan.form.transfer.label")}</TableHead>
              <TableHead className="w-20 text-right">{t("subscribe.plan.columns.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: dragEnabled ? 11 : 10 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : displayList.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={dragEnabled ? 11 : 10}>
                  <EmptyState
                    icon={<Package className="h-10 w-10" />}
                    message={t("common.table.noData")}
                  />
                </TableCell>
              </TableRow>
            ) : (
              <SortableContainer items={displayList} onReorder={handleReorder} enabled={dragEnabled}>
                {displayList.map((p) => (
                  <SortableRow key={p.id} id={p.id}>
                    <DragCell />
                    <TableCell><IdBadge id={p.id} /></TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={!!p.show}
                        disabled={toggleLoading[`${p.id}-show`]}
                        onCheckedChange={async (v) => {
                          const key = `${p.id}-show`;
                          setToggleLoading((m) => ({ ...m, [key]: true }));
                          try {
                            await updatePlan({ id: p.id, show: v ? 1 : 0 });
                            qc.invalidateQueries({ queryKey: ["plans"] });
                          } catch {} finally {
                            setToggleLoading((m) => ({ ...m, [key]: false }));
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={!!p.sell}
                        disabled={toggleLoading[`${p.id}-sell`]}
                        onCheckedChange={async (v) => {
                          const key = `${p.id}-sell`;
                          setToggleLoading((m) => ({ ...m, [key]: true }));
                          try {
                            await updatePlan({ id: p.id, sell: v ? 1 : 0 });
                            qc.invalidateQueries({ queryKey: ["plans"] });
                          } catch {} finally {
                            setToggleLoading((m) => ({ ...m, [key]: false }));
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={!!p.renew}
                        disabled={toggleLoading[`${p.id}-renew`]}
                        onCheckedChange={async (v) => {
                          const key = `${p.id}-renew`;
                          setToggleLoading((m) => ({ ...m, [key]: true }));
                          try {
                            await updatePlan({ id: p.id, renew: v ? 1 : 0 });
                            qc.invalidateQueries({ queryKey: ["plans"] });
                          } catch {} finally {
                            setToggleLoading((m) => ({ ...m, [key]: false }));
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="min-w-0 space-y-0.5">
                        <p className="truncate font-medium" title={p.name}>{p.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {p.group?.name || (p.group_id ? `#${p.group_id}` : "—")}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Badge variant="secondary" className="h-5 gap-1 select-none font-normal" title={t("subscribe.plan.columns.users")}>
                          <Users className="h-3 w-3" />
                          {p.users_count ?? 0}
                        </Badge>
                        <Badge variant="outline" className="h-5 gap-1 select-none font-normal text-primary" title={t("subscribe.plan.columns.active_users")}>
                          <UserCheck className="h-3 w-3" />
                          {p.active_users_count ?? 0}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end gap-0.5 text-xs">
                        {p.prices?.monthly ? (
                          <span>
                            {t("subscribe.plan.form.price.period.monthly")}:{" "}
                            <b className="tabular-nums">¥{Number(p.prices.monthly).toFixed(2)}</b>
                          </span>
                        ) : null}
                        {p.prices?.quarterly ? (
                          <span className="text-muted-foreground">
                            {t("subscribe.plan.form.price.period.months", { count: 3 })}:{" "}
                            ¥{Number(p.prices.quarterly).toFixed(2)}
                          </span>
                        ) : null}
                        {p.prices?.half_yearly ? (
                          <span className="text-muted-foreground">
                            {t("subscribe.plan.form.price.period.months", { count: 6 })}:{" "}
                            ¥{Number(p.prices.half_yearly).toFixed(2)}
                          </span>
                        ) : null}
                        {p.prices?.yearly ? (
                          <span className="text-muted-foreground">
                            {t("subscribe.plan.form.price.period.months", { count: 12 })}:{" "}
                            ¥{Number(p.prices.yearly).toFixed(2)}
                          </span>
                        ) : null}
                        {!p.prices?.monthly && !p.prices?.quarterly && !p.prices?.half_yearly && !p.prices?.yearly ? (
                          <span className="text-muted-foreground">—</span>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-sm font-medium">
                      {p.transfer_enable ? `${p.transfer_enable} GB` : "∞"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => setEditing(p)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleting(p)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </SortableRow>
                ))}
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

      <PlanFormDialog
        open={createOpen || !!editing}
        plan={editing}
        onOpenChange={(v) => {
          if (!v) {
            setEditing(null);
            setCreateOpen(false);
          }
        }}
        onSaved={() => qc.invalidateQueries({ queryKey: ["plans"] })}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title={t("subscribe.plan.columns.delete_confirm.title")}
        description={t("subscribe.plan.columns.delete_confirm.description")}
        onConfirm={async () => {
          if (!deleting) return;
          try {
            await dropPlan(deleting.id);
            toast.success(t("subscribe.plan.columns.delete_confirm.success"));
            qc.invalidateQueries({ queryKey: ["plans"] });
            setDeleting(null);
          } catch (e) {}
        }}
      />
    </>
  );
}
