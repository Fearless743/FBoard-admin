import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, RotateCcw, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title: string;
  description?: ReactNode;
  dirty?: boolean;
  saving?: boolean;
  autoSave?: boolean;
  onSave?: () => void;
  onReset?: () => void;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
}

export function SectionCard({
  title,
  description,
  dirty,
  saving,
  autoSave,
  onSave,
  onReset,
  children,
  className,
  footer,
}: SectionCardProps) {
  const { t } = useTranslation();
  const showSaveButton = !!onSave && !autoSave;
  const showStatus = autoSave && saving;
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 gap-4">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <span>{title}</span>
            {showStatus && (
              <span className="flex items-center gap-1 text-xs font-normal text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {t("settings.common.saving")}
              </span>
            )}
            {!showStatus && dirty && (
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-label="unsaved" />
            )}
          </CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {dirty && onReset && (
            <Button variant="ghost" size="sm" onClick={onReset} disabled={saving}>
              <RotateCcw className="h-4 w-4" />
              {t("settings.common.reset")}
            </Button>
          )}
          {showSaveButton && (
            <Button size="sm" onClick={onSave} disabled={saving || !dirty}>
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? t("settings.common.saving") : t("settings.common.save")}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
      {footer && (
        <>
          <Separator />
          <div className="px-6 pb-6">{footer}</div>
        </>
      )}
    </Card>
  );
}