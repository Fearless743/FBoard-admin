import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  Users, Bell,
  Activity, Upload, Download,
  ArrowDownToLine, BarChart3, MessagesSquare,
} from "lucide-react";
import { SimpleAreaChart } from "@/components/charts/area-chart";
import { useNavigate } from "react-router-dom";
import {
  getStats, getTrafficRank, getOrder, getQueueStats,
  type OrderStatItem,
} from "@/api/stat";
import { StatCard } from "@/components/common/stat-card";
import { PageHeader } from "@/components/common/page-header";
import { FailedJobsDialog } from "@/components/common/failed-jobs-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { formatBytes } from "@/lib/utils";
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

  const todayTs = useMemo(() => todayTimestamps(), []);
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

  const { data: queueStats } = useQuery({
    queryKey: ["dashboard", "queue-stats"],
    queryFn: getQueueStats,
    refetchInterval: 30_000,
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
              icon={<ArrowDownToLine className="h-4 w-4 text-emerald-500" />}
            />
            <StatCard
              title={t("dashboard.stats.monthlyIncome")}
              value={`¥${(Number(stats?.currentMonthIncome || 0) / 100).toFixed(2)}`}
              delta={stats?.monthIncomeGrowth}
              deltaLabel={t("dashboard.stats.vsLastMonth")}
              icon={<BarChart3 className="h-4 w-4 text-blue-500" />}
            />
            <StatCard
              title={t("dashboard.stats.pendingTickets")}
              value={Number(stats?.ticketPendingTotal || 0).toLocaleString()}
              footer={t("dashboard.stats.hasPendingTickets")}
              icon={<MessagesSquare className="h-4 w-4 text-orange-500" />}
              onClick={() => navigate(adminPath("ticket"))}
              highlight={Number(stats?.ticketPendingTotal || 0) > 0}
            />
            <StatCard
              title={t("dashboard.stats.pendingCommission")}
              value={Number(stats?.commissionPendingTotal || 0).toLocaleString()}
              footer={t("dashboard.stats.hasPendingCommission")}
              icon={<Bell className="h-4 w-4 text-blue-500" />}
              highlight={Number(stats?.commissionPendingTotal || 0) > 0}
            />
            <StatCard
              title={t("dashboard.stats.monthlyNewUsers")}
              value={Number(stats?.currentMonthNewUsers || 0).toLocaleString()}
              delta={stats?.userGrowth}
              deltaLabel={t("dashboard.stats.vsLastMonth")}
              icon={<Users className="h-4 w-4 text-blue-500" />}
            />
            <StatCard
              title={t("dashboard.stats.totalUsers")}
              value={Number(stats?.totalUsers || 0).toLocaleString()}
              footer={
                <span>
                  {t("dashboard.stats.activeUsers")}: {stats?.activeUsers ?? 0}
                </span>
              }
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
            />
            <StatCard
              title={t("dashboard.stats.monthlyUpload")}
              value={formatBytes(Number(stats?.monthTraffic?.upload || 0))}
              footer={
                <span>
                  今日: {formatBytes(Number(stats?.todayTraffic?.upload || 0))}
                </span>
              }
              icon={<Upload className="h-4 w-4 text-emerald-500" />}
            />
            <StatCard
              title={t("dashboard.stats.monthlyDownload")}
              value={formatBytes(Number(stats?.monthTraffic?.download || 0))}
              footer={
                <span>
                  今日: {formatBytes(Number(stats?.todayTraffic?.download || 0))}
                </span>
              }
              icon={<Download className="h-4 w-4 text-blue-500" />}
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
                暂无数据
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

      {/* 队列状态 + 作业详情 */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t("dashboard.queue.title")}</CardTitle>
            <Badge
              variant={queueStats?.status ? "outline" : "destructive"}
              className="gap-1"
            >
              <Activity className="h-3 w-3" />
              {queueStats?.status ? "正常" : "异常"}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">{t("dashboard.queue.details.recentJobs")}</p>
                <p className="mt-1 text-2xl font-bold">{queueStats?.recentJobs?.toLocaleString() ?? "—"}</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">{t("dashboard.queue.details.jobsPerMinute")}</p>
                <p className="mt-1 text-2xl font-bold">{queueStats?.jobsPerMinute?.toLocaleString() ?? "—"}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span>进程: {queueStats?.processes ?? "—"}</span>
              <span>最长队列: {queueStats?.queueWithMaxRuntime || "—"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t("dashboard.queue.jobDetails")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <span className="text-sm text-muted-foreground">{t("dashboard.queue.details.failedJobs7Days")}</span>
              <span className="text-xl font-bold">{queueStats?.failedJobs?.toLocaleString() ?? "—"}</span>
            </div>
            {Number(queueStats?.failedJobs) > 0 && (
              <div className="mt-2 flex justify-end">
                <Badge
                  variant="destructive"
                  className="cursor-pointer gap-1"
                  onClick={() => setFailedJobsOpen(true)}
                >
                  {t("dashboard.queue.details.viewFailedJobs")}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <FailedJobsDialog
        open={failedJobsOpen}
        onOpenChange={setFailedJobsOpen}
      />
    </>
  );
}
