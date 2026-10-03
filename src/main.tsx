import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
  keepPreviousData,
} from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useApplyTheme } from "@/hooks/use-theme";
import { router } from "@/router";
import { PluginProvider } from "@/plugin/provider";
import "@/lib/i18n";
import "@/index.css";

// 插件宿主 SDK（window.FboardAdmin）由 PluginProvider 按需加载：
// 只有确有插件脚本要运行时才拉取 sdk 分片（内含 shadcn/ui 子集），
// 避免未装插件的后台为它付出首屏体积。

// HarmonyOS Sans SC 的 @font-face（4 字重 × 82 unicode-range，约 540KB）体积大，
// 若并入首屏 CSS 会阻塞渲染。这里改为运行时动态 import，Vite 会把它拆成独立的
// CSS 分片，由主包执行后异步加载（不阻塞首屏）。
// 注意：PHP 端 admin.blade.php 只从 manifest 注入入口的静态 CSS，不会加载这个
// 动态分片，因此必须由 JS 主动触发，不能依赖 index.html。
void import("@/styles/fonts");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30 * 1000,
      // 翻页 / 改筛选时保留上一次数据，避免表格闪空与骨架屏抖动
      placeholderData: keepPreviousData,
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
