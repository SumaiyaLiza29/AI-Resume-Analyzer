import ScoreRing from "./ScoreRing";

const impColor = { High: "#ef4444", Medium: "#f59e0b", Low: "#22d3a5" };
const ratingColor = {
  Excellent: "#22d3a5",
  Good: "#0ea5e9",
  Average: "#f59e0b",
  Poor: "#ef4444",
};

function MiniBar({ label, value, color }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">{label}</span>
        <span className="text-sm font-extrabold" style={{ color }}>
          {value}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-800/80">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  );
}

function Tag({ text, color }) {
  return (
    <span
      className="inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold"
      style={{
        color,
        borderColor: color + "35",
        background: color + "14",
      }}
    >
      {text}
    </span>
  );
}

function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-slate-950/95 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
}

function Section({ icon, title, subtitle }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-lg">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-[0.18em] text-slate-200">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResultsPanel({ data, filename }) {
  return (
    <div className="space-y-5">
      {/* Done banner */}
      <div className="flex flex-col gap-3 rounded-2xl border border-emerald-400/15 bg-emerald-400/5 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.8)] animate-pulse" />
          <span className="text-sm text-slate-300">
            Analysis complete for{" "}
            <strong className="font-bold text-white">{filename}</strong>
          </span>
        </div>
        <span className="w-fit rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-300">
          Ready
        </span>
      </div>

      {/* Row 1 */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center text-center">
          <div className="mb-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-300">
            ATS Score
          </div>

          <div className="my-4">
            <ScoreRing score={data.atsScore} />
          </div>

          <p className="text-xs text-slate-500">Your resume compatibility score</p>
          <p className="mt-1 text-sm font-semibold text-slate-300">out of 100</p>
        </Card>

        <Card>
          <Section
            icon="📊"
            title="Score Breakdown"
            subtitle="Core metrics used in the ATS evaluation"
          />
          <div className="space-y-3">
            <MiniBar
              label="Keywords"
              value={data.atsBreakdown.keywords}
              color="#22d3a5"
            />
            <MiniBar
              label="Formatting"
              value={data.atsBreakdown.formatting}
              color="#0ea5e9"
            />
            <MiniBar
              label="Readability"
              value={data.atsBreakdown.readability}
              color="#a78bfa"
            />
            <MiniBar
              label="Completeness"
              value={data.atsBreakdown.completeness}
              color="#f59e0b"
            />
          </div>
        </Card>

        <Card>
          <Section
            icon="🏆"
            title="Overall Rating"
            subtitle="Final quality signal based on your resume analysis"
          />
          <div
            className="mb-4 inline-flex rounded-2xl border px-4 py-2 text-xl font-black"
            style={{
              color: ratingColor[data.overallRating],
              borderColor: ratingColor[data.overallRating] + "45",
              background: ratingColor[data.overallRating] + "14",
            }}
          >
            {data.overallRating}
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
            <p className="text-sm leading-7 text-slate-300">{data.summary}</p>
          </div>
        </Card>
      </div>

      {/* Row 2 */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <Section
            icon="✨"
            title="Skills Detected"
            subtitle="Recognized skills found from your resume"
          />
          <div className="mb-6 flex flex-wrap gap-2">
            {data.skillsFound.map((s, i) => (
              <Tag key={i} text={s} color="#22d3a5" />
            ))}
          </div>

          <Section
            icon="💪"
            title="Strengths"
            subtitle="Strong points identified in your profile"
          />
          <div className="space-y-3">
            {data.strengths.map((s, i) => (
              <div
                key={i}
                className="flex gap-3 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.04] p-4"
              >
                <span className="mt-0.5 text-sm text-emerald-400">✓</span>
                <span className="text-sm leading-7 text-slate-300">{s}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <Section
            icon="🎯"
            title="Suitable Job Roles"
            subtitle="Roles that align with your detected profile"
          />
          <div className="flex flex-wrap gap-2">
            {data.jobRoles.map((r, i) => (
              <Tag key={i} text={r} color="#a78bfa" />
            ))}
          </div>
        </Card>
      </div>

      {/* Row 3 */}
      <Card>
        <Section
          icon="🔍"
          title="Skill Gap Analysis"
          subtitle="Important skills missing or underrepresented in your resume"
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.skillGaps.map((gap, i) => (
            <div
              key={i}
              className="rounded-2xl border bg-slate-950/70 p-4 transition duration-300 hover:-translate-y-1 hover:border-white/20"
              style={{
                borderColor: (impColor[gap.importance] || "#334155") + "35",
              }}
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <h4 className="text-sm font-bold text-white">{gap.skill}</h4>
                <span
                  className="rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide"
                  style={{
                    color: impColor[gap.importance],
                    background: impColor[gap.importance] + "18",
                  }}
                >
                  {gap.importance}
                </span>
              </div>

              <p className="text-sm leading-6 text-slate-400">{gap.reason}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Row 4 */}
      <Card>
        <Section
          icon="🚀"
          title="Improvement Suggestions"
          subtitle="Actionable changes to improve your ATS score and resume quality"
        />
        <div className="grid gap-4 lg:grid-cols-2">
          {data.improvements.map((imp, i) => (
            <div
              key={i}
              className="rounded-2xl border border-cyan-400/10 bg-slate-950/70 p-4"
            >
              <div className="mb-3 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                {imp.category}
              </div>

              <p className="mb-3 text-sm font-bold leading-6 text-white">
                ⚠️ {imp.issue}
              </p>

              <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.04] p-3">
                <p className="text-sm leading-6 text-slate-300">✅ {imp.fix}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}