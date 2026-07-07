import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
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
  fetchPayments,
  getPaymentMethods,
  savePayment,
  updatePayment,
  type PaymentMethod,
} from "@/api/misc";

export function PaymentListPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PaymentMethod | null>(null);
  const [deleting, setDeleting] = useState<PaymentMethod | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: () => fetchPayments({}),
  });
  const list: PaymentMethod[] = data?.data || data || [];

  return (
    <>
      <PageHeader
        title={t("payment.title")}
        description={t("payment.description")}
        actions={
          <Button onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="h-4 w-4" />
            {t("payment.form.add.button")}
          </Button>
        }
      />

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
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
                  {Array.from({ length: 5 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : list.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}><EmptyState /></TableCell>
              </TableRow>
            ) : (
              list.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">#{p.id}</TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{p.payment}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {p.enable ? <Badge variant="success">ON</Badge> : <Badge variant="secondary">OFF</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => { setEditing(p); setOpen(true); }}
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
  const [config, setConfig] = useState("{}");
  const [submitting, setSubmitting] = useState(false);

  const { data: methods } = useQuery({
    queryKey: ["payment", "methods"],
    queryFn: getPaymentMethods,
  });
  const methodList = methods?.data || [];

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
        setConfig(JSON.stringify(payment.config || {}, null, 2));
      } else {
        setName("");
        setPaymentType("");
        setIcon("");
        setNotifyDomain("");
        setHandlingFeePercent("");
        setHandlingFeeFixed("");
        setEnable(true);
        setConfig("{}");
      }
    }
  }, [open, payment]);

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
      let parsedConfig: any = {};
      try {
        parsedConfig = config ? JSON.parse(config) : {};
      } catch (e) {
        toast.error("配置 JSON 格式错误");
        setSubmitting(false);
        return;
      }
      const payload: any = {
        name,
        payment: paymentType,
        icon,
        notify_domain: notifyDomain,
        handling_fee_percent: handlingFeePercent ? Number(handlingFeePercent) : 0,
        handling_fee_fixed: handlingFeeFixed ? Number(handlingFeeFixed) : 0,
        enable: enable ? 1 : 0,
        config: parsedConfig,
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {payment ? t("payment.form.edit.title") : t("payment.form.add.title")}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
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
            <Select value={paymentType} onValueChange={setPaymentType}>
              <SelectTrigger>
                <SelectValue placeholder={t("payment.form.fields.payment.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                {methodList.map((m) => (
                  <SelectItem key={m.name} value={m.name}>
                    {m.label || m.name}
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
          <div className="space-y-1.5">
            <Label>支付参数 (JSON)</Label>
            <Textarea
              rows={6}
              value={config}
              onChange={(e) => setConfig(e.target.value)}
              className="font-mono text-xs"
            />
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <Label className="text-sm font-normal">{t("payment.table.columns.enable")}</Label>
            <Switch checked={enable} onCheckedChange={setEnable} />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("payment.form.buttons.cancel")}
          </Button>
          <Button onClick={submit} disabled={submitting}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("payment.form.buttons.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
