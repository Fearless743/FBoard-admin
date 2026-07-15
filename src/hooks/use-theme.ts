import { useEffect } from "react";
import { useSettingsStore } from "@/store/settings";

function resolveIsDark(theme: "light" | "dark" | "system"): boolean {
  if (theme === "dark") return true;
  if (theme === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/** 应用全局明暗主题 + 侧栏主题到 <html> */
export function useApplyTheme() {
  const theme = useSettingsStore((s) => s.theme);
  const sidebarTheme = useSettingsStore((s) => s.sidebarTheme);

  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      root.classList.toggle("dark", resolveIsDark(theme));
    };

    apply();

    // system 模式时跟随系统偏好变化
    if (theme !== "system") return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => apply();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "sidebar-dark",
      sidebarTheme === "dark",
    );
  }, [sidebarTheme]);
}
