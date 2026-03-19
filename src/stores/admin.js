import { computed, ref } from "vue";
import { defineStore } from "pinia";
import {
  Bell,
  DataAnalysis,
  Files,
  Monitor,
  Operation,
  Service,
  Setting,
  ShoppingCart,
  User,
} from "@element-plus/icons-vue";

import {
  createDefaultDashboardStats,
  createEmptyIncomeOverview,
  createEmptyQueueStats,
  createEmptySystemStatus,
  createEmptyTrafficRank,
  createEmptyUserInfo,
  fetchDashboardStats,
  fetchIncomeOverview,
  fetchQueueStats,
  fetchSystemStatus,
  fetchTrafficRank,
  fetchUserInfo,
} from "../services/dashboard";
import {
  createEmptyManagedNodesFilters,
  createEmptyManagedNodeGroups,
  createEmptyManagedNodeRoutes,
  createEmptyManagedNodes,
  createEmptyManagedNodesPagination,
  deleteManagedNode,
  copyManagedNode,
  updateManagedNodeShow,
  fetchManagedNodeGroups,
  fetchManagedNodeRoutes,
  fetchManagedNodes,
  saveManagedNode,
} from "../services/nodes";
import {
  createEmptyPlugins,
  createEmptyPluginsFilters,
  createEmptyPluginsPagination,
  createEmptyPluginTypes,
  deletePlugin,
  disablePlugin,
  enablePlugin,
  fetchPlugins,
  fetchPluginTypes,
  installPlugin,
  savePluginConfig,
  uninstallPlugin,
  uploadPlugin,
} from "../services/plugins";

export const useAdminStore = defineStore("admin", () => {
  const defaultDashboardStats = createDefaultDashboardStats();
  const incomeRangePresets = {
    "7d": { days: 7, labelKey: "income.range.last7Days" },
    "30d": { days: 30, labelKey: "income.range.last30Days" },
    "90d": { days: 90, labelKey: "income.range.last90Days" },
    "180d": { days: 180, labelKey: "income.range.last180Days" },
    "365d": { days: 365, labelKey: "income.range.lastYear" },
  };
  const searchKeyword = ref("");
  const dashboardSummary = ref(defaultDashboardStats.summary);
  const dashboardMetrics = ref(defaultDashboardStats.metrics);
  const dashboardStatsLoading = ref(false);
  const dashboardStatsError = ref("");
  const incomeOverview = ref(createEmptyIncomeOverview());
  const incomeOverviewRange = ref(createIncomeRangeSelection("30d"));
  const incomeOverviewLoading = ref(false);
  const incomeOverviewError = ref("");
  const nodeTrafficRank = ref(createEmptyTrafficRank());
  const nodeTrafficRankLoading = ref(false);
  const nodeTrafficRankError = ref("");
  const userTrafficRank = ref(createEmptyTrafficRank());
  const userTrafficRankLoading = ref(false);
  const userTrafficRankError = ref("");
  const queueStats = ref(createEmptyQueueStats());
  const queueStatsLoading = ref(false);
  const queueStatsError = ref("");
  const managedNodes = ref(createEmptyManagedNodes());
  const managedNodesFilters = ref(createEmptyManagedNodesFilters());
  const managedNodesPagination = ref(createEmptyManagedNodesPagination());
  const managedNodesLoading = ref(false);
  const managedNodesError = ref("");
  const managedNodeGroups = ref(createEmptyManagedNodeGroups());
  const managedNodeGroupsLoading = ref(false);
  const managedNodeGroupsError = ref("");
  const managedNodeRoutes = ref(createEmptyManagedNodeRoutes());
  const managedNodeRoutesLoading = ref(false);
  const managedNodeRoutesError = ref("");
  const systemStatus = ref(createEmptySystemStatus());
  const systemStatusLoading = ref(false);
  const systemStatusError = ref("");
  const plugins = ref(createEmptyPlugins());
  const pluginsFilters = ref(createEmptyPluginsFilters());
  const pluginsPagination = ref(createEmptyPluginsPagination());
  const pluginsLoading = ref(false);
  const pluginsError = ref("");
  const pluginTypes = ref(createEmptyPluginTypes());
  const pluginTypesLoading = ref(false);
  const pluginTypesError = ref("");
  const userInfo = ref(createEmptyUserInfo());
  const userInfoLoading = ref(false);
  const userInfoError = ref("");
  const configForm = ref({
    siteName: "LongtengCloud",
    securePath: "/change-me",
    currency: "CNY",
    emailWhitelist: "gmail.com, outlook.com",
    enableCaptcha: true,
    enableTrial: false,
  });

  const navigationGroups = [
    {
      titleKey: "nav.overview",
      items: [
        {
          labelKey: "nav.dashboard",
          icon: DataAnalysis,
          routeName: "dashboard",
        },
        { labelKey: "nav.notices", icon: Bell, routeName: "notices" },
      ],
    },
    {
      titleKey: "nav.system",
      items: [
        { labelKey: "nav.settings", icon: Setting, routeName: "settings" },
        { labelKey: "nav.nodes", icon: Monitor, routeName: "nodes" },
        { labelKey: "nav.plugins", icon: Operation, routeName: "plugins" },
      ],
    },
    {
      titleKey: "nav.business",
      items: [
        { labelKey: "nav.plans", icon: Files, routeName: "plans" },
        { labelKey: "nav.orders", icon: ShoppingCart, routeName: "orders" },
        { labelKey: "nav.users", icon: User, routeName: "users" },
        { labelKey: "nav.tickets", icon: Service, routeName: "tickets" },
      ],
    },
  ];

  const plans = [
    {
      name: "Starter",
      transfer: "120G",
      price: "¥ 19.90",
      cycle: "月付",
      status: "热销中",
    },
    {
      name: "Pro",
      transfer: "600G",
      price: "¥ 49.00",
      cycle: "月付",
      status: "推荐",
    },
    {
      name: "Enterprise",
      transfer: "2T",
      price: "¥ 199.00",
      cycle: "季付",
      status: "企业版",
    },
  ];

  const users = [
    {
      email: "alice@longtengcloud.io",
      plan: "Pro",
      balance: "¥ 82.00",
      status: "活跃",
    },
    {
      email: "ops@longtengcloud.io",
      plan: "Enterprise",
      balance: "¥ 620.00",
      status: "高价值",
    },
    {
      email: "neo@example.com",
      plan: "Starter",
      balance: "¥ 0.00",
      status: "待续费",
    },
  ];

  const orders = [
    {
      orderNo: "LT20260313001",
      userEmail: "alice@longtengcloud.io",
      plan: "Pro",
      amount: "¥ 49.00",
      gateway: "Stripe",
      status: "已支付",
    },
    {
      orderNo: "LT20260313002",
      userEmail: "neo@example.com",
      plan: "Starter",
      amount: "¥ 19.90",
      gateway: "支付宝",
      status: "待支付",
    },
    {
      orderNo: "LT20260313003",
      userEmail: "ops@longtengcloud.io",
      plan: "Enterprise",
      amount: "¥ 199.00",
      gateway: "USDT",
      status: "已完成",
    },
  ];

  const nodes = [];

  const tickets = [
    {
      id: "#TK-1024",
      subject: "订阅无法刷新",
      userEmail: "alice@longtengcloud.io",
      priority: "高优先级",
      updatedAt: "10 分钟前",
      status: "处理中",
    },
    {
      id: "#TK-1021",
      subject: "礼品卡兑换失败",
      userEmail: "neo@example.com",
      priority: "普通",
      updatedAt: "32 分钟前",
      status: "待回复",
    },
    {
      id: "#TK-1008",
      subject: "企业套餐发票申请",
      userEmail: "ops@longtengcloud.io",
      priority: "VIP",
      updatedAt: "1 小时前",
      status: "已解决",
    },
  ];

  const notices = [
    {
      title: "三月节点扩容通知",
      audience: "全部用户",
      publishAt: "2026-03-13 09:00",
      status: "已发布",
    },
    {
      title: "支付渠道维护窗口",
      audience: "付费用户",
      publishAt: "2026-03-12 20:30",
      status: "草稿",
    },
    {
      title: "新主题面板上线预告",
      audience: "管理员",
      publishAt: "2026-03-11 14:15",
      status: "已归档",
    },
  ];

  const activities = [
    {
      title: "支付网关已同步",
      description: "Stripe 与本地订单回调已完成校验，同步延迟控制在 120ms。",
      tone: "success",
    },
    {
      title: "香港节点负载升高",
      description: "节点 HK-03 瞬时流量超过 78%，建议调整路由优先级。",
      tone: "warning",
    },
    {
      title: "新主题配置已发布",
      description: "登录页品牌文案与页脚链接已推送到所有站点前台。",
      tone: "info",
    },
    {
      title: "系统日志归档完成",
      description: "7 天前的面板日志已打包到冷存储，查询性能恢复正常。",
      tone: "neutral",
    },
  ];

  const configFields = [
    { labelKey: "settings.fields.siteName", key: "siteName" },
    { labelKey: "settings.fields.securePath", key: "securePath" },
    { labelKey: "settings.fields.currency", key: "currency" },
    { labelKey: "settings.fields.emailWhitelist", key: "emailWhitelist" },
  ];

  const switchFields = [
    { labelKey: "settings.fields.enableCaptcha", key: "enableCaptcha" },
    { labelKey: "settings.fields.enableTrial", key: "enableTrial" },
  ];

  const filteredNavigationGroups = computed(() => {
    const keyword = searchKeyword.value.trim().toLowerCase();

    if (!keyword) {
      return navigationGroups;
    }

    return navigationGroups
      .map(function mapGroup(group) {
        const items = group.items.filter(function filterItem(item) {
          const label = String(item.label || item.labelKey || "");
          return label.toLowerCase().includes(keyword);
        });

        return {
          ...group,
          items,
        };
      })
      .filter(function filterGroup(group) {
        return group.items.length > 0;
      });
  });

  function badgeType(status) {
    if (
      status === "推荐" ||
      status === "高价值" ||
      status === "已支付" ||
      status === "已完成"
    ) {
      return "primary";
    }

    if (
      status === "待续费" ||
      status === "待支付" ||
      status === "高负载" ||
      status === "高优先级"
    ) {
      return "warning";
    }

    if (status === "维护中" || status === "草稿" || status === "待回复") {
      return "info";
    }

    if (status === "VIP" || status === "已发布") {
      return "success";
    }

    return "success";
  }

  function formatDateValue(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function buildRecentIncomeRange(days) {
    const endDate = new Date();
    const startDate = new Date();

    startDate.setDate(endDate.getDate() - days);

    return {
      startDate: formatDateValue(startDate),
      endDate: formatDateValue(endDate),
    };
  }

  function createIncomeRangeSelection(key, customRange = {}) {
    if (key === "custom") {
      const hasCustomRange = customRange.startDate && customRange.endDate;

    return {
      key: "custom",
      label: hasCustomRange
        ? `${customRange.startDate} 至 ${customRange.endDate}`
        : "自定义范围",
      labelKey: "income.range.custom",
      startDate: customRange.startDate || "",
      endDate: customRange.endDate || "",
    };
  }

    const preset = incomeRangePresets[key] || incomeRangePresets["30d"];
    const resolvedKey = incomeRangePresets[key] ? key : "30d";
    const range = buildRecentIncomeRange(preset.days);

    return {
      key: resolvedKey,
      labelKey: preset.labelKey,
      startDate: range.startDate,
      endDate: range.endDate,
    };
  }

  function normalizeIncomeRangeSelection(selection = {}) {
    if (selection.key === "custom") {
      return createIncomeRangeSelection("custom", selection);
    }

    return createIncomeRangeSelection(selection.key || "30d");
  }

  async function loadDashboardStats() {
    dashboardStatsLoading.value = true;
    dashboardStatsError.value = "";

    try {
      const stats = await fetchDashboardStats();

      dashboardSummary.value = stats.summary;
      dashboardMetrics.value = stats.metrics;
    } catch (error) {
      dashboardSummary.value = defaultDashboardStats.summary;
      dashboardMetrics.value = defaultDashboardStats.metrics;
      dashboardStatsError.value =
        error instanceof Error ? error.message : "仪表盘统计加载失败";
    } finally {
      dashboardStatsLoading.value = false;
    }
  }

  async function loadIncomeOverview(range) {
    const nextRange = normalizeIncomeRangeSelection(
      range || incomeOverviewRange.value,
    );

    incomeOverviewLoading.value = true;
    incomeOverviewError.value = "";
    incomeOverviewRange.value = nextRange;

    try {
      const nextOverview = await fetchIncomeOverview({
        startDate: nextRange.startDate,
        endDate: nextRange.endDate,
      });
      incomeOverview.value = nextOverview;
    } catch (error) {
      incomeOverview.value = createEmptyIncomeOverview();
      incomeOverviewError.value =
        error instanceof Error ? error.message : "收入概览加载失败";
    } finally {
      incomeOverviewLoading.value = false;
    }
  }

  async function loadNodeTrafficRank(options) {
    nodeTrafficRankLoading.value = true;
    nodeTrafficRankError.value = "";

    try {
      const nextRankData = await fetchTrafficRank({
        type: "node",
        ...options,
      });

      nodeTrafficRank.value = nextRankData;
    } catch (error) {
      nodeTrafficRank.value = createEmptyTrafficRank();
      nodeTrafficRankError.value =
        error instanceof Error ? error.message : "节点流量排行加载失败";
    } finally {
      nodeTrafficRankLoading.value = false;
    }
  }

  async function loadUserTrafficRank(options) {
    userTrafficRankLoading.value = true;
    userTrafficRankError.value = "";

    try {
      const nextRankData = await fetchTrafficRank({
        type: "user",
        ...options,
      });

      userTrafficRank.value = nextRankData;
    } catch (error) {
      userTrafficRank.value = createEmptyTrafficRank();
      userTrafficRankError.value =
        error instanceof Error ? error.message : "用户流量排行加载失败";
    } finally {
      userTrafficRankLoading.value = false;
    }
  }

  async function loadUserInfo() {
    userInfoLoading.value = true;
    userInfoError.value = "";

    try {
      userInfo.value = await fetchUserInfo();
    } catch (error) {
      userInfo.value = createEmptyUserInfo();
      userInfoError.value =
        error instanceof Error ? error.message : "用户信息加载失败";
    } finally {
      userInfoLoading.value = false;
    }
  }

  async function loadQueueStats() {
    queueStatsLoading.value = true;
    queueStatsError.value = "";

    try {
      queueStats.value = await fetchQueueStats();
    } catch (error) {
      queueStats.value = createEmptyQueueStats();
      queueStatsError.value =
        error instanceof Error ? error.message : "队列状态加载失败";
    } finally {
      queueStatsLoading.value = false;
    }
  }

  async function loadManagedNodes(options = {}) {
    managedNodesLoading.value = true;
    managedNodesError.value = "";
    const nextFilters = {
      ...managedNodesFilters.value,
      ...(options.filters || {}),
    };
    const nextPagination = {
      ...managedNodesPagination.value,
      ...options,
    };

    try {
      const response = await fetchManagedNodes({
        page: nextPagination.page,
        limit: nextPagination.limit,
        type: nextFilters.type,
        word: nextFilters.word,
        status: nextFilters.status,
      });

      managedNodes.value = response.list;
      managedNodesFilters.value = nextFilters;
      managedNodesPagination.value = response.pagination;
    } catch (error) {
      managedNodes.value = createEmptyManagedNodes();
      managedNodesFilters.value = nextFilters;
      managedNodesPagination.value = {
        page: Number(nextPagination.page || 1),
        limit: Number(
          nextPagination.limit || managedNodesPagination.value.limit || 10,
        ),
        total: 0,
      };
      managedNodesError.value =
        error instanceof Error ? error.message : "节点列表加载失败";
    } finally {
      managedNodesLoading.value = false;
    }
  }

  async function loadManagedNodeGroups() {
    managedNodeGroupsLoading.value = true;
    managedNodeGroupsError.value = "";

    try {
      managedNodeGroups.value = await fetchManagedNodeGroups();
    } catch (error) {
      managedNodeGroups.value = createEmptyManagedNodeGroups();
      managedNodeGroupsError.value =
        error instanceof Error ? error.message : "权限组列表加载失败";
    } finally {
      managedNodeGroupsLoading.value = false;
    }
  }

  async function loadManagedNodeRoutes() {
    managedNodeRoutesLoading.value = true;
    managedNodeRoutesError.value = "";

    try {
      managedNodeRoutes.value = await fetchManagedNodeRoutes();
    } catch (error) {
      managedNodeRoutes.value = createEmptyManagedNodeRoutes();
      managedNodeRoutesError.value =
        error instanceof Error ? error.message : "路由组列表加载失败";
    } finally {
      managedNodeRoutesLoading.value = false;
    }
  }

  async function saveManagedNodeItem(payload) {
    managedNodesError.value = "";

    try {
      return await saveManagedNode(payload);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "保存节点失败";
      managedNodesError.value = message;
      throw error;
    }
  }

  async function deleteManagedNodeItem(id) {
    managedNodesError.value = "";

    try {
      return await deleteManagedNode(id);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "删除节点失败";
      managedNodesError.value = message;
      throw error;
    }
  }

  async function copyManagedNodeItem(id) {
    managedNodesError.value = "";

    try {
      return await copyManagedNode(id);
    } catch (error) {
      const message = error instanceof Error ? error.message : "复制节点失败";
      managedNodesError.value = message;
      throw error;
    }
  }

  async function updateManagedNodeShowItem(id, show) {
    managedNodesError.value = "";

    try {
      return await updateManagedNodeShow(id, show);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "更新节点显示状态失败";
      managedNodesError.value = message;
      throw error;
    }
  }

  async function loadSystemStatus() {
    systemStatusLoading.value = true;
    systemStatusError.value = "";

    try {
      systemStatus.value = await fetchSystemStatus();
    } catch (error) {
      systemStatus.value = createEmptySystemStatus();
      systemStatusError.value =
        error instanceof Error ? error.message : "系统状态加载失败";
    } finally {
      systemStatusLoading.value = false;
    }
  }

  async function loadPlugins(options = {}) {
    pluginsLoading.value = true;
    pluginsError.value = "";
    const nextFilters = {
      ...pluginsFilters.value,
      ...(options.filters || {}),
    };
    const nextPagination = {
      ...pluginsPagination.value,
      ...options,
    };

    try {
      const response = await fetchPlugins({
        type: nextFilters.type,
        status: nextFilters.status,
      });

      plugins.value = response.list;
      pluginsFilters.value = nextFilters;
      pluginsPagination.value = response.pagination;
    } catch (error) {
      plugins.value = createEmptyPlugins();
      pluginsFilters.value = nextFilters;
      pluginsPagination.value = {
        page: Number(nextPagination.page || 1),
        limit: Number(nextPagination.limit || pluginsPagination.value.limit || 50),
        total: 0,
      };
      pluginsError.value =
        error instanceof Error ? error.message : "插件列表加载失败";
    } finally {
      pluginsLoading.value = false;
    }
  }

  async function togglePlugin(code, enabled) {
    const pluginCode = String(code || "").trim();

    if (!pluginCode) {
      throw new Error("缺少插件标识");
    }

    if (enabled) {
      await enablePlugin(pluginCode);
    } else {
      await disablePlugin(pluginCode);
    }
  }

  async function installPluginItem(code) {
    const pluginCode = String(code || "").trim();

    if (!pluginCode) {
      throw new Error("缺少插件标识");
    }

    await installPlugin(pluginCode);
  }

  async function uninstallPluginItem(code) {
    const pluginCode = String(code || "").trim();

    if (!pluginCode) {
      throw new Error("缺少插件标识");
    }

    await uninstallPlugin(pluginCode);
  }

  async function deletePluginItem(code) {
    const pluginCode = String(code || "").trim();

    if (!pluginCode) {
      throw new Error("缺少插件标识");
    }

    await deletePlugin(pluginCode);
  }

  async function uploadPluginItem(file) {
    if (!file) {
      throw new Error("缺少插件文件");
    }

    await uploadPlugin(file);
  }

  async function loadPluginTypes() {
    pluginTypesLoading.value = true;
    pluginTypesError.value = "";

    try {
      const list = await fetchPluginTypes();
      pluginTypes.value = list;
      return list;
    } catch (error) {
      pluginTypesError.value = error?.message || "插件类型加载失败";
      pluginTypes.value = createEmptyPluginTypes();
      throw error;
    } finally {
      pluginTypesLoading.value = false;
    }
  }

  async function savePluginConfigItem(code, config) {
    const pluginCode = String(code || "").trim();

    if (!pluginCode) {
      throw new Error("缺少插件标识");
    }

    await savePluginConfig(pluginCode, config);
  }

  return {
    activities,
    badgeType,
    configFields,
    configForm,
    dashboardMetrics,
    dashboardStatsError,
    dashboardStatsLoading,
    dashboardSummary,
    filteredNavigationGroups,
    incomeOverview,
    incomeOverviewRange,
    incomeOverviewError,
    incomeOverviewLoading,
    loadIncomeOverview,
    loadManagedNodeGroups,
    loadManagedNodeRoutes,
    loadManagedNodes,
    saveManagedNode: saveManagedNodeItem,
    saveManagedNodeItem,
    deleteManagedNodeItem,
    copyManagedNodeItem,
    updateManagedNodeShowItem,
    loadNodeTrafficRank,
    loadQueueStats,
    loadSystemStatus,
    loadUserInfo,
    loadUserTrafficRank,
    loadDashboardStats,
    managedNodeGroups,
    managedNodeGroupsError,
    managedNodeGroupsLoading,
    managedNodeRoutes,
    managedNodeRoutesError,
    managedNodeRoutesLoading,
    managedNodes,
    managedNodesError,
    managedNodesFilters,
    managedNodesLoading,
    managedNodesPagination,
    plugins,
    pluginsError,
    pluginsFilters,
    pluginsLoading,
    pluginsPagination,
    pluginTypes,
    pluginTypesLoading,
    pluginTypesError,
    loadPlugins,
    loadPluginTypes,
    togglePlugin,
    installPlugin: installPluginItem,
    uninstallPlugin: uninstallPluginItem,
    deletePlugin: deletePluginItem,
    uploadPlugin: uploadPluginItem,
    savePluginConfig: savePluginConfigItem,
    navigationGroups,
    nodeTrafficRank,
    nodeTrafficRankError,
    nodeTrafficRankLoading,
    nodes,
    notices,
    orders,
    plans,
    queueStats,
    queueStatsError,
    queueStatsLoading,
    searchKeyword,
    switchFields,
    systemStatus,
    systemStatusError,
    systemStatusLoading,
    tickets,
    userTrafficRank,
    userTrafficRankError,
    userTrafficRankLoading,
    userInfo,
    userInfoError,
    userInfoLoading,
    users,
  };
});
