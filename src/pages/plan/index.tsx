import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUrlState, listQuerySchema } from "@/hooks/use-url-state";
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
import { cn } from "@/lib/utils";

const SORT_PAGE_SIZE = 1000;
// drag? + id + show + sell + renew + name + stats + price + transfer + actions
const COL_COUNT = 9;

function primaryPrice(
  plan: Plan,
): { label: (t: (key: string, opts?: Record<string, unknown>) => string) => string; value: number } | null {
  const prices = plan.prices;
  if (!prices) return null;
  if (prices.hourly != null) {
    return {
      label: (t) => t("subscribe.plan.columns.price_period.hourly"),
      value: Number(prices.hourly),
    };
  }
  if (prices.daily != null) {
    return {
      label: (t) => t("subscribe.plan.columns.price_period.daily"),
      value: Number(prices.daily),
    };
  }
  if (prices.monthly != null) {
    return {
      label: (t) => t("subscribe.plan.form.price.period.monthly"),
      value: Number(prices.monthly),
    };
  }
  if (prices.quarterly != null) {
    return {
      label: (t) => t("subscribe.plan.form.price.period.months", { count: 3 }),
      value: Number(prices.quarterly),
    };
  }
  if (prices.half_yearly != null) {
    return {
      label: (t) => t("subscribe.plan.form.price.period.months", { count: 6 }),
      value: Number(prices.half_yearly),
    };
  }
  if (prices.yearly != null) {
    return {
      label: (t) => t("subscribe.plan.form.price.period.months", { count: 12 }),
      value: Number(prices.yearly),
    };
  }
  return null;
}

export function PlanListPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Plan | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleting, setDeleting] = useState<Plan | null>(null);
  const [qs, setQs, query] = useUrlState(
    listQuerySchema({
      q: { type: "string", default: "", debounce: 400 },
    }),
  );
  const [toggleLoading, setToggleLoading] = useState<Record<string, boolean>>({});
  const [dragEnabled, setDragEnabled] = useState(false);
  const [pendingList, setPendingList] = useState<Plan[] | null>(null);

  const effectivePageSize = dragEnabled ? SORT_PAGE_SIZE : query.pageSize;
  const effectivePage = dragEnabled ? 1 : query.page;

  const { data, isLoading } = useQuery({
    queryKey: ["plans", { page: effectivePage, pageSize: effectivePageSize, q: query.q, dragEnabled }],
    queryFn: () => fetchPlans(effectivePage, effectivePageSize, query.q),
  });

  const plans = useMemo(() => {
    return (data?.data || []).slice().sort((a: Plan, b: Plan) => (a.sort || 0) - (b.sort || 0));
  }, [data]);
  const total = data?.total || 0;
  const displayList = pendingList ?? plans;
  const colCount = dragEnabled ? COL_COUNT + 1 : COL_COUNT;

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
      setQs({ q: "", page: 1 });
      setDragEnabled(true);
    }
  }, [dragEnabled, pendingList, finishSort, setQs]);

  const setFlag = async (
    plan: Plan,
    field: "show" | "sell" | "renew",
    value: boolean,
  ) => {
    const key = `${plan.id}-${field}`;
    setToggleLoading((m) => ({ ...m, [key]: true }));
    try {
      await updatePlan({ id: plan.id, [field]: value ? 1 : 0 });
      qc.invalidateQueries({ queryKey: ["plans"] });
    } catch {
    } finally {
      setToggleLoading((m) => ({ ...m, [key]: false }));
    }
  };

  const priceCell = (p: Plan, compact = false) => {
    const prices = p.prices;
    if (compact) {
      const primary = primaryPrice(p);
      if (!primary) {
        return <span className="text-muted-foreground">—</span>;
      }
      return (
        <span className="tabular-nums">
          <span className="text-muted-foreground">{primary.label(t)}: </span>
          <b>¥{primary.value.toFixed(2)}</b>
        </span>
      );
    }

    return (
      <div className="flex flex-col items-end gap-0.5 text-xs">
        {/* 0 为合法免费价，不能用 truthy 判断；优先展示更短周期 */}
        {prices?.hourly != null ? (
          <span>
            {t("subscribe.plan.columns.price_period.hourly")}:{" "}
            <b className="tabular-nums">¥{Number(prices.hourly).toFixed(2)}</b>
          </span>
        ) : null}
        {prices?.daily != null ? (
          <span className={prices?.hourly != null ? "text-muted-foreground" : undefined}>
            {t("subscribe.plan.columns.price_period.daily")}:{" "}
            {prices?.hourly == null ? (
              <b className="tabular-nums">¥{Number(prices.daily).toFixed(2)}</b>
            ) : (
              <>¥{Number(prices.daily).toFixed(2)}</>
            )}
          </span>
        ) : null}
        {prices?.monthly != null ? (
          <span
            className={
              prices?.hourly != null || prices?.daily != null
                ? "text-muted-foreground"
                : undefined
            }
          >
            {t("subscribe.plan.form.price.period.monthly")}:{" "}
            {prices?.hourly == null && prices?.daily == null ? (
              <b className="tabular-nums">¥{Number(prices.monthly).toFixed(2)}</b>
            ) : (
              <>¥{Number(prices.monthly).toFixed(2)}</>
            )}
          </span>
        ) : null}
        {prices?.quarterly != null ? (
          <span className="text-muted-foreground">
            {t("subscribe.plan.form.price.period.months", { count: 3 })}: ¥
            {Number(prices.quarterly).toFixed(2)}
          </span>
        ) : null}
        {prices?.half_yearly != null ? (
          <span className="text-muted-foreground">
            {t("subscribe.plan.form.price.period.months", { count: 6 })}: ¥
            {Number(prices.half_yearly).toFixed(2)}
          </span>
        ) : null}
        {prices?.yearly != null ? (
          <span className="text-muted-foreground">
            {t("subscribe.plan.form.price.period.months", { count: 12 })}: ¥
            {Number(prices.yearly).toFixed(2)}
          </span>
        ) : null}
        {prices?.hourly == null &&
        prices?.daily == null &&
        prices?.monthly == null &&
        prices?.quarterly == null &&
        prices?.half_yearly == null &&
        prices?.yearly == null ? (
          <span className="text-muted-foreground">—</span>
        ) : null}
      </div>
    );
  };

  const flagSwitch = (
    plan: Plan,
    field: "show" | "sell" | "renew",
    label: string,
    compact = false,
  ) => {
    const key = `${plan.id}-${field}`;
    return (
      <div
        className={cn(
          "flex items-center gap-1.5",
          compact ? "justify-start" : "justify-center",
        )}
      >
        {compact && (
          <span className="text-[11px] text-muted-foreground whitespace-nowrap">
            {label}
          </span>
        )}
        <Switch
          checked={!!plan[field]}
          disabled={toggleLoading[key]}
          onCheckedChange={(v) => void setFlag(plan, field, v)}
          aria-label={label}
        />
      </div>
    );
  };

  return (
    <>
      <PageHeader
        title={t("subscribe.plan.title")}
        description={t("subscribe.plan.page.description")}
        actions={
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
            <Button
              variant={dragEnabled ? "default" : "outline"}
              onClick={toggleDrag}
              className="flex-1 sm:flex-none"
            >
              <GripVertical className="h-4 w-4" />
              {dragEnabled ? t("common.sort.done") : t("common.sort.edit")}
            </Button>
            <Button
              onClick={() => setCreateOpen(true)}
              disabled={dragEnabled}
              className="flex-1 sm:flex-none"
            >
              <Plus className="h-4 w-4" />
              {t("subscribe.plan.add")}
            </Button>
          </div>
        }
      />

      <div className="mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("subscribe.plan.search")}
            value={qs.q}
            onChange={(e) => setQs({ q: e.target.value })}
            className="pl-9"
            disabled={dragEnabled}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {dragEnabled && <TableHead className="w-10"></TableHead>}
              <TableHead className="hidden w-14 md:table-cell">
                {t("subscribe.plan.columns.id")}
              </TableHead>
              <TableHead className="hidden w-16 text-center md:table-cell">
                {t("subscribe.plan.columns.show")}
              </TableHead>
              <TableHead className="hidden w-16 text-center md:table-cell">
                {t("subscribe.plan.columns.sell")}
              </TableHead>
              <TableHead className="hidden w-16 text-center md:table-cell">
                {t("subscribe.plan.columns.renew")}
              </TableHead>
              <TableHead className="min-w-0">
                {t("subscribe.plan.columns.name")}
              </TableHead>
              <TableHead className="hidden w-16 text-center lg:table-cell">
                {t("subscribe.plan.columns.stats")}
              </TableHead>
              <TableHead className="hidden text-right sm:table-cell">
                {t("subscribe.plan.columns.price")}
              </TableHead>
              <TableHead className="hidden text-right md:table-cell">
                {t("subscribe.plan.form.transfer.label")}
              </TableHead>
              <TableHead className="w-12 text-right sm:w-20">
                {t("subscribe.plan.columns.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: colCount }).map((_, j) => {
                    // without drag: 0 id,1 show,2 sell,3 renew,4 name,5 stats,6 price,7 transfer,8 actions
                    // with drag: offset +1
                    const col = dragEnabled ? j - 1 : j;
                    return (
                      <TableCell
                        key={j}
                        className={cn(
                          col === 0 && "hidden md:table-cell",
                          col === 1 && "hidden md:table-cell",
                          col === 2 && "hidden md:table-cell",
                          col === 3 && "hidden md:table-cell",
                          col === 5 && "hidden lg:table-cell",
                          col === 6 && "hidden sm:table-cell",
                          col === 7 && "hidden md:table-cell",
                        )}
                      >
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : displayList.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={colCount}>
                  <EmptyState
                    icon={<Package className="h-10 w-10" />}
                    message={t("common.table.noData")}
                  />
                </TableCell>
              </TableRow>
            ) : (
              <SortableContainer items={displayList} onReorder={handleReorder} enabled={dragEnabled}>
                {displayList.map((p) => {
                  const transferLabel = p.transfer_enable
                    ? `${p.transfer_enable} GB`
                    : "∞";

                  return (
                    <SortableRow key={p.id} id={p.id}>
                      <DragCell />
                      <TableCell className="hidden md:table-cell">
                        <IdBadge id={p.id} compact />
                      </TableCell>
                      <TableCell className="hidden text-center md:table-cell">
                        {flagSwitch(p, "show", t("subscribe.plan.columns.show"))}
                      </TableCell>
                      <TableCell className="hidden text-center md:table-cell">
                        {flagSwitch(p, "sell", t("subscribe.plan.columns.sell"))}
                      </TableCell>
                      <TableCell className="hidden text-center md:table-cell">
                        {flagSwitch(p, "renew", t("subscribe.plan.columns.renew"))}
                      </TableCell>
                      <TableCell className="min-w-0 align-top sm:align-middle">
                        <div className="min-w-0 space-y-1.5">
                          <div className="min-w-0 space-y-0.5">
                            <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                              <span className="md:hidden">
                                <IdBadge id={p.id} compact />
                              </span>
                              <p
                                className="min-w-0 truncate font-medium"
                                title={p.name}
                              >
                                {p.name}
                              </p>
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                              {p.group?.name || (p.group_id ? `#${p.group_id}` : "—")}
                            </p>
                          </div>

                          {/* 窄屏：开关 / 统计 / 流量 / 主价格 并入名称列 */}
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 md:hidden">
                            {flagSwitch(
                              p,
                              "show",
                              t("subscribe.plan.columns.show"),
                              true,
                            )}
                            {flagSwitch(
                              p,
                              "sell",
                              t("subscribe.plan.columns.sell"),
                              true,
                            )}
                            {flagSwitch(
                              p,
                              "renew",
                              t("subscribe.plan.columns.renew"),
                              true,
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 lg:hidden">
                            <Badge
                              variant="secondary"
                              className="h-5 gap-1 select-none px-1.5 text-[10px] font-normal"
                              title={t("subscribe.plan.columns.users")}
                            >
                              <Users className="h-3 w-3" />
                              {p.users_count ?? 0}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="h-5 gap-1 select-none px-1.5 text-[10px] font-normal text-primary"
                              title={t("subscribe.plan.columns.active_users")}
                            >
                              <UserCheck className="h-3 w-3" />
                              {p.active_users_count ?? 0}
                            </Badge>
                            <span className="text-[11px] tabular-nums text-muted-foreground md:hidden">
                              {transferLabel}
                            </span>
                          </div>
                          <div className="text-[11px] sm:hidden">
                            {priceCell(p, true)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden text-center lg:table-cell">
                        <div className="flex items-center justify-center gap-1.5">
                          <Badge
                            variant="secondary"
                            className="h-5 gap-1 select-none font-normal"
                            title={t("subscribe.plan.columns.users")}
                          >
                            <Users className="h-3 w-3" />
                            {p.users_count ?? 0}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="h-5 gap-1 select-none font-normal text-primary"
                            title={t("subscribe.plan.columns.active_users")}
                          >
                            <UserCheck className="h-3 w-3" />
                            {p.active_users_count ?? 0}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="hidden text-right sm:table-cell">
                        {priceCell(p)}
                      </TableCell>
                      <TableCell className="hidden text-right tabular-nums text-sm font-medium md:table-cell">
                        {transferLabel}
                      </TableCell>
                      <TableCell className="text-right align-top sm:align-middle">
                        <div className="flex items-center justify-end gap-0.5 sm:gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => setEditing(p)}
                            aria-label={t("subscribe.plan.columns.edit")}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => setDeleting(p)}
                            aria-label={t("subscribe.plan.columns.delete")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
