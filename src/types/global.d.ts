// 全局类型声明
interface Window {
  XBOARD_TRANSLATIONS?: Record<string, any>;
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
