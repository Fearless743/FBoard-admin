import type { AdminUiExtension } from "./types";

/** 把 react-router pathname 归一化为后台路由子路径，如 "/config/general" -> "config/general" */
export function normalizePage(pathname: string): string {
  return (pathname || "").replace(/^#/, "").replace(/^\/+/, "");
}

/** 扩展块是否命中当前页面。page 支持 "*"、"dashboard"、"config/*" */
export function pageMatches(extension: AdminUiExtension, page: string): boolean {
  const pages =
    extension.page && extension.page.length > 0 ? extension.page : ["*"];
  return pages.some((rule) => matchRule(rule, page));
}

function matchRule(rule: string, page: string): boolean {
  if (!rule || rule === "*") return true;
  const normalized = rule.replace(/^\/+/, "");
  if (normalized.endsWith("/*")) {
    const base = normalized.slice(0, -2);
    return page === base || page.startsWith(base + "/");
  }
  return page === normalized;
}
