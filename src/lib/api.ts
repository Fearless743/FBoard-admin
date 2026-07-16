import { toast } from "sonner";

const API_PREFIX = "/api/v2";
const STORAGE_AUTH = "fboard-admin-auth";
const STORAGE_USER = "fboard-admin-user";

export function getSecurePath(): string {
  return window.settings?.secure_path || "";
}

export function getAuth(): string | null {
  return localStorage.getItem(STORAGE_AUTH);
}

export function setAuth(token: string) {
  localStorage.setItem(STORAGE_AUTH, token);
}

export function clearAuth() {
  localStorage.removeItem(STORAGE_AUTH);
  localStorage.removeItem(STORAGE_USER);
}

export function setAuthUser(user: any) {
  localStorage.setItem(STORAGE_USER, JSON.stringify(user));
}

export function getAuthUser(): any | null {
  try {
    const raw = localStorage.getItem(STORAGE_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function translateErrorMsg(msg: string): string {
  const map: Record<string, string> = {
    Unauthorized: "未授权，请重新登录",
    "email or password is incorrect": "邮箱或密码错误",
    "Email or password is incorrect": "邮箱或密码错误",
    "The given data was invalid": "提交的数据有误，请检查输入",
    "操作成功": "操作成功",
  };
  return map[msg] || msg;
}

async function request<T = any>(method: string, url: string, body?: any, params?: any): Promise<T> {
  const query = params ? "?" + new URLSearchParams(params).toString() : "";
  const auth = getAuth();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) headers["Authorization"] = auth;

  try {
    const res = await fetch(`${API_PREFIX}${url}${query}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();
    let json: any;
    try {
      json = JSON.parse(text);
    } catch {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return text as any;
    }

    if (!res.ok) {
      const msg = json?.message || json?.error?.message || `HTTP ${res.status}`;
      if (res.status === 401) {
        clearAuth();
        const path = getSecurePath();
        if (!location.pathname.includes(`/${path}/login`)) {
          toast.error("登录已过期，请重新登录");
          setTimeout(() => { location.href = `/${path}/login`; }, 500);
        }
      } else if (res.status !== 404 && res.status !== 422) {
        toast.error(translateErrorMsg(msg));
      }
      throw new Error(msg);
    }

    // Compat: passport-style { status: "success", data, message }
    if (typeof json === "object" && "status" in json && "data" in json) {
      if (json.status !== "success") {
        const msg = json.message || "请求失败";
        toast.error(translateErrorMsg(msg));
        throw new Error(msg);
      }
      return json.data as T;
    }

    // Auto-unwrap { data: X } wrapper
    if (typeof json === "object" && "data" in json && json.data && typeof json.data === "object" && !Array.isArray(json.data)) {
      return json.data as T;
    }

    return json as T;
  } catch (err: any) {
    if (err.name !== "Error" || !err.message.startsWith("HTTP")) {
      const msg = err.message || "网络错误";
      if (msg !== "登录已过期，请重新登录") {
        toast.error(translateErrorMsg(msg));
      }
    }
    throw err;
  }
}

export async function get<T = any>(url: string, params?: any): Promise<T> {
  return request<T>("GET", url, undefined, params);
}

export async function post<T = any>(url: string, data?: any): Promise<T> {
  return request<T>("POST", url, data);
}

/** 上传文件（FormData），不设置 JSON Content-Type */
export async function upload<T = any>(url: string, formData: FormData): Promise<T> {
  const query = "";
  const auth = getAuth();
  const headers: Record<string, string> = {};
  if (auth) headers["Authorization"] = auth;

  try {
    const res = await fetch(`${API_PREFIX}${url}${query}`, {
      method: "POST",
      headers,
      body: formData,
    });

    const text = await res.text();
    let json: any;
    try {
      json = JSON.parse(text);
    } catch {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return text as any;
    }

    if (!res.ok) {
      const msg = json?.message || json?.error?.message || `HTTP ${res.status}`;
      if (res.status === 401) {
        clearAuth();
        const path = getSecurePath();
        if (!location.pathname.includes(`/${path}/login`)) {
          toast.error("登录已过期，请重新登录");
          setTimeout(() => { location.href = `/${path}/login`; }, 500);
        }
      } else if (res.status !== 404 && res.status !== 422) {
        toast.error(translateErrorMsg(msg));
      }
      throw new Error(msg);
    }

    if (typeof json === "object" && "status" in json && "data" in json) {
      if (json.status !== "success") {
        const msg = json.message || "请求失败";
        toast.error(translateErrorMsg(msg));
        throw new Error(msg);
      }
      return json.data as T;
    }

    return json as T;
  } catch (err: any) {
    if (err.name !== "Error" || !err.message.startsWith("HTTP")) {
      const msg = err.message || "网络错误";
      if (msg !== "登录已过期，请重新登录") {
        toast.error(translateErrorMsg(msg));
      }
    }
    throw err;
  }
}
