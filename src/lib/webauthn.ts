/**
 * WebAuthn 可用性检测。
 *
 * 浏览器硬性要求：Passkey 只能在安全上下文（HTTPS 或 localhost）中使用。
 * 通过 http://内网IP 访问时 navigator.credentials 存在，但调用必然失败，
 * 因此需要在发起前提前判断并给出明确提示。
 */

export type WebAuthnUnavailableReason = "insecure" | "unsupported" | null;

function isLocalHost(host: string): boolean {
  return ["localhost", "127.0.0.1", "::1", "[::1]"].includes(host);
}

export function webAuthnUnavailableReason(): WebAuthnUnavailableReason {
  if (typeof window === "undefined") return "unsupported";
  if (!window.isSecureContext && !isLocalHost(window.location.hostname)) {
    return "insecure";
  }
  if (typeof window.PublicKeyCredential === "undefined") {
    return "unsupported";
  }
  return null;
}

/** 把 WebAuthn 抛出的异常转成可展示的提示 key（调用方负责翻译） */
export function describeWebAuthnError(err: any): {
  key: string;
  fallback: string;
  raw?: string;
} {
  const name = err?.name || "";
  if (name === "NotAllowedError") {
    return { key: "auth.passkey.errors.cancelled", fallback: "验证已取消或超时，请重试" };
  }
  if (name === "SecurityError") {
    return {
      key: "auth.passkey.errors.insecure",
      fallback: "当前访问地址不允许使用 Passkey，请改用 HTTPS 域名或 localhost 访问",
    };
  }
  if (name === "NotSupportedError") {
    return { key: "auth.passkey.errors.unsupported", fallback: "当前浏览器或设备不支持 Passkey" };
  }
  if (name === "InvalidStateError") {
    return {
      key: "auth.passkey.errors.exists",
      fallback: "该设备已经绑定过 Passkey，请换一台设备或删除后重试",
    };
  }
  const msg = typeof err?.message === "string" ? err.message : "";
  if (msg) {
    return { key: "", fallback: msg, raw: msg };
  }
  return { key: "auth.passkey.errors.failed", fallback: "Passkey 操作失败，请重试" };
}
