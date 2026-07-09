import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldRow } from "../field";
import { SectionCard } from "../section-card";
import { SectionSkeleton } from "../section-skeleton";
import { useConfigSection } from "../use-config-section";
import { useSectionData } from "../use-section-data";
import { testSendMail } from "@/api/config";
import type { FieldDef } from "../schema";

const fields: FieldDef[] = [
  { key: "email_host", type: "text", label: "", placeholder: "smtp.example.com" },
  { key: "email_port", type: "number", label: "", placeholder: "465", min: 1, max: 65535 },
  { key: "email_username", type: "text", label: "", placeholder: "" },
  { key: "email_password", type: "password", label: "", placeholder: "" },
  { key: "email_encryption", type: "select", label: "", options: [] },
  { key: "email_from_address", type: "text", label: "", placeholder: "noreply@example.com" },
  { key: "remind_mail_enable", type: "switch", label: "" },
];

export function EmailSection() {
  const { data, isLoading } = useSectionData("email");
  if (isLoading || !data) return <SectionSkeleton />;
  return <EmailSectionBody data={data} />;
}

function EmailSectionBody({ data }: { data: Record<string, unknown> }) {
  const { t } = useTranslation();
  const section = {
    key: "email",
    title: t("settings.email.title"),
    description: t("settings.email.description"),
    fields: fields.map((f) => resolve(f, t)),
  };
  const { values, set, dirty, saving, reset } = useConfigSection(section, data, { autoSave: true });
  const [test, setTest] = useState({ to: "", subject: "", content: "" });
  const [testing, setTesting] = useState(false);
  const runTest = async () => {
    setTesting(true);
    try {
      await testSendMail(test);
      toast.success(t("settings.email.test.success"));
    } catch {
      toast.error(t("settings.email.test.error"));
    } finally {
      setTesting(false);
    }
  };
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
      <div className="grid gap-4 md:grid-cols-2">
        {inputs.map((f) => (
          <FieldRow key={f.key} field={f} value={values[f.key]} onChange={(v) => set(f.key, v)} />
        ))}
      </div>
      <div className="space-y-2">
        {switches.map((f) => (
          <FieldRow key={f.key} field={f} value={values[f.key]} onChange={(v) => set(f.key, v)} />
        ))}
      </div>
      <div className="rounded-lg border bg-muted/30 p-4">
        <div className="mb-3">
          <p className="text-sm font-medium">{t("settings.email.test.title")}</p>
          <p className="text-xs text-muted-foreground">{t("settings.email.test.description")}</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="space-y-1">
            <Label className="text-xs">{t("settings.email.test.label_to")}</Label>
            <Input
              placeholder={t("settings.email.test.placeholder_to")}
              value={test.to}
              onChange={(e) => setTest((m) => ({ ...m, to: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">{t("settings.email.test.label_subject")}</Label>
            <Input
              placeholder={t("settings.email.test.placeholder_subject")}
              value={test.subject}
              onChange={(e) => setTest((m) => ({ ...m, subject: e.target.value }))}
            />
          </div>
        </div>
        <Button className="mt-3" onClick={runTest} disabled={testing}>
          {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {testing ? t("settings.email.test.sending") : t("settings.email.test.title")}
        </Button>
      </div>
    </SectionCard>
  );
}

function resolve(f: FieldDef, t: (k: string, opts?: any) => string): FieldDef {
  const base = {
    ...f,
    label: t(`settings.email.${f.key}.title`),
    description: t(`settings.email.${f.key}.description`, { defaultValue: "" }),
    placeholder: t(`settings.email.${f.key}.placeholder`, { defaultValue: f.placeholder }),
  };
  if (f.key === "email_encryption") {
    return {
      ...base,
      options: [
        { value: "ssl", label: t("settings.email.email_encryption.ssl") },
        { value: "tls", label: t("settings.email.email_encryption.tls") },
        { value: "none", label: t("settings.email.email_encryption.none") },
      ],
    };
  }
  return base;
}