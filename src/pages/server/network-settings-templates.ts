/** 前端内置网络设置模板（只读，不入库） */
export interface BuiltinNetworkSettingsTemplate {
  id: string;
  /** i18n key under server.network_settings.builtin_templates.<id>.name */
  nameKey: string;
  /** i18n key under server.network_settings.builtin_templates.<id>.description */
  descriptionKey: string;
  network?: string;
  settings: Record<string, any>;
  builtin: true;
}

function builtin(
  id: string,
  network: string,
  settings: Record<string, any>,
): BuiltinNetworkSettingsTemplate {
  return {
    id,
    nameKey: `server.network_settings.builtin_templates.${id}.name`,
    descriptionKey: `server.network_settings.builtin_templates.${id}.description`,
    network,
    builtin: true,
    settings,
  };
}

const BUILTIN: BuiltinNetworkSettingsTemplate[] = [
  builtin("ws-basic", "ws", {
    path: "/",
    headers: {
      Host: "example.com",
    },
  }),
  builtin("ws-cdn", "ws", {
    path: "/ws",
    headers: {
      Host: "cdn.example.com",
    },
  }),
  builtin("grpc-basic", "grpc", {
    serviceName: "GunService",
  }),
  builtin("grpc-multi", "grpc", {
    serviceName: "GunService",
    multiMode: true,
  }),
  builtin("http-basic", "http", {
    path: "/",
    host: ["example.com"],
  }),
  builtin("tcp-none", "tcp", {
    header: {
      type: "none",
    },
  }),
  builtin("tcp-http", "tcp", {
    header: {
      type: "http",
      request: {
        path: ["/"],
        headers: {
          Host: ["example.com"],
        },
      },
    },
  }),
  builtin("xhttp-basic", "xhttp", {
    path: "/",
    mode: "auto",
  }),
  builtin("quic-basic", "quic", {
    security: "none",
    key: "",
    header: {
      type: "none",
    },
  }),
  builtin("kcp-basic", "kcp", {
    mtu: 1350,
    tti: 50,
    uplinkCapacity: 5,
    downlinkCapacity: 20,
    congestion: false,
    header: {
      type: "none",
    },
  }),
];

export function listBuiltinNetworkSettingsTemplates(
  network?: string | null,
): BuiltinNetworkSettingsTemplate[] {
  if (!network) return BUILTIN;
  return BUILTIN.filter((t) => !t.network || t.network === network);
}
