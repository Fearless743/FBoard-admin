import { useTranslation } from "react-i18next";
import { FieldRow } from "../field";
import { SectionCard } from "../section-card";
import { SectionSkeleton } from "../section-skeleton";
import { useConfigSection } from "../use-config-section";
import { useSectionData } from "../use-section-data";
import { usePlanOptions } from "@/hooks/use-plans";
import type { FieldDef } from "../schema";

const fields: FieldDef[] = [
  { key: "app_name", type: "text", label: "", placeholder: "" },
  { key: "app_description", type: "textarea", label: "", placeholder: "", rows: 3 },
  { key: "app_url", type: "text", label: "", placeholder: "" },
  { key: "logo", type: "text", label: "", placeholder: "" },
  { key: "subscribe_url", type: "text", label: "", placeholder: "" },
  { key: "tos_url", type: "text", label: "", placeholder: "" },
  { key: "currency", type: "text", label: "", placeholder: "CNY" },
  { key: "currency_symbol", type: "text", label: "", placeholder: "¥" },
  { key: "force_https", type: "switch", label: "" },
  { key: "stop_register", type: "switch", label: "" },
  { key: "ticket_must_wait_reply", type: "switch", label: "" },
  { key: "try_out_plan_id", type: "select", label: "", placeholder: "" },
  { key: "try_out_hour", type: "number", label: "", placeholder: "1", min: 0 },
];

export function SiteSection() {
  const { data, isLoading } = useSectionData("site");
  if (isLoading || !data) return <SectionSkeleton />;
  return <SiteSectionBody data={data} />;
}

function SiteSectionBody({ data }: { data: Record<string, unknown> }) {
  const { t } = useTranslation();
  const planOptions = usePlanOptions();
  const plans = planOptions.data || [];
  const section = {
    key: "site",
    title: t("settings.site.title"),
    description: t("settings.site.description"),
    fields: fields.map((f) => {
      const base = {
        key: f.key,
        type: f.type,
        label: t(`settings.site.form.${labelKey(f.key)}.label`),
        placeholder: t(`settings.site.form.${labelKey(f.key)}.placeholder`, {
          defaultValue: (f as any).placeholder ?? "",
        }),
        description: t(`settings.site.form.${labelKey(f.key)}.description`, {
          defaultValue: "",
        }),
      };
      if (f.key === "try_out_plan_id" && f.type === "select") {
        return {
          ...base,
          type: "select" as const,
          options: [
            { value: 0, label: t("settings.site.form.tryOut.no_plan") },
            ...plans.map((p: { id: number; name: string }) => ({
              value: p.id,
              label: p.name,
            })),
          ],
        };
      }
      if (f.type === "number") {
        return { ...base, type: "number" as const, min: (f as any).min, placeholder: (f as any).placeholder ?? "" };
      }
      return base;
    }),
  };
  const { values, set, dirty, saving, reset } = useConfigSection(section, data, { autoSave: true });
  return (
    <SectionCard
      title={section.title}
      description={section.description}
      dirty={dirty}
      saving={saving}
      autoSave
      onReset={reset}
    >
      {section.fields.map((f) => (
        <FieldRow
          key={f.key}
          field={f}
          value={values[f.key]}
          onChange={(v) => set(f.key, v)}
        />
      ))}
    </SectionCard>
  );
}

function labelKey(key: string): string {
  const map: Record<string, string> = {
    app_name: "siteName",
    app_description: "siteDescription",
    app_url: "siteUrl",
    logo: "logo",
    subscribe_url: "subscribeUrl",
    tos_url: "tosUrl",
    currency: "currency",
    currency_symbol: "currencySymbol",
    force_https: "forceHttps",
    stop_register: "stopRegister",
    ticket_must_wait_reply: "ticketMustWaitReply",
    try_out_plan_id: "tryOut",
    try_out_hour: "tryOut.duration",
  };
  return map[key] ?? key;
}