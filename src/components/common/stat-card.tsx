import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: ReactNode;
  delta?: number;
  deltaLabel?: string;
  icon?: ReactNode;
  className?: string;
  footer?: ReactNode;
  onClick?: () => void;
  highlight?: boolean;
}

export function StatCard({ title, value, delta, deltaLabel, icon, className, footer, onClick, highlight }: StatCardProps) {
  const up = (delta ?? 0) >= 0;
  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-5 shadow-sm transition-colors",
        highlight && "border-primary/50",
        onClick && "cursor-pointer hover:bg-muted/50",
        className,
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {icon && (
          <div className="rounded-md bg-primary/10 p-1.5 text-primary">{icon}</div>
        )}
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
      {delta !== undefined && (
        <div
          className={cn(
            "mt-2 flex items-center gap-1 text-xs",
            up ? "text-emerald-600" : "text-red-500"
          )}
        >
          {up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          <span>{Math.abs(delta).toFixed(1)}%</span>
          {deltaLabel && <span className="text-muted-foreground">{deltaLabel}</span>}
        </div>
      )}
      {footer && <div className="mt-2 text-xs text-muted-foreground">{footer}</div>}
    </div>
  );
}
