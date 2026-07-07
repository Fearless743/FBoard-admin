import { useRef, useEffect, useState } from "react";

interface DataPoint {
  date: string;
  value: number;
}

interface SimpleAreaChartProps {
  data: DataPoint[];
  gradientId?: string;
  formatter?: (value: number) => [string, string];
  loading?: boolean;
}

const AXIS_COLOR = "hsl(var(--muted-foreground))";
const GRID_COLOR = "hsl(var(--border))";

function formatAxisValue(v: number): string {
  if (v >= 10000) return (v / 10000).toFixed(1) + "w";
  if (v >= 1000) return (v / 1000).toFixed(1) + "k";
  if (Number.isInteger(v)) return v.toString();
  return v.toFixed(1);
}

export function SimpleAreaChart({ data, gradientId = "areaGradient", formatter }: SimpleAreaChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 600, h: 300 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const { width } = entry.contentRect;
        setSize({ w: Math.max(width, 100), h: 300 });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { w, h } = size;
  const pad = { t: 10, r: 10, b: 30, l: 50 };
  const cw = w - pad.l - pad.r;
  const ch = h - pad.t - pad.b;

  if (!data || data.length === 0) {
    return (
      <div ref={containerRef} className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
        暂无数据
      </div>
    );
  }

  const values = data.map((d) => d.value);
  const maxVal = Math.max(...values, 1);
  const minVal = 0;
  const range = maxVal - minVal || 1;

  const xScale = (i: number) => pad.l + (i / Math.max(data.length - 1, 1)) * cw;
  const yScale = (v: number) => pad.t + ch - ((v - minVal) / range) * ch;

  const points = data.map((d, i) => `${xScale(i)},${yScale(d.value)}`);
  const areaPath = `M${points.join(" L ")} L${xScale(data.length - 1)},${pad.t + ch} L${pad.l},${pad.t + ch} Z`;

  // smooth line path via cubic bezier
  const smoothLinePath = (() => {
    if (points.length < 2) return "";
    let path = `M${points[0]}`;
    for (let i = 1; i < points.length; i++) {
      const [x0, y0] = points[i - 1].split(",").map(Number);
      const [x1, y1] = points[i].split(",").map(Number);
      const cp1x = x0 + (x1 - x0) * 0.25;
      const cp1y = y0;
      const cp2x = x1 - (x1 - x0) * 0.25;
      const cp2y = y1;
      path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${x1},${y1}`;
    }
    return path;
  })();

  // grid lines (5 horizontal)
  const gridLines = Array.from({ length: 6 }, (_, i) => {
    const y = pad.t + (ch / 5) * i;
    const val = maxVal - (range / 5) * i;
    return { y, label: formatAxisValue(val) };
  });

  // x-axis labels (show ~6 evenly spaced)
  const labelCount = Math.min(data.length, 6);
  const labelStep = Math.max(Math.floor(data.length / labelCount), 1);
  const xLabels = data.filter((_, i) => i % labelStep === 0 || i === data.length - 1);

  // tooltip state
  const [tooltip, setTooltip] = useState<{ x: number; i: number } | null>(null);

  return (
    <div ref={containerRef} style={{ width: "100%", height: 300 }} className="relative select-none">
      <svg width={w} height={h} className="overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* grid */}
        {gridLines.map((gl, i) => (
          <g key={i}>
            <line x1={pad.l} y1={gl.y} x2={w - pad.r} y2={gl.y} stroke={GRID_COLOR} strokeWidth={1} strokeDasharray="3 3" />
            <text x={pad.l - 8} y={gl.y + 4} textAnchor="end" fill={AXIS_COLOR} fontSize={12}>
              {gl.label}
            </text>
          </g>
        ))}

        {/* x-axis labels */}
        {xLabels.map((d, i) => {
          const idx = data.indexOf(d);
          const x = xScale(idx);
          return (
            <text key={i} x={x} y={h - 6} textAnchor="middle" fill={AXIS_COLOR} fontSize={12}>
              {d.date}
            </text>
          );
        })}

        {/* area fill */}
        <path d={areaPath} fill={`url(#${gradientId})`} />

        {/* line */}
        <path
          d={smoothLinePath}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* overlay for hover */}
        <rect x={pad.l} y={pad.t} width={cw} height={ch} fill="transparent"
          onMouseMove={(e) => {
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;
            const mx = e.clientX - rect.left - pad.l;
            const idx = Math.round((mx / cw) * (data.length - 1));
            const clamped = Math.max(0, Math.min(data.length - 1, idx));
            setTooltip({ x: xScale(clamped), i: clamped });
          }}
          onMouseLeave={() => setTooltip(null)}
        />

        {/* tooltip */}
        {tooltip && (
          <>
            <circle cx={tooltip.x} cy={yScale(data[tooltip.i].value)} r={4} fill="hsl(var(--primary))" stroke="white" strokeWidth={2} />
            <foreignObject
              x={Math.min(tooltip.x + 12, w - 160)}
              y={Math.max(yScale(data[tooltip.i].value) - 45, 0)}
              width={150} height={50}
            >
              <div style={{
                background: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                padding: "8px 12px",
                fontSize: 13,
                color: "hsl(var(--popover-foreground))",
                pointerEvents: "none",
              }}>
                <div style={{ fontWeight: 500, marginBottom: 2 }}>{data[tooltip.i].date}</div>
                <div>
                  {formatter
                    ? formatter(data[tooltip.i].value)[0]
                    : data[tooltip.i].value.toLocaleString()}
                </div>
              </div>
            </foreignObject>
          </>
        )}
      </svg>
    </div>
  );
}
