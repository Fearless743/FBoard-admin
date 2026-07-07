import { adminPost } from "@/api/client";

export interface OrderItem {
  id: number;
  trade_no: string;
  user_id: number;
  user_email?: string;
  user?: { id: number; email: string };
  /** 1=新购 2=续费 3=升级 4=流量重置 */
  type: 1 | 2 | 3 | 4;
  plan_id: number | null;
  plan?: { id: number; name: string };
  period: string;
  total_amount: number; // cents
  discount_amount?: number;
  balance_amount?: number;
  refund_amount?: number;
  actual_amount?: number;
  /** 0=pending 1=processing 2=cancelled 3=completed 4=discounted */
  status: 0 | 1 | 2 | 3 | 4;
  /** 0=待确认 1=发放中 2=有效 3=无效 */
  commission_status?: 0 | 1 | 2 | 3;
  commission_balance?: number;
  paid_at?: number | null;
  created_at: number;
  updated_at: number;
  callback_no?: string;
  invite_user_id?: number;
  [k: string]: any;
}

export interface OrderListResponse {
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
  data: OrderItem[];
}

export interface OrderFilter {
  current?: number;
  pageSize?: number;
  filter?: Array<{ id: string; value: any; logic?: string }>;
  [k: string]: any;
}

export async function fetchOrders(payload: OrderFilter): Promise<OrderListResponse> {
  return adminPost<OrderListResponse>("/order/fetch", payload);
}

export async function updateOrder(payload: { trade_no: string; commission_status?: 0 | 1 | 3 }) {
  return adminPost<any>("/order/update", payload);
}

export async function cancelOrder(trade_no: string) {
  return adminPost<any>("/order/cancel", { trade_no });
}

export async function markAsPaid(trade_no: string) {
  return adminPost<any>("/order/paid", { trade_no });
}

export interface AssignOrderPayload {
  email: string;
  plan_id: number;
  period: "month_price" | "quarter_price" | "half_year_price" | "year_price" | "two_year_price" | "three_year_price" | "onetime_price" | "reset_price";
  total_amount: number;
}

export async function assignOrder(payload: AssignOrderPayload) {
  return adminPost<any>("/order/assign", payload);
}

export async function getOrderDetail(id: number) {
  return adminPost<any>("/order/detail", { id });
}
