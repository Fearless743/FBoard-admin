import { useTranslation } from "react-i18next";
import { FieldRow } from "../field";
import { SectionCard } from "../section-card";
import { SectionSkeleton } from "../section-skeleton";
import { useConfigSection } from "../use-config-section";
import { useSectionData } from "../use-section-data";
import type { FieldDef } from "../schema";

const fields: FieldDef[] = [
  { key: "windows_version", type: "text", label: "", placeholder: "" },
  { key: "windows_download_url", type: "text", label: "", placeholder: "" },
  { key: "macos_version", type: "text", label: "", placeholder: "" },
  { key: "macos_download_url", type: "text", label: "", placeholder: "" },
  { key: "android_version", type: "text", label: "", placeholder: "" },
  { key: "android_download_url", type: "text", label: "", placeholder: "" },
];

export function AppSection() {
  const { data, isLoading } = useSectionData("app");
  if (isLoading || !data) return <SectionSkeleton />;
  return <AppSectionBody data={data} />;
}

function AppSectionBody({ data }: { data: Record<string, unknown> }) {
  const { t } = useTranslation();
  const section = {
    key: "app",
    title: t("settings.app.title"),
    description: t("settings.app.description"),
    fields: fields.map((f) => ({
      ...f,
      label: t(`settings.app.${osOf(f.key)}.${verOf(f.key)}.title`),
      description: t(`settings.app.${osOf(f.key)}.${verOf(f.key)}.description`, {
        defaultValue: "",
      }),
      placeholder: t("settings.app.common.placeholder"),
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
      <div className="grid gap-6 md:grid-cols-3">
        {(["windows", "macos", "android"] as const).map((os) => (
          <div key={os} className="space-y-4 rounded-lg border bg-card/50 p-4">
            <h4 className="text-sm font-semibold capitalize">{os}</h4>
            {section.fields
              .filter((f) => osOf(f.key) === os)
              .map((f) => (
                <FieldRow
                  key={f.key}
                  field={f}
                  value={values[f.key]}
                  onChange={(v) => set(f.key, v)}
                />
              ))}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function osOf(key: string): string {
  if (key.startsWith("windows")) return "windows";
  if (key.startsWith("macos")) return "macos";
  return "android";
}

function verOf(key: string): "version" | "download" {
  return key.endsWith("_version") ? "version" : "download";
}