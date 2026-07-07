import { useEffect, useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { Loader2, Check, ChevronsUpDown, X } from "lucide-react";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import { saveServer, updateServer, fetchGroups, fetchProtocolTypes, fetchProtocolDefinitions, type Server, type ProtocolType, type ProtocolConfigField, type ProtocolDefinition } from "@/api/server";
import { useQuery } from "@tanstack/react-query";
import { gbToBytes } from "@/lib/utils";

interface FormValues {
  id?: number;
  name: string;
  type: string;
  host: string;
  port: number;
  server_port: number;
  listen_address: string;
  rate: number;
  traffic_limit_gb: number;
  code: string;
  group_ids: number[];
  show: boolean;
  banned: boolean;
  tags: string;
  protocol_settings?: Record<string, any>;
}

export function ServerFormDialog({
  open,
  onOpenChange,
  server,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  server: Server | null;
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

  const { register, handleSubmit, reset, control, watch, formState: { errors, isSubmitting } } =
    useForm<FormValues>({
      defaultValues: {
        name: "",
        type: "",
        host: "",
        port: 443,
        server_port: 443,
        listen_address: "",
        rate: 1,
        traffic_limit_gb: 0,
        code: "",
        group_ids: [],
        show: true,
        banned: false,
        tags: "",
      },
    });

  const selectedType = watch("type");
  const currentDef = protocolDefs.find((d) => d.type === selectedType);
  const selectedProto = protocolTypes.find((p) => p.type === selectedType);

  useEffect(() => {
    if (open) {
      const serverType = server?.type || "";
      const protocolSettings = server?.protocol_settings || {};
      reset({
        id: server?.id,
        name: server?.name || "",
        type: serverType,
        host: server?.host || "",
        port: server?.port || 443,
        server_port: server?.server_port ?? server?.port ?? 443,
        listen_address: server?.listen_address || "",
        rate: server?.rate ?? 1,
        traffic_limit_gb: server?.traffic_limit ? Math.round((server.traffic_limit / 1024 / 1024 / 1024) * 100) / 100 : 0,
        code: server?.code || "",
        group_ids: server?.group_ids || [],
        show: server?.show !== 0,
        banned: !!server?.banned,
        tags: (server?.tags || []).join(","),
        protocol_settings: protocolSettings,
      });
    }
  }, [open, server, reset, protocolTypes]);

  const onSubmit = async (values: FormValues) => {
    try {
      const payload: any = {
        ...values,
        traffic_limit: values.traffic_limit_gb ? gbToBytes(values.traffic_limit_gb) : 0,
        tags: values.tags
          ? values.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
          : [],
        show: values.show ? 1 : 0,
        banned: values.banned ? 1 : 0,
      };
      delete payload.traffic_limit_gb;

      if (server) {
        await updateServer({ ...payload, id: server.id });
      } else {
        await saveServer(payload);
      }
      toast.success(t("server.form.success"));
      onSaved();
      onOpenChange(false);
    } catch (e) {}
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {server ? t("server.form.edit_node") : t("server.form.add_node")}
          </DialogTitle>
          <DialogDescription>{t("server.manage.description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">{t("common.save")}</TabsTrigger>
              <TabsTrigger value="protocol">协议配置</TabsTrigger>
              <TabsTrigger value="advance">高级</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>{t("server.form.name.label")}</Label>
                  <Input {...register("name", { required: true })} />
                </div>
                <div className="space-y-1.5">
                  <Label>{t("server.form.type.placeholder")}</Label>
                  <Controller
                    control={control}
                    name="type"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择协议类型" />
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
                </div>
                <div className="space-y-1.5">
                  <Label>{t("server.form.code.label")}</Label>
                  <Input placeholder={t("server.form.code.placeholder")} {...register("code")} />
                </div>
                <div className="space-y-1.5">
                  <Label>{t("server.form.host.label")}</Label>
                  <Input {...register("host", { required: true })} />
                </div>
                <div className="space-y-1.5">
                  <Label>{t("server.form.port.label")}</Label>
                  <Input
                    type="number"
                    {...register("port", { required: true, valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{t("server.form.server_port.label")}</Label>
                  <Input
                    type="number"
                    {...register("server_port", { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{t("server.form.rate.label")}</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register("rate", { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{t("server.form.traffic_limit.label")} (GB, 0=不限制)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register("traffic_limit_gb", { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>{t("server.form.listen_address.label")}</Label>
                  <Input
                    placeholder={t("server.form.listen_address.placeholder")}
                    {...register("listen_address")}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>{t("server.form.tags.label")}</Label>
                  <Input placeholder="tag1, tag2, ..." {...register("tags")} />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>{t("server.form.groups.label")}</Label>
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
                                    : [...field.value, g.id]
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
                </div>
              </div>
            </TabsContent>

            <TabsContent value="protocol" className="space-y-3">
              {currentDef ? (
                <ProtocolConfigFields
                  fields={currentDef.config_fields}
                  prefix=""
                  register={register}
                  control={control}
                  watch={watch}
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {selectedProto
                    ? `所选协议 (${selectedProto.name}) 无可配置字段`
                    : "请先在基本信息中选择协议类型"}
                </p>
              )}
            </TabsContent>

            <TabsContent value="advance" className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="flex items-center justify-between rounded-md border p-3">
                  <Label className="text-sm font-normal">显示</Label>
                  <Controller
                    control={control}
                    name="show"
                    render={({ field }) => (
                      <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                    )}
                  />
                </div>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <Label className="text-sm font-normal">{t("server.form.banned.label")}</Label>
                  <Controller
                    control={control}
                    name="banned"
                    render={({ field }) => (
                      <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                    )}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("server.form.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {t("server.form.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ProtocolConfigFields({
  fields,
  prefix,
  register,
  control,
  watch,
}: {
  fields: Record<string, ProtocolConfigField>;
  prefix: string;
  register: any;
  control: any;
  watch: any;
}) {
  return (
    <div className="space-y-3">
      {Object.entries(fields).map(([key, field]) => {
        const fieldPath = prefix ? `${prefix}.${key}` : key;
        const fieldName = field.label || key;
        const desc = field.description;

        if (field.show_when) {
          const shouldShow = Object.entries(field.show_when).every(([dep, val]) => {
            const depPath = `protocol_settings.${prefix ? `${prefix}.${dep}` : dep}`;
            return String(watch(depPath)) === String(val);
          });
          if (!shouldShow) return null;
        }

        if (field.type === "object" && field.fields) {
          return (
            <div key={key} className="space-y-2 rounded-md border p-3">
              <Label className="text-sm font-medium">{fieldName}</Label>
              {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
              <ProtocolConfigFields
                fields={field.fields}
                prefix={fieldPath}
                register={register}
                control={control}
                watch={watch}
              />
            </div>
          );
        }

        if (field.type === "boolean") {
          return (
            <div key={key} className="flex items-center justify-between rounded-md border p-3">
              <div>
                <Label className="text-sm font-normal">{fieldName}</Label>
                {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
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
          const entries = Object.entries(field.options);
          const isMulti = field.type === "array";
          if (isMulti) {
            return (
              <div key={key} className="space-y-1.5">
                <Label>{fieldName}</Label>
                {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
                <Controller
                  control={control}
                  name={`protocol_settings.${fieldPath}`}
                  render={({ field: controllerField }) => {
                    const selected = Array.isArray(controllerField.value) ? controllerField.value : [];
                    return (
                      <MultiSelect
                        options={entries}
                        selected={selected}
                        onChange={(vals) => controllerField.onChange(vals)}
                        placeholder={field.placeholder || `选择${fieldName}`}
                      />
                    );
                  }}
                />
              </div>
            );
          }
          return (
            <div key={key} className="space-y-1.5">
              <Label>{fieldName}</Label>
              {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
              <Controller
                control={control}
                name={`protocol_settings.${fieldPath}`}
                render={({ field: controllerField }) => (
                  <Select
                    value={String(controllerField.value ?? "")}
                    onValueChange={controllerField.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={field.placeholder || `选择${fieldName}`} />
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
            </div>
          );
        }

        if (field.type === "integer" || field.type === "number") {
          return (
            <div key={key} className="space-y-1.5">
              <Label>{fieldName}</Label>
              {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
              <Input
                type="number"
                placeholder={field.placeholder || `输入${fieldName}`}
                {...register(`protocol_settings.${fieldPath}`, { valueAsNumber: true })}
              />
            </div>
          );
        }

        return (
          <div key={key} className="space-y-1.5">
            <Label>{fieldName}</Label>
            {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
            <Input
              placeholder={field.placeholder || `输入${fieldName}`}
              {...register(`protocol_settings.${fieldPath}`)}
            />
          </div>
        );
      })}
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
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const toggle = useCallback(
    (value: string) => {
      onChange(
        selected.includes(value)
          ? selected.filter((v) => v !== value)
          : [...selected, value]
      );
    },
    [selected, onChange]
  );

  const remove = useCallback(
    (value: string) => {
      onChange(selected.filter((v) => v !== value));
    },
    [selected, onChange]
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
            <CommandInput placeholder={`搜索...`} />
            <CommandList>
              <CommandEmpty>无匹配选项</CommandEmpty>
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
                            : "opacity-50"
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
