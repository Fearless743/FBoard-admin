import { useTranslation } from "react-i18next";
import { FieldRow } from "../field";
import { SectionCard } from "../section-card";
import { SectionSkeleton } from "../section-skeleton";
import { useConfigSection } from "../use-config-section";
import { useSectionData } from "../use-section-data";
import type { FieldDef } from "../schema";

const switchKeys: Array<{ key: string; i18n: string }> = [
  { key: "plan_change_enable", i18n: "plan_change_enable" },
  { key: "surplus_enable", i18n: "surplus_enable" },
  { key: "show_info_to_server_enable", i18n: "show_info_to_server" },
  { key: "show_protocol_to_server_enable", i18n: "show_protocol_to_server" },
  { key: "default_remind_expire", i18n: "default_remind_expire" },
  { key: "default_remind_traffic", i18n: "default_remind_traffic" },
];

const baseFields: FieldDef[] = [
  { key: "reset_traffic_method", type: "select", label: "", options: [] },
  { key: "subscribe_path", type: "text", label: "", placeholder: "" },
  { key: "new_order_event_id", type: "select", label: "", options: [] },
  { key: "renew_order_event_id", type: "select", label: "", options: [] },
  { key: "change_order_event_id", type: "select", label: "", options: [] },
];

const I18N_OVERRIDE: Record<string, string> = {
  new_order_event_id: "new_order_event",
  renew_order_event_id: "renew_order_event",
  change_order_event_id: "change_order_event",
};

export function SubscribeSection() {
  const { data, isLoading } = useSectionData("subscribe");
  if (isLoading || !data) return <SectionSkeleton />;
  return <SubscribeSectionBody data={data} />;
}

function SubscribeSectionBody({ data }: { data: Record<string, unknown> }) {
  const { t } = useTranslation();
  const switchFields: FieldDef[] = switchKeys.map(({ key, i18n }) => ({
    key,
    type: "switch",
    label: t(`settings.subscribe.${i18n}.title`),
    description: t(`settings.subscribe.${i18n}.description`, { defaultValue: "" }),
  }));
  const detailFields: FieldDef[] = baseFields.map((f) => resolve(f, t));
  const section = {
    key: "subscribe",
    title: t("settings.subscribe.title"),
    description: t("settings.subscribe.description"),
    fields: [...switchFields, ...detailFields],
  };
  const { values, set, dirty, saving, reset } = useConfigSection(section, data, { autoSave: true });
  const subPath = String(values.subscribe_path ?? "");
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
        {switchFields.map((f) => (
          <FieldRow key={f.key} field={f} value={values[f.key]} onChange={(v) => set(f.key, v)} />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {detailFields.map((f) => (
          <div key={f.key} className="space-y-2">
            <FieldRow field={f} value={values[f.key]} onChange={(v) => set(f.key, v)} />
            {f.key === "subscribe_path" && subPath && (
              <p className="rounded-md bg-muted px-3 py-2 font-mono text-xs text-muted-foreground">
                {t("settings.subscribe.subscribe_path.current_format", { path: subPath })}
              </p>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-amber-600 dark:text-amber-400">
        {t("settings.subscribe.subscribe_path.restart_tip")}
      </p>
    </SectionCard>
  );
}

function resolve(f: FieldDef, t: (k: string, opts?: any) => string): FieldDef {
  const i18nKey = I18N_OVERRIDE[f.key] ?? f.key;
  const base = {
    ...f,
    label: t(`settings.subscribe.${i18nKey}.title`),
    description: t(`settings.subscribe.${i18nKey}.description`, { defaultValue: "" }),
    placeholder: t(`settings.subscribe.${i18nKey}.placeholder`, {
      defaultValue: f.placeholder,
    }),
  };
  if (f.key === "reset_traffic_method") {
    return {
      ...base,
      options: [
        { value: 0, label: t("settings.subscribe.reset_traffic_method.options.monthly_first") },
        { value: 1, label: t("settings.subscribe.reset_traffic_method.options.monthly_reset") },
        { value: 2, label: t("settings.subscribe.reset_traffic_method.options.no_reset") },
        { value: 3, label: t("settings.subscribe.reset_traffic_method.options.yearly_first") },
        { value: 4, label: t("settings.subscribe.reset_traffic_method.options.yearly_reset") },
      ],
    };
  }
  if (f.key.endsWith("_event_id")) {
    return {
      ...base,
      options: [
        { value: 0, label: t("settings.subscribe.new_order_event.options.no_action") },
        { value: 1, label: t("settings.subscribe.new_order_event.options.reset_traffic") },
      ],
    };
  }
  return base;
}