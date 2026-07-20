import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2, GripVertical, Search, CreditCard, Copy } from "lucide-react";
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
import { SortableContainer, SortableRow, DragCell } from "@/components/common/sortable-table";
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
import { Textarea } from "@/components/ui/textarea";
import {
  dropPayment,
  copyPayment,
  fetchPayments,
  getPaymentMethods,
  getPaymentForm,
  savePayment,
  updatePayment,
  togglePaymentShow,
  sortPayments,
  type PaymentMethod,
} from "@/api/misc";

const SORT_PAGE_SIZE = 1000;

export function PaymentListPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PaymentMethod | null>(null);
  const [deleting, setDeleting] = useState<PaymentMethod | null>(null);
  const [dragEnabled, setDragEnabled] = useState(false);
  const [pendingList, setPendingList] = useState<PaymentMethod[] | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
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
    queryKey: ["payments", { page: effectivePage, pageSize: effectivePageSize, debouncedSearch, dragEnabled }],
    queryFn: () =>
      fetchPayments({
        current: effectivePage,
        pageSize: effectivePageSize,
        search: debouncedSearch || undefined,
      }),
  });
  const list: PaymentMethod[] = data?.data || [];
  const total = data?.total || 0;
  const displayList = pendingList ?? list;

  // 拖拽只改本地顺序，点「完成排序」再提交
  const handleReorder = useCallback((ids: number[]) => {
    const reordered = ids
      .map((id) => displayList.find((i) => Number(i.id) === Number(id)))
      .filter(Boolean) as PaymentMethod[];
    setPendingList(reordered);
  }, [displayList]);

  const finishSort = useCallback(async () => {
    if (!pendingList) {
      setDragEnabled(false);
      return;
    }
    try {
      await sortPayments(pendingList.map((i) => Number(i.id)));
      toast.success(t("common.http.success"));
      setPendingList(null);
      setDragEnabled(false);
      await qc.invalidateQueries({ queryKey: ["payments"] });
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
        title={t("payment.title")}
        description={t("payment.description")}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant={dragEnabled ? "default" : "outline"}
              onClick={toggleDrag}
            >
              <GripVertical className="h-4 w-4" />
              {dragEnabled ? t("common.sort.done") : t("common.sort.edit")}
            </Button>
            <Button onClick={() => { setEditing(null); setOpen(true); }} disabled={dragEnabled}>
              <Plus className="h-4 w-4" />
              {t("payment.form.add.button")}
            </Button>
          </div>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("payment.table.toolbar.search")}
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
              {dragEnabled && <TableHead className="w-10" />}
              <TableHead className="w-16">{t("payment.table.columns.id")}</TableHead>
              <TableHead>{t("payment.table.columns.name")}</TableHead>
              <TableHead>{t("payment.table.columns.payment")}</TableHead>
              <TableHead className="w-24 text-center">{t("payment.table.columns.enable")}</TableHead>
              <TableHead className="w-24 text-right">{t("payment.table.columns.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: dragEnabled ? 6 : 5 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : list.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={dragEnabled ? 6 : 5}>
                  <EmptyState
                    icon={<CreditCard className="h-10 w-10" />}
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
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{p.payment}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch checked={!!p.enable} onCheckedChange={async (checked) => {
                      try {
                        await togglePaymentShow(p.id, checked ? 1 : 0);
                        qc.invalidateQueries({ queryKey: ["payments"] });
                      } catch (e) {}
                    }} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        title={t("payment.table.actions.edit")}
                        onClick={() => { setEditing(p); setOpen(true); }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        title={t("payment.table.actions.copy")}
                        disabled={dragEnabled}
                        onClick={async () => {
                          try {
                            await copyPayment(p.id);
                            toast.success(t("payment.table.actions.copy_success"));
                            await qc.invalidateQueries({ queryKey: ["payments"] });
                          } catch (e) {}
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        title={t("payment.table.actions.delete.title")}
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
            onPageSizeChange={(s) => {
              setPageSize(s);
              setPage(1);
            }}
          />
        )}
      </div>

      <PaymentFormDialog
        open={open}
        onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}
        payment={editing}
        onSaved={() => qc.invalidateQueries({ queryKey: ["payments"] })}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title={t("payment.table.actions.delete.title")}
        description={t("payment.table.actions.delete.description")}
        onConfirm={async () => {
          if (!deleting) return;
          try {
            await dropPayment(deleting.id);
            toast.success(t("payment.table.actions.delete.success"));
            qc.invalidateQueries({ queryKey: ["payments"] });
            setDeleting(null);
          } catch (e) {}
        }}
      />
    </>
  );
}

function PaymentFormDialog({
  open,
  onOpenChange,
  payment,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  payment: PaymentMethod | null;
  onSaved: () => void;
}) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [icon, setIcon] = useState("");
  const [notifyDomain, setNotifyDomain] = useState("");
  const [handlingFeePercent, setHandlingFeePercent] = useState("");
  const [handlingFeeFixed, setHandlingFeeFixed] = useState("");
  const [enable, setEnable] = useState(true);
  const [configValues, setConfigValues] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);

  const { data: methods } = useQuery({
    queryKey: ["payment", "methods"],
    queryFn: getPaymentMethods,
  });
  const methodList: string[] = Array.isArray(methods) ? methods : [];

  // 获取支付配置的模式定义
  const { data: paymentFormRaw, isLoading: formLoading } = useQuery({
    queryKey: ["payment", "form", paymentType],
    queryFn: () => getPaymentForm(paymentType),
    enabled: !!paymentType,
  });
  const formSchema: Record<string, { type: string; label: string; placeholder: string; description: string; value: any; options: any[] }> =
    (paymentFormRaw as any)?.data || paymentFormRaw || {};
  const formFields = Object.entries(formSchema).map(([key, def]) => ({ key, ...def }));

  useEffect(() => {
    if (open) {
      if (payment) {
        setName(payment.name || "");
        setPaymentType(payment.payment || "");
        setIcon(payment.icon || "");
        setNotifyDomain(payment.notify_domain || "");
        setHandlingFeePercent(payment.handling_fee_percent?.toString() || "");
        setHandlingFeeFixed(payment.handling_fee_fixed?.toString() || "");
        setEnable(payment.enable !== 0);
        setConfigValues(typeof payment.config === "object" && payment.config !== null ? payment.config : {});
      } else {
        setName("");
        setPaymentType("");
        setIcon("");
        setNotifyDomain("");
        setHandlingFeePercent("");
        setHandlingFeeFixed("");
        setEnable(true);
        setConfigValues({});
      }
    }
  }, [open, payment]);

  const setConfigValue = (key: string, val: any) => {
    setConfigValues((prev) => ({ ...prev, [key]: val }));
  };

  const submit = async () => {
    if (!name) {
      toast.error(t("payment.form.validation.name.min"));
      return;
    }
    if (!paymentType) {
      toast.error(t("payment.form.validation.payment.required"));
      return;
    }
    setSubmitting(true);
    try {
      const payload: any = {
        name,
        payment: paymentType,
        icon,
        notify_domain: notifyDomain,
        handling_fee_percent: handlingFeePercent ? Number(handlingFeePercent) : 0,
        handling_fee_fixed: handlingFeeFixed ? Number(handlingFeeFixed) : 0,
        enable: enable ? 1 : 0,
        config: configValues,
      };
      if (payment) {
        await updatePayment({ id: payment.id, ...payload });
      } else {
        await savePayment(payload);
      }
      toast.success(t("payment.form.messages.success"));
      onSaved();
      onOpenChange(false);
    } catch (e) {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
          <DialogTitle>
            {payment ? t("payment.form.edit.title") : t("payment.form.add.title")}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-y-auto space-y-3 px-6 py-4">
          <div className="space-y-1.5">
            <Label>{t("payment.form.fields.name.label")}</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("payment.form.fields.name.placeholder")}
            />
          </div>
          <div className="space-y-1.5">
            <Label>{t("payment.form.fields.payment.label")}</Label>
            <Select value={paymentType} onValueChange={(v) => { setPaymentType(v); setConfigValues({}); }}>
              <SelectTrigger>
                <SelectValue placeholder={t("payment.form.fields.payment.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                {methodList.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>{t("payment.form.fields.icon.label")}</Label>
            <Input
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder={t("payment.form.fields.icon.placeholder")}
            />
          </div>
          <div className="space-y-1.5">
            <Label>{t("payment.form.fields.notify_domain.label")}</Label>
            <Input
              value={notifyDomain}
              onChange={(e) => setNotifyDomain(e.target.value)}
              placeholder={t("payment.form.fields.notify_domain.placeholder")}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label>{t("payment.form.fields.handling_fee_percent.label")}</Label>
              <Input
                type="number"
                value={handlingFeePercent}
                onChange={(e) => setHandlingFeePercent(e.target.value)}
                placeholder="0-100"
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("payment.form.fields.handling_fee_fixed.label")}</Label>
              <Input
                type="number"
                value={handlingFeeFixed}
                onChange={(e) => setHandlingFeeFixed(e.target.value)}
              />
            </div>
          </div>

          {paymentType && (
            <div className="border-t pt-4 mt-4 space-y-4">
              <h4 className="text-sm font-medium">{t("payment.form.config.title")}</h4>
              {formLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : formFields.length > 0 ? (
                formFields.map((f) => {
                  const key = f.key;
                  const label = f.label || key;
                  const description = f.description || "";
                  const placeholder = f.placeholder || "";

                  if (f.type === "boolean") {
                    return (
                      <div key={key} className="flex items-center justify-between rounded-md border bg-card px-4 py-3">
                        <div className="space-y-0.5 pr-4">
                          <Label className="text-sm font-medium">{label}</Label>
                          {description && <p className="text-xs text-muted-foreground">{description}</p>}
                        </div>
                        <Switch
                          checked={!!configValues[key]}
                          onCheckedChange={(v) => setConfigValue(key, v)}
                        />
                      </div>
                    );
                  }

                  if (f.type === "select" && Array.isArray(f.options) && f.options.length > 0) {
                    return (
                      <div key={key} className="space-y-1.5">
                        <Label className="text-sm font-medium">{label}</Label>
                        <Select
                          value={String(configValues[key] ?? f.value ?? "")}
                          onValueChange={(v) => setConfigValue(key, v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={placeholder} />
                          </SelectTrigger>
                          <SelectContent>
                            {f.options.map((opt: any) => {
                              const optVal = typeof opt === "string" ? opt : opt.value ?? opt;
                              const optLabel = typeof opt === "string" ? opt : opt.label ?? opt;
                              return (
                                <SelectItem key={String(optVal)} value={String(optVal)}>
                                  {optLabel}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        {description && <p className="text-xs text-muted-foreground">{description}</p>}
                      </div>
                    );
                  }

                  if (f.type === "text") {
                    return (
                      <div key={key} className="space-y-1.5">
                        <Label className="text-sm font-medium">{label}</Label>
                        <Textarea
                          value={configValues[key] ?? f.value ?? ""}
                          placeholder={placeholder}
                          rows={4}
                          onChange={(e) => setConfigValue(key, e.target.value)}
                        />
                        {description && <p className="text-xs text-muted-foreground">{description}</p>}
                      </div>
                    );
                  }

                  // string / default
                  return (
                    <div key={key} className="space-y-1.5">
                      <Label className="text-sm font-medium">{label}</Label>
                      <Input
                        value={configValues[key] ?? f.value ?? ""}
                        placeholder={placeholder}
                        onChange={(e) => setConfigValue(key, e.target.value)}
                      />
                      {description && <p className="text-xs text-muted-foreground">{description}</p>}
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground">{t("payment.form.config.noConfig")}</p>
              )}
            </div>
          )}

          <div className="flex items-center justify-between rounded-md border p-3">
            <Label className="text-sm font-normal">{t("payment.table.columns.enable")}</Label>
            <Switch checked={enable} onCheckedChange={setEnable} />
          </div>
        </div>
        <DialogFooter className="gap-2 border-t px-6 py-4 shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("payment.form.buttons.cancel")}
          </Button>
          <Button onClick={submit} disabled={submitting || formLoading}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("payment.form.buttons.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
