import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUrlState, listQuerySchema } from "@/hooks/use-url-state";
import { Plus, Pencil, Trash2, Loader2, Search, TicketPercent, Copy } from "lucide-react";
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
import { dropCoupon, fetchCoupons, generateCoupon, updateCoupon, toggleCouponShow, type CouponItem } from "@/api/misc";

export function CouponListPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CouponItem | null>(null);
  const [deleting, setDeleting] = useState<CouponItem | null>(null);
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

  return (
    <>
      <PageHeader
        title={t("coupon.title")}
        description={t("coupon.description")}
        actions={
          <Button onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="h-4 w-4" />
            {t("coupon.form.add")}
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("coupon.table.toolbar.search")}
            value={qs.q}
            onChange={(e) => setQs({ q: e.target.value })}
            className="pl-9"
          />
        </div>
        <Select
          value={qs.type}
          onValueChange={(v) => setQs({ type: v })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={t("coupon.table.toolbar.type")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("common.all")}</SelectItem>
            <SelectItem value="1">{t("coupon.table.toolbar.types.1")}</SelectItem>
            <SelectItem value="2">{t("coupon.table.toolbar.types.2")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">{t("coupon.table.columns.id")}</TableHead>
              <TableHead className="w-16 text-center">{t("coupon.table.columns.show")}</TableHead>
              <TableHead>{t("coupon.table.columns.name")}</TableHead>
              <TableHead className="min-w-[9.5rem]">{t("coupon.table.columns.type")}</TableHead>
              <TableHead className="w-40">{t("coupon.table.columns.code")}</TableHead>
              <TableHead className="w-24 text-right">{t("coupon.table.columns.limitUse")}</TableHead>
              <TableHead className="w-40">{t("coupon.table.columns.validity")}</TableHead>
              <TableHead className="w-24 text-right">{t("coupon.table.columns.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : list.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={8}>
                  <EmptyState
                    icon={<TicketPercent className="h-10 w-10" />}
                    message={t("common.table.noData")}
                  />
                </TableCell>
              </TableRow>
            ) : (
              list.map((c) => {
                const validity = validityMeta(t, c);
                return (
                <TableRow key={c.id} className="group">
                  <TableCell><IdBadge id={c.id} compact /></TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={!!c.show}
                      onCheckedChange={() => handleToggleShow(c)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "max-w-full whitespace-nowrap font-normal px-2 py-0.5 leading-5",
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
                  </TableCell>
                  <TableCell>
                    <div className="flex min-w-0 items-center gap-1">
                      <span className="truncate font-mono text-xs" title={c.code}>{c.code}</span>
                      {c.code && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
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
                          <TooltipContent>{t("common.copy.success")}</TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {c.limit_use ?? "∞"}
                  </TableCell>
                  <TableCell>
                    <span className={cn("text-xs", validity.className)}>
                      {validity.label}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => { setEditing(c); setOpen(true); }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleting(c)}
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
          <div className="grid grid-cols-2 gap-2">
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
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label>{t("coupon.form.limitUse.label")}</Label>
              <Input type="number" value={limitUse} onChange={(e) => setLimitUse(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>{t("coupon.form.limitUseWithUser.label")}</Label>
              <Input type="number" value={limitUseWithUser} onChange={(e) => setLimitUseWithUser(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
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
