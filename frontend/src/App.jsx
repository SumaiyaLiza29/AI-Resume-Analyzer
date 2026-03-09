import { useState } from "react";
import axios from "axios";
import UploadZone from "./components/UploadZone";
import ResultsPanel from "./components/ResultsPanel";

const API_URL = "https://ai-resume-analyzer-vzzy.onrender.com/api/analyze";

export default function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

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
        err.response?.data?.error || "Something Wrong..!!!!!।"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Add animations in style tag */}
      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        @keyframes spin-slow {
          to { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out forwards;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-700 { animation-delay: 700ms; }
        .delay-1000 { animation-delay: 1000ms; }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-[#0A0F1E] via-[#0D1425] to-[#0A0F1E] text-white relative overflow-x-hidden">
        
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 -right-4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-3xl"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-20" 
               style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>

        {/* Floating Orbs */}
        <div className="fixed top-20 left-10 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
        <div className="fixed bottom-20 right-10 w-2 h-2 bg-cyan-400 rounded-full animate-ping delay-300"></div>
        <div className="fixed top-40 right-20 w-1 h-1 bg-purple-400 rounded-full animate-ping delay-700"></div>

        {/* Header */}
        <header className="relative border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 md:h-20">
              {/* Logo */}
              <div className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-xl md:text-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    📋
                  </div>
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-black tracking-tight">
                    Resume<span className="text-emerald-400">AI</span>
                  </h1>
                  <p className="text-[10px] md:text-xs text-slate-500 tracking-[0.2em] flex items-center gap-1">
                    <span className="w-1 h-1 bg-emerald-400 rounded-full"></span>
                    POWERED BY GEMINI
                  </p>
                </div>
              </div>

              {/* Nav Tags */}
              <div className="hidden sm:flex gap-2">
                {["ATS Scan", "Skill Gap", "Suggestions"].map((t, i) => (
                  <span 
                    key={t} 
                    className="px-3 py-1.5 text-xs font-semibold rounded-full 
                               bg-white/5 border border-white/10 text-slate-300
                               hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400
                               transition-all duration-300 cursor-default animate-fadeIn"
                    style={{ animationDelay: `${i * 150}ms` }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Mobile Menu Button */}
              <button className="sm:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-emerald-500/10 transition-colors">
                <span className="text-2xl">⚡</span>
              </button>
            </div>
          </div>
        </header>

        <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">

          {/* Hero Section */}
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 mb-6 md:mb-8 animate-fadeIn">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-emerald-400 text-xs font-semibold tracking-wider">✨ AI-Powered Resume Analysis</span>
            </div>

            {/* Main Title */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 md:mb-6 animate-slideUp">
              <span className="bg-gradient-to-r from-white via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                AI Resume Analyzer
              </span>
            </h2>
            
            {/* Description */}
            <p className="text-slate-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed animate-slideUp delay-100">
              Upload your CV — get instant ATS score, identify skill gaps, 
              <span className="text-emerald-400"> and receive actionable feedback</span>
            </p>

            {/* Stats Bar */}
            <div className="mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-4 md:gap-8 text-sm animate-fadeIn delay-200">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                <span className="text-slate-400">10K+ Resumes Analyzed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse delay-300"></span>
                <span className="text-slate-400">98% Accuracy Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-700"></span>
                <span className="text-slate-400">Free Forever</span>
              </div>
            </div>
          </div>

          {/* Main Upload Card */}
          <div className="max-w-2xl mx-auto mb-8 md:mb-12">
            {/* Glass Card Container */}
            <div className="relative group">
              {/* Animated border */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-3xl opacity-0 group-hover:opacity-100 blur transition duration-500"></div>
              
              {/* Content */}
              <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/10">
                <UploadZone file={file} onFile={setFile} loading={loading} />

                {file && !loading && (
                  <div className="mt-6 animate-slideUp">
                    <button
                      onClick={handleAnalyze}
                      className="relative w-full group/btn overflow-hidden"
                    >
                      {/* Button background with animation */}
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-xl"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-xl blur-lg opacity-50 group-hover/btn:opacity-75 transition-opacity"></div>
                      
                      {/* Button content */}
                      <div className="relative px-6 py-4 rounded-xl font-black text-base text-slate-900
                                    transform transition-all duration-300
                                    group-hover/btn:scale-[0.98]">
                        <span className="flex items-center justify-center gap-3">
                          <span className="text-2xl group-hover/btn:rotate-12 transition-transform">⚡</span>
                          <span>Analyze My Resume Now</span>
                          <span className="text-xl group-hover/btn:translate-x-1 transition-transform">→</span>
                        </span>
                      </div>
                    </button>

                    {/* Hint text */}
                    <p className="text-center text-xs text-slate-500 mt-3 animate-pulse">
                      ✨ Gemini AI will analyze your resume (takes ~30 seconds)
                    </p>
                  </div>
                )}

                {loading && (
                  <div className="mt-6 text-center animate-fadeIn">
                    <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="relative">
                        <div className="w-5 h-5 border-2 border-emerald-400/20 border-t-emerald-400 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 w-5 h-5 border-2 border-cyan-400/20 border-b-cyan-400 rounded-full animate-spin-slow"></div>
                      </div>
                      <span className="text-emerald-400 font-semibold">
                        Gemini AI is analyzing your resume...
                      </span>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 animate-shake">
                    <div className="flex items-center gap-3 text-red-300 text-sm">
                      <span className="text-xl">⚠️</span>
                      <span>{error}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results Section */}
          {result && (
            <div className="mb-8 md:mb-12 animate-scaleIn">
              <ResultsPanel data={result} filename={file?.name} />
            </div>
          )}

          {/* Feature Cards Grid */}
          {!result && !loading && (
            <div className="mt-8 md:mt-12 lg:mt-16">
              <h3 className="text-center text-2xl md:text-3xl font-bold mb-8 md:mb-12 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent animate-fadeIn">
                Why Choose ResumeAI?
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                  { 
                    icon: "🎯", 
                    title: "ATS Score", 
                    desc: "See how your resume performs against tracking systems",
                    gradient: "from-emerald-400/20 to-emerald-400/5",
                    border: "hover:border-emerald-500/50"
                  },
                  { 
                    icon: "🔍", 
                    title: "Skill Gap", 
                    desc: "Discover what skills you're missing for target roles",
                    gradient: "from-cyan-400/20 to-cyan-400/5",
                    border: "hover:border-cyan-500/50"
                  },
                  { 
                    icon: "📈", 
                    title: "Improvement Tips", 
                    desc: "Get specific, actionable fixes for every weakness",
                    gradient: "from-purple-400/20 to-purple-400/5",
                    border: "hover:border-purple-500/50"
                  },
                  { 
                    icon: "⚡", 
                    title: "Instant & Free", 
                    desc: "Powered by Google Gemini — completely free to use",
                    gradient: "from-amber-400/20 to-amber-400/5",
                    border: "hover:border-amber-500/50"
                  },
                ].map((f, i) => (
                  <div
                    key={f.title}
                    className="group relative animate-slideUp"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    {/* Card glow effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-500"></div>
                    
                    {/* Card content */}
                    <div className={`
                      relative bg-gradient-to-br ${f.gradient} 
                      border border-white/5 rounded-2xl p-6 
                      hover:border-white/20 hover:shadow-2xl 
                      transition-all duration-300 backdrop-blur-sm
                      ${f.border}
                    `}>
                      {/* Icon with animation */}
                      <div className="relative mb-4">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-xl blur-xl group-hover:blur-2xl transition-all"></div>
                        <div className="relative text-4xl md:text-5xl transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 animate-float">
                          {f.icon}
                        </div>
                      </div>
                      
                      <h4 className="font-bold text-lg text-white mb-2 group-hover:text-emerald-400 transition-colors">
                        {f.title}
                      </h4>
                      
                      <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                        {f.desc}
                      </p>

                      {/* Hover indicator */}
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-emerald-400">→</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trust Badge */}
          {!result && !loading && (
            <div className="mt-12 text-center animate-fadeIn delay-500">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-emerald-500/5 hover:border-emerald-500/20 transition-all duration-300">
                <span className="flex -space-x-2">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center justify-center text-xs animate-pulse-glow">✓</span>
                  <span className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center justify-center text-xs animate-pulse-glow delay-300">✓</span>
                  <span className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-xs animate-pulse-glow delay-700">✓</span>
                </span>
                <span className="text-sm text-slate-400">
                  Trusted by <span className="text-white font-bold">1,000+</span> job seekers
                </span>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="relative border-t border-white/5 bg-black/20 backdrop-blur-sm mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-xs text-slate-600">
              © 2024 ResumeAI • Powered by Google Gemini • 100% Free • No signup required
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}