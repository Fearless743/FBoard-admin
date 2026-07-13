import { useTranslation } from "react-i18next";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldRow, SwitchGroup } from "../field";
import { SectionCard } from "../section-card";
import { SectionSkeleton } from "../section-skeleton";
import { useConfigSection } from "../use-config-section";
import { useSectionData } from "../use-section-data";

const NUMBER_FIELDS = ["server_pull_interval", "server_push_interval"];
const SELECT_FIELDS = ["device_limit_mode"];
const TEXT_FIELDS = ["node_install_script_url"];

export function ServerSection() {
  const { data, isLoading } = useSectionData("server");
  if (isLoading || !data) return <SectionSkeleton />;
  return <ServerSectionBody data={data} />;
}

function ServerSectionBody({ data }: { data: Record<string, unknown> }) {
  const { t } = useTranslation();
  const meta = (k: string) => ({
    label: t(`settings.server.${k}.title`),
    description: t(`settings.server.${k}.description`, { defaultValue: "" }),
    placeholder: t(`settings.server.${k}.placeholder`, { defaultValue: "" }),
  });

  const section = {
    key: "server",
    title: t("settings.server.title"),
    description: t("settings.server.description"),
    fields: [
      { key: "server_token", type: "text" as const, label: meta("server_token").label, description: meta("server_token").description, placeholder: meta("server_token").placeholder },
      { key: "server_ws_enable", type: "switch" as const, label: meta("server_ws_enable").label, description: meta("server_ws_enable").description },
      { key: "server_ws_url", type: "text" as const, label: meta("server_ws_url").label, description: meta("server_ws_url").description, placeholder: meta("server_ws_url").placeholder },
      ...NUMBER_FIELDS.map((k) => ({
        key: k,
        type: "number" as const,
        label: meta(k).label,
        description: meta(k).description,
        placeholder: meta(k).placeholder,
        min: 1,
      })),
      { key: "device_limit_mode", type: "select" as const, label: meta("device_limit_mode").label, description: meta("device_limit_mode").description, options: [
        { value: 0 as const, label: t("settings.server.device_limit_mode.strict") },
        { value: 1 as const, label: t("settings.server.device_limit_mode.relaxed") },
      ] },
      ...TEXT_FIELDS.map((k) => ({
        key: k,
        type: "text" as const,
        label: meta(k).label,
        description: meta(k).description,
        placeholder: meta(k).placeholder,
      })),
    ],
  };
  const { values, set, dirty, saving, reset } = useConfigSection(section, data, { autoSave: true });
  const wsEnabled = !!values.server_ws_enable;

  const generateToken = () => {
    const arr = new Uint8Array(24);
    crypto.getRandomValues(arr);
    const token = Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
    set("server_token", token);
  };

  const renderNumber = (key: string) => (
    <FieldRow
      key={key}
      field={{
        key,
        type: "number",
        label: meta(key).label,
        description: meta(key).description,
        placeholder: meta(key).placeholder,
        min: 1,
      }}
      value={values[key]}
      onChange={(v) => set(key, v)}
    />
  );

  const renderDeviceLimit = () => (
    <FieldRow
      key="device_limit_mode"
      field={{
        key: "device_limit_mode",
        type: "select",
        label: meta("device_limit_mode").label,
        description: meta("device_limit_mode").description,
        options: [
          { value: 0, label: t("settings.server.device_limit_mode.strict") },
          { value: 1, label: t("settings.server.device_limit_mode.relaxed") },
        ],
      }}
      value={values.device_limit_mode}
      onChange={(v) => set("device_limit_mode", v)}
    />
  );

  const renderText = (key: string) => (
    <FieldRow
      key={key}
      field={{
        key,
        type: "text",
        label: meta(key).label,
        description: meta(key).description,
        placeholder: meta(key).placeholder,
      }}
      value={values[key]}
      onChange={(v) => set(key, v)}
    />
  );

  return (
    <SectionCard
      title={section.title}
      description={section.description}
      dirty={dirty}
      saving={saving}
      autoSave
      onReset={reset}
    >
      <div className="space-y-4">
        <FieldRow
          field={{
            key: "server_token",
            type: "text",
            label: meta("server_token").label,
            description: meta("server_token").description,
            placeholder: meta("server_token").placeholder,
          }}
          value={values.server_token}
          onChange={(v) => set("server_token", v)}
        />
        <div className="-mt-2 flex justify-end">
          <Button variant="outline" size="sm" onClick={generateToken}>
            <RefreshCw className="h-4 w-4" />
            {t("settings.server.server_token.generate_tooltip")}
          </Button>
        </div>

        <SwitchGroup
          label={meta("server_ws_enable").label}
          description={meta("server_ws_enable").description}
          checked={wsEnabled}
          onChange={(v) => set("server_ws_enable", v)}
        >
          <FieldRow
            field={{
              key: "server_ws_url",
              type: "text",
              label: meta("server_ws_url").label,
              description: meta("server_ws_url").description,
              placeholder: meta("server_ws_url").placeholder,
            }}
            value={values.server_ws_url}
            onChange={(v) => set("server_ws_url", v)}
          />
          <p className="text-xs text-muted-foreground">
            {t("settings.server.server_ws_enable.supported_clients")}
          </p>
        </SwitchGroup>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {NUMBER_FIELDS.map(renderNumber)}
        {renderDeviceLimit()}
      </div>

      <div className="space-y-4">
        {TEXT_FIELDS.map(renderText)}
      </div>
    </SectionCard>
  );
}