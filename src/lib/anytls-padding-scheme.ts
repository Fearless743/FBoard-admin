/**
 * AnyTLS 填充方案（padding scheme）生成器 —— 浏览器本地生成。
 *
 * 生成的多行字符串与 Xray-core `proxy/anytls` 的 padding scheme 格式一致：
 *   stop=<N>
 *   0=<固定长度>
 *   1=<min>-<max>[,c,...]
 *   ...
 *
 * 规则见 Xray-core/proxy/anytls/padding.go：
 * - `stop` 为停止填充的包序号，必须存在且为整数；
 * - 每个包一行，值为逗号分隔的 `min-max` 区间或 `c`（条件检查点）；
 * - 包 0 用于认证阶段 padding，必须是固定长度区间（min == max）。
 */

const AUTH_PADDING_MIN = 16;
const AUTH_PADDING_MAX = 64;
const PAYLOAD_MIN = 100;
const PAYLOAD_MAX = 1500;

function randInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

/** 生成一个合法的 `min-max` 区间片段 */
function randRange(): string {
  const lo = randInt(PAYLOAD_MIN, PAYLOAD_MAX - 100);
  const hi = randInt(lo + 20, Math.min(PAYLOAD_MAX, lo + 600));
  return `${lo}-${hi}`;
}

/** 生成一条随机的 AnyTLS 多行填充方案 */
export function generateAnyTLSPaddingScheme(): string {
  const stop = randInt(6, 12);
  const lines: string[] = [`stop=${stop}`];

  // 包 0：认证阶段，固定长度（min == max）
  const auth = randInt(AUTH_PADDING_MIN, AUTH_PADDING_MAX);
  lines.push(`0=${auth}-${auth}`);

  // 其余包：1~5 个随机区间，之间随机插入条件检查点 `c`
  for (let pkt = 1; pkt < stop; pkt++) {
    const parts: string[] = [];
    const rangeCount = randInt(1, 5);
    for (let i = 0; i < rangeCount; i++) {
      parts.push(randRange());
      if (i < rangeCount - 1 && Math.random() < 0.5) {
        parts.push("c");
      }
    }
    lines.push(`${pkt}=${parts.join(",")}`);
  }

  return lines.join("\n");
}
