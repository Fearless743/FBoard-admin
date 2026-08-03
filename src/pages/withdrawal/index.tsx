import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUrlState, listQuerySchema } from "@/hooks/use-url-state";
import {
  Search,
  X,
  Loader2,
  User,
  Activity,
  ClipboardList,
  MessageSquare,
  Send,
  PanelLeftClose,
  PanelLeft,
  CheckCircle,
  XCircle,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  confirmWithdrawal,
  closeWithdrawal,
  fetchWithdrawals,
  fetchWithdrawalMessages,
  replyWithdrawal,
  type WithdrawalItem,
  type WithdrawalMessage,
} from "@/api/withdrawal";
import { getStatUser } from "@/api/stat";
import { fetchOrders, type OrderItem } from "@/api/order";
import { UserEditDialog } from "@/pages/user/user-edit-dialog";

const STATUS_MAP: Record<number, { label: string; className: string }> = {
  0: { label: "待处理", className: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300" },
  1: { label: "已确认", className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" },
  2: { label: "已拒绝", className: "border-destructive/30 bg-destructive/10 text-destructive" },
};

export function WithdrawalListPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [qs, setQs, query] = useUrlState(
    listQuerySchema({
      q: { type: "string", default: "", debounce: 400 },
      status: { type: "enum", values: ["0", "1", "2", "all"] as const, default: "0" },
    }),
  );
  const [viewing, setViewing] = useState<WithdrawalItem | null>(null);
  const [reply, setReply] = useState("");
  const [replying, setReplying] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [showTrafficRecords, setShowTrafficRecords] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarSearch, setSidebarSearch] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);
  const replyRef = useRef<HTMLTextAreaElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: [
      "withdrawals",
      {
        page: query.page,
        pageSize: query.pageSize,
        q: query.q,
        status: query.status,
      },
    ],
    queryFn: () =>
      fetchWithdrawals({
        current: query.page,
        pageSize: query.pageSize,
        filter: [
          ...(query.q ? [{ id: "withdraw_account", value: query.q }] : []),
          ...(query.status && query.status !== "all"
            ? [{ id: "status", value: Number(query.status) }]
            : []),
        ],
      }),
  });

  const list: WithdrawalItem[] = data?.data || [];
  const total = data?.total || 0;

  const sidebarList = sidebarSearch.trim()
    ? list.filter((w) => {
        const q = sidebarSearch.trim().toLowerCase();
        return (
          String(w.id).includes(q) ||
          (w.user_email || "").toLowerCase().includes(q) ||
          w.withdraw_account.toLowerCase().includes(q)
        );
      })
    : list;

  const { data: messagesData, isLoading: messagesLoading } = useQuery({
    queryKey: ["withdrawal-messages", viewing?.id],
    queryFn: () => viewing ? fetchWithdrawalMessages(viewing.id) : Promise.resolve({ data: [] }),
    enabled: !!viewing,
  });

  const messages: WithdrawalMessage[] = messagesData?.data || [];

  const openWithdrawal = useCallback(async (w: WithdrawalItem) => {
    setViewing(w);
    setReply("");
    qc.invalidateQueries({ queryKey: ["withdrawal-messages", w.id] });
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches
    ) {
      setSidebarOpen(false);
    }
    requestAnimationFrame(() => replyRef.current?.focus());
  }, [qc]);

  const closeChat = useCallback(() => {
    setViewing(null);
    setReply("");
    setSidebarSearch("");
    setSidebarOpen(true);
  }, []);

  const doReply = async () => {
    if (!viewing || !reply.trim() || replying) return;
    const message = reply.trim();
    setReplying(true);
    try {
      const result = await replyWithdrawal(viewing.id, message);
      toast.success(t("withdrawal.reply_success"));
      setReply("");
      if (replyRef.current) {
        replyRef.current.style.height = "auto";
      }
      qc.invalidateQueries({ queryKey: ["withdrawal-messages", viewing.id] });
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

  const isClosed = viewing?.status === 2;
  const statusLabel = viewing ? STATUS_MAP[viewing.status]?.label : "";
  const formatAmount = (cents: number) => (cents / 100).toFixed(2);

  useEffect(() => {
    if (!messages.length || !messagesRef.current) return;
    messagesRef.current.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, messagesLoading]);

  return (
    <>
      <PageHeader
        title={t("withdrawal.title")}
        description={t("withdrawal.description")}
      />

      <Tabs
        value={qs.status}
        onValueChange={(v) => setQs({ status: v })}
        className="mb-4"
      >
        <TabsList>
          <TabsTrigger value="0">{t("withdrawal.status.pending")}</TabsTrigger>
          <TabsTrigger value="1">{t("withdrawal.status.confirmed")}</TabsTrigger>
          <TabsTrigger value="2">{t("withdrawal.status.closed")}</TabsTrigger>
          <TabsTrigger value="all">{t("withdrawal.filter.all")}</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("withdrawal.list.search_placeholder")}
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
              <TableHead className="w-20">{t("withdrawal.columns.id")}</TableHead>
              <TableHead className="min-w-0">{t("withdrawal.columns.user")}</TableHead>
              <TableHead className="hidden sm:table-cell">
                {t("withdrawal.columns.method")}</TableHead>
              <TableHead className="hidden md:table-cell">
                {t("withdrawal.columns.account")}</TableHead>
              <TableHead className="w-24 text-right">
                {t("withdrawal.columns.amount")}</TableHead>
              <TableHead className="w-24">{t("withdrawal.columns.status")}</TableHead>
              <TableHead className="hidden lg:table-cell w-32">
                {t("withdrawal.columns.created_at")}</TableHead>
              <TableHead className="w-16 sm:w-20"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell
                      key={j}
                      className={cn(
                        (j >= 2 && j <= 4) && "hidden sm:table-cell",
                        j === 4 && "hidden md:table-cell",
                        j === 6 && "hidden lg:table-cell",
                      )}
                    >
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : list.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={8}>
                  <EmptyState
                    icon={<MessageSquare className="h-10 w-10" />}
                    message={t("common.table.noData")}
                  />
                </TableCell>
              </TableRow>
            ) : (
              list.map((item) => {
                const statusStyle = STATUS_MAP[item.status] ?? STATUS_MAP[0];
                return (
                  <TableRow
                    key={item.id}
                    className={cn(
                      item.status === 0 && "bg-destructive/[0.02]",
                    )}
                  >
                    <TableCell className="align-top sm:align-middle">
                      <IdBadge id={item.id} compact />
                    </TableCell>
                    <TableCell className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span className="truncate text-sm">
                          {item.user?.email || item.user_email}
                        </span>
                      </div>
                      <div className="mt-0.5 truncate text-[11px] text-muted-foreground">
                        #{item.user_id}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">
                      {item.withdraw_method}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="max-w-[16rem] truncate text-xs text-muted-foreground">
                        {item.withdraw_account}
                      </div>
                    </TableCell>
                    <TableCell className="text-right align-top sm:align-middle font-mono tabular-nums">
                      ¥{formatAmount(item.amount)}
                    </TableCell>
                    <TableCell className="align-top sm:align-middle">
                      <Badge
                        variant="outline"
                        className={cn(
                          "h-5 whitespace-nowrap px-1.5 text-[11px] font-normal",
                          statusStyle.className,
                        )}
                      >
                        {statusStyle.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground tabular-nums align-top sm:align-middle">
                      {formatDate(item.created_at)}
                    </TableCell>
                    <TableCell className="text-right align-top sm:align-middle">
                      <div className="flex justify-end gap-0.5 sm:gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => void openWithdrawal(item)}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
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
                aria-label={t("withdrawal.list.collapse")}
                className="absolute inset-0 z-10 bg-black/40 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            ) : null}

            {/* 左侧：提现列表 */}
            <aside
              className={cn(
                "flex min-h-0 flex-col border-r bg-background transition-all duration-200",
                "md:relative md:z-auto md:shrink-0 md:bg-muted/20 md:shadow-none",
                sidebarOpen
                  ? "md:w-[280px]"
                  : "md:w-0 md:overflow-hidden md:border-r-0",
                "absolute inset-y-0 left-0 z-20 w-[min(280px,85vw)] shadow-xl md:static",
                sidebarOpen
                  ? "translate-x-0"
                  : "pointer-events-none -translate-x-full md:pointer-events-auto md:translate-x-0",
              )}
            >
              <div className="shrink-0 space-y-2 border-b px-3 py-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    {t("withdrawal.list.title")}
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
                    aria-label={t("withdrawal.list.collapse")}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={sidebarSearch}
                    onChange={(e) => setSidebarSearch(e.target.value)}
                    placeholder={t("withdrawal.list.search_placeholder")}
                    className="h-8 bg-background pl-8 text-xs md:bg-background"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {sidebarList.length === 0 ? (
                  <div className="px-3 py-8 text-center text-xs text-muted-foreground">
                    {t("withdrawal.list.no_withdrawals")}
                  </div>
                ) : (
                  sidebarList.map((w) => {
                    const active = viewing?.id === w.id;
                    const isPending = w.status === 0;
                    const statusStyle = STATUS_MAP[w.status] ?? STATUS_MAP[0];
                    return (
                      <button
                        key={w.id}
                        type="button"
                        className={cn(
                          "w-full border-b px-3 py-2.5 text-left transition-colors",
                          "hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none",
                          active && "bg-muted",
                          isPending && !active && "bg-destructive/[0.03]",
                        )}
                        onClick={() => {
                          if (viewing?.id === w.id) {
                            if (
                              typeof window !== "undefined" &&
                              window.matchMedia("(max-width: 767px)").matches
                            ) {
                              setSidebarOpen(false);
                            }
                            return;
                          }
                          void openWithdrawal(w);
                        }}
                      >
                        <div className="mb-1 flex items-center gap-1.5">
                          <IdBadge id={w.id} compact />
                          <Badge
                            variant="outline"
                            className={cn(
                              "h-4 px-1 py-0 text-[10px] font-normal",
                              statusStyle.className,
                            )}
                          >
                            {statusStyle.label}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="ml-auto h-4 px-1 py-0 text-[10px] font-normal"
                          >
                            ¥{(w.amount / 100).toFixed(2)}
                          </Badge>
                        </div>
                        <p className="truncate text-sm font-medium">
                          {w.user?.email || w.user_email}
                        </p>
                        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                          {w.withdraw_method} · {formatDate(w.created_at)}
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
                        ? t("withdrawal.list.collapse")
                        : t("withdrawal.list.expand")}
                    </TooltipContent>
                  </Tooltip>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <DialogTitle className="line-clamp-2 text-sm leading-snug sm:line-clamp-1 sm:truncate sm:text-lg">
                        {t("withdrawal.title")} #{viewing?.id}
                      </DialogTitle>
                      {viewing && (
                        <Badge
                          variant="outline"
                          className={cn(
                            "h-5 shrink-0 font-normal",
                            STATUS_MAP[viewing.status]?.className,
                          )}
                        >
                          {STATUS_MAP[viewing.status]?.label}
                        </Badge>
                      )}
                    </div>
                    <DialogDescription className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                      <span className="inline-flex max-w-full items-center gap-1.5 font-mono">
                        <User className="h-3 w-3 shrink-0 text-muted-foreground" />
                        <span className="truncate">
                          {viewing?.user?.email || viewing?.user_email}
                        </span>
                      </span>
                      {viewing && (
                        <>
                          <span className="text-muted-foreground/50">·</span>
                          <span className="tabular-nums text-muted-foreground">
                            #{viewing.user_id}
                          </span>
                          {viewing.created_at ? (
                            <>
                              <span className="hidden text-muted-foreground/50 sm:inline">
                                ·
                              </span>
                              <span className="hidden tabular-nums text-muted-foreground sm:inline">
                                {t("withdrawal.detail.created_at")}{" "}
                                {formatDate(viewing.created_at)}
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
                        {t("withdrawal.detail.user_info")}
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
                        {t("withdrawal.detail.traffic_records")}
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
                        {t("withdrawal.detail.order_records")}
                      </TooltipContent>
                    </Tooltip>
                    {viewing?.status === 0 && (
                      <>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                              onClick={async () => {
                                if (!viewing) return;
                                try {
                                  await confirmWithdrawal(viewing.id);
                                  toast.success(t("withdrawal.actions.confirm_success"));
                                  qc.invalidateQueries({ queryKey: ["withdrawals"] });
                                  setViewing((prev) =>
                                    prev ? { ...prev, status: 1 } : prev,
                                  );
                                } catch {
                                  /* toast by api layer */
                                }
                              }}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {t("withdrawal.actions.confirm")}
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={async () => {
                                if (!viewing) return;
                                try {
                                  await closeWithdrawal(viewing.id);
                                  toast.success(t("withdrawal.actions.close_success"));
                                  qc.invalidateQueries({ queryKey: ["withdrawals"] });
                                  setViewing((prev) =>
                                    prev ? { ...prev, status: 2 } : prev,
                                  );
                                } catch {
                                  /* toast by api layer */
                                }
                              }}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {t("withdrawal.actions.close")}
                          </TooltipContent>
                        </Tooltip>
                      </>
                    )}
                  </div>
                </div>
                {/* 手机端次要操作 */}
                <div className="mt-2 flex items-center gap-1.5 pl-9 sm:hidden">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 px-2 text-xs"
                    onClick={() => setShowTrafficRecords(true)}
                  >
                    <Activity className="h-3.5 w-3.5" />
                    {t("withdrawal.detail.traffic_records")}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 px-2 text-xs"
                    onClick={() => setShowOrders(true)}
                  >
                    <ClipboardList className="h-3.5 w-3.5" />
                    {t("withdrawal.detail.order_records")}
                  </Button>
                  {viewing?.status === 0 && (
                    <>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-7 gap-1 px-2 text-xs border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
                        onClick={async () => {
                          if (!viewing) return;
                          try {
                            await confirmWithdrawal(viewing.id);
                            toast.success(t("withdrawal.actions.confirm_success"));
                            qc.invalidateQueries({ queryKey: ["withdrawals"] });
                            setViewing((prev) =>
                              prev ? { ...prev, status: 1 } : prev,
                            );
                          } catch { /* toast by api layer */ }
                        }}
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        {t("withdrawal.actions.confirm")}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-7 gap-1 px-2 text-xs border-destructive/30 text-destructive hover:bg-destructive/10"
                        onClick={async () => {
                          if (!viewing) return;
                          try {
                            await closeWithdrawal(viewing.id);
                            toast.success(t("withdrawal.actions.close_success"));
                            qc.invalidateQueries({ queryKey: ["withdrawals"] });
                            setViewing((prev) =>
                              prev ? { ...prev, status: 2 } : prev,
                            );
                          } catch { /* toast by api layer */ }
                        }}
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        {t("withdrawal.actions.close")}
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* 消息区 */}
              <div
                ref={messagesRef}
                className="flex-1 space-y-3 overflow-y-auto bg-gradient-to-b from-muted/15 to-background px-4 py-4 sm:px-5"
              >
                {messagesLoading ? (
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
                ) : messages.length > 0 ? (
                  messages.map((msg: WithdrawalMessage, idx: number) => {
                    const isAdmin = msg.is_admin;
                    const prev = messages[idx - 1];
                    const sameSide =
                      prev &&
                      prev.is_admin === isAdmin;
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
                            isAdmin
                              ? "rounded-2xl rounded-tr-sm bg-primary text-primary-foreground"
                              : "rounded-2xl rounded-tl-sm border bg-card text-card-foreground",
                          )}
                        >
                          {!isAdmin && (
                            <div className="mb-1 flex items-center gap-1.5 text-[11px] font-medium opacity-80">
                              <span>{t("withdrawal.detail.sender_user")}</span>
                            </div>
                          )}
                          {isAdmin && (
                            <div className="mb-1 text-right text-[11px] font-medium opacity-70">
                              {t("withdrawal.detail.sender_admin")}
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
                      {t("withdrawal.detail.no_messages")}
                    </p>
                  </div>
                )}
              </div>

              {/* 输入区 */}
              <div className="shrink-0 border-t bg-background p-3 sm:p-4">
                {isClosed && (
                  <div className="mb-2.5 rounded-md border border-amber-500/25 bg-amber-500/10 px-3 py-1.5 text-center text-xs text-amber-800 dark:text-amber-200">
                    {t("withdrawal.detail.input.closed_hint")}
                  </div>
                )}
                <div className="flex items-end gap-2">
                  <Textarea
                    ref={replyRef}
                    rows={1}
                    className="min-h-[44px] max-h-40 flex-1 resize-none py-2.5 leading-relaxed"
                    placeholder={
                      isClosed
                        ? t("withdrawal.detail.input.closed_reply_placeholder")
                        : t("withdrawal.detail.input.reply_placeholder")
                    }
                    value={reply}
                    disabled={replying || isClosed}
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
                    disabled={replying || !reply.trim() || isClosed}
                  >
                    {replying ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    <span className="hidden sm:inline">
                      {replying
                        ? t("withdrawal.detail.input.sending")
                        : t("withdrawal.detail.input.send")}
                    </span>
                  </Button>
                </div>
                <p className="mt-1.5 hidden text-[11px] text-muted-foreground sm:block">
                  {t("withdrawal.detail.input.shortcut_hint")}
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
        user={
          viewing?.user
            ? {
                ...viewing.user,
                balance: (viewing.user.balance ?? 0) * 100,
                commission_balance: (viewing.user.commission_balance ?? 0) * 100,
                uuid: "",
                transfer_enable: 0,
                u: 0,
                d: 0,
                banned: false,
                is_admin: false,
                is_staff: false,
                plan_id: null,
                expired_at: null,
                created_at: viewing.created_at,
              }
            : null
        }
        onSaved={() => {}}
      />

      {/* 流量记录弹窗 */}
      <Dialog open={showTrafficRecords} onOpenChange={setShowTrafficRecords}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
            <DialogTitle>{t("withdrawal.detail.traffic_records")}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
            <TrafficRecordsView userId={viewing?.user?.id} />
          </div>
        </DialogContent>
      </Dialog>

      {/* 订单记录弹窗 */}
      <Dialog open={showOrders} onOpenChange={setShowOrders}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
            <DialogTitle>{t("withdrawal.detail.order_records")}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
            <OrderRecordsView userId={viewing?.user?.id} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function TrafficRecordsView({ userId }: { userId?: number }) {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery({
    queryKey: ["withdrawal-user-traffic", userId],
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
  const { data, isLoading } = useQuery({
    queryKey: ["withdrawal-user-orders", userId],
    queryFn: () =>
      fetchOrders({
        current: 1,
        pageSize: 50,
        filter: [{ id: "user_id", value: `eq:${userId}` }],
      }),
    enabled: !!userId,
  });
  const list: OrderItem[] = data?.data || [];
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
            <TableHead>{t("order.table.columns.status")}</TableHead>
            <TableHead>{t("order.table.columns.createdAt")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.map((o) => (
            <TableRow key={o.id}>
              <TableCell className="font-mono text-xs">{o.trade_no}</TableCell>
              <TableCell>
                <Badge variant="outline">
                  {t(`order.type.${o.type}`, String(o.type))}
                </Badge>
              </TableCell>
              <TableCell>{o.plan?.name || `#${o.plan_id}`}</TableCell>
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
                  {t(`order.status.${o.status}`, String(o.status))}
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
