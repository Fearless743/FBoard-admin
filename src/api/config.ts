import { adminGet, adminPost } from "@/api/client";

export interface ConfigPayload {
  [key: string]: any;
}

export async function fetchConfig(): Promise<ConfigPayload> {
  return adminGet<ConfigPayload>("/config/fetch");
}

export async function saveConfig(payload: ConfigPayload) {
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
