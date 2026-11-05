import { post } from "@/lib/api";
import { adminGet, adminPost } from "@/api/client";

/* ---------- Passkey 第二步（无需登录态，凭 ticket） ---------- */

export interface PasskeyAuthOptionsResponse {
  ticket: string;
  options: {
    challenge: string;
    rpId: string;
    allowCredentials: Array<{ type: string; id: string; transports?: string[] }>;
    userVerification: string;
    timeout: number;
  };
}

export async function passkeyAuthOptions(ticket: string): Promise<PasskeyAuthOptionsResponse> {
  return post<PasskeyAuthOptionsResponse>("/passport/auth/passkey/auth-options", { ticket });
}

export interface PasskeyTokenResult {
  token: string;
  auth_data: string;
  is_admin: boolean;
}

export async function passkeyAuthVerify(ticket: string, credential: any): Promise<PasskeyTokenResult> {
  return post<PasskeyTokenResult>("/passport/auth/passkey/auth-verify", { ticket, credential });
}

/* ---------- 首次绑定（无凭证管理员，凭 ticket） ---------- */

export async function passkeySetupOptions(ticket: string): Promise<any> {
  return post<any>("/passport/auth/passkey/register-options-setup", { ticket });
}

export async function passkeySetupVerify(ticket: string, credential: any, name?: string): Promise<{ id: number; ticket: string }> {
  return post<{ id: number; ticket: string }>("/passport/auth/passkey/register-verify-setup", {
    ticket,
    credential,
    name,
  });
}

/* ---------- 已登录管理员自助管理 ---------- */

export interface PasskeyItem {
  id: number;
  name: string;
  created_at: number;
  last_used_at: number | null;
  backup_eligible: boolean;
}

export async function passkeyStatus(): Promise<{ has_passkey: boolean; count: number }> {
  return adminGet<{ has_passkey: boolean; count: number }>("/passkey/status");
}

export async function passkeyList(): Promise<PasskeyItem[]> {
  return adminGet<PasskeyItem[]>("/passkey/list");
}

export async function passkeyRegisterOptions(): Promise<any> {
  return adminPost<any>("/passkey/register-options", {});
}

export async function passkeyRegisterVerify(credential: any, name?: string): Promise<{ id: number; name: string }> {
  return adminPost<{ id: number; name: string }>("/passkey/register-verify", { credential, name });
}

export async function passkeyDelete(id: number): Promise<boolean> {
  return adminPost<boolean>("/passkey/delete", { id });
}
