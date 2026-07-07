import { type ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { adminPath } from "@/lib/paths";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  // 强制每次校验 localStorage token（persist 可能在首帧未 hydrate）
  useEffect(() => {
    useAuthStore.getState().hydrate();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to={adminPath("login")} state={{ from: location }} replace />;
  }
  return <>{children}</>;
}
