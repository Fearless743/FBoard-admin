import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { SectionCard } from "../section-card";
import { SectionSkeleton } from "../section-skeleton";
import { useConfigSection } from "../use-config-section";
import { useSectionData } from "../use-section-data";
import { CodeEditor } from "../code-editor";
import type { FieldDef } from "../schema";

const KEYS: Array<{ key: string; client: string; lang: "json" | "yaml" | "conf" }> = [
  { key: "subscribe_template_singbox", client: "singbox", lang: "json" },
  { key: "subscribe_template_clash", client: "clash", lang: "yaml" },
  { key: "subscribe_template_clashmeta", client: "clashmeta", lang: "yaml" },
  { key: "subscribe_template_stash", client: "stash", lang: "yaml" },
  { key: "subscribe_template_surge", client: "surge", lang: "conf" },
  { key: "subscribe_template_surfboard", client: "surfboard", lang: "conf" },
];

export function SubscribeTemplateSection() {
  const { data, isLoading } = useSectionData("subscribe_template");
  if (isLoading || !data) return <SectionSkeleton />;
  return <SubscribeTemplateSectionBody data={data} />;
}

function SubscribeTemplateSectionBody({ data }: { data: Record<string, unknown> }) {
  const { t } = useTranslation();
  const [active, setActive] = useState(KEYS[0].client);
  const fields: FieldDef[] = KEYS.map(({ key }) => ({
    key,
    type: "textarea",
    label: "",
    description: "",
    rows: 22,
  }));
  const section = {
    key: "subscribe_template",
    title: t("settings.subscribe_template.title"),
    description: t("settings.subscribe_template.description"),
    fields,
  };
  const { values, set, dirty, saving, save, reset } = useConfigSection(section, data, { autoSave: true });
  return (
    <SectionCard
      title={section.title}
      description={section.description}
      dirty={dirty}
      saving={saving}
      autoSave
      onReset={reset}
    >
      <Tabs value={active} onValueChange={setActive}>
        <TabsList className="flex flex-wrap">
          {KEYS.map(({ key, client }) => (
            <TabsTrigger key={key} value={client} className="gap-2">
              {t(`settings.subscribe_template.${client}.title`)}
              {values[key] !== data[key] && (
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-label="unsaved" />
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        {KEYS.map(({ key, client, lang }) => (
          <TabsContent key={key} value={client} className="space-y-2">
            <p className="text-xs text-muted-foreground">
              {t(`settings.subscribe_template.${client}.description`)}
            </p>
            <CodeEditor
              value={(values[key] as string) ?? ""}
              onChange={(v) => set(key, v)}
              language={lang}
            />
          </TabsContent>
        ))}
      </Tabs>
    </SectionCard>
  );
}