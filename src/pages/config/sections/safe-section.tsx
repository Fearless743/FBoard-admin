import { useTranslation } from "react-i18next";
import { FieldRow, SwitchGroup } from "../field";
import { SectionCard } from "../section-card";
import { SectionSkeleton } from "../section-skeleton";
import { useConfigSection } from "../use-config-section";
import { useSectionData } from "../use-section-data";
import type { FieldDef } from "../schema";

type SwitchKey = "email_verify" | "safe_mode_enable" | "email_gmail_limit_enable"
  | "register_limit_by_ip_enable" | "password_limit_enable"
  | "email_whitelist_enable" | "captcha_enable";

const STANDALONE_SWITCHES: SwitchKey[] = [
  "email_verify",
  "safe_mode_enable",
  "email_gmail_limit_enable",
];

const baseFields: FieldDef[] = [
  { key: "secure_path", type: "text", label: "", placeholder: "admin" },
  { key: "register_limit_count", type: "number", label: "", placeholder: "3", min: 1 },
  { key: "register_limit_expire", type: "number", label: "", placeholder: "60", min: 1 },
  { key: "password_limit_count", type: "number", label: "", placeholder: "5", min: 1 },
  { key: "password_limit_expire", type: "number", label: "", placeholder: "60", min: 1 },
  { key: "email_whitelist_suffix", type: "tags", label: "", placeholder: "" },
  { key: "captcha_type", type: "select", label: "", options: [] },
  { key: "recaptcha_key", type: "text", label: "", placeholder: "" },
  { key: "recaptcha_site_key", type: "text", label: "", placeholder: "" },
  { key: "recaptcha_v3_secret_key", type: "password", label: "", placeholder: "" },
  { key: "recaptcha_v3_site_key", type: "text", label: "", placeholder: "" },
  { key: "recaptcha_v3_score_threshold", type: "number", label: "", placeholder: "0.5", min: 0, max: 1, step: 0.1 },
  { key: "turnstile_secret_key", type: "password", label: "", placeholder: "" },
  { key: "turnstile_site_key", type: "text", label: "", placeholder: "" },
];

const SWITCH_I18N: Record<SwitchKey, string> = {
  email_verify: "emailVerify",
  safe_mode_enable: "safeMode",
  email_gmail_limit_enable: "gmailLimit",
  register_limit_by_ip_enable: "registerLimit.enable",
  password_limit_enable: "passwordLimit.enable",
  email_whitelist_enable: "emailWhitelist",
  captcha_enable: "captcha.enable",
};

export function SafeSection() {
  const { data, isLoading } = useSectionData("safe");
  if (isLoading || !data) return <SectionSkeleton />;
  return <SafeSectionBody data={data} />;
}

function SafeSectionBody({ data }: { data: Record<string, unknown> }) {
  const { t } = useTranslation();
  const detailFields: FieldDef[] = baseFields.map((f) => resolveField(f, t));
  const detailMap = Object.fromEntries(detailFields.map((f) => [f.key, f]));
  const section = {
    key: "safe",
    title: t("settings.safe.title"),
    description: t("settings.safe.description"),
    fields: [...Object.values(detailMap)],
  };
  const { values, set, dirty, saving, reset } = useConfigSection(section, data, { autoSave: true });

  const captchaType = String(values.captcha_type ?? "");
  const captchaEnabled = !!values.captcha_enable;

  const switchMeta = (k: SwitchKey) => ({
    label: t(`settings.safe.form.${SWITCH_I18N[k]}.label`),
    description: t(`settings.safe.form.${SWITCH_I18N[k]}.description`, { defaultValue: "" }),
  });

  const renderField = (key: string) => {
    const f = detailMap[key];
    if (!f) return null;
    return (
      <FieldRow
        key={key}
        field={f}
        value={values[f.key]}
        onChange={(v) => set(f.key, v)}
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
          label={switchMeta("register_limit_by_ip_enable").label}
          description={switchMeta("register_limit_by_ip_enable").description}
          checked={!!values.register_limit_by_ip_enable}
          onChange={(v) => set("register_limit_by_ip_enable", v)}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {renderField("register_limit_count")}
            {renderField("register_limit_expire")}
          </div>
        </SwitchGroup>

        <SwitchGroup
          label={switchMeta("password_limit_enable").label}
          description={switchMeta("password_limit_enable").description}
          checked={!!values.password_limit_enable}
          onChange={(v) => set("password_limit_enable", v)}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {renderField("password_limit_count")}
            {renderField("password_limit_expire")}
          </div>
        </SwitchGroup>

        <SwitchGroup
          label={switchMeta("email_whitelist_enable").label}
          description={switchMeta("email_whitelist_enable").description}
          checked={!!values.email_whitelist_enable}
          onChange={(v) => set("email_whitelist_enable", v)}
        >
          {renderField("email_whitelist_suffix")}
        </SwitchGroup>

        <SwitchGroup
          label={switchMeta("captcha_enable").label}
          description={switchMeta("captcha_enable").description}
          checked={captchaEnabled}
          onChange={(v) => set("captcha_enable", v)}
        >
          <div className="space-y-4">
            {renderField("captcha_type")}
            {captchaEnabled && captchaType === "recaptcha" && (
              <div className="grid gap-4 sm:grid-cols-2">
                {renderField("recaptcha_key")}
                {renderField("recaptcha_site_key")}
              </div>
            )}
            {captchaEnabled && captchaType === "recaptcha-v3" && (
              <div className="grid gap-4 sm:grid-cols-2">
                {renderField("recaptcha_v3_secret_key")}
                {renderField("recaptcha_v3_site_key")}
                {renderField("recaptcha_v3_score_threshold")}
              </div>
            )}
            {captchaEnabled && captchaType === "turnstile" && (
              <div className="grid gap-4 sm:grid-cols-2">
                {renderField("turnstile_secret_key")}
                {renderField("turnstile_site_key")}
              </div>
            )}
          </div>
        </SwitchGroup>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {renderField("secure_path")}
      </div>
    </SectionCard>
  );
}

function resolveField(f: FieldDef, t: (k: string, opts?: any) => string): FieldDef {
  const base = {
    ...f,
    label: t(`settings.safe.form.${i18nPath(f.key)}.label`),
    description: t(`settings.safe.form.${i18nPath(f.key)}.description`, { defaultValue: "" }),
    placeholder: t(`settings.safe.form.${i18nPath(f.key)}.placeholder`, {
      defaultValue: f.placeholder,
    }),
  };
  if (f.key === "captcha_type") {
    return {
      ...base,
      options: [
        { value: "recaptcha", label: t("settings.safe.form.captcha.type.options.recaptcha") },
        { value: "recaptcha-v3", label: t("settings.safe.form.captcha.type.options.recaptcha-v3") },
        { value: "turnstile", label: t("settings.safe.form.captcha.type.options.turnstile") },
      ],
    };
  }
  return base;
}

function i18nPath(key: string): string {
  const map: Record<string, string> = {
    secure_path: "securePath",
    register_limit_count: "registerLimit.count",
    register_limit_expire: "registerLimit.expire",
    password_limit_count: "passwordLimit.count",
    password_limit_expire: "passwordLimit.expire",
    email_whitelist_suffix: "emailWhitelist.suffixes",
    captcha_type: "captcha.type",
    recaptcha_key: "captcha.recaptcha.key",
    recaptcha_site_key: "captcha.recaptcha.siteKey",
    recaptcha_v3_secret_key: "captcha.recaptcha_v3.secretKey",
    recaptcha_v3_site_key: "captcha.recaptcha_v3.siteKey",
    recaptcha_v3_score_threshold: "captcha.recaptcha_v3.scoreThreshold",
    turnstile_secret_key: "captcha.turnstile.secretKey",
    turnstile_site_key: "captcha.turnstile.siteKey",
  };
  return map[key] ?? key;
}