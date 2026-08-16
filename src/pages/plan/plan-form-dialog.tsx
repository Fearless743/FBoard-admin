import { forwardRef, useEffect, type ComponentProps, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useServerGroups } from "@/hooks/use-server-groups";
import { useForm, Controller, type Control, type FieldPath } from "react-hook-form";
import { Loader2, Eraser, CircleHelp } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { savePlan, type Plan } from "@/api/plan";
import type { ServerGroup } from "@/api/server";

const GROUP_NONE = "__none__";
/** 与后端 Plan::RESET_TRAFFIC_* 对齐：null=跟随系统，0=每月1号 … 4=按年重置 */
const RESET_FOLLOW = "__follow__";

const RESET_METHOD_OPTIONS: readonly { key: string; value: number | null }[] = [
  { key: "follow_system", value: null },
  { key: "monthly_first", value: 0 },
  { key: "monthly_reset", value: 1 },
  { key: "no_reset", value: 2 },
  { key: "yearly_first", value: 3 },
  { key: "yearly_reset", value: 4 },
] as const;

const PRICE_FIELDS: {
  key: keyof FormValues;
  period:
    | "hourly"
    | "daily"
    | "monthly"
    | "quarterly"
    | "half_yearly"
    | "yearly"
    | "two_yearly"
    | "three_yearly"
    | "onetime"
    | "reset_traffic";
}[] = [
  { key: "hour_price", period: "hourly" },
  { key: "day_price", period: "daily" },
  { key: "month_price", period: "monthly" },
  { key: "quarter_price", period: "quarterly" },
  { key: "half_year_price", period: "half_yearly" },
  { key: "year_price", period: "yearly" },
  { key: "two_year_price", period: "two_yearly" },
  { key: "three_year_price", period: "three_yearly" },
  { key: "onetime_price", period: "onetime" },
  { key: "reset_price", period: "reset_traffic" },
];

interface FormValues {
  id?: number;
  name: string;
  transfer_enable_gb: number;
  speed_limit: number | null;
  device_limit: number | null;
  capacity_limit: number | null;
  group_id: number | null;
  hour_price: number | null;
  day_price: number | null;
  month_price: number | null;
  quarter_price: number | null;
  half_year_price: number | null;
  year_price: number | null;
  two_year_price: number | null;
  three_year_price: number | null;
  onetime_price: number | null;
  reset_price: number | null;
  /** null = 跟随系统（对应后端 Plan::RESET_TRAFFIC_FOLLOW_SYSTEM） */
  reset_traffic_method: number | null;
  show: boolean;
  sell: boolean;
  renew: boolean;
  content: string;
  force_update: boolean;
}

function emptyValues(): FormValues {
  return {
    name: "",
    transfer_enable_gb: 100,
    speed_limit: null,
    device_limit: null,
    capacity_limit: null,
    group_id: null,
    hour_price: null,
    day_price: null,
    month_price: null,
    quarter_price: null,
    half_year_price: null,
    year_price: null,
    two_year_price: null,
    three_year_price: null,
    onetime_price: null,
    reset_price: null,
    reset_traffic_method: null,
    show: true,
    sell: true,
    renew: true,
    content: "",
    force_update: false,
  };
}

function toNullableNumber(v: unknown): number | null {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function cleanPrice(v: number | null | undefined): number | null {
  if (v === null || v === undefined || Number.isNaN(v)) return null;
  return Number(v);
}

/** 从 API prices 读取：null/undefined/空串 → null；0 合法（免费） */
function priceFromApi(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
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

  const { data: groupsData = [], isLoading: groupsLoading } = useServerGroups(open);
  const groups: ServerGroup[] = Array.isArray(groupsData)
    ? groupsData
    : (groupsData as { data?: ServerGroup[] } | undefined)?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: emptyValues(),
  });

  useEffect(() => {
    if (!open) return;
    const pr = plan?.prices || {};
    reset({
      id: plan?.id,
      name: plan?.name || "",
      transfer_enable_gb: plan?.transfer_enable ?? 100,
      speed_limit: plan?.speed_limit ?? null,
      device_limit: plan?.device_limit ?? null,
      capacity_limit: plan?.capacity_limit ?? null,
      group_id: plan?.group_id ?? null,
      // 价格 0 表示免费，需与 null（未设置）区分
      hour_price: priceFromApi(pr.hourly),
      day_price: priceFromApi(pr.daily),
      month_price: priceFromApi(pr.monthly),
      quarter_price: priceFromApi(pr.quarterly),
      half_year_price: priceFromApi(pr.half_yearly),
      year_price: priceFromApi(pr.yearly),
      two_year_price: priceFromApi(pr.two_yearly),
      three_year_price: priceFromApi(pr.three_yearly),
      onetime_price: priceFromApi(pr.onetime),
      reset_price: priceFromApi(pr.reset_traffic),
      // 0 是合法值（每月1号），不能用 ?? 0，否则 null（跟随系统）会被当成 0
      reset_traffic_method:
        plan == null
          ? null
          : plan.reset_traffic_method === undefined || plan.reset_traffic_method === null
            ? null
            : Number(plan.reset_traffic_method),
      show: plan ? Boolean(plan.show) : true,
      sell: plan ? Boolean(plan.sell) : true,
      renew: plan ? Boolean(plan.renew) : true,
      content: plan?.content || "",
      force_update: false,
    });
  }, [open, plan, reset]);

  const clearPrices = () => {
    for (const { key } of PRICE_FIELDS) {
      setValue(key, null, { shouldDirty: true });
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const payload: Record<string, unknown> = {
        name: values.name.trim(),
        transfer_enable: Math.round(Math.max(1, Number(values.transfer_enable_gb) || 1)),
        speed_limit: toNullableNumber(values.speed_limit),
        device_limit: toNullableNumber(values.device_limit),
        capacity_limit: toNullableNumber(values.capacity_limit),
        group_id: values.group_id ?? null,
        // null 表示跟随系统，不可用 0 替代
        reset_traffic_method:
          values.reset_traffic_method === undefined || values.reset_traffic_method === null
            ? null
            : Number(values.reset_traffic_method),
        show: values.show ? 1 : 0,
        sell: values.sell ? 1 : 0,
        renew: values.renew ? 1 : 0,
        content: values.content || "",
        prices: {
          hourly: cleanPrice(values.hour_price),
          daily: cleanPrice(values.day_price),
          monthly: cleanPrice(values.month_price),
          quarterly: cleanPrice(values.quarter_price),
          half_yearly: cleanPrice(values.half_year_price),
          yearly: cleanPrice(values.year_price),
          two_yearly: cleanPrice(values.two_year_price),
          three_yearly: cleanPrice(values.three_year_price),
          onetime: cleanPrice(values.onetime_price),
          reset_traffic: cleanPrice(values.reset_price),
        },
      };
      if (plan?.id) {
        payload.id = plan.id;
        payload.force_update = !!values.force_update;
      }
      await savePlan(payload as Partial<Plan>);
      toast.success(
        plan
          ? t("subscribe.plan.form.submit.success.update")
          : t("subscribe.plan.form.submit.success.add"),
      );
      onSaved();
      onOpenChange(false);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } }; message?: string };
      const msg = err?.response?.data?.message || err?.message || "";
      if (msg) toast.error(msg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-3 shrink-0 border-b">
          <DialogTitle>
            {plan
              ? t("subscribe.plan.form.edit_title")
              : t("subscribe.plan.form.add_title")}
          </DialogTitle>
          <DialogDescription>
            {t("subscribe.plan.page.description")}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="flex-1 min-h-0 overflow-y-auto space-y-6 px-6 py-5">
            {/* 基本信息 */}
            <FormSection title={t("subscribe.plan.form.section.basic")}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  className="sm:col-span-2"
                  label={t("subscribe.plan.form.name.label")}
                  error={
                    errors.name
                      ? t("subscribe.plan.form.name.required")
                      : undefined
                  }
                >
                  <Input
                    placeholder={t("subscribe.plan.form.name.placeholder")}
                    {...register("name", {
                      required: true,
                      validate: (v) => !!v.trim(),
                    })}
                  />
                </Field>

                <Field label={t("subscribe.plan.form.group.label")}>
                  <Controller
                    control={control}
                    name="group_id"
                    render={({ field }) => (
                      <Select
                        value={
                          field.value != null && field.value !== 0
                            ? String(field.value)
                            : GROUP_NONE
                        }
                        onValueChange={(v) =>
                          field.onChange(v === GROUP_NONE ? null : Number(v))
                        }
                        disabled={groupsLoading}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              "subscribe.plan.form.group.placeholder",
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={GROUP_NONE}>
                            {t("subscribe.plan.form.group.none")}
                          </SelectItem>
                          {groups.map((g) => (
                            <SelectItem key={g.id} value={String(g.id)}>
                              {g.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>

                <Field
                  label={t("subscribe.plan.form.reset_method.label")}
                  hint={t("subscribe.plan.form.reset_method.description")}
                >
                  <Controller
                    control={control}
                    name="reset_traffic_method"
                    render={({ field }) => (
                      <Select
                        value={
                          field.value === null || field.value === undefined
                            ? RESET_FOLLOW
                            : String(field.value)
                        }
                        onValueChange={(v) =>
                          field.onChange(
                            v === RESET_FOLLOW ? null : Number(v),
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              "subscribe.plan.form.reset_method.placeholder",
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {RESET_METHOD_OPTIONS.map(({ key, value }) => (
                            <SelectItem
                              key={key}
                              value={
                                value === null ? RESET_FOLLOW : String(value)
                              }
                            >
                              {t(
                                `subscribe.plan.form.reset_method.options.${key}`,
                              )}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
              </div>
            </FormSection>

            {/* 配额与限制 */}
            <FormSection title={t("subscribe.plan.form.section.limits")}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label={t("subscribe.plan.form.transfer.label")}
                  hint={t("subscribe.plan.form.transfer.hint")}
                >
                  <UnitInput
                    unit={t("subscribe.plan.form.transfer.unit")}
                    type="number"
                    min={1}
                    step="1"
                    placeholder={t("subscribe.plan.form.transfer.placeholder")}
                    {...register("transfer_enable_gb", {
                      valueAsNumber: true,
                      required: true,
                      min: 1,
                    })}
                  />
                </Field>

                <Field
                  label={t("subscribe.plan.form.speed.label")}
                  hint={t("subscribe.plan.form.speed.hint")}
                >
                  <UnitInput
                    unit={t("subscribe.plan.form.speed.unit")}
                    type="number"
                    min={0}
                    step="1"
                    placeholder={t("subscribe.plan.form.speed.placeholder")}
                    {...register("speed_limit", {
                      setValueAs: toNullableNumber,
                    })}
                  />
                </Field>

                <Field
                  label={t("subscribe.plan.form.device.label")}
                  hint={t("subscribe.plan.form.device.hint")}
                >
                  <UnitInput
                    unit={t("subscribe.plan.form.device.unit")}
                    type="number"
                    min={0}
                    step="1"
                    placeholder={t("subscribe.plan.form.device.placeholder")}
                    {...register("device_limit", {
                      setValueAs: toNullableNumber,
                    })}
                  />
                </Field>

                <Field
                  label={t("subscribe.plan.form.capacity.label")}
                  hint={t("subscribe.plan.form.capacity.hint")}
                >
                  <UnitInput
                    unit={t("subscribe.plan.form.capacity.unit")}
                    type="number"
                    min={0}
                    step="1"
                    placeholder={t("subscribe.plan.form.capacity.placeholder")}
                    {...register("capacity_limit", {
                      setValueAs: toNullableNumber,
                    })}
                  />
                </Field>
              </div>
            </FormSection>

            {/* 价格 */}
            <FormSection
              title={t("subscribe.plan.form.price.title")}
              action={
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 text-xs text-muted-foreground"
                  onClick={clearPrices}
                  title={t("subscribe.plan.form.price.clear.tooltip")}
                >
                  <Eraser className="h-3.5 w-3.5" />
                  {t("subscribe.plan.form.price.clear.button")}
                </Button>
              }
            >
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {PRICE_FIELDS.map(({ key, period }) => (
                  <Field
                    key={key}
                    label={t(`subscribe.plan.columns.price_period.${period}`)}
                    hint={
                      period === "onetime"
                        ? t("subscribe.plan.form.price.onetime_desc")
                        : period === "reset_traffic"
                          ? t("subscribe.plan.form.price.reset_desc")
                          : undefined
                    }
                  >
                    <UnitInput
                      unit={t("common.currency.yuan")}
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder="0.00"
                      {...register(key, { setValueAs: toNullableNumber })}
                    />
                  </Field>
                ))}
              </div>
            </FormSection>

            {/* 套餐说明 */}
            <FormSection title={t("subscribe.plan.form.section.content")}>
              <Field
                label={t("subscribe.plan.form.content.label")}
                hint={t("subscribe.plan.form.content.description")}
              >
                <Textarea
                  rows={5}
                  placeholder={t("subscribe.plan.form.content.placeholder")}
                  className="min-h-[120px] resize-y"
                  {...register("content")}
                />
              </Field>
            </FormSection>

            {/* 状态开关 */}
            <FormSection title={t("subscribe.plan.form.section.status")}>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <StatusSwitch
                  control={control}
                  name="show"
                  label={t("subscribe.plan.columns.show")}
                  description={t("subscribe.plan.form.status.show_desc")}
                />
                <StatusSwitch
                  control={control}
                  name="sell"
                  label={t("subscribe.plan.columns.sell")}
                  description={t("subscribe.plan.form.status.sell_desc")}
                />
                <StatusSwitch
                  control={control}
                  name="renew"
                  label={t("subscribe.plan.columns.renew")}
                  description={t("subscribe.plan.form.status.renew_desc")}
                />
              </div>
            </FormSection>
          </div>

          <DialogFooter className="border-t px-6 py-4 shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:space-x-0">
            {plan?.id ? (
              <Controller
                control={control}
                name="force_update"
                render={({ field }) => (
                  <div className="flex items-center gap-2 min-w-0 w-full sm:w-auto order-2 sm:order-1">
                    <Checkbox
                      id="plan-force-update"
                      checked={!!field.value}
                      onCheckedChange={(v) => field.onChange(v === true)}
                      disabled={isSubmitting}
                    />
                    <Label
                      htmlFor="plan-force-update"
                      className="text-sm font-normal cursor-pointer leading-none"
                    >
                      {t("subscribe.plan.form.force_update.label")}
                    </Label>
                    <TooltipProvider delayDuration={200}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex text-muted-foreground hover:text-foreground transition-colors"
                            aria-label={t(
                              "subscribe.plan.form.force_update.description",
                            )}
                          >
                            <CircleHelp className="h-3.5 w-3.5" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          className="max-w-xs text-xs leading-relaxed"
                        >
                          {t("subscribe.plan.form.force_update.description")}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}
              />
            ) : null}
            <div className="flex items-center justify-end gap-2 shrink-0 w-full sm:w-auto order-1 sm:order-2 sm:ml-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                {t("subscribe.plan.form.submit.cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmitting
                  ? t("subscribe.plan.form.submit.submitting")
                  : t("subscribe.plan.form.submit.submit")}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FormSection({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-medium tracking-tight">{title}</h3>
        {action}
      </div>
      <Separator />
      {children}
    </section>
  );
}

function Field({
  label,
  hint,
  error,
  className,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-sm">{label}</Label>
      {children}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

/** 必须 forwardRef，否则 register().ref 接不到真实 input，reset 后价格等数字框会显示为空 */
const UnitInput = forwardRef<
  HTMLInputElement,
  ComponentProps<typeof Input> & { unit: string }
>(({ unit, className, ...props }, ref) => (
  <div className="relative">
    <Input ref={ref} className={cn("pr-12", className)} {...props} />
    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground tabular-nums">
      {unit}
    </span>
  </div>
));
UnitInput.displayName = "UnitInput";

function StatusSwitch({
  control,
  name,
  label,
  description,
}: {
  control: Control<FormValues>;
  name: FieldPath<FormValues>;
  label: string;
  description: string;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex items-start justify-between gap-3 rounded-lg border p-3.5 bg-muted/20">
          <div className="min-w-0 space-y-0.5">
            <Label className="text-sm font-medium">{label}</Label>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
          <Switch
            className="shrink-0 mt-0.5"
            checked={!!field.value}
            onCheckedChange={field.onChange}
          />
        </div>
      )}
    />
  );
}
