/**
 * 生成官方 mieru Traffic Pattern 的 Base64 串。
 * 线格式与 github.com/enfein/mieru/v3/apis/trafficpattern.Encode 一致
 *（protobuf TrafficPattern → base64.StdEncoding）。
 *
 * message TrafficPattern {
 *   optional int32 seed = 1;
 *   optional bool unlockAll = 2;
 *   optional TCPFragment tcpFragment = 3;
 *   optional NoncePattern nonce = 4;
 *   optional PaddingPattern padding = 5;
 *   optional LowEntropyPattern lowEntropy = 6;
 * }
 */

/** NonceType：与 mieru appctlpb.NonceType 对齐 */
export const NONCE_TYPE = {
  RANDOM: 0,
  PRINTABLE: 1,
  PRINTABLE_SUBSET: 2,
  FIXED: 3,
  NONCE_TYPE_RANDOM: 0,
  NONCE_TYPE_PRINTABLE: 1,
  NONCE_TYPE_PRINTABLE_SUBSET: 2,
  NONCE_TYPE_FIXED: 3,
} as const;

/** LowEntropyMode：与 mieru appctlpb.LowEntropyMode 对齐 */
export const LOW_ENTROPY_MODE = {
  OFF: 0,
  MODE_32: 1,
  MODE_40: 2,
  MODE_48: 3,
  MODE_56: 4,
  LOW_ENTROPY_MODE_OFF: 0,
  LOW_ENTROPY_MODE_32: 1,
  LOW_ENTROPY_MODE_40: 2,
  LOW_ENTROPY_MODE_48: 3,
  LOW_ENTROPY_MODE_56: 4,
} as const;

/** LowEntropyMaskRotation：与 mieru appctlpb.LowEntropyMaskRotation 对齐 */
export const LOW_ENTROPY_MASK_ROTATION = {
  NO_ROTATION: 0,
  ROTATE_RIGHT_1: 1,
  ROTATE_RIGHT_2: 2,
  ROTATE_RIGHT_3: 3,
  ROTATE_RIGHT_4: 4,
  ROTATE_RIGHT_5: 5,
  ROTATE_RIGHT_6: 6,
  ROTATE_RIGHT_7: 7,
  ROTATE_RIGHT_8: 8,
  ROTATE_RIGHT_9: 9,
  ROTATE_RIGHT_10: 10,
  ROTATE_RIGHT_11: 11,
  ROTATE_RIGHT_12: 12,
  ROTATE_RIGHT_13: 13,
  ROTATE_RIGHT_14: 14,
  ROTATE_RIGHT_15: 15,
  ROTATE_LEFT_1: 16,
  ROTATE_LEFT_2: 32,
  ROTATE_LEFT_3: 48,
  ROTATE_LEFT_4: 64,
  ROTATE_LEFT_5: 80,
  ROTATE_LEFT_6: 96,
  ROTATE_LEFT_7: 112,
  ROTATE_LEFT_8: 128,
  ROTATE_LEFT_9: 144,
  ROTATE_LEFT_10: 160,
  ROTATE_LEFT_11: 176,
  ROTATE_LEFT_12: 192,
  ROTATE_LEFT_13: 208,
  ROTATE_LEFT_14: 224,
  ROTATE_LEFT_15: 240,
  LOW_ENTROPY_MASK_NO_ROTATION: 0,
  LOW_ENTROPY_MASK_ROTATE_RIGHT_1: 1,
  LOW_ENTROPY_MASK_ROTATE_RIGHT_2: 2,
  LOW_ENTROPY_MASK_ROTATE_RIGHT_3: 3,
  LOW_ENTROPY_MASK_ROTATE_RIGHT_4: 4,
  LOW_ENTROPY_MASK_ROTATE_RIGHT_5: 5,
  LOW_ENTROPY_MASK_ROTATE_RIGHT_6: 6,
  LOW_ENTROPY_MASK_ROTATE_RIGHT_7: 7,
  LOW_ENTROPY_MASK_ROTATE_RIGHT_8: 8,
  LOW_ENTROPY_MASK_ROTATE_RIGHT_9: 9,
  LOW_ENTROPY_MASK_ROTATE_RIGHT_10: 10,
  LOW_ENTROPY_MASK_ROTATE_RIGHT_11: 11,
  LOW_ENTROPY_MASK_ROTATE_RIGHT_12: 12,
  LOW_ENTROPY_MASK_ROTATE_RIGHT_13: 13,
  LOW_ENTROPY_MASK_ROTATE_RIGHT_14: 14,
  LOW_ENTROPY_MASK_ROTATE_RIGHT_15: 15,
  LOW_ENTROPY_MASK_ROTATE_LEFT_1: 16,
  LOW_ENTROPY_MASK_ROTATE_LEFT_2: 32,
  LOW_ENTROPY_MASK_ROTATE_LEFT_3: 48,
  LOW_ENTROPY_MASK_ROTATE_LEFT_4: 64,
  LOW_ENTROPY_MASK_ROTATE_LEFT_5: 80,
  LOW_ENTROPY_MASK_ROTATE_LEFT_6: 96,
  LOW_ENTROPY_MASK_ROTATE_LEFT_7: 112,
  LOW_ENTROPY_MASK_ROTATE_LEFT_8: 128,
  LOW_ENTROPY_MASK_ROTATE_LEFT_9: 144,
  LOW_ENTROPY_MASK_ROTATE_LEFT_10: 160,
  LOW_ENTROPY_MASK_ROTATE_LEFT_11: 176,
  LOW_ENTROPY_MASK_ROTATE_LEFT_12: 192,
  LOW_ENTROPY_MASK_ROTATE_LEFT_13: 208,
  LOW_ENTROPY_MASK_ROTATE_LEFT_14: 224,
  LOW_ENTROPY_MASK_ROTATE_LEFT_15: 240,
} as const;

export interface MieruTrafficPatternOptions {
  /** 稳定种子；省略则随机 */
  seed?: number;
  /** true 时隐式模式取值更激进；默认 false（保守） */
  unlockAll?: boolean;
  tcpFragment?: {
    enable?: boolean;
    /** 0–100 ms */
    maxSleepMs?: number;
  };
  nonce?: {
    type?: number;
    applyToAllUDPPacket?: boolean;
    /** 0–12 */
    minLen?: number;
    /** 0–12，且 ≥ minLen */
    maxLen?: number;
    /** FIXED 模式下使用的自定义 nonce 前缀 hex 串列表 */
    customHexStrings?: string[];
  };
  padding?: {
    /** 0–255 */
    maxMiddlePaddingLen?: number;
    /** 0–255 */
    maxEndPaddingLen?: number;
  };
  lowEntropy?: {
    mode?: number;
    maskRotation?: number;
  };
}

function encodeVarint(n: number): number[] {
  let v = n >>> 0;
  const out: number[] = [];
  while (v > 0x7f) {
    out.push((v & 0x7f) | 0x80);
    v >>>= 7;
  }
  out.push(v);
  return out;
}

/** 有符号 int32 的 zigzag 前先按 protobuf int32 处理：直接 varint 其补码位模式 */
function encodeInt32(n: number): number[] {
  if (n < 0) {
    let v = BigInt(n);
    const out: number[] = [];
    v = BigInt.asUintN(64, v);
    while (v > 0x7fn) {
      out.push(Number(v & 0x7fn) | 0x80);
      v >>= 7n;
    }
    out.push(Number(v));
    return out;
  }
  return encodeVarint(n);
}

function tag(fieldNumber: number, wireType: number): number[] {
  return encodeVarint((fieldNumber << 3) | wireType);
}

function fieldVarint(fieldNumber: number, value: number): number[] {
  return [...tag(fieldNumber, 0), ...encodeInt32(value)];
}

function fieldBool(fieldNumber: number, value: boolean): number[] {
  return fieldVarint(fieldNumber, value ? 1 : 0);
}

function fieldBytes(fieldNumber: number, payload: number[]): number[] {
  return [
    ...tag(fieldNumber, 2),
    ...encodeVarint(payload.length),
    ...payload,
  ];
}

function fieldString(fieldNumber: number, value: string): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < value.length; i++) {
    bytes.push(value.charCodeAt(i) & 0xff);
  }
  // UTF-8 encode properly
  const utf8 = new TextEncoder().encode(value);
  return [
    ...tag(fieldNumber, 2),
    ...encodeVarint(utf8.length),
    ...Array.from(utf8),
  ];
}

function encodeTcpFragment(tc: MieruTrafficPatternOptions["tcpFragment"]): number[] {
  const out: number[] = [];
  if (!tc) return out;
  if (typeof tc.enable === "boolean") {
    out.push(...fieldBool(1, tc.enable));
  }
  if (typeof tc.maxSleepMs === "number") {
    out.push(
      ...fieldVarint(
        2,
        Math.max(0, Math.min(100, tc.maxSleepMs | 0)),
      ),
    );
  }
  return out;
}

function encodeNonce(n: MieruTrafficPatternOptions["nonce"]): number[] {
  const out: number[] = [];
  if (!n) return out;
  if (typeof n.type === "number") {
    out.push(...fieldVarint(1, n.type | 0));
  }
  if (typeof n.applyToAllUDPPacket === "boolean") {
    out.push(...fieldBool(2, n.applyToAllUDPPacket));
  }
  if (typeof n.minLen === "number") {
    out.push(
      ...fieldVarint(3, Math.max(0, Math.min(12, n.minLen | 0))),
    );
  }
  if (typeof n.maxLen === "number") {
    const min = typeof n.minLen === "number" ? Math.max(0, Math.min(12, n.minLen | 0)) : 0;
    const max = Math.max(min, Math.min(12, n.maxLen | 0));
    out.push(...fieldVarint(4, max));
  }
  if (Array.isArray(n.customHexStrings)) {
    for (const hexStr of n.customHexStrings) {
      out.push(...fieldString(5, hexStr));
    }
  }
  return out;
}

function encodePadding(p: MieruTrafficPatternOptions["padding"]): number[] {
  const out: number[] = [];
  if (!p) return out;
  if (typeof p.maxMiddlePaddingLen === "number") {
    out.push(
      ...fieldVarint(
        1,
        Math.max(0, Math.min(255, p.maxMiddlePaddingLen | 0)),
      ),
    );
  }
  if (typeof p.maxEndPaddingLen === "number") {
    out.push(
      ...fieldVarint(
        2,
        Math.max(0, Math.min(255, p.maxEndPaddingLen | 0)),
      ),
    );
  }
  return out;
}

function encodeLowEntropy(l: MieruTrafficPatternOptions["lowEntropy"]): number[] {
  const out: number[] = [];
  if (!l) return out;
  if (typeof l.mode === "number") {
    out.push(...fieldVarint(1, l.mode | 0));
  }
  if (typeof l.maskRotation === "number") {
    out.push(...fieldVarint(2, l.maskRotation | 0));
  }
  return out;
}

/** 将 TrafficPattern 字段编码为 protobuf 字节 */
export function encodeTrafficPatternBytes(
  opts: MieruTrafficPatternOptions = {},
): Uint8Array {
  const body: number[] = [];
  if (typeof opts.seed === "number") {
    body.push(...fieldVarint(1, opts.seed | 0));
  }
  if (typeof opts.unlockAll === "boolean") {
    body.push(...fieldBool(2, opts.unlockAll));
  }
  if (opts.tcpFragment) {
    const payload = encodeTcpFragment(opts.tcpFragment);
    if (payload.length > 0) {
      body.push(...fieldBytes(3, payload));
    }
  }
  if (opts.nonce) {
    const payload = encodeNonce(opts.nonce);
    if (payload.length > 0) {
      body.push(...fieldBytes(4, payload));
    }
  }
  if (opts.padding) {
    const payload = encodePadding(opts.padding);
    if (payload.length > 0) {
      body.push(...fieldBytes(5, payload));
    }
  }
  if (opts.lowEntropy) {
    const payload = encodeLowEntropy(opts.lowEntropy);
    if (payload.length > 0) {
      body.push(...fieldBytes(6, payload));
    }
  }
  return new Uint8Array(body);
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary);
}

function randInt(min: number, max: number): number {
  // inclusive
  const span = max - min + 1;
  const buf = crypto.getRandomValues(new Uint32Array(1))[0]!;
  return min + (buf % span);
}

/**
 * 生成一组保守且可用的流量特征伪装配置，并编码为 Base64。
 * - unlockAll=false
 * - TCP 分片：开启，分片间隔 5–15ms（抗分析，延迟可控）
 * - Nonce：PRINTABLE / PRINTABLE_SUBSET，长度 6–12
 * - Padding / LowEntropy：使用官方隐式生成（留空），交由运行时按 seed 展开
 */
export function generateMieruTrafficPattern(
  options: MieruTrafficPatternOptions = {},
): string {
  const seed =
    options.seed ??
    randInt(1, 0x7fffffff);

  const unlockAll = options.unlockAll ?? false;

  const tcpEnable = options.tcpFragment?.enable ?? true;
  const maxSleepMs =
    options.tcpFragment?.maxSleepMs ??
    (tcpEnable ? randInt(5, 15) : 0);

  const nonceType =
    options.nonce?.type ??
    (randInt(0, 1) === 0
      ? NONCE_TYPE.PRINTABLE
      : NONCE_TYPE.PRINTABLE_SUBSET);

  const applyToAll =
    options.nonce?.applyToAllUDPPacket ?? (randInt(0, 1) === 1);

  const minLen = options.nonce?.minLen ?? randInt(6, 10);
  const maxLen =
    options.nonce?.maxLen ?? randInt(minLen, 12);

  const customHexStrings = options.nonce?.customHexStrings;

  const bytes = encodeTrafficPatternBytes({
    seed,
    unlockAll,
    tcpFragment: { enable: tcpEnable, maxSleepMs },
    nonce: {
      type: nonceType,
      applyToAllUDPPacket: applyToAll,
      minLen,
      maxLen,
      customHexStrings,
    },
    padding: options.padding,
    lowEntropy: options.lowEntropy,
  });

  return bytesToBase64(bytes);
}