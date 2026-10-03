import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQuery } from "@tanstack/react-query";
import i18n from "@/lib/i18n";
import { fetchAdminUiExtensions, fetchAdminUiNavigation } from "@/api/misc";
import { useAuthStore } from "@/store/auth";
import { isScriptLoaded, loadScript, loadStyle } from "./loader";
import type { AdminUiExtension, AdminUiMenu, AdminUiPage } from "./types";

interface PluginContextValue {
  extensions: AdminUiExtension[];
  /** 插件声明的侧边栏菜单项 */
  menus: AdminUiMenu[];
  /** 插件声明的整页 */
  pages: AdminUiPage[];
  /** 所有插件脚本/样式加载完成后为 true */
  ready: boolean;
  reload: () => void;
}

const PluginContext = createContext<PluginContextValue>({
  extensions: [],
  menus: [],
  pages: [],
  ready: true,
  reload: () => {},
});

/**
 * 按需加载宿主 SDK（window.FboardAdmin）。
 *
 * sdk.tsx 静态引用了 shadcn/ui 组件子集，若随入口一起打包会让所有后台用户
 * （包括未装插件者）在首屏多下载一个 UI 组件分片。改为仅在确有插件脚本要
 * 执行时动态 import，Vite 会把它拆成独立 chunk；同一进程内只加载一次。
 */
let sdkPromise: Promise<void> | null = null;

export function ensureSdkInstalled(): Promise<void> {
  if (typeof window === "undefined" || window.FboardAdmin) {
    return Promise.resolve();
  }
  if (!sdkPromise) {
    sdkPromise = import("./sdk")
      .then(({ installSdk }) => installSdk())
      .catch((err) => {
        console.error("[FboardAdmin] 宿主 SDK 加载失败", err);
        // 允许后续重试
        sdkPromise = null;
      });
  }
  return sdkPromise;
}

/** 把插件提供的翻译合并进 i18n（不破坏已有命名空间） */
function mergePluginI18n(bundles: Record<string, Record<string, unknown>>) {
  let changed = false;
  for (const [lang, bundle] of Object.entries(bundles || {})) {
    if (!bundle || typeof bundle !== "object") continue;
    try {
      i18n.addResourceBundle(lang, "translation", bundle, true, true);
      changed = true;
    } catch (err) {
      console.warn(`[FboardAdmin] 插件翻译合并失败: ${lang}`, err);
    }
  }
  // 触发 react-i18next 重新渲染，让已挂载的菜单/组件立即用上新翻译
  if (changed) {
    i18n.emit("loaded");
  }
}

/** 拉取 UI 扩展清单/导航并预加载脚本、样式，供 <PluginSlot>、锚点与导航消费 */
export function PluginProvider({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const extensionsQuery = useQuery({
    queryKey: ["admin-ui-extensions"],
    queryFn: fetchAdminUiExtensions,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    // 登录页必然拿不到（接口在 admin 中间件之后），不发无谓的 403 请求
    enabled: isAuthenticated,
  });
  const navigationQuery = useQuery({
    queryKey: ["admin-ui-navigation"],
    queryFn: fetchAdminUiNavigation,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled: isAuthenticated,
  });

  const extensions = useMemo(
    () => (Array.isArray(extensionsQuery.data) ? extensionsQuery.data : []),
    [extensionsQuery.data],
  );
  const menus = useMemo(
    () => (Array.isArray(navigationQuery.data?.menus) ? navigationQuery.data.menus : []),
    [navigationQuery.data],
  );
  const pages = useMemo(
    () => (Array.isArray(navigationQuery.data?.pages) ? navigationQuery.data.pages : []),
    [navigationQuery.data],
  );

  const [ready, setReady] = useState(false);

  // 合并插件翻译
  useEffect(() => {
    if (navigationQuery.data?.i18n) {
      mergePluginI18n(navigationQuery.data.i18n);
    }
  }, [navigationQuery.data]);

  useEffect(() => {
    if (!isAuthenticated) {
      setReady(false);
      return;
    }

    const scripts = new Set<string>();
    for (const extension of extensions) {
      if (extension.script) scripts.add(extension.script);
      if (extension.style) void loadStyle(extension.style);
    }
    for (const page of pages) {
      if (page.script) scripts.add(page.script);
      if (page.style) void loadStyle(page.style);
    }

    // 清单/导航分两批返回时，第二批若没有新脚本，不回退 ready，
    // 避免已渲染的插件控件闪一下
    const pendingScripts = Array.from(scripts).filter((url) => !isScriptLoaded(url));
    if (pendingScripts.length === 0) {
      setReady(true);
      return;
    }

    let cancelled = false;
    setReady(false);

    // 插件脚本从 window.FboardAdmin 取宿主能力，必须先装好 SDK 再执行
    void ensureSdkInstalled()
      .then(() => Promise.all(pendingScripts.map((url) => loadScript(url))))
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, extensions, pages]);

  const value = useMemo<PluginContextValue>(
    () => ({
      extensions,
      menus,
      pages,
      ready,
      reload: () => {
        void extensionsQuery.refetch();
        void navigationQuery.refetch();
      },
    }),
    [extensions, menus, pages, ready, extensionsQuery, navigationQuery],
  );

  return <PluginContext.Provider value={value}>{children}</PluginContext.Provider>;
}

export function usePlugins(): PluginContextValue {
  return useContext(PluginContext);
}
