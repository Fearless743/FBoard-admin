import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface IdBadgeProps {
  id: number | string;
  compact?: boolean;
  className?: string;
}

export function IdBadge({ id, compact = false, className }: IdBadgeProps) {
  if (compact) {
    return (
      <Badge variant="outline" className={cn("whitespace-nowrap text-[10px] px-1 py-0 font-mono", className)}>
        {id}
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className={cn("whitespace-nowrap font-mono text-xs", className)}>
      {id}
    </Badge>
  );
}
