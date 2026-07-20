import { useState, useMemo, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Bell,
  Activity,
  Upload,
  Download,
  ArrowDownToLine,
  BarChart3,
  MessagesSquare,
  Gauge,
  Timer,
  Layers,
  AlertTriangle,
  Cpu,
  Zap,
} from "lucide-react";
import { SimpleAreaChart } from "@/components/charts/area-chart";
import { useNavigate } from "react-router-dom";
import {
  getStats,
  getTrafficRank,
  getOrder,
  getQueueStats,
  getQueueWorkload,
  type OrderStatItem,
  type QueueWorkloadItem,
} from "@/api/stat";
import { StatCard } from "@/components/common/stat-card";
import { PageHeader } from "@/components/common/page-header";
import { FailedJobsDialog } from "@/components/common/failed-jobs-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, formatBytes } from "@/lib/utils";
import { adminPath } from "@/lib/paths";

function todayTimestamps() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(+start + 86400000);
  return { start: Math.floor(+start / 1000), end: Math.floor(+end / 1000) };
}

function rangeTimestamps(daysAgo: number) {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const start = new Date(+end - daysAgo * 86400000);
  return { start: Math.floor(+start / 1000), end: Math.floor(+end / 1000) };
}

function formatDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function rangeDates(daysAgo: number) {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const start = new Date(+end - daysAgo * 86400000);
  return { start_date: formatDateStr(start), end_date: formatDateStr(end) };
}

/** 秒 → 可读等待时间 */
function formatWait(seconds: number): string {
  const s = Math.max(0, Math.round(Number(seconds) || 0));
  if (s < 60) return `${s}s`;
  if (s < 3600) {
    const m = Math.floor(s / 60);
    const r = s % 60;
    return r ? `${m}m ${r}s` : `${m}m`;
  }
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return m ? `${h}h ${m}m` : `${h}h`;
}

const RANGE_MAP: Record<string, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
  "1y": 365,
};

export function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [overviewRange, setOverviewRange] = useState("30d");
  const [overviewTab, setOverviewTab] = useState("amount");
  const [trafficRange, setTrafficRange] = useState("today");
  const [userTrafficRange, setUserTrafficRange] = useState("today");
  const [failedJobsOpen, setFailedJobsOpen] = useState(false);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: getStats,
    refetchInterval: 60_000,
  });

  const orderDates = useMemo(() => rangeDates(RANGE_MAP[overviewRange] || 30), [overviewRange]);
  const { data: orderData, isLoading: orderLoading } = useQuery({
    queryKey: ["dashboard", "order", orderDates],
    queryFn: () => getOrder(orderDates.start_date, orderDates.end_date),
    refetchInterval: 60_000,
  });

  const trafficTs = useMemo(
    () => (trafficRange === "today" ? todayTimestamps() : rangeTimestamps(7)),
    [trafficRange],
  );
  const userTrafficTs = useMemo(
    () => (userTrafficRange === "today" ? todayTimestamps() : rangeTimestamps(7)),
    [userTrafficRange],
  );

  const { data: nodeRank } = useQuery({
    queryKey: ["dashboard", "traffic-rank", trafficTs],
    queryFn: () => getTrafficRank("node", trafficTs.start, trafficTs.end),
  });

  const { data: userRank } = useQuery({
    queryKey: ["dashboard", "user-traffic-rank", userTrafficTs],
    queryFn: () => getTrafficRank("user", userTrafficTs.start, userTrafficTs.end),
  });

  const { data: queueStats, isLoading: queueStatsLoading } = useQuery({
    queryKey: ["dashboard", "queue-stats"],
    queryFn: getQueueStats,
    refetchInterval: 30_000,
  });

  const { data: queueWorkload, isLoading: workloadLoading } = useQuery({
    queryKey: ["dashboard", "queue-workload"],
    queryFn: getQueueWorkload,
    refetchInterval: 15_000,
  });

  const isLoading = statsLoading || orderLoading;

  const orderList: OrderStatItem[] = orderData?.list || [];

  const chartData = useMemo(() => {
    if (overviewTab === "amount") {
      return orderList.map((d) => ({
        date: d.date.slice(5),
        value: d.paid_total / 100,
        label: "amount",
      }));
    }
    return orderList.map((d) => ({
      date: d.date.slice(5),
      value: d.paid_count,
      label: "count",
    }));
  }, [orderList, overviewTab]);

  const totalValue = useMemo(
    () => chartData.reduce((s, d) => s + d.value, 0),
    [chartData],
  );

  const topNodeRank = Array.isArray(nodeRank) ? nodeRank.slice(0, 10) : [];
  const topUserRank = Array.isArray(userRank) ? userRank.slice(0, 10) : [];

  const maxNodeValue = Math.max(...topNodeRank.map((n) => Number(n.value)), 1);
  const maxUserValue = Math.max(...topUserRank.map((u) => Number(u.value)), 1);

  const workloads: QueueWorkloadItem[] = useMemo(() => {
    if (!queueWorkload) return [];
    return Array.isArray(queueWorkload) ? queueWorkload : [];
  }, [queueWorkload]);

  const maxQueueLength = Math.max(...workloads.map((w) => Number(w.length) || 0), 1);
  const totalPending = workloads.reduce((s, w) => s + (Number(w.length) || 0), 0);
  const totalQueueProcesses = workloads.reduce((s, w) => s + (Number(w.processes) || 0), 0);
  const maxWait = Math.max(...workloads.map((w) => Number(w.wait) || 0), 0);

  const waitEntries = useMemo(() => {
    const wait = queueStats?.wait;
    if (!wait || typeof wait !== "object") return [] as Array<{ name: string; seconds: number }>;
    return Object.entries(wait).map(([name, seconds]) => ({
      name,
      seconds: Number(seconds) || 0,
    }));
  }, [queueStats?.wait]);

  const horizonOk = !!queueStats?.status;
  const failedCount = Number(queueStats?.failedJobs || 0);

  return (
    <>
      <PageHeader title={t("dashboard.title")} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-[130px] rounded-xl" />
          ))
        ) : (
          <>
            <StatCard
              title={t("dashboard.stats.todayIncome")}
              value={`¥${(Number(stats?.todayIncome || 0) / 100).toFixed(2)}`}
              delta={stats?.dayIncomeGrowth}
              deltaLabel={t("dashboard.stats.vsYesterday")}
              icon={<ArrowDownToLine className="h-4 w-4" />}
            />
            <StatCard
              title={t("dashboard.stats.monthlyIncome")}
              value={`¥${(Number(stats?.currentMonthIncome || 0) / 100).toFixed(2)}`}
              delta={stats?.monthIncomeGrowth}
              deltaLabel={t("dashboard.stats.vsLastMonth")}
              icon={<BarChart3 className="h-4 w-4" />}
            />
            <StatCard
              title={t("dashboard.stats.pendingTickets")}
              value={Number(stats?.ticketPendingTotal || 0).toLocaleString()}
              footer={t("dashboard.stats.hasPendingTickets")}
              icon={<MessagesSquare className="h-4 w-4" />}
              onClick={() => navigate(adminPath("ticket"))}
              highlight={Number(stats?.ticketPendingTotal || 0) > 0}
            />
            <StatCard
              title={t("dashboard.stats.pendingCommission")}
              value={Number(stats?.commissionPendingTotal || 0).toLocaleString()}
              footer={t("dashboard.stats.hasPendingCommission")}
              icon={<Bell className="h-4 w-4" />}
              onClick={() =>
                navigate(`${adminPath("order")}?commission_status=0`)
              }
              highlight={Number(stats?.commissionPendingTotal || 0) > 0}
            />
            <StatCard
              title={t("dashboard.stats.monthlyNewUsers")}
              value={Number(stats?.currentMonthNewUsers || 0).toLocaleString()}
              delta={stats?.userGrowth}
              deltaLabel={t("dashboard.stats.vsLastMonth")}
              icon={<Users className="h-4 w-4" />}
            />
            <StatCard
              title={t("dashboard.stats.totalUsers")}
              value={Number(stats?.totalUsers || 0).toLocaleString()}
              footer={
                <span>
                  {t("dashboard.stats.activeUsers", { count: stats?.activeUsers ?? 0 })}
                </span>
              }
              icon={<Users className="h-4 w-4" />}
            />
            <StatCard
              title={t("dashboard.stats.monthlyUpload")}
              value={formatBytes(Number(stats?.monthTraffic?.upload || 0))}
              footer={
                <span>
                  {t("dashboard.stats.todayTraffic", {
                    value: formatBytes(Number(stats?.todayTraffic?.upload || 0)),
                  })}
                </span>
              }
              icon={<Upload className="h-4 w-4" />}
            />
            <StatCard
              title={t("dashboard.stats.monthlyDownload")}
              value={formatBytes(Number(stats?.monthTraffic?.download || 0))}
              footer={
                <span>
                  {t("dashboard.stats.todayTraffic", {
                    value: formatBytes(Number(stats?.todayTraffic?.download || 0)),
                  })}
                </span>
              }
              icon={<Download className="h-4 w-4" />}
            />
          </>
        )}
      </div>

      {/* 收入概览 */}
      <div className="mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{t("dashboard.overview.title")}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {orderDates.start_date} {t("dashboard.overview.to")} {orderDates.end_date}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={overviewRange} onValueChange={setOverviewRange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">{t("dashboard.overview.last7Days")}</SelectItem>
                  <SelectItem value="30d">{t("dashboard.overview.last30Days")}</SelectItem>
                  <SelectItem value="90d">{t("dashboard.overview.last90Days")}</SelectItem>
                  <SelectItem value="1y">{t("dashboard.overview.lastYear")}</SelectItem>
                </SelectContent>
              </Select>
              <Tabs value={overviewTab} onValueChange={setOverviewTab}>
                <TabsList>
                  <TabsTrigger value="amount">{t("dashboard.overview.amount")}</TabsTrigger>
                  <TabsTrigger value="count">{t("dashboard.overview.count")}</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {orderLoading ? (
              <Skeleton className="h-[300px] rounded-lg" />
            ) : chartData.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">
                {t("common.table.noData")}
              </p>
            ) : (
              <>
                <div className="mb-2 text-2xl font-bold">
                  {overviewTab === "amount" ? `¥${totalValue.toFixed(2)}` : totalValue.toLocaleString()}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    {overviewTab === "amount"
                      ? t("dashboard.overview.transactions", { count: orderData?.summary.paid_count || 0 })
                      : t("dashboard.overview.totalTransactions", { count: totalValue })}
                  </span>
                </div>
                <SimpleAreaChart
                  data={chartData}
                  formatter={(val) =>
                    overviewTab === "amount"
                      ? [`¥${val.toFixed(2)}`, t("dashboard.overview.amount")]
                      : [val.toLocaleString(), t("dashboard.overview.count")]
                  }
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 节点流量排行 + 用户流量排行 */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t("dashboard.trafficRank.nodeTrafficRank")}</CardTitle>
            <Select value={trafficRange} onValueChange={setTrafficRange}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">{t("dashboard.trafficRank.today")}</SelectItem>
                <SelectItem value="7d">{t("dashboard.trafficRank.last7days")}</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {statsLoading && topNodeRank.length === 0 ? (
              <Skeleton className="h-[200px] rounded-lg" />
            ) : topNodeRank.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                {t("dashboard.queue.empty")}
              </p>
            ) : (
              <div className="space-y-1">
                {topNodeRank.map((node) => (
                  <div
                    key={node.id}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted/50"
                  >
                    <span className="w-5 shrink-0 text-xs text-muted-foreground">
                      #{node.id}
                    </span>
                    <span className="min-w-0 flex-1 truncate font-medium">{node.name}</span>
                    <div className="h-2 w-20 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${(Number(node.value) / maxNodeValue) * 100}%` }}
                      />
                    </div>
                    <span className="ml-1 shrink-0 tabular-nums text-muted-foreground">
                      {formatBytes(Number(node.value))}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t("dashboard.trafficRank.userTrafficRank")}</CardTitle>
            <Select value={userTrafficRange} onValueChange={setUserTrafficRange}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">{t("dashboard.trafficRank.today")}</SelectItem>
                <SelectItem value="7d">{t("dashboard.trafficRank.last7days")}</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {statsLoading && topUserRank.length === 0 ? (
              <Skeleton className="h-[200px] rounded-lg" />
            ) : topUserRank.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                {t("dashboard.queue.empty")}
              </p>
            ) : (
              <div className="space-y-1">
                {topUserRank.map((u) => (
                  <div
                    key={u.id}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted/50"
                  >
                    <span className="min-w-0 flex-1 truncate">{u.name}</span>
                    <div className="h-2 w-20 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${(Number(u.value) / maxUserValue) * 100}%` }}
                      />
                    </div>
                    <span className="ml-1 shrink-0 tabular-nums text-muted-foreground">
                      {formatBytes(Number(u.value))}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 队列状态 + 负载（合并重设计） */}
      <div className="mt-6">
        <Card>
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <Gauge className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base">{t("dashboard.queue.title")}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {t("dashboard.queue.status.description")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {failedCount > 0 && (
                <Badge
                  variant="destructive"
                  className="cursor-pointer gap-1"
                  onClick={() => setFailedJobsOpen(true)}
                >
                  <AlertTriangle className="h-3 w-3" />
                  {t("dashboard.queue.details.viewFailedJobs")}
                </Badge>
              )}
              <Badge
                variant={horizonOk ? "success" : "destructive"}
                className="gap-1.5 pl-1.5"
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    horizonOk ? "bg-emerald-500" : "bg-destructive",
                  )}
                />
                <Activity className="h-3 w-3" />
                {horizonOk
                  ? t("dashboard.queue.status.normal")
                  : t("dashboard.queue.status.abnormal")}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* 关键指标 */}
            {queueStatsLoading ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-[88px] rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <QueueMetric
                  icon={<Layers className="h-3.5 w-3.5" />}
                  label={t("dashboard.queue.details.recentJobs")}
                  value={queueStats?.recentJobs?.toLocaleString() ?? "—"}
                  hint={
                    queueStats?.periods?.recentJobs
                      ? t("dashboard.queue.details.statisticsPeriod", {
                          hours: queueStats.periods.recentJobs,
                        })
                      : undefined
                  }
                />
                <QueueMetric
                  icon={<Zap className="h-3.5 w-3.5" />}
                  label={t("dashboard.queue.details.jobsPerMinute")}
                  value={queueStats?.jobsPerMinute?.toLocaleString() ?? "—"}
                  hint={
                    queueStats?.queueWithMaxThroughput
                      ? t("dashboard.queue.details.maxThroughput", {
                          value: queueStats.queueWithMaxThroughput,
                        })
                      : undefined
                  }
                />
                <QueueMetric
                  icon={<Cpu className="h-3.5 w-3.5" />}
                  label={t("dashboard.queue.details.activeProcesses")}
                  value={(queueStats?.processes ?? totalQueueProcesses)?.toLocaleString() ?? "—"}
                  hint={
                    queueStats?.queueWithMaxRuntime
                      ? t("dashboard.queue.details.longestRunningQueue") +
                        `: ${queueStats.queueWithMaxRuntime}`
                      : undefined
                  }
                />
                <QueueMetric
                  icon={<AlertTriangle className="h-3.5 w-3.5" />}
                  label={t("dashboard.queue.details.failedJobs7Days")}
                  value={failedCount.toLocaleString()}
                  tone={failedCount > 0 ? "danger" : "default"}
                  onClick={failedCount > 0 ? () => setFailedJobsOpen(true) : undefined}
                  hint={
                    queueStats?.periods?.failedJobs
                      ? t("dashboard.queue.details.retentionPeriod", {
                          hours: queueStats.periods.failedJobs,
                        })
                      : undefined
                  }
                />
              </div>
            )}

            {/* 等待摘要 */}
            {(waitEntries.length > 0 || maxWait > 0 || totalPending > 0) && (
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 rounded-md border bg-muted/30 px-2 py-1">
                  <Layers className="h-3 w-3" />
                  {t("dashboard.queue.metrics.pending", {
                    count: totalPending,
                  })}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md border bg-muted/30 px-2 py-1">
                  <Timer className="h-3 w-3" />
                  {t("dashboard.queue.metrics.maxWait", {
                    time: formatWait(
                      Math.max(maxWait, ...waitEntries.map((w) => w.seconds), 0),
                    ),
                  })}
                </span>
                {waitEntries.map((w) => (
                  <span
                    key={w.name}
                    className="inline-flex items-center gap-1 rounded-md border bg-muted/30 px-2 py-1 font-mono"
                  >
                    {w.name.split(":").pop()}: {formatWait(w.seconds)}
                  </span>
                ))}
              </div>
            )}

            {/* 各队列负载 */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-medium">{t("dashboard.queue.workload")}</h3>
                <span className="text-xs text-muted-foreground">
                  {workloads.length
                    ? t("dashboard.queue.workloadCount", { count: workloads.length })
                    : null}
                </span>
              </div>

              {workloadLoading && workloads.length === 0 ? (
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 rounded-lg" />
                  ))}
                </div>
              ) : workloads.length === 0 ? (
                <div className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
                  {t("dashboard.queue.empty")}
                </div>
              ) : (
                <div className="space-y-2">
                  {workloads.map((q) => {
                    const length = Number(q.length) || 0;
                    const processes = Number(q.processes) || 0;
                    const wait = Number(q.wait) || 0;
                    const ratio = Math.min(100, (length / maxQueueLength) * 100);
                    const busy = length > 0;
                    const overloaded = processes > 0 && length / processes > 20;
                    return (
                      <div
                        key={q.name}
                        className={cn(
                          "rounded-xl border bg-card/50 px-3.5 py-3 transition-colors",
                          overloaded && "border-amber-500/40 bg-amber-500/5",
                        )}
                      >
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "h-1.5 w-1.5 shrink-0 rounded-full",
                                  overloaded
                                    ? "bg-amber-500"
                                    : busy
                                      ? "bg-primary"
                                      : "bg-muted-foreground/40",
                                )}
                              />
                              <span className="truncate text-sm font-medium">{q.name}</span>
                              {overloaded && (
                                <Badge variant="warning" className="h-5 px-1.5 text-[10px]">
                                  {t("dashboard.queue.metrics.backlog")}
                                </Badge>
                              )}
                            </div>
                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                              <div
                                className={cn(
                                  "h-full rounded-full transition-all",
                                  overloaded
                                    ? "bg-amber-500"
                                    : busy
                                      ? "bg-primary"
                                      : "bg-muted-foreground/30",
                                )}
                                style={{ width: `${busy ? Math.max(ratio, 2) : 0}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-4 text-xs tabular-nums">
                            <div className="text-right">
                              <div className="text-muted-foreground">
                                {t("dashboard.queue.metrics.processes")}
                              </div>
                              <div className="font-medium">{processes}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-muted-foreground">
                                {t("dashboard.queue.metrics.pendingLabel")}
                              </div>
                              <div className={cn("font-medium", busy && "text-foreground")}>
                                {length.toLocaleString()}
                              </div>
                            </div>
                            <div className="min-w-[3.5rem] text-right">
                              <div className="text-muted-foreground">
                                {t("dashboard.queue.metrics.wait")}
                              </div>
                              <div className="font-medium">{formatWait(wait)}</div>
                            </div>
                          </div>
                        </div>

                        {Array.isArray(q.split_queues) && q.split_queues.length > 0 && (
                          <div className="mt-2.5 flex flex-wrap gap-1.5 border-t pt-2">
                            {q.split_queues.map((sq) => (
                              <span
                                key={sq.name}
                                className="inline-flex items-center gap-1.5 rounded-md bg-muted/60 px-2 py-0.5 text-[11px] text-muted-foreground"
                              >
                                <span className="font-medium text-foreground/80">{sq.name}</span>
                                <span className="tabular-nums">{sq.length}</span>
                                <span>·</span>
                                <span className="tabular-nums">{formatWait(sq.wait)}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <FailedJobsDialog open={failedJobsOpen} onOpenChange={setFailedJobsOpen} />
    </>
  );
}

function QueueMetric({
  icon,
  label,
  value,
  hint,
  tone = "default",
  onClick,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "danger";
  onClick?: () => void;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-muted/20 p-3.5 transition-colors",
        tone === "danger" && "border-destructive/30 bg-destructive/5",
        onClick && "cursor-pointer hover:bg-muted/40",
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span
          className={cn(
            "rounded-md p-1",
            tone === "danger" ? "bg-destructive/10 text-destructive" : "bg-background text-muted-foreground",
          )}
        >
          {icon}
        </span>
        <span className="truncate">{label}</span>
      </div>
      <p
        className={cn(
          "mt-2 text-2xl font-semibold tracking-tight tabular-nums",
          tone === "danger" && "text-destructive",
        )}
      >
        {value}
      </p>
      {hint && (
        <p className="mt-1 truncate text-[11px] text-muted-foreground" title={hint}>
          {hint}
        </p>
      )}
    </div>
  );
}
