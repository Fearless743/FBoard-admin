import { useEffect, useState, useCallback, useRef, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import {
  Loader2,
  Check,
  ChevronsUpDown,
  X,
  ArrowRight,
  RefreshCw,
  Settings2,
} from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  saveServer,
  fetchGroups,
  fetchProtocolTypes,
  fetchProtocolDefinitions,
  fetchMachines,
  getNodes,
  type Server,
  type ProtocolConfigField,
  type ProtocolDefinition,
} from "@/api/server";
import { useQuery } from "@tanstack/react-query";
import { gbToBytes } from "@/lib/utils";
import { AdvancedSettingsDialog } from "./advanced-settings-dialog";
import { NetworkSettingsDialog } from "./network-settings-dialog";
import { VirtualNodeList } from "./virtual-node-list";


/** 判断 Laravel 规则字符串是否含无条件 required（required_if / required_with 不算星号） */
function isUnconditionallyRequired(rule: string | string[] | undefined | null): boolean {
  if (!rule) return false;
  const s = Array.isArray(rule) ? rule.join("|") : String(rule);
  return s
    .split("|")
    .map((p) => p.trim().toLowerCase())
    .some((p) => p === "required");
}

function FormField({
  label,
  required,
  optionalText,
  hint,
  error,
  className,
  children,
}: {
  label: ReactNode;
  required?: boolean;
  optionalText?: string;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-sm">
        {label}
        {required ? <span className="ml-0.5 text-destructive">*</span> : null}
        {!required && optionalText ? (
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            {optionalText}
          </span>
        ) : null}
      </Label>
      {children}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}


interface FormValues {
  id?: number;
  name: string;
  type: string;
  host: string;
  /** 连接端口：支持单端口或范围，如 443 / 10000-40000；新建时默认空 */
  port: string | number;
  /** 服务端口为单数字；新建时默认空 */
  server_port: number | string;
  rate: number;
  traffic_limit_gb: number;
  code: string;
  group_ids: number[];
  parent_id: number | null;
  machine_id: number | null;
  show: boolean;
  banned: boolean;
  tags: string;
  protocol_settings?: Record<string, any>;
  cert_config?: Record<string, any> | null;
  custom_outbounds?: any[] | null;
  custom_routes?: any[] | null;
  route_ids?: number[];
}

export function ServerFormDialog({
  open,
  onOpenChange,
  server,
  initialMachineId,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  server: Server | null;
  initialMachineId?: number | null;
  onSaved: () => void;
}) {
  const { t } = useTranslation();

  const { data: groupsData } = useQuery({
    queryKey: ["server", "groups"],
    queryFn: fetchGroups,
    enabled: open,
  });
  const groups: Array<{ id: number; name: string }> = groupsData || [];

  const { data: protocolTypes = [] } = useQuery({
    queryKey: ["server", "protocol-types"],
    queryFn: fetchProtocolTypes,
    staleTime: 300000,
    enabled: open,
  });

  const { data: protocolDefs = [] } = useQuery({
    queryKey: ["server", "protocol-definitions"],
    queryFn: fetchProtocolDefinitions,
    staleTime: 300000,
    enabled: open,
  });

  const { data: machinesRes = { data: [] } } = useQuery({
    queryKey: ["machines"],
    queryFn: () => fetchMachines(1, 1000),
    staleTime: 300000,
    enabled: open,
  });
  const machines: any[] = (machinesRes as any)?.data || [];

  const { data: nodesData } = useQuery({
    queryKey: ["servers", "nodes"],
    queryFn: () => getNodes(),
    enabled: open,
  });
  const allNodes: any[] =
    (Array.isArray(nodesData) ? nodesData : (nodesData as any)?.data) ?? [];

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      type: "",
      host: "",
      port: "",
      server_port: "",
      rate: 1,
      traffic_limit_gb: 0,
      code: "",
      group_ids: [],
      parent_id: null,
      machine_id: null,
      show: true,
      banned: false,
      tags: "",
      cert_config: { cert_mode: "none" },
      custom_outbounds: null,
      custom_routes: null,
      route_ids: [],
    },
  });

  const selectedType = watch("type");
  const currentDef = protocolDefs.find((d) => d.type === selectedType);
  const selectedProto = protocolTypes.find((p) => p.type === selectedType);

  // New Sudoku node: auto-generate master key pair when empty
  useEffect(() => {
    if (!open || server || selectedType !== "sudoku") return;
    const pub = watch("protocol_settings.master_public_key");
    const priv = watch("protocol_settings.master_private_key");
    if (pub || priv) return;
    let cancelled = false;
    (async () => {
      try {
        const { generateSudokuKey } = await import("@/api/server");
        const res = await generateSudokuKey();
        if (cancelled) return;
        setValue("protocol_settings.master_public_key", res.master_public_key, {
          shouldDirty: true,
        });
        setValue(
          "protocol_settings.master_private_key",
          res.master_private_key,
          { shouldDirty: true },
        );
      } catch {
        // user can still click 一键生成
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, server, selectedType]);

  const [tags, setTags] = useState<string[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const addTag = useCallback(() => {
    const t = inputVal.trim().replace(/,/g, "");
    if (t && !tags.includes(t)) {
      const next = [...tags, t];
      setTags(next);
      setValue("tags", next.join(","));
    }
    setInputVal("");
  }, [inputVal, tags, setValue]);

  useEffect(() => {
    if (open) {
      const serverType = server?.type || "";
      const protocolSettings = server?.protocol_settings || {};
      const initialTags = (server?.tags || []).filter(Boolean);
      setTags(initialTags);
      setInputVal("");
      const machineId = server
        ? (server?.machine_id ?? null)
        : (initialMachineId ?? null);
      reset({
        id: server?.id,
        name: server?.name || "",
        type: serverType,
        host: server?.host || "",
        port:
          server?.port != null && String(server.port) !== ""
            ? String(server.port)
            : "",
        server_port:
          server?.server_port != null ? server.server_port : "",
        rate: server?.rate ?? 1,
        traffic_limit_gb: server?.traffic_limit
          ? Math.round((server.traffic_limit / 1024 / 1024 / 1024) * 100) / 100
          : 0,
        code: server?.code || "",
        group_ids: (server?.group_ids || []).map(Number),
        machine_id: machineId,
        parent_id: server?.parent_id ?? null,
        show: server?.show !== 0,
        banned: !!server?.banned,
        protocol_settings: protocolSettings,
        cert_config: server?.cert_config || { cert_mode: "none" },
        custom_outbounds: server?.custom_outbounds ?? null,
        custom_routes: server?.custom_routes ?? null,
        route_ids: (server?.route_ids || []).map(Number),
      });
    }
  }, [open, server, initialMachineId, reset, protocolTypes]);

  const onSubmit = async (values: FormValues) => {
    try {
      const payload: any = {
        ...values,
        traffic_limit: values.traffic_limit_gb
          ? gbToBytes(values.traffic_limit_gb)
          : 0,
        tags,
        show: values.show ? 1 : 0,
        banned: values.banned ? 1 : 0,
        cert_config: values.cert_config || { cert_mode: "none" },
        custom_outbounds: values.custom_outbounds?.length
          ? values.custom_outbounds
          : null,
        custom_routes: values.custom_routes?.length
          ? values.custom_routes
          : null,
        route_ids: values.route_ids || [],
      };
      delete payload.traffic_limit_gb;

      if (server) {
        await saveServer({ ...payload, id: server.id });
      } else {
        await saveServer(payload);
      }
      toast.success(t("server.form.success"));
      onSaved();
      onOpenChange(false);
    } catch (e: any) {
      toast.error(t("server.messages.saveFailed"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div>
              <DialogTitle>
                {server
                  ? t("server.form.edit_node")
                  : t("server.form.add_node")}
              </DialogTitle>
              <DialogDescription>
                {t("server.manage.description")}
                <span className="mt-1 block text-xs text-muted-foreground">
                  {t("server.form.required_fields_hint")}
                </span>
              </DialogDescription>
            </div>
            <div className="w-48 shrink-0 mr-10 space-y-1">
              <Controller
                control={control}
                name="type"
                rules={{ required: true }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className={cn(errors.type && "border-destructive")}
                    >
                      <SelectValue
                        placeholder={t("server.form.type.placeholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {protocolTypes.map((p) => (
                        <SelectItem key={p.type} value={p.type}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type ? (
                <p className="text-xs text-destructive">
                  {t("server.form.type.select_error")}
                </p>
              ) : (
                <p className="text-[11px] text-muted-foreground">
                  <span className="text-destructive">*</span>{" "}
                  {t("server.form.required_mark")}
                </p>
              )}
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit, () => {
            toast.error(t("server.form.required_fields_hint"));
          })}
          className="flex flex-col min-h-0 flex-1"
        >
          <div className="flex-1 min-h-0 overflow-y-auto space-y-6 px-6 py-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField
                className="sm:col-span-2"
                label={t("server.form.name.label")}
                required
                error={errors.name ? t("server.form.name.error") : undefined}
              >
                <Input
                  placeholder={t("server.form.name.placeholder")}
                  {...register("name", {
                    required: true,
                    validate: (v) => !!String(v || "").trim(),
                  })}
                />
              </FormField>

              <FormField
                label={t("server.form.code.label")}
                optionalText={t("server.form.code.optional")}
                hint={t("server.form.code.hint")}
              >
                <Input
                  placeholder={t("server.form.code.placeholder")}
                  {...register("code")}
                />
              </FormField>

              <FormField
                label={t("server.form.host.label")}
                required
                error={errors.host ? t("server.form.host.error") : undefined}
              >
                <Input
                  placeholder={t("server.form.host.placeholder")}
                  {...register("host", {
                    required: true,
                    validate: (v) => !!String(v || "").trim(),
                  })}
                />
              </FormField>

              <FormField
                label={t("server.form.rate.label")}
                required
                hint={t("server.form.rate.hint")}
                error={
                  errors.rate
                    ? errors.rate.type === "min"
                      ? t("server.form.rate.error_gte_zero")
                      : t("server.form.rate.error")
                    : undefined
                }
              >
                <Input
                  type="number"
                  step="0.01"
                  className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  {...register("rate", {
                    required: true,
                    valueAsNumber: true,
                    min: 0,
                    validate: (v) => Number.isFinite(v),
                  })}
                />
              </FormField>

              <FormField
                label={`${t("server.form.port.label")} / ${t("server.form.server_port.label")}`}
                required
                hint={t("server.form.port.tooltip")}
                error={
                  errors.port || errors.server_port
                    ? errors.port
                      ? t("server.form.port.error")
                      : t("server.form.server_port.error")
                    : undefined
                }
              >
                <div className="flex items-center gap-1.5">
                  <div className="flex-1">
                    <Input
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder={t("server.form.port.placeholder")}
                      aria-label={t("server.form.port.label")}
                      className={cn(errors.port && "border-destructive")}
                      {...register("port", {
                        required: true,
                        setValueAs: (v) =>
                          typeof v === "string" ? v.trim() : v,
                        validate: (v) => {
                          const s = String(v ?? "").trim();
                          if (!s) return false;
                          // 单端口或范围
                          return /^\d+$/.test(s) || /^\d+\s*-\s*\d+$/.test(s);
                        },
                      })}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0 p-0 text-muted-foreground hover:text-foreground"
                    title={t("server.form.port.sync")}
                    onClick={() => {
                      const p = String(watch("port") ?? "").trim();
                      if (/^\d+$/.test(p)) {
                        setValue("server_port", Number(p), {
                          shouldValidate: true,
                        });
                      }
                    }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <div className="flex-1">
                    <Label className="sr-only">
                      {t("server.form.server_port.label")}
                    </Label>
                    <Input
                      type="number"
                      className={cn(
                        "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
                        errors.server_port && "border-destructive",
                      )}
                      placeholder={t("server.form.server_port.placeholder")}
                      title={t("server.form.server_port.tooltip")}
                      aria-label={t("server.form.server_port.label")}
                      {...register("server_port", {
                        required: true,
                        setValueAs: (v) => {
                          if (v === "" || v === null || v === undefined)
                            return "";
                          const n = Number(v);
                          return Number.isFinite(n) ? n : "";
                        },
                        validate: (v) => {
                          if (v === "" || v === null || v === undefined)
                            return false;
                          const n = Number(v);
                          return Number.isFinite(n) && n > 0;
                        },
                      })}
                    />
                  </div>
                </div>
              </FormField>

              <FormField
                label={`${t("server.form.traffic_limit.label")} (${t("server.form.traffic_limit_unit")})`}
                optionalText={t("server.form.optional_mark")}
                hint={t("server.form.traffic_limit.hint")}
              >
                <Input
                  type="number"
                  step="0.01"
                  className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  placeholder={t("server.form.traffic_limit.placeholder")}
                  {...register("traffic_limit_gb", { valueAsNumber: true })}
                />
              </FormField>

              <FormField
                className="sm:col-span-2"
                label={t("server.form.machine.label")}
                optionalText={t("server.form.optional_mark")}
                hint={t("server.form.machine.hint")}
              >
                <Controller
                  control={control}
                  name="machine_id"
                  render={({ field }) => (
                    <Select
                      value={String(field.value ?? "")}
                      onValueChange={(v) =>
                        field.onChange(v ? Number(v) : null)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("server.form.machine.placeholder")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">
                          {t("server.form.machine.none")}
                        </SelectItem>
                        {(machines as any[]).map((m) => (
                          <SelectItem key={m.id} value={String(m.id)}>
                            <span className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "size-2 rounded-full shrink-0",
                                  m.is_active
                                    ? "bg-emerald-500"
                                    : "bg-muted-foreground",
                                )}
                              />
                              {m.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              <FormField
                className="sm:col-span-2"
                label={t("server.form.parent.label")}
                optionalText={t("server.form.optional_mark")}
                hint={t("server.form.parent.hint")}
              >
                <Controller
                  control={control}
                  name="parent_id"
                  render={({ field }) => (
                    <Select
                      value={String(field.value ?? "")}
                      onValueChange={(v) =>
                        field.onChange(v ? Number(v) : null)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("server.form.parent.placeholder")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">
                          {t("server.form.parent.none")}
                        </SelectItem>
                        {allNodes
                          .filter(
                            (n: any) =>
                              n.id !== server?.id &&
                              n.type === watch("type") &&
                              !n.parent_id,
                          )
                          .map((n: any) => (
                            <SelectItem key={n.id} value={String(n.id)}>
                              {n.name} (#{n.id})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              {server?.id ? (
                <VirtualNodeList
                  parentId={server.id}
                  parentGroupIds={(watch("group_ids") || []).map(Number)}
                  enabled={open}
                />
              ) : null}

              <FormField
                className="sm:col-span-2"
                label={t("server.form.tags.label")}
                optionalText={t("server.form.tags.optional")}
                hint={t("server.form.tags.hint")}
              >
                <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent px-3 py-1.5 text-sm focus-within:ring-1 focus-within:ring-ring">
                  {tags.map((tag, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium"
                    >
                      {tag}
                      <button
                        type="button"
                        className="hover:text-destructive"
                        onClick={() => setTags(tags.filter((_, j) => j !== i))}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    className="min-w-[80px] flex-1 border-0 bg-transparent p-0 text-sm outline-none placeholder:text-muted-foreground"
                    placeholder={t("server.form.tags.placeholder")}
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        addTag();
                      }
                      if (e.key === "Backspace" && !inputVal && tags.length) {
                        setTags(tags.slice(0, -1));
                      }
                    }}
                    onBlur={() => addTag()}
                  />
                </div>
              </FormField>

              <FormField
                className="sm:col-span-2"
                label={t("server.form.groups.label")}
                optionalText={t("server.form.optional_mark")}
                hint={t("server.form.groups.hint")}
              >
                <Controller
                  control={control}
                  name="group_ids"
                  render={({ field }) => (
                    <div className="flex flex-wrap gap-2 rounded-md border p-2">
                      {groups.length === 0 && (
                        <span className="text-xs text-muted-foreground">
                          {t("server.form.groups.empty")}
                        </span>
                      )}
                      {groups.map((g) => {
                        const active = field.value.includes(g.id);
                        return (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() =>
                              field.onChange(
                                active
                                  ? field.value.filter((x) => x !== g.id)
                                  : [...field.value, g.id],
                              )
                            }
                            className={
                              "rounded-md border px-2.5 py-1 text-xs transition-colors " +
                              (active
                                ? "border-primary bg-primary text-primary-foreground"
                                : "hover:bg-accent")
                            }
                          >
                            {g.name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
              </FormField>
            </div>

            {selectedType && (
              <div className="space-y-3 rounded-lg border bg-card p-4">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-medium">
                    {t("server.form.protocolSection")}
                  </h4>
                  <span className="text-[11px] text-muted-foreground">
                    <span className="text-destructive">*</span>{" "}
                    {t("server.form.required_mark")}
                  </span>
                </div>
                {currentDef ? (
                  <ProtocolConfigFields
                    fields={currentDef?.config_fields || {}}
                    prefix=""
                    register={register}
                    control={control}
                    watch={watch}
                    setValue={setValue}
                    errors={errors}
                    validationRules={currentDef?.validation_rules || {}}
                  />
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {t("server.form.type.configHint")}
                  </p>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 border-t px-6 py-4 shrink-0">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setAdvancedOpen(true)}
            >
              <Settings2 className="h-4 w-4" />
              {t("server.dynamic_form.advanced.trigger_label")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("server.form.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {t("server.form.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

      <AdvancedSettingsDialog
        open={advancedOpen}
        onOpenChange={setAdvancedOpen}
        watch={watch}
        setValue={setValue}
      />
    </Dialog>
  );
}

function ProtocolConfigFields({
  fields,
  prefix,
  register,
  control,
  watch,
  setValue,
  errors,
  validationRules,
}: {
  fields: Record<string, ProtocolConfigField>;
  prefix: string;
  register: any;
  control: any;
  watch: any;
  setValue: any;
  errors?: any;
  validationRules?: Record<string, string | string[]>;
}) {
  const { t } = useTranslation();
  const [networkSettingsOpen, setNetworkSettingsOpen] = useState(false);
  const hasNetworkSettingsField =
    !prefix && Object.prototype.hasOwnProperty.call(fields, "network_settings");
  const rules = validationRules || {};

  const ruleFor = (fieldPath: string) => rules[fieldPath];
  const requiredFor = (fieldPath: string) =>
    isUnconditionallyRequired(ruleFor(fieldPath));
  const errorFor = (fieldPath: string): string | undefined => {
    // errors.protocol_settings.a.b
    const parts = ("protocol_settings." + fieldPath).split(".");
    let cur: any = errors;
    for (const p of parts) {
      if (!cur) return undefined;
      cur = cur[p];
    }
    return cur ? t("server.form.required_mark") : undefined;
  };

  const pluginHints: Record<string, string> = {
    "simple-obfs": t("server.dynamic_form.shadowsocks.plugin.obfs_hint"),
    "v2ray-plugin": t("server.dynamic_form.shadowsocks.plugin.v2ray_hint"),
    "gost-plugin": t("server.dynamic_form.shadowsocks.plugin.gost_hint"),
    "shadow-tls": t("server.dynamic_form.shadowsocks.plugin.shadow_tls_hint"),
    restls: t("server.dynamic_form.shadowsocks.plugin.restls_hint"),
    kcptun: t("server.dynamic_form.shadowsocks.plugin.kcptun_hint"),
  };

  return (
    <div className="space-y-3">
      {Object.entries(fields).map(([key, field]) => {
        // network_settings 改由「传输协议」旁的文字按钮弹窗编辑
        if (key === "network_settings" && !prefix) {
          return null;
        }

        const fieldPath = prefix ? `${prefix}.${key}` : key;
        const fieldName = field.label || key;
        let desc = field.description;

        if (key === "plugin_opts" && !prefix) {
          const selectedPlugin = watch("protocol_settings.plugin");
          desc =
            selectedPlugin && pluginHints[selectedPlugin]
              ? pluginHints[selectedPlugin]
              : "";
        }

        if (field.show_when) {
          const shouldShow = Object.entries(field.show_when).every(
            ([dep, val]) => {
              const depPath = `protocol_settings.${prefix ? `${prefix}.${dep}` : dep}`;
              return String(watch(depPath)) === String(val);
            },
          );
          if (!shouldShow) return null;
        }

        if (
          key === "plugin_opts" &&
          !prefix &&
          !watch("protocol_settings.plugin")
        ) {
          return null;
        }

        if (field.type === "object" && field.fields) {
          return (
            <div key={key} className="space-y-2 rounded-md border p-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">{fieldName}</Label>
              </div>
              {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
              <ProtocolConfigFields
                fields={field.fields}
                prefix={fieldPath}
                register={register}
                control={control}
                watch={watch}
                setValue={setValue}
                errors={errors}
                validationRules={validationRules}
              />
            </div>
          );
        }

        if (field.type === "boolean") {
          return (
            <div
              key={key}
              className="flex items-center justify-between rounded-md border p-3"
            >
              <div>
                <Label className="text-sm font-normal">{fieldName}</Label>
                {desc && (
                  <p className="text-xs text-muted-foreground">{desc}</p>
                )}
              </div>
              <Controller
                control={control}
                name={`protocol_settings.${fieldPath}`}
                render={({ field: controllerField }) => (
                  <Switch
                    checked={!!controllerField.value}
                    onCheckedChange={controllerField.onChange}
                  />
                )}
              />
            </div>
          );
        }

        if (field.options) {
          // uTLS 元选项 random / randomized 使用 i18n 文案，其它指纹沿用后端 label
          const entries = Object.entries(field.options).map(
            ([value, label]): [string, string] => {
              if (key === "fingerprint" && (value === "random" || value === "randomized")) {
                const i18nKey = `server.dynamic_form.utls.fingerprint.${value}`;
                const translated = t(i18nKey);
                return [value, translated !== i18nKey ? translated : label];
              }
              return [value, label];
            },
          );
          const isMulti = field.type === "array";
          if (isMulti) {
            return (
              <div key={key} className="space-y-1.5">
                <Label>
                  {fieldName}
                  {requiredFor(fieldPath) ? (
                    <span className="ml-0.5 text-destructive">*</span>
                  ) : null}
                </Label>
                {desc && (
                  <p className="text-xs text-muted-foreground">{desc}</p>
                )}
                <Controller
                  control={control}
                  name={`protocol_settings.${fieldPath}`}
                  rules={
                    requiredFor(fieldPath)
                      ? {
                          validate: (v) =>
                            Array.isArray(v) ? v.length > 0 : !!v,
                        }
                      : undefined
                  }
                  render={({ field: controllerField }) => {
                    const selected = Array.isArray(controllerField.value)
                      ? controllerField.value
                      : [];
                    return (
                      <MultiSelect
                        options={entries}
                        selected={selected}
                        onChange={(vals) => controllerField.onChange(vals)}
                        placeholder={field.placeholder || t("common.selectField", { name: fieldName })}
                      />
                    );
                  }}
                />
                {errorFor(fieldPath) ? (
                  <p className="text-xs text-destructive">{errorFor(fieldPath)}</p>
                ) : null}
              </div>
            );
          }

          // 传输协议：旁挂「网络设置」文字按钮，弹窗编辑 network_settings
          const showNetworkSettingsBtn =
            key === "network" && !prefix && hasNetworkSettingsField;

          return (
            <div key={key} className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <Label>
                  {fieldName}
                  {requiredFor(fieldPath) ? (
                    <span className="ml-0.5 text-destructive">*</span>
                  ) : null}
                </Label>
                {showNetworkSettingsBtn && (
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-xs"
                    onClick={() => setNetworkSettingsOpen(true)}
                  >
                    {t("server.network_settings.edit_protocol_config")}
                  </Button>
                )}
              </div>
              {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
              <Controller
                control={control}
                name={`protocol_settings.${fieldPath}`}
                rules={
                  requiredFor(fieldPath)
                    ? {
                        validate: (v) =>
                          v !== undefined && v !== null && String(v) !== "",
                      }
                    : undefined
                }
                render={({ field: controllerField }) => (
                  <Select
                    value={String(controllerField.value ?? "")}
                    onValueChange={controllerField.onChange}
                  >
                    <SelectTrigger
                      className={cn(
                        errorFor(fieldPath) && "border-destructive",
                      )}
                    >
                      <SelectValue
                        placeholder={field.placeholder || t("common.selectField", { name: fieldName })}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {entries.map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errorFor(fieldPath) ? (
                <p className="text-xs text-destructive">{errorFor(fieldPath)}</p>
              ) : null}
            </div>
          );
        }

        if (field.type === "integer" || field.type === "number") {
          return (
            <div key={key} className="space-y-1.5">
              <Label>
                {fieldName}
                {requiredFor(fieldPath) ? (
                  <span className="ml-0.5 text-destructive">*</span>
                ) : null}
              </Label>
              {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
              <Input
                type="number"
                placeholder={field.placeholder || t("common.inputField", { name: fieldName })}
                {...register(`protocol_settings.${fieldPath}`, {
                  valueAsNumber: true,
                  ...(requiredFor(fieldPath)
                    ? {
                        required: true,
                        validate: (v: any) =>
                          v !== "" && v !== null && v !== undefined && !Number.isNaN(v),
                      }
                    : {}),
                })}
              />
              {errorFor(fieldPath) ? (
                <p className="text-xs text-destructive">{errorFor(fieldPath)}</p>
              ) : null}
            </div>
          );
        }

        if (field.type === "array" || field.type === "object") {
          return (
            <div key={key} className="space-y-1.5">
              <Label>{fieldName}</Label>
              {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
              <Controller
                control={control}
                name={`protocol_settings.${fieldPath}`}
                render={({ field: controllerField }) => (
                  <textarea
                    className="flex w-full min-h-[60px] rounded-md border border-input bg-transparent px-3 py-2 text-xs font-mono"
                    value={
                      controllerField.value
                        ? JSON.stringify(controllerField.value, null, 2)
                        : ""
                    }
                    onChange={(e) => {
                      try {
                        controllerField.onChange(JSON.parse(e.target.value));
                      } catch {
                        controllerField.onChange(e.target.value);
                      }
                    }}
                  />
                )}
              />
            </div>
          );
        }

        if (key === "public_key" && prefix === "reality_settings") {
          return (
            <div key={key} className="space-y-1.5">
              <Label>
                {fieldName}
                {requiredFor(fieldPath) ? (
                  <span className="ml-0.5 text-destructive">*</span>
                ) : null}
              </Label>
              {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
              <div className="relative">
                <Input
                  placeholder={field.placeholder || t("common.inputField", { name: fieldName })}
                  className="pr-10"
                  {...register(`protocol_settings.${fieldPath}`, {
                    ...(requiredFor(fieldPath)
                      ? {
                          required: true,
                          validate: (v: any) =>
                            !!String(v ?? "").trim(),
                        }
                      : {}),
                  })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full w-9 text-muted-foreground hover:text-foreground"
                  title={t("server.form.virtualNode.generateKeyPair")}
                  onClick={async () => {
                    try {
                      const { generateRealityKey } =
                        await import("@/api/server");
                      const res = await generateRealityKey();
                      setValue(
                        `protocol_settings.reality_settings.public_key`,
                        res.public_key,
                        { shouldValidate: true, shouldDirty: true },
                      );
                      setValue(
                        `protocol_settings.reality_settings.private_key`,
                        res.private_key,
                        { shouldValidate: true, shouldDirty: true },
                      );
                    } catch (e) {}
                  }}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              {errorFor(fieldPath) ? (
                <p className="text-xs text-destructive">{errorFor(fieldPath)}</p>
              ) : null}
            </div>
          );
        }

        // Sudoku master keys: render once as a combined "one-click generate" block
        if (
          !prefix &&
          (key === "master_public_key" || key === "master_private_key") &&
          Object.prototype.hasOwnProperty.call(fields, "master_public_key") &&
          Object.prototype.hasOwnProperty.call(fields, "master_private_key")
        ) {
          if (key === "master_private_key") {
            return null; // rendered with public key block
          }
          return (
            <div
              key="sudoku-master-keys"
              className="space-y-3 rounded-md border p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <Label className="text-sm font-medium">
                    {t("server.dynamic_form.sudoku.keyPairTitle")}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {t("server.dynamic_form.sudoku.keyPairDescription")}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  className="shrink-0"
                  onClick={async () => {
                    try {
                      const { generateSudokuKey } =
                        await import("@/api/server");
                      const res = await generateSudokuKey();
                      setValue(
                        "protocol_settings.master_public_key",
                        res.master_public_key,
                        { shouldDirty: true },
                      );
                      setValue(
                        "protocol_settings.master_private_key",
                        res.master_private_key,
                        { shouldDirty: true },
                      );
                      toast.success(t("server.dynamic_form.sudoku.generateSuccess"));
                    } catch (e) {
                      toast.error(t("server.dynamic_form.sudoku.generateFailed"));
                    }
                  }}
                >
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                  {t("server.dynamic_form.sudoku.generate")}
                </Button>
              </div>
              <div className="space-y-1.5">
                <Label>
                  Master Public Key
                  {requiredFor("master_public_key") ? (
                    <span className="ml-0.5 text-destructive">*</span>
                  ) : null}
                </Label>
                <Input
                  placeholder={t("server.dynamic_form.sudoku.publicPlaceholder")}
                  className="font-mono text-xs"
                  {...register("protocol_settings.master_public_key", {
                    ...(requiredFor("master_public_key")
                      ? {
                          required: true,
                          validate: (v: any) => !!String(v ?? "").trim(),
                        }
                      : {}),
                  })}
                />
                {errorFor("master_public_key") ? (
                  <p className="text-xs text-destructive">
                    {errorFor("master_public_key")}
                  </p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label>
                  Master Private Key
                  {requiredFor("master_private_key") ? (
                    <span className="ml-0.5 text-destructive">*</span>
                  ) : null}
                </Label>
                <Input
                  placeholder={t("server.dynamic_form.sudoku.privatePlaceholder")}
                  className="font-mono text-xs"
                  {...register("protocol_settings.master_private_key", {
                    ...(requiredFor("master_private_key")
                      ? {
                          required: true,
                          validate: (v: any) => !!String(v ?? "").trim(),
                        }
                      : {}),
                  })}
                />
                {errorFor("master_private_key") ? (
                  <p className="text-xs text-destructive">
                    {errorFor("master_private_key")}
                  </p>
                ) : null}
              </div>
            </div>
          );
        }

        return (
          <div key={key} className="space-y-1.5">
            <Label>
              {fieldName}
              {requiredFor(fieldPath) ? (
                <span className="ml-0.5 text-destructive">*</span>
              ) : null}
            </Label>
            {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
            <Input
              placeholder={field.placeholder || t("common.inputField", { name: fieldName })}
              {...register(`protocol_settings.${fieldPath}`, {
                ...(requiredFor(fieldPath)
                  ? {
                      required: true,
                      validate: (v: any) =>
                        v !== undefined && v !== null && String(v).trim() !== "",
                    }
                  : {}),
              })}
            />
            {errorFor(fieldPath) ? (
              <p className="text-xs text-destructive">{errorFor(fieldPath)}</p>
            ) : null}
          </div>
        );
      })}

      {hasNetworkSettingsField && (
        <NetworkSettingsDialog
          open={networkSettingsOpen}
          onOpenChange={setNetworkSettingsOpen}
          network={watch("protocol_settings.network")}
          value={watch("protocol_settings.network_settings")}
          onConfirm={(next) =>
            setValue("protocol_settings.network_settings", next, {
              shouldDirty: true,
            })
          }
        />
      )}
    </div>
  );
}

function MultiSelect({
  options,
  selected,
  onChange,
  placeholder,
}: {
  options: [string, string][];
  selected: string[];
  onChange: (vals: string[]) => void;
  placeholder: string;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const toggle = useCallback(
    (value: string) => {
      onChange(
        selected.includes(value)
          ? selected.filter((v) => v !== value)
          : [...selected, value],
      );
    },
    [selected, onChange],
  );

  const remove = useCallback(
    (value: string) => {
      onChange(selected.filter((v) => v !== value));
    },
    [selected, onChange],
  );

  return (
    <div className="space-y-1.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-auto min-h-10 w-full justify-between"
          >
            <div className="flex flex-wrap gap-1">
              {selected.length === 0 && (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
              {selected.map((v) => {
                const label = options.find(([k]) => k === v)?.[1] || v;
                return (
                  <Badge
                    key={v}
                    variant="secondary"
                    className="gap-1 pr-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(v);
                    }}
                  >
                    {label}
                    <X className="h-3 w-3" />
                  </Badge>
                );
              })}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput placeholder={t("common.search")} />
            <CommandList>
              <CommandEmpty>{t("common.noMatch")}</CommandEmpty>
              <CommandGroup>
                {options.map(([value, label]) => {
                  const isSelected = selected.includes(value);
                  return (
                    <CommandItem
                      key={value}
                      value={value}
                      onSelect={() => toggle(value)}
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50",
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                      {label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
