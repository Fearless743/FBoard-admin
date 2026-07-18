import { useMemo, type ComponentProps } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_PAGE_SIZES = [10, 20, 30, 50, 100];

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  /** 当前选中条数（表格多选场景） */
  selectedCount?: number;
  /** 每页条数选项，默认 10/20/30/50/100 */
  pageSizeOptions?: number[];
  /** 额外 className */
  className?: string;
  /** 紧凑模式：用于弹窗等窄空间 */
  compact?: boolean;
}

type PageToken = number | "ellipsis";

/**
 * 生成页码窗口：
 * - 总页数 ≤ 7：全部展示
 * - 否则：1 … 当前邻域 … last
 */
function buildPageTokens(current: number, totalPages: number): PageToken[] {
  if (totalPages <= 0) return [1];
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const set = new Set<number>([1, totalPages, current]);
  for (let d = 1; d <= 1; d++) {
    if (current - d > 1) set.add(current - d);
    if (current + d < totalPages) set.add(current + d);
  }
  // 靠近边界时补齐，避免「1, 2, …, 3」这类难看布局
  if (current <= 3) {
    set.add(2);
    set.add(3);
    set.add(4);
  }
  if (current >= totalPages - 2) {
    set.add(totalPages - 1);
    set.add(totalPages - 2);
    set.add(totalPages - 3);
  }

  const pages = [...set].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const tokens: PageToken[] = [];
  for (let i = 0; i < pages.length; i++) {
    if (i > 0 && pages[i] - pages[i - 1] > 1) {
      tokens.push("ellipsis");
    }
    tokens.push(pages[i]);
  }
  return tokens;
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  selectedCount,
  pageSizeOptions = DEFAULT_PAGE_SIZES,
  className,
  compact = false,
}: PaginationProps) {
  const { t } = useTranslation();
  const totalPages = Math.max(1, Math.ceil((total || 0) / Math.max(1, pageSize)));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const from = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = total === 0 ? 0 : Math.min(safePage * pageSize, total);

  const pageTokens = useMemo(
    () => buildPageTokens(safePage, totalPages),
    [safePage, totalPages],
  );

  const sizes = useMemo(() => {
    if (pageSizeOptions.includes(pageSize)) return pageSizeOptions;
    return [...pageSizeOptions, pageSize].sort((a, b) => a - b);
  }, [pageSizeOptions, pageSize]);

  const go = (p: number) => {
    const next = Math.min(Math.max(1, p), totalPages);
    if (next !== page) onPageChange(next);
  };

  const summary =
    selectedCount !== undefined && selectedCount > 0
      ? t("common.table.pagination.selected", {
          selected: selectedCount,
          total,
        })
      : t("common.table.pagination.range", {
          from,
          to,
          total,
        });

  let ellipsisSeq = 0;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t bg-muted/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
        compact && "gap-2 px-3 py-2.5",
        className,
      )}
    >
      {/* 左侧：范围 / 选中摘要 */}
      <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
        <span className="tabular-nums">{summary}</span>
        {!compact && totalPages > 1 && (
          <span className="hidden text-xs text-muted-foreground/80 sm:inline">
            {t("common.table.pagination.pageOf", {
              page: safePage,
              total: totalPages,
            })}
          </span>
        )}
      </div>

      {/* 右侧：每页条数 + 页码导航 */}
      <div className="flex flex-wrap items-center gap-3">
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {t("common.table.pagination.itemsPerPage")}
            </span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => onPageSizeChange(Number(v))}
            >
              <SelectTrigger
                className={cn(
                  "h-8 w-[72px] border-border/80 bg-background shadow-none",
                  compact && "h-7 w-[64px] text-xs",
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                {sizes.map((s) => (
                  <SelectItem key={s} value={String(s)}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div
          className={cn(
            "inline-flex items-center gap-0.5 rounded-lg border border-border/80 bg-background p-0.5 shadow-sm",
            compact && "gap-0",
          )}
          role="navigation"
          aria-label="pagination"
        >
          <NavButton
            compact={compact}
            onClick={() => go(1)}
            disabled={safePage <= 1}
            title={t("common.table.pagination.firstPage")}
            aria-label={t("common.table.pagination.firstPage")}
          >
            <ChevronsLeft className="h-4 w-4" />
          </NavButton>
          <NavButton
            compact={compact}
            onClick={() => go(safePage - 1)}
            disabled={safePage <= 1}
            title={t("common.table.pagination.previousPage")}
            aria-label={t("common.table.pagination.previousPage")}
          >
            <ChevronLeft className="h-4 w-4" />
          </NavButton>

          <div className="mx-0.5 hidden items-center gap-0.5 sm:flex">
            {pageTokens.map((token) => {
              if (token === "ellipsis") {
                ellipsisSeq += 1;
                return (
                  <span
                    key={`ellipsis-${ellipsisSeq}`}
                    className="flex h-7 w-7 items-center justify-center text-muted-foreground"
                    aria-hidden
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </span>
                );
              }
              const active = token === safePage;
              return (
                <Button
                  key={token}
                  type="button"
                  variant={active ? "default" : "ghost"}
                  size="icon"
                  className={cn(
                    "h-7 w-7 text-xs tabular-nums",
                    compact && "h-6 w-6 text-[11px]",
                    active && "pointer-events-none shadow-sm",
                  )}
                  onClick={() => go(token)}
                  aria-current={active ? "page" : undefined}
                  aria-label={t("common.table.pagination.pageOf", {
                    page: token,
                    total: totalPages,
                  })}
                >
                  {token}
                </Button>
              );
            })}
          </div>

          {/* 窄屏：数字页码简化为「当前 / 总页」 */}
          <span
            className={cn(
              "min-w-[3.5rem] px-1.5 text-center text-xs tabular-nums text-muted-foreground sm:hidden",
              compact && "min-w-[3rem] text-[11px]",
            )}
          >
            {safePage} / {totalPages}
          </span>

          <NavButton
            compact={compact}
            onClick={() => go(safePage + 1)}
            disabled={safePage >= totalPages}
            title={t("common.table.pagination.nextPage")}
            aria-label={t("common.table.pagination.nextPage")}
          >
            <ChevronRight className="h-4 w-4" />
          </NavButton>
          <NavButton
            compact={compact}
            onClick={() => go(totalPages)}
            disabled={safePage >= totalPages}
            title={t("common.table.pagination.lastPage")}
            aria-label={t("common.table.pagination.lastPage")}
          >
            <ChevronsRight className="h-4 w-4" />
          </NavButton>
        </div>
      </div>
    </div>
  );
}

function NavButton({
  children,
  compact,
  className,
  ...props
}: ComponentProps<typeof Button> & { compact?: boolean }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn(
        "h-7 w-7 text-muted-foreground hover:text-foreground",
        compact && "h-6 w-6",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
