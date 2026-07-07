import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 字节转可读流量 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (!bytes || bytes <= 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/** GB 转 bytes */
export function gbToBytes(gb: number): number {
  return Math.floor(gb * 1024 * 1024 * 1024);
}

/** bytes 转 GB */
export function bytesToGb(bytes: number): number {
  return bytes / 1024 / 1024 / 1024;
}

/** 格式化金额 */
export function formatCurrency(amount: number, symbol = "¥"): string {
  if (amount === null || amount === undefined) return `${symbol}0`;
  return `${symbol}${(amount / 100).toFixed(2)}`;
}

/** 格式化日期时间 */
export function formatDate(
  timestamp: number | string | null | undefined,
  withTime = true
): string {
  if (!timestamp) return "-";
  const d =
    typeof timestamp === "number"
      ? new Date(timestamp * 1000)
      : new Date(timestamp);
  if (isNaN(d.getTime())) return "-";
  const pad = (n: number) => String(n).padStart(2, "0");
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  if (!withTime) return date;
  return `${date} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** 剩余天数 */
export function remainingDays(timestamp: number | null | undefined): number | null {
  if (!timestamp) return null;
  const now = Date.now();
  const target = typeof timestamp === "number" ? timestamp * 1000 : new Date(timestamp).getTime();
  const diff = target - now;
  if (diff <= 0) return -Math.floor(diff / 86400000);
  return Math.floor(diff / 86400000);
}

/** 防抖 */
export function debounce<T extends (...args: any[]) => void>(fn: T, wait = 300) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

/** 下载文本文件 */
export function downloadText(filename: string, content: string, mime = "text/plain") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** 生成随机字符串 */
export function randomString(len = 8): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let s = "";
  for (let i = 0; i < len; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
  return s;
}
