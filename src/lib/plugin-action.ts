/**
 * 插件动作（Plugin Action）通用约定
 *
 * 任意插件的 registerAction 结果 / 动作元数据都可走这套副作用处理，
 * 管理后台不写死某个插件名。
 *
 * ## 动作元数据（后端 registerAction options → 前端 act）
 * - type?: 'default' | 'link'
 * - url?: string          // type=link 时的目标地址
 * - target?: '_blank' | '_self'
 * - confirm?: string | null
 * - icon / color / label / name
 *
 * ## 动作执行返回体（handler return / API data）
 * - success?: boolean
 * - message?: string
 * - open_url | url?: string   // 打开链接
 * - target?: '_blank' | '_self'
 * - reload?: boolean          // 是否刷新插件列表
 * - copy_text?: string        // 复制到剪贴板
 * - download_url?: string     // 触发下载
 */

export type PluginActionTarget = "_blank" | "_self";

/** 后端 registerAction 暴露给前端的动作元数据 */
export interface PluginActionMeta {
  name: string;
  label: string;
  icon?: string;
  confirm?: string | null;
  color?: "default" | "destructive" | "outline" | string;
  /** default: 调 API 执行 handler；link: 可直接打开 url（也可仍调 API） */
  type?: "default" | "link" | string;
  /** type=link 时的静态地址；handler 也可动态返回 url */
  url?: string;
  target?: PluginActionTarget;
}

/** handler / API 返回的统一结果 */
export interface PluginActionResult {
  success?: boolean;
  message?: string;
  /** 打开页面（推荐字段） */
  open_url?: string;
  /** open_url 的别名，兼容旧插件 */
  url?: string;
  target?: PluginActionTarget;
  /** 为 true 时刷新插件列表等 */
  reload?: boolean;
  /** 复制文本到剪贴板 */
  copy_text?: string;
  /** 触发文件/链接下载 */
  download_url?: string;
  [k: string]: unknown;
}

export interface ApplyPluginActionOptions {
  /** toast 成功文案；默认用 result.message */
  fallbackMessage?: string;
  /** 是否在成功后默认 reload（可被 result.reload 覆盖） */
  defaultReload?: boolean;
  onReload?: () => void;
  onToastSuccess?: (message: string) => void;
  onToastError?: (message: string) => void;
}

/**
 * 从 adminPost 解包后的响应中提取动作结果体。
 * 兼容：
 * - 已解包动作结果：{ message, open_url, success, ... }
 * - API 信封：{ message, data: { open_url, ... } }
 * - 历史误用：动作结果里又塞了 data 业务字段（不应覆盖顶层 message）
 */
export function unwrapPluginActionResponse(res: unknown): PluginActionResult {
  if (!res || typeof res !== "object") {
    return {};
  }
  const r = res as Record<string, unknown>;
  const nested =
    r.data && typeof r.data === "object" && !Array.isArray(r.data)
      ? (r.data as Record<string, unknown>)
      : null;

  // 顶层已是动作结果（含 message / open_url / success 等）时，以顶层为准；
  // 仅把嵌套 data 中「顶层没有的」字段补进去，避免 data 吞掉 message。
  const looksLikeActionResult =
    typeof r.message === "string" ||
    typeof r.open_url === "string" ||
    typeof r.url === "string" ||
    typeof r.success === "boolean" ||
    typeof r.copy_text === "string" ||
    typeof r.download_url === "string";

  if (nested && !looksLikeActionResult) {
    return {
      ...(nested as PluginActionResult),
      message:
        (typeof nested.message === "string" && nested.message) ||
        (typeof r.message === "string" ? r.message : undefined),
    };
  }

  if (nested && looksLikeActionResult) {
    const merged: PluginActionResult = { ...(r as PluginActionResult) };
    // 不覆盖已有的标准字段
    for (const [k, v] of Object.entries(nested)) {
      if (merged[k] === undefined) {
        merged[k] = v;
      }
    }
    // 显式保证 message 优先顶层
    if (typeof r.message === "string" && r.message) {
      merged.message = r.message;
    }
    return merged;
  }

  return r as PluginActionResult;
}

/**
 * 解析「要打开的 URL」：结果体优先，其次动作元数据（link 类型）
 */
export function resolvePluginActionUrl(
  result: PluginActionResult,
  meta?: Pick<PluginActionMeta, "url" | "type">
): string | null {
  const fromResult = result.open_url || result.url;
  if (typeof fromResult === "string" && fromResult.trim()) {
    return fromResult.trim();
  }
  if (meta?.type === "link" && typeof meta.url === "string" && meta.url.trim()) {
    return meta.url.trim();
  }
  return null;
}

/**
 * 应用插件动作副作用（通用，与具体插件无关）
 * @returns 实际展示的成功文案
 */
export function applyPluginActionResult(
  result: PluginActionResult,
  meta?: PluginActionMeta,
  options: ApplyPluginActionOptions = {}
): string {
  const {
    fallbackMessage = "执行成功",
    defaultReload = true,
    onReload,
    onToastSuccess,
    onToastError,
  } = options;

  // message 允许为空串时回退；也兼容嵌套 status.message
  const nestedStatusMsg =
    result.update_status &&
    typeof result.update_status === "object" &&
    typeof (result.update_status as { message?: unknown }).message === "string"
      ? (result.update_status as { message: string }).message
      : "";

  const message =
    (typeof result.message === "string" && result.message.trim()) ||
    (nestedStatusMsg && nestedStatusMsg.trim()) ||
    fallbackMessage;

  const isError = result.success === false;

  const target: PluginActionTarget =
    result.target || meta?.target || "_blank";

  // 1) 打开链接
  const url = resolvePluginActionUrl(result, meta);
  if (url) {
    if (target === "_self") {
      window.location.assign(url);
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  // 2) 下载
  if (typeof result.download_url === "string" && result.download_url) {
    const a = document.createElement("a");
    a.href = result.download_url;
    a.rel = "noopener noreferrer";
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // 3) 复制
  if (typeof result.copy_text === "string" && result.copy_text) {
    void navigator.clipboard?.writeText(result.copy_text).catch(() => {
      /* ignore */
    });
  }

  // 4) 刷新
  const shouldReload =
    typeof result.reload === "boolean" ? result.reload : defaultReload;
  if (shouldReload) {
    onReload?.();
  }

  // 5) 提示：必须有反馈（成功 / 失败）
  if (isError) {
    onToastError?.(message);
  } else {
    onToastSuccess?.(message);
  }
  return message;
}

/**
 * type=link 且带静态 url 时，可跳过 API，直接用元数据构造结果
 */
export function buildLinkActionResult(
  meta: PluginActionMeta
): PluginActionResult | null {
  if (meta.type !== "link" || !meta.url) {
    return null;
  }
  return {
    success: true,
    message: meta.label || "已打开",
    open_url: meta.url,
    target: meta.target || "_blank",
    // 纯打开链接一般不需要刷新插件列表
    reload: false,
  };
}
