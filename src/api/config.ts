import { adminGet, adminPost } from "@/api/client";

export type ConfigSection = Record<string, unknown>;

export async function fetchConfigSection(key: string): Promise<ConfigSection> {
  const res = await adminGet<any>("/config/fetch", { key });
  return res?.data?.[key] ?? res?.[key] ?? {};
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