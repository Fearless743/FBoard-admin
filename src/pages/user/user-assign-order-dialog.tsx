import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { usePlanOptions } from "@/hooks/use-plans";
import { assignOrder } from "@/api/order";
import type { UserListItem } from "@/api/user";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  user: UserListItem | null;
  onDone: () => void;
}

/** 给指定用户手动分配订单（创建订阅） */
export function UserAssignOrderDialog({ open, onOpenChange, user, onDone }: Props) {
  const { t } = useTranslation();
  const [planId, setPlanId] = useState("");
  const [period, setPeriod] = useState("");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { data: plans = [] } = usePlanOptions();

  useEffect(() => {
    if (open) {
      setPlanId("");
      setPeriod("");
      setAmount("");
    }
  }, [open]);

  if (!user) return null;

  const submit = async () => {
    if (!planId || !period) {
      toast.error(t("order.dialog.placeholders.plan"));
      return;
    }
    setSubmitting(true);
    try {
      await assignOrder({
        email: user.email,
        plan_id: Number(planId),
        period: period as any,
        total_amount: Number(amount || 0),
      });
      toast.success(t("order.dialog.messages.addSuccess"));
      onDone();
      onOpenChange(false);
    } catch (e) {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("order.dialog.assignOrder")}</DialogTitle>
          <DialogDescription>
            {user.email}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>{t("order.dialog.fields.subscriptionPlan")}</Label>
            <Select value={planId} onValueChange={setPlanId}>
              <SelectTrigger>
                <SelectValue placeholder={t("order.dialog.placeholders.plan")} />
              </SelectTrigger>
              <SelectContent>
                {plans.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>{t("order.dialog.fields.orderPeriod")}</Label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger>
                <SelectValue placeholder={t("order.dialog.placeholders.period")} />
              </SelectTrigger>
              <SelectContent>
                {[
                  "month_price",
                  "quarter_price",
                  "half_year_price",
                  "year_price",
                  "two_year_price",
                  "three_year_price",
                  "onetime_price",
                  "reset_price",
                ].map((v) => (
                  <SelectItem key={v} value={v}>
                    {t(`order.period.${v}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>{t("order.dialog.fields.paymentAmount")} (元)</Label>
            <Input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={t("order.dialog.placeholders.amount")}
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("order.dialog.actions.cancel")}
          </Button>
          <Button onClick={submit} disabled={submitting}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("order.dialog.actions.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}