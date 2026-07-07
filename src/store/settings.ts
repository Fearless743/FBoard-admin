import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeMode = "light" | "dark" | "system";
type SidebarTheme = "light" | "dark";

interface SettingsState {
  // 全局明暗主题
  theme: ThemeMode;
  // 侧栏明暗（Xboard 支持独立配置 sidebar/header）
  sidebarTheme: SidebarTheme;
  // 语言
  language: string;
  // 侧边栏折叠态
  sidebarCollapsed: boolean;
  setTheme: (t: ThemeMode) => void;
  setSidebarTheme: (t: SidebarTheme) => void;
  setLanguage: (l: string) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (v: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "light",
      sidebarTheme: "light",
      language: "zh-CN",
      sidebarCollapsed: false,
      setTheme: (theme) => set({ theme }),
      setSidebarTheme: (sidebarTheme) => set({ sidebarTheme }),
      setLanguage: (language) => set({ language }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
    }),
    { name: "xboard-admin-settings" }
  )
);
