import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Globe,
  ShieldCheck,
  Rss,
  UserPlus,
  Server,
  Mail,
  Send,
  AppWindow,
  FileCode2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/common/page-header";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { SiteSection } from "./sections/site-section";
import { SafeSection } from "./sections/safe-section";
import { SubscribeSection } from "./sections/subscribe-section";
import { InviteSection } from "./sections/invite-section";
import { ServerSection } from "./sections/server-section";
import { EmailSection } from "./sections/email-section";
import { TelegramSection } from "./sections/telegram-section";
import { AppSection } from "./sections/app-section";
import { SubscribeTemplateSection } from "./sections/subscribe-template-section";

const TABS: Array<{
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  i18n: string;
  render: () => React.ReactNode;
}> = [
  { value: "site", icon: Globe, i18n: "settings.site.title", render: () => <SiteSection /> },
  { value: "safe", icon: ShieldCheck, i18n: "settings.safe.title", render: () => <SafeSection /> },
  { value: "subscribe", icon: Rss, i18n: "settings.subscribe.title", render: () => <SubscribeSection /> },
  { value: "invite", icon: UserPlus, i18n: "settings.invite.title", render: () => <InviteSection /> },
  { value: "server", icon: Server, i18n: "settings.server.title", render: () => <ServerSection /> },
  { value: "email", icon: Mail, i18n: "settings.email.title", render: () => <EmailSection /> },
  { value: "telegram", icon: Send, i18n: "settings.telegram.title", render: () => <TelegramSection /> },
  { value: "app", icon: AppWindow, i18n: "settings.app.title", render: () => <AppSection /> },
  {
    value: "subscribe_template",
    icon: FileCode2,
    i18n: "settings.subscribe_template.title",
    render: () => <SubscribeTemplateSection />,
  },
];

const VALID = new Set(TABS.map((t) => t.value));
const DEFAULT_TAB = TABS[0].value;

export function ConfigPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { tab } = useParams<{ tab?: string }>();

  const active = useMemo(() => {
    if (tab && VALID.has(tab)) return tab;
    return DEFAULT_TAB;
  }, [tab]);

  useEffect(() => {
    if (!tab || !VALID.has(tab)) {
      navigate(`/config/${DEFAULT_TAB}`, { replace: true });
    }
  }, [tab, navigate]);

  return (
    <>
      <PageHeader title={t("settings.title")} description={t("settings.description")} />
      <Tabs
        value={active}
        onValueChange={(v) => navigate(`/config/${v}`)}
      >
        <TabsList className="flex h-auto w-fit flex-wrap gap-1">
          {TABS.map((tabDef) => {
            const Icon = tabDef.icon;
            return (
              <TabsTrigger
                key={tabDef.value}
                value={tabDef.value}
                className="shrink-0 gap-2"
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">{t(tabDef.i18n)}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
        {TABS.map((tabDef) => (
          <TabsContent key={tabDef.value} value={tabDef.value} className="mt-4 space-y-4">
            {tabDef.render()}
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}