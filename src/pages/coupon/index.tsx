import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUrlState, listQuerySchema } from "@/hooks/use-url-state";
import { Plus, Pencil, Trash2, Loader2, Search, TicketPercent, Copy, CalendarOff } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { IdBadge } from "@/components/common/id-badge";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, copyToClipboard, remainingDays } from "@/lib/utils";
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
import { Pagination } from "@/components/common/pagination";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dropCoupon, fetchCoupons, generateCoupon, updateCoupon, toggleCouponShow, batchDropCoupons, dropExpiredCoupons, type CouponItem } from "@/api/misc";

const COL_COUNT = 9;

export function CouponListPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CouponItem | null>(null);
  const [deleting, setDeleting] = useState<CouponItem | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [batchDeleting, setBatchDeleting] = useState<null | "selected" | "expired">(null);
  const [batchSubmitting, setBatchSubmitting] = useState(false);
  const [qs, setQs, query] = useUrlState(
    listQuerySchema({
      q: { type: "string", default: "", debounce: 500 },
      type: { type: "string", default: "all" },
    }),
  );

  const queryFilters: Array<{ id: string; value: any }> = [];
  if (query.type !== "all") {
    queryFilters.push({ id: "type", value: Number(query.type) });
  }

  const { data, isLoading } = useQuery({
    queryKey: ["coupons", { page: query.page, pageSize: query.pageSize, q: query.q, type: query.type }],
    queryFn: () =>
      fetchCoupons({
        current: query.page,
        pageSize: query.pageSize,
        search: query.q || undefined,
        filter: queryFilters.length > 0 ? queryFilters : undefined,
      }),
  });
  const list: CouponItem[] = data?.data || [];
  const total = data?.total || 0;

  const handleToggleShow = async (c: CouponItem) => {
    try {
      await toggleCouponShow(c.id, c.show ? 0 : 1);
      toast.success(t("common.success"));
      qc.invalidateQueries({ queryKey: ["coupons"] });
    } catch (e) {}
  };

  // 全选 / 反选当前页
  const pageIds = list.map((c) => c.id);
  const allChecked = pageIds.length > 0 && pageIds.every((id) => selected.has(id));
  const toggleAll = (checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      pageIds.forEach((id) => (checked ? next.add(id) : next.delete(id)));
      return next;
    });
  };
  const toggleOne = (id: number, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleBatchDeleteSelected = async () => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    setBatchSubmitting(true);
    try {
      await batchDropCoupons(ids);
      toast.success(t("common.delete.success"));
      setSelected(new Set());
      qc.invalidateQueries({ queryKey: ["coupons"] });
    } catch (e) {
    } finally {
      setBatchSubmitting(false);
      setBatchDeleting(null);
    }
  };

  const handleDropExpired = async () => {
    setBatchSubmitting(true);
    try {
      const res: any = await dropExpiredCoupons();
      const count = res?.count ?? 0;
      toast.success(count > 0 ? t("coupon.table.actions.dropExpiredResult.success", { count }) : t("coupon.table.actions.dropExpiredResult.empty"));
      qc.invalidateQueries({ queryKey: ["coupons"] });
    } catch (e) {
    } finally {
      setBatchSubmitting(false);
      setBatchDeleting(null);
    }
  };

  return (
    <>
      <PageHeader
        title={t("coupon.title")}
        description={t("coupon.description")}
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            {t("coupon.form.add")}
          </Button>
        }
      />

      <div className="mb-4 space-y-2">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("coupon.table.toolbar.search")}
            value={qs.q}
            onChange={(e) => setQs({ q: e.target.value })}
            className="pl-9"
          />
        </div>
        <Select value={qs.type} onValueChange={(v) => setQs({ type: v })}>
          <SelectTrigger className="w-full min-w-0 sm:w-[140px]">
            <SelectValue placeholder={t("coupon.table.toolbar.type")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("common.all")}</SelectItem>
            <SelectItem value="1">{t("coupon.table.toolbar.types.1")}</SelectItem>
            <SelectItem value="2">{t("coupon.table.toolbar.types.2")}</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={selected.size === 0}
            onClick={() => setBatchDeleting("selected")}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            {t("coupon.table.actions.batchDelete", { count: selected.size })}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setBatchDeleting("expired")}
          >
            <CalendarOff className="h-4 w-4" />
            {t("coupon.table.actions.dropExpired")}
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={allChecked}
                  onCheckedChange={(v) => toggleAll(!!v)}
                  aria-label={t("coupon.table.columns.select")}
                />
              </TableHead>
              <TableHead className="hidden w-16 md:table-cell">
                {t("coupon.table.columns.id")}
              </TableHead>
              <TableHead className="hidden w-16 text-center sm:table-cell">
                {t("coupon.table.columns.show")}
              </TableHead>
              <TableHead className="min-w-0">
                {t("coupon.table.columns.name")}
              </TableHead>
              <TableHead className="hidden min-w-[9.5rem] sm:table-cell">
                {t("coupon.table.columns.type")}
              </TableHead>
              <TableHead className="hidden w-40 md:table-cell">
                {t("coupon.table.columns.code")}
              </TableHead>
              <TableHead className="hidden w-24 text-right lg:table-cell">
                {t("coupon.table.columns.limitUse")}
              </TableHead>
              <TableHead className="hidden w-40 md:table-cell">
                {t("coupon.table.columns.validity")}
              </TableHead>
              <TableHead className="w-12 text-right sm:w-24">
                {t("coupon.table.columns.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: COL_COUNT }).map((_, j) => (
                    <TableCell
                      key={j}
                      className={cn(
                        // 0 select, 1 id, 2 show, 3 name, 4 type, 5 code, 6 limit, 7 validity, 8 actions
                        j === 1 && "hidden md:table-cell",
                        j === 2 && "hidden sm:table-cell",
                        j === 4 && "hidden sm:table-cell",
                        j === 5 && "hidden md:table-cell",
                        j === 6 && "hidden lg:table-cell",
                        j === 7 && "hidden md:table-cell",
                      )}
                    >
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : list.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={COL_COUNT}>
                  <EmptyState
                    icon={<TicketPercent className="h-10 w-10" />}
                    message={t("common.table.noData")}
                  />
                </TableCell>
              </TableRow>
            ) : (
              list.map((c) => {
                const validity = validityMeta(t, c);
                const typeBadge = (
                  <Badge
                    variant="outline"
                    className={cn(
                      "max-w-full whitespace-nowrap px-1.5 py-0.5 text-[11px] font-normal leading-5 sm:px-2 sm:text-xs",
                      c.type === 1
                        ? "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300"
                        : "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300",
                    )}
                  >
                    <span className="truncate">
                      {t(`coupon.table.toolbar.types.${c.type}`)}
                    </span>
                    <span className="ml-1 shrink-0 tabular-nums">
                      {c.type === 1
                        ? `¥${(c.value / 100).toFixed(0)}`
                        : `${c.value}%`}
                    </span>
                  </Badge>
                );

                const codeCell = (
                  <div className="flex min-w-0 items-center gap-1">
                    <span
                      className="truncate font-mono text-xs"
                      title={c.code}
                    >
                      {c.code || "—"}
                    </span>
                    {c.code ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0 opacity-70 transition-opacity hover:opacity-100 focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                            onClick={async () => {
                              try {
                                await copyToClipboard(c.code);
                                toast.success(t("common.copy.success"));
                              } catch {
                                toast.error(t("common.copy.failed"));
                              }
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {t("common.copy.success")}
                        </TooltipContent>
                      </Tooltip>
                    ) : null}
                  </div>
                );

                return (
                  <TableRow key={c.id} className="group">
                    <TableCell className="w-10">
                      <Checkbox
                        checked={selected.has(c.id)}
                        onCheckedChange={(v) => toggleOne(c.id, !!v)}
                        aria-label={t("coupon.table.columns.select")}
                      />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <IdBadge id={c.id} compact />
                    </TableCell>
                    <TableCell className="hidden text-center sm:table-cell">
                      <Switch
                        checked={!!c.show}
                        onCheckedChange={() => handleToggleShow(c)}
                        aria-label={t("coupon.table.columns.show")}
                      />
                    </TableCell>
                    <TableCell className="min-w-0 align-top sm:align-middle">
                      <div className="min-w-0 space-y-1.5">
                        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                          <span className="md:hidden">
                            <IdBadge id={c.id} compact />
                          </span>
                          <p
                            className="min-w-0 truncate font-medium"
                            title={c.name}
                          >
                            {c.name}
                          </p>
                        </div>
                        {/* 窄屏：显示开关 / 类型 / 券码 / 有效期 并入名称列 */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 sm:hidden">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] text-muted-foreground">
                              {t("coupon.table.columns.show")}
                            </span>
                            <Switch
                              checked={!!c.show}
                              onCheckedChange={() => handleToggleShow(c)}
                              aria-label={t("coupon.table.columns.show")}
                            />
                          </div>
                          {typeBadge}
                        </div>
                        <div className="md:hidden">{codeCell}</div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px]">
                          <span className={cn("md:hidden", validity.className)}>
                            {validity.label}
                          </span>
                          <span className="tabular-nums text-muted-foreground lg:hidden">
                            {t("coupon.table.columns.limitUse")}:{" "}
                            {c.limit_use ?? "∞"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {typeBadge}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {codeCell}
                    </TableCell>
                    <TableCell className="hidden text-right tabular-nums lg:table-cell">
                      {c.limit_use ?? "∞"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className={cn("text-xs", validity.className)}>
                        {validity.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-right align-top sm:align-middle">
                      <div className="flex items-center justify-end gap-0.5 sm:gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => {
                            setEditing(c);
                            setOpen(true);
                          }}
                          aria-label={t("coupon.form.edit")}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleting(c)}
                          aria-label={t("coupon.table.actions.deleteConfirm.title")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        <Pagination
          page={qs.page}
          pageSize={qs.pageSize}
          total={total}
          onPageChange={(p) => setQs({ page: p })}
          onPageSizeChange={(s) => setQs({ pageSize: s, page: 1 })}
        />
      </div>

      <CouponFormDialog
        open={open}
        onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}
        coupon={editing}
        onSaved={() => qc.invalidateQueries({ queryKey: ["coupons"] })}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title={t("coupon.table.actions.deleteConfirm.title")}
        description={t("coupon.table.actions.deleteConfirm.description")}
        onConfirm={async () => {
          if (!deleting) return;
          try {
            await dropCoupon(deleting.id);
            toast.success(t("common.delete.success"));
            qc.invalidateQueries({ queryKey: ["coupons"] });
            setDeleting(null);
          } catch (e) {}
        }}
      />

      <ConfirmDialog
        open={batchDeleting === "selected"}
        onOpenChange={(v) => !v && setBatchDeleting(null)}
        title={t("coupon.table.actions.batchDeleteConfirm.title")}
        description={t("coupon.table.actions.batchDeleteConfirm.description", { count: selected.size })}
        onConfirm={handleBatchDeleteSelected}
        loading={batchSubmitting}
      />

      <ConfirmDialog
        open={batchDeleting === "expired"}
        onOpenChange={(v) => !v && setBatchDeleting(null)}
        title={t("coupon.table.actions.dropExpiredConfirm.title")}
        description={t("coupon.table.actions.dropExpiredConfirm.description")}
        onConfirm={handleDropExpired}
        loading={batchSubmitting}
      />
    </>
  );
}

function validityMeta(t: (k: string, p?: any) => string, c: CouponItem) {
  const now = Math.floor(Date.now() / 1000);
  if (c.ended_at && c.ended_at < now) {
    const d = remainingDays(c.ended_at);
    return {
      label: t("coupon.table.validity.expired", { days: Math.abs(d || 0) }),
      className: "text-destructive",
    };
  }
  if (c.started_at && c.started_at > now) {
    const d = remainingDays(c.started_at);
    return {
      label: t("coupon.table.validity.notStarted", { days: d }),
      className: "text-amber-600 dark:text-amber-400",
    };
  }
  if (c.ended_at) {
    const d = remainingDays(c.ended_at);
    return {
      label: t("coupon.table.validity.remaining", { days: d }),
      className: (d ?? 99) <= 3 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground",
    };
  }
  return {
    label: t("coupon.table.validity.unlimited"),
    className: "text-muted-foreground",
  };
}

function CouponFormDialog({
  open,
  onOpenChange,
  coupon,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  coupon: CouponItem | null;
  onSaved: () => void;
}) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [type, setType] = useState<1 | 2>(1);
  const [value, setValue] = useState<number>(0);
  const [code, setCode] = useState("");
  const [limitUse, setLimitUse] = useState<string>("");
  const [limitUseWithUser, setLimitUseWithUser] = useState<string>("");
  const [startedAt, setStartedAt] = useState("");
  const [endedAt, setEndedAt] = useState("");
  const [generateCount, setGenerateCount] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setName(coupon?.name || "");
      setType(coupon?.type || 1);
      setValue(coupon?.type === 1 ? Math.round((coupon?.value || 0) / 100) : (coupon?.value || 0));
      setCode(coupon?.code || "");
      setLimitUse(coupon?.limit_use?.toString() || "");
      setLimitUseWithUser(coupon?.limit_use_with_user?.toString() || "");
      setStartedAt(coupon?.started_at ? toInput(coupon.started_at) : "");
      setEndedAt(coupon?.ended_at ? toInput(coupon.ended_at) : "");
      setGenerateCount("");
    }
  }, [open, coupon]);

  const submit = async () => {
    if (!name) {
      toast.error(t("coupon.form.name.required"));
      return;
    }
    setSubmitting(true);
    try {
      const payload: any = {
        name,
        type,
        value: type === 1 ? Math.round(Number(value) * 100) : Number(value),
        code: code || undefined,
        limit_use: limitUse ? Number(limitUse) : undefined,
        limit_use_with_user: limitUseWithUser ? Number(limitUseWithUser) : undefined,
        started_at: startedAt ? Math.floor(new Date(startedAt).getTime() / 1000) : undefined,
        ended_at: endedAt ? Math.floor(new Date(endedAt).getTime() / 1000) : undefined,
        generate_count: generateCount ? Number(generateCount) : undefined,
      };
      if (coupon) {
        await updateCoupon({ id: coupon.id, ...payload });
      } else {
        await generateCoupon(payload);
      }
      toast.success(t("common.success"));
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
          <DialogTitle>{coupon ? t("coupon.form.edit") : t("coupon.form.add")}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-y-auto space-y-3 px-6 py-4">
          <div className="space-y-1.5">
            <Label>{t("coupon.form.name.label")}</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-2">
            <div className="space-y-1.5">
              <Label>{t("coupon.form.type.label")}</Label>
              <Select value={String(type)} onValueChange={(v) => setType(Number(v) as 1 | 2)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">{t("coupon.table.toolbar.types.1")}</SelectItem>
                  <SelectItem value="2">{t("coupon.table.toolbar.types.2")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t("coupon.form.value.placeholder")}</Label>
              <Input
                type="number"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                placeholder={type === 1 ? t("common.currency.yuan") : "%"}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>{t("coupon.form.code.label")}</Label>
            <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder={t("coupon.form.code.placeholder")} />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-2">
            <div className="space-y-1.5">
              <Label>{t("coupon.form.limitUse.label")}</Label>
              <Input type="number" value={limitUse} onChange={(e) => setLimitUse(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>{t("coupon.form.limitUseWithUser.label")}</Label>
              <Input type="number" value={limitUseWithUser} onChange={(e) => setLimitUseWithUser(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-2">
            <div className="space-y-1.5">
              <Label>
                {t("coupon.form.validity.label")} ({t("common.start")})
              </Label>
              <Input type="datetime-local" value={startedAt} onChange={(e) => setStartedAt(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>
                {t("coupon.form.validity.label")} ({t("common.end")})
              </Label>
              <Input type="datetime-local" value={endedAt} onChange={(e) => setEndedAt(e.target.value)} />
            </div>
          </div>
          {!coupon && (
            <div className="space-y-1.5">
              <Label>{t("coupon.form.generateCount.label")}</Label>
              <Input type="number" min={1} value={generateCount} onChange={(e) => setGenerateCount(e.target.value)} />
            </div>
          )}
        </div>
        <DialogFooter className="gap-2 border-t px-6 py-4 shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={submit} disabled={submitting}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("coupon.form.submit.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function toInput(unix: number) {
  const d = new Date(unix * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
