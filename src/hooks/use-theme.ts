import { useEffect } from "react";
import { useSettingsStore } from "@/store/settings";

/** 应用全局明暗主题 + 侧栏主题到 <html> 与 <body> */
export function useApplyTheme() {
  const theme = useSettingsStore((s) => s.theme);
  const sidebarTheme = useSettingsStore((s) => s.sidebarTheme);

  useEffect(() => {
    const root = document.documentElement;
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = theme === "dark" || (theme === "system" && systemDark);
    root.classList.toggle("dark", isDark);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("sidebar-dark", sidebarTheme === "dark");
  }, [sidebarTheme]);
}
