import { adminGet, adminPost, adminUpload } from "@/api/client";

/* ============ 工单 ============ */
export interface TicketItem {
  id: number;
  subject: string;
  /** 0=low 1=medium 2=high */
  level: 0 | 1 | 2;
  /** 0=处理中 1=已关闭 */
  status: 0 | 1;
  /** 0=未回复 1=已回复 */
  reply_status: 0 | 1;
  user_id: number;
  user_email?: string;
  updated_at: number;
  created_at: number;
  message_count?: number;
  content?: string;
  [k: string]: any;
}

export async function fetchTickets(payload: any) {
  return adminPost<any>("/ticket/fetch", payload);
}

export async function replyTicket(payload: { id: number; message: string }) {
  return adminPost<any>("/ticket/reply", payload);
}

export async function closeTicket(id: number) {
  return adminPost<any>("/ticket/close", { id });
}

export async function getTicketDetail(id: number) {
  return adminGet<any>("/ticket/fetch", { id });
}

/* ============ 公告 ============ */
export interface NoticeItem {
  id: number;
  title: string;
  content?: string;
  show: 0 | 1;
  img_url?: string;
  tags?: string[];
  sort?: number;
  [k: string]: any;
}

export interface PaginatedListResponse<T> {
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
  data: T[];
}

export interface ListQuery {
  current?: number;
  pageSize?: number;
  search?: string;
}

function buildListQuery(params?: ListQuery & Record<string, any>) {
  const query: Record<string, string | number> = {};
  if (!params) return undefined;
  if (params.current != null) query.current = params.current;
  if (params.pageSize != null) query.pageSize = params.pageSize;
  if (params.search) query.search = params.search;
  for (const [k, v] of Object.entries(params)) {
    if (k === "current" || k === "pageSize" || k === "search") continue;
    if (v != null && v !== "") query[k] = v as string | number;
  }
  return Object.keys(query).length ? query : undefined;
}

/**
 * 兼容后端两种列表返回：
 * 1) 分页对象 { data, total, ... }
 * 2) 直接数组（adminGet 已解包 success.data）
 * 数组场景在前端做分页切片，保证页面的 data?.data / total 逻辑一致。
 */
function normalizeListResponse<T>(
  res: any,
  params?: ListQuery,
): PaginatedListResponse<T> {
  if (Array.isArray(res)) {
    const pageSize = Math.max(1, Number(params?.pageSize) || res.length || 20);
    const current = Math.max(1, Number(params?.current) || 1);
    const total = res.length;
    const start = (current - 1) * pageSize;
    return {
      total,
      current_page: current,
      per_page: pageSize,
      last_page: Math.max(1, Math.ceil(total / pageSize) || 1),
      data: res.slice(start, start + pageSize),
    };
  }
  if (res && typeof res === "object" && Array.isArray(res.data)) {
    return {
      total: Number(res.total ?? res.data.length) || 0,
      current_page: Number(res.current_page ?? params?.current ?? 1) || 1,
      per_page: Number(res.per_page ?? params?.pageSize ?? res.data.length) || 20,
      last_page: Number(res.last_page ?? 1) || 1,
      data: res.data,
    };
  }
  return {
    total: 0,
    current_page: 1,
    per_page: Number(params?.pageSize) || 20,
    last_page: 1,
    data: [],
  };
}

export async function fetchNotices(
  params?: ListQuery,
): Promise<PaginatedListResponse<NoticeItem>> {
  const res = await adminGet<any>("/notice/fetch", buildListQuery(params));
  return normalizeListResponse<NoticeItem>(res, params);
}

export async function fetchNoticeDetail(id: number): Promise<NoticeItem> {
  return adminGet<NoticeItem>("/notice/detail", { id });
}

export async function saveNotice(payload: Partial<NoticeItem>) {
  return adminPost<any>("/notice/save", payload);
}

export async function updateNotice(payload: Partial<NoticeItem> & { id: number }) {
  return adminPost<any>("/notice/update", payload);
}

export async function dropNotice(id: number) {
  return adminPost<any>("/notice/drop", { id });
}

export async function toggleNoticeShow(id: number, show: 0 | 1) {
  return adminPost<any>("/notice/show", { id, show });
}

export async function sortNotices(ids: number[]) {
  return adminPost<any>("/notice/sort", { ids });
}

/* ============ 优惠券 ============ */
export interface CouponItem {
  id: number;
  name: string;
  type: 1 | 2; // 1=金额优惠 2=比例优惠
  value: number;
  code: string;
  limit_use: number | null;
  limit_use_with_user: number | null;
  started_at: number | null;
  ended_at: number | null;
  show: 0 | 1;
  limit_period?: string[];
  limit_plan?: number[];
  [k: string]: any;
}

export interface CouponListResponse {
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
  data: CouponItem[];
}

export interface CouponFilter {
  current?: number;
  pageSize?: number;
  /** 名称 / 券码联合搜索 */
  search?: string;
  filter?: Array<{ id: string; value: any }>;
  sort?: Array<{ id: string; desc?: boolean }>;
}

export async function fetchCoupons(payload?: CouponFilter): Promise<CouponListResponse> {
  return adminPost<CouponListResponse>("/coupon/fetch", payload || {});
}

export async function generateCoupon(payload: any) {
  return adminPost<any>("/coupon/generate", payload);
}

export async function dropCoupon(id: number) {
  return adminPost<any>("/coupon/drop", { id });
}

export async function updateCoupon(payload: any) {
  return adminPost<any>("/coupon/update", payload);
}

export async function toggleCouponShow(id: number, show: 0 | 1) {
  return adminPost<any>("/coupon/show", { id, show });
}

export async function batchDropCoupons(ids: number[]) {
  return adminPost<any>("/coupon/batchDrop", { ids });
}

export async function dropExpiredCoupons() {
  return adminPost<any>("/coupon/dropExpired");
}

/* ============ 礼品卡模板 ============ */
export interface GiftCardTemplate {
  id: number;
  name: string;
  type: 1 | 2 | 3 | 4;
  status: 0 | 1;
  sort: number;
  rewards?: any;
  conditions?: any;
  limits?: any;
  [k: string]: any;
}

export interface GiftCardTemplateFilter {
  page?: number;
  per_page?: number;
  search?: string;
  type?: number;
  status?: number;
}

export async function fetchGiftCardTemplates(
  params?: GiftCardTemplateFilter | string,
): Promise<PaginatedListResponse<GiftCardTemplate>> {
  // 兼容旧调用：fetchGiftCardTemplates("keyword")
  const filter: GiftCardTemplateFilter =
    typeof params === "string" ? { search: params } : params || {};
  const query: Record<string, string | number> = {};
  if (filter.page != null) query.page = filter.page;
  if (filter.per_page != null) query.per_page = filter.per_page;
  if (filter.search) query.search = filter.search;
  if (filter.type != null) query.type = filter.type;
  if (filter.status != null) query.status = filter.status;
  return adminGet<PaginatedListResponse<GiftCardTemplate>>(
    "/gift-card/templates",
    Object.keys(query).length ? query : undefined,
  );
}

export async function createGiftCardTemplate(payload: any) {
  return adminPost<any>("/gift-card/create-template", payload);
}

export async function updateGiftCardTemplate(payload: any) {
  return adminPost<any>("/gift-card/update-template", payload);
}

export async function deleteGiftCardTemplate(id: number) {
  return adminPost<any>("/gift-card/delete-template", { id });
}

export async function sortGiftCardTemplates(ids: number[]) {
  return adminPost<any>("/gift-card/sort-templates", { ids });
}

export async function generateGiftCardCodes(payload: any) {
  return adminPost<any>("/gift-card/generate-codes", payload);
}

export interface GiftCardCodeItem {
  id: number;
  code: string;
  template_id: number;
  template?: { id: number; name: string };
  /** 0=未使用 1=已使用 2=已过期 3=已禁用 */
  status: 0 | 1 | 2 | 3;
  usage_count?: number;
  max_usage?: number;
  batch_id?: string;
  expires_at?: number | null;
  created_at?: any;
  [k: string]: any;
}

export interface GiftCardCodeListResponse {
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
  data: GiftCardCodeItem[];
}

/** 后端礼品卡兑换码列表使用 page / per_page（与订单 current/pageSize 不同） */
export interface GiftCardCodeFilter {
  page?: number;
  per_page?: number;
  search?: string;
  template_id?: number;
  batch_id?: string;
  status?: number;
}

export async function fetchGiftCardCodes(
  params?: GiftCardCodeFilter,
): Promise<GiftCardCodeListResponse> {
  // URLSearchParams 会把 undefined 编成字符串 "undefined"，需先剔除
  const query: Record<string, string | number> = {};
  if (params) {
    if (params.page != null) query.page = params.page;
    if (params.per_page != null) query.per_page = params.per_page;
    if (params.search) query.search = params.search;
    if (params.template_id != null) query.template_id = params.template_id;
    if (params.batch_id) query.batch_id = params.batch_id;
    if (params.status != null) query.status = params.status;
  }
  return adminGet<GiftCardCodeListResponse>(
    "/gift-card/codes",
    Object.keys(query).length ? query : undefined,
  );
}

export interface GiftCardUsageFilter {
  page?: number;
  per_page?: number;
  search?: string;
  template_id?: number;
  user_id?: number;
}

export async function fetchGiftCardUsages(
  params?: GiftCardUsageFilter | string,
): Promise<PaginatedListResponse<any>> {
  const filter: GiftCardUsageFilter =
    typeof params === "string" ? { search: params } : params || {};
  const query: Record<string, string | number> = {};
  if (filter.page != null) query.page = filter.page;
  if (filter.per_page != null) query.per_page = filter.per_page;
  if (filter.search) query.search = filter.search;
  if (filter.template_id != null) query.template_id = filter.template_id;
  if (filter.user_id != null) query.user_id = filter.user_id;
  return adminGet<PaginatedListResponse<any>>(
    "/gift-card/usages",
    Object.keys(query).length ? query : undefined,
  );
}

export async function toggleGiftCardCode(payload: { id: number; action: "enable" | "disable" }) {
  return adminPost<any>("/gift-card/toggle-code", payload);
}

export async function updateGiftCardCode(payload: { id: number; [k: string]: any }) {
  return adminPost<any>("/gift-card/update-code", payload);
}

export async function deleteGiftCardCode(id: number) {
  return adminPost<any>("/gift-card/delete-code", { id });
}

export async function exportGiftCardCodes() {
  return adminGet<any>("/gift-card/export-codes");
}

export async function fetchGiftCardStatistics() {
  return adminGet<any>("/gift-card/statistics");
}

/* ============ 支付方式 ============ */
export interface PaymentMethod {
  id: number;
  name: string;
  payment: string;
  icon?: string;
  notify_domain?: string;
  notify_url?: string;
  handling_fee_percent?: number;
  handling_fee_fixed?: number;
  enable: 0 | 1;
  config?: any;
  sort: number;
  [k: string]: any;
}

export async function fetchPayments(
  params?: ListQuery,
): Promise<PaginatedListResponse<PaymentMethod>> {
  const res = await adminGet<any>("/payment/fetch", buildListQuery(params));
  return normalizeListResponse<PaymentMethod>(res, params);
}

export async function savePayment(payload: any) {
  return adminPost<any>("/payment/save", payload);
}

export async function updatePayment(payload: any) {
  return adminPost<any>("/payment/save", payload);
}

export async function dropPayment(id: number) {
  return adminPost<any>("/payment/drop", { id });
}

export async function copyPayment(id: number) {
  return adminPost<any>("/payment/copy", { id });
}

export async function togglePaymentShow(id: number, enable: 0 | 1) {
  return adminPost<any>("/payment/show", { id, enable });
}

export async function sortPayments(ids: number[]) {
  return adminPost<any>("/payment/sort", { ids });
}

export async function getPaymentMethods() {
  return adminGet<{ data: Array<{ name: string; label: string; fields: any[] }> }>("/payment/getPaymentMethods");
}

export async function getPaymentForm(payment: string) {
  return adminPost<{ fields: any[] }>("/payment/getPaymentForm", { payment });
}

/* ============ 知识库 ============ */
export interface KnowledgeItem {
  id: number;
  title: string;
  category: string;
  language: string;
  content?: string;
  body?: string;
  show: 0 | 1;
  [k: string]: any;
}

export async function fetchKnowledgeCategories(): Promise<string[]> {
  return adminGet<string[]>("/knowledge/getCategory");
}

export async function fetchKnowledges(
  params?: ListQuery & { category?: string },
): Promise<PaginatedListResponse<KnowledgeItem>> {
  const res = await adminGet<any>("/knowledge/fetch", buildListQuery(params));
  // 后端暂不按 category 过滤时，前端兜底
  if (Array.isArray(res) && params?.category) {
    const filtered = res.filter((item: any) => item?.category === params.category);
    return normalizeListResponse<KnowledgeItem>(filtered, params);
  }
  return normalizeListResponse<KnowledgeItem>(res, params);
}

export async function fetchKnowledgeDetail(id: number): Promise<KnowledgeItem> {
  return adminGet<KnowledgeItem>("/knowledge/fetch", { id });
}

export async function saveKnowledge(payload: any) {
  return adminPost<any>("/knowledge/save", payload);
}

export async function dropKnowledge(id: number) {
  return adminPost<any>("/knowledge/drop", { id });
}

export async function showKnowledge(payload: { id: number; show: 0 | 1 }) {
  return adminPost<any>("/knowledge/show", payload);
}

export async function sortKnowledge(payload: { ids: number[] }) {
  return adminPost<any>("/knowledge/sort", payload);
}

/* ============ 主题 ============ */
export async function getThemes(): Promise<any[]> {
  return adminGet<any[]>("/theme/getThemes");
}

export async function getThemeConfig(name: string) {
  return adminPost<any>("/theme/getThemeConfig", { name });
}

export async function saveThemeConfig(payload: { name: string; config: any }) {
  return adminPost<any>("/theme/saveThemeConfig", payload);
}

export async function uploadTheme(formData: FormData) {
  return adminUpload("/theme/upload", formData);
}

export async function deleteTheme(name: string) {
  return adminPost<any>("/theme/delete", { name });
}

export async function switchTheme(name: string) {
  return adminPost<any>("/theme/switchTheme", { name });
}

/* ============ 插件 ============ */
export async function fetchPluginTypes(): Promise<any[]> {
  return adminGet<any[]>("/plugin/types");
}

export async function fetchPlugins(params?: {
  type?: string;
  page?: number;
  pageSize?: number;
  search?: string;
}): Promise<any[]> {
  return adminGet<any[]>("/plugin/getPlugins", params || {});
}

export async function installPlugin(code: string) {
  return adminPost<any>("/plugin/install", { code });
}

export async function upgradePlugin(code: string) {
  return adminPost<any>("/plugin/upgrade", { code });
}

export async function uninstallPlugin(code: string) {
  return adminPost<any>("/plugin/uninstall", { code });
}

export async function deletePlugin(code: string) {
  return adminPost<any>("/plugin/delete", { code });
}

export async function enablePlugin(code: string) {
  return adminPost<any>("/plugin/enable", { code });
}

export async function disablePlugin(code: string) {
  return adminPost<any>("/plugin/disable", { code });
}

export async function configPlugin(code: string) {
  return adminGet<any>("/plugin/config", { code });
}

export async function savePluginConfig(code: string, config: any) {
  return adminPost<any>("/plugin/config", { code, config });
}

export async function uploadPlugin(formData: FormData) {
  return adminUpload("/plugin/upload", formData);
}

export async function fetchPluginReadme(code: string) {
  return adminGet<any>("/plugin/readme", { code });
}

export async function fetchPluginStaticFiles(code: string) {
  return adminGet<any[]>("/plugin/staticFiles", { code });
}

export async function executePluginAction(code: string, action: string, params?: any) {
  return adminPost<any>("/plugin/action", { code, action, params });
}
