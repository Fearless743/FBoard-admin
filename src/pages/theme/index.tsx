import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Upload, Trash2, Palette, Settings as SettingsIcon, Eye } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteTheme, getThemeConfig, getThemes, saveThemeConfig, uploadTheme } from "@/api/misc";

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
  // /theme/getThemes 返回 { themes: { name: config } }
  const themesObj = (data as any)?.themes ?? data ?? {};
  const list: any[] = Object.entries(themesObj).map(([name, cfg]: [string, any]) => ({
    name,
    version: cfg?.version,
    description: cfg?.description,
    is_current: cfg?.is_current,
    images: cfg?.images,
    config: cfg,
  }));

  const onUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      await uploadTheme(fd);
      toast.success(t("theme.upload.uploading").includes("上传中") ? "上传成功" : "Upload success");
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
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Palette className="mb-3 h-10 w-10" />
            <p>暂无主题</p>
          </CardContent>
        </Card>
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
                    <Button size="sm" variant="outline" onClick={async () => {
                      try {
                        await saveThemeConfig({ name: th.name, config: { ...th, is_current: true } });
                        toast.success("已激活");
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
  const [config, setConfig] = useState("{}");
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["theme", "config", name],
    queryFn: () => getThemeConfig(name!),
    enabled: !!name,
  });

  // 把配置载入到编辑器（仅在第一次）
  if (name && config === "{}" && data && data !== "__loaded__") {
    setConfig(JSON.stringify(data, null, 2));
    // 标记已加载（用一个不可见的状态字段）
    (data as any).__loaded__ = true;
  }

  const submit = async () => {
    if (!name) return;
    setSaving(true);
    try {
      const parsed = JSON.parse(config || "{}");
      await saveThemeConfig({ name, config: parsed });
      toast.success(t("theme.config.success"));
      onOpenChange(false);
    } catch (e) {
      toast.error("JSON 格式错误");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={!!name} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {name && t("theme.config.title", { name })}
          </DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <Skeleton className="h-40" />
        ) : (
          <div className="space-y-2">
            <Label>配置 (JSON)</Label>
            <Textarea
              rows={20}
              value={config}
              onChange={(e) => setConfig(e.target.value)}
              className="font-mono text-xs"
            />
          </div>
        )}
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("theme.config.cancel")}
          </Button>
          <Button onClick={submit} disabled={saving}>
            {t("theme.config.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
