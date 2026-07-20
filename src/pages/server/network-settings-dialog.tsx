import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BookmarkPlus, Check, Loader2, Trash2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  dropNetworkSettingsTemplate,
  fetchNetworkSettingsTemplates,
  saveNetworkSettingsTemplate,
  type NetworkSettingsTemplate,
} from "@/api/server";
import {
  listBuiltinNetworkSettingsTemplates,
  type BuiltinNetworkSettingsTemplate,
} from "./network-settings-templates";

type TemplateItem =
  | (NetworkSettingsTemplate & { builtin?: false })
  | BuiltinNetworkSettingsTemplate;

function toJsonText(value: any): string {
  if (value == null || value === "") return "{\n  \n}";
  if (typeof value === "string") {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "{\n  \n}";
  }
}

function parseSettingsObject(
  text: string,
  t: (key: string, opts?: any) => string,
):
  | { ok: true; value: Record<string, any> | null }
  | { ok: false; error: string } {
  const trimmed = text.trim();
  if (!trimmed) return { ok: true, value: null };
  try {
    const parsed = JSON.parse(trimmed);
    if (parsed === null) return { ok: true, value: null };
    if (typeof parsed !== "object" || Array.isArray(parsed)) {
      return {
        ok: false,
        error: t("server.network_settings.validation.must_be_object"),
      };
    }
    return { ok: true, value: parsed };
  } catch {
    return {
      ok: false,
      error: t("server.network_settings.validation.invalid_json"),
    };
  }
}

export function NetworkSettingsDialog({
  open,
  onOpenChange,
  network,
  value,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  network?: string | null;
  value: any;
  onConfirm: (next: any) => void;
}) {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [text, setText] = useState("{\n  \n}");
  const [error, setError] = useState("");
  const [saveName, setSaveName] = useState("");
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const {
    data: remoteTemplates = [],
    isLoading: templatesLoading,
    refetch,
  } = useQuery({
    queryKey: ["server", "network-settings-templates", network || ""],
    queryFn: () => fetchNetworkSettingsTemplates(network),
    enabled: open,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (!open) return;
    setText(toJsonText(value));
    setError("");
    setSaveName("");
    setShowSaveForm(false);
  }, [open, value]);

  const builtinTemplates = useMemo(
    () => listBuiltinNetworkSettingsTemplates(network),
    [network],
  );

  const customTemplates = useMemo(
    () => remoteTemplates as TemplateItem[],
    [remoteTemplates],
  );

  const templateDisplayName = useCallback(
    (tmpl: TemplateItem) => {
      if ("nameKey" in tmpl && tmpl.nameKey) return t(tmpl.nameKey);
      if ("name" in tmpl && tmpl.name) return tmpl.name;
      return (tmpl as any).label || tmpl.id;
    },
    [t],
  );

  const templateDisplayDescription = useCallback(
    (tmpl: TemplateItem) => {
      if ("descriptionKey" in tmpl && tmpl.descriptionKey) {
        return t(tmpl.descriptionKey);
      }
      if ("description" in tmpl && tmpl.description) {
        return tmpl.description;
      }
      return "";
    },
    [t],
  );

  const applyTemplate = useCallback(
    (tmpl: TemplateItem) => {
      setText(JSON.stringify(tmpl.settings ?? {}, null, 2));
      setError("");
      toast.success(
        t("server.network_settings.template_applied", {
          name: templateDisplayName(tmpl),
        }),
      );
    },
    [t, templateDisplayName],
  );

  const handleSaveAsTemplate = async () => {
    const parsed = parseSettingsObject(text, t);
    if (!parsed.ok) {
      setError(parsed.error);
      return;
    }
    if (!parsed.value || Object.keys(parsed.value).length === 0) {
      setError(
        t("server.network_settings.template_empty"),
      );
      return;
    }
    const name = saveName.trim();
    if (!name) {
      toast.error(
        t("server.network_settings.template_name_required"),
      );
      return;
    }

    setSaving(true);
    try {
      await saveNetworkSettingsTemplate({
        name,
        description: network
          ? t("server.network_settings.template_from_current", {
              network,
            })
          : t("server.network_settings.template_custom_desc"),
        network: network || null,
        settings: parsed.value,
      });
      setSaveName("");
      setShowSaveForm(false);
      await qc.invalidateQueries({
        queryKey: ["server", "network-settings-templates"],
      });
      await refetch();
      toast.success(
        t("server.network_settings.template_saved"),
      );
    } catch {
      toast.error(
        t("server.network_settings.template_save_failed"),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTemplate = async (id: number) => {
    setDeletingId(id);
    try {
      await dropNetworkSettingsTemplate(id);
      await qc.invalidateQueries({
        queryKey: ["server", "network-settings-templates"],
      });
      await refetch();
      toast.success(
        t("server.network_settings.template_deleted"),
      );
    } catch {
      toast.error(
        t("server.network_settings.template_delete_failed"),
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleConfirm = () => {
    const parsed = parseSettingsObject(text, t);
    if (!parsed.ok) {
      // JSON 无效：仅提示错误，不关闭弹窗
      setError(parsed.error);
      toast.error(parsed.error);
      return;
    }
    setError("");
    onConfirm(parsed.value);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
          <div className="flex items-center gap-2">
            <DialogTitle>
              {t("server.network_settings.edit_protocol_config")}
            </DialogTitle>
            {network ? (
              <Badge variant="outline" className="text-[10px]">
                {network}
              </Badge>
            ) : null}
          </div>
          <DialogDescription>
            {t("server.network_settings.json_config_placeholder")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto space-y-4 px-6 py-4">
          {/* 模板列表 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label className="text-sm font-medium">
                {t("server.network_settings.templates")}
              </Label>
              <Button
                type="button"
                variant="link"
                size="sm"
                className="h-auto p-0 text-xs"
                onClick={() => setShowSaveForm((v) => !v)}
              >
                <BookmarkPlus className="h-3.5 w-3.5" />
                {t("server.network_settings.save_as_template")}
              </Button>
            </div>

            {showSaveForm && (
              <div className="flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-center">
                <Input
                  className="flex-1"
                  placeholder={t(
                    "server.network_settings.template_name_placeholder",
                  )}
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void handleSaveAsTemplate();
                    }
                  }}
                />
                <div className="flex gap-2 shrink-0">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={saving}
                    onClick={() => {
                      setShowSaveForm(false);
                      setSaveName("");
                    }}
                  >
                    {t("server.common.cancel")}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    disabled={saving}
                    onClick={() => void handleSaveAsTemplate()}
                  >
                    {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    {t("server.network_settings.save_template")}
                  </Button>
                </div>
              </div>
            )}

            {templatesLoading ? (
              <div className="flex items-center justify-center gap-2 rounded-md border border-dashed px-3 py-6 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {t("common.loading")}
              </div>
            ) : customTemplates.length === 0 && builtinTemplates.length === 0 ? (
              <p className="text-xs text-muted-foreground rounded-md border border-dashed px-3 py-4 text-center">
                {t("server.network_settings.templates_empty")}
              </p>
            ) : (
              <div className="space-y-3">
                {customTemplates.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-medium text-muted-foreground">
                      {t("server.network_settings.templates_custom")}
                    </p>
                    <div className="space-y-1.5">
                      {customTemplates.map((tmpl) => (
                        <TemplateRow
                          key={`db-${tmpl.id}`}
                          name={templateDisplayName(tmpl)}
                          description={templateDisplayDescription(tmpl)}
                          network={tmpl.network}
                          builtin={false}
                          deleting={deletingId === Number(tmpl.id)}
                          onApply={() => applyTemplate(tmpl)}
                          onDelete={() =>
                            void handleDeleteTemplate(Number(tmpl.id))
                          }
                          t={t}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {builtinTemplates.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-medium text-muted-foreground">
                      {t("server.network_settings.templates_builtin")}
                    </p>
                    <div className="space-y-1.5">
                      {builtinTemplates.map((tmpl) => (
                        <TemplateRow
                          key={`builtin-${tmpl.id}`}
                          name={templateDisplayName(tmpl)}
                          description={templateDisplayDescription(tmpl)}
                          network={tmpl.network}
                          builtin
                          onApply={() => applyTemplate(tmpl)}
                          t={t}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* JSON 编辑 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {t("server.network_settings.json_label")}
            </Label>
            <Textarea
              className={cn(
                "min-h-[220px] font-mono text-xs",
                error && "border-destructive",
              )}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setError("");
              }}
              placeholder={t(
                "server.network_settings.json_config_placeholder_with_template",
              )}
            />
            {error ? (
              <p className="text-xs text-destructive">{error}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                {t("server.network_settings.validation.must_be_object")}
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 border-t px-6 py-4 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {t("server.common.cancel")}
          </Button>
          <Button type="button" onClick={handleConfirm}>
            {t("server.common.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TemplateRow({
  name,
  description,
  network,
  builtin,
  deleting,
  onApply,
  onDelete,
  t,
}: {
  name: string;
  description?: string | null;
  network?: string | null;
  builtin?: boolean;
  deleting?: boolean;
  onApply: () => void;
  onDelete?: () => void;
  t: (key: string, opts?: any) => string;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-md border px-3 py-2">
      <div className="min-w-0 space-y-0.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-sm font-medium truncate">{name}</span>
          {network ? (
            <Badge variant="outline" className="text-[10px]">
              {network}
            </Badge>
          ) : null}
          {builtin ? (
            <Badge variant="secondary" className="text-[10px]">
              {t("server.network_settings.builtin")}
            </Badge>
          ) : null}
        </div>
        {description ? (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {description}
          </p>
        ) : null}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {!builtin && onDelete ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            disabled={deleting}
            title={t("server.network_settings.delete_template")}
            onClick={onDelete}
          >
            {deleting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
          </Button>
        ) : null}
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-7"
          onClick={onApply}
        >
          <Check className="h-3.5 w-3.5" />
          {t("server.network_settings.use_template_btn")}
        </Button>
      </div>
    </div>
  );
}
