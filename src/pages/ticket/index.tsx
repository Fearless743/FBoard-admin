import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useUrlState, listQuerySchema } from "@/hooks/use-url-state";
import {
  Search,
  Eye,
  X,
  Loader2,
  User,
  Activity,
  ClipboardList,
  MessageSquare,
  Send,
  Bot,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { cn, formatBytes, formatDate } from "@/lib/utils";
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
  DialogDescription,
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
import { adminPath } from "@/lib/paths";
import { UserEditDialog } from "@/pages/user/user-edit-dialog";

const levelKey: Record<number, string> = {
  0: "low",
  1: "medium",
  2: "high",
};

function levelBadgeClass(level: number) {
  if (level === 2) {
    return "border-destructive/30 bg-destructive/10 text-destructive";
  }
  if (level === 1) {
    return "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300";
  }
  return "border-muted-foreground/20 bg-muted text-muted-foreground";
}

export function TicketListPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  // status 默认 "0"（处理中），与原先 Tabs 一致；空 URL 表示处理中
  const [qs, setQs, query] = useUrlState(
    listQuerySchema({
      q: { type: "string", default: "", debounce: 400 },
      status: { type: "enum", values: ["0", "1"] as const, default: "0" },
    }),
  );
  const [viewing, setViewing] = useState<TicketItem | null>(null);
  const [detailData, setDetailData] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [closing, setClosing] = useState<TicketItem | null>(null);
  const [reply, setReply] = useState("");
  const [replying, setReplying] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [showTrafficRecords, setShowTrafficRecords] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarSearch, setSidebarSearch] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);
  const replyRef = useRef<HTMLTextAreaElement>(null);
  const lastScrollTicketId = useRef<number | null>(null);

  useEffect(() => {
    if (!detailData?.messages?.length || !messagesRef.current) return;
    const ticketId = viewing?.id ?? null;
    const smooth = lastScrollTicketId.current === ticketId;
    lastScrollTicketId.current = ticketId;
    messagesRef.current.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  }, [detailData, viewing?.id]);

  const { data, isLoading } = useQuery({
    queryKey: [
      "tickets",
      {
        page: query.page,
        pageSize: query.pageSize,
        q: query.q,
        status: query.status,
      },
    ],
    queryFn: () =>
      fetchTickets({
        current: query.page,
        pageSize: query.pageSize,
        filter: [
          ...(query.q ? [{ id: "subject", value: query.q }] : []),
          ...(query.status ? [{ id: "status", value: query.status }] : []),
        ],
      }),
  });

  const list: TicketItem[] = data?.data || [];
  const total = data?.total || 0;

  const sidebarList = sidebarSearch.trim()
    ? list.filter((tk) => {
        const q = sidebarSearch.trim().toLowerCase();
        return (
          tk.subject?.toLowerCase().includes(q) ||
          String(tk.id).includes(q) ||
          (tk.user_email || "").toLowerCase().includes(q) ||
          (detailData?.user?.email || "").toLowerCase().includes(q)
        );
      })
    : list;

  const openTicket = useCallback(async (tk: TicketItem) => {
    setViewing(tk);
    setReply("");
    setDetailLoading(true);
    setDetailData(null);
    // 手机端打开工单时收起列表，避免双栏挤占聊天区
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches
    ) {
      setSidebarOpen(false);
    }
    try {
      const d = await getTicketDetail(tk.id);
      setDetailData(d);
      // 同步列表项可能过期的字段
      setViewing((prev) =>
        prev?.id === tk.id
          ? {
              ...tk,
              status: d?.status ?? tk.status,
              reply_status: d?.reply_status ?? tk.reply_status,
              subject: d?.subject ?? tk.subject,
            }
          : prev,
      );
    } catch {
      setDetailData(null);
    } finally {
      setDetailLoading(false);
      // 下一帧聚焦输入框
      requestAnimationFrame(() => replyRef.current?.focus());
    }
  }, []);

  const closeChat = useCallback(() => {
    setViewing(null);
    setDetailData(null);
    setReply("");
    setSidebarSearch("");
    // 关闭后恢复默认展开，下次在桌面打开仍是双栏
    setSidebarOpen(true);
    lastScrollTicketId.current = null;
  }, []);

  const doReply = async () => {
    if (!viewing || !reply.trim() || replying) return;
    const message = reply.trim();
    setReplying(true);
    try {
      await replyTicket({ id: viewing.id, message });
      toast.success(t("ticket.actions.reply_success"));
      setReply("");
      if (replyRef.current) {
        replyRef.current.style.height = "auto";
      }
      const d = await getTicketDetail(viewing.id);
      setDetailData(d);
      setViewing((prev) =>
        prev
          ? {
              ...prev,
              reply_status: 1,
              status: d?.status ?? prev.status,
            }
          : prev,
      );
      qc.invalidateQueries({ queryKey: ["tickets"] });
      requestAnimationFrame(() => replyRef.current?.focus());
    } catch {
      /* toast by api layer */
    } finally {
      setReplying(false);
    }
  };

  const onReplyKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void doReply();
    }
  };

  const autoResizeReply = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  const currentEmail =
    detailData?.user?.email || viewing?.user_email || (viewing ? `#${viewing.id}` : "");
  const isClosed = viewing?.status === 1;

  return (
    <>
      <PageHeader
        title={t("ticket.title")}
        description={t("ticket.description")}
      />

      <Tabs
        value={qs.status}
        onValueChange={(v) => setQs({ status: v })}
        className="mb-4"
      >
        <TabsList>
          <TabsTrigger value="0">{t("ticket.status.processing")}</TabsTrigger>
          <TabsTrigger value="1">{t("ticket.status.closed")}</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("ticket.list.search_placeholder")}
            value={qs.q}
            onChange={(e) => setQs({ q: e.target.value })}
            className="pl-9"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14 sm:w-20">{t("ticket.columns.id")}</TableHead>
              <TableHead className="min-w-0">{t("ticket.columns.subject")}</TableHead>
              <TableHead className="hidden w-24 sm:table-cell">
                {t("ticket.columns.level")}
              </TableHead>
              <TableHead className="hidden w-24 sm:table-cell">
                {t("ticket.columns.status")}
              </TableHead>
              <TableHead className="hidden w-40 md:table-cell">
                {t("ticket.columns.updated_at")}
              </TableHead>
              <TableHead className="w-16 sm:w-20"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell
                      key={j}
                      className={cn(
                        (j === 2 || j === 3) && "hidden sm:table-cell",
                        j === 4 && "hidden md:table-cell",
                      )}
                    >
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : list.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6}>
                  <EmptyState
                    icon={<MessageSquare className="h-10 w-10" />}
                    message={t("common.table.noData")}
                  />
                </TableCell>
              </TableRow>
            ) : (
              list.map((tk) => {
                const statusBadge =
                  tk.status === 1 ? (
                    <Badge
                      variant="secondary"
                      className="h-5 shrink-0 whitespace-nowrap px-1.5 text-[11px] font-normal sm:px-2.5 sm:text-xs"
                    >
                      {t("ticket.status.closed")}
                    </Badge>
                  ) : (
                    <Badge
                      variant={
                        tk.reply_status === 1 ? "success" : "destructive"
                      }
                      className="h-5 shrink-0 whitespace-nowrap px-1.5 text-[11px] font-normal sm:px-2.5 sm:text-xs"
                    >
                      {tk.reply_status === 1
                        ? t("ticket.status.replied")
                        : t("ticket.status.unreplied")}
                    </Badge>
                  );
                const levelBadge = (
                  <Badge
                    variant="outline"
                    className={cn(
                      "h-5 shrink-0 whitespace-nowrap px-1.5 text-[11px] font-normal sm:px-2.5 sm:text-xs",
                      levelBadgeClass(tk.level),
                    )}
                  >
                    {t(`ticket.level.${levelKey[tk.level] ?? tk.level}`)}
                  </Badge>
                );

                return (
                  <TableRow
                    key={tk.id}
                    className={cn(
                      tk.status !== 1 &&
                        tk.reply_status !== 1 &&
                        "bg-destructive/[0.02]",
                    )}
                  >
                    <TableCell className="align-top sm:align-middle">
                      <IdBadge id={tk.id} compact />
                    </TableCell>
                    <TableCell className="min-w-0 font-medium">
                      <div className="space-y-1.5">
                        <span className="line-clamp-2 break-words sm:line-clamp-1 sm:truncate">
                          {tk.subject}
                        </span>
                        {/* 窄屏：状态/优先级并入主题行，避免独立列被挤换行 */}
                        <div className="flex flex-wrap items-center gap-1 sm:hidden">
                          {statusBadge}
                          {levelBadge}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {levelBadge}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {statusBadge}
                    </TableCell>
                    <TableCell className="hidden text-xs text-muted-foreground tabular-nums md:table-cell">
                      {formatDate(tk.updated_at)}
                    </TableCell>
                    <TableCell className="text-right align-top sm:align-middle">
                      <div className="flex justify-end gap-0.5 sm:gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => void openTicket(tk)}
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
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        <Pagination
          page={qs.page}
          pageSize={qs.pageSize}
          total={total}
          onPageChange={(p) => setQs({ page: p })}
          onPageSizeChange={(s) => setQs({ pageSize: s, page: 1 })}
        />
      </div>

      {/* 聊天对话框 */}
      <Dialog
        open={!!viewing}
        onOpenChange={(v) => {
          if (!v) closeChat();
        }}
      >
        <DialogContent className="flex h-[min(92dvh,900px)] w-[calc(100%-1rem)] max-w-5xl flex-col gap-0 overflow-hidden p-0 sm:w-[calc(100%-2rem)] sm:rounded-xl max-md:h-[100dvh] max-md:max-h-[100dvh] max-md:w-full max-md:max-w-none max-md:rounded-none">
          <div className="relative flex min-h-0 flex-1">
            {/* 手机端列表遮罩 */}
            {sidebarOpen ? (
              <button
                type="button"
                aria-label={t("ticket.list.collapse")}
                className="absolute inset-0 z-10 bg-black/40 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            ) : null}

            {/* 左侧：工单列表（桌面占位；手机叠层抽屉） */}
            <aside
              className={cn(
                "flex min-h-0 flex-col border-r bg-background transition-all duration-200",
                // 桌面：宽度伸缩
                "md:relative md:z-auto md:shrink-0 md:bg-muted/20 md:shadow-none",
                sidebarOpen
                  ? "md:w-[280px]"
                  : "md:w-0 md:overflow-hidden md:border-r-0",
                // 手机：绝对定位叠在聊天区上
                "absolute inset-y-0 left-0 z-20 w-[min(280px,85vw)] shadow-xl md:static",
                sidebarOpen
                  ? "translate-x-0"
                  : "pointer-events-none -translate-x-full md:pointer-events-auto md:translate-x-0",
              )}
            >
              <div className="shrink-0 space-y-2 border-b px-3 py-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    {t("ticket.list.title")}
                    <span className="ml-1 tabular-nums text-foreground/70">
                      ({total})
                    </span>
                  </span>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-label={t("ticket.list.collapse")}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={sidebarSearch}
                    onChange={(e) => setSidebarSearch(e.target.value)}
                    placeholder={t("ticket.list.search_placeholder")}
                    className="h-8 bg-background pl-8 text-xs md:bg-background"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {sidebarList.length === 0 ? (
                  <div className="px-3 py-8 text-center text-xs text-muted-foreground">
                    {t("ticket.list.no_tickets")}
                  </div>
                ) : (
                  sidebarList.map((tk) => {
                    const active = viewing?.id === tk.id;
                    const unreplied = tk.status !== 1 && tk.reply_status !== 1;
                    return (
                      <button
                        key={tk.id}
                        type="button"
                        className={cn(
                          "w-full border-b px-3 py-2.5 text-left transition-colors",
                          "hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none",
                          active && "bg-muted",
                          unreplied && !active && "bg-destructive/[0.03]",
                        )}
                        onClick={() => {
                          if (viewing?.id === tk.id) {
                            // 手机端点当前项也收起列表，回到聊天
                            if (
                              typeof window !== "undefined" &&
                              window.matchMedia("(max-width: 767px)").matches
                            ) {
                              setSidebarOpen(false);
                            }
                            return;
                          }
                          void openTicket(tk);
                        }}
                      >
                        <div className="mb-1 flex items-center gap-1.5">
                          <IdBadge id={tk.id} compact />
                          {tk.status === 1 ? (
                            <Badge
                              variant="secondary"
                              className="h-4 px-1 py-0 text-[10px] font-normal"
                            >
                              {t("ticket.status.closed")}
                            </Badge>
                          ) : (
                            <Badge
                              variant={
                                tk.reply_status === 1 ? "success" : "destructive"
                              }
                              className="h-4 px-1 py-0 text-[10px] font-normal"
                            >
                              {tk.reply_status === 1
                                ? t("ticket.status.replied")
                                : t("ticket.status.unreplied")}
                            </Badge>
                          )}
                          <Badge
                            variant="outline"
                            className={cn(
                              "ml-auto h-4 px-1 py-0 text-[10px] font-normal",
                              levelBadgeClass(tk.level),
                            )}
                          >
                            {t(`ticket.level.${levelKey[tk.level] ?? tk.level}`)}
                          </Badge>
                        </div>
                        <p
                          className={cn(
                            "truncate text-sm leading-snug",
                            unreplied ? "font-medium" : "text-foreground/90",
                          )}
                        >
                          {tk.subject}
                        </p>
                        <p className="mt-0.5 truncate text-[11px] text-muted-foreground tabular-nums">
                          {tk.user_email || formatDate(tk.updated_at)}
                        </p>
                      </button>
                    );
                  })
                )}
              </div>
            </aside>

            {/* 右侧：聊天区 */}
            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
              {/* 头部 */}
              <div className="shrink-0 border-b bg-background/80 px-3 py-2.5 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-5 sm:py-3">
                <div className="flex items-start gap-1.5 pr-8 sm:gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="mt-0.5 h-8 w-8 shrink-0"
                        onClick={() => setSidebarOpen((v) => !v)}
                      >
                        {sidebarOpen ? (
                          <PanelLeftClose className="h-4 w-4" />
                        ) : (
                          <PanelLeft className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {sidebarOpen
                        ? t("ticket.list.collapse")
                        : t("ticket.list.expand")}
                    </TooltipContent>
                  </Tooltip>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <DialogTitle className="line-clamp-2 text-sm leading-snug sm:line-clamp-1 sm:truncate sm:text-lg">
                        {viewing?.subject}
                      </DialogTitle>
                      {viewing && (
                        <>
                          <Badge
                            variant="outline"
                            className={cn(
                              "h-5 shrink-0 font-normal",
                              levelBadgeClass(viewing.level),
                            )}
                          >
                            {t(
                              `ticket.level.${levelKey[viewing.level] ?? viewing.level}`,
                            )}
                          </Badge>
                          {isClosed ? (
                            <Badge
                              variant="secondary"
                              className="h-5 shrink-0 font-normal"
                            >
                              {t("ticket.status.closed")}
                            </Badge>
                          ) : (
                            <Badge
                              variant={
                                viewing.reply_status === 1
                                  ? "success"
                                  : "destructive"
                              }
                              className="h-5 shrink-0 font-normal"
                            >
                              {viewing.reply_status === 1
                                ? t("ticket.status.replied")
                                : t("ticket.status.unreplied")}
                            </Badge>
                          )}
                        </>
                      )}
                    </div>
                    <DialogDescription className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                      <span className="inline-flex max-w-full items-center gap-1.5 font-mono">
                        <User className="h-3 w-3 shrink-0 text-muted-foreground" />
                        <span className="truncate">{currentEmail}</span>
                      </span>
                      {viewing && (
                        <>
                          <span className="text-muted-foreground/50">·</span>
                          <span className="tabular-nums text-muted-foreground">
                            #{viewing.id}
                          </span>
                          {detailData?.created_at || viewing.created_at ? (
                            <>
                              <span className="hidden text-muted-foreground/50 sm:inline">
                                ·
                              </span>
                              <span className="hidden tabular-nums text-muted-foreground sm:inline">
                                {t("ticket.detail.created_at")}{" "}
                                {formatDate(
                                  detailData?.created_at || viewing.created_at,
                                )}
                              </span>
                            </>
                          ) : null}
                        </>
                      )}
                    </DialogDescription>
                  </div>

                  <div className="flex shrink-0 items-center gap-0.5">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => setShowUserInfo(true)}
                        >
                          <User className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {t("ticket.detail.user_info")}
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="hidden h-8 w-8 sm:inline-flex"
                          onClick={() => setShowTrafficRecords(true)}
                        >
                          <Activity className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {t("ticket.detail.traffic_records")}
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="hidden h-8 w-8 sm:inline-flex"
                          onClick={() => setShowOrders(true)}
                        >
                          <ClipboardList className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {t("ticket.detail.order_records")}
                      </TooltipContent>
                    </Tooltip>
                    {!isClosed && viewing && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="ml-0.5 h-8 gap-1.5 border-destructive/30 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive sm:ml-1 sm:px-3"
                        onClick={() => setClosing(viewing)}
                      >
                        <X className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">
                          {t("ticket.actions.close_ticket")}
                        </span>
                      </Button>
                    )}
                  </div>
                </div>
                {/* 手机端次要操作：流量 / 订单 */}
                <div className="mt-2 flex items-center gap-1.5 pl-9 sm:hidden">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 px-2 text-xs"
                    onClick={() => setShowTrafficRecords(true)}
                  >
                    <Activity className="h-3.5 w-3.5" />
                    {t("ticket.detail.traffic_records")}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 px-2 text-xs"
                    onClick={() => setShowOrders(true)}
                  >
                    <ClipboardList className="h-3.5 w-3.5" />
                    {t("ticket.detail.order_records")}
                  </Button>
                </div>
              </div>

              {/* 消息区 */}
              <div
                ref={messagesRef}
                className="flex-1 space-y-3 overflow-y-auto bg-gradient-to-b from-muted/15 to-background px-4 py-4 sm:px-5"
              >
                {detailLoading ? (
                  <div className="space-y-4 py-2">
                    <div className="flex justify-start">
                      <Skeleton className="h-16 w-[70%] max-w-md rounded-2xl rounded-tl-sm" />
                    </div>
                    <div className="flex justify-end">
                      <Skeleton className="h-20 w-[55%] max-w-sm rounded-2xl rounded-tr-sm" />
                    </div>
                    <div className="flex justify-start">
                      <Skeleton className="h-12 w-[60%] max-w-md rounded-2xl rounded-tl-sm" />
                    </div>
                  </div>
                ) : detailData?.messages?.length > 0 ? (
                  detailData.messages.map((msg: any, idx: number) => {
                    const isAdmin = !!msg.is_from_admin;
                    const isBot = !!msg.is_from_bot;
                    const prev = detailData.messages[idx - 1];
                    const sameSide =
                      prev &&
                      !!prev.is_from_admin === isAdmin &&
                      !!prev.is_from_bot === isBot;
                    return (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex",
                          isAdmin ? "justify-end" : "justify-start",
                          sameSide ? "mt-1" : "mt-3 first:mt-0",
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[min(85%,36rem)] px-3.5 py-2.5 text-sm shadow-sm",
                            isBot
                              ? "rounded-2xl rounded-tl-sm border border-primary/25 bg-primary/5 text-foreground"
                              : isAdmin
                                ? "rounded-2xl rounded-tr-sm bg-primary text-primary-foreground"
                                : "rounded-2xl rounded-tl-sm border bg-card text-card-foreground",
                          )}
                        >
                          {(isBot || !isAdmin) && (
                            <div className="mb-1 flex items-center gap-1.5 text-[11px] font-medium opacity-80">
                              {isBot ? (
                                <>
                                  <Bot className="h-3 w-3" />
                                  <span>Bot</span>
                                </>
                              ) : (
                                <span>{t("ticket.detail.sender_user")}</span>
                              )}
                            </div>
                          )}
                          {isAdmin && !isBot && (
                            <div className="mb-1 text-right text-[11px] font-medium opacity-70">
                              {t("ticket.detail.sender_admin")}
                            </div>
                          )}
                          <p className="whitespace-pre-wrap break-words leading-relaxed">
                            {msg.message}
                          </p>
                          <p
                            className={cn(
                              "mt-1.5 text-[10px] tabular-nums opacity-60",
                              isAdmin ? "text-right" : "text-left",
                            )}
                          >
                            {formatDate(msg.created_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="max-w-sm text-sm text-muted-foreground">
                      {viewing?.content || t("ticket.detail.no_messages")}
                    </p>
                  </div>
                )}
              </div>

              {/* 输入区 */}
              <div className="shrink-0 border-t bg-background p-3 sm:p-4">
                {isClosed && (
                  <div className="mb-2.5 rounded-md border border-amber-500/25 bg-amber-500/10 px-3 py-1.5 text-center text-xs text-amber-800 dark:text-amber-200">
                    {t("ticket.detail.input.closed_hint")}
                  </div>
                )}
                <div className="flex items-end gap-2">
                  <Textarea
                    ref={replyRef}
                    rows={1}
                    className="min-h-[44px] max-h-40 flex-1 resize-none py-2.5 leading-relaxed"
                    placeholder={
                      isClosed
                        ? t("ticket.detail.input.closed_reply_placeholder")
                        : t("ticket.detail.input.reply_placeholder")
                    }
                    value={reply}
                    disabled={replying}
                    onChange={(e) => {
                      setReply(e.target.value);
                      autoResizeReply(e.target);
                    }}
                    onKeyDown={onReplyKeyDown}
                  />
                  <Button
                    type="button"
                    className="h-11 shrink-0 gap-1.5 px-4"
                    onClick={() => void doReply()}
                    disabled={replying || !reply.trim()}
                  >
                    {replying ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    <span className="hidden sm:inline">
                      {replying
                        ? t("ticket.detail.input.sending")
                        : t("ticket.detail.input.send")}
                    </span>
                  </Button>
                </div>
                <p className="mt-1.5 hidden text-[11px] text-muted-foreground sm:block">
                  {t("ticket.detail.input.shortcut_hint")}
                </p>
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
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
            <DialogTitle>{t("ticket.detail.traffic_records")}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
            <TrafficRecordsView userId={detailData?.user?.id || viewing?.user_id} />
          </div>
        </DialogContent>
      </Dialog>

      {/* 订单记录弹窗 */}
      <Dialog open={showOrders} onOpenChange={setShowOrders}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
            <DialogTitle>{t("ticket.detail.order_records")}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
            <OrderRecordsView userId={viewing?.user_id} />
          </div>
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
            // 若关闭的是当前聊天工单，同步状态而不是整窗关掉，便于继续查看历史
            if (viewing?.id === closing.id) {
              setViewing((prev) =>
                prev ? { ...prev, status: 1 } : prev,
              );
              setDetailData((prev: any) =>
                prev ? { ...prev, status: 1 } : prev,
              );
            }
          } catch {
            /* toast by api layer */
          }
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
  if (isLoading) return <Skeleton className="h-20 w-full rounded-lg" />;
  if (list.length === 0) return <EmptyState />;
  return (
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
  );
}

function OrderRecordsView({ userId }: { userId?: number }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["ticket-user-orders", userId],
    queryFn: () =>
      fetchOrders({
        current: 1,
        pageSize: 50,
        filter: [{ id: "user_id", value: `eq:${userId}` }],
      }),
    enabled: !!userId,
  });
  const list: OrderItem[] = data?.data || [];

  const typeKey: any = { 1: "NEW", 2: "RENEWAL", 3: "UPGRADE", 4: "RESET_FLOW" };
  const statusKey: any = {
    0: "PENDING",
    1: "PROCESSING",
    2: "CANCELLED",
    3: "COMPLETED",
    4: "DISCOUNTED",
  };

  const goOrder = (tradeNo: string) => {
    navigate(
      `${adminPath("order")}?trade_no=${encodeURIComponent(tradeNo)}`,
    );
  };

  if (isLoading) return <Skeleton className="h-20 w-full rounded-lg" />;
  if (list.length === 0) return <EmptyState />;
  return (
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
              <TableCell className="font-mono text-xs whitespace-nowrap">
                <button
                  type="button"
                  className="text-left text-primary underline-offset-2 hover:underline focus:outline-none focus:ring-1 focus:ring-ring rounded"
                  title={o.trade_no}
                  onClick={() => goOrder(o.trade_no)}
                >
                  {o.trade_no}
                </button>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {t(
                    `order.type.${typeKey[o.type as number] ?? o.type}`,
                    String(o.type),
                  )}
                </Badge>
              </TableCell>
              <TableCell>
                {o.plan?.name || (o.plan_id ? `#${o.plan_id}` : "—")}
              </TableCell>
              <TableCell className="text-xs">
                {t(`order.period.${o.period}`, o.period)}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    o.status === 2
                      ? "destructive"
                      : o.status === 3
                        ? "success"
                        : o.status === 0
                          ? "warning"
                          : "secondary"
                  }
                >
                  {t(
                    `order.status.${statusKey[o.status as number] ?? o.status}`,
                    String(o.status),
                  )}
                </Badge>
              </TableCell>
              <TableCell className="text-xs tabular-nums">
                {formatDate(o.created_at)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
