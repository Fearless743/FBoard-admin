import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronDown, Cloud, PanelLeftClose, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { navigation, flatNav } from "@/lib/navigation";
import { adminPath } from "@/lib/paths";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function Sidebar() {
  const { t } = useTranslation();
  const location = useLocation();
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const siteName = window.settings?.title || "Fboard";
  const logo = window.settings?.logo;
  const version = window.settings?.version;

  const toggleGroup = (key: string) =>
    setCollapsedGroups((s) => ({ ...s, [key]: !s[key] }));

  return (
    <aside className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo / 站点名 */}
      <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-5">
        <Link to={adminPath("dashboard")} className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
            {logo ? (
              <img src={logo} alt="logo" className="h-6 w-6 object-contain" />
            ) : (
              <Cloud className="h-5 w-5" />
            )}
          </div>
          <span className="truncate text-lg font-semibold tracking-tight">{siteName}</span>
        </Link>
      </div>

      {/* 导航列表 */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-4">
        {navigation.map((group) => {
          // 单项分组不显示分组标题
          if (group.items.length === 1) {
            const item = group.items[0];
            return <SidebarItem key={item.path} item={item} active={isActive(location, item)} />;
          }
          const collapsed = collapsedGroups[group.key];
          const anyActive = group.items.some((it) => isActive(location, it));
          return (
            <Collapsible key={group.key} open={!collapsed}>
              <CollapsibleTrigger asChild>
                <button
                  onClick={() => toggleGroup(group.key)}
                  className="flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
                >
                  <span>{t(group.key)}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      collapsed ? "-rotate-90" : "rotate-0"
                    )}
                  />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 pt-1">
                {group.items.map((item) => (
                  <SidebarItem
                    key={item.path}
                    item={item}
                    active={isActive(location, item)}
                  />
                ))}
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </nav>

      {/* 底部版本信息 */}
      <div className="border-t border-sidebar-border px-5 py-3 text-xs text-muted-foreground">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate font-medium text-sidebar-foreground">{siteName}</span>
          {version ? (
            <span className="shrink-0 opacity-60" title={`v${version}`}>
              v{version}
            </span>
          ) : (
            <span className="shrink-0 opacity-60">Admin</span>
          )}
        </div>
      </div>
    </aside>
  );
}

function isActive(location: ReturnType<typeof useLocation>, item: (typeof flatNav)[number]) {
  const itemPath = adminPath(item.path);
  // dashboard 精确匹配或后台根
  if (item.path === "dashboard") {
    return location.pathname === adminPath() || location.pathname === itemPath;
  }
  return location.pathname === itemPath || location.pathname.startsWith(itemPath + "/");
}

function SidebarItem({
  item,
  active,
}: {
  item: (typeof flatNav)[number];
  active: boolean;
}) {
  const { t } = useTranslation();
  const Icon = item.icon;
  return (
    <Link
      to={adminPath(item.path)}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{t(item.key)}</span>
    </Link>
  );
}

/** 移动端的折叠按钮 */
export function SidebarToggle({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className="h-9 w-9 shrink-0"
      title="Toggle sidebar"
    >
      {collapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
    </Button>
  );
}
