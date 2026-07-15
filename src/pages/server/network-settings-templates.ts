/** 前端内置网络设置模板（只读，不入库） */
export interface BuiltinNetworkSettingsTemplate {
  id: string;
  name: string;
  description?: string;
  network?: string;
  settings: Record<string, any>;
  builtin: true;
}

const BUILTIN: BuiltinNetworkSettingsTemplate[] = [
  {
    id: "ws-basic",
    name: "WebSocket 基础",
    description: "path + Host",
    network: "ws",
    builtin: true,
    settings: {
      path: "/",
      headers: {
        Host: "example.com",
      },
    },
  },
  {
    id: "ws-cdn",
    name: "WebSocket + CDN",
    description: "适合 Cloudflare 等 CDN",
    network: "ws",
    builtin: true,
    settings: {
      path: "/ws",
      headers: {
        Host: "cdn.example.com",
      },
    },
  },
  {
    id: "grpc-basic",
    name: "gRPC 基础",
    description: "serviceName",
    network: "grpc",
    builtin: true,
    settings: {
      serviceName: "GunService",
    },
  },
  {
    id: "grpc-multi",
    name: "gRPC multiMode",
    description: "开启 multiMode",
    network: "grpc",
    builtin: true,
    settings: {
      serviceName: "GunService",
      multiMode: true,
    },
  },
  {
    id: "http-basic",
    name: "HTTP/2 基础",
    description: "path + host",
    network: "http",
    builtin: true,
    settings: {
      path: "/",
      host: ["example.com"],
    },
  },
  {
    id: "tcp-none",
    name: "TCP 无伪装",
    description: "纯 TCP",
    network: "tcp",
    builtin: true,
    settings: {
      header: {
        type: "none",
      },
    },
  },
  {
    id: "tcp-http",
    name: "TCP HTTP 伪装",
    description: "header type = http",
    network: "tcp",
    builtin: true,
    settings: {
      header: {
        type: "http",
        request: {
          path: ["/"],
          headers: {
            Host: ["example.com"],
          },
        },
      },
    },
  },
  {
    id: "xhttp-basic",
    name: "XHTTP 基础",
    description: "path 模式",
    network: "xhttp",
    builtin: true,
    settings: {
      path: "/",
      mode: "auto",
    },
  },
  {
    id: "quic-basic",
    name: "QUIC 基础",
    description: "security + key",
    network: "quic",
    builtin: true,
    settings: {
      security: "none",
      key: "",
      header: {
        type: "none",
      },
    },
  },
  {
    id: "kcp-basic",
    name: "KCP 基础",
    description: "mtu / tti 默认",
    network: "kcp",
    builtin: true,
    settings: {
      mtu: 1350,
      tti: 50,
      uplinkCapacity: 5,
      downlinkCapacity: 20,
      congestion: false,
      header: {
        type: "none",
      },
    },
  },
];

export function listBuiltinNetworkSettingsTemplates(
  network?: string | null,
): BuiltinNetworkSettingsTemplate[] {
  if (!network) return BUILTIN;
  return BUILTIN.filter((t) => !t.network || t.network === network);
}
