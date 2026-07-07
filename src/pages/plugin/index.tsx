import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Upload, Trash2, Puzzle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Textarea } from "@/components/ui/textarea";
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
  fetchPlugins,
  installPlugin,
  savePluginConfig,
  uninstallPlugin,
  uploadPlugin,
} from "@/api/misc";

export function PluginPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [action, setAction] = useState<{ name: string; type: "uninstall" | "delete" } | null>(null);
  const [configuring, setConfiguring] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["plugins"],
    queryFn: fetchPlugins,
  });
  const list: any[] = data || [];

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
              onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
            />
            <Button onClick={() => document.getElementById("plugin-upload")?.click()}>
              <Upload className="h-4 w-4" />
              {t("plugin.upload.button")}
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
            <Puzzle className="mb-3 h-10 w-10" />
            <p>暂无插件</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <Card key={p.name}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{p.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {p.version || "—"} · {p.description || ""}
                    </p>
                  </div>
                  {p.status === "enabled" ? (
                    <Badge variant="success">{t("plugin.status.enabled")}</Badge>
                  ) : p.status === "disabled" ? (
                    <Badge variant="secondary">{t("plugin.status.disabled")}</Badge>
                  ) : (
                    <Badge variant="outline">{t("plugin.status.not_installed")}</Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  {p.status === "not_installed" ? (
                    <Button
                      size="sm"
                      onClick={async () => {
                        try {
                          await installPlugin(p.name);
                          toast.success(t("plugin.messages.installSuccess"));
                          qc.invalidateQueries({ queryKey: ["plugins"] });
                        } catch (e) {}
                      }}
                    >
                      {t("plugin.button.install")}
                    </Button>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setConfiguring(p.name)}
                      >
                        {t("plugin.button.config")}
                      </Button>
                      {p.status === "enabled" ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={async () => {
                            try {
                              await disablePlugin(p.name);
                              toast.success(t("plugin.messages.disableSuccess"));
                              qc.invalidateQueries({ queryKey: ["plugins"] });
                            } catch (e) {}
                          }}
                        >
                          {t("plugin.button.disable")}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={async () => {
                            try {
                              await enablePlugin(p.name);
                              toast.success(t("plugin.messages.enableSuccess"));
                              qc.invalidateQueries({ queryKey: ["plugins"] });
                            } catch (e) {}
                          }}
                        >
                          {t("plugin.button.enable")}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setAction({ name: p.name, type: "uninstall" })}
                      >
                        {t("plugin.button.uninstall")}
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => setAction({ name: p.name, type: "delete" })}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
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
        confirmText={action?.type === "uninstall" ? t("plugin.uninstall.button") : t("plugin.delete.button")}
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
        name={configuring}
        onOpenChange={(v) => !v && setConfiguring(null)}
      />
    </>
  );
}

function PluginConfigDialog({
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
    queryKey: ["plugin", "config", name],
    queryFn: () => configPlugin(name!),
    enabled: !!name,
  });

  if (name && config === "{}" && data && !(data as any).__loaded__) {
    setConfig(JSON.stringify(data, null, 2));
    (data as any).__loaded__ = true;
  }

  const submit = async () => {
    if (!name) return;
    setSaving(true);
    try {
      const parsed = JSON.parse(config || "{}");
      await savePluginConfig(name, parsed);
      toast.success(t("plugin.messages.configSaveSuccess"));
      onOpenChange(false);
    } catch (e) {
      toast.error("JSON 格式错误");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={!!name} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{name} · {t("plugin.config.title")}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <Skeleton className="h-40" />
        ) : (
          <div className="space-y-2">
            <Label>配置 (JSON)</Label>
            <Textarea
              rows={15}
              value={config}
              onChange={(e) => setConfig(e.target.value)}
              className="font-mono text-xs"
            />
          </div>
        )}
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("plugin.config.cancel")}
          </Button>
          <Button onClick={submit} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("plugin.config.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
