import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUrlState } from "@/hooks/use-url-state";
import {
  Upload,
  Trash2,
  Puzzle,
  Loader2,
  Wrench,
  Power,
  PowerOff,
  BookOpen,
  FileIcon,
  ExternalLink,
  ArrowLeft,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  applyPluginActionResult,
  buildLinkActionResult,
  unwrapPluginActionResponse,
  type PluginActionMeta,
} from "@/lib/plugin-action";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Pagination } from "@/components/common/pagination";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  configPlugin,
  deletePlugin,
  disablePlugin,
  enablePlugin,
  executePluginAction,
  fetchPluginReadme,
  fetchPlugins,
  fetchPluginTypes,
  fetchPluginStaticFiles,
  installPlugin,
  savePluginConfig,
  uninstallPlugin,
  upgradePlugin,
  uploadPlugin,
} from "@/api/misc";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePlanOptions } from "@/hooks/use-plans";
import { CodeEditor } from "@/pages/config/code-editor";

export function PluginPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [action, setAction] = useState<{
    name: string;
    type: "uninstall" | "delete";
  } | null>(null);
  const [configuring, setConfiguring] = useState<{
    code: string;
    name: string;
    actions: any[];
  } | null>(null);
  const [reading, setReading] = useState<{ code: string; name: string } | null>(
    null,
  );
  const [browsing, setBrowsing] = useState<{ code: string; name: string } | null>(
    null,
  );
  // pageSize 固定 20，不写 URL；type 默认 feature 与原先一致
  const pageSize = 20;
  const [qs, setQs, query] = useUrlState({
    page: { type: "number" as const, default: 1, min: 1 },
    q: { type: "string" as const, default: "", debounce: 400 },
    type: { type: "string" as const, default: "feature" },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["plugins", query.type, query.page, query.q],
    queryFn: () =>
      fetchPlugins({
        type: query.type,
        page: query.page,
        pageSize,
        search: query.q,
      }),
  });
  const list: any[] = (data as any)?.data || [];
  const total = (data as any)?.total || 0;

  // 后端过滤：filtered 与 list 等价（仅作为保留引用，便于后续展示文案调整）
  const filtered = list;

  const { data: pluginTypes } = useQuery({
    queryKey: ["plugin", "types"],
    queryFn: fetchPluginTypes,
  });
  const typeRaw = (pluginTypes as any)?.data || pluginTypes || [];
  const typeOptions: { value: string; label: string }[] = Array.isArray(typeRaw)
    ? typeRaw.map((t: any) => ({ value: t.value ?? t, label: t.label ?? t }))
    : [];

  const onUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      await uploadPlugin(fd);
      toast.success(t("plugin.messages.uploadSuccess"));
      qc.invalidateQueries({ queryKey: ["plugins"] });
    } catch (e) {
    } finally {
      setUploading(false);
    }
  };

  const getTypeLabel = (type: string) => {
    const found = typeOptions.find((o) => o.value === type);
    return found?.label || type;
  };

  return (
    <>
      <PageHeader
        title={t("plugin.title")}
        description={t("plugin.description")}
        actions={
          <>
            <input
              type="file"
              accept=".zip"
              className="hidden"
              id="plugin-upload"
              onChange={(e) =>
                e.target.files?.[0] && onUpload(e.target.files[0])
              }
            />
            <Button
              onClick={() => document.getElementById("plugin-upload")?.click()}
            >
              <Upload className="h-4 w-4" />
              {t("plugin.upload.button")}
            </Button>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("plugin.toolbar.search")}
            value={qs.q}
            onChange={(e) => setQs({ q: e.target.value })}
            className="pl-9"
          />
        </div>
        <Select
          value={qs.type}
          onValueChange={(v) => setQs({ type: v })}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder={t("plugin.type.placeholder")} />
          </SelectTrigger>
          <SelectContent>
            {typeOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border bg-card">
          <EmptyState
            icon={<Puzzle className="h-10 w-10" />}
            message={t("plugin.noPlugins")}
          />
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((p) => {
            const status = !p.is_installed
              ? "not_installed"
              : p.is_enabled
                ? "enabled"
                : "disabled";
            return (
              <Card key={p.code || p.name}>
                <CardContent className="flex items-center justify-between gap-4 p-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">{p.name}</h3>
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 py-0"
                        >
                          {getTypeLabel(p.type)}
                        </Badge>
                        <span className="text-xs text-muted-foreground shrink-0">
                          v{p.version || "—"}
                        </span>
                        {p.has_readme && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-5 w-5"
                            onClick={() => setReading({ code: p.code, name: p.name })}
                          >
                            <BookOpen className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {p.has_static_files && status === "enabled" && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-5 w-5"
                            onClick={() => setBrowsing({ code: p.code, name: p.name })}
                          >
                            <FileIcon className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {p.description || ""}
                      </p>
                    </div>
                    {status === "enabled" ? (
                      <Badge variant="success" className="shrink-0">
                        {t("plugin.status.enabled")}
                      </Badge>
                    ) : status === "disabled" ? (
                      <Badge variant="secondary" className="shrink-0">
                        {t("plugin.status.disabled")}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="shrink-0">
                        {t("plugin.status.not_installed")}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {status === "not_installed" ? (
                      <>
                        <Button
                          size="sm"
                          onClick={async () => {
                            try {
                              await installPlugin(p.code);
                              toast.success(
                                t("plugin.messages.installSuccess"),
                              );
                              qc.invalidateQueries({ queryKey: ["plugins"] });
                            } catch (e) {}
                          }}
                        >
                          {t("plugin.button.install")}
                        </Button>
                        {p.can_be_deleted && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                            onClick={() =>
                              setAction({ name: p.code, type: "delete" })
                            }
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </>
                    ) : (
                      <>
                        {/* 有配置项或有动作按钮时都显示入口（动作是通用能力，不依赖 config.json） */}
                        {p.has_config || (Array.isArray(p.actions) && p.actions.length > 0) ? (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={status !== "enabled"}
                            onClick={() =>
                              setConfiguring({
                                code: p.code,
                                name: p.name,
                                actions: p.actions || [],
                              })
                            }
                          >
                            <Wrench className="h-3.5 w-3.5" />
                            {t("plugin.button.config")}
                          </Button>
                        ) : null}
                        {p.need_upgrade && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                              try {
                                await upgradePlugin(p.code);
                                toast.success(
                                  t("plugin.messages.upgradeSuccess"),
                                );
                                qc.invalidateQueries({ queryKey: ["plugins"] });
                              } catch (e) {}
                            }}
                          >
                            {t("plugin.button.upgrade")}
                          </Button>
                        )}
                        {status === "enabled" ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={async () => {
                              try {
                                await disablePlugin(p.code);
                                toast.success(
                                  t("plugin.messages.disableSuccess"),
                                );
                                qc.invalidateQueries({ queryKey: ["plugins"] });
                              } catch (e) {}
                            }}
                          >
                            <PowerOff className="h-3.5 w-3.5" />
                            {t("plugin.button.disable")}
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={async () => {
                              try {
                                await enablePlugin(p.code);
                                toast.success(
                                  t("plugin.messages.enableSuccess"),
                                );
                                qc.invalidateQueries({ queryKey: ["plugins"] });
                              } catch (e) {}
                            }}
                          >
                            <Power className="h-3.5 w-3.5" />
                            {t("plugin.button.enable")}
                          </Button>
                        )}
                        {status === "disabled" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              setAction({ name: p.code, type: "uninstall" })
                            }
                          >
                            {t("plugin.button.uninstall")}
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
          <Pagination
            page={qs.page}
            pageSize={pageSize}
            total={total}
            onPageChange={(p) => setQs({ page: p })}
          />
        </div>
      )}

      <ConfirmDialog
        open={!!action}
        onOpenChange={(v) => !v && setAction(null)}
        title={
          action?.type === "uninstall"
            ? t("plugin.uninstall.title")
            : t("plugin.delete.title")
        }
        description={
          action?.type === "uninstall"
            ? t("plugin.uninstall.description")
            : t("plugin.delete.description")
        }
        confirmText={
          action?.type === "uninstall"
            ? t("plugin.uninstall.button")
            : t("plugin.delete.button")
        }
        onConfirm={async () => {
          if (!action) return;
          try {
            if (action.type === "uninstall") {
              await uninstallPlugin(action.name);
              toast.success(t("plugin.messages.uninstallSuccess"));
            } else {
              await deletePlugin(action.name);
              toast.success(t("plugin.messages.deleteSuccess"));
            }
            qc.invalidateQueries({ queryKey: ["plugins"] });
            setAction(null);
          } catch (e) {}
        }}
      />

      <PluginConfigDialog
        code={configuring?.code ?? null}
        name={configuring?.name ?? null}
        actions={configuring?.actions ?? []}
        onOpenChange={(v) => !v && setConfiguring(null)}
      />

      <PluginReadmeDialog
        code={reading?.code ?? null}
        name={reading?.name ?? null}
        onOpenChange={(v) => !v && setReading(null)}
      />

      <PluginStaticFilesDialog
        code={browsing?.code ?? null}
        name={browsing?.name ?? null}
        onOpenChange={(v) => !v && setBrowsing(null)}
      />
    </>
  );
}

function PluginStaticFilesDialog({
  code,
  name,
  onOpenChange,
}: {
  code: string | null;
  name: string | null;
  onOpenChange: (v: boolean) => void;
}) {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["plugin", "static-files", code],
    queryFn: () => fetchPluginStaticFiles(code!),
    enabled: !!code,
  });

  const files: any[] = (data as any)?.data || [];

  // Auto-open if only one file — runs before dialog ever renders
  useEffect(() => {
    if (!isLoading && files.length === 1 && code) {
      window.open(files[0].url, "_blank");
      onOpenChange(false);
    }
  }, [isLoading]); // only trigger on loading transition; ignore files/code changes

  // If only one file (loaded), don't render dialog at all
  if (!isLoading && files.length === 1) {
    return null;
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (ts: number) => {
    return new Date(ts * 1000).toLocaleString();
  };

  const handleOpenFile = (url: string) => {
    setSelectedFile(url);
  };

  // If a file is selected, show it in full-screen dialog
  if (selectedFile) {
    return (
      <Dialog
        open={!!code}
        onOpenChange={(v) => {
          if (!v) {
            setSelectedFile(null);
            onOpenChange(false);
          }
        }}
      >
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0">
          <div className="flex items-center justify-between px-4 py-2 border-b bg-card">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedFile(null)}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              {t("plugin.staticFiles.backToList")}
            </Button>
            <DialogTitle className="text-sm">{selectedFile}</DialogTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(selectedFile, "_blank")}
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1" />
              {t("plugin.staticFiles.openInNewTab")}
            </Button>
          </div>
          <iframe
            src={selectedFile}
            className="w-full flex-1 border-0"
            style={{ height: "calc(95vh - 53px)" }}
            title={t("plugin.staticFiles.previewTitle")}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={!!code} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
          <DialogTitle>
            {name || code} · {t("plugin.staticFiles.title")}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : files.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            {t("plugin.staticFiles.empty")}
          </p>
        ) : (
          <div className="space-y-1">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-md border bg-card px-4 py-2.5 hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => handleOpenFile(file.url)}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="text-lg shrink-0">📄</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{file.path}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatSize(file.size)} · {formatDate(file.last_modified)}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(file.url, "_blank");
                  }}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
        </div>
        <DialogFooter className="gap-2 border-t px-6 py-4 shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("plugin.config.cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PluginConfigDialog({
  code,
  name,
  actions,
  onOpenChange,
}: {
  code: string | null;
  name: string | null;
  actions: any[];
  onOpenChange: (v: boolean) => void;
}) {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [values, setValues] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionConfirm, setActionConfirm] = useState<any | null>(null);
  const { data: planOptions = [], isLoading: plansLoading } = usePlanOptions();

  const { data: schema, isLoading } = useQuery({
    queryKey: ["plugin", "config", code],
    queryFn: () => configPlugin(code!),
    enabled: !!code,
  });

  // schema is the config object: { field_name: { type, label, description, value, options } }
  const fields =
    schema && typeof schema === "object" && !Array.isArray(schema)
      ? Object.entries(schema as Record<string, any>).map(([key, cfg]) => ({
          key,
          ...cfg,
        }))
      : [];

  useEffect(() => {
    setValues({});
    setActionConfirm(null);
  }, [code]);

  // Load values from schema on first load
  useEffect(() => {
    if (fields.length > 0 && Object.keys(values).length === 0) {
      const initial: Record<string, any> = {};
      for (const f of fields) {
        const value =
          f.value !== undefined && f.value !== null ? f.value : "";

        if (f.type === "json") {
          if (typeof value === "string") {
            try {
              initial[f.key] = value.trim()
                ? JSON.stringify(JSON.parse(value), null, 2)
                : "";
            } catch {
              initial[f.key] = value;
            }
          } else {
            initial[f.key] = JSON.stringify(value, null, 2);
          }
          continue;
        }

        if (f.type === "yaml") {
          initial[f.key] = typeof value === "string" ? value : String(value);
          continue;
        }

        initial[f.key] = value;
      }
      setValues(initial);
    }
  }, [fields]); // eslint-disable-line react-hooks/exhaustive-deps

  const setValue = (key: string, val: any) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const submit = async () => {
    if (!code) return;

    const payload = { ...values };
    for (const field of fields) {
      if (field.type !== "json") continue;

      const source = String(values[field.key] ?? "").trim();
      if (!source) {
        payload[field.key] = null;
        continue;
      }

      try {
        payload[field.key] = JSON.parse(source);
      } catch {
        toast.error(
          t("plugin.messages.invalidJson", {
            field: field.label || field.key,
          }),
        );
        return;
      }
    }

    setSaving(true);
    try {
      await savePluginConfig(code, payload);
      toast.success(t("plugin.messages.configSaveSuccess"));
      onOpenChange(false);
    } catch (e) {
      toast.error(t("plugin.messages.configSaveError"));
    } finally {
      setSaving(false);
    }
  };

  const runAction = async (act: PluginActionMeta | any) => {
    if (!code) return;
    const meta = act as PluginActionMeta;
    const key = `${code}:${meta.name}`;
    setActionLoading(key);
    try {
      // type=link 且带静态 url：可直接打开，无需等后端（任意插件通用）
      const linkOnly = buildLinkActionResult(meta);
      const actionLabel = meta.label || t("plugin.messages.actionLabel");
      if (linkOnly) {
        applyPluginActionResult(linkOnly, meta, {
          fallbackMessage: t("plugin.messages.actionSuccessWithLabel", {
            label: actionLabel,
          }),
          defaultReload: false,
          onReload: () => qc.invalidateQueries({ queryKey: ["plugins"] }),
          onToastSuccess: (msg) =>
            toast.success(msg || t("plugin.messages.actionSuccess")),
          onToastError: (msg) =>
            toast.error(msg || t("plugin.messages.actionError")),
        });
        return;
      }

      const res = await executePluginAction(code, meta.name);
      const payload = unwrapPluginActionResponse(res);
      applyPluginActionResult(payload, meta, {
        fallbackMessage: t("plugin.messages.actionSuccessWithLabel", {
          label: actionLabel,
        }),
        // 默认刷新；动作返回 reload:false 时可跳过
        defaultReload: true,
        onReload: () => qc.invalidateQueries({ queryKey: ["plugins"] }),
        onToastSuccess: (msg) =>
          toast.success(msg || t("plugin.messages.actionSuccess")),
        onToastError: (msg) =>
          toast.error(msg || t("plugin.messages.actionError")),
      });
    } catch (e: any) {
      const actionLabel = meta.label || t("plugin.messages.actionLabel");
      const msg =
        (typeof e?.message === "string" && e.message) ||
        t("plugin.messages.actionErrorWithLabel", { label: actionLabel });
      toast.error(msg);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Dialog open={!!code} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
          <DialogTitle>
            {name || code} · {t("plugin.config.title")}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : fields.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("plugin.config.noConfigs")}
          </p>
        ) : (
          <div className="space-y-5">
            {fields.map((f) => {
              const label = f.label || f.key;
              const description = f.description || "";
              const placeholder = f.placeholder || "";

              if (f.type === "json" || f.type === "yaml") {
                return (
                  <div key={f.key} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-3">
                      <Label className="text-sm font-medium">{label}</Label>
                      <Badge variant="outline" className="font-mono text-[10px] uppercase">
                        {f.type}
                      </Badge>
                    </div>
                    <CodeEditor
                      value={String(values[f.key] ?? "")}
                      onChange={(value) => setValue(f.key, value)}
                      language={f.type}
                      minHeight="220px"
                    />
                    {description && (
                      <p className="text-xs text-muted-foreground">
                        {description}
                      </p>
                    )}
                  </div>
                );
              }

              if (f.type === "plan") {
                return (
                  <div key={f.key} className="space-y-1.5">
                    <Label className="text-sm font-medium">{label}</Label>
                    <Select
                      value={String(values[f.key] ?? 0)}
                      onValueChange={(v) => setValue(f.key, Number(v))}
                      disabled={plansLoading}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            placeholder || t("plugin.config.selectPlan")
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">
                          {t("plugin.config.noPlan")}
                        </SelectItem>
                        {planOptions.map((plan) => (
                          <SelectItem key={plan.id} value={String(plan.id)}>
                            {plan.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {description && (
                      <p className="text-xs text-muted-foreground">
                        {description}
                      </p>
                    )}
                  </div>
                );
              }

              if (f.type === "select") {
                const options = Array.isArray(f.options) ? f.options : [];
                return (
                  <div key={f.key} className="space-y-1.5">
                    <Label className="text-sm font-medium">{label}</Label>
                    <Select
                      value={String(values[f.key] ?? "")}
                      onValueChange={(v) => setValue(f.key, v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {options.map((opt: any) => {
                          const optVal =
                            typeof opt === "string" ? opt : (opt.value ?? opt);
                          const optLabel =
                            typeof opt === "string" ? opt : (opt.label ?? opt);
                          return (
                            <SelectItem
                              key={String(optVal)}
                              value={String(optVal)}
                            >
                              {optLabel}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    {description && (
                      <p className="text-xs text-muted-foreground">
                        {description}
                      </p>
                    )}
                  </div>
                );
              }

              if (f.type === "boolean") {
                return (
                  <div
                    key={f.key}
                    className="flex items-center justify-between rounded-md border bg-card px-4 py-3"
                  >
                    <div className="space-y-0.5 pr-4">
                      <Label className="text-sm font-medium">{label}</Label>
                      {description && (
                        <p className="text-xs text-muted-foreground">
                          {description}
                        </p>
                      )}
                    </div>
                    <Switch
                      checked={!!values[f.key]}
                      onCheckedChange={(v) => setValue(f.key, v)}
                    />
                  </div>
                );
              }

              // text (multi-line)
              if (f.type === "text") {
                return (
                  <div key={f.key} className="space-y-1.5">
                    <Label className="text-sm font-medium">{label}</Label>
                    <Textarea
                      value={values[f.key] ?? ""}
                      placeholder={placeholder}
                      rows={4}
                      onChange={(e) => setValue(f.key, e.target.value)}
                    />
                    {description && (
                      <p className="text-xs text-muted-foreground">
                        {description}
                      </p>
                    )}
                  </div>
                );
              }

              // string / default
              return (
                <div key={f.key} className="space-y-1.5">
                  <Label className="text-sm font-medium">{label}</Label>
                  <Input
                    value={values[f.key] ?? ""}
                    placeholder={placeholder}
                    onChange={(e) => setValue(f.key, e.target.value)}
                  />
                  {description && (
                    <p className="text-xs text-muted-foreground">
                      {description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {actions.length > 0 && (
          <div className="border-t pt-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              {t("plugin.config.actions")}
            </p>
            <div className="flex flex-wrap gap-2">
              {actions.map((act: any) => (
                <Button
                  key={act.name}
                  size="sm"
                  variant={
                    act.color === "destructive"
                      ? "destructive"
                      : act.color === "outline"
                        ? "outline"
                        : "default"
                  }
                  disabled={actionLoading === `${code}:${act.name}`}
                  onClick={() => {
                    if (act.confirm) {
                      setActionConfirm(act);
                    } else {
                      runAction(act);
                    }
                  }}
                >
                  {actionLoading === `${code}:${act.name}` ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : act.icon ? (
                    <span className="text-sm mr-1">{act.icon}</span>
                  ) : null}
                  {act.label}
                </Button>
              ))}
            </div>
          </div>
        )}
        </div>
        <DialogFooter className="gap-2 border-t px-6 py-4 shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("plugin.config.cancel")}
          </Button>
          <Button onClick={submit} disabled={saving || fields.length === 0}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("plugin.config.save")}
          </Button>
        </DialogFooter>

        <ConfirmDialog
          open={!!actionConfirm}
          onOpenChange={(v) => !v && setActionConfirm(null)}
          title={actionConfirm?.label || ""}
          description={actionConfirm?.confirm || ""}
          onConfirm={async () => {
            if (!actionConfirm) return;
            await runAction(actionConfirm);
            setActionConfirm(null);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

function PluginReadmeDialog({
  code,
  name,
  onOpenChange,
}: {
  code: string | null;
  name: string | null;
  onOpenChange: (v: boolean) => void;
}) {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery({
    queryKey: ["plugin", "readme", code],
    queryFn: () => fetchPluginReadme(code!),
    enabled: !!code,
  });
  const content: string = ((data as any)?.data ?? data ?? "") as string;

  return (
    <Dialog open={!!code} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
          <DialogTitle>
            {name || code} · {t("plugin.readme.title")}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : content ? (
          <div className="markdown-body text-sm leading-relaxed">
            <style>{`
              .markdown-body { all: revert; }
              .markdown-body h1 { font-size: 1.5rem; font-weight: 700; margin: 1.5rem 0 0.75rem; padding-bottom: 0.3rem; border-bottom: 1px solid hsl(var(--border)); }
              .markdown-body h2 { font-size: 1.3rem; font-weight: 600; margin: 1.25rem 0 0.5rem; padding-bottom: 0.2rem; border-bottom: 1px solid hsl(var(--border)); }
              .markdown-body h3 { font-size: 1.1rem; font-weight: 600; margin: 1rem 0 0.5rem; }
              .markdown-body h4 { font-size: 1rem; font-weight: 600; margin: 0.75rem 0 0.25rem; }
              .markdown-body p { margin-bottom: 0.75rem; line-height: 1.6; }
              .markdown-body ul, .markdown-body ol { padding-left: 1.5rem; margin-bottom: 0.75rem; }
              .markdown-body li { margin-bottom: 0.25rem; }
              .markdown-body ul > li { list-style-type: disc; }
              .markdown-body ol > li { list-style-type: decimal; }
              .markdown-body li > ul, .markdown-body li > ol { margin-bottom: 0; }
              .markdown-body code:not(pre code) { background: hsl(var(--muted)); padding: 0.15rem 0.35rem; border-radius: 0.25rem; font-size: 0.875em; font-weight: 500; }
              .markdown-body pre { background: hsl(var(--muted)); padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin-bottom: 1rem; border: 1px solid hsl(var(--border)); }
              .markdown-body pre code { background: none; padding: 0; border-radius: 0; font-size: 0.875em; line-height: 1.5; }
              .markdown-body a { color: hsl(var(--primary)); text-decoration: underline; text-underline-offset: 2px; }
              .markdown-body a:hover { opacity: 0.8; }
              .markdown-body blockquote { border-left: 4px solid hsl(var(--primary)); padding: 0.5rem 1rem; margin: 0 0 1rem; background: hsl(var(--muted)/0.3); border-radius: 0 0.375rem 0.375rem 0; }
              .markdown-body blockquote p:last-child { margin-bottom: 0; }
              .markdown-body table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; display: block; overflow-x: auto; }
              .markdown-body th, .markdown-body td { border: 1px solid hsl(var(--border)); padding: 0.5rem 0.75rem; text-align: left; font-size: 0.875rem; }
              .markdown-body th { background: hsl(var(--muted)); font-weight: 600; }
              .markdown-body tr:nth-child(even) { background: hsl(var(--muted)/0.3); }
              .markdown-body hr { border: none; border-top: 1px solid hsl(var(--border)); margin: 1.5rem 0; }
              .markdown-body img { max-width: 100%; border-radius: 0.375rem; margin: 0.5rem 0; }
              .markdown-body strong { font-weight: 600; }
              .markdown-body input[type="checkbox"] { margin-right: 0.375rem; accent-color: hsl(var(--primary)); }
              .markdown-body ::-webkit-scrollbar { height: 6px; }
              .markdown-body ::-webkit-scrollbar-thumb { background: hsl(var(--border)); border-radius: 3px; }
            `}</style>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {t("plugin.readme.empty")}
          </p>
        )}
        </div>
        <DialogFooter className="gap-2 border-t px-6 py-4 shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("plugin.config.cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
