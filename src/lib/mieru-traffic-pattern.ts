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
 * }
 */

/** NonceType：与 mieru appctlpb.NonceType 对齐 */
export const NONCE_TYPE = {
  RANDOM: 0,
  PRINTABLE: 1,
  PRINTABLE_SUBSET: 2,
  FIXED: 3,
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
  // protobuf int32 使用符号扩展到 64-bit 的 varint；对正数即普通 varint。
  // 我们的 seed 始终用正 int32。
  if (n < 0) {
    // 负 int32：按 64-bit 符号扩展 varint（10 字节）
    let v = BigInt(n);
    const out: number[] = [];
    // 转成无符号 64 位 twos-complement
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

function encodeTcpFragment(enable: boolean, maxSleepMs: number): number[] {
  return [
    ...fieldBool(1, enable),
    ...fieldVarint(2, Math.max(0, Math.min(100, maxSleepMs | 0))),
  ];
}

function encodeNonce(
  type: number,
  applyToAllUDPPacket: boolean,
  minLen: number,
  maxLen: number,
): number[] {
  const min = Math.max(0, Math.min(12, minLen | 0));
  const max = Math.max(min, Math.min(12, maxLen | 0));
  return [
    ...fieldVarint(1, type | 0),
    ...fieldBool(2, applyToAllUDPPacket),
    ...fieldVarint(3, min),
    ...fieldVarint(4, max),
  ];
}

/** 将 TrafficPattern 字段编码为 protobuf 字节 */
export function encodeTrafficPatternBytes(
  opts: Required<
    Pick<MieruTrafficPatternOptions, "seed" | "unlockAll">
  > & {
    tcpFragment: { enable: boolean; maxSleepMs: number };
    nonce: {
      type: number;
      applyToAllUDPPacket: boolean;
      minLen: number;
      maxLen: number;
    };
  },
): Uint8Array {
  const body: number[] = [
    ...fieldVarint(1, opts.seed | 0),
    ...fieldBool(2, opts.unlockAll),
    ...fieldBytes(
      3,
      encodeTcpFragment(
        opts.tcpFragment.enable,
        opts.tcpFragment.maxSleepMs,
      ),
    ),
    ...fieldBytes(
      4,
      encodeNonce(
        opts.nonce.type,
        opts.nonce.applyToAllUDPPacket,
        opts.nonce.minLen,
        opts.nonce.maxLen,
      ),
    ),
  ];
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
 */
export function generateMieruTrafficPattern(
  options: MieruTrafficPatternOptions = {},
): string {
  const seed =
    options.seed ??
    // 正 int32，避开 0
    randInt(1, 0x7fffffff);

  const unlockAll = options.unlockAll ?? false;

  const tcpEnable = options.tcpFragment?.enable ?? true;
  const maxSleepMs =
    options.tcpFragment?.maxSleepMs ??
    (tcpEnable ? randInt(5, 15) : 0);

  // 不用 FIXED（需要 customHexStrings）；不用 RANDOM（默认无伪装意义弱）
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

  const bytes = encodeTrafficPatternBytes({
    seed,
    unlockAll,
    tcpFragment: { enable: tcpEnable, maxSleepMs },
    nonce: {
      type: nonceType,
      applyToAllUDPPacket: applyToAll,
      minLen,
      maxLen,
    },
  });

  return bytesToBase64(bytes);
}
