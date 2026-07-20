import { adminGet, adminPost } from "@/api/client";

export interface Plan {
  id: number;
  name: string;
  show: 0 | 1;
  sell: 0 | 1;
  renew: 0 | 1;
  group_id?: number | null;
  group?: { id: number; name: string };
  transfer_enable: number; // bytes
  speed_limit?: number | null;
  device_limit?: number | null;
  capacity_limit?: number | null;
  /** null = 跟随系统；0=每月1号；1=按月；2=不重置；3=每年1月1日；4=按年 */
  reset_traffic_method?: number | null;
  content?: string | null;
  prices?: Record<string, number | null>;
  month_price?: number | null;
  quarter_price?: number | null;
  half_year_price?: number | null;
  year_price?: number | null;
  two_year_price?: number | null;
  three_year_price?: number | null;
  onetime_price?: number | null;
  reset_price?: number | null;
  sort: number;
  users_count?: number;
  active_users_count?: number;
  created_at?: number;
  updated_at?: number;
  [k: string]: any;
}

export interface PlanListResponse {
  data: Plan[];
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
}

export async function fetchPlans(
  current = 1,
  pageSize = 20,
  search = "",
): Promise<PlanListResponse> {
  const params: Record<string, string | number> = { current, pageSize };
  if (search) params.search = search;
  return adminGet<PlanListResponse>("/plan/fetch", params);
}

export async function savePlan(payload: Partial<Plan>) {
  return adminPost<any>("/plan/save", payload);
}

export async function updatePlan(payload: Partial<Plan>) {
  return adminPost<any>("/plan/update", payload);
}

export async function dropPlan(id: number) {
  return adminPost<any>("/plan/drop", { id });
}

export async function sortPlans(ids: number[]) {
  return adminPost<any>("/plan/sort", { ids });
}
