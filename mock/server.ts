/**
 * 本地开发 mock 后端（Vite dev 中间件）。
 *
 * 通过 `bun run dev:mock`（即 `vite --mode mock`）启用，进程内拦截：
 *   - /settings.js、/settings.local.js  —— 注入 window.settings
 *   - /locales/<lang>.js                —— 由 src/locales/*.ts 实时编译
 *   - /api/v2/**                        —— 用 mock/data.ts 的内存数据响应
 *
 * 不依赖任何后端服务，也不会进入生产构建（apply: "serve" + 仅 mock 模式加载）。
 */
import type { Plugin } from "vite";
import type { IncomingMessage, ServerResponse } from "node:http";
import fs from "node:fs";
import path from "node:path";
import { transform } from "esbuild";
import { db } from "./data";

/** 与前端 window.settings.secure_path 保持一致 */
const SECURE_PATH = "8be4f2c4";
/** Vite dev 会把 index.html 里的绝对路径重写到 base 下，需要同时兼容带/不带 base */
const BASE_PREFIX = "/assets/admin";
const SUPPORTED_LOCALES = new Set(["zh-CN", "zh-TW", "en-US", "ru-RU"]);

/* ------------------------------ HTTP 工具 ------------------------------ */
function send(res: ServerResponse, status: number, body: string, type: string) {
  res.statusCode = status;
  res.setHeader("Content-Type", type);
  res.end(body);
}

function sendJson(res: ServerResponse, payload: unknown, status = 200) {
  send(res, status, JSON.stringify(payload), "application/json; charset=utf-8");
}

function sendJs(res: ServerResponse, code: string) {
  send(res, 200, code, "application/javascript; charset=utf-8");
}

async function readBody(req: IncomingMessage): Promise<any> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

/* ------------------------------ 列表工具 ------------------------------ */
function pageParams(src: any) {
  return {
    current: Number(src?.current ?? src?.page ?? 1) || 1,
    pageSize: Number(src?.pageSize ?? src?.per_page ?? 20) || 20,
  };
}

function paginate<T>(list: T[], current = 1, pageSize = 20) {
  const perPage = Math.max(1, pageSize);
  const page = Math.max(1, current);
  const total = list.length;
  return {
    total,
    current_page: page,
    per_page: perPage,
    last_page: Math.max(1, Math.ceil(total / perPage) || 1),
    data: list.slice((page - 1) * perPage, (page - 1) * perPage + perPage),
  };
}

/** 按 search + filter[] 过滤，按 sort[] 排序（尽量贴近后端列表参数） */
function applyQuery<T extends Record<string, any>>(list: T[], body: any): T[] {
  let out = list;
  const search = body?.search;
  if (search) {
    const s = String(search).toLowerCase();
    out = out.filter((item) =>
      Object.values(item).some(
        (v) => typeof v === "string" && v.toLowerCase().includes(s),
      ),
    );
  }
  if (Array.isArray(body?.filter)) {
    for (const f of body.filter) {
      if (!f || f.value === undefined || f.value === null || f.value === "") continue;
      const needle = String(f.value).toLowerCase();
      out = out.filter((item) =>
        String(item[f.id] ?? "").toLowerCase().includes(needle),
      );
    }
  }
  if (Array.isArray(body?.sort) && body.sort.length) {
    const s = body.sort[0];
    out = [...out].sort((a, b) => {
      const r = a[s.id] > b[s.id] ? 1 : a[s.id] < b[s.id] ? -1 : 0;
      return s.desc ? -r : r;
    });
  }
  return out;
}

/* ------------------------------ API 路由 ------------------------------ */
async function handleApi(
  rest: string,
  url: URL,
  body: any,
): Promise<unknown> {
  const q = Object.fromEntries(url.searchParams.entries());

  /* ---- 登录 / 当前用户 ---- */
  if (rest === "passport/auth/login") {
    return { status: "success", data: { token: "mock-token", auth_data: "Bearer mock-token", is_admin: true } };
  }
  if (rest === "user/info") return db.users[0];

  /* ---- 仪表盘 / 统计 ---- */
  if (rest === "stat/getStats") return db.dashboardStats;
  if (rest === "stat/getOrder") {
    return db.orderStat(String(q.start_date ?? ""), String(q.end_date ?? ""));
  }
  if (rest === "stat/getTrafficRank") {
    return db.trafficRank(q.type === "user" ? "user" : "node");
  }
  if (rest === "stat/getRanking") return { data: [] };
  if (rest === "stat/getStatUser") return { data: [], total: 0 };
  if (rest === "stat/getOverride") return db.dashboardStats;

  /* ---- 系统 / 队列 ---- */
  if (rest === "system/getQueueStats") return db.queueStats;
  if (rest === "system/getQueueWorkload") return db.queueWorkload;
  if (rest === "system/getSystemStatus") {
    return { schedule: true, horizon: true, schedule_last_runtime: db.now };
  }
  if (rest === "system/getHorizonFailedJobs") return { data: [], total: 0, current: 1, page_size: 10 };
  if (rest === "system/getAuditLog") return { data: [], total: 0 };
  if (rest === "system/getQueueMasters") return [];
  if (rest === "system/getServerLastRank" || rest === "stat/getServerLastRank") return [];

  /* ---- 用户 ---- */
  if (rest === "user/fetch") {
    const { current, pageSize } = pageParams(body);
    return paginate(applyQuery(db.users, body), current, pageSize);
  }
  if (rest === "user/loginLogs") {
    const { current, pageSize } = pageParams(q);
    return paginate(db.loginLogsFor(Number(q.user_id) || 1), current, pageSize);
  }
  if (rest.startsWith("user/")) return true;

  /* ---- 订单 ---- */
  if (rest === "order/fetch") {
    const { current, pageSize } = pageParams(body);
    let list = applyQuery(db.orders, body);
    if (body?.is_commission) list = list.filter((o) => o.commission_balance > 0);
    return paginate(list, current, pageSize);
  }
  if (rest === "order/detail") return db.orders.find((o) => o.id === Number(body?.id)) ?? db.orders[0];
  if (rest.startsWith("order/")) return true;

  /* ---- 套餐 ---- */
  if (rest === "plan/fetch") {
    const { current, pageSize } = pageParams(q);
    const list = q.search
      ? db.plans.filter((p) => p.name.toLowerCase().includes(String(q.search).toLowerCase()))
      : db.plans;
    return paginate(list, current, pageSize);
  }
  if (rest.startsWith("plan/")) return true;

  /* ---- 工单 ---- */
  if (rest === "ticket/fetch") {
    const id = Number(body?.id ?? q.id);
    if (id) {
      const t = db.tickets.find((x) => x.id === id) ?? db.tickets[0];
      return { ...t, messages: [] };
    }
    const { current, pageSize } = pageParams(body ?? q);
    return paginate(applyQuery(db.tickets, body ?? q), current, pageSize);
  }
  if (rest.startsWith("ticket/")) return true;

  /* ---- 提现 ---- */
  if (rest === "withdrawal/fetch") {
    const { current, pageSize } = pageParams(body);
    return paginate(applyQuery(db.withdrawals, body), current, pageSize);
  }
  let m = rest.match(/^withdrawal\/(\d+)\/messages$/);
  if (m) {
    const w = db.withdrawals.find((x) => x.id === Number(m![1]));
    return { data: w?.messages ?? [] };
  }
  m = rest.match(/^withdrawal\/(\d+)\/reply$/);
  if (m) {
    return {
      data: {
        id: Date.now(),
        withdrawal_id: Number(m[1]),
        user_id: 1,
        sender: { id: 1, email: "admin@example.com" },
        message: String(body?.message ?? ""),
        is_admin: true,
        created_at: db.now,
      },
    };
  }
  if (rest.startsWith("withdrawal/")) return true;

  /* ---- 优惠券 ---- */
  if (rest === "coupon/fetch") {
    const { current, pageSize } = pageParams(body);
    return paginate(applyQuery(db.coupons, body), current, pageSize);
  }
  if (rest.startsWith("coupon/")) return true;

  /* ---- 公告 ---- */
  if (rest === "notice/fetch") {
    const { current, pageSize } = pageParams(q);
    return paginate(applyQuery(db.notices, q), current, pageSize);
  }
  if (rest === "notice/detail") return db.notices.find((n) => n.id === Number(q.id)) ?? db.notices[0];
  if (rest.startsWith("notice/")) return true;

  /* ---- 支付 ---- */
  if (rest === "payment/fetch") {
    const { current, pageSize } = pageParams(q);
    return paginate(applyQuery(db.payments, q), current, pageSize);
  }
  if (rest === "payment/getPaymentMethods") return { data: [] };
  if (rest === "payment/getPaymentForm") return { fields: [] };
  if (rest.startsWith("payment/")) return true;

  /* ---- 知识库 ---- */
  if (rest === "knowledge/fetch") {
    const id = Number(q.id);
    if (id) return db.knowledge.find((k) => k.id === id) ?? db.knowledge[0];
    const { current, pageSize } = pageParams(q);
    let list = applyQuery(db.knowledge, q);
    if (q.category && q.category !== "all") {
      list = list.filter((k) => k.category === q.category);
    }
    return paginate(list, current, pageSize);
  }
  if (rest === "knowledge/getCategory") return db.knowledgeCategories;
  if (rest.startsWith("knowledge/")) return true;

  /* ---- 礼品卡 ---- */
  if (rest === "gift-card/templates") {
    const { current, pageSize } = pageParams(q);
    return paginate(applyQuery(db.giftCardTemplates, q), current, pageSize);
  }
  if (rest === "gift-card/codes") {
    const { current, pageSize } = pageParams(q);
    return paginate(applyQuery(db.giftCardCodes, q), current, pageSize);
  }
  if (rest === "gift-card/usages") {
    const { current, pageSize } = pageParams(q);
    return paginate(applyQuery(db.giftCardUsages, q), current, pageSize);
  }
  if (rest === "gift-card/statistics") return db.giftCardStatistics;
  if (rest.startsWith("gift-card/")) return true;

  /* ---- 权限组 / 路由 / 协议 ---- */
  if (rest === "server/group/fetch") return db.groups;
  if (rest === "server/group/save") return true;
  if (rest === "server/route/fetch") return db.routes;
  if (rest === "server/route/save") return true;
  if (rest === "server/protocols/types") return db.protocolTypes;
  if (rest === "server/protocols/definitions") return db.protocolDefinitions;
  if (rest === "server/cert-template/fetch") return { data: [] };
  if (rest === "server/network-settings-template/fetch") return { data: [] };

  /* ---- 节点 ---- */
  if (rest === "server/manage/getNodes") {
    let list = db.nodes;
    if (q.search) {
      const s = String(q.search).toLowerCase();
      list = list.filter(
        (n) => n.name.toLowerCase().includes(s) || n.host.toLowerCase().includes(s),
      );
    }
    if (q.type && q.type !== "all") list = list.filter((n) => n.type === q.type);
    if (q.status !== undefined && q.status !== "" && q.status !== "all") {
      list = list.filter((n) => String(n.status) === String(q.status));
    }
    if (q.machine_id) list = list.filter((n) => String(n.machine_id) === String(q.machine_id));
    if (q.sort_by === "online") {
      list = [...list].sort((a, b) => (q.order === "asc" ? a.online - b.online : b.online - a.online));
    }
    const { current, pageSize } = pageParams(q);
    return paginate(list, current, pageSize);
  }
  if (rest === "server/manage/get-sort-nodes") {
    return db.nodes.map((n) => ({ id: n.id, name: n.name, sort: n.sort, type: n.type, parent_id: n.parent_id }));
  }
  if (/^server\/manage\/get-children\//.test(rest)) return [];
  if (/^server\/manage\/get-virtual-nodes\//.test(rest)) return { data: [] };
  if (rest.startsWith("server/manage/")) return true;

  /* ---- 机器 ---- */
  if (rest === "server/machine/fetch") {
    const { current, pageSize } = pageParams(q);
    let list = db.machines;
    if (q.search) {
      const s = String(q.search).toLowerCase();
      list = list.filter((m) => m.name.toLowerCase().includes(s));
    }
    if (q.status && q.status !== "all") {
      if (q.status === "online") list = list.filter((m) => m.is_online);
      else if (q.status === "offline") list = list.filter((m) => !m.is_online);
    }
    const paged = paginate(list, current, pageSize);
    return { ...paged, summary: db.machineSummary };
  }
  if (rest === "server/machine/history") {
    return { data: [], load_status: null, summary: {} };
  }
  if (rest === "server/machine/nodes") return { data: db.nodes.slice(0, 3) };
  if (rest === "server/machine/available-nodes") {
    const { current, pageSize } = pageParams(q);
    return paginate(db.nodes, current, pageSize);
  }
  if (rest === "server/machine/logs") {
    return {
      online: true,
      lines: [
        "[mock] fboard-node started",
        "[mock] xray core ready",
        "[mock] heartbeat sent",
      ],
      updated_at: db.now,
      stale: false,
    };
  }
  if (rest === "server/machine/getToken") return { token: "mock-machine-token" };
  if (rest === "server/machine/installCommand") {
    return { command: "curl -fsSL https://example.com/fboard-node/install.sh | bash -s -- --token mock-machine-token" };
  }
  if (rest === "server/machine/batchUpgrade") {
    return { submitted: db.machines.length, skipped: { inactive: 0, offline: 1 } };
  }
  if (rest.startsWith("server/machine/")) {
    return { submitted: true, machine_id: Number(body?.id) || 1 };
  }

  /* ---- 配置 ---- */
  if (rest === "config/fetch") {
    const key = String(q.key ?? "");
    if (key === "subscribe_template") {
      const out: Record<string, string> = {};
      for (const [name, content] of Object.entries(db.subscribeTemplates)) {
        out[`subscribe_template_${name}`] = content;
      }
      return { [key]: out };
    }
    return { [key]: {} };
  }
  if (rest.startsWith("config/")) return true;

  /* ---- 主题 ---- */
  if (rest === "theme/getThemes") return db.themes;
  if (rest === "theme/getThemeConfig") return {};
  if (rest.startsWith("theme/")) return true;

  /* ---- 插件（默认空列表，需要时在 data.ts 里补充） ---- */
  if (rest === "plugin/getPlugins") return { data: [] };
  if (rest === "plugin/types") return { data: [] };
  if (rest === "plugin/staticFiles") return { data: [] };
  if (rest === "plugin/readme") return { data: "# Mock 插件\n\n本地开发占位说明。" };

  /* ---- 后台 UI 扩展（与真实后端 /plugin/ui、/plugin/ui/nav 同形） ---- */
  if (rest === "plugin/ui") {
    const demoScript = "/plugins/extension_demo/admin.js";
    return {
      data: [
        {
          id: "extension_demo:demo_banner",
          name: "demo_banner",
          plugin: "extension_demo",
          slot: "content.before",
          page: ["dashboard", "user", "user/*"],
          priority: 20,
          title: null,
          type: "component",
          component: "DemoBanner",
          context: {},
          script: demoScript,
          style: null,
          html: null,
          url: null,
          label: null,
          action: null,
          params: {},
          confirm: null,
          variant: "default",
          icon: null,
          anchor: null,
        },
        {
          id: "extension_demo:demo_sync",
          name: "demo_sync",
          plugin: "extension_demo",
          slot: "page.actions",
          page: ["user", "user/*"],
          priority: 20,
          title: null,
          type: "button",
          component: "demo_sync",
          context: {},
          script: null,
          style: null,
          html: null,
          url: null,
          label: "同步演示数据",
          action: "sync_demo",
          params: { scope: "all" },
          confirm: "确认执行演示同步？",
          variant: "outline",
          icon: "RefreshCw",
          anchor: null,
        },
        {
          id: "extension_demo:demo_anchor",
          name: "demo_anchor",
          plugin: "extension_demo",
          slot: null,
          page: ["dashboard"],
          priority: 20,
          title: null,
          type: "html",
          component: "demo_anchor",
          context: {},
          script: null,
          style: null,
          html: '<div style="margin-top:8px;padding:8px 12px;border-radius:8px;background:hsl(var(--muted));font-size:12px;color:hsl(var(--muted-foreground));">这段内容通过 CSS 锚点注入到页面任意 DOM 位置。</div>',
          url: null,
          label: null,
          action: null,
          params: {},
          confirm: null,
          variant: "default",
          icon: null,
          anchor: { selector: "main h1", position: "after" },
        },
        {
          id: "extension_demo:demo_header_badge",
          name: "demo_header_badge",
          plugin: "extension_demo",
          slot: "header.actions",
          page: ["*"],
          priority: 20,
          title: null,
          type: "component",
          component: "DemoHeaderBadge",
          context: {},
          script: demoScript,
          style: null,
          html: null,
          url: null,
          label: null,
          action: null,
          params: {},
          confirm: null,
          variant: "default",
          icon: null,
          anchor: null,
        },
      ],
    };
  }
  if (rest === "plugin/ui/nav") {
    return {
      data: {
        menus: [
          {
            plugin: "extension_demo",
            path: "extension-demo",
            label: "扩展演示",
            i18nKey: "plugin.extension_demo.title",
            icon: "Blocks",
            group: "nav.systemManagement",
            groupLabel: null,
            order: 90,
            external: false,
            target: "_blank",
          },
          {
            plugin: "extension_demo",
            path: "extension-demo/child",
            label: "扩展演示子页",
            i18nKey: "plugin.extension_demo.child",
            icon: "Component",
            group: "nav.systemManagement",
            groupLabel: null,
            order: 91,
            external: false,
            target: "_blank",
          },
        ],
        pages: [
          {
            plugin: "extension_demo",
            path: "extension-demo",
            title: "扩展演示",
            type: "iframe",
            component: "",
            html: null,
            url: "/plugins/extension_demo/page.html",
            script: null,
            style: null,
            height: "calc(100vh - 8rem)",
          },
        ],
        i18n: {
          "zh-CN": { plugin: { extension_demo: { title: "扩展演示", child: "扩展演示子页" } } },
          "en-US": {
            plugin: { extension_demo: { title: "Extension Demo", child: "Extension Demo Child" } },
          },
        },
      },
    };
  }
  if (rest === "plugin/action") {
    return { message: `Mock 动作执行成功：${String(body?.action ?? "")}` };
  }

  if (rest.startsWith("plugin/")) return true;

  /* ---- 兜底 ---- */
  // eslint-disable-next-line no-console
  console.warn(`[mock] 未处理的接口: /${rest}`);
  return {};
}

/* ------------------------------ 插件实现 ------------------------------ */
export function createMockPlugin(root: string): Plugin {
  const localeCache = new Map<string, string>();

  async function localeJs(lang: string): Promise<string> {
    const cached = localeCache.get(lang);
    if (cached !== undefined) return cached;
    const file = path.join(root, "src/locales", `${lang}.ts`);
    if (!fs.existsSync(file)) return "";
    const { code } = await transform(fs.readFileSync(file, "utf8"), {
      loader: "ts",
      target: "es2020",
      format: "iife",
    });
    localeCache.set(lang, code);
    return code;
  }

  return {
    name: "fboard-mock-api",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url ?? "/", "http://localhost");
        // 归一化：去掉 base 前缀，兼容 Vite 对 index.html 绝对路径的重写
        let pathname = url.pathname;
        if (pathname === BASE_PREFIX) pathname = "/";
        else if (pathname.startsWith(`${BASE_PREFIX}/`)) pathname = pathname.slice(BASE_PREFIX.length);

        if (pathname === "/settings.js") {
          sendJs(
            res,
            `window.settings = ${JSON.stringify({
              base_url: "/",
              title: "Fboard Admin (Mock)",
              version: "dev-mock",
              logo: "",
              secure_path: SECURE_PATH,
            })};\n`,
          );
          return;
        }

        if (pathname === "/settings.local.js") {
          sendJs(res, "window.settings = window.settings || {};\n");
          return;
        }

        const localeMatch = pathname.match(/^\/locales\/([^/]+)\.js$/);
        if (localeMatch) {
          const lang = localeMatch[1];
          if (!SUPPORTED_LOCALES.has(lang)) {
            sendJs(res, "");
            return;
          }
          localeJs(lang)
            .then((code) => sendJs(res, code))
            .catch(() => sendJs(res, ""));
          return;
        }

        if (pathname.startsWith("/api/v2/")) {
          let rest = pathname.slice("/api/v2/".length).replace(/^\/+/, "");
          if (rest.startsWith(`${SECURE_PATH}/`)) rest = rest.slice(SECURE_PATH.length + 1);

          readBody(req)
            .then((body) => handleApi(rest, url, body))
            .then((payload) => sendJson(res, payload))
            .catch((err) => {
              // eslint-disable-next-line no-console
              console.error(`[mock] 处理失败 /${rest}:`, err);
              sendJson(res, { message: String(err) }, 500);
            });
          return;
        }

        // 插件静态资源：/plugins/{code}/... 映射到 ../Fboard/plugins/{Studly}/public/...
        const pluginAsset = pathname.match(/^\/plugins\/([a-z0-9_]+)\/(.+)$/);
        if (pluginAsset) {
          const code = pluginAsset[1];
          const rel = pluginAsset[2];
          const dir = code
            .split("_")
            .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
            .join("");
          const baseDir = path.resolve(root, "../Fboard/plugins", dir, "public");
          const file = path.resolve(baseDir, rel);
          if (
            file.startsWith(baseDir + path.sep) &&
            fs.existsSync(file) &&
            fs.statSync(file).isFile()
          ) {
            const ext = path.extname(file).toLowerCase();
            const mime =
              ext === ".js"
                ? "application/javascript; charset=utf-8"
                : ext === ".html"
                  ? "text/html; charset=utf-8"
                  : ext === ".css"
                    ? "text/css; charset=utf-8"
                    : ext === ".json"
                      ? "application/json; charset=utf-8"
                      : "application/octet-stream";
            send(res, 200, fs.readFileSync(file, "utf8"), mime);
            return;
          }
        }

        next();
      });
    },
  };
}
