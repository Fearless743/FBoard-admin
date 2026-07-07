import { useTranslation } from "react-i18next";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  className,
  message,
  icon,
}: {
  className?: string;
  message?: string;
  icon?: React.ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 text-center text-muted-foreground",
        className
      )}
    >
      <div className="mb-3 text-muted-foreground/60">
        {icon || <Inbox className="h-10 w-10" />}
      </div>
      <p className="text-sm">{message || t("common.table.noData")}</p>
    </div>
  );
}
