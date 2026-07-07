import { getSecurePath } from "@/lib/api";

/** 后台安全路径作为路由前缀。生产环境从 window.settings.secure_path 注入，
 *  本地开发且未注入时默认 8be4f2c4（与目标站点一致）。 */
export const SECURE_PATH = getSecurePath();

/** 拼接后台绝对路径 */
export function adminPath(sub: string = ""): string {
  if (!sub) return "/";
  return `/${sub.replace(/^\//, "")}`;
}

/** 拼接后台 API 前缀下的资源 URL（用于导航到具体页面） */
export function pagePath(path: string): string {
  return adminPath(path);
}
