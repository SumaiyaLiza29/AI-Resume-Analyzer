import { useEffect, useState } from "react";

export default function ScoreRing({ score, size = 140 }) {
  const [animated, setAnimated] = useState(0);

  const color =
    score >= 75 ? "#14b8a6" : score >= 50 ? "#3b82f6" : "#ef4444";

  const label =
    score >= 75 ? "Strong Match" : score >= 50 ? "Moderate Match" : "Needs Work";

  const bars = 12;
  const activeBars = Math.round((animated / 100) * bars);

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const step = () => {
        start += 1.5;
        if (start >= score) {
          setAnimated(score);
          return;
        }
        setAnimated(Math.floor(start));
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, 300);

    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="w-full max-w-[260px] rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl">

      {/* Top section */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
            ATS Score
          </p>

          <div className="mt-2 flex items-end gap-2">
            <span
              className="text-5xl font-black leading-none"
              style={{ color }}
            >
              {animated}
            </span>
            <span className="pb-1 text-sm font-semibold text-slate-500">
              /100
            </span>
          </div>
        </div>

        <div
          className="rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
          style={{
            color,
            borderColor: `${color}40`,
            background: `${color}15`,
          }}
        >
          {label}
        </div>
      </div>

      {/* Vertical Bars */}
      <div className="flex items-end justify-between gap-1 h-20 mb-4">
        {Array.from({ length: bars }).map((_, i) => {
          const active = i < activeBars;
          const height = ((i + 1) / bars) * 100;

          return (
            <div
              key={i}
              className="w-full rounded-sm transition-all duration-500"
              style={{
                height: active ? `${height}%` : "20%",
                background: active ? color : "rgba(255,255,255,0.07)",
                boxShadow: active ? `0 0 10px ${color}55` : "none",
              }}
            />
          );
        })}
      </div>

      {/* Score scale */}
      <div className="flex justify-between text-[11px] text-slate-500">
        <span>0</span>
        <span>50</span>
        <span>75</span>
        <span>100</span>
      </div>

    </div>
  );
}