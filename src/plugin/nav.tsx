import { useMemo } from "react";
import type { TFunction } from "i18next";
import { Puzzle, type LucideIcon } from "lucide-react";
import { navigation as staticNavigation, type NavGroup, type NavItem } from "@/lib/navigation";
import { pluginIcons } from "./icons";
import { usePlugins } from "./provider";
import type { AdminUiMenu } from "./types";

/** 把插件声明的 lucide 图标名解析为组件，找不到回退 Puzzle */
export function resolveIcon(name: string | null): LucideIcon {
  if (name) {
    const direct = pluginIcons[name];
    if (direct) return direct;
    // 兼容小写/短横线写法，如 "shield-check" -> "ShieldCheck"
    const pascal = name
      .split(/[-_\s]+/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("");
    const resolved = pluginIcons[pascal];
    if (resolved) return resolved;
  }
  return Puzzle;
}

function menuToNavItem(menu: AdminUiMenu): NavItem {
  return {
    path: menu.path,
    key: menu.i18nKey ?? "",
    label: menu.label,
    icon: resolveIcon(menu.icon),
    external: menu.external,
    target: menu.target,
    plugin: menu.plugin,
  };
}

/** 取导航项显示文案：i18nKey 优先，缺失时回退字面量 label */
export function navItemLabel(t: TFunction, item: NavItem): string {
  const fallback = item.label || item.path;
  return item.key ? t(item.key, { defaultValue: fallback }) : fallback;
}

/** 取分组显示名 */
export function navGroupLabel(t: TFunction, group: NavGroup): string {
  return group.label || t(group.key);
}

/**
 * 合并后台静态菜单与插件动态菜单。
 * - menu.group 命中现有分组 → 追加
 * - menu.group 未命中但有 groupLabel → 新建分组
 * - 都没有 → 归入以插件为单位的默认分组
 */
export function useMergedNavigation(): { groups: NavGroup[]; flat: NavItem[] } {
  const { menus } = usePlugins();

  return useMemo(() => {
    const groups: NavGroup[] = staticNavigation.map((group) => ({
      key: group.key,
      label: group.label,
      items: group.items.map((item) => ({ ...item })),
    }));

    for (const menu of menus) {
      const item = menuToNavItem(menu);

      let group: NavGroup | undefined;
      if (menu.group) {
        group = groups.find((g) => g.key === menu.group);
        if (!group && menu.groupLabel) {
          group = { key: menu.group, label: menu.groupLabel, items: [] };
          groups.push(group);
        }
      }
      if (!group) {
        const fallbackKey = `plugin.${menu.plugin}`;
        group = groups.find((g) => g.key === fallbackKey);
        if (!group) {
          group = {
            key: fallbackKey,
            label: menu.groupLabel || menu.label || menu.plugin,
            items: [],
          };
          groups.push(group);
        }
      }
      group.items.push(item);
    }

    const flat = groups.flatMap((g) => g.items);
    return { groups, flat };
  }, [menus]);
}
