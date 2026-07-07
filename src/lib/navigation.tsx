import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Package,
  Ticket as TicketIcon,
  Gift,
  Server,
  Route as RouteIcon,
  Shield,
  CreditCard,
  Bell,
  BookOpen,
  Settings,
  Palette,
  Puzzle,
  HardDrive,
  Gauge,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  path: string; // 相对后台根的子路径，如 "dashboard"
  key: string; // i18n key（位于 nav.* 下）
  icon: LucideIcon;
  group?: string;
}

export interface NavGroup {
  key: string; // i18n key（位于 nav.* 下）
  items: NavItem[];
}

/** 主菜单结构（与 Xboard 后台 nav.* i18n 一一对应） */
export const navigation: NavGroup[] = [
  {
    key: "nav.dashboard",
    items: [
      { path: "dashboard", key: "nav.dashboard", icon: LayoutDashboard },
    ],
  },
  {
    key: "nav.userManagement",
    items: [
      { path: "user", key: "nav.userManagement", icon: Users },
      { path: "order", key: "nav.orderManagement", icon: ShoppingBag },
      { path: "ticket", key: "nav.ticketManagement", icon: TicketIcon },
    ],
  },
  {
    key: "nav.subscriptionManagement",
    items: [
      { path: "plan", key: "nav.planManagement", icon: Package },
      { path: "coupon", key: "nav.couponManagement", icon: TicketIcon },
      { path: "gift-card", key: "nav.giftCardManagement", icon: Gift },
    ],
  },
  {
    key: "nav.nodeManagement",
    items: [
      { path: "server/manage", key: "nav.nodeManagement", icon: Server },
      { path: "server/group", key: "nav.permissionGroupManagement", icon: Shield },
      { path: "server/route", key: "nav.routeManagement", icon: RouteIcon },
      { path: "machine", key: "nav.machineManagement", icon: HardDrive },
    ],
  },
  {
    key: "nav.systemManagement",
    items: [
      { path: "config", key: "nav.systemConfig", icon: Settings },
      { path: "theme", key: "nav.themeConfig", icon: Palette },
      { path: "plugin", key: "nav.pluginManagement", icon: Puzzle },
      { path: "notice", key: "nav.noticeManagement", icon: Bell },
      { path: "payment", key: "nav.paymentConfig", icon: CreditCard },
      { path: "knowledge", key: "nav.knowledgeManagement", icon: BookOpen },
    ],
  },
];

export const flatNav: NavItem[] = navigation.flatMap((g) => g.items);
