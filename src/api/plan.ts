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
  reset_traffic_method?: number;
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

export async function fetchPlans(): Promise<Plan[]> {
  return adminGet<Plan[]>("/plan/fetch");
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
