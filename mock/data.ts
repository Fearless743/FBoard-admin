/**
 * 本地开发用的内存测试数据。
 *
 * 只在 `vite --mode mock`（即 `bun run dev:mock`）时被 mock/server.ts 加载，
 * 不会进入生产构建。数据在模块加载时一次性生成，进程重启即重置，修改后
 * 热更新即可看到效果。
 */

const now = Math.floor(Date.now() / 1000);
const DAY = 86400;
const HOUR = 3600;
const GB = 1024 ** 3;
const MB = 1024 ** 2;

function pad(n: number, len = 2): string {
  return String(n).padStart(len, "0");
}

function email(i: number): string {
  return `user${pad(i, 3)}@example.com`;
}

function dateStr(sec: number): string {
  const d = new Date(sec * 1000);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/* ============================ 用户 ============================ */
const users: any[] = Array.from({ length: 57 }, (_, k) => {
  const i = k + 1;
  return {
    id: i,
    email: email(i),
    uuid: `${pad(i, 4)}-mock-uuid-${pad(i, 4)}`,
    token: `mock-token-${i}`,
    balance: ((i * 137) % 100000) / 100,
    commission_balance: ((i * 53) % 50000) / 100,
    transfer_enable: 100 * GB,
    u: (i * 13 * MB) % (50 * GB),
    d: (i * 37 * MB) % (200 * GB),
    banned: i % 13 === 0,
    is_admin: i === 1,
    is_staff: i % 9 === 0,
    plan_id: (i % 5) + 1,
    group_id: i % 4,
    expired_at: now + (30 - (i % 30)) * DAY,
    device_limit: (i % 5) + 1,
    speed_limit: null,
    last_login_at: now - (i % 72) * HOUR,
    last_login_ip: `10.0.${i % 255}.${(i * 7) % 255}`,
    register_ip: `10.0.${i % 255}.${(i * 3) % 255}`,
    created_at: now - i * DAY,
    updated_at: now - i * HOUR,
    remark: i % 7 === 0 ? "VIP 测试用户" : "",
    commission_type: i % 3,
    commission_rate: i % 3 === 1 ? 20 : null,
    invite_user_id: i > 10 ? ((i * 3) % 10) + 1 : null,
    invite_user: i > 10 ? { id: ((i * 3) % 10) + 1, email: email(((i * 3) % 10) + 1) } : null,
  };
});

function loginLogsFor(userId: number): any[] {
  return Array.from({ length: 12 }, (_, k) => {
    const i = k + 1;
    return {
      id: userId * 1000 + i,
      ip: `203.0.113.${(userId * 5 + i) % 255}`,
      user_agent:
        i % 3 === 0
          ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) AppleWebKit/605.1.15"
          : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0",
      method: i % 4 === 0 ? "mail_link" : "password",
      created_at: now - i * 8 * HOUR,
    };
  });
}

/* ============================ 套餐 ============================ */
const planNames = ["基础版", "标准版", "高级版", "旗舰版", "测试套餐"];
const plans: any[] = planNames.map((name, k) => {
  const id = k + 1;
  const base = id * 990;
  return {
    id,
    name,
    show: 1,
    sell: 1,
    renew: 1,
    group_id: (id % 4) + 1,
    group: { id: (id % 4) + 1, name: `权限组 ${(id % 4) + 1}` },
    transfer_enable: id * 100 * GB,
    speed_limit: null,
    device_limit: id + 1,
    capacity_limit: null,
    reset_traffic_method: id % 3,
    content: `## ${name}\n\n- 流量：${id * 100} GiB\n- 设备：${id + 1} 台\n- 测试数据`,
    prices: {
      month_price: base,
      quarter_price: base * 3 - 1000,
      half_year_price: base * 6 - 3000,
      year_price: base * 12 - 8000,
      onetime_price: null,
      reset_price: 500,
    },
    month_price: base,
    quarter_price: base * 3 - 1000,
    half_year_price: base * 6 - 3000,
    year_price: base * 12 - 8000,
    two_year_price: base * 24 - 20000,
    three_year_price: base * 36 - 40000,
    onetime_price: null,
    reset_price: 500,
    sort: id,
    users_count: 12 - id,
    active_users_count: 9 - id,
    created_at: now - id * 5 * DAY,
    updated_at: now - id * DAY,
  };
});

/* ============================ 订单 ============================ */
const orderTypes = [1, 1, 2, 2, 3, 4];
const orderStatuses = [3, 3, 3, 3, 1, 0, 2, 4];
const periods = ["month_price", "quarter_price", "year_price", "half_year_price"];
const orders: any[] = Array.from({ length: 83 }, (_, k) => {
  const i = k + 1;
  const uid = (i * 7) % users.length + 1;
  const pid = (i % plans.length) + 1;
  const total = ((i * 997) % 50000) + 1000;
  return {
    id: i,
    trade_no: `${new Date().getFullYear()}${pad(1000 + i, 4)}${pad(i, 4)}mockorder${i}`,
    user_id: uid,
    user_email: email(uid),
    user: { id: uid, email: email(uid) },
    type: orderTypes[i % orderTypes.length],
    plan_id: pid,
    plan: { id: pid, name: planNames[pid - 1] },
    period: periods[i % periods.length],
    total_amount: total,
    discount_amount: i % 5 === 0 ? 500 : 0,
    balance_amount: i % 3 === 0 ? 2000 : 0,
    refund_amount: 0,
    actual_amount: total,
    status: orderStatuses[i % orderStatuses.length],
    commission_status: i % 4,
    commission_balance: (i * 113) % 5000,
    paid_at: now - (i % 120) * DAY,
    created_at: now - (i % 120) * DAY,
    updated_at: now - (i % 120) * DAY + HOUR,
    callback_no: `mock-callback-${i}`,
    invite_user_id: i % 3 === 0 ? 1 : undefined,
  };
});

/* ============================ 工单 ============================ */
const ticketSubjects = [
  "无法连接节点",
  "订阅链接打不开",
  "充值未到账",
  "请求更换套餐",
  "账号被误封",
  "支付问题咨询",
];
const tickets: any[] = Array.from({ length: 25 }, (_, k) => {
  const i = k + 1;
  const uid = (i * 5) % users.length + 1;
  return {
    id: i,
    subject: `${ticketSubjects[i % ticketSubjects.length]} #${i}`,
    level: i % 3,
    status: i % 4 === 0 ? 1 : 0,
    reply_status: i % 3 === 0 ? 1 : 0,
    user_id: uid,
    user_email: email(uid),
    message_count: (i % 5) + 1,
    content: "这是本地 mock 的工单内容，用于界面调试。",
    updated_at: now - i * HOUR,
    created_at: now - i * 2 * DAY,
  };
});

/* ============================ 提现 ============================ */
const withdrawMethods = ["支付宝", "USDT-TRC20", "银行卡"];
const withdrawals: any[] = Array.from({ length: 18 }, (_, k) => {
  const i = k + 1;
  const uid = (i * 3) % users.length + 1;
  return {
    id: i,
    user_id: uid,
    user_email: email(uid),
    user: { id: uid, email: email(uid), balance: 100, commission_balance: 250.5 },
    withdraw_method: withdrawMethods[i % withdrawMethods.length],
    withdraw_account: `mock-account-${i}@example.com`,
    amount: ((i * 313) % 20000) + 1000,
    status: i % 5 === 0 ? 2 : i % 3 === 0 ? 1 : 0,
    remark: i % 5 === 0 ? "账户信息有误" : null,
    operator_id: i % 3 === 0 ? 1 : null,
    operator: i % 3 === 0 ? { id: 1, email: "admin@example.com" } : null,
    messages: [
      {
        id: i * 10 + 1,
        withdrawal_id: i,
        user_id: uid,
        sender: { id: uid, email: email(uid) },
        message: "请尽快处理，谢谢！",
        is_admin: false,
        created_at: now - 2 * DAY,
      },
    ],
    created_at: now - i * 2 * DAY,
    updated_at: now - i * DAY,
  };
});

/* ============================ 优惠券 ============================ */
const coupons: any[] = Array.from({ length: 30 }, (_, k) => {
  const i = k + 1;
  const type = i % 2 === 0 ? 2 : 1;
  return {
    id: i,
    name: type === 1 ? `满减券 ${i}` : `折扣券 ${i}`,
    type,
    value: type === 1 ? (i % 5 + 1) * 500 : (i % 4 + 1) * 5,
    code: `MOCK${pad(i, 4)}`,
    limit_use: i % 3 === 0 ? 100 : null,
    limit_use_with_user: i % 4 === 0 ? 1 : null,
    started_at: now - i * DAY,
    ended_at: now + (30 - i) * DAY,
    show: i % 7 === 0 ? 0 : 1,
    limit_period: i % 3 === 0 ? ["month_price", "quarter_price"] : [],
    limit_plan: [],
  };
});

/* ============================ 公告 ============================ */
const notices: any[] = Array.from({ length: 12 }, (_, k) => {
  const i = k + 1;
  return {
    id: i,
    title: `测试公告 ${i}：系统维护通知`,
    content: `这是第 ${i} 条本地 mock 公告内容。\n\n- 维护时间：今晚 23:00 - 24:00\n- 影响范围：部分节点`,
    show: i % 6 === 0 ? 0 : 1,
    img_url: "",
    tags: ["维护", "通知"].slice(0, (i % 2) + 1),
    sort: i,
    created_at: now - i * DAY,
    updated_at: now - i * DAY,
  };
});

/* ============================ 支付方式 ============================ */
const payments: any[] = [
  { name: "支付宝", payment: "alipay" },
  { name: "微信支付", payment: "wechat" },
  { name: "Stripe", payment: "stripe" },
  { name: "USDT", payment: "usdt" },
  { name: "PayPal", payment: "paypal" },
  { name: "余额支付", payment: "balance" },
].map((p, k) => {
  const i = k + 1;
  return {
    id: i,
    ...p,
    icon: "",
    notify_domain: "",
    notify_url: "",
    handling_fee_percent: i % 3 === 0 ? 2 : 0,
    handling_fee_fixed: 0,
    enable: i % 5 === 0 ? 0 : 1,
    config: {},
    sort: i,
  };
});

/* ============================ 知识库 ============================ */
const knowledgeCategories = ["使用教程", "常见问题", "客户端", "节点说明"];
const knowledge: any[] = Array.from({ length: 15 }, (_, k) => {
  const i = k + 1;
  return {
    id: i,
    title: `知识库文档 ${i}`,
    category: knowledgeCategories[i % knowledgeCategories.length],
    language: ["zh-CN", "en-US", "zh-TW"][i % 3],
    content: `<h2>文档 ${i}</h2><p>这是本地 mock 的知识库正文，用于调试富文本编辑器。</p>`,
    body: `<h2>文档 ${i}</h2><p>这是本地 mock 的知识库正文，用于调试富文本编辑器。</p>`,
    show: i % 5 === 0 ? 0 : 1,
    created_at: now - i * DAY,
    updated_at: now - i * DAY,
  };
});

/* ============================ 权限组 / 路由 ============================ */
const groups: any[] = Array.from({ length: 4 }, (_, k) => ({
  id: k + 1,
  name: `权限组 ${k + 1}`,
  users_count: 12 - k * 2,
  server_count: 3,
}));

const routes: any[] = [
  { id: 1, remarks: "屏蔽广告域名", match: ["ads.example.com", "track.example.com"], action: "block" },
  { id: 2, remarks: "国内直连", match: ["cn.example.com", "*.baidu.com"], action: "direct" },
  { id: 3, remarks: "走代理", match: ["*.google.com", "*.youtube.com"], action: "proxy" },
  { id: 4, remarks: "自定义 DNS", match: ["dns.example.com"], action: "dns", action_value: "1.1.1.1" },
  { id: 5, remarks: "流媒体代理", match: ["*.netflix.com"], action: "proxy" },
  { id: 6, remarks: "公司内网直连", match: ["10.0.0.0/8"], action: "direct" },
];

/* ============================ 节点 ============================ */
const nodeTypes = ["shadowsocks", "vmess", "vless", "trojan", "hysteria2", "tuic"];
const nodes: any[] = Array.from({ length: 12 }, (_, k) => {
  const i = k + 1;
  return {
    id: i,
    code: `node-${pad(i, 2)}`,
    name: `测试节点 ${i} · ${nodeTypes[i % nodeTypes.length]}`,
    type: nodeTypes[i % nodeTypes.length],
    protocol_settings: {},
    host: `node${i}.example.com`,
    port: 10000 + i,
    server_port: 10000 + i,
    listen_address: "0.0.0.0",
    rate: 1 + (i % 3) * 0.5,
    traffic_limit: 0,
    show: i % 9 === 0 ? 0 : 1,
    sort: i,
    parent_id: null,
    group_ids: [((i - 1) % 4) + 1, (i % 4) + 1],
    route_ids: [i % routes.length + 1],
    tags: ["测试", `区域-${i % 3}`],
    banned: false,
    enabled: true,
    status: [2, 2, 2, 1, 0][i % 5],
    online: (i * 7) % 40,
    machine_id: (i % 8) + 1,
    last_check_at: now - i * 60,
    created_at: now - i * 3 * DAY,
    updated_at: now - i * HOUR,
  };
});

/* ============================ 机器 ============================ */
const machines: any[] = Array.from({ length: 8 }, (_, k) => {
  const i = k + 1;
  const online = i % 4 !== 0;
  return {
    id: i,
    name: `机器 ${i}`,
    is_active: true,
    is_online: online,
    notes: `本地 mock 机器 ${i}`,
    last_seen_at: online ? now - i * 30 : now - 2 * DAY,
    servers_count: (i % 4) + 1,
    version: online ? "1.2.3" : null,
    load_status: online
      ? {
          cpu: 10 + i * 7,
          mem: { total: 4 * GB, used: (1 + i * 0.2) * GB },
          swap: { total: GB, used: 0 },
          disk: { total: 40 * GB, used: (5 + i) * GB },
          net: { in_speed: i * 1024 * 1024, out_speed: i * 512 * 1024 },
          version: "1.2.3",
          kernel: { status: i % 3 === 0 ? "partial" : "running", nodes_total: 2, nodes_running: 2, nodes_desired: 2 },
          updated_at: now - 20,
        }
      : null,
  };
});

const machineSummary = {
  total: machines.length,
  online: machines.filter((m) => m.is_online).length,
  offline: machines.filter((m) => !m.is_online).length,
  high_load: 1,
  nodes: nodes.length,
};

/* ============================ 礼品卡 ============================ */
const giftCardTemplates: any[] = Array.from({ length: 4 }, (_, k) => {
  const i = k + 1;
  return {
    id: i,
    name: `礼品卡模板 ${i}`,
    type: i % 4 + 1,
    status: i % 3 === 0 ? 0 : 1,
    sort: i,
    rewards: { type: "balance", value: i * 1000 },
    conditions: {},
    limits: { max_usage: 1 },
    created_at: now - i * DAY,
    updated_at: now - i * DAY,
  };
});

const giftCardCodes: any[] = Array.from({ length: 40 }, (_, k) => {
  const i = k + 1;
  return {
    id: i,
    code: `GIFT-${pad(i, 5)}-MOCK`,
    template_id: (i % 4) + 1,
    template: { id: (i % 4) + 1, name: `礼品卡模板 ${(i % 4) + 1}` },
    status: [0, 0, 0, 1, 2, 3][i % 6],
    usage_count: i % 3,
    max_usage: 1,
    batch_id: `batch-${(i % 3) + 1}`,
    expires_at: now + (30 - (i % 30)) * DAY,
    created_at: now - i * DAY,
  };
});

const giftCardUsages: any[] = Array.from({ length: 20 }, (_, k) => {
  const i = k + 1;
  const uid = (i * 4) % users.length + 1;
  return {
    id: i,
    code_id: i,
    code: `GIFT-${pad(i, 5)}-MOCK`,
    template_id: (i % 4) + 1,
    template: { id: (i % 4) + 1, name: `礼品卡模板 ${(i % 4) + 1}` },
    user_id: uid,
    user: { id: uid, email: email(uid) },
    created_at: now - i * DAY,
  };
});

const giftCardStatistics = {
  total_templates: giftCardTemplates.length,
  total_codes: giftCardCodes.length,
  used_codes: giftCardCodes.filter((c) => c.status === 1).length,
  unused_codes: giftCardCodes.filter((c) => c.status === 0).length,
  total_usages: giftCardUsages.length,
};

/* ============================ 统计 ============================ */
function orderStat(startDate: string, endDate: string) {
  const start = Date.parse(`${startDate}T00:00:00Z`) || now * 1000;
  const end = Date.parse(`${endDate}T00:00:00Z`) || now * 1000;
  const list: any[] = [];
  let paidTotal = 0;
  let paidCount = 0;
  for (let t = start; t < end; t += DAY * 1000) {
    const idx = Math.floor((t - start) / (DAY * 1000)) + 1;
    const paid = ((idx * 613) % 30000) + 2000;
    const count = (idx * 3) % 12 + 1;
    paidTotal += paid;
    paidCount += count;
    list.push({
      date: dateStr(Math.floor(t / 1000)),
      paid_total: paid,
      paid_count: count,
      commission_total: Math.floor(paid * 0.1),
      commission_count: Math.max(1, Math.floor(count / 2)),
      avg_order_amount: Math.floor(paid / count),
      avg_commission_amount: Math.floor(paid * 0.1 / Math.max(1, Math.floor(count / 2))),
    });
  }
  return {
    list,
    summary: {
      paid_total: paidTotal,
      paid_count: paidCount,
      commission_total: Math.floor(paidTotal * 0.1),
      commission_count: Math.max(1, Math.floor(paidCount / 2)),
      start_date: startDate,
      end_date: endDate,
      avg_paid_amount: paidCount ? Math.floor(paidTotal / paidCount) : 0,
      avg_commission_amount: 1234,
      commission_rate: 10,
    },
  };
}

function trafficRank(type: "node" | "user") {
  return Array.from({ length: 10 }, (_, k) => {
    const i = k + 1;
    const value = (11 - i) * GB;
    return {
      id: String(i),
      name: type === "node" ? `测试节点 ${i}` : email(i),
      value: String(value),
      previousValue: String(Math.floor(value * 0.8)),
      change: Math.round(((value * 0.2) / value) * 100),
      timestamp: String(now),
    };
  });
}

const dashboardStats = {
  todayIncome: "1234500",
  dayIncomeGrowth: 12.5,
  currentMonthIncome: "23456700",
  lastMonthIncome: "21000000",
  monthIncomeGrowth: 8.3,
  currentMonthCommissionPayout: "320000",
  lastMonthCommissionPayout: "280000",
  commissionGrowth: 14.2,
  commissionPendingTotal: 3,
  currentMonthNewUsers: 42,
  totalUsers: users.length,
  activeUsers: 48,
  userGrowth: 5.1,
  onlineUsers: 23,
  onlineDevices: "35",
  ticketPendingTotal: tickets.filter((t) => t.status === 0).length,
  onlineNodes: 9,
  todayTraffic: { upload: String(10 * GB), download: String(30 * GB), total: String(40 * GB) },
  monthTraffic: { upload: String(210 * GB), download: String(640 * GB), total: String(850 * GB) },
};

const queueStats = {
  failedJobs: 0,
  jobsPerMinute: 120,
  pausedMasters: 0,
  periods: { failedJobs: 168, recentJobs: 24 },
  processes: 6,
  queueWithMaxRuntime: "default",
  queueWithMaxThroughput: "stat",
  recentJobs: 3456,
  status: true,
  wait: { "default:5": 12, "stat:3": 3, "node_sync:2": 0 },
};

const queueWorkload = [
  { name: "default", length: 12, wait: 12, processes: 3, split_queues: null },
  { name: "stat", length: 340, wait: 3, processes: 2, split_queues: [{ name: "stat", length: 340, wait: 3 }] },
  { name: "node_sync", length: 0, wait: 0, processes: 1, split_queues: null },
  { name: "order_handle", length: 58, wait: 24, processes: 1, split_queues: null },
  { name: "traffic_fetch", length: 4, wait: 1, processes: 1, split_queues: null },
];

const protocolTypes = [
  { id: 1, type: "shadowsocks", name: "Shadowsocks" },
  { id: 2, type: "vmess", name: "VMess" },
  { id: 3, type: "vless", name: "VLESS" },
  { id: 4, type: "trojan", name: "Trojan" },
  { id: 5, type: "hysteria2", name: "Hysteria2" },
  { id: 6, type: "tuic", name: "TUIC" },
];

const protocolDefinitions: Record<string, any> = {
  shadowsocks: {
    type: "shadowsocks",
    name: "Shadowsocks",
    description: "本地 mock 协议定义",
    config_fields: {
      cipher: { type: "string", default: "aes-256-gcm", label: "加密方式" },
      server_key: { type: "string", default: "mock-password", label: "密码" },
    },
    validation_rules: {},
  },
};

const subscribeTemplates: Record<string, string> = {
  singbox: '{\n  "inbounds": [],\n  "outbounds": []\n}\n',
  clash: "proxies: []\nrules: []\n",
  clashmeta: "proxies: []\nrules: []\n",
  stash: "proxies: []\nrules: []\n",
  surge: "[Proxy]\nmock = direct\n",
  surfboard: "[Proxy]\nmock = direct\n",
};

const themes = {
  active: "Fboard",
  themes: {
    Fboard: {
      version: "1.0.0",
      description: "默认主题（本地 mock）",
      configs: [
        { field_name: "site_name", label: "站点名称", field_type: "text", default_value: "Fboard" },
        {
          field_name: "accent",
          label: "主题色",
          field_type: "select",
          default_value: "blue",
          select_options: { blue: "蓝色", green: "绿色", red: "红色" },
        },
      ],
    },
  },
};

export const db = {
  now,
  users,
  loginLogsFor,
  plans,
  orders,
  tickets,
  withdrawals,
  coupons,
  notices,
  payments,
  knowledge,
  knowledgeCategories,
  groups,
  routes,
  nodes,
  machines,
  machineSummary,
  giftCardTemplates,
  giftCardCodes,
  giftCardUsages,
  giftCardStatistics,
  dashboardStats,
  orderStat,
  trafficRank,
  queueStats,
  queueWorkload,
  protocolTypes,
  protocolDefinitions,
  subscribeTemplates,
  themes,
};
