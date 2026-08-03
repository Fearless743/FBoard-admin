import { lazy, Suspense, type ReactNode } from "react";
import { createHashRouter, Navigate } from "react-router-dom";
import PageLoading from "@/components/common/page-loading";
import { AppShell } from "@/components/layout/app-shell";
import { ProtectedRoute } from "@/components/layout/protected-route";

const LoginPage = lazy(() => import("@/pages/login"));
const Dashboard = lazy(() =>
  import("@/pages/dashboard").then(({ Dashboard }) => ({ default: Dashboard })),
);
const UserListPage = lazy(() =>
  import("@/pages/user").then(({ UserListPage }) => ({ default: UserListPage })),
);
const OrderListPage = lazy(() =>
  import("@/pages/order").then(({ OrderListPage }) => ({ default: OrderListPage })),
);
const PlanListPage = lazy(() =>
  import("@/pages/plan").then(({ PlanListPage }) => ({ default: PlanListPage })),
);
const ServerListPage = lazy(() =>
  import("@/pages/server/manage").then(({ ServerListPage }) => ({
    default: ServerListPage,
  })),
);
const GroupListPage = lazy(() =>
  import("@/pages/server/group").then(({ GroupListPage }) => ({
    default: GroupListPage,
  })),
);
const RouteListPage = lazy(() =>
  import("@/pages/route").then(({ RouteListPage }) => ({
    default: RouteListPage,
  })),
);
const MachineListPage = lazy(() =>
  import("@/pages/machine").then(({ MachineListPage }) => ({
    default: MachineListPage,
  })),
);
const ConfigPage = lazy(() =>
  import("@/pages/config").then(({ ConfigPage }) => ({ default: ConfigPage })),
);
const ThemePage = lazy(() =>
  import("@/pages/theme").then(({ ThemePage }) => ({ default: ThemePage })),
);
const PluginPage = lazy(() =>
  import("@/pages/plugin").then(({ PluginPage }) => ({ default: PluginPage })),
);
const NoticeListPage = lazy(() =>
  import("@/pages/notice").then(({ NoticeListPage }) => ({
    default: NoticeListPage,
  })),
);
const PaymentListPage = lazy(() =>
  import("@/pages/payment").then(({ PaymentListPage }) => ({
    default: PaymentListPage,
  })),
);
const KnowledgeListPage = lazy(() =>
  import("@/pages/knowledge").then(({ KnowledgeListPage }) => ({
    default: KnowledgeListPage,
  })),
);
const CouponListPage = lazy(() =>
  import("@/pages/coupon").then(({ CouponListPage }) => ({
    default: CouponListPage,
  })),
);
const GiftCardPage = lazy(() =>
  import("@/pages/gift-card").then(({ GiftCardPage }) => ({
    default: GiftCardPage,
  })),
);
const TicketListPage = lazy(() =>
  import("@/pages/ticket").then(({ TicketListPage }) => ({
    default: TicketListPage,
  })),
);
const WithdrawalListPage = lazy(() =>
  import("@/pages/withdrawal").then(({ WithdrawalListPage }) => ({
    default: WithdrawalListPage,
  })),
);
const NotFound = lazy(() =>
  import("@/pages/not-found").then(({ NotFound }) => ({ default: NotFound })),
);

const lazyElement = (element: ReactNode) => (
  <Suspense fallback={<PageLoading />}>{element}</Suspense>
);

export const router = createHashRouter([
  {
    path: "/login",
    element: lazyElement(<LoginPage />),
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
      { path: "dashboard", element: lazyElement(<Dashboard />) },

      { path: "user", element: lazyElement(<UserListPage />) },
      { path: "order", element: lazyElement(<OrderListPage />) },
      { path: "ticket", element: lazyElement(<TicketListPage />) },
      { path: "withdrawal", element: lazyElement(<WithdrawalListPage />) },

      { path: "plan", element: lazyElement(<PlanListPage />) },
      { path: "coupon", element: lazyElement(<CouponListPage />) },
      { path: "gift-card", element: lazyElement(<GiftCardPage />) },

      { path: "server/manage", element: lazyElement(<ServerListPage />) },
      { path: "server/group", element: lazyElement(<GroupListPage />) },
      { path: "server/route", element: lazyElement(<RouteListPage />) },
      { path: "machine", element: lazyElement(<MachineListPage />) },

      { path: "config", element: lazyElement(<ConfigPage />) },
      { path: "config/:tab", element: lazyElement(<ConfigPage />) },
      { path: "theme", element: lazyElement(<ThemePage />) },
      { path: "plugin", element: lazyElement(<PluginPage />) },
      { path: "notice", element: lazyElement(<NoticeListPage />) },
      { path: "payment", element: lazyElement(<PaymentListPage />) },
      { path: "knowledge", element: lazyElement(<KnowledgeListPage />) },

      { path: "*", element: lazyElement(<NotFound />) },
    ],
  },
  { path: "*", element: <Navigate to="/login" replace /> },
]);
