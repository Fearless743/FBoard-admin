/**
 * 插件前端资源加载器：同一 URL 只加载一次。
 * 脚本以普通 <script> 注入（IIFE），插件从 window.FboardAdmin 取宿主能力。
 */
const scriptCache = new Map<string, Promise<void>>();
const styleCache = new Set<string>();
const loadedScripts = new Set<string>();

/** 脚本是否已加载完成（含失败；失败同样不会重试，避免反复请求坏地址） */
export function isScriptLoaded(url: string): boolean {
  return loadedScripts.has(url);
}

/**
 * 插件脚本 URL 白名单校验。
 *
 * 规则（失败时返回原因字符串，通过时返回 null）：
 * - 拒绝 `javascript:` / `data:` / `blob:` / `vbscript:` 等可执行 scheme，
 *   只允许 http/https（相对路径按同源 http(s) 解析，视为允许）；
 * - 同源 URL 直接允许；
 * - 跨源 http(s) 视为后端下发的插件域名（调用方清单来自已鉴权后端接口，
 *   后端是信任锚），允许加载但仍受上述 scheme 约束。
 */
export function getScriptUrlRejectReason(url: string): string | null {
  const raw = (url ?? "").trim();
  if (!raw) return "empty url";
  const lowered = raw.toLowerCase();
  if (
    lowered.startsWith("javascript:") ||
    lowered.startsWith("data:") ||
    lowered.startsWith("blob:") ||
    lowered.startsWith("vbscript:")
  ) {
    return `blocked scheme: ${raw.slice(0, raw.indexOf(":") + 1)}`;
  }
  let parsed: URL;
  try {
    parsed =
      typeof window !== "undefined"
        ? new URL(raw, window.location.href)
        : new URL(raw);
  } catch {
    return "invalid url";
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return `blocked protocol: ${parsed.protocol}`;
  }
  return null;
}

/** 同上：非法返回 false（静默场景用），需原因时用 getScriptUrlRejectReason */
export function isAllowedScriptUrl(url: string): boolean {
  return getScriptUrlRejectReason(url) === null;
}

export function loadScript(url: string): Promise<void> {
  const cached = scriptCache.get(url);
  if (cached) return cached;

  const rejectReason = getScriptUrlRejectReason(url);
  if (rejectReason) {
    console.warn(`[FboardAdmin] 插件脚本 URL 被拦截 (${rejectReason}): ${url}`);
    const rejected = Promise.reject(new Error(`blocked script url: ${rejectReason}`));
    // 避免未处理 rejection 刷屏：调用方仍可通过 await/catch 感知
    rejected.catch(() => {});
    scriptCache.set(url, rejected);
    return rejected;
  }

  const promise = new Promise<void>((resolve) => {
    const el = document.createElement("script");
    el.src = url;
    el.async = true;
    el.dataset.fboardPlugin = "1";
    el.onload = () => {
      loadedScripts.add(url);
      resolve();
    };
    el.onerror = () => {
      console.warn(`[FboardAdmin] 插件脚本加载失败: ${url}`);
      loadedScripts.add(url);
      resolve();
    };
    document.head.appendChild(el);
  });

  scriptCache.set(url, promise);
  return promise;
}

export function loadStyle(url: string): Promise<void> {
  if (styleCache.has(url)) return Promise.resolve();
  styleCache.add(url);

  return new Promise<void>((resolve) => {
    const el = document.createElement("link");
    el.rel = "stylesheet";
    el.href = url;
    el.dataset.fboardPlugin = "1";
    el.onload = () => resolve();
    el.onerror = () => {
      console.warn(`[FboardAdmin] 插件样式加载失败: ${url}`);
      resolve();
    };
    document.head.appendChild(el);
  });
}
