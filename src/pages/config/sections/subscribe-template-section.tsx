import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { fetchSubscribeTemplate, saveConfig } from "@/api/config";
import { SectionCard } from "../section-card";
import { SectionSkeleton } from "../section-skeleton";
const CodeEditor = lazy(() => import("../code-editor").then((m) => ({ default: m.CodeEditor })));

const KEYS: Array<{ key: string; client: string; lang: "json" | "yaml" | "conf" }> = [
  { key: "subscribe_template_singbox", client: "singbox", lang: "json" },
  { key: "subscribe_template_clash", client: "clash", lang: "yaml" },
  { key: "subscribe_template_clashmeta", client: "clashmeta", lang: "yaml" },
  { key: "subscribe_template_stash", client: "stash", lang: "yaml" },
  { key: "subscribe_template_surge", client: "surge", lang: "conf" },
  { key: "subscribe_template_surfboard", client: "surfboard", lang: "conf" },
];

export function SubscribeTemplateSection() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [active, setActive] = useState(KEYS[0].client);
  // 本地草稿 / 服务端基线，按 fieldKey 索引；仅加载过的模板会有条目
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [baselines, setBaselines] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const activeMeta = KEYS.find((k) => k.client === active) ?? KEYS[0];
  const activeKey = activeMeta.key;

  const dirtyClients = useMemo(() => {
    const set = new Set<string>();
    for (const { key, client } of KEYS) {
      if (!(key in drafts) || !(key in baselines)) continue;
      if (drafts[key] !== baselines[key]) set.add(client);
    }
    return set;
  }, [drafts, baselines]);

  const dirty = dirtyClients.size > 0;
  const activeDirty = dirtyClients.has(active);

  const setActiveValue = useCallback(
    (value: string) => {
      setDrafts((prev) => ({ ...prev, [activeKey]: value }));
    },
    [activeKey],
  );

  const handleLoaded = useCallback((fieldKey: string, content: string) => {
    setBaselines((prev) => {
      if (prev[fieldKey] === content) return prev;
      return { ...prev, [fieldKey]: content };
    });
    // 仅在尚无草稿时写入，避免覆盖用户未保存的编辑
    setDrafts((prev) => {
      if (fieldKey in prev) return prev;
      return { ...prev, [fieldKey]: content };
    });
  }, []);

  const save = useCallback(async () => {
    const changed: Record<string, string> = {};
    for (const { key } of KEYS) {
      if (key in drafts && key in baselines && drafts[key] !== baselines[key]) {
        changed[key] = drafts[key];
      }
    }
    if (Object.keys(changed).length === 0) return;
    setSaving(true);
    try {
      await saveConfig(changed);
      setBaselines((prev) => ({ ...prev, ...changed }));
      setDrafts((prev) => ({ ...prev, ...changed }));
      for (const [fieldKey, content] of Object.entries(changed)) {
        const client = fieldKey.replace(/^subscribe_template_/, "");
        qc.setQueryData(["config", "subscribe_template", client], content);
      }
      toast.success(t("settings.common.save_success"));
    } catch {
      toast.error(t("settings.common.save_error"));
    } finally {
      setSaving(false);
    }
  }, [baselines, drafts, qc, t]);

  const reset = useCallback(() => {
    setDrafts((prev) => {
      const next = { ...prev };
      for (const { key } of KEYS) {
        if (key in baselines) next[key] = baselines[key];
      }
      return next;
    });
  }, [baselines]);

  const activeValue = drafts[activeKey] ?? baselines[activeKey] ?? "";

  return (
    <SectionCard
      title={t("settings.subscribe_template.title")}
      description={t("settings.subscribe_template.description")}
      dirty={dirty}
      saving={saving}
      onSave={save}
      onReset={reset}
    >
      <Tabs value={active} onValueChange={setActive}>
        <TabsList className="flex flex-wrap">
          {KEYS.map(({ key, client }) => (
            <TabsTrigger key={key} value={client} className="gap-2">
              {t(`settings.subscribe_template.${client}.title`)}
              {dirtyClients.has(client) && (
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
            {active === client && (
              <TemplateEditor
                client={client}
                fieldKey={key}
                lang={lang}
                value={activeValue}
                loaded={key in baselines}
                onChange={setActiveValue}
                onLoaded={handleLoaded}
              />
            )}
          </TabsContent>
        ))}
      </Tabs>
      {activeDirty && (
        <p className="text-xs text-muted-foreground">
          {t("settings.subscribe_template.unsaved_hint")}
        </p>
      )}
    </SectionCard>
  );
}

function TemplateEditor({
  client,
  fieldKey,
  lang,
  value,
  loaded,
  onChange,
  onLoaded,
}: {
  client: string;
  fieldKey: string;
  lang: "json" | "yaml" | "conf";
  value: string;
  loaded: boolean;
  onChange: (v: string) => void;
  onLoaded: (fieldKey: string, content: string) => void;
}) {
  const { t } = useTranslation();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["config", "subscribe_template", client],
    queryFn: () => fetchSubscribeTemplate(client),
    staleTime: 60_000,
  });

  useEffect(() => {
    if (typeof data === "string") {
      onLoaded(fieldKey, data);
    }
  }, [data, fieldKey, onLoaded]);

  if (isError) {
    return (
      <p className="text-sm text-destructive">
        {(error as Error)?.message ?? t("settings.common.save_error")}
      </p>
    );
  }

  // 父组件尚未写入 baseline 时，用 query 结果直接展示，避免空内容闪一帧
  const displayValue = loaded ? value : typeof data === "string" ? data : value;

  if (isLoading || (typeof data !== "string" && !loaded)) {
    return <SectionSkeleton />;
  }

  return <Suspense fallback={<SectionSkeleton />}><CodeEditor value={displayValue} onChange={onChange} language={lang} /></Suspense>;
}
