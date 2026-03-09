import { useState, useEffect } from "react";
import axios from "axios";
import UploadZone from "./components/UploadZone";
import ResultsPanel from "./components/ResultsPanel";

const API_URL = "https://ai-resume-analyzer-vzzy.onrender.com/api";

export default function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 80);
  }, []);

  const handleFile = (f) => {
    setFile(f);
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("resume", file);
      const res = await axios.post(`${API_URL}/analyze`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data.data);
    } catch (err) {
      setError(
        err.response?.data?.error || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <div className="fixed inset-0 -z-10">
        <div className="absolute left-[-120px] top-[-120px] h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-[-100px] top-[80px] h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute bottom-[-120px] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%)]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-violet-500 text-lg font-bold shadow-lg shadow-cyan-500/20">
              AI
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">ResumeAI</h1>
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                Groq · Llama 3.3 · Free
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-2 md:flex">
            {["ATS Scanner", "Skill Gap", "AI Feedback", "100% Free"].map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300"
              >
                {t}
              </span>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pt-16">
        <section
          className={`grid items-center gap-10 lg:grid-cols-2 ${
            mounted
              ? "translate-y-0 opacity-100"
              : "translate-y-6 opacity-0"
          } transition-all duration-700`}
        >
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              <span className="h-2 w-2 rounded-full bg-cyan-300 animate-pulse" />
              AI-Powered Resume Intelligence
            </div>

            <h2 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Land Your
              <span className="block bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400 bg-clip-text text-transparent">
                Dream Job
              </span>
              <span className="block text-slate-400">Starting With Your CV.</span>
            </h2>

            <p className="mt-5 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              Upload your resume and get a detailed ATS score, identify hidden
              skill gaps, and receive expert-level feedback in under 10 seconds.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { value: "98%", label: "Accuracy" },
                { value: "<10s", label: "Analysis" },
                { value: "Free", label: "Forever" },
                { value: "AI", label: "Powered" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                >
                  <div className="text-2xl font-extrabold text-white">
                    {item.value}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`${
              mounted
                ? "translate-y-0 opacity-100"
                : "translate-y-6 opacity-0"
            } transition-all duration-700 delay-100`}
          >
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Upload Resume</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Get ATS score, skill gap analysis, and AI feedback.
                  </p>
                </div>
                <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  Free
                </div>
              </div>

              <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/40 p-3">
                <UploadZone file={file} onFile={handleFile} loading={loading} />
              </div>

              {file && !loading && (
                <button
                  onClick={handleAnalyze}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-500 px-5 py-4 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01] active:scale-[0.99]"
                >
                  ⚡ Analyze My Resume
                </button>
              )}

              {loading && (
                <div className="mt-5 rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-500" />
                  </div>
                  <p className="mt-3 text-center text-sm text-slate-300">
                    <span className="font-semibold text-cyan-300">Llama 3.3</span>{" "}
                    is analyzing your resume…
                  </p>
                </div>
              )}

              {error && (
                <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  ⚠️ {error}
                </div>
              )}
            </div>
          </div>
        </section>

        {result && (
          <section className="mt-12">
            <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.8)]" />
                <p className="text-sm text-slate-300">
                  Analysis complete for{" "}
                  <span className="font-semibold text-white">{file?.name}</span>
                </p>
              </div>
              <span className="w-fit rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
                Done
              </span>
            </div>

            <ResultsPanel data={result} />
          </section>
        )}

        {!result && !loading && (
          <section
            className={`mt-16 ${
              mounted
                ? "translate-y-0 opacity-100"
                : "translate-y-6 opacity-0"
            } transition-all duration-700 delay-150`}
          >
            <div className="mb-8 text-center">
              <h3 className="text-3xl font-extrabold tracking-tight text-white">
                Why choose <span className="text-cyan-300">ResumeAI</span>?
              </h3>
              <p className="mt-3 text-sm text-slate-400 sm:text-base">
                Smart resume analysis with fast, practical, and actionable insights.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  icon: "🎯",
                  title: "ATS Score",
                  desc: "Know exactly how recruiters' systems rate your resume before applying.",
                },
                {
                  icon: "🔍",
                  title: "Skill Gap",
                  desc: "Uncover the missing skills that are silently costing you interviews.",
                },
                {
                  icon: "🚀",
                  title: "Expert Feedback",
                  desc: "Actionable and specific improvements suggested by a seasoned HR AI.",
                },
                {
                  icon: "⚡",
                  title: "Instant & Free",
                  desc: "Full analysis in under 10 seconds with no signup or credit card.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="group rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/10"
                >
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-violet-400/20 text-2xl">
                    {item.icon}
                  </div>
                  <h4 className="text-lg font-bold text-white">{item.title}</h4>
                  <p className="mt-2 text-sm leading-7 text-slate-400">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-white/10 bg-slate-950/40 px-4 py-6 text-center text-xs text-slate-500">
        © 2025 ResumeAI · Powered by Groq &amp; Llama 3.3 · 100% Free · No signup required
      </footer>
    </div>
  );
}