import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { IdBadge } from "@/components/common/id-badge";
import { Switch } from "@/components/ui/switch";
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
import { remainingDays } from "@/lib/utils";

export function CouponListPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CouponItem | null>(null);
  const [deleting, setDeleting] = useState<CouponItem | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, typeFilter]);

  const queryFilters: Array<{ id: string; value: any }> = [];
  if (typeFilter !== "all") {
    queryFilters.push({ id: "type", value: Number(typeFilter) });
  }

  const { data, isLoading } = useQuery({
    queryKey: ["coupons", { page, pageSize, debouncedSearch, typeFilter }],
    queryFn: () =>
      fetchCoupons({
        current: page,
        pageSize,
        search: debouncedSearch || undefined,
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
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={typeFilter}
          onValueChange={(v) => {
            setTypeFilter(v);
          }}
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
              <TableHead className="w-24">{t("coupon.table.columns.type")}</TableHead>
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
              <TableRow>
                <TableCell colSpan={8}><EmptyState /></TableCell>
              </TableRow>
            ) : (
              list.map((c) => (
                <TableRow key={c.id}>
                  <TableCell><IdBadge id={c.id} /></TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={!!c.show}
                      onCheckedChange={() => handleToggleShow(c)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {t(`coupon.table.toolbar.types.${c.type}`)}
                      {c.type === 1 ? ` ${c.value / 100}` : ` ${c.value}%`}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{c.code}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {c.limit_use ?? "∞"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatValidity(t, c)}
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
                        className="h-8 w-8 text-destructive"
                        onClick={() => setDeleting(c)}
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

        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={(s) => {
            setPageSize(s);
            setPage(1);
          }}
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

function formatValidity(t: (k: string, p?: any) => string, c: CouponItem) {
  const now = Math.floor(Date.now() / 1000);
  if (c.ended_at && c.ended_at < now) {
    const d = remainingDays(c.ended_at);
    return t("coupon.table.validity.expired", { days: Math.abs(d || 0) });
  }
  if (c.started_at && c.started_at > now) {
    const d = remainingDays(c.started_at);
    return t("coupon.table.validity.notStarted", { days: d });
  }
  if (c.ended_at) {
    const d = remainingDays(c.ended_at);
    return t("coupon.table.validity.remaining", { days: d });
  }
  return t("coupon.table.validity.unlimited");
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
                placeholder={type === 1 ? "元" : "%"}
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
              <Label>{t("coupon.form.validity.label")} (起)</Label>
              <Input type="datetime-local" value={startedAt} onChange={(e) => setStartedAt(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>{t("coupon.form.validity.label")} (止)</Label>
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
