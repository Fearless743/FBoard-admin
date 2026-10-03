# 本地 mock 后端

无需启动 Laravel / 数据库，直接跑前端开发：

```bash
bun run dev:mock
# 打开 http://localhost:5173/assets/admin/
# 登录：任意合法邮箱 + 任意密码（如 admin@example.com / 123456）
```

它由 `vite --mode mock` 启用，通过 Vite dev 中间件在进程内响应：

| 路径 | 说明 |
|------|------|
| `/settings.js`、`/settings.local.js` | 注入 `window.settings`（含 `secure_path`） |
| `/locales/<lang>.js` | 由 `src/locales/*.ts` 实时编译（esbuild），无需构建 |
| `/api/v2/**` | 由 `mock/data.ts` 的内存数据响应 |

## 特点

- **零依赖**：不需要 MSW / json-server，也不改任何业务代码。
- **不泄漏**：`createMockPlugin` 仅在 `mode === "mock"` 时动态加载，`apply: "serve"`，生产构建不包含任何 mock 代码（已在构建产物中确认）。
- **自动重启**：修改 `mock/*.ts` 时 Vite 会重启 dev server，刷新即可看到新数据。
- **内存数据**：进程重启后数据重置；增删改接口多为空操作（返回成功），不会真正落库。

## 目录

- `data.ts` —— 所有测试数据（用户 / 订单 / 套餐 / 节点 / 机器 / 工单 / 优惠券 / 礼品卡 / 知识库 / 统计等）。
- `server.ts` —— HTTP 中间件与 `/api/v2/**` 路由。

## 扩展方式

1. 在 `data.ts` 里加数据，并在 `db` 中导出。
2. 在 `server.ts` 的 `handleApi` 中加一条 `if (rest === "...") return ...;`。
   未命中的接口会在终端打印 `[mock] 未处理的接口: /...`，兜底返回 `{}`。

## 注意

`window.settings.secure_path` 固定为 `8be4f2c4`，因此接口实际请求
`/api/v2/8be4f2c4/...`；中间件会自动剥离该前缀。若修改，请同步
`server.ts` 顶部的 `SECURE_PATH`。
