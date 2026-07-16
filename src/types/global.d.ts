// 全局类型声明
// 注意：FBOARD_TRANSLATIONS 已统一在 src/locales/global.d.ts 声明，
// 此处仅保留 settings/settingsBase 等其它 window 字段。
interface Window {
  // 由后端 settings.js 注入的站点配置
  settings?: {
    title?: string;
    version?: string;
    theme_sidebar?: "light" | "dark";
    theme_header?: "light" | "dark";
    theme_color?: string;
    background_url?: string;
    logo?: string;
    secure_path?: string;
    [key: string]: any;
  };
  settingsBase?: {
    base_url?: string;
    [key: string]: any;
  };
}

declare module "*.js";
