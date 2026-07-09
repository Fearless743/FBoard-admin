import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FieldRow } from "../field";
import { SectionCard } from "../section-card";
import { SectionSkeleton } from "../section-skeleton";
import { useConfigSection } from "../use-config-section";
import { useSectionData } from "../use-section-data";
import { setTelegramWebhook } from "@/api/config";
import type { FieldDef } from "../schema";

const fields: FieldDef[] = [
  { key: "telegram_bot_enable", type: "switch", label: "" },
  { key: "telegram_bot_token", type: "password", label: "", placeholder: "" },
  { key: "telegram_webhook_url", type: "text", label: "", placeholder: "" },
  { key: "telegram_discuss_link", type: "text", label: "", placeholder: "" },
];

export function TelegramSection() {
  const { data, isLoading } = useSectionData("telegram");
  if (isLoading || !data) return <SectionSkeleton />;
  return <TelegramSectionBody data={data} />;
}

function TelegramSectionBody({ data }: { data: Record<string, unknown> }) {
  const { t } = useTranslation();
  const section = {
    key: "telegram",
    title: t("settings.telegram.title"),
    description: t("settings.telegram.description"),
    fields: fields.map((f) => ({
      ...f,
      label: t(`settings.telegram.${keyI18n(f.key)}.title`),
      description: t(`settings.telegram.${keyI18n(f.key)}.description`, {
        defaultValue: "",
      }),
      placeholder: t(`settings.telegram.${keyI18n(f.key)}.placeholder`, {
        defaultValue: f.placeholder,
      }),
    })),
  };
  const { values, set, dirty, saving, reset } = useConfigSection(section, data, { autoSave: true });
  const [setting, setSetting] = useState(false);
  const [debug, setDebug] = useState<any>(null);
  const runSet = async () => {
    setSetting(true);
    try {
      const r: any = await setTelegramWebhook({});
      setDebug(r?.data ?? r);
      toast.success(t("settings.telegram.webhook.success"));
    } catch (e: any) {
      toast.error(e?.message ?? t("settings.telegram.webhook.error"));
    } finally {
      setSetting(false);
    }
  };
  const webhookBase = String(values.telegram_webhook_url ?? "");
  const isCustom = webhookBase.trim().length > 0;
  const switches = section.fields.filter((f) => f.type === "switch");
  const inputs = section.fields.filter((f) => f.type !== "switch");
  return (
    <SectionCard
      title={section.title}
      description={section.description}
      dirty={dirty}
      saving={saving}
      autoSave
      onReset={reset}
    >
      <div className="space-y-2">
        {switches.map((f) => (
          <FieldRow key={f.key} field={f} value={values[f.key]} onChange={(v) => set(f.key, v)} />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {inputs.map((f) => (
          <FieldRow key={f.key} field={f} value={values[f.key]} onChange={(v) => set(f.key, v)} />
        ))}
      </div>
      <div className="rounded-lg border bg-muted/30 p-4">
        <p className="text-sm font-medium">{t("settings.telegram.webhook.title")}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {isCustom
            ? t("settings.telegram.webhook.target_custom", { url: webhookBase })
            : t("settings.telegram.webhook.target_default")}
        </p>
        <Button className="mt-3" onClick={runSet} disabled={setting}>
          {setting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {setting ? t("settings.telegram.webhook.setting") : t("settings.telegram.webhook.button")}
        </Button>
        {debug && (
          <div className="mt-3 rounded border bg-background p-3 text-xs">
            <p className="mb-1 font-medium">{t("settings.telegram.webhook.debug.title")}</p>
            <div className="space-y-0.5 font-mono text-muted-foreground">
              <p>
                <span className="text-foreground">{t("settings.telegram.webhook.debug.url")}:</span>{" "}
                {debug.webhook_url}
              </p>
              <p>
                <span className="text-foreground">{t("settings.telegram.webhook.debug.baseUrl")}:</span>{" "}
                {debug.webhook_base_url}
              </p>
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}

function keyI18n(key: string): string {
  const map: Record<string, string> = {
    telegram_bot_enable: "bot_enable",
    telegram_bot_token: "bot_token",
    telegram_webhook_url: "webhook_url",
    telegram_discuss_link: "discuss_link",
  };
  return map[key] ?? key;
}