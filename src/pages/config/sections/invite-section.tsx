import { useTranslation } from "react-i18next";
import { FieldRow, SwitchGroup } from "../field";
import { SectionCard } from "../section-card";
import { SectionSkeleton } from "../section-skeleton";
import { useConfigSection } from "../use-config-section";
import { useSectionData } from "../use-section-data";
import type { FieldDef } from "../schema";

const STANDALONE_SWITCHES = [
  "invite_force",
  "invite_never_expire",
  "commission_first_time_enable",
  "commission_auto_check_enable",
  "withdraw_close_enable",
];

const I18N_OVERRIDE: Record<string, string> = {
  commission_first_time_enable: "commission_first_time",
  commission_auto_check_enable: "commission_auto_check",
  withdraw_close_enable: "withdraw_close",
};

const NUMBER_FIELDS = ["invite_commission", "invite_gen_limit", "commission_withdraw_limit"];
const DISTRIBUTION_FIELDS = ["commission_distribution_l1", "commission_distribution_l2", "commission_distribution_l3"];

export function InviteSection() {
  const { data, isLoading } = useSectionData("invite");
  if (isLoading || !data) return <SectionSkeleton />;
  return <InviteSectionBody data={data} />;
}

function InviteSectionBody({ data }: { data: Record<string, unknown> }) {
  const { t } = useTranslation();

  const switchMeta = (k: string) => {
    const i18nKey = I18N_OVERRIDE[k] ?? k;
    return {
      label: t(`settings.invite.${i18nKey}.title`),
      description: t(`settings.invite.${i18nKey}.description`, { defaultValue: "" }),
      placeholder: t(`settings.invite.${i18nKey}.placeholder`, { defaultValue: "" }),
    };
  };

  const switchFields: FieldDef[] = STANDALONE_SWITCHES.map((k) => {
    const meta = switchMeta(k);
    return { key: k, type: "switch", label: meta.label, description: meta.description };
  });

  const numberFields: FieldDef[] = NUMBER_FIELDS.map((k) => {
    const meta = switchMeta(k);
    return {
      key: k,
      type: "number",
      label: meta.label,
      description: meta.description,
      placeholder: meta.placeholder,
      min: 0,
    };
  });

  const distributionFields: FieldDef[] = DISTRIBUTION_FIELDS.map((k) => {
    const level = k.slice(-2);
    return {
      key: k,
      type: "number",
      label: t(`settings.invite.commission_distribution.${level}`),
      description: "",
      placeholder: switchMeta("commission_distribution").placeholder,
      min: 0,
    };
  });

  const withdrawMethodField: FieldDef = {
    key: "commission_withdraw_method",
    type: "tags",
    label: switchMeta("commission_withdraw_method").label,
    description: switchMeta("commission_withdraw_method").description,
    placeholder: switchMeta("commission_withdraw_method").placeholder,
  };

  const distributionEnableField: FieldDef = {
    key: "commission_distribution_enable",
    type: "switch",
    label: switchMeta("commission_distribution").label,
    description: switchMeta("commission_distribution").description,
  };

  const section = {
    key: "invite",
    title: t("settings.invite.title"),
    description: t("settings.invite.description"),
    fields: [
      ...switchFields,
      distributionEnableField,
      ...distributionFields,
      ...numberFields,
      withdrawMethodField,
    ],
  };

  const { values, set, dirty, saving, reset } = useConfigSection(section, data, { autoSave: true });

  const distributionEnabled = !!values.commission_distribution_enable;
  const l1 = Number(values.commission_distribution_l1 ?? 0);
  const l2 = Number(values.commission_distribution_l2 ?? 0);
  const l3 = Number(values.commission_distribution_l3 ?? 0);
  const total = l1 + l2 + l3;
  const overLimit = distributionEnabled && total > 100;

  const renderNumberField = (key: string, placeholder?: string) => {
    const meta = switchMeta(key);
    return (
      <FieldRow
        key={key}
        field={{
          key,
          type: "number",
          label: meta.label,
          description: meta.description,
          placeholder: placeholder ?? meta.placeholder,
          min: 0,
        }}
        value={values[key]}
        onChange={(v) => set(key, v)}
      />
    );
  };

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
        {STANDALONE_SWITCHES.map((k) => {
          const meta = switchMeta(k);
          return (
            <FieldRow
              key={k}
              field={{ key: k, type: "switch", label: meta.label, description: meta.description }}
              value={values[k]}
              onChange={(v) => set(k, v)}
            />
          );
        })}

        <SwitchGroup
          label={switchMeta("commission_distribution").label}
          description={switchMeta("commission_distribution").description}
          checked={distributionEnabled}
          onChange={(v) => set("commission_distribution_enable", v)}
        >
          <div className="grid gap-4 sm:grid-cols-3">
            {DISTRIBUTION_FIELDS.map((k) => {
              const level = k.slice(-2);
              return (
                <FieldRow
                  key={k}
                  field={{
                    key: k,
                    type: "number",
                    label: t(`settings.invite.commission_distribution.${level}`),
                    description: "",
                    placeholder: switchMeta("commission_distribution").placeholder,
                    min: 0,
                  }}
                  value={values[k]}
                  onChange={(v) => set(k, v)}
                />
              );
            })}
          </div>
          <div className={overLimit ? "text-xs text-destructive" : "text-xs text-muted-foreground"}>
            {t("settings.invite.distribution_total", { total })}
          </div>
        </SwitchGroup>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {NUMBER_FIELDS.map((k) => renderNumberField(k))}
        <FieldRow
          field={{
            key: "commission_withdraw_method",
            type: "tags",
            label: switchMeta("commission_withdraw_method").label,
            description: switchMeta("commission_withdraw_method").description,
            placeholder: switchMeta("commission_withdraw_method").placeholder,
          }}
          value={values.commission_withdraw_method}
          onChange={(v) => set("commission_withdraw_method", v)}
        />
      </div>
    </SectionCard>
  );
}