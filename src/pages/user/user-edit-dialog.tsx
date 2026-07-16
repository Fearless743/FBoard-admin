import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Ban, ShieldCheck } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { usePlanOptions } from "@/hooks/use-plans";
import { updateUser, type UserListItem } from "@/api/user";

export interface UserEditDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  user: UserListItem | null;
  onSaved: () => void;
}

interface FormValues {
  id: number;
  email: string;
  password: string;
  balance: number;
  commission_balance: number;
  transfer_enable: number; // bytes
  u: number;
  d: number;
  expired_at: string; // ISO datetime-local
  plan_id: number | null;
  banned: boolean;
  is_admin: boolean;
  is_staff: boolean;
  commission_type: number;
  commission_rate: number | null;
  discount: number | null;
  speed_limit: number | null;
  device_limit: number | null;
  remarks: string;
}

export function UserEditDialog({ open, onOpenChange, user, onSaved }: UserEditDialogProps) {
  const { t } = useTranslation();
  const { data: plans } = usePlanOptions();
  const GB = 1073741824;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: emptyValues(),
  });

  useEffect(() => {
    if (user) {
      reset({
        id: user.id,
        email: user.email || "",
        password: "",
        balance: user.balance ?? 0,
        commission_balance: user.commission_balance ?? 0,
        transfer_enable: Math.round(((user.transfer_enable ?? 0) / GB) * 100) / 100,
        u: Math.round(((user.u ?? 0) / GB) * 100) / 100,
        d: Math.round(((user.d ?? 0) / GB) * 100) / 100,
        expired_at: user.expired_at
          ? toLocalInput(user.expired_at)
          : "",
        plan_id: user.plan_id ?? null,
        banned: !!user.banned,
        is_admin: !!user.is_admin,
        is_staff: !!user.is_staff,
        commission_type: user.commission_type ?? 0,
        commission_rate: user.commission_rate ?? null,
        discount: user.discount ?? null,
        speed_limit: user.speed_limit ?? null,
        device_limit: user.device_limit ?? null,
        remarks: user.remark || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      const payload: any = {
        ...values,
        password: values.password || undefined,
        transfer_enable: Math.round(Number(values.transfer_enable) * GB),
        balance: Number(values.balance),
        commission_balance: Number(values.commission_balance),
        u: Math.round(Number(values.u) * GB),
        d: Math.round(Number(values.d) * GB),
        expired_at: values.expired_at
          ? Math.floor(new Date(values.expired_at).getTime() / 1000)
          : null,
      };
      if (payload.password === undefined) delete payload.password;
      await updateUser(payload);
      toast.success(t("user.edit.form.success"));
      onSaved();
      onOpenChange(false);
    } catch (e: any) {
      // 错误已由 axios 拦截器统一 toast
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
          <DialogTitle>{t("user.edit.button")}</DialogTitle>
          <DialogDescription>{t("user.edit.title")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto space-y-4 px-6 py-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label={t("user.edit.form.email")} error={errors.email?.message}>
              <Input type="email" {...register("email")} />
            </Field>
            <Field label={t("user.edit.form.password")}>
              <Input
                type="password"
                placeholder={t("user.edit.form.password_placeholder")}
                {...register("password", { minLength: 8 })}
              />
            </Field>
            <Field label={t("user.edit.form.balance")}>
              <Input type="number" {...register("balance", { valueAsNumber: true })} />
            </Field>
            <Field label={t("user.edit.form.commission_balance")}>
              <Input type="number" {...register("commission_balance", { valueAsNumber: true })} />
            </Field>
            <Field label={t("user.edit.form.total_traffic") + " (GB)"}>
              <Input
                type="number"
                step="0.01"
                {...register("transfer_enable", { valueAsNumber: true })}
              />
            </Field>
            <Field label={t("user.edit.form.expire_time")}>
              <Input type="datetime-local" {...register("expired_at")} />
            </Field>
            <Field label={t("user.edit.form.subscription")}>
              <Controller
                control={control}
                name="plan_id"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : "none"}
                    onValueChange={(v) => field.onChange(v === "none" ? null : Number(v))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("user.edit.form.subscription_none")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">{t("user.edit.form.subscription_none")}</SelectItem>
                      {(plans || []).map((p) => (
                        <SelectItem key={p.id} value={String(p.id)}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
            <Field label={t("user.edit.form.commission_type")}>
              <Controller
                control={control}
                name="commission_type"
                render={({ field }) => (
                  <Select value={String(field.value)} onValueChange={(v) => field.onChange(Number(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">{t("user.edit.form.commission_type_system")}</SelectItem>
                      <SelectItem value="1">{t("user.edit.form.commission_type_cycle")}</SelectItem>
                      <SelectItem value="2">{t("user.edit.form.commission_type_onetime")}</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
            <Field label={t("user.edit.form.commission_rate")}>
              <Input
                type="number"
                min={0}
                max={100}
                placeholder={t("user.edit.form.commission_rate_placeholder")}
                {...register("commission_rate", { valueAsNumber: true })}
              />
            </Field>
            <Field label={t("user.edit.form.discount")}>
              <Input
                type="number"
                min={0}
                max={100}
                placeholder={t("user.edit.form.discount_placeholder")}
                {...register("discount", { valueAsNumber: true })}
              />
            </Field>
            <Field label={t("user.edit.form.speed_limit")}>
              <Input
                type="number"
                placeholder={t("user.edit.form.speed_limit_placeholder")}
                {...register("speed_limit", { valueAsNumber: true })}
              />
            </Field>
            <Field label={t("user.edit.form.device_limit")}>
              <Input
                type="number"
                placeholder={t("user.edit.form.device_limit_placeholder")}
                {...register("device_limit", { valueAsNumber: true })}
              />
            </Field>
            <Field label={t("user.edit.form.upload") + " (GB)"}>
              <Input type="number" step="0.01" {...register("u", { valueAsNumber: true })} />
            </Field>
            <Field label={t("user.edit.form.download") + " (GB)"}>
              <Input type="number" step="0.01" {...register("d", { valueAsNumber: true })} />
            </Field>
          </div>

          <div className="space-y-2">
            <Label>{t("user.edit.form.remarks")}</Label>
            <Textarea
              rows={3}
              placeholder={t("user.edit.form.remarks_placeholder")}
              {...register("remarks")}
            />
          </div>

          <BanField
            control={control}
            name="banned"
            label={t("user.edit.form.account_status")}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <BoolField control={control} name="is_admin" label={t("user.edit.form.is_admin")} />
            <BoolField control={control} name="is_staff" label={t("user.edit.form.is_staff")} />
          </div>
          </div>

          <DialogFooter className="gap-2 border-t px-6 py-4 shrink-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("user.edit.form.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {t("user.edit.form.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function BanField({
  control,
  name,
  label,
}: {
  control: any;
  name: keyof FormValues;
  label: string;
}) {
  const { t } = useTranslation();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const banned = !!field.value;
        return (
          <div
            className={cn(
              "rounded-lg border-2 p-4 transition-colors",
              banned
                ? "border-destructive/40 bg-destructive/5"
                : "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/20",
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {banned ? (
                  <Ban className="h-5 w-5 text-destructive" />
                ) : (
                  <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                )}
                <div>
                  <Label
                    className={cn(
                      "text-sm font-semibold",
                      banned ? "text-destructive" : "text-emerald-700 dark:text-emerald-300",
                    )}
                  >
                    {label}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {banned
                      ? t("user.edit.form.banned_hint")
                      : t("user.edit.form.normal_hint")}
                  </p>
                </div>
              </div>
              <Switch
                checked={banned}
                onCheckedChange={field.onChange}
                className={cn(
                  banned && "bg-destructive data-[state=checked]:bg-destructive",
                )}
              />
            </div>
          </div>
        );
      }}
    />
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

function emptyValues(): FormValues {
  return {
    id: 0,
    email: "",
    password: "",
    balance: 0,
    commission_balance: 0,
    transfer_enable: 0,
    u: 0,
    d: 0,
    expired_at: "",
    plan_id: null,
    banned: false,
    is_admin: false,
    is_staff: false,
    commission_type: 0,
    commission_rate: null,
    discount: null,
    speed_limit: null,
    device_limit: null,
    remarks: "",
  };
}

function toLocalInput(unix: number): string {
  const d = new Date(unix * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
