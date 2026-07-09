import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, CircleAlert, Loader2 } from "lucide-react";
import type { SaveStatus } from "./use-config-section";
import { cn } from "@/lib/utils";

interface SaveIndicatorProps {
  status: SaveStatus;
  savedAt: number | null;
  className?: string;
}

export function SaveIndicator({ status, savedAt, className }: SaveIndicatorProps) {
  const { t } = useTranslation();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!savedAt) return;
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, [savedAt]);

  if (status === "saving") {
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-xs text-muted-foreground", className)}>
        <Loader2 className="h-3 w-3 animate-spin" />
        {t("settings.common.saving")}
      </span>
    );
  }
  if (status === "error") {
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-xs text-destructive", className)}>
        <CircleAlert className="h-3 w-3" />
        {t("settings.common.save_error")}
      </span>
    );
  }
  if (status === "saved" && savedAt) {
    const delta = Math.max(0, Math.floor((now - savedAt) / 1000));
    const label =
      delta < 5
        ? t("settings.common.autoSaved")
        : t("settings.common.saved_at", { seconds: delta });
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-xs text-muted-foreground", className)}>
        <Check className="h-3 w-3 text-emerald-500" />
        {label}
      </span>
    );
  }
  return null;
}