import { useLocation } from "react-router-dom";
import { NotFound } from "@/pages/not-found";
import { getExtension } from "./registry";
import { usePlugins } from "./provider";
import { normalizePage } from "./page";
import type { AdminUiPage } from "./types";

/** 渲染插件声明的整页（iframe / component / html） */
export function PluginPageHost({ page }: { page: AdminUiPage }) {
  const { ready } = usePlugins();
  const currentPage = normalizePage(page.path);

  if (page.type === "html") {
    return <div dangerouslySetInnerHTML={{ __html: page.html ?? "" }} />;
  }

  if (page.type === "component") {
    const PluginComponent = page.component ? getExtension(page.component) : undefined;
    if (!PluginComponent) {
      // 脚本尚未加载完成前显示加载态，避免闪一下「未注册」
      if (!ready) {
        return (
          <div className="px-4 py-6 text-sm text-muted-foreground">正在加载插件页面…</div>
        );
      }
      return (
        <div className="rounded-md border border-dashed px-4 py-6 text-sm text-muted-foreground">
          插件页面组件 {page.component} 未注册（脚本未加载或未调用 registerExtension）
        </div>
      );
    }
    return <PluginComponent slot={null} page={currentPage} />;
  }

  return (
    <iframe
      src={page.url ?? ""}
      title={page.title || page.path}
      className="w-full rounded-md border bg-background"
      style={{ height: page.height || "calc(100vh - 8rem)" }}
    />
  );
}

/** 匹配插件整页路径：等于 path，或 path + "/" 前缀 */
function pathMatches(rule: string, path: string): boolean {
  return path === rule || path.startsWith(rule + "/");
}

/**
 * 兜底路由解析器：优先匹配插件声明的整页，否则渲染 NotFound。
 * 挂载在 AppShell 的 `path: "*"`，因此不会与后台静态路由冲突。
 */
export function PluginRouteResolver() {
  const location = useLocation();
  const { pages } = usePlugins();
  const currentPage = normalizePage(location.pathname);

  const matched = pages.find((page) => pathMatches(page.path, currentPage));

  if (matched) {
    return <PluginPageHost page={matched} />;
  }

  return <NotFound />;
}
