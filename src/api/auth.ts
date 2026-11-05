import { get, post } from "@/lib/api";

/** 登录请求 */
export interface LoginPayload {
  email: string;
  password: string;
}

/** 登录返回：{ token, auth_data, is_admin }
 *  - token:     token 名（仅作标识）
 *  - auth_data: 完整的 Authorization 值，形如 "Bearer xxx"
 *  - is_admin:  是否管理员
 */
export interface LoginResult {
  token: string;
  auth_data: string;
  is_admin: boolean;
}

export async function login(payload: LoginPayload): Promise<LoginResult> {
  return post<LoginResult>("/passport/auth/login", payload);
}

/** 获取当前用户信息 */
export async function getCurrentUser() {
  return get<any>("/user/info");
}
