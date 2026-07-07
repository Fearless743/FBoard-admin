import { getSecurePath } from "@/lib/api";
import { get, post } from "@/lib/api";

/** 与安全路径绑定的请求：admin 接口实际位于 /api/v2/{secure_path}/... */
const secure = () => `/${getSecurePath()}`;

/** admin GET：直接返回 data payload（admin 接口不带 status 包装） */
export async function adminGet<T = any>(path: string, params?: any): Promise<T> {
  return get<T>(`${secure()}${path}`, params);
}

/** admin POST */
export async function adminPost<T = any>(path: string, data?: any): Promise<T> {
  return post<T>(`${secure()}${path}`, data);
}
