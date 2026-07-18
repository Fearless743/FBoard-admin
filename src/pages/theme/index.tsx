import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Upload, Trash2, Palette, Settings as SettingsIcon, Eye } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteTheme, getThemeConfig, getThemes, saveThemeConfig, switchTheme, uploadTheme } from "@/api/misc";

export function ThemePage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [configuring, setConfiguring] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["themes"],
    queryFn: getThemes,
  });
  // /theme/getThemes 返回 { themes: { name: config }, active: "Xboard" }
  const activeTheme = (data as any)?.active;
  const themesObj = (data as any)?.themes ?? data ?? {};
  const list: any[] = Object.entries(themesObj).map(([name, cfg]: [string, any]) => ({
    name,
    version: cfg?.version,
    description: cfg?.description,
    is_current: name === activeTheme,
    images: cfg?.images,
    config: cfg,
  }));

  const onUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      await uploadTheme(fd);
      toast.success(t("theme.upload.success"));
      qc.invalidateQueries({ queryKey: ["themes"] });
    } catch (e) {
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <PageHeader
        title={t("theme.title")}
        description={t("theme.description")}
        actions={
          <>
            <input
              type="file"
              accept=".zip"
              className="hidden"
              id="theme-upload"
              onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
            />
            <Button onClick={() => document.getElementById("theme-upload")?.click()}>
              <Upload className="h-4 w-4" />
              {t("theme.upload.button")}
            </Button>
          </>
        }
      />

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="rounded-lg border bg-card">
          <EmptyState icon={<Palette className="h-10 w-10" />} message={t("common.table.noData")} />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {list.map((th) => (
            <Card key={th.name}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{th.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {t("theme.card.version", { version: th.version || "—" })}
                    </p>
                  </div>
                  {th.is_current ? (
                    <Badge variant="success">{t("theme.card.currentTheme")}</Badge>
                  ) : (
                    <Button size="sm" onClick={async () => {
                      try {
                        await switchTheme(th.name);
                        toast.success(t("theme.card.activateSuccess"));
                        qc.invalidateQueries({ queryKey: ["themes"] });
                      } catch (e) {}
                    }}>
                      {t("theme.card.activateTheme")}
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="outline" onClick={() => setConfiguring(th.name)}>
                    <SettingsIcon className="h-3 w-3" />
                    {t("theme.card.configureTheme")}
                  </Button>
                  {!th.is_current && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => setDeleting(th.name)}
                    >
                      <Trash2 className="h-3 w-3" />
                      {t("theme.card.delete.button")}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ThemeConfigDialog
        name={configuring}
        onOpenChange={(v) => !v && setConfiguring(null)}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title={t("theme.card.delete.title")}
        description={t("theme.card.delete.description")}
        onConfirm={async () => {
          if (!deleting) return;
          try {
            await deleteTheme(deleting);
            toast.success(t("common.delete.success"));
            qc.invalidateQueries({ queryKey: ["themes"] });
            setDeleting(null);
          } catch (e) {}
        }}
      />
    </>
  );
}

function ThemeConfigDialog({
  name,
  onOpenChange,
}: {
  name: string | null;
  onOpenChange: (v: boolean) => void;
}) {
  const { t } = useTranslation();
  const [values, setValues] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  // 获取主题列表（含 configs 模式）
  const { data: themesData } = useQuery({
    queryKey: ["themes"],
    queryFn: getThemes,
    enabled: !!name,
  });
  const themesObj = (themesData as any)?.themes ?? themesData ?? {};
  const themeSchema = name ? (themesObj[name] as any) : null;
  const configs: any[] = themeSchema?.configs ?? [];

  // 获取已保存的配置值
  const { data: savedConfig, isLoading } = useQuery({
    queryKey: ["theme", "config", name],
    queryFn: () => getThemeConfig(name!),
    enabled: !!name,
  });

  // 将配置值载入表单
  useEffect(() => {
    if (savedConfig && typeof savedConfig === "object" && !Array.isArray(savedConfig)) {
      setValues((prev) => {
        // 只在首次加载时填充
        if (Object.keys(prev).length > 0) return prev;
        const initial: Record<string, any> = {};
        for (const cfg of configs) {
          const fieldName = cfg.field_name;
          initial[fieldName] =
            savedConfig[fieldName] !== undefined && savedConfig[fieldName] !== null
              ? savedConfig[fieldName]
              : cfg.default_value ?? "";
        }
        return initial;
      });
    }
  }, [savedConfig, configs]);

  const setValue = (key: string, val: any) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const submit = async () => {
    if (!name) return;
    setSaving(true);
    try {
      await saveThemeConfig({ name, config: values });
      toast.success(t("theme.config.success"));
      onOpenChange(false);
    } catch (e) {
      toast.error(t("theme.config.error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={!!name} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
          <DialogTitle>
            {name && t("theme.config.title", { name })}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : configs.length === 0 ? (
          <div>
            <p className="text-sm text-muted-foreground">
              {t("theme.config.noConfigs")}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {configs.map((cfg) => {
              const fieldName = cfg.field_name;
              const label = cfg.label || fieldName;
              const placeholder = cfg.placeholder ?? "";
              return (
                <div key={fieldName} className="space-y-1.5">
                  <Label className="text-sm font-medium">{label}</Label>
                  {cfg.field_type === "select" ? (
                    <Select
                      value={String(values[fieldName] ?? cfg.default_value ?? "")}
                      onValueChange={(v) => setValue(fieldName, v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(cfg.select_options ?? {}).map(([optVal, optLabel]) => (
                          <SelectItem key={optVal} value={optVal}>
                            {optLabel as string}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : cfg.field_type === "textarea" ? (
                    <Textarea
                      value={values[fieldName] ?? ""}
                      placeholder={placeholder}
                      rows={4}
                      onChange={(e) => setValue(fieldName, e.target.value)}
                    />
                  ) : (
                    <Input
                      value={values[fieldName] ?? ""}
                      placeholder={placeholder}
                      onChange={(e) => setValue(fieldName, e.target.value)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
        </div>
        <DialogFooter className="gap-2 border-t px-6 py-4 shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("theme.config.cancel")}
          </Button>
          <Button onClick={submit} disabled={saving || configs.length === 0}>
            {t("theme.config.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
