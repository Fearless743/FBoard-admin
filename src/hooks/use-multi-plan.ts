/**
 * 多套餐总开关。以后端 admin.blade.php 注入的
 * window.__MULTI_PLAN_ENABLE__ 为准（dev mock 下无该标记，视为关闭）。
 * 开关变更需刷新页面生效。
 */
export function useMultiPlan(): boolean {
  if (typeof window === "undefined") return false;
  return window.__MULTI_PLAN_ENABLE__ === true;
}
