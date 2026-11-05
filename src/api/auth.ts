import { get, post } from "@/lib/api";

/** 登录请求 */
export interface LoginPayload {
  email: string;
  password: string;
}

/** 登录返回：
 *  - 非管理员：{ token, auth_data, is_admin }
 *  - 管理员（强制 Passkey 二步）：{ passkey_required: true, ticket, passkey_setup_required? }
 */
export interface LoginResult {
  token?: string;
  auth_data?: string;
  is_admin?: boolean;
  passkey_required?: boolean;
  passkey_setup_required?: boolean;
  ticket?: string;
}

export async function login(payload: LoginPayload): Promise<LoginResult> {
  return post<LoginResult>("/passport/auth/login", payload);
}

/** 获取当前用户信息 */
export async function getCurrentUser() {
  return get<any>("/user/info");
}
