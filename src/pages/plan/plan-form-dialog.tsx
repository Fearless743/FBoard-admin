import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { savePlan, type Plan } from "@/api/plan";

interface FormValues {
  id?: number;
  name: string;
  transfer_enable_gb: number;
  speed_limit: number;
  device_limit: number;
  capacity_limit: number;
  group_id: number | null;
  month_price: number | null;
  quarter_price: number | null;
  half_year_price: number | null;
  year_price: number | null;
  two_year_price: number | null;
  three_year_price: number | null;
  onetime_price: number | null;
  reset_price: number | null;
  reset_traffic_method: number;
  show: boolean;
  sell: boolean;
  renew: boolean;
  content: string;
}

export function PlanFormDialog({
  open,
  onOpenChange,
  plan,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  plan: Plan | null;
  onSaved: () => void;
}) {
  const { t } = useTranslation();

  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } =
    useForm<FormValues>({
      defaultValues: {
        name: "",
        transfer_enable_gb: 0,
        speed_limit: 0,
        device_limit: 0,
        capacity_limit: 0,
        group_id: null,
        month_price: null,
        quarter_price: null,
        half_year_price: null,
        year_price: null,
        two_year_price: null,
        three_year_price: null,
        onetime_price: null,
        reset_price: null,
        reset_traffic_method: 0,
        show: true,
        sell: true,
        renew: true,
        content: "",
      },
    });

  useEffect(() => {
    if (open) {
      const pr = plan?.prices || {};
      reset({
        id: plan?.id,
        name: plan?.name || "",
        transfer_enable_gb: plan?.transfer_enable ?? 0,
        speed_limit: plan?.speed_limit ?? 0,
        device_limit: plan?.device_limit ?? 0,
        capacity_limit: plan?.capacity_limit ?? 0,
        group_id: plan?.group_id ?? null,
        month_price: pr.monthly != null ? Number(pr.monthly) : null,
        quarter_price: pr.quarterly != null ? Number(pr.quarterly) : null,
        half_year_price: pr.half_yearly != null ? Number(pr.half_yearly) : null,
        year_price: pr.yearly != null ? Number(pr.yearly) : null,
        two_year_price: pr.two_yearly != null ? Number(pr.two_yearly) : null,
        three_year_price: pr.three_yearly != null ? Number(pr.three_yearly) : null,
        onetime_price: pr.onetime != null ? Number(pr.onetime) : null,
        reset_price: pr.reset_traffic != null ? Number(pr.reset_traffic) : null,
        reset_traffic_method: plan?.reset_traffic_method ?? 0,
        show: Number(plan?.show) === 1,
        sell: Number(plan?.sell) === 1,
        renew: Number(plan?.renew) === 1,
        content: plan?.content || "",
      });
    }
  }, [open, plan, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      const payload: any = {
        name: values.name,
        transfer_enable: Math.round(Math.max(1, values.transfer_enable_gb)),
        speed_limit: values.speed_limit || null,
        device_limit: values.device_limit || null,
        capacity_limit: values.capacity_limit || null,
        group_id: values.group_id || null,
        show: values.show ? 1 : 0,
        sell: values.sell ? 1 : 0,
        renew: values.renew ? 1 : 0,
        content: values.content || "",
        prices: {
          monthly: values.month_price !== null && values.month_price !== undefined && !isNaN(values.month_price) ? Number(values.month_price) : null,
          quarterly: values.quarter_price !== null && values.quarter_price !== undefined && !isNaN(values.quarter_price) ? Number(values.quarter_price) : null,
          half_yearly: values.half_year_price !== null && values.half_year_price !== undefined && !isNaN(values.half_year_price) ? Number(values.half_year_price) : null,
          yearly: values.year_price !== null && values.year_price !== undefined && !isNaN(values.year_price) ? Number(values.year_price) : null,
          two_yearly: values.two_year_price !== null && values.two_year_price !== undefined && !isNaN(values.two_year_price) ? Number(values.two_year_price) : null,
          three_yearly: values.three_year_price !== null && values.three_year_price !== undefined && !isNaN(values.three_year_price) ? Number(values.three_year_price) : null,
          onetime: values.onetime_price !== null && values.onetime_price !== undefined && !isNaN(values.onetime_price) ? Number(values.onetime_price) : null,
          reset_traffic: values.reset_price !== null && values.reset_price !== undefined && !isNaN(values.reset_price) ? Number(values.reset_price) : null,
        },
      };
      if (plan?.id) payload.id = plan.id;
      await savePlan(payload);
      toast.success(plan ? t("subscribe.plan.form.submit.success.update") : t("subscribe.plan.form.submit.success.add"));
      onSaved();
      onOpenChange(false);
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || "";
      if (msg) toast.error(msg);
    }
  };

  const priceField = (key: keyof FormValues, period: "monthly" | "quarterly" | "half_yearly" | "yearly" | "two_yearly" | "three_yearly" | "onetime" | "reset_traffic", placeholder: string) => {
    return (
      <div className="space-y-1.5">
        <Label className="text-sm">
          {t(`subscribe.plan.columns.price_period.${period}`)}
        </Label>
        <div className="relative">
          <Input
            type="number"
            step="0.01"
            placeholder={placeholder}
            className="pr-12"
            {...register(key as any, { valueAsNumber: true })}
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">元</span>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {plan ? t("subscribe.plan.form.edit_title") : t("subscribe.plan.form.add_title")}
          </DialogTitle>
          <DialogDescription>{t("subscribe.plan.page.description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* 基本信息 */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>{t("subscribe.plan.form.name.label")}</Label>
              <Input {...register("name", { required: true })} />
            </div>
            <div className="space-y-1.5">
              <Label>{t("subscribe.plan.form.transfer.label")} (GB)</Label>
              <Input
                type="number"
                step="0.01"
                {...register("transfer_enable_gb", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("subscribe.plan.form.speed.label")} (Mbps)</Label>
              <Input
                type="number"
                {...register("speed_limit", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("subscribe.plan.form.device.label")}</Label>
              <Input
                type="number"
                {...register("device_limit", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("subscribe.plan.form.capacity.label")}</Label>
              <Input
                type="number"
                {...register("capacity_limit", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>{t("subscribe.plan.form.reset_method.label")}</Label>
              <Controller
                control={control}
                name="reset_traffic_method"
                render={({ field }) => (
                  <Select
                    value={String(field.value)}
                    onValueChange={(v) => field.onChange(Number(v))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        ["follow_system", 0],
                        ["monthly_first", 1],
                        ["monthly_reset", 2],
                        ["no_reset", 3],
                        ["yearly_first", 4],
                        ["yearly_reset", 5],
                      ].map(([k, v]) => (
                        <SelectItem key={k} value={String(v)}>
                          {t(`subscribe.plan.form.reset_method.options.${k}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* 价格 */}
          <div className="space-y-3">
            <p className="text-sm font-medium">{t("subscribe.plan.form.price.title")}</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {priceField("month_price", "monthly", "0")}
              {priceField("quarter_price", "quarterly", "0")}
              {priceField("half_year_price", "half_yearly", "0")}
              {priceField("year_price", "yearly", "0")}
              {priceField("two_year_price", "two_yearly", "0")}
              {priceField("three_year_price", "three_yearly", "0")}
              {priceField("onetime_price", "onetime", "0")}
              {priceField("reset_price", "reset_traffic", "0")}
            </div>
          </div>

          {/* 套餐说明 */}
          <div className="space-y-1.5">
            <Label>{t("subscribe.plan.form.content.label")}</Label>
            <Textarea rows={5} {...register("content")} />
            <p className="text-xs text-muted-foreground">
              {t("subscribe.plan.form.content.description")}
            </p>
          </div>

          {/* 状态开关 */}
          <div className="grid grid-cols-3 gap-3">
            <BoolField control={control} name="show" label={t("subscribe.plan.columns.show")} />
            <BoolField control={control} name="sell" label={t("subscribe.plan.columns.sell")} />
            <BoolField control={control} name="renew" label={t("subscribe.plan.columns.renew")} />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("subscribe.plan.form.submit.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {t("subscribe.plan.form.submit.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function BoolField({
  control,
  name,
  label,
}: {
  control: any;
  name: keyof FormValues;
  label: string;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex items-center justify-between rounded-md border p-3">
          <Label className="text-sm font-normal">{label}</Label>
          <Switch checked={!!field.value} onCheckedChange={field.onChange} />
        </div>
      )}
    />
  );
}
