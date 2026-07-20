import { adminGet, adminPost } from "@/api/client";

export type ConfigSection = Record<string, unknown>;

export async function fetchConfigSection(key: string): Promise<ConfigSection> {
  const res = await adminGet<any>("/config/fetch", { key });
  return res?.data?.[key] ?? res?.[key] ?? {};
}

/** 按需获取单个订阅模板（name 为 singbox / clash / ...） */
export async function fetchSubscribeTemplate(name: string): Promise<string> {
  const res = await adminGet<any>("/config/fetch", {
    key: "subscribe_template",
    name,
  });
  const section = res?.data?.subscribe_template ?? res?.subscribe_template ?? {};
  const fieldKey = `subscribe_template_${name}`;
  return (section[fieldKey] as string) ?? "";
}

export async function saveConfig(payload: ConfigSection) {
  return adminPost<any>("/config/save", payload);
}

export async function getEmailTemplate(key: string) {
  return adminGet<any>("/config/getEmailTemplate", { key });
}

export async function getThemeTemplate(key: string) {
  return adminGet<any>("/config/getThemeTemplate", { key });
}

export async function setTelegramWebhook(payload: { bot_token?: string; webhook_url?: string }) {
  return adminPost<any>("/config/setTelegramWebhook", payload);
}

export async function testSendMail(payload: { to?: string; subject?: string; content?: string }) {
  return adminPost<any>("/config/testSendMail", payload);
}