import { adminGet, adminPost } from "@/api/client";

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
  content: string;
  show: 0 | 1;
  img_url?: string;
  tags?: string[];
  sort?: number;
  [k: string]: any;
}

export async function fetchNotices(): Promise<NoticeItem[]> {
  return adminGet<NoticeItem[]>("/notice/fetch");
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

export async function fetchCoupons(payload?: any) {
  return adminPost<any>("/coupon/fetch", payload || {});
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

export async function fetchGiftCardTemplates() {
  return adminGet<{ data: GiftCardTemplate[] }>("/gift-card/templates");
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

export async function generateGiftCardCodes(payload: any) {
  return adminPost<any>("/gift-card/generate-codes", payload);
}

export async function fetchGiftCardCodes() {
  return adminGet<{ data: any[] }>("/gift-card/codes");
}

export async function fetchGiftCardUsages() {
  return adminGet<{ data: any[] }>("/gift-card/usages");
}

export async function toggleGiftCardCode(payload: { id: number; status: 0 | 1 }) {
  return adminPost<any>("/gift-card/toggle-code", payload);
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

export async function fetchPayments(payload?: any) {
  return adminGet<any>("/payment/fetch", payload || {});
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
  content: string;
  show: 0 | 1;
  [k: string]: any;
}

export async function fetchKnowledges(): Promise<KnowledgeItem[]> {
  return adminGet<KnowledgeItem[]>("/knowledge/fetch");
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
  return adminGet<any>("/theme/getThemeConfig", { name });
}

export async function saveThemeConfig(payload: { name: string; config: any }) {
  return adminPost<any>("/theme/saveThemeConfig", payload);
}

export async function uploadTheme(formData: FormData) {
  return adminPost<any>("/theme/upload", formData);
}

export async function deleteTheme(name: string) {
  return adminPost<any>("/theme/delete", { name });
}

/* ============ 插件 ============ */
export async function fetchPlugins(): Promise<any[]> {
  return adminGet<any[]>("/plugin/getPlugins");
}

export async function installPlugin(name: string) {
  return adminPost<any>("/plugin/install", { name });
}

export async function uninstallPlugin(name: string) {
  return adminPost<any>("/plugin/uninstall", { name });
}

export async function deletePlugin(name: string) {
  return adminPost<any>("/plugin/delete", { name });
}

export async function enablePlugin(name: string) {
  return adminPost<any>("/plugin/enable", { name });
}

export async function disablePlugin(name: string) {
  return adminPost<any>("/plugin/disable", { name });
}

export async function configPlugin(name: string) {
  return adminGet<any>("/plugin/config", { name });
}

export async function savePluginConfig(name: string, config: any) {
  return adminPost<any>("/plugin/config", { name, config });
}

export async function uploadPlugin(formData: FormData) {
  return adminPost<any>("/plugin/upload", formData);
}
