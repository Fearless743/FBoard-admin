import { adminGet, adminPost } from "@/api/client";

/** 仪表盘概览数据（stat/getStats & stat/getOverview） */
export interface DashboardStats {
  todayIncome: string;
  dayIncomeGrowth: number;
  currentMonthIncome: string;
  lastMonthIncome: string;
  monthIncomeGrowth: number;
  currentMonthCommissionPayout: string;
  lastMonthCommissionPayout: string;
  commissionGrowth: number;
  commissionPendingTotal: number;
  currentMonthNewUsers: number;
  totalUsers: number;
  activeUsers: number;
  userGrowth: number;
  onlineUsers: number;
  onlineDevices: string;
  ticketPendingTotal: number;
  onlineNodes: number;
  todayTraffic: { upload: string; download: string; total: string };
  monthTraffic?: { upload: string; download: string; total: string };
  [k: string]: any;
}

export interface DashboardOverview {
  month_income: string;
  month_register_total: number;
  ticket_pending_total: number;
  commission_pending_total: number;
  day_income: string;
  last_month_income: string;
  commission_month_payout: string;
  commission_last_month_payout: string;
  online_nodes: number;
  online_devices: string;
  online_users: number;
  today_traffic: { upload: string; download: string; total: string };
  month_traffic: { upload: string; download: string; total: string };
  [k: string]: any;
}

export async function getStats(): Promise<DashboardStats> {
  return adminGet<DashboardStats>("/stat/getStats");
}

export async function getOverview(): Promise<DashboardOverview> {
  return adminGet<DashboardOverview>("/stat/getOverview");
}

export interface TrafficRankItem {
  id: string;
  name: string;
  value: string;
  previousValue: string;
  change: number;
  timestamp: string;
}

export async function getTrafficRank(type: "node" | "user", start_time: number, end_time: number) {
  return adminGet<TrafficRankItem[]>("/stat/getTrafficRank", { type, start_time, end_time });
}

export async function getServerLastRank() {
  return adminGet<any>("/stat/getServerLastRank");
}

export async function getServerYesterdayRank() {
  return adminGet<any>("/stat/getServerYesterdayRank");
}

export interface OrderStatItem {
  date: string;
  paid_total: number;
  paid_count: number;
  commission_total: number;
  commission_count: number;
  avg_order_amount: number;
  avg_commission_amount: number;
}

export interface OrderStatResponse {
  list: OrderStatItem[];
  summary: {
    paid_total: number;
    paid_count: number;
    commission_total: number;
    commission_count: number;
    start_date: string;
    end_date: string;
    avg_paid_amount: number;
    avg_commission_amount: number;
    commission_rate: number;
  };
}

export async function getOrder(start_date: string, end_date: string) {
  return adminGet<OrderStatResponse>("/stat/getOrder", { start_date, end_date });
}

export interface QueueStats {
  failedJobs: number;
  jobsPerMinute: number;
  pausedMasters: number;
  periods: { failedJobs: number; recentJobs: number };
  processes: number;
  queueWithMaxRuntime: string;
  queueWithMaxThroughput: string;
  recentJobs: number;
  status: boolean;
  wait: Record<string, number>;
}

export async function getQueueStats() {
  return adminGet<QueueStats>("/system/getQueueStats");
}

export interface FailedJobItem {
  id: string;
  connection: string;
  queue: string;
  name: string;
  status: string;
  payload: string;
  exception: string;
  context: string;
  failed_at: string;
  completed_at: string;
  retried_by: boolean | string;
  reserved_at: string;
  index: number;
}

export interface FailedJobsResponse {
  data: FailedJobItem[];
  total: number;
  current: number;
  page_size: number;
}

export async function getHorizonFailedJobs(current = 1, pageSize = 10) {
  return adminGet<FailedJobsResponse>("/system/getHorizonFailedJobs", { current, page_size: pageSize });
}

export interface StatUserRecord {
  id: number;
  user_id: number;
  server_rate: string;
  u: number;
  d: number;
  record_type: string;
  record_at: number;
  created_at: number;
  updated_at: number;
}

export interface StatUserResponse {
  data: StatUserRecord[];
  total: number;
}

export async function getStatUser(user_id: number, page = 1, pageSize = 20) {
  return adminPost<StatUserResponse>("/stat/getStatUser", { user_id, page, pageSize });
}
