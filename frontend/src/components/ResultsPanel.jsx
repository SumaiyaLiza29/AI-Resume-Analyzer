import ScoreRing from "./ScoreRing";

const impColor = { High: "#ef4444", Medium: "#f59e0b", Low: "#22d3a5" };
const ratingColor = { Excellent: "#22d3a5", Good: "#0ea5e9", Average: "#f59e0b", Poor: "#ef4444" };

function MiniBar({ label, value, color }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-slate-400">{label}</span>
        <span className="font-bold" style={{ color }}>{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000"
             style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

function Tag({ text, color }) {
  return (
    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold m-0.5 border"
          style={{ color, borderColor: color + "40", background: color + "15" }}>
      {text}
    </span>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`bg-gradient-to-br from-slate-900 to-slate-800/80 border border-slate-700 rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  );
}

function Section({ icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-lg">{icon}</span>
      <h3 className="text-sm font-bold text-slate-200 tracking-wide">{title}</h3>
    </div>
  );
}

export default function ResultsPanel({ data, filename }) {
  return (
    <div className="space-y-4">

      {/* Done banner */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-slate-400 text-sm">
          Analysis complete for <strong className="text-white">{filename}</strong>
        </span>
      </div>

      {/* Row 1: Score + Breakdown + Rating */}
      <div className="grid grid-cols-3 gap-4">

        <Card className="flex flex-col items-center justify-center gap-3">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">ATS Score</p>
          <ScoreRing score={data.atsScore} />
          <p className="text-xs text-slate-500">out of 100</p>
        </Card>

        <Card>
          <Section icon="📊" title="Score Breakdown" />
          <MiniBar label="Keywords" value={data.atsBreakdown.keywords} color="#22d3a5" />
          <MiniBar label="Formatting" value={data.atsBreakdown.formatting} color="#0ea5e9" />
          <MiniBar label="Readability" value={data.atsBreakdown.readability} color="#a78bfa" />
          <MiniBar label="Completeness" value={data.atsBreakdown.completeness} color="#f59e0b" />
        </Card>

        <Card>
          <Section icon="🏆" title="Overall Rating" />
          <div className="inline-block px-5 py-1.5 rounded-full font-black text-xl mb-4 border"
               style={{
                 color: ratingColor[data.overallRating],
                 borderColor: ratingColor[data.overallRating] + "50",
                 background: ratingColor[data.overallRating] + "15"
               }}>
            {data.overallRating}
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">{data.summary}</p>
        </Card>
      </div>

      {/* Row 2: Skills + Roles + Strengths */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <Section icon="✨" title="Skills Detected" />
          <div className="mb-5">{data.skillsFound.map((s, i) => <Tag key={i} text={s} color="#22d3a5" />)}</div>
          <Section icon="💪" title="Strengths" />
          {data.strengths.map((s, i) => (
            <div key={i} className="flex gap-2 mb-2 items-start">
              <span className="text-emerald-400 mt-0.5 text-xs flex-shrink-0">▸</span>
              <span className="text-slate-400 text-sm leading-relaxed">{s}</span>
            </div>
          ))}
        </Card>
        <Card>
          <Section icon="🎯" title="Suitable Job Roles" />
          <div className="mb-2">{data.jobRoles.map((r, i) => <Tag key={i} text={r} color="#a78bfa" />)}</div>
        </Card>
      </div>

      {/* Row 3: Skill Gaps */}
      <Card>
        <Section icon="🔍" title="Skill Gap Analysis" />
        <div className="grid grid-cols-3 gap-3">
          {data.skillGaps.map((gap, i) => (
            <div key={i} className="bg-slate-950 rounded-xl p-4 border"
                 style={{ borderColor: (impColor[gap.importance] || "#334155") + "30" }}>
              <div className="flex justify-between items-center mb-2 gap-2">
                <span className="font-bold text-white text-sm">{gap.skill}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ color: impColor[gap.importance], background: impColor[gap.importance] + "20" }}>
                  {gap.importance}
                </span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">{gap.reason}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Row 4: Improvements */}
      <Card>
        <Section icon="🚀" title="Improvement Suggestions" />
        <div className="grid grid-cols-2 gap-3">
          {data.improvements.map((imp, i) => (
            <div key={i} className="bg-slate-950 rounded-xl p-4 border-l-4" style={{ borderColor: "#0ea5e9" }}>
              <div className="text-xs text-cyan-400 font-bold uppercase tracking-wider mb-2">
                {imp.category}
              </div>
              <p className="text-white text-sm font-semibold mb-2">⚠️ {imp.issue}</p>
              <p className="text-slate-500 text-xs leading-relaxed">✅ {imp.fix}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}