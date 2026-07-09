import { createHashRouter, Navigate } from "react-router-dom";
import { AppShell } from "@/components/layout/app-shell";
import { ProtectedRoute } from "@/components/layout/protected-route";
import LoginPage from "@/pages/login";
import { Dashboard } from "@/pages/dashboard";
import { UserListPage } from "@/pages/user";
import { OrderListPage } from "@/pages/order";
import { PlanListPage } from "@/pages/plan";
import { ServerListPage } from "@/pages/server/manage";
import { GroupListPage } from "@/pages/server/group";
import { RouteListPage } from "@/pages/route";
import { MachineListPage } from "@/pages/machine";
import { ConfigPage } from "@/pages/config";
import { ThemePage } from "@/pages/theme";
import { PluginPage } from "@/pages/plugin";
import { NoticeListPage } from "@/pages/notice";
import { PaymentListPage } from "@/pages/payment";
import { KnowledgeListPage } from "@/pages/knowledge";
import { CouponListPage } from "@/pages/coupon";
import { GiftCardPage } from "@/pages/gift-card";
import { TicketListPage } from "@/pages/ticket";
import { NotFound } from "@/pages/not-found";

export const router = createHashRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },

      { path: "user", element: <UserListPage /> },
      { path: "order", element: <OrderListPage /> },
      { path: "ticket", element: <TicketListPage /> },

      { path: "plan", element: <PlanListPage /> },
      { path: "coupon", element: <CouponListPage /> },
      { path: "gift-card", element: <GiftCardPage /> },

      { path: "server/manage", element: <ServerListPage /> },
      { path: "server/group", element: <GroupListPage /> },
      { path: "server/route", element: <RouteListPage /> },
      { path: "machine", element: <MachineListPage /> },

      { path: "config", element: <ConfigPage /> },
      { path: "config/:tab", element: <ConfigPage /> },
      { path: "theme", element: <ThemePage /> },
      { path: "plugin", element: <PluginPage /> },
      { path: "notice", element: <NoticeListPage /> },
      { path: "payment", element: <PaymentListPage /> },
      { path: "knowledge", element: <KnowledgeListPage /> },

      { path: "*", element: <NotFound /> },
    ],
  },
  { path: "*", element: <Navigate to="/login" replace /> },
]);
