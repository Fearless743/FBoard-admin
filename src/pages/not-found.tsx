import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { adminPath } from "@/lib/paths";

export function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
      <p className="text-5xl font-bold text-muted-foreground">404</p>
      <p className="text-sm text-muted-foreground">{t("common.http.notFound")}</p>
      <Button asChild>
        <Link to={adminPath("dashboard")}>{t("nav.dashboard")}</Link>
      </Button>
    </div>
  );
}
