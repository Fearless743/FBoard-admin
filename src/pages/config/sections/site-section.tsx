import { useTranslation } from "react-i18next";
import { FieldRow } from "../field";
import { SectionCard } from "../section-card";
import { SectionSkeleton } from "../section-skeleton";
import { useConfigSection } from "../use-config-section";
import { useSectionData } from "../use-section-data";
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
  { key: "try_out_plan_id", type: "number", label: "", placeholder: "0", min: 0 },
  { key: "try_out_hour", type: "number", label: "", placeholder: "1", min: 0 },
];

export function SiteSection() {
  const { data, isLoading } = useSectionData("site");
  if (isLoading || !data) return <SectionSkeleton />;
  return <SiteSectionBody data={data} />;
}

function SiteSectionBody({ data }: { data: Record<string, unknown> }) {
  const { t } = useTranslation();
  const section = {
    key: "site",
    title: t("settings.site.title"),
    description: t("settings.site.description"),
    fields: fields.map((f) => ({
      ...f,
      label: t(`settings.site.form.${labelKey(f.key)}.label`),
      placeholder: t(`settings.site.form.${labelKey(f.key)}.placeholder`, {
        defaultValue: f.placeholder,
      }),
      description: t(`settings.site.form.${labelKey(f.key)}.description`, {
        defaultValue: "",
      }),
    })),
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
    try_out_hour: "tryOut",
  };
  return map[key] ?? key;
}