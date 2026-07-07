import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      {/* 桌面侧边栏 */}
      <div className="hidden w-64 shrink-0 border-r md:block">
        <Sidebar />
      </div>

      {/* 移动端抽屉 */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* 主区域 */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMobileMenu={() => setMobileOpen(true)} />
        <main key={location.pathname} className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
