import type { ReactNode, HTMLAttributes } from "react";

export function GlassCard({ children, className = "", hover = false, ...rest }: HTMLAttributes<HTMLDivElement> & { hover?: boolean }) {
  return (
    <div
      {...rest}
      className={`glass relative overflow-hidden rounded-3xl ${hover ? "card-interactive cursor-pointer" : ""} ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.05),transparent_60%)]" />
      <div className="relative">{children}</div>
    </div>
  );
}

export function Chip({ children, tint, active = false, className = "" }: { children: ReactNode; tint?: string; active?: boolean; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] transition duration-300 ${className} ${active ? "border-[#38BDF8]/30 bg-[#38BDF8]/10 text-[#38BDF8]" : "border-white/5 bg-slate-950/40 text-slate-400"
        }`}
      style={tint ? { color: tint, borderColor: `${tint}25`, background: `${tint}10` } : undefined}
    >
      {children}
    </span>
  );
}

export function GlowButton({ children, className = "", as: As = "button" as any, ...rest }: any) {
  return (
    <As
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-full glow-btn px-6 py-3 text-sm font-semibold tracking-wide shadow-lg ${className}`}
    >
      {children}
    </As>
  );
}

export function GhostButton({ children, className = "", as: As = "button" as any, ...rest }: any) {
  return (
    <As
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-white/5 bg-slate-950/40 px-6 py-3 text-sm text-slate-300 font-medium backdrop-blur-md hover:border-white/15 hover:bg-slate-900/60 hover:text-white transition duration-300 active:scale-98 ${className}`}
    >
      {children}
    </As>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500 font-semibold">{children}</div>;
}

export function Sparkline({ points, color = "#38BDF8", height = 40, width = 120 }: { points: number[]; color?: string; height?: number; width?: number }) {
  const min = Math.min(...points), max = Math.max(...points);
  const range = max - min || 1;
  const step = width / (points.length - 1);
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"} ${(i * step).toFixed(2)} ${(height - ((p - min) / range) * height).toFixed(2)}`).join(" ");
  const area = `${d} L ${width} ${height} L 0 ${height} Z`;
  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`sg-${color}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg-${color})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
