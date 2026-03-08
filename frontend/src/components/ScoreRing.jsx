import { useEffect, useState } from "react";

export default function ScoreRing({ score, size = 140 }) {
  const [animated, setAnimated] = useState(0);
  const stroke = 10;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (animated / 100) * circ;
  const color = score >= 75 ? "#2dd4bf" : score >= 50 ? "#fbbf24" : "#f87171";
  const glow = score >= 75 ? "rgba(45,212,191,0.4)" : score >= 50 ? "rgba(251,191,36,0.4)" : "rgba(248,113,113,0.4)";

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const step = () => {
        start += 1.5;
        if (start >= score) { setAnimated(score); return; }
        setAnimated(Math.floor(start));
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Glow behind ring */}
      <div style={{
        position: "absolute",
        inset: "10%",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`,
        filter: "blur(16px)",
        opacity: 0.6,
        pointerEvents: "none"
      }} />
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", position: "relative" }}>
        {/* Track */}
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
        {/* Progress */}
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 8px ${color})`, transition: "stroke-dashoffset 0.05s linear" }}
        />
        {/* Score text */}
        <text
          x="50%" y="44%"
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            transform: "rotate(90deg)",
            transformOrigin: "center",
            fill: color,
            fontSize: size * 0.24,
            fontWeight: 800,
            fontFamily: "'Playfair Display', serif",
          }}
        >
          {animated}
        </text>
        <text
          x="50%" y="68%"
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            transform: "rotate(90deg)",
            transformOrigin: "center",
            fill: "rgba(255,255,255,0.25)",
            fontSize: size * 0.09,
            fontWeight: 500,
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "1px",
          }}
        >
          / 100
        </text>
      </svg>
    </div>
  );
}
