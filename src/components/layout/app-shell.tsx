import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { PluginSlot } from "@/plugin/slot";
import { PluginAnchors } from "@/plugin/anchors";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

export function AppShell() {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  // 路由切换后关闭移动端抽屉
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // 路由切换过渡：main 以 pathname 为 key 重挂载，这里做淡入 + 上滑
  useGSAP(
    () => {
      const el = mainRef.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: "power2.out",
            // 动画结束清掉内联样式，避免残留 transform 影响内部 sticky/fixed 布局
            clearProps: "transform,opacity",
          },
        );
      });
    },
    { dependencies: [location.pathname], scope: mainRef },
  );

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
        <PluginAnchors />
        <main
          key={location.pathname}
          ref={mainRef}
          className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6"
        >
          <PluginSlot name="content.before" className="mb-4" />
          <Outlet />
          <PluginSlot name="content.after" className="mt-4" />
        </main>
      </div>
    </div>
  );
}
