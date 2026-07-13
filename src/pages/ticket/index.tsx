import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Eye, X, Loader2, User, Activity, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { IdBadge } from "@/components/common/id-badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  closeTicket,
  fetchTickets,
  replyTicket,
  getTicketDetail,
  type TicketItem,
} from "@/api/misc";
import { getStatUser } from "@/api/stat";
import { fetchOrders, type OrderItem } from "@/api/order";
import { formatBytes, formatDate, formatCurrency } from "@/lib/utils";
import { UserEditDialog } from "@/pages/user/user-edit-dialog";

const statusKey: any = {
  0: "processing",
  1: "closed",
};

const levelKey: any = {
  0: "low",
  1: "medium",
  2: "high",
};

export function TicketListPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("0");
  const [viewing, setViewing] = useState<TicketItem | null>(null);
  const [detailData, setDetailData] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (detailData?.messages?.length) {
      messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [detailData]);
  const [closing, setClosing] = useState<TicketItem | null>(null);
  const [reply, setReply] = useState("");
  const [replying, setReplying] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [showTrafficRecords, setShowTrafficRecords] = useState(false);
  const [showOrders, setShowOrders] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["tickets", { page, pageSize, search, statusFilter }],
    queryFn: () =>
      fetchTickets({
        current: page,
        pageSize,
        filter: [
          ...(search ? [{ id: "subject", value: search }] : []),
          ...(statusFilter ? [{ id: "status", value: statusFilter }] : []),
        ],
      }),
  });

  const list: TicketItem[] = data?.data || [];
  const total = data?.total || 0;

  const doReply = async () => {
    if (!viewing || !reply.trim()) return;
    setReplying(true);
    try {
      await replyTicket({ id: viewing.id, message: reply });
      toast.success("已回复");
      setReply("");
      const d = await getTicketDetail(viewing.id);
      setDetailData(d);
      qc.invalidateQueries({ queryKey: ["tickets"] });
    } catch (e) {
    } finally {
      setReplying(false);
    }
  };

  return (
    <>
      <PageHeader
        title={t("ticket.title")}
        description={t("ticket.description")}
      />

      <Tabs
        value={statusFilter}
        onValueChange={(v) => {
          setStatusFilter(v);
          setPage(1);
        }}
        className="mb-4"
      >
        <TabsList>
          <TabsTrigger value="0">{t("ticket.status.processing")}</TabsTrigger>
          <TabsTrigger value="1">{t("ticket.status.closed")}</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("ticket.list.search_placeholder")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">{t("ticket.columns.id")}</TableHead>
              <TableHead>{t("ticket.columns.subject")}</TableHead>
              <TableHead className="w-24">
                {t("ticket.columns.level")}
              </TableHead>
              <TableHead className="w-24">
                {t("ticket.columns.status")}
              </TableHead>
              <TableHead className="w-40">
                {t("ticket.columns.updated_at")}
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : list.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <EmptyState />
                </TableCell>
              </TableRow>
            ) : (
              list.map((tk) => (
                <TableRow key={tk.id}>
                  <TableCell><IdBadge id={tk.id} /></TableCell>
                  <TableCell className="font-medium">{tk.subject}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {t(`ticket.level.${levelKey[tk.level] ?? tk.level}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {tk.status === 1 ? (
                      <Badge variant="secondary">
                        {t("ticket.status.closed")}
                      </Badge>
                    ) : (
                      <Badge
                        variant={
                          tk.reply_status === 1 ? "success" : "destructive"
                        }
                      >
                        {tk.reply_status === 1
                          ? t("ticket.status.replied")
                          : t("ticket.status.unreplied")}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(tk.updated_at)}
                  </TableCell>
                  <TableCell className="text-right flex gap-1 justify-end">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={async () => {
                        setViewing(tk);
                        setDetailLoading(true);
                        try {
                          const d = await getTicketDetail(tk.id);
                          setDetailData(d);
                        } catch {
                          setDetailData(null);
                        } finally {
                          setDetailLoading(false);
                        }
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {tk.status !== 1 && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setClosing(tk)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
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

      {/* 聊天对话框 */}
      <Dialog
        open={!!viewing}
        onOpenChange={(v) => !v && (setViewing(null), setDetailData(null))}
      >
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 gap-0">
          <div className="flex flex-1 min-h-0">
            {/* 左侧：工单列表 */}
            <div className="w-64 border-r flex flex-col min-h-0">
              <div className="border-b px-3 py-2.5 text-xs font-medium text-muted-foreground">
                {t("ticket.list.title")} ({total})
              </div>
              <div className="flex-1 overflow-y-auto">
                {list.map((tk) => (
                  <button
                    key={tk.id}
                    type="button"
                    className={`w-full text-left px-3 py-2.5 border-b hover:bg-muted/50 transition-colors ${
                      viewing?.id === tk.id ? "bg-muted" : ""
                    }`}
                    onClick={async () => {
                      if (viewing?.id === tk.id) return;
                      setViewing(tk);
                      setDetailLoading(true);
                      try {
                        const d = await getTicketDetail(tk.id);
                        setDetailData(d);
                      } catch {
                        setDetailData(null);
                      } finally {
                        setDetailLoading(false);
                      }
                    }}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <IdBadge id={tk.id} compact />
                      {tk.status === 1 ? (
                        <Badge variant="secondary" className="text-[10px] px-1 py-0">
                          {t("ticket.status.closed")}
                        </Badge>
                      ) : (
                        <Badge
                          variant={tk.reply_status === 1 ? "success" : "destructive"}
                          className="text-[10px] px-1 py-0"
                        >
                          {tk.reply_status === 1
                            ? t("ticket.status.replied")
                            : t("ticket.status.unreplied")}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm truncate">{tk.subject}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 右侧：聊天区 */}
            <div className="flex-1 flex flex-col min-h-0">
              {/* 头部 */}
              <div className="border-b px-6 py-4">
                <div className="flex items-center gap-2 pr-10">
                  <DialogTitle className="truncate min-w-0">
                    {viewing?.subject}
                  </DialogTitle>
                  {viewing?.status !== 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="shrink-0 text-destructive hover:text-destructive px-2"
                      onClick={() => setClosing(viewing)}
                    >
                      {t("ticket.actions.close_ticket")}
                    </Button>
                  )}
                </div>
                <DialogDescription className="mt-0.5 flex items-center gap-1.5">
                  <span>{detailData?.user?.email || viewing?.user_email || `#${viewing?.id}`}</span>
                  <span>·</span>
                  <span>{t(`ticket.status.${statusKey[viewing?.status ?? 0] ?? viewing?.status}`)}</span>
                  <span className="ml-1 flex items-center gap-0.5">
                    <Button size="icon" variant="ghost" className="h-6 w-6" title="用户信息" onClick={() => setShowUserInfo(true)}>
                      <User className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-6 w-6" title={t("ticket.detail.traffic_records")} onClick={() => setShowTrafficRecords(true)}>
                      <Activity className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-6 w-6" title={t("ticket.detail.order_records")} onClick={() => setShowOrders(true)}>
                      <ClipboardList className="h-3.5 w-3.5" />
                    </Button>
                  </span>
                </DialogDescription>
              </div>

              {/* 消息区 */}
              <div ref={messagesRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {detailLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-16 w-3/4 rounded-lg" />
                    <Skeleton className="h-20 w-1/2 rounded-lg ml-auto" />
                    <Skeleton className="h-12 w-2/3 rounded-lg" />
                  </div>
                ) : detailData?.messages?.length > 0 ? (
                  detailData.messages.map((msg: any) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.is_from_admin ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                          msg.is_from_admin
                            ? "bg-primary text-primary-foreground rounded-tr-sm"
                            : "bg-muted rounded-tl-sm"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">
                          {msg.message}
                        </p>
                        <p
                          className={`mt-1 text-[10px] opacity-60 ${
                            msg.is_from_admin ? "text-right" : "text-left"
                          }`}
                        >
                          {formatDate(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    {viewing?.content || t("ticket.detail.no_messages")}
                  </div>
                )}
              </div>

              {/* 输入区 */}
              <div className="border-t p-4">
                {viewing?.status === 1 && (
                  <p className="mb-2 text-center text-xs text-muted-foreground">
                    {t("ticket.detail.input.closed_hint")}
                  </p>
                )}
                <div className="flex gap-2">
                  <Textarea
                    rows={2}
                    className="min-h-[40px] resize-none"
                    placeholder={t("ticket.detail.input.reply_placeholder")}
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                  />
                  <Button
                    className="self-end shrink-0"
                    onClick={doReply}
                    disabled={replying || !reply.trim()}
                  >
                    {replying && <Loader2 className="h-4 w-4 animate-spin" />}
                    {t("ticket.detail.input.send")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 用户信息弹窗 */}
      <UserEditDialog
        open={showUserInfo}
        onOpenChange={setShowUserInfo}
        user={detailData?.user || null}
        onSaved={() => {}}
      />

      {/* 流量记录弹窗 */}
      <Dialog open={showTrafficRecords} onOpenChange={setShowTrafficRecords}>
        <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{t("ticket.detail.traffic_records")}</DialogTitle>
          </DialogHeader>
          <TrafficRecordsView userId={detailData?.user?.id || viewing?.user_id} />
        </DialogContent>
      </Dialog>

      {/* 订单记录弹窗 */}
      <Dialog open={showOrders} onOpenChange={setShowOrders}>
        <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{t("ticket.detail.order_records")}</DialogTitle>
          </DialogHeader>
          <OrderRecordsView userId={viewing?.user_id} />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!closing}
        onOpenChange={(v) => !v && setClosing(null)}
        title={t("ticket.actions.close_confirm_title")}
        description={t("ticket.actions.close_confirm_description")}
        confirmText={t("ticket.actions.close_confirm_button")}
        onConfirm={async () => {
          if (!closing) return;
          try {
            await closeTicket(closing.id);
            toast.success(t("ticket.actions.close_success"));
            qc.invalidateQueries({ queryKey: ["tickets"] });
            setClosing(null);
            setViewing(null);
          } catch (e) {}
        }}
      />
    </>
  );
}

function TrafficRecordsView({ userId }: { userId?: number }) {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery({
    queryKey: ["ticket-user-traffic", userId],
    queryFn: () => getStatUser(userId!, 1, 50),
    enabled: !!userId,
  });
  const list = data?.data || [];
  return (
    <div className="flex-1 overflow-y-auto -mx-6 px-6">
      {isLoading ? (
        <Skeleton className="h-20 w-full rounded-lg" />
      ) : list.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("traffic.trafficRecord.time")}</TableHead>
                <TableHead className="text-right">{t("traffic.trafficRecord.upload")}</TableHead>
                <TableHead className="text-right">{t("traffic.trafficRecord.download")}</TableHead>
                <TableHead className="text-right">{t("traffic.trafficRecord.total")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell>{formatDate(r.record_at, false)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatBytes(r.u || 0)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatBytes(r.d || 0)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatBytes((r.u || 0) + (r.d || 0))}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function OrderRecordsView({ userId }: { userId?: number }) {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery({
    queryKey: ["ticket-user-orders", userId],
    queryFn: () => fetchOrders({ current: 1, pageSize: 50, filter: [{ id: "user_id", value: `eq:${userId}` }] }),
    enabled: !!userId,
  });
  const list: OrderItem[] = data?.data || [];

  const typeKey: any = { 1: "NEW", 2: "RENEWAL", 3: "UPGRADE", 4: "RESET_FLOW" };
  const statusKey: any = { 0: "PENDING", 1: "PROCESSING", 2: "CANCELLED", 3: "COMPLETED", 4: "DISCOUNTED" };

  return (
    <div className="flex-1 overflow-y-auto -mx-6 px-6">
      {isLoading ? (
        <Skeleton className="h-20 w-full rounded-lg" />
      ) : list.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("order.table.columns.tradeNo")}</TableHead>
                <TableHead>{t("order.table.columns.type")}</TableHead>
                <TableHead>{t("order.table.columns.plan")}</TableHead>
                <TableHead>{t("order.table.columns.period")}</TableHead>
                <TableHead>{t("order.table.columns.status")}</TableHead>
                <TableHead>{t("order.table.columns.createdAt")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs">{o.trade_no}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{t(`order.type.${typeKey[o.type as number] ?? o.type}`, String(o.type))}</Badge>
                  </TableCell>
                  <TableCell>{o.plan?.name || (o.plan_id ? `#${o.plan_id}` : "—")}</TableCell>
                  <TableCell className="text-xs">{t(`order.period.${o.period}`, o.period)}</TableCell>
                  <TableCell>
                    <Badge variant={o.status === 2 ? "destructive" : o.status === 3 ? "success" : o.status === 0 ? "warning" : "secondary"}>
                      {t(`order.status.${statusKey[o.status as number] ?? o.status}`, String(o.status))}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">{formatDate(o.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
