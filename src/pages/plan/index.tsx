import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2, GripVertical, Search, Save, ChevronUp, ChevronDown, Info, Users, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
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
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { dropPlan, fetchPlans, sortPlans, updatePlan, type Plan } from "@/api/plan";
import { PlanFormDialog } from "./plan-form-dialog";

export function PlanListPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Plan | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleting, setDeleting] = useState<Plan | null>(null);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState(false);
  const [sortIds, setSortIds] = useState<number[]>([]);
  const [savingSort, setSavingSort] = useState(false);
  const [toggleLoading, setToggleLoading] = useState<Record<string, boolean>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: fetchPlans,
  });

  const plans = useMemo(() => {
    const list = (data || []).sort((a: Plan, b: Plan) => (a.sort || 0) - (b.sort || 0));
    if (!search) return list;
    return list.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const startSortEdit = () => {
    const ids = plans.map((p) => p.id);
    setSortIds(ids);
    setSorting(true);
  };

  const saveSort = async () => {
    setSavingSort(true);
    try {
      await sortPlans(sortIds);
      toast.success(t("subscribe.plan.sort.save") + "成功");
      setSorting(false);
      qc.invalidateQueries({ queryKey: ["plans"] });
    } catch (e) {
    } finally {
      setSavingSort(false);
    }
  };

  return (
    <>
      <PageHeader
        title={t("subscribe.plan.title")}
        description={t("subscribe.plan.page.description")}
        actions={
          <div className="flex items-center gap-2">
            {sorting ? (
              <Button onClick={saveSort} disabled={savingSort}>
                {savingSort && <Loader2 className="h-4 w-4 animate-spin" />}
                <Save className="h-4 w-4" />
                {t("subscribe.plan.sort.save")}
              </Button>
            ) : (
              <Button variant="outline" onClick={startSortEdit}>
                <GripVertical className="h-4 w-4" />
                {t("subscribe.plan.sort.edit")}
              </Button>
            )}
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" />
              {t("subscribe.plan.add")}
            </Button>
          </div>
        }
      />

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("subscribe.plan.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead className="w-14">{t("subscribe.plan.columns.id")}</TableHead>
              <TableHead className="w-16 text-center">{t("subscribe.plan.columns.show")}</TableHead>
              <TableHead className="w-16 text-center">{t("subscribe.plan.columns.sell")}</TableHead>
              <TableHead className="w-16 text-center">{t("subscribe.plan.columns.renew")}</TableHead>
              <TableHead>{t("subscribe.plan.columns.name")}</TableHead>
              <TableHead className="text-center w-16">{t("subscribe.plan.columns.stats")}</TableHead>
              <TableHead className="text-right">{t("subscribe.plan.columns.price")}</TableHead>
              <TableHead className="text-right">{t("subscribe.plan.form.transfer.label")}</TableHead>
              <TableHead>{t("subscribe.plan.columns.group")}</TableHead>
              <TableHead className="w-20 text-right">{t("subscribe.plan.columns.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 11 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : plans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11}>
                  <EmptyState />
                </TableCell>
              </TableRow>
            ) : (
              plans.map((p, idx) => (
                <TableRow key={p.id}>
                  <TableCell>
                    {sorting ? (
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          disabled={idx === 0}
                          onClick={() => {
                            const arr = [...sortIds];
                            [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
                            setSortIds(arr);
                          }}
                        >
                          <ChevronUp className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          disabled={idx === sortIds.length - 1}
                          onClick={() => {
                            const arr = [...sortIds];
                            [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
                            setSortIds(arr);
                          }}
                        >
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{p.id}</TableCell>
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
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Badge variant="secondary" className="gap-1 select-none" title={t("subscribe.plan.columns.users")}>
                        <Users className="h-3 w-3" />
                        {p.users_count ?? 0}
                      </Badge>
                      <Badge variant="outline" className="gap-1 select-none border-sky-500 text-sky-600" title={t("subscribe.plan.columns.active_users")}>
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
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {p.transfer_enable ? `${p.transfer_enable} GB` : "∞"}
                  </TableCell>
                  <TableCell className="text-xs">
                    {p.group?.name || (p.group_id ? `#${p.group_id}` : "—")}
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
                        className="h-8 w-8 text-destructive"
                        onClick={() => setDeleting(p)}
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
