import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save, Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchConfig, saveConfig, setTelegramWebhook, testSendMail } from "@/api/config";
import { debounce } from "@/lib/utils";

const SITE_FIELDS = [
  { key: "app_name", i18n: "settings.site.form.siteName" },
  { key: "app_description", i18n: "settings.site.form.siteDescription" },
  { key: "app_url", i18n: "settings.site.form.siteUrl" },
  { key: "logo", i18n: "settings.site.form.logo" },
  { key: "subscribe_url", i18n: "settings.site.form.subscribeUrl" },
  { key: "tos_url", i18n: "settings.site.form.tosUrl" },
  { key: "currency", i18n: "settings.site.form.currency" },
  { key: "currency_symbol", i18n: "settings.site.form.currencySymbol" },
];

const SAFE_FIELDS = [
  { key: "stop_register", i18n: "settings.site.form.stopRegister", type: "switch" },
  { key: "safe_mode_enable", i18n: "settings.safe.form.safeMode.label", type: "switch" },
  { key: "email_verify", i18n: "settings.safe.form.emailVerify.label", type: "switch" },
  { key: "email_whitelist_enable", i18n: "settings.safe.form.emailWhitelist.label", type: "switch" },
  { key: "register_limit_enable", i18n: "settings.safe.form.registerLimit.enable.label", type: "switch" },
];

const INVITE_FIELDS = [
  { key: "invite_force", i18n: "settings.invite.invite_force.title", type: "switch" },
  { key: "invite_commission", i18n: "settings.invite.invite_commission.title", type: "number" },
  { key: "invite_gen_limit", i18n: "settings.invite.invite_gen_limit.title", type: "number" },
  { key: "invite_never_expire", i18n: "settings.invite.invite_never_expire.title", type: "switch" },
  { key: "commission_first_time", i18n: "settings.invite.commission_first_time.title", type: "switch" },
  { key: "commission_auto_check", i18n: "settings.invite.commission_auto_check.title", type: "switch" },
  { key: "commission_withdraw_limit", i18n: "settings.invite.commission_withdraw_limit.title", type: "number" },
  { key: "withdraw_close", i18n: "settings.invite.withdraw_close.title", type: "switch" },
];

const SERVER_FIELDS = [
  { key: "server_token", i18n: "settings.server.server_token.title", type: "text" },
  { key: "server_pull_interval", i18n: "settings.server.server_pull_interval.title", type: "number" },
  { key: "server_push_interval", i18n: "settings.server.server_push_interval.title", type: "number" },
];

const SUBSCRIBE_FIELDS = [
  { key: "plan_change_enable", i18n: "settings.subscribe.plan_change_enable.title", type: "switch" },
  { key: "surplus_enable", i18n: "settings.subscribe.surplus_enable.title", type: "switch" },
  { key: "show_info_to_server", i18n: "settings.subscribe.show_info_to_server.title", type: "switch" },
  { key: "show_protocol_to_server", i18n: "settings.subscribe.show_protocol_to_server.title", type: "switch" },
];

const APP_FIELDS = [
  { key: "windows_version", i18n: "settings.app.windows.version.title", type: "text" },
  { key: "windows_download", i18n: "settings.app.windows.download.title", type: "text" },
  { key: "macos_version", i18n: "settings.app.macos.version.title", type: "text" },
  { key: "macos_download", i18n: "settings.app.macos.download.title", type: "text" },
  { key: "android_version", i18n: "settings.app.android.version.title", type: "text" },
  { key: "android_download", i18n: "settings.app.android.download.title", type: "text" },
];

export function ConfigPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["config"],
    queryFn: fetchConfig,
  });

  const [edits, setEdits] = useState<Record<string, any>>({});

  const current = (key: string) =>
    edits[key] !== undefined ? edits[key] : (data as any)?.[key] ?? "";

  const set = (key: string, value: any) => setEdits((s) => ({ ...s, [key]: value }));

  const saveField = async (key: string) => {
    if (!(key in edits)) return;
    try {
      await saveConfig({ [key]: edits[key] });
      toast.success(t("settings.common.save_success"));
      setEdits((s) => {
        const n = { ...s };
        delete n[key];
        return n;
      });
      qc.invalidateQueries({ queryKey: ["config"] });
    } catch (e) {}
  };

  const debouncedSave = debounce(saveField, 800);

  const [testMail, setTestMail] = useState({ to: "", subject: "", content: "" });
  const [testingMail, setTestingMail] = useState(false);
  const runTestMail = async () => {
    setTestingMail(true);
    try {
      await testSendMail(testMail);
      toast.success(t("settings.email.test.success"));
    } catch (e) {
      toast.error(t("settings.email.test.error"));
    } finally {
      setTestingMail(false);
    }
  };

  const [settingWebhook, setSettingWebhook] = useState(false);
  const setWebhook = async () => {
    setSettingWebhook(true);
    try {
      await setTelegramWebhook({});
      toast.success(t("settings.telegram.webhook.success"));
    } catch (e) {
    } finally {
      setSettingWebhook(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <>
      <PageHeader title={t("settings.title")} description={t("settings.description")} />

      <Tabs defaultValue="site" className="w-full">
        <TabsList className="flex-wrap">
          <TabsTrigger value="site">{t("settings.site.title")}</TabsTrigger>
          <TabsTrigger value="safe">{t("settings.safe.title")}</TabsTrigger>
          <TabsTrigger value="subscribe">{t("settings.subscribe.title")}</TabsTrigger>
          <TabsTrigger value="invite">{t("settings.invite.title")}</TabsTrigger>
          <TabsTrigger value="server">{t("settings.server.title")}</TabsTrigger>
          <TabsTrigger value="email">{t("settings.email.title")}</TabsTrigger>
          <TabsTrigger value="telegram">{t("settings.telegram.title")}</TabsTrigger>
          <TabsTrigger value="app">{t("settings.app.title")}</TabsTrigger>
          <TabsTrigger value="subscribe_template">{t("settings.subscribe_template.title")}</TabsTrigger>
        </TabsList>

        <TabsContent value="site">
          <FieldGroup title={t("settings.site.title")} description={t("settings.site.description")}>
            {SITE_FIELDS.map((f) => (
              <TextRow
                key={f.key}
                label={t(f.i18n + ".label")}
                placeholder={t(f.i18n + ".placeholder")}
                value={current(f.key)}
                onChange={(v) => {
                  set(f.key, v);
                  debouncedSave(f.key);
                }}
                description={t(f.i18n + ".description")}
              />
            ))}
          </FieldGroup>
        </TabsContent>

        <TabsContent value="safe">
          <FieldGroup title={t("settings.safe.title")} description={t("settings.safe.description")}>
            {SAFE_FIELDS.map((f) => (
              <SwitchRow
                key={f.key}
                label={t(f.i18n)}
                description={t(f.i18n + ".description")}
                checked={!!current(f.key)}
                onChange={(v) => {
                  set(f.key, v ? 1 : 0);
                  saveField(f.key);
                }}
              />
            ))}
          </FieldGroup>
        </TabsContent>

        <TabsContent value="subscribe">
          <FieldGroup title={t("settings.subscribe.title")} description={t("settings.subscribe.description")}>
            {SUBSCRIBE_FIELDS.map((f) =>
              f.type === "switch" ? (
                <SwitchRow
                  key={f.key}
                  label={t(f.i18n)}
                  description={t(f.i18n + ".description")}
                  checked={!!current(f.key)}
                  onChange={(v) => {
                    set(f.key, v ? 1 : 0);
                    saveField(f.key);
                  }}
                />
              ) : (
                <TextRow
                  key={f.key}
                  label={t(f.i18n)}
                  description={t(f.i18n + ".description")}
                  placeholder={t(f.i18n + ".description")}
                  value={current(f.key)}
                  onChange={(v) => {
                    set(f.key, v);
                    debouncedSave(f.key);
                  }}
                />
              )
            )}
            <TextRow
              label={t("settings.subscribe.subscribe_path.title")}
              description={t("settings.subscribe.subscribe_path.description")}
              value={current("subscribe_path")}
              onChange={(v) => { set("subscribe_path", v); debouncedSave("subscribe_path"); }}
            />
            <TextRow
              label={t("settings.subscribe.reset_traffic_method.title")}
              description={t("settings.subscribe.reset_traffic_method.description")}
              value={current("reset_traffic_method")}
              onChange={(v) => { set("reset_traffic_method", v); debouncedSave("reset_traffic_method"); }}
            />
          </FieldGroup>
        </TabsContent>

        <TabsContent value="invite">
          <FieldGroup title={t("settings.invite.title")} description={t("settings.invite.description")}>
            {INVITE_FIELDS.map((f) =>
              f.type === "switch" ? (
                <SwitchRow
                  key={f.key}
                  label={t(f.i18n)}
                  description={t(f.i18n + ".description")}
                  checked={!!current(f.key)}
                  onChange={(v) => {
                    set(f.key, v ? 1 : 0);
                    saveField(f.key);
                  }}
                />
              ) : (
                <TextRow
                  key={f.key}
                  label={t(f.i18n)}
                  description={t(f.i18n + ".description")}
                  placeholder={t(f.i18n + ".placeholder")}
                  type="number"
                  value={current(f.key)}
                  onChange={(v) => {
                    set(f.key, v);
                    debouncedSave(f.key);
                  }}
                />
              )
            )}
          </FieldGroup>
        </TabsContent>

        <TabsContent value="server">
          <FieldGroup title={t("settings.server.title")} description={t("settings.server.description")}>
            {SERVER_FIELDS.map((f) => (
              <TextRow
                key={f.key}
                label={t(f.i18n)}
                description={t(f.i18n + ".description")}
                placeholder={t(f.i18n + ".placeholder")}
                type={f.type === "number" ? "number" : "text"}
                value={current(f.key)}
                onChange={(v) => {
                  set(f.key, v);
                  debouncedSave(f.key);
                }}
              />
            ))}
          </FieldGroup>
        </TabsContent>

        <TabsContent value="email">
          <FieldGroup title={t("settings.email.title")} description={t("settings.email.description")}>
            <TextRow
              label={t("settings.email.email_host.title")}
              description={t("settings.email.email_host.description")}
              value={current("smtp_host")}
              onChange={(v) => { set("smtp_host", v); debouncedSave("smtp_host"); }}
            />
            <TextRow
              label={t("settings.email.email_port.title")}
              description={t("settings.email.email_port.description")}
              type="number"
              value={current("smtp_port")}
              onChange={(v) => { set("smtp_port", Number(v)); debouncedSave("smtp_port"); }}
            />
            <TextRow
              label={t("settings.email.email_username.title")}
              description={t("settings.email.email_username.description")}
              value={current("smtp_username")}
              onChange={(v) => { set("smtp_username", v); debouncedSave("smtp_username"); }}
            />
            <TextRow
              label={t("settings.email.email_password.title")}
              description={t("settings.email.email_password.description")}
              type="password"
              value={current("smtp_password")}
              onChange={(v) => { set("smtp_password", v); debouncedSave("smtp_password"); }}
            />
            <TextRow
              label={t("settings.email.email_from.title")}
              description={t("settings.email.email_from.description")}
              value={current("smtp_from")}
              onChange={(v) => { set("smtp_from", v); debouncedSave("smtp_from"); }}
            />
            <TextRow
              label={t("settings.email.email_from_name.title")}
              description={t("settings.email.email_from_name.description")}
              value={current("smtp_from_name")}
              onChange={(v) => { set("smtp_from_name", v); debouncedSave("smtp_from_name"); }}
            />
            <SwitchRow
              label={t("settings.email.remind_mail.title")}
              description={t("settings.email.remind_mail.description")}
              checked={!!current("remind_mail")}
              onChange={(v) => { set("remind_mail", v ? 1 : 0); saveField("remind_mail"); }}
            />

            <div className="mt-4 rounded-lg border bg-muted/30 p-4">
              <p className="mb-2 text-sm font-medium">{t("settings.email.test.title")}</p>
              <p className="mb-3 text-xs text-muted-foreground">
                {t("settings.email.test.description")}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                <Input
                  placeholder="To"
                  value={testMail.to}
                  onChange={(e) => setTestMail((m) => ({ ...m, to: e.target.value }))}
                />
                <Input
                  placeholder="Subject"
                  value={testMail.subject}
                  onChange={(e) => setTestMail((m) => ({ ...m, subject: e.target.value }))}
                />
              </div>
              <Button className="mt-3" onClick={runTestMail} disabled={testingMail}>
                {testingMail ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {t("settings.email.test.sending")}
              </Button>
            </div>
          </FieldGroup>
        </TabsContent>

        <TabsContent value="telegram">
          <FieldGroup title={t("settings.telegram.title")} description={t("settings.telegram.description")}>
            <TextRow
              label={t("settings.telegram.bot_token.title")}
              description={t("settings.telegram.bot_token.description")}
              placeholder={t("settings.telegram.bot_token.placeholder")}
              type="password"
              value={current("telegram_bot_token")}
              onChange={(v) => { set("telegram_bot_token", v); debouncedSave("telegram_bot_token"); }}
            />
            <TextRow
              label={t("settings.telegram.webhook_url.title")}
              description={t("settings.telegram.webhook_url.description")}
              placeholder={t("settings.telegram.webhook_url.placeholder")}
              value={current("telegram_webhook_url")}
              onChange={(v) => { set("telegram_webhook_url", v); debouncedSave("telegram_webhook_url"); }}
            />
            <SwitchRow
              label={t("settings.telegram.bot_enable.title")}
              description={t("settings.telegram.bot_enable.description")}
              checked={!!current("telegram_bot_enable")}
              onChange={(v) => { set("telegram_bot_enable", v ? 1 : 0); saveField("telegram_bot_enable"); }}
            />
            <TextRow
              label={t("settings.telegram.discuss_link.title")}
              description={t("settings.telegram.discuss_link.description")}
              placeholder={t("settings.telegram.discuss_link.placeholder")}
              value={current("telegram_discuss_link")}
              onChange={(v) => { set("telegram_discuss_link", v); debouncedSave("telegram_discuss_link"); }}
            />
            <div className="mt-3">
              <Button onClick={setWebhook} disabled={settingWebhook}>
                {settingWebhook && <Loader2 className="h-4 w-4 animate-spin" />}
                {t("settings.telegram.webhook.button")}
              </Button>
            </div>
          </FieldGroup>
        </TabsContent>

        <TabsContent value="app">
          <FieldGroup title={t("settings.app.title")} description={t("settings.app.description")}>
            {APP_FIELDS.map((f) => (
              <TextRow
                key={f.key}
                label={t(f.i18n)}
                description={t(f.i18n + ".description")}
                placeholder={t("settings.common.placeholder")}
                value={current(f.key)}
                onChange={(v) => {
                  set(f.key, v);
                  debouncedSave(f.key);
                }}
              />
            ))}
          </FieldGroup>
        </TabsContent>

        <TabsContent value="subscribe_template">
          <FieldGroup title={t("settings.subscribe_template.title")} description={t("settings.subscribe_template.description")}>
            <TextRow
              label={t("settings.subscribe_template.singbox.title")}
              description={t("settings.subscribe_template.singbox.description")}
              value={current("subscribe_template_singbox")}
              onChange={(v) => { set("subscribe_template_singbox", v); debouncedSave("subscribe_template_singbox"); }}
            />
            <TextRow
              label={t("settings.subscribe_template.clash.title")}
              description={t("settings.subscribe_template.clash.description")}
              value={current("subscribe_template_clash")}
              onChange={(v) => { set("subscribe_template_clash", v); debouncedSave("subscribe_template_clash"); }}
            />
            <TextRow
              label={t("settings.subscribe_template.clashmeta.title")}
              description={t("settings.subscribe_template.clashmeta.description")}
              value={current("subscribe_template_clashmeta")}
              onChange={(v) => { set("subscribe_template_clashmeta", v); debouncedSave("subscribe_template_clashmeta"); }}
            />
            <TextRow
              label={t("settings.subscribe_template.stash.title")}
              description={t("settings.subscribe_template.stash.description")}
              value={current("subscribe_template_stash")}
              onChange={(v) => { set("subscribe_template_stash", v); debouncedSave("subscribe_template_stash"); }}
            />
            <TextRow
              label={t("settings.subscribe_template.surge.title")}
              description={t("settings.subscribe_template.surge.description")}
              value={current("subscribe_template_surge")}
              onChange={(v) => { set("subscribe_template_surge", v); debouncedSave("subscribe_template_surge"); }}
            />
            <TextRow
              label={t("settings.subscribe_template.surfboard.title")}
              description={t("settings.subscribe_template.surfboard.description")}
              value={current("subscribe_template_surfboard")}
              onChange={(v) => { set("subscribe_template_surfboard", v); debouncedSave("subscribe_template_surfboard"); }}
            />
          </FieldGroup>
        </TabsContent>
      </Tabs>
    </>
  );
}

function FieldGroup({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

function TextRow({
  label,
  description,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  description?: string;
  placeholder?: string;
  type?: string;
  value: any;
  onChange: (v: any) => void;
}) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      <Input
        type={type}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
  );
}

function SwitchRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border p-3">
      <div>
        <Label className="text-sm font-normal">{label}</Label>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
