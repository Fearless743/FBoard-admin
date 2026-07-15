export interface NetworkTemplate {
  id: string;
  label: string;
  description: string;
  protocol_settings: Record<string, any>;
}

const TEMPLATES: Record<string, NetworkTemplate[]> = {
  vless: [
    {
      id: "vless-tcp-vision",
      label: "TCP + XTLS Vision",
      description: "VLESS + TCP + XTLS Vision 直连，速度极快, 推荐",
      protocol_settings: {
        network: "tcp",
        tls: true,
        flow: "xtls-rprx-vision",
        fingerprint: "chrome",
      },
    },
    {
      id: "vless-ws-tls",
      label: "WebSocket + TLS + CDN",
      description: "VLESS + WebSocket + TLS，可套 CDN (Cloudflare 等)",
      protocol_settings: {
        network: "ws",
        tls: true,
        "ws-opts.max-early-data": 2048,
        "ws-opts.early-data-header-name": "Sec-WebSocket-Protocol",
      },
    },
    {
      id: "vless-grpc-tls",
      label: "gRPC + TLS",
      description: "VLESS + gRPC + TLS，适合大规模负载",
      protocol_settings: {
        network: "grpc",
        tls: true,
        "grpc-opts.grpcmode": "multi",
      },
    },
    {
      id: "vless-tcp-reality",
      label: "TCP + REALITY",
      description: "VLESS + REALITY 直连，无需证书，防主动探测",
      protocol_settings: {
        network: "tcp",
        tls: false,
        flow: "",
        reality: true,
      },
    },
  ],
  trojan: [
    {
      id: "trojan-tls",
      label: "Trojan + TLS",
      description: "标准 Trojan + TLS，端口 443",
      protocol_settings: {
        network: "tcp",
        tls: true,
      },
    },
    {
      id: "trojan-ws-tls",
      label: "Trojan + WebSocket + TLS",
      description: "Trojan + WebSocket + TLS，可套 CDN",
      protocol_settings: {
        network: "ws",
        tls: true,
      },
    },
  ],
  shadowsocks: [
    {
      id: "ss-simple",
      label: "标准 AEAD",
      description: "Shadowsocks 加密隧道，简洁高效",
      protocol_settings: {},
    },
  ],
  hysteria: [
    {
      id: "hy-standard",
      label: "Hysteria 标准",
      description: "Hysteria 基于 QUIC，抗丢包，适合弱网",
      protocol_settings: {
        protocol: "udp",
        network: "udp",
      },
    },
    {
      id: "hy-brutal",
      label: "Hysteria2 Brute",
      description: "Hysteria2 + Brute 模式，极高带宽利用",
      protocol_settings: {
        protocol: "udp",
        network: "udp",
        obfs: "",
      },
    },
  ],
  tuic: [
    {
      id: "tuic-v5",
      label: "TUIC v5 标准",
      description: "TUIC v5 基于 QUIC，低延迟",
      protocol_settings: {
        protocol: "v5",
        network: "udp",
      },
    },
  ],
  anytls: [
    {
      id: "anytls-default",
      label: "AnyTLS 默认",
      description: "AnyTLS 自动化 TLS 伪装",
      protocol_settings: {},
    },
  ],
  sudoku: [
    {
      id: "sudoku-default",
      label: "Sudoku 默认",
      description: "低熵表 + ChaCha20 + legacy HTTPMask",
      protocol_settings: {
        aead_method: "chacha20-poly1305",
        padding_min: 5,
        padding_max: 15,
        table_type: "prefer_entropy",
        enable_pure_downlink: true,
        handshake_timeout: 5,
        multiplex: "off",
        httpmask: { disable: false, mode: "legacy" },
      },
    },
  ],
};

export function getTemplatesForProtocol(type: string): NetworkTemplate[] {
  return TEMPLATES[type] || [];
}