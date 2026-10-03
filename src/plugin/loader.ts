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

export function loadScript(url: string): Promise<void> {
  const cached = scriptCache.get(url);
  if (cached) return cached;

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
