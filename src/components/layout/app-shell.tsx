import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

export function AppShell() {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // 路由切换后关闭移动端抽屉
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      {/* 桌面侧边栏 */}
      <div className="hidden w-64 shrink-0 border-r md:block">
        <Sidebar />
      </div>

      {/* 移动端抽屉 */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">{t("search.title")}</SheetTitle>
          <Sidebar onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* 主区域：min-w-0 防止宽表撑破整页横滑 */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header onMobileMenu={() => setMobileOpen(true)} />
        <main
          key={location.pathname}
          className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
