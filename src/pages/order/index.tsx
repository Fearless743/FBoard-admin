import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, Plus, X, CheckCircle2, XCircle, Loader2, MoreHorizontal, Send, Ban } from "lucide-react";
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
import { fetchOrders, getOrderDetail, cancelOrder, markAsPaid, updateOrder, assignOrder, type OrderItem } from "@/api/order";
import { usePlanOptions } from "@/hooks/use-plans";
import { formatCurrency, formatDate } from "@/lib/utils";
import { adminPath } from "@/lib/paths";

const statusVariant: Record<number, "default" | "destructive" | "success" | "warning" | "secondary"> = {
  0: "warning",
  1: "default",
  2: "destructive",
  3: "success",
  4: "secondary",
};
const statusKey: any = {
  0: "PENDING",
  1: "PROCESSING",
  2: "CANCELLED",
  3: "COMPLETED",
  4: "DISCOUNTED",
};
const typeKey: any = {
  1: "NEW",
  2: "RENEWAL",
  3: "UPGRADE",
  4: "RESET_FLOW",
};
const commissionKey: any = {
  0: "PENDING",
  1: "PROCESSING",
  2: "VALID",
  3: "INVALID",
};

const allTypes = [
  { value: "", label: "全部类型" },
  { value: "1", label: "新购" },
  { value: "2", label: "续费" },
  { value: "3", label: "升级" },
  { value: "4", label: "流量重置" },
];

const allPeriods = [
  { value: "", label: "全部周期" },
  { value: "monthly", label: "月付" },
  { value: "quarterly", label: "季付" },
  { value: "half_yearly", label: "半年付" },
  { value: "yearly", label: "年付" },
  { value: "two_yearly", label: "两年付" },
  { value: "three_yearly", label: "三年付" },
  { value: "onetime", label: "一次性" },
  { value: "reset_traffic", label: "流量重置包" },
];

const allStatuses = [
  { value: "", label: "全部状态" },
  { value: "0", label: "待支付" },
  { value: "1", label: "开通中" },
  { value: "2", label: "已取消" },
  { value: "3", label: "已完成" },
  { value: "4", label: "已折抵" },
];

const allCommissions = [
  { value: "", label: "全部佣金状态" },
  { value: "0", label: "待确认" },
  { value: "1", label: "发放中" },
  { value: "2", label: "有效" },
  { value: "3", label: "无效" },
];

export function OrderListPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const userId = searchParams.get("user_id");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const { data: plans = [] } = usePlanOptions();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [periodFilter, setPeriodFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [commissionFilter, setCommissionFilter] = useState("");
  const [detail, setDetail] = useState<OrderItem | null>(null);
  const [actionOrder, setActionOrder] = useState<{ trade_no: string; type: "paid" | "cancel" } | null>(null);
  const [commissionAction, setCommissionAction] = useState<{ trade_no: string; type: "issue" | "invalid" } | null>(null);
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

  const clearUserFilter = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("user_id");
    setSearchParams(next);
  };

  const queryFilters: Array<{ id: string; value: any; logic?: string }> = [];
  if (search) queryFilters.push({ id: "trade_no", value: search });
  if (typeFilter) queryFilters.push({ id: "type", value: Number(typeFilter) });
  if (periodFilter) queryFilters.push({ id: "period", value: periodFilter });
  if (statusFilter) queryFilters.push({ id: "status", value: Number(statusFilter) });
  if (commissionFilter) queryFilters.push({ id: "commission_status", value: Number(commissionFilter) });
  if (userId) queryFilters.push({ id: "user_id", value: `eq:${userId}` });

  const { data, isLoading } = useQuery({
    queryKey: ["orders", { page, pageSize, search, typeFilter, periodFilter, statusFilter, commissionFilter, userId }],
    queryFn: () =>
      fetchOrders({
        current: page,
        pageSize,
        filter: queryFilters.length > 0 ? queryFilters : [],
      }),
  });

  const orders: OrderItem[] = data?.data || [];
  const total = data?.total || 0;

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
          <Badge variant="secondary" className="gap-1 pl-2.5">
            用户 ID: {userId}
            <button
              type="button"
              onClick={clearUserFilter}
              className="ml-1 rounded-sm outline-none ring-offset-background focus:ring-1 focus:ring-ring"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">清除</span>
            </button>
          </Badge>
        )}
        <div className="relative max-w-sm flex-1">
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
        <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder={allTypes[0].label} />
          </SelectTrigger>
          <SelectContent>
            {allTypes.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={periodFilter} onValueChange={(v) => { setPeriodFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder={allPeriods[0].label} />
          </SelectTrigger>
          <SelectContent>
            {allPeriods.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder={allStatuses[0].label} />
          </SelectTrigger>
          <SelectContent>
            {allStatuses.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={commissionFilter} onValueChange={(v) => { setCommissionFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={allCommissions[0].label} />
          </SelectTrigger>
          <SelectContent>
            {allCommissions.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("order.table.columns.tradeNo")}</TableHead>
              <TableHead>{t("order.table.columns.type")}</TableHead>
              <TableHead>{t("order.table.columns.plan")}</TableHead>
              <TableHead>{t("order.table.columns.period")}</TableHead>
              <TableHead className="text-right">{t("order.table.columns.amount")}</TableHead>
              <TableHead>{t("order.table.columns.status")}</TableHead>
              <TableHead className="text-right">{t("order.table.columns.commission")}</TableHead>
              <TableHead className="text-right">{t("order.table.columns.commissionStatus")}</TableHead>
              <TableHead>{t("order.table.columns.createdAt")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 9 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9}>
                  <EmptyState />
                </TableCell>
              </TableRow>
            ) : (
              orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs">
                    <button
                      type="button"
                      className="cursor-pointer text-primary underline-offset-2 hover:underline focus:outline-none focus:ring-1 focus:ring-ring rounded"
                      onClick={async () => {
                        try {
                          const d = await getOrderDetail(o.id);
                          setDetail(d || o);
                        } catch {
                          setDetail(o);
                        }
                      }}
                    >
                      {o.trade_no}
                    </button>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {t(`order.type.${typeKey[o.type] ?? o.type}`, String(o.type))}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {o.plan?.name || (o.plan_id ? `#${o.plan_id}` : "—")}
                  </TableCell>
                  <TableCell className="text-xs">
                    {t(`order.period.${o.period}`, o.period)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrency(o.actual_amount ?? o.total_amount)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={statusVariant[o.status as number] ?? "secondary"}>
                        {t(`order.status.${statusKey[o.status as number] ?? o.status}`, String(o.status))}
                      </Badge>
                      {o.status === 0 && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                              disabled={actionOrder?.trade_no === o.trade_no || !!destructiveAction}
                              onClick={async () => {
                                if (actionOrder) return;
                                setActionOrder({ trade_no: o.trade_no, type: "paid" });
                                try {
                                  await markAsPaid(o.trade_no);
                                  toast.success(t("order.messages.markPaidSuccess"));
                                  qc.invalidateQueries({ queryKey: ["orders"] });
                                } catch {
                                } finally {
                                  setActionOrder(null);
                                }
                              }}
                            >
                              {actionOrder?.trade_no === o.trade_no && actionOrder.type === "paid" ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle2 className="h-4 w-4" />
                              )}
                              {t("order.actions.markAsPaid")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={actionOrder?.trade_no === o.trade_no || !!destructiveAction}
                              className="text-destructive focus:text-destructive"
                              onClick={() => {
                                setDestructiveAction({ trade_no: o.trade_no, type: "cancelOrder" });
                              }}
                            >
                              <XCircle className="h-4 w-4" />
                              {t("order.actions.cancel")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {Number(o.commission_balance ?? 0) > 0
                      ? formatCurrency(o.commission_balance ?? 0)
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {Number(o.commission_balance ?? 0) > 0 ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <Badge variant="secondary">
                          {t(`order.commission.${commissionKey[o.commission_status as number] ?? o.commission_status}`, String(o.commission_status))}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-32">
                            <DropdownMenuItem
                              disabled={
                                (commissionAction?.trade_no === o.trade_no) ||
                                !!destructiveAction ||
                                o.commission_status === 1
                              }
                              onClick={async () => {
                                if (commissionAction || destructiveAction) return;
                                setCommissionAction({ trade_no: o.trade_no, type: "issue" });
                                try {
                                  await updateOrder({
                                    trade_no: o.trade_no,
                                    commission_status: 1,
                                  });
                                  toast.success(t("order.messages.commissionIssueSuccess"));
                                  qc.invalidateQueries({ queryKey: ["orders"] });
                                } catch {
                                } finally {
                                  setCommissionAction(null);
                                }
                              }}
                            >
                              {commissionAction?.trade_no === o.trade_no && commissionAction.type === "issue" ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Send className="h-4 w-4" />
                              )}
                              {t("order.actions.issue")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={
                                (commissionAction?.trade_no === o.trade_no) ||
                                !!destructiveAction ||
                                o.commission_status === 3
                              }
                              className="text-destructive focus:text-destructive"
                              onClick={() => {
                                setDestructiveAction({ trade_no: o.trade_no, type: "invalidCommission" });
                              }}
                            >
                              <Ban className="h-4 w-4" />
                              {t("order.actions.invalid")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(o.created_at)}
                  </TableCell>
                </TableRow>
              ))
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
              await updateOrder({ trade_no: destructiveAction.trade_no, commission_status: 3 });
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

      <Dialog open={addOpen} onOpenChange={(v) => {
        setAddOpen(v);
        if (!v) { setAddEmail(""); setAddPlanId(""); setAddPeriod(""); setAddAmount(""); }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("order.dialog.assignOrder")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>{t("order.dialog.fields.userEmail")}</Label>
              <Input value={addEmail} onChange={(e) => setAddEmail(e.target.value)} placeholder={t("order.dialog.placeholders.email")} />
            </div>
            <div className="space-y-1.5">
              <Label>{t("order.dialog.fields.subscriptionPlan")}</Label>
              <Select value={addPlanId} onValueChange={setAddPlanId}>
                <SelectTrigger>
                  <SelectValue placeholder={t("order.dialog.placeholders.plan")} />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t("order.dialog.fields.orderPeriod")}</Label>
              <Select value={addPeriod} onValueChange={setAddPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder={t("order.dialog.placeholders.period")} />
                </SelectTrigger>
                <SelectContent>
                  {[
                    ["month_price", "月付"],
                    ["quarter_price", "季付"],
                    ["half_year_price", "半年付"],
                    ["year_price", "年付"],
                    ["two_year_price", "两年付"],
                    ["three_year_price", "三年付"],
                    ["onetime_price", "一次性"],
                    ["reset_price", "流量重置包"],
                  ].map(([v, label]) => (
                    <SelectItem key={v} value={v}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t("order.dialog.fields.paymentAmount")} (元)</Label>
              <Input type="number" step="0.01" value={addAmount} onChange={(e) => setAddAmount(e.target.value)} />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setAddOpen(false)}>{t("order.actions.cancel")}</Button>
            <Button disabled={addSubmitting} onClick={async () => {
              if (!addEmail || !addPlanId || !addPeriod) return;
              setAddSubmitting(true);
              try {
                await assignOrder({ email: addEmail, plan_id: Number(addPlanId), period: addPeriod as any, total_amount: Number(addAmount || 0) });
                toast.success(t("order.messages.addSuccess"));
                setAddOpen(false);
                qc.invalidateQueries({ queryKey: ["orders"] });
              } catch {} finally { setAddSubmitting(false); }
            }}>
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

  const email = order.user?.email || order.user_email;
  const showCommission = Number(order.commission_balance ?? 0) > 0;
  const fields = [
    {
      label: t("order.table.columns.status"),
      value: (
        <Badge variant={statusVariant[order.status as number] ?? "secondary"}>
          {t(`order.status.${statusKey[order.status as number] ?? order.status}`, String(order.status))}
        </Badge>
      ),
    },
    {
      label: t("order.dialog.fields.userEmail"),
      value: email ? (
        <button
          type="button"
          className="cursor-pointer text-primary underline-offset-2 hover:underline focus:outline-none focus:ring-1 focus:ring-ring rounded"
          onClick={() => navigate(`${adminPath("user")}?email=${encodeURIComponent(email)}`)}
        >
          {email}
        </button>
      ) : "—",
    },
    { label: t("order.table.columns.tradeNo"), value: order.trade_no },
    { label: t("order.dialog.fields.callbackNo"), value: order.callback_no },
    {
      label: t("order.dialog.fields.subscriptionPlan"),
      value: order.plan?.name || (order.plan_id ? `#${order.plan_id}` : "—"),
    },
    { label: t("order.dialog.fields.orderPeriod"), value: t(`order.period.${order.period}`, order.period) },
    { label: t("order.dialog.fields.paymentAmount"), value: formatCurrency(order.actual_amount ?? order.total_amount ?? 0) },
    { label: t("order.dialog.fields.discountAmount"), value: formatCurrency(order.discount_amount ?? 0) },
    { label: t("order.dialog.fields.balancePayment"), value: formatCurrency(order.balance_amount ?? 0) },
    { label: t("order.dialog.fields.refundAmount"), value: formatCurrency(order.refund_amount ?? 0) },
    ...(showCommission
      ? [
          {
            label: t("order.dialog.fields.commissionAmount"),
            value: formatCurrency(order.commission_balance ?? 0),
          },
          {
            label: t("order.dialog.fields.commissionStatus"),
            value:
              order.commission_status !== undefined
                ? t(
                    `order.commission.${commissionKey[order.commission_status as number] ?? order.commission_status}`,
                    String(order.commission_status),
                  )
                : "—",
          },
        ]
      : []),
    { label: t("order.dialog.fields.createdAt"), value: formatDate(order.created_at) },
    { label: t("order.dialog.fields.updatedAt"), value: formatDate(order.updated_at) },
  ];

  return (
    <Dialog open={!!order} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("order.dialog.title")}</DialogTitle>
          <DialogDescription>
            {t(`order.status.${statusKey[order.status as number] ?? order.status}`, String(order.status))} ·
            #{order.trade_no}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.label as string} className="space-y-1">
              <p className="text-xs text-muted-foreground">{f.label}</p>
              <p className="text-sm font-medium">{f.value ?? "—"}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
