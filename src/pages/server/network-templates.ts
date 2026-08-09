export interface NetworkTemplate {
  id: string;
  /** i18n key under server.networkTemplate.presets.<id>.label */
  labelKey: string;
  /** i18n key under server.networkTemplate.presets.<id>.description */
  descriptionKey: string;
  protocol_settings: Record<string, any>;
}

function preset(id: string, protocol_settings: Record<string, any>): NetworkTemplate {
  return {
    id,
    labelKey: `server.networkTemplate.presets.${id}.label`,
    descriptionKey: `server.networkTemplate.presets.${id}.description`,
    protocol_settings,
  };
}

const TEMPLATES: Record<string, NetworkTemplate[]> = {
  vless: [
    preset("vless-tcp-vision", {
      network: "tcp",
      tls: true,
      flow: "xtls-rprx-vision",
      fingerprint: "chrome",
    }),
    preset("vless-ws-tls", {
      network: "ws",
      tls: true,
      "ws-opts.max-early-data": 2048,
      "ws-opts.early-data-header-name": "Sec-WebSocket-Protocol",
    }),
    preset("vless-grpc-tls", {
      network: "grpc",
      tls: true,
      "grpc-opts.grpcmode": "multi",
    }),
    preset("vless-tcp-reality", {
      network: "tcp",
      tls: false,
      flow: "",
      reality: true,
    }),
  ],
  trojan: [
    preset("trojan-tls", {
      network: "tcp",
      tls: true,
    }),
    preset("trojan-ws-tls", {
      network: "ws",
      tls: true,
    }),
  ],
  shadowsocks: [
    preset("ss-simple", {}),
  ],
  hysteria: [
    preset("hy-standard", {
      protocol: "udp",
      network: "udp",
    }),
    preset("hy-brutal", {
      protocol: "udp",
      network: "udp",
      obfs: "",
    }),
  ],
  tuic: [
    preset("tuic-v5", {
      protocol: "v5",
      network: "udp",
    }),
  ],
  anytls: [
    preset("anytls-default", {}),
  ],
  sudoku: [
    preset("sudoku-default", {
      aead_method: "chacha20-poly1305",
      padding_min: 5,
      padding_max: 15,
      table_type: "prefer_entropy",
      enable_pure_downlink: true,
      handshake_timeout: 5,
      httpmask: { disable: false, mode: "legacy" },
    }),
  ],
  shadowquic: [
    preset("shadowquic-default", {
      jls_upstream: "www.cloudflare.com:443",
      server_name: "www.cloudflare.com",
      alpn: ["h3"],
      congestion_control: "bbr",
      zero_rtt: true,
      udp_over_stream: false,
    }),
  ],
};

export function getTemplatesForProtocol(type: string): NetworkTemplate[] {
  return TEMPLATES[type] || [];
}
