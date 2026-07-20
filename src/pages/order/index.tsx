import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  X,
  CheckCircle2,
  XCircle,
  Loader2,
  MoreHorizontal,
  Send,
  Ban,
  ShoppingCart,
  Copy,
  Eye,
  FilterX,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EmptyState } from "@/components/common/empty-state";
import { Pagination } from "@/components/common/pagination";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  fetchOrders,
  getOrderDetail,
  cancelOrder,
  markAsPaid,
  updateOrder,
  assignOrder,
  type OrderItem,
} from "@/api/order";
import { usePlanOptions } from "@/hooks/use-plans";
import { cn, copyToClipboard, formatCurrency, formatDate } from "@/lib/utils";
import { adminPath } from "@/lib/paths";

const COL_COUNT = 8;

const statusVariant: Record<
  number,
  "default" | "destructive" | "success" | "warning" | "secondary"
> = {
  0: "warning",
  1: "default",
  2: "destructive",
  3: "success",
  4: "secondary",
};

const statusDot: Record<number, string> = {
  0: "bg-amber-500",
  1: "bg-primary",
  2: "bg-destructive",
  3: "bg-emerald-500",
  4: "bg-muted-foreground",
};

const statusKey: Record<number, string> = {
  0: "PENDING",
  1: "PROCESSING",
  2: "CANCELLED",
  3: "COMPLETED",
  4: "DISCOUNTED",
};

const typeKey: Record<number, string> = {
  1: "NEW",
  2: "RENEWAL",
  3: "UPGRADE",
  4: "RESET_FLOW",
};

/** 类型徽章样式：弱色区分，不抢状态列视觉 */
const typeTone: Record<number, string> = {
  1: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  2: "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  3: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  4: "border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
};

const commissionKey: Record<number, string> = {
  0: "PENDING",
  1: "PROCESSING",
  2: "VALID",
  3: "INVALID",
};

const commissionVariant: Record<
  number,
  "default" | "destructive" | "success" | "warning" | "secondary"
> = {
  0: "warning",
  1: "default",
  2: "success",
  3: "destructive",
};

/** 筛选用 period value → 展示用长 label key */
const PERIOD_FILTERS: Array<{ value: string; labelKey: string }> = [
  { value: "monthly", labelKey: "order.period.month_price" },
  { value: "quarterly", labelKey: "order.period.quarter_price" },
  { value: "half_yearly", labelKey: "order.period.half_year_price" },
  { value: "yearly", labelKey: "order.period.year_price" },
  { value: "two_yearly", labelKey: "order.period.two_year_price" },
  { value: "three_yearly", labelKey: "order.period.three_year_price" },
  { value: "onetime", labelKey: "order.period.onetime_price" },
  { value: "reset_traffic", labelKey: "order.period.reset_price" },
];

const ASSIGN_PERIODS = [
  "month_price",
  "quarter_price",
  "half_year_price",
  "year_price",
  "two_year_price",
  "three_year_price",
  "onetime_price",
  "reset_price",
] as const;

const TYPE_FILTERS = [
  { value: "1", type: 1 },
  { value: "2", type: 2 },
  { value: "3", type: 3 },
  { value: "4", type: 4 },
] as const;

const STATUS_FILTERS = [
  { value: "0", status: 0 },
  { value: "1", status: 1 },
  { value: "2", status: 2 },
  { value: "3", status: 3 },
  { value: "4", status: 4 },
] as const;

const COMMISSION_FILTERS = [
  { value: "0", status: 0 },
  { value: "1", status: 1 },
  { value: "2", status: 2 },
  { value: "3", status: 3 },
] as const;

function orderEmail(o: OrderItem): string | null {
  return o.user?.email || o.user_email || null;
}

export function OrderListPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const userId = searchParams.get("user_id");
  const tradeNoParam = searchParams.get("trade_no") || "";
  const commissionStatusParam = searchParams.get("commission_status") || "";
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const { data: plans = [] } = usePlanOptions();
  const [search, setSearch] = useState(tradeNoParam);
  const [typeFilter, setTypeFilter] = useState("");
  const [periodFilter, setPeriodFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [commissionFilter, setCommissionFilter] = useState(
    commissionStatusParam,
  );
  const [detail, setDetail] = useState<OrderItem | null>(null);
  const [actionOrder, setActionOrder] = useState<{
    trade_no: string;
    type: "paid" | "cancel";
  } | null>(null);
  const [commissionAction, setCommissionAction] = useState<{
    trade_no: string;
    type: "issue" | "invalid";
  } | null>(null);
  const [destructiveAction, setDestructiveAction] = useState<
    | { trade_no: string; type: "cancelOrder" }
    | { trade_no: string; type: "invalidCommission" }
    | null
  >(null);
  const [destructiveLoading, setDestructiveLoading] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [addEmail, setAddEmail] = useState("");
  const [addPlanId, setAddPlanId] = useState("");
  const [addPeriod, setAddPeriod] = useState("");
  const [addAmount, setAddAmount] = useState("");
  const [addSubmitting, setAddSubmitting] = useState(false);

  // 支持从其它页面带 ?trade_no= 跳转过来时同步搜索框
  useEffect(() => {
    if (tradeNoParam) {
      setSearch(tradeNoParam);
      setPage(1);
    }
  }, [tradeNoParam]);

  // 支持从仪表盘等页面带 ?commission_status= 跳转过来时同步佣金筛选
  useEffect(() => {
    if (commissionStatusParam !== commissionFilter) {
      setCommissionFilter(commissionStatusParam);
      setPage(1);
    }
    // 仅在 URL 参数变化时同步，避免与本地下拉改选互相覆盖
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commissionStatusParam]);

  const hasActiveFilters = !!(
    search ||
    typeFilter ||
    periodFilter ||
    statusFilter ||
    commissionFilter ||
    userId
  );

  const clearUserFilter = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("user_id");
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearch("");
    setTypeFilter("");
    setPeriodFilter("");
    setStatusFilter("");
    setCommissionFilter("");
    setPage(1);
    if (userId || tradeNoParam || commissionStatusParam) {
      const next = new URLSearchParams(searchParams);
      next.delete("user_id");
      next.delete("trade_no");
      next.delete("commission_status");
      setSearchParams(next);
    }
  };

  const openDetail = async (o: OrderItem) => {
    try {
      const d = await getOrderDetail(o.id);
      setDetail(d || o);
    } catch {
      setDetail(o);
    }
  };

  const copyTradeNo = async (tradeNo: string) => {
    try {
      await copyToClipboard(tradeNo);
      toast.success(t("common.copy.success"));
    } catch {
      toast.error(t("common.copy.failed"));
    }
  };

  // 后端 filter 对「无 : 操作符」的值会走 LIKE；数值状态类必须用 eq: 精确匹配。
  // 仅筛 commission_status=0 会命中默认 0 且无佣金的订单，需配合 is_commission
  //（有邀请人、已支付/已完成、commission_balance>0）与仪表盘待处理佣金统计对齐。
  const queryFilters: Array<{ id: string; value: any; logic?: string }> = [];
  if (search) queryFilters.push({ id: "trade_no", value: search });
  if (typeFilter) queryFilters.push({ id: "type", value: `eq:${typeFilter}` });
  if (periodFilter) queryFilters.push({ id: "period", value: `eq:${periodFilter}` });
  if (statusFilter) queryFilters.push({ id: "status", value: `eq:${statusFilter}` });
  if (commissionFilter) {
    queryFilters.push({
      id: "commission_status",
      value: `eq:${commissionFilter}`,
    });
  }
  if (userId) queryFilters.push({ id: "user_id", value: `eq:${userId}` });

  const isCommissionList = commissionFilter !== "";

  const { data, isLoading } = useQuery({
    queryKey: [
      "orders",
      {
        page,
        pageSize,
        search,
        typeFilter,
        periodFilter,
        statusFilter,
        commissionFilter,
        userId,
        isCommissionList,
      },
    ],
    queryFn: () =>
      fetchOrders({
        current: page,
        pageSize,
        filter: queryFilters.length > 0 ? queryFilters : [],
        ...(isCommissionList ? { is_commission: true } : {}),
      }),
  });

  const orders: OrderItem[] = data?.data || [];
  const total = data?.total || 0;

  const typeOptions = useMemo(
    () => [
      { value: "__all__", label: t("order.filter.allTypes") },
      ...TYPE_FILTERS.map((o) => ({
        value: o.value,
        label: t(`order.type.${typeKey[o.type]}`),
      })),
    ],
    [t],
  );

  const periodOptions = useMemo(
    () => [
      { value: "__all__", label: t("order.filter.allPeriods") },
      ...PERIOD_FILTERS.map((o) => ({
        value: o.value,
        label: t(o.labelKey),
      })),
    ],
    [t],
  );

  const statusOptions = useMemo(
    () => [
      { value: "__all__", label: t("order.filter.allStatuses") },
      ...STATUS_FILTERS.map((o) => ({
        value: o.value,
        label: t(`order.status.${statusKey[o.status]}`),
      })),
    ],
    [t],
  );

  const commissionOptions = useMemo(
    () => [
      { value: "__all__", label: t("order.filter.allCommissions") },
      ...COMMISSION_FILTERS.map((o) => ({
        value: o.value,
        label: t(`order.commission.${commissionKey[o.status]}`),
      })),
    ],
    [t],
  );

  return (
    <>
      <PageHeader
        title={t("order.title")}
        description={t("order.description")}
        actions={
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" />
            {t("order.dialog.addOrder")}
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {userId && (
          <Badge variant="secondary" className="h-8 gap-1.5 pl-2.5 pr-1 font-normal">
            <span className="text-muted-foreground">{t("order.filter.userId")}</span>
            <span className="font-mono tabular-nums">{userId}</span>
            <button
              type="button"
              onClick={clearUserFilter}
              className="ml-0.5 rounded-sm p-0.5 outline-none ring-offset-background hover:bg-muted focus:ring-1 focus:ring-ring"
              title={t("order.filter.clear")}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">{t("order.filter.clear")}</span>
            </button>
          </Badge>
        )}
        <div className="relative min-w-[200px] max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("order.search.placeholder")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={typeFilter || "__all__"}
          onValueChange={(v) => {
            setTypeFilter(v === "__all__" ? "" : v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder={t("order.filter.allTypes")} />
          </SelectTrigger>
          <SelectContent>
            {typeOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={periodFilter || "__all__"}
          onValueChange={(v) => {
            setPeriodFilter(v === "__all__" ? "" : v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder={t("order.filter.allPeriods")} />
          </SelectTrigger>
          <SelectContent>
            {periodOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={statusFilter || "__all__"}
          onValueChange={(v) => {
            setStatusFilter(v === "__all__" ? "" : v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder={t("order.filter.allStatuses")} />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={commissionFilter || "__all__"}
          onValueChange={(v) => {
            const nextVal = v === "__all__" ? "" : v;
            setCommissionFilter(nextVal);
            setPage(1);
            // 与 URL 同步，便于刷新/分享；清除时去掉参数
            const next = new URLSearchParams(searchParams);
            if (nextVal) next.set("commission_status", nextVal);
            else next.delete("commission_status");
            setSearchParams(next, { replace: true });
          }}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder={t("order.filter.allCommissions")} />
          </SelectTrigger>
          <SelectContent>
            {commissionOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 gap-1.5 text-muted-foreground"
            onClick={clearAllFilters}
          >
            <FilterX className="h-4 w-4" />
            {t("order.filter.clearAll")}
          </Button>
        )}
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">
                {t("order.table.columns.tradeNo")}
              </TableHead>
              <TableHead>{t("order.table.columns.type")}</TableHead>
              <TableHead>{t("order.table.columns.user")}</TableHead>
              <TableHead>{t("order.table.columns.plan")}</TableHead>
              <TableHead className="text-right">{t("order.table.columns.amount")}</TableHead>
              <TableHead>{t("order.table.columns.status")}</TableHead>
              <TableHead>{t("order.table.columns.commission")}</TableHead>
              <TableHead className="w-[56px] text-right">
                {t("order.table.columns.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: COL_COUNT }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton
                        className={cn("h-4 w-full", j === 0 && "h-9 w-44")}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : orders.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={COL_COUNT}>
                  <EmptyState
                    icon={<ShoppingCart className="h-10 w-10" />}
                    message={t("common.table.noData")}
                  />
                </TableCell>
              </TableRow>
            ) : (
              orders.map((o) => {
                const email = orderEmail(o);
                const amount = o.actual_amount ?? o.total_amount;
                const commission = Number(o.commission_balance ?? 0);
                const hasCommission = commission > 0;
                const pending = o.status === 0;
                const busy =
                  actionOrder?.trade_no === o.trade_no ||
                  commissionAction?.trade_no === o.trade_no ||
                  !!destructiveAction;

                return (
                  <TableRow
                    key={o.id}
                    className={cn(
                      "group",
                      o.status === 2 && "bg-destructive/[0.02]",
                      o.status === 3 && "bg-emerald-500/[0.02]",
                    )}
                  >
                    <TableCell className="whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            className="font-mono text-xs text-primary underline-offset-2 hover:underline focus:outline-none focus:ring-1 focus:ring-ring rounded whitespace-nowrap"
                            title={o.trade_no}
                            onClick={() => openDetail(o)}
                          >
                            {o.trade_no}
                          </button>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  void copyTradeNo(o.trade_no);
                                }}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {t("order.actions.copyTradeNo")}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <p className="text-[11px] text-muted-foreground tabular-nums">
                          {formatDate(o.created_at)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "h-5 border font-normal",
                          typeTone[o.type as number],
                        )}
                      >
                        {t(
                          `order.type.${typeKey[o.type as number] ?? o.type}`,
                          String(o.type),
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {email ? (
                        <button
                          type="button"
                          className="max-w-[160px] truncate text-left text-sm text-primary underline-offset-2 hover:underline focus:outline-none focus:ring-1 focus:ring-ring rounded"
                          title={email}
                          onClick={() =>
                            navigate(
                              `${adminPath("user")}?email=${encodeURIComponent(email)}`,
                            )
                          }
                        >
                          {email}
                        </button>
                      ) : o.user_id ? (
                        <span className="font-mono text-xs text-muted-foreground">
                          #{o.user_id}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="min-w-0 space-y-0.5">
                        <p
                          className="truncate text-sm font-medium"
                          title={
                            o.plan?.name ||
                            (o.plan_id ? `#${o.plan_id}` : undefined)
                          }
                        >
                          {o.plan?.name ||
                            (o.plan_id ? `#${o.plan_id}` : "—")}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {t(`order.period.${o.period}`, o.period)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="tabular-nums text-sm font-semibold tracking-tight">
                        {formatCurrency(amount)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            "h-1.5 w-1.5 shrink-0 rounded-full",
                            statusDot[o.status as number] ?? "bg-muted-foreground",
                          )}
                        />
                        <Badge
                          variant={
                            statusVariant[o.status as number] ?? "secondary"
                          }
                          className="h-5 font-normal"
                        >
                          {t(
                            `order.status.${statusKey[o.status as number] ?? o.status}`,
                            String(o.status),
                          )}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {hasCommission ? (
                        <div className="space-y-1">
                          <p className="tabular-nums text-sm font-medium">
                            {formatCurrency(commission)}
                          </p>
                          <Badge
                            variant={
                              commissionVariant[
                                o.commission_status as number
                              ] ?? "secondary"
                            }
                            className="h-5 font-normal"
                          >
                            {t(
                              `order.commission.${commissionKey[o.commission_status as number] ?? o.commission_status}`,
                              String(o.commission_status),
                            )}
                          </Badge>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            disabled={busy}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {busy ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4" />
                            )}
                            <span className="sr-only">
                              {t("order.actions.openMenu")}
                            </span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem onClick={() => openDetail(o)}>
                            <Eye className="h-4 w-4" />
                            {t("order.actions.view")}
                          </DropdownMenuItem>
                          {pending && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                disabled={busy}
                                onClick={async () => {
                                  if (actionOrder) return;
                                  setActionOrder({
                                    trade_no: o.trade_no,
                                    type: "paid",
                                  });
                                  try {
                                    await markAsPaid(o.trade_no);
                                    toast.success(
                                      t("order.messages.markPaidSuccess"),
                                    );
                                    qc.invalidateQueries({
                                      queryKey: ["orders"],
                                    });
                                  } catch {
                                  } finally {
                                    setActionOrder(null);
                                  }
                                }}
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                {t("order.actions.markAsPaid")}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                disabled={busy}
                                className="text-destructive focus:text-destructive"
                                onClick={() => {
                                  setDestructiveAction({
                                    trade_no: o.trade_no,
                                    type: "cancelOrder",
                                  });
                                }}
                              >
                                <XCircle className="h-4 w-4" />
                                {t("order.actions.cancel")}
                              </DropdownMenuItem>
                            </>
                          )}
                          {hasCommission && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                disabled={
                                  busy || o.commission_status === 1
                                }
                                onClick={async () => {
                                  if (commissionAction || destructiveAction)
                                    return;
                                  setCommissionAction({
                                    trade_no: o.trade_no,
                                    type: "issue",
                                  });
                                  try {
                                    await updateOrder({
                                      trade_no: o.trade_no,
                                      commission_status: 1,
                                    });
                                    toast.success(
                                      t("order.messages.commissionIssueSuccess"),
                                    );
                                    qc.invalidateQueries({
                                      queryKey: ["orders"],
                                    });
                                  } catch {
                                  } finally {
                                    setCommissionAction(null);
                                  }
                                }}
                              >
                                <Send className="h-4 w-4" />
                                {t("order.actions.issue")}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                disabled={
                                  busy || o.commission_status === 3
                                }
                                className="text-destructive focus:text-destructive"
                                onClick={() => {
                                  setDestructiveAction({
                                    trade_no: o.trade_no,
                                    type: "invalidCommission",
                                  });
                                }}
                              >
                                <Ban className="h-4 w-4" />
                                {t("order.actions.invalid")}
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={(s) => {
            setPageSize(s);
            setPage(1);
          }}
        />
      </div>

      <OrderDetailDialog
        order={detail}
        onOpenChange={(v) => !v && setDetail(null)}
      />

      <ConfirmDialog
        open={!!destructiveAction}
        onOpenChange={(v) => !v && setDestructiveAction(null)}
        title={
          destructiveAction?.type === "cancelOrder"
            ? t("order.actions.cancel")
            : t("order.actions.invalid")
        }
        description={
          destructiveAction?.type === "cancelOrder"
            ? t("order.messages.cancelConfirm")
            : t("order.messages.commissionInvalidConfirm")
        }
        variant="destructive"
        loading={destructiveLoading}
        onConfirm={async () => {
          if (!destructiveAction) return;
          setDestructiveLoading(true);
          try {
            if (destructiveAction.type === "cancelOrder") {
              await cancelOrder(destructiveAction.trade_no);
              toast.success(t("order.messages.cancelSuccess"));
            } else {
              await updateOrder({
                trade_no: destructiveAction.trade_no,
                commission_status: 3,
              });
              toast.success(t("order.messages.commissionInvalidSuccess"));
            }
            qc.invalidateQueries({ queryKey: ["orders"] });
            setDestructiveAction(null);
          } catch {
          } finally {
            setDestructiveLoading(false);
          }
        }}
      />

      <Dialog
        open={addOpen}
        onOpenChange={(v) => {
          setAddOpen(v);
          if (!v) {
            setAddEmail("");
            setAddPlanId("");
            setAddPeriod("");
            setAddAmount("");
          }
        }}
      >
        <DialogContent className="max-w-md max-h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
            <DialogTitle>{t("order.dialog.assignOrder")}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0 overflow-y-auto space-y-3 px-6 py-4">
            <div className="space-y-1.5">
              <Label>{t("order.dialog.fields.userEmail")}</Label>
              <Input
                value={addEmail}
                onChange={(e) => setAddEmail(e.target.value)}
                placeholder={t("order.dialog.placeholders.email")}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("order.dialog.fields.subscriptionPlan")}</Label>
              <Select value={addPlanId} onValueChange={setAddPlanId}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("order.dialog.placeholders.plan")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t("order.dialog.fields.orderPeriod")}</Label>
              <Select value={addPeriod} onValueChange={setAddPeriod}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("order.dialog.placeholders.period")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {ASSIGN_PERIODS.map((v) => (
                    <SelectItem key={v} value={v}>
                      {t(`order.period.${v}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>
                {t("order.dialog.fields.paymentAmount")} (
                {t("common.currency.yuan")})
              </Label>
              <Input
                type="number"
                step="0.01"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                placeholder={t("order.dialog.placeholders.amount")}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 border-t px-6 py-4 shrink-0">
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              {t("order.dialog.actions.cancel")}
            </Button>
            <Button
              disabled={addSubmitting}
              onClick={async () => {
                if (!addEmail || !addPlanId || !addPeriod) return;
                setAddSubmitting(true);
                try {
                  await assignOrder({
                    email: addEmail,
                    plan_id: Number(addPlanId),
                    period: addPeriod as any,
                    total_amount: Number(addAmount || 0),
                  });
                  toast.success(t("order.messages.addSuccess"));
                  setAddOpen(false);
                  qc.invalidateQueries({ queryKey: ["orders"] });
                } catch {
                } finally {
                  setAddSubmitting(false);
                }
              }}
            >
              {addSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {t("order.dialog.actions.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function OrderDetailDialog({
  order,
  onOpenChange,
}: {
  order: OrderItem | null;
  onOpenChange: (v: boolean) => void;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  if (!order) return null;

  const email = orderEmail(order);
  const showCommission = Number(order.commission_balance ?? 0) > 0;

  const basicFields = [
    {
      label: t("order.table.columns.status"),
      value: (
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "h-1.5 w-1.5 shrink-0 rounded-full",
              statusDot[order.status as number] ?? "bg-muted-foreground",
            )}
          />
          <Badge
            variant={statusVariant[order.status as number] ?? "secondary"}
            className="h-5 font-normal"
          >
            {t(
              `order.status.${statusKey[order.status as number] ?? order.status}`,
              String(order.status),
            )}
          </Badge>
        </div>
      ),
    },
    {
      label: t("order.table.columns.type"),
      value: (
        <Badge
          variant="outline"
          className={cn(
            "h-5 border font-normal",
            typeTone[order.type as number],
          )}
        >
          {t(
            `order.type.${typeKey[order.type as number] ?? order.type}`,
            String(order.type),
          )}
        </Badge>
      ),
    },
    {
      label: t("order.dialog.fields.userEmail"),
      value: email ? (
        <button
          type="button"
          className="cursor-pointer text-primary underline-offset-2 hover:underline focus:outline-none focus:ring-1 focus:ring-ring rounded"
          onClick={() =>
            navigate(
              `${adminPath("user")}?email=${encodeURIComponent(email)}`,
            )
          }
        >
          {email}
        </button>
      ) : order.user_id ? (
        `#${order.user_id}`
      ) : (
        "—"
      ),
    },
    { label: t("order.table.columns.tradeNo"), value: order.trade_no },
    {
      label: t("order.dialog.fields.callbackNo"),
      value: order.callback_no || "—",
    },
    {
      label: t("order.dialog.fields.subscriptionPlan"),
      value:
        order.plan?.name || (order.plan_id ? `#${order.plan_id}` : "—"),
    },
    {
      label: t("order.dialog.fields.orderPeriod"),
      value: t(`order.period.${order.period}`, order.period),
    },
  ];

  const amountFields = [
    {
      label: t("order.dialog.fields.paymentAmount"),
      value: (
        <span className="font-semibold tabular-nums">
          {formatCurrency(order.actual_amount ?? order.total_amount ?? 0)}
        </span>
      ),
    },
    {
      label: t("order.dialog.fields.discountAmount"),
      value: formatCurrency(order.discount_amount ?? 0),
    },
    {
      label: t("order.dialog.fields.balancePayment"),
      value: formatCurrency(order.balance_amount ?? 0),
    },
    {
      label: t("order.dialog.fields.refundAmount"),
      value: formatCurrency(order.refund_amount ?? 0),
    },
  ];

  const commissionFields = showCommission
    ? [
        {
          label: t("order.dialog.fields.commissionAmount"),
          value: (
            <span className="font-semibold tabular-nums">
              {formatCurrency(order.commission_balance ?? 0)}
            </span>
          ),
        },
        {
          label: t("order.dialog.fields.commissionStatus"),
          value:
            order.commission_status !== undefined ? (
              <Badge
                variant={
                  commissionVariant[order.commission_status as number] ??
                  "secondary"
                }
                className="h-5 font-normal"
              >
                {t(
                  `order.commission.${commissionKey[order.commission_status as number] ?? order.commission_status}`,
                  String(order.commission_status),
                )}
              </Badge>
            ) : (
              "—"
            ),
        },
      ]
    : [];

  const timeFields = [
    {
      label: t("order.dialog.fields.createdAt"),
      value: formatDate(order.created_at),
    },
    {
      label: t("order.dialog.fields.updatedAt"),
      value: formatDate(order.updated_at),
    },
  ];

  const sections = [
    { title: t("order.dialog.basicInfo"), fields: basicFields },
    { title: t("order.dialog.amountInfo"), fields: amountFields },
    ...(showCommission
      ? [{ title: t("order.dialog.commissionInfo"), fields: commissionFields }]
      : []),
    { title: t("order.dialog.timeInfo"), fields: timeFields },
  ];

  return (
    <Dialog open={!!order} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
          <DialogTitle>{t("order.dialog.title")}</DialogTitle>
          <DialogDescription className="flex flex-wrap items-center gap-2">
            <Badge
              variant={statusVariant[order.status as number] ?? "secondary"}
              className="h-5 font-normal"
            >
              {t(
                `order.status.${statusKey[order.status as number] ?? order.status}`,
                String(order.status),
              )}
            </Badge>
            <span className="font-mono text-xs">#{order.trade_no}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-y-auto space-y-5 px-6 py-4">
          {sections.map((section) => (
            <div key={section.title} className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {section.title}
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {section.fields.map((f) => (
                  <div key={f.label as string} className="space-y-1">
                    <p className="text-xs text-muted-foreground">{f.label}</p>
                    <div className="text-sm font-medium">{f.value ?? "—"}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
