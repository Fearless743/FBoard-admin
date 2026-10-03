import type { ComponentType } from "react";

/** CSS 锚点注入方位 */
export type AnchorPosition = "before" | "after" | "prepend" | "append";

/** 扩展块的 CSS 锚点定位 */
export interface AdminUiAnchor {
  selector: string;
  position?: AnchorPosition;
}

/** 后端 /plugin/ui 返回的单个 UI 扩展块 */
export interface AdminUiExtension {
  /** 全局唯一 id（后端已加 `{plugin}:` 前缀） */
  id: string;
  /** 插件内原始 id */
  name: string;
  /** 声明该扩展的插件 code */
  plugin: string;
  /** 具名插槽名；使用 CSS 锚点时可能为 null */
  slot: string | null;
  /** 生效页面（路由子路径），['*'] 表示全部页面 */
  page: string[];
  priority: number;
  title: string | null;
  type: "component" | "html" | "iframe" | "button" | "link";
  /** type=component 时，注册到前端的组件 id */
  component?: string;
  context: Record<string, unknown>;
  script: string | null;
  style: string | null;
  html?: string | null;
  url?: string | null;
  /** type=button/link 的按钮文案 */
  label?: string | null;
  /** type=button：点击后执行本插件的 registerAction 名称 */
  action?: string | null;
  /** type=button：传给 action 的参数 */
  params?: Record<string, unknown>;
  /** type=button：二次确认文案 */
  confirm?: string | null;
  /** type=button：按钮样式 */
  variant?: "default" | "outline" | "destructive" | "ghost" | "link";
  /** type=button：lucide 图标名 */
  icon?: string | null;
  anchor: AdminUiAnchor | null;
}

/** 插件声明的后台侧边栏菜单项 */
export interface AdminUiMenu {
  plugin: string;
  /** 后台路由子路径（external 时为完整 URL） */
  path: string;
  label: string;
  i18nKey: string | null;
  icon: string | null;
  /** 归入现有分组（i18n key） */
  group: string | null;
  /** 新建分组的显示文案 */
  groupLabel: string | null;
  order: number;
  external: boolean;
  target: "_blank" | "_self";
}

/** 插件声明的后台整页 */
export interface AdminUiPage {
  plugin: string;
  path: string;
  title: string | null;
  type: "component" | "html" | "iframe";
  component: string;
  html: string | null;
  url: string | null;
  script: string | null;
  style: string | null;
  height: string;
}

/** /plugin/ui/nav 返回的导航扩展清单 */
export interface AdminUiNavigation {
  menus: AdminUiMenu[];
  pages: AdminUiPage[];
  /** 插件提供的翻译包，形如 { 'zh-CN': { ... }, 'en-US': { ... } } */
  i18n: Record<string, Record<string, unknown>>;
}

/** 渲染插件组件时注入的 props */
export interface ExtensionRenderProps {
  /** 所属扩展块；整页组件（type=component 的 page）为 undefined */
  extension?: AdminUiExtension;
  slot: string | null;
  /** 当前后台路由子路径，如 "dashboard"、"config/general" */
  page: string;
}

/** 暴露给插件脚本的宿主 SDK（window.FboardAdmin） */
export interface FboardAdminSdk {
  version: string;
  React: typeof import("react");
  ReactDOM: typeof import("react-dom");
  ReactDOMClient: typeof import("react-dom/client");
  registerExtension: (id: string, component: ComponentType<ExtensionRenderProps>) => void;
  getExtension: (id: string) => ComponentType<ExtensionRenderProps> | undefined;
  hasExtension: (id: string) => boolean;
  listExtensions: () => string[];
  /** shadcn/ui 组件子集，与后台视觉一致 */
  ui: Record<string, ComponentType<any>>;
  api: {
    adminGet: typeof import("@/api/client").adminGet;
    adminPost: typeof import("@/api/client").adminPost;
    adminUpload: typeof import("@/api/client").adminUpload;
    get: typeof import("@/lib/api").get;
    post: typeof import("@/lib/api").post;
  };
  lib: {
    cn: typeof import("@/lib/utils").cn;
    adminPath: typeof import("@/lib/paths").adminPath;
  };
  toast: typeof import("sonner").toast;
  i18n: typeof import("@/lib/i18n").default;
  useTranslation: (typeof import("react-i18next"))["useTranslation"];
  stores: {
    useAuthStore: typeof import("@/store/auth").useAuthStore;
    useSettingsStore: typeof import("@/store/settings").useSettingsStore;
  };
}

declare global {
  interface Window {
    FboardAdmin?: FboardAdminSdk;
  }
}
