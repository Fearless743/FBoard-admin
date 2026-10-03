import type { ComponentType } from "react";
import type { ExtensionRenderProps } from "./types";

/**
 * 插件组件注册表。
 * 插件脚本通过 window.FboardAdmin.registerExtension(id, Component) 注册，
 * <PluginSlot> / CSS 锚点按扩展块声明的 component id 查找并渲染。
 */
const registry = new Map<string, ComponentType<ExtensionRenderProps>>();

export function registerExtension(
  id: string,
  component: ComponentType<ExtensionRenderProps>,
): void {
  if (!id || typeof component !== "function") {
    console.warn("[FboardAdmin] registerExtension ignored: invalid id or component", id);
    return;
  }
  registry.set(id, component);
}

export function getExtension(
  id: string,
): ComponentType<ExtensionRenderProps> | undefined {
  return registry.get(id);
}

export function hasExtension(id: string): boolean {
  return registry.has(id);
}

export function listExtensions(): string[] {
  return Array.from(registry.keys());
}
