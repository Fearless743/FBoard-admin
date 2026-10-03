import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

interface ParsedValue {
  prefix: string;
  target: number;
  suffix: string;
  decimals: number;
  grouped: boolean;
}

/**
 * 仅当整个字符串形如「前缀 + 数字 + 后缀」时才做滚动动画：
 *   "¥1,234.56" / "1.23 GB" / "12"  → 可解析
 *   "v1.2.3" / "12 / 34" / "—"       → 解析失败，退化为静态文本
 * 这样即便调用方传进来的是任意展示字符串，也不会被错误地截断/重排。
 */
const NUMERIC_RE = /^([^\d-]*)(-?[\d,]+(?:\.\d+)?)([^\d]*)$/;

function parseValue(value: number | string): ParsedValue | null {
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return null;
    return { prefix: "", target: value, suffix: "", decimals: 0, grouped: false };
  }
  const match = value.match(NUMERIC_RE);
  if (!match) return null;
  const digits = match[2].replace(/,/g, "");
  const target = Number(digits);
  if (!Number.isFinite(target)) return null;
  const dot = digits.indexOf(".");
  return {
    prefix: match[1],
    target,
    suffix: match[3],
    decimals: dot === -1 ? 0 : digits.length - dot - 1,
    // 原串带千分位才保留千分位，避免改变调用方的展示风格
    grouped: match[2].includes(","),
  };
}

function format(value: number, parsed: ParsedValue): string {
  const fixed = value.toFixed(parsed.decimals);
  const dot = fixed.indexOf(".");
  const int = dot === -1 ? fixed : fixed.slice(0, dot);
  const dec = dot === -1 ? "" : fixed.slice(dot);
  const body = parsed.grouped
    ? int.replace(/\B(?=(\d{3})+$)/g, ",") + dec
    : fixed;
  return `${parsed.prefix}${body}${parsed.suffix}`;
}

/**
 * 将可解析的数字字符串做「滚动增长」动画；不可解析时原样输出。
 *
 * 首屏从 0 增长到目标值；后续 value 变化（如轮询刷新）时从当前值平滑过渡，
 * 且值未变化不会重放动画。SSR / 无 JS 场景直接渲染最终值。
 */
export function CountUp({
  value,
  className,
}: {
  value: number | string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const parsed = parseValue(value);
  // 记录上一次动画的目标值，使数值更新时从「上次的值」而非 0 继续增长
  const fromRef = useRef(0);

  const key = parsed
    ? `${parsed.prefix}\u0000${parsed.target}\u0000${parsed.suffix}\u0000${parsed.decimals}\u0000${parsed.grouped}`
    : `raw:${String(value)}`;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !parsed) return;

      const from = fromRef.current;
      fromRef.current = parsed.target;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // 布局阶段先落到起点值，避免首帧闪现最终值
        el.textContent = format(from, parsed);
        const state = { v: from };
        gsap.to(state, {
          v: parsed.target,
          duration: 0.9,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = format(state.v, parsed);
          },
          onComplete: () => {
            el.textContent = format(parsed.target, parsed);
          },
        });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        el.textContent = format(parsed.target, parsed);
      });
    },
    { dependencies: [key] },
  );

  return (
    <span ref={ref} className={className}>
      {parsed ? format(parsed.target, parsed) : String(value ?? "")}
    </span>
  );
}
