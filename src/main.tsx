import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useApplyTheme } from "@/hooks/use-theme";
import { router } from "@/router";
import { PluginProvider } from "@/plugin/provider";
import "@/lib/i18n";
// HarmonyOS Sans SC（按 unicode-range 分片，浏览器按需拉取；仅常用字重）
import "harmonyos-sans-sc-webfont-splitted/dist/Regular.css";
import "harmonyos-sans-sc-webfont-splitted/dist/Medium.css";
import "harmonyos-sans-sc-webfont-splitted/dist/Semibold.css";
import "harmonyos-sans-sc-webfont-splitted/dist/Bold.css";
import "@/index.css";

// 插件宿主 SDK（window.FboardAdmin）由 PluginProvider 按需加载：
// 只有确有插件脚本要运行时才拉取 sdk 分片（内含 shadcn/ui 子集），
// 避免未装插件的后台为它付出首屏体积。

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30 * 1000,
    },
  },
});

/** 在根节点挂载主题副作用，登录页与后台布局均生效 */
function ThemeRoot({ children }: { children: React.ReactNode }) {
  useApplyTheme();
  return <>{children}</>;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <PluginProvider>
        <TooltipProvider delayDuration={200}>
          <ThemeRoot>
            <RouterProvider router={router} />
            <Toaster richColors position="top-right" closeButton />
          </ThemeRoot>
        </TooltipProvider>
      </PluginProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
