import { adminGet, adminPost } from "@/api/client";

export interface UserListItem {
  id: number;
  email: string;
  uuid: string;
  token?: string;
  balance: number;
  commission_balance: number;
  transfer_enable: number;
  u: number; // 上行 bytes
  d: number; // 下行 bytes
  banned: boolean;
  is_admin: boolean;
  is_staff: boolean;
  plan_id: number | null;
  group_id?: number | null;
  expired_at: number | null;
  device_limit?: number | null;
  speed_limit?: number | null;
  last_login_at?: number;
  last_login_ip?: string;
  created_at: number;
  updated_at?: number;
  invite_user_id?: number | null;
  remark?: string;
  commission_type?: number;
  commission_rate?: number | null;
  discount?: number | null;
  telegram_id?: string | null;
  phone?: string | null;
  [k: string]: any;
}

export interface UserListResponse {
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
  data: UserListItem[];
}

export async function fetchUsers(params: UserFilter): Promise<UserListResponse> {
  return adminPost<UserListResponse>("/user/fetch", params);
}

export interface UserFilter {
  current?: number;
  pageSize?: number;
  filter?: Array<{ id: string; value: any; logic?: string }>;
  sort?: Array<{ id: string; desc?: boolean }>;
  [k: string]: any;
}

export async function generateUser(payload: {
  email_prefix?: string;
  email_suffix?: string;
  password?: string;
  plan_id?: number;
  expired_at?: number | string | null;
  generate_count?: number;
}) {
  return adminPost<any>("/user/generate", payload);
}

export async function updateUser(payload: { id: number; [k: string]: any }) {
  return adminPost<any>("/user/update", payload);
}

export async function banUser(payload: { id?: number; filter?: Record<string, any> }) {
  return adminPost<any>("/user/ban", payload);
}

export async function resetUserSecret(id: number) {
  return adminPost<any>("/user/resetSecret", { id });
}

export async function resetUserTraffic(id: number) {
  return adminPost<any>("/user/resetTraffic", { id });
}

export async function destroyUser(id: number) {
  return adminPost<any>("/user/destroy", { id });
}

export async function sendMail(payload: {
  subject: string;
  content: string;
  filter?: Record<string, any>;
}) {
  return adminPost<any>("/user/sendMail", payload);
}

export async function dumpUsersCSV(filter?: Record<string, any>) {
  return adminPost<any>("/user/dumpCSV", { filter });
}

export async function getUserInfoById(id: number) {
  return adminGet<any>(`/user/getUserInfoById`, { id });
}
