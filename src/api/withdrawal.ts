import { adminGet, adminPost } from "@/api/client";

export interface WithdrawalMessage {
  id: number;
  withdrawal_id: number;
  user_id: number;
  sender?: { id: number; email: string } | null;
  message: string;
  is_admin: boolean;
  created_at: number;
}

export interface WithdrawalItem {
  id: number;
  user_id: number;
  user_email?: string;
  user?: { id: number; email: string; balance?: number; commission_balance?: number } | null;
  withdraw_method: string;
  withdraw_account: string;
  /** 单位：分 */
  amount: number;
  /** 0=待处理 1=已确认 2=已拒绝 */
  status: 0 | 1 | 2;
  remark?: string | null;
  operator_id?: number | null;
  operator?: { id: number; email: string } | null;
  messages?: WithdrawalMessage[];
  created_at: number;
  updated_at: number;
}

export interface WithdrawalListResponse {
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
  data: WithdrawalItem[];
}

export interface WithdrawalFilter {
  current?: number;
  pageSize?: number;
  filter?: Array<{ id: string; value: any }>;
  sort?: Array<{ id: string; desc?: boolean }>;
}

export async function fetchWithdrawals(payload: WithdrawalFilter) {
  return adminPost<WithdrawalListResponse>("/withdrawal/fetch", payload);
}

export async function confirmWithdrawal(id: number, remark = "") {
  return adminPost<any>("/withdrawal/confirm", { id, remark });
}

export async function closeWithdrawal(id: number, remark = "") {
  return adminPost<any>("/withdrawal/close", { id, remark });
}

export async function fetchWithdrawalMessages(withdrawalId: number) {
  return adminGet<{ data: WithdrawalMessage[] }>(`/withdrawal/${withdrawalId}/messages`);
}

export async function replyWithdrawal(withdrawalId: number, message: string) {
  return adminPost<{ data: WithdrawalMessage }>(`/withdrawal/${withdrawalId}/reply`, { message });
}
