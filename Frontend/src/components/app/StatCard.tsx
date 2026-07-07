import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Activity, FileText, Radar, Shield } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { useEffect, useMemo } from "react";

const iconFor = (label: string) => {
  const l = label.toLowerCase();
  if (l.includes("competitors")) return Radar;
  if (l.includes("reports")) return FileText;
  if (l.includes("signals")) return Activity;
  if (l.includes("threat")) return Shield;
  return Activity;
};

function parseNumberish(value: string) {
  const numeric = Number(value.replace(/,/g, ""));
  return Number.isFinite(numeric) ? numeric : null;
}

export function StatCard({
  label,
  value,
  delta,
  trend,
  index = 0,
}: {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  index?: number;
}) {
  const Icon = iconFor(label);
  const tone = trend === "up" ? "success" : "destructive";
  const sign = trend === "up" ? "+" : "";

  const spark = useMemo(() => {
    const base = trend === "up" ? 40 : 65;
    const wiggle = trend === "up" ? 10 : -8;
    return Array.from({ length: 12 }).map((_, i) => ({
      i,
      v: base + i * (wiggle / 2) + (Math.sin(i / 1.6) * Math.abs(wiggle)) / 2,
    }));
  }, [trend]);

  const target = parseNumberish(value);
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v));

  useEffect(() => {
    if (target == null) return;
    const controls = animate(mv, target, {
      duration: 0.9,
      delay: index * 0.06,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [index, mv, target]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -3 }}
      className="rounded-3xl glass shadow-card premium-card p-5 transition-shadow hover:shadow-[0_1px_1px_oklch(0_0_0_/_0.04),_0_18px_50px_oklch(0_0_0_/_0.10)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xs text-muted-foreground uppercase tracking-[0.18em]">{label}</div>
          <div className="mt-3 flex items-end gap-3">
            <div className="text-[34px] leading-none font-semibold tracking-[-0.03em]">
              {target == null ? value : <motion.span>{rounded}</motion.span>}
            </div>
            <div
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                tone === "success"
                  ? "text-success bg-success/10 border-success/20"
                  : "text-destructive bg-destructive/10 border-destructive/20"
              }`}
            >
              {trend === "up" ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              {sign}
              {delta}
            </div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            vs previous period · updated just now
          </div>
        </div>

        <div className="shrink-0">
          <div className="w-10 h-10 rounded-2xl border border-border bg-card/70 grid place-items-center">
            <Icon className="w-4.5 h-4.5 text-primary" />
          </div>
        </div>
      </div>

      <div className="mt-4 h-10">
        <ResponsiveContainer>
          <AreaChart data={spark} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`kpi-${index}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.9} />
                <stop offset="100%" stopColor="var(--secondary)" stopOpacity={0.9} />
              </linearGradient>
              <linearGradient id={`kpi-fill-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.22} />
                <stop offset="100%" stopColor="var(--secondary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={`url(#kpi-${index})`}
              fill={`url(#kpi-fill-${index})`}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3, stroke: "transparent" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
