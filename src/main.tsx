import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useApplyTheme } from "@/hooks/use-theme";
import { router } from "@/router";
import "@/lib/i18n";
import "@/index.css";

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
      <TooltipProvider delayDuration={200}>
        <ThemeRoot>
          <RouterProvider router={router} />
          <Toaster richColors position="top-right" closeButton />
        </ThemeRoot>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
