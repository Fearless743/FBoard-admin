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

/**
 * 跨浏览器复制文本到剪贴板（重点兼容 WebKit / Safari / iOS）。
 *
 * WebKit 常见坑：
 * - Clipboard API 需 HTTPS + 用户手势；click 后一旦先 await 别的东西，手势会失效
 * - `textarea[readonly]` + `opacity:0` + 1×1 尺寸时，iOS 经常无法 select / copy
 * 策略：同步 execCommand（contentEditable span / textarea）优先，失败再走 Clipboard API
 */
export async function copyToClipboard(text: string): Promise<void> {
  const value = text ?? "";

  // 1) 同步路径：保留 click 用户手势（WebKit 最关键）
  if (legacyCopyText(value)) return;

  // 2) Clipboard API
  if (
    typeof navigator !== "undefined" &&
    typeof window !== "undefined" &&
    window.isSecureContext
  ) {
    // writeText
    if (typeof navigator.clipboard?.writeText === "function") {
      try {
        await navigator.clipboard.writeText(value);
        return;
      } catch {
        // fall through
      }
    }
    // ClipboardItem（部分 WebKit 版本对 writeText 更挑剔）
    if (
      typeof navigator.clipboard?.write === "function" &&
      typeof ClipboardItem !== "undefined"
    ) {
      try {
        const item = new ClipboardItem({
          "text/plain": new Blob([value], { type: "text/plain" }),
        });
        await navigator.clipboard.write([item]);
        return;
      } catch {
        // fall through
      }
    }
  }

  throw new Error("copy failed");
}

/** 同步 execCommand 复制。成功 true，失败 false。必须在用户手势内调用。 */
function legacyCopyText(text: string): boolean {
  if (typeof document === "undefined") return false;

  // 方案 A：contentEditable span + Range（iOS Safari 最稳）
  if (copyViaContentEditable(text)) return true;
  // 方案 B：textarea（桌面与部分 Android WebView）
  if (copyViaTextarea(text)) return true;
  return false;
}

function restoreSelection(previous: Range | null) {
  const selection = document.getSelection();
  if (!selection) return;
  selection.removeAllRanges();
  if (previous) selection.addRange(previous);
}

function snapshotSelection(): Range | null {
  const selection = document.getSelection();
  return selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
}

function copyViaContentEditable(text: string): boolean {
  const el = document.createElement("span");
  el.textContent = text;
  el.contentEditable = "true";
  // WebKit 需要元素可被选中且在布局内
  el.style.cssText =
    "position:fixed;top:0;left:0;width:auto;height:auto;max-width:100vw;max-height:100vh;" +
    "padding:0;margin:0;border:0;outline:none;box-shadow:none;background:transparent;" +
    "opacity:0.01;white-space:pre;overflow:hidden;font-size:16px;line-height:1;" +
    "z-index:2147483647;-webkit-user-select:text;user-select:text;";
  document.body.appendChild(el);

  const previous = snapshotSelection();
  let ok = false;
  try {
    const selection = document.getSelection();
    if (!selection) return false;
    const range = document.createRange();
    range.selectNodeContents(el);
    selection.removeAllRanges();
    selection.addRange(range);
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  } finally {
    document.body.removeChild(el);
    restoreSelection(previous);
  }
  return ok;
}

function copyViaTextarea(text: string): boolean {
  const el = document.createElement("textarea");
  el.value = text;
  // iOS：不要设 readonly，否则 select 可能无效
  el.setAttribute("contenteditable", "true");
  el.setAttribute("spellcheck", "false");
  el.style.cssText =
    "position:fixed;top:0;left:0;width:2em;height:2em;padding:0;margin:0;" +
    "border:none;outline:none;box-shadow:none;background:transparent;" +
    "opacity:0.01;font-size:16px;z-index:2147483647;" +
    "-webkit-user-select:text;user-select:text;";
  document.body.appendChild(el);

  const previous = snapshotSelection();
  let ok = false;
  try {
    el.focus();
    el.select();
    el.setSelectionRange(0, el.value.length);
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  } finally {
    document.body.removeChild(el);
    restoreSelection(previous);
  }
  return ok;
}

/** 生成随机字符串 */
export function randomString(len = 8): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let s = "";
  for (let i = 0; i < len; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
  return s;
}
