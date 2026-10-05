import { useSyncExternalStore } from "react";

/**
 * 多套餐总开关。初始值以后端 admin.blade.php 注入的
 * window.__MULTI_PLAN_ENABLE__ 为准（dev mock 下无该标记，视为关闭）。
 *
 * 响应式：配置页保存 multi_plan_enable 成功后经 setMultiPlanEnabled 更新，
 * 所有调用方即时切换，无需刷新页面。
 */

function current(): boolean {
  if (typeof window === "undefined") return false;
  return window.__MULTI_PLAN_ENABLE__ === true;
}

const listeners = new Set<() => void>();
let cached: boolean | null = null;

function getSnapshot(): boolean {
  if (cached === null) cached = current();
  return cached;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** 配置保存成功后调用：同步 window 标记并通知所有订阅组件重渲染。 */
export function setMultiPlanEnabled(value: boolean): void {
  if (typeof window !== "undefined") {
    window.__MULTI_PLAN_ENABLE__ = value;
  }
  if (cached !== value) {
    cached = value;
    listeners.forEach((l) => l());
  }
}

export function useMultiPlan(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
