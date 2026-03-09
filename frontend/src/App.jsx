import { useState, useEffect } from "react";
import axios from "axios";
import UploadZone from "./components/UploadZone";
import ResultsPanel from "./components/ResultsPanel";

const API_URL = "http://localhost:5000/api";

export default function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  const handleFile = (f) => { setFile(f); setResult(null); setError(null); };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const formData = new FormData();
      formData.append("resume", file);
      const res = await axios.post(`${API_URL}/analyze`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        :root{
          --bg:#07080f;--surface:#0c0d17;--s2:#10111c;--border:rgba(255,255,255,0.055);
          --bhi:rgba(255,255,255,0.11);--gold:#d4a84b;--gold2:#f0cc7a;
          --teal:#34d4be;--purple:#9f85f7;
          --text:#edecea;--muted:#555568;--dim:#2e2e3e;
        }
        html{scroll-behavior:smooth;}
        body{background:var(--bg);color:var(--text);font-family:'Outfit',sans-serif;min-height:100vh;overflow-x:hidden;}
        body::after{content:'';position:fixed;inset:0;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");pointer-events:none;z-index:0;opacity:0.45;}
        .wrap{position:relative;z-index:1;}
        .glow{position:fixed;border-radius:50%;filter:blur(130px);pointer-events:none;z-index:0;}
        .g1{width:700px;height:700px;top:-250px;right:-250px;background:radial-gradient(circle,rgba(212,168,75,0.06) 0%,transparent 70%);}
        .g2{width:550px;height:550px;bottom:0;left:-200px;background:radial-gradient(circle,rgba(52,212,190,0.05) 0%,transparent 70%);}

        .hdr{position:sticky;top:0;z-index:100;height:70px;border-bottom:1px solid var(--border);backdrop-filter:blur(24px) saturate(1.4);background:rgba(7,8,15,0.78);display:flex;align-items:center;padding:0 48px;justify-content:space-between;}
        .logo{display:flex;align-items:center;gap:13px;}
        .logo-badge{width:40px;height:40px;border-radius:11px;background:linear-gradient(135deg,var(--gold),#7a5010);display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 4px 20px rgba(212,168,75,0.22);}
        .logo-name{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:700;letter-spacing:-0.5px;color:var(--text);}
        .logo-name em{font-style:normal;color:var(--gold);}
        .logo-tag{font-size:9.5px;color:var(--muted);letter-spacing:2.5px;text-transform:uppercase;margin-top:1px;}
        .nav{display:flex;gap:6px;}
        .npill{padding:5px 15px;border-radius:999px;font-size:11.5px;font-weight:500;border:1px solid var(--border);color:var(--muted);background:transparent;cursor:default;transition:all 0.25s;}
        .npill:hover{border-color:var(--bhi);color:var(--text);background:rgba(255,255,255,0.03);}

        .main{max-width:1060px;margin:0 auto;padding:88px 24px 120px;}

        .hero{text-align:center;margin-bottom:76px;opacity:0;transform:translateY(28px);transition:opacity 0.9s cubic-bezier(.16,1,.3,1),transform 0.9s cubic-bezier(.16,1,.3,1);}
        .hero.in{opacity:1;transform:translateY(0);}
        .eyebrow{display:inline-flex;align-items:center;gap:8px;padding:6px 18px;border-radius:999px;margin-bottom:32px;border:1px solid rgba(212,168,75,0.22);background:rgba(212,168,75,0.08);font-size:10.5px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--gold);}
        .eyebrow-dot{width:6px;height:6px;border-radius:50%;background:var(--gold);animation:ebpulse 2.2s ease-in-out infinite;}
        @keyframes ebpulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.45;transform:scale(.75)}}
        .h-title{font-family:'Cormorant Garamond',serif;font-size:clamp(50px,6.5vw,86px);font-weight:700;line-height:1.05;letter-spacing:-2.5px;margin-bottom:8px;color:var(--text);}
        .h-title .gw{background:linear-gradient(120deg,var(--gold2),var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
        .h-title .fw{color:rgba(237,236,234,0.26);}
        .h-sub{font-size:17px;color:var(--muted);font-weight:300;line-height:1.78;max-width:480px;margin:22px auto 44px;letter-spacing:0.1px;}
        .h-sub strong{color:rgba(237,236,234,0.65);font-weight:500;}
        .stats{display:inline-flex;align-items:center;border:1px solid var(--border);border-radius:14px;background:var(--surface);overflow:hidden;}
        .stat{padding:14px 28px;text-align:center;border-right:1px solid var(--border);}
        .stat:last-child{border-right:none;}
        .stat-n{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:700;color:var(--gold);line-height:1;}
        .stat-l{font-size:10.5px;color:var(--muted);letter-spacing:0.5px;margin-top:4px;}

        .ucard-wrap{max-width:570px;margin:0 auto 88px;opacity:0;transform:translateY(20px);transition:opacity 0.9s cubic-bezier(.16,1,.3,1) 0.15s,transform 0.9s cubic-bezier(.16,1,.3,1) 0.15s;}
        .ucard-wrap.in{opacity:1;transform:translateY(0);}
        .ucard{background:var(--surface);border:1px solid var(--border);border-radius:22px;padding:32px;position:relative;overflow:hidden;}
        .ucard::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(212,168,75,0.28),transparent);}
        .abtn{width:100%;margin-top:16px;padding:17px 24px;border-radius:13px;border:none;background:linear-gradient(135deg,var(--gold) 0%,#9a6a0a 55%,var(--gold) 100%);background-size:200% 100%;background-position:0% 0%;color:#1a0f00;font-family:'Outfit',sans-serif;font-weight:700;font-size:15.5px;letter-spacing:0.4px;cursor:pointer;transition:background-position 0.5s,transform 0.2s,box-shadow 0.3s;}
        .abtn:hover{background-position:100% 0%;transform:translateY(-2px);box-shadow:0 14px 42px rgba(212,168,75,0.28);}
        .abtn:active{transform:translateY(0);}
        .loading-pill{margin-top:18px;display:flex;flex-direction:column;align-items:center;gap:10px;}
        .lbar{width:100%;height:2px;border-radius:999px;background:var(--border);overflow:hidden;}
        .lbar-fill{height:100%;background:linear-gradient(90deg,var(--gold),var(--teal),var(--purple));border-radius:999px;animation:lbmove 2.2s ease-in-out infinite;}
        @keyframes lbmove{0%{width:0%;margin-left:0%;}50%{width:65%;margin-left:18%;}100%{width:0%;margin-left:100%;}}
        .ltext{font-size:12.5px;color:var(--muted);}
        .ltext span{color:var(--gold);font-weight:600;}
        .ebox{margin-top:14px;padding:14px 18px;border-radius:12px;background:rgba(248,113,113,0.07);border:1px solid rgba(248,113,113,0.18);color:#fca5a5;font-size:13.5px;line-height:1.55;}

        .res-header{display:flex;align-items:center;gap:12px;margin-bottom:32px;padding-bottom:22px;border-bottom:1px solid var(--border);}
        .res-dot{width:8px;height:8px;border-radius:50%;background:var(--teal);box-shadow:0 0 10px var(--teal);animation:ebpulse 2s infinite;}
        .res-label{font-size:13px;color:var(--muted);}
        .res-label b{color:var(--text);}
        .res-chip{margin-left:auto;padding:3px 12px;border-radius:999px;background:rgba(52,212,190,0.1);border:1px solid rgba(52,212,190,0.2);color:var(--teal);font-size:10.5px;font-weight:600;letter-spacing:1px;text-transform:uppercase;}

        .why{opacity:0;transform:translateY(18px);transition:opacity 0.9s cubic-bezier(.16,1,.3,1) 0.25s,transform 0.9s cubic-bezier(.16,1,.3,1) 0.25s;}
        .why.in{opacity:1;transform:translateY(0);}
        .why-title{text-align:center;margin-bottom:36px;font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:700;color:rgba(237,236,234,0.5);letter-spacing:-0.5px;}
        .why-title span{color:var(--text);}
        .fcards{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;}
        .fc{padding:26px 20px;border-radius:17px;border:1px solid var(--border);background:var(--surface);text-align:center;transition:all 0.3s ease;cursor:default;position:relative;overflow:hidden;}
        .fc::after{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent);}
        .fc:hover{border-color:var(--bhi);background:var(--s2);transform:translateY(-5px);box-shadow:0 20px 48px rgba(0,0,0,0.35);}
        .fc-icon{width:48px;height:48px;border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:22px;margin:0 auto 16px;transition:transform 0.3s;}
        .fc:hover .fc-icon{transform:scale(1.1) rotate(-4deg);}
        .fc-t{font-size:13.5px;font-weight:700;color:var(--text);margin-bottom:7px;}
        .fc-d{font-size:12px;color:var(--muted);line-height:1.65;}

        .ftr{border-top:1px solid var(--border);text-align:center;padding:24px;font-size:11.5px;color:var(--dim);letter-spacing:0.3px;}
        ::-webkit-scrollbar{width:5px;}
        ::-webkit-scrollbar-track{background:var(--bg);}
        ::-webkit-scrollbar-thumb{background:var(--dim);border-radius:99px;}
        ::-webkit-scrollbar-thumb:hover{background:var(--muted);}
      `}</style>

      <div className="wrap">
        <div className="glow g1" /><div className="glow g2" />

        <header className="hdr">
          <div className="logo">
            <div className="logo-badge">📋</div>
            <div>
              <div className="logo-name">Resume<em>AI</em></div>
              <div className="logo-tag">Groq · Llama 3.3 · Free</div>
            </div>
          </div>
          <nav className="nav">
            {["ATS Scanner","Skill Gap","AI Feedback","100% Free"].map(t=>(
              <div key={t} className="npill">{t}</div>
            ))}
          </nav>
        </header>

        <main className="main">

          <div className={`hero ${mounted?"in":""}`}>
            <div className="eyebrow">
              <div className="eyebrow-dot"/>
              AI-Powered Resume Intelligence
            </div>
            <h1 className="h-title">
              Land Your <span className="gw">Dream Job</span><br/>
              <span className="fw">Starting With Your CV.</span>
            </h1>
            <p className="h-sub">
              Upload your resume and get a <strong>detailed ATS score</strong>,
              identify hidden skill gaps, and receive <strong>expert-level feedback</strong> — in under 10 seconds.
            </p>
            <div className="stats">
              <div className="stat"><div className="stat-n">98%</div><div className="stat-l">Accuracy</div></div>
              <div className="stat"><div className="stat-n">&lt;10s</div><div className="stat-l">Analysis</div></div>
              <div className="stat"><div className="stat-n">Free</div><div className="stat-l">Forever</div></div>
              <div className="stat"><div className="stat-n">AI</div><div className="stat-l">Powered</div></div>
            </div>
          </div>

          <div className={`ucard-wrap ${mounted?"in":""}`}>
            <div className="ucard">
              <UploadZone file={file} onFile={handleFile} loading={loading}/>
              {file && !loading && (
                <button className="abtn" onClick={handleAnalyze}>
                  ⚡ &nbsp;Analyze My Resume
                </button>
              )}
              {loading && (
                <div className="loading-pill">
                  <div className="lbar"><div className="lbar-fill"/></div>
                  <div className="ltext"><span>Llama 3.3</span> is analyzing your resume…</div>
                </div>
              )}
              {error && <div className="ebox">⚠️ &nbsp;{error}</div>}
            </div>
          </div>

          {result && (
            <div>
              <div className="res-header">
                <div className="res-dot"/>
                <div className="res-label">Analysis complete for <b>{file?.name}</b></div>
                <div className="res-chip">✓ Done</div>
              </div>
              <ResultsPanel data={result}/>
            </div>
          )}

          {!result && !loading && (
            <div className={`why ${mounted?"in":""}`}>
              <div className="why-title">Why choose <span>ResumeAI</span>?</div>
              <div className="fcards">
                {[
                  {icon:"🎯",color:"#d4a84b",bg:"rgba(212,168,75,0.1)", title:"ATS Score",       desc:"Know exactly how recruiters' systems rate your resume before applying."},
                  {icon:"🔍",color:"#34d4be",bg:"rgba(52,212,190,0.1)", title:"Skill Gap",       desc:"Uncover the missing skills that are silently costing you interviews."},
                  {icon:"🚀",color:"#9f85f7",bg:"rgba(159,133,247,0.1)",title:"Expert Feedback", desc:"Actionable, specific improvements suggested by a seasoned HR AI."},
                  {icon:"⚡",color:"#fbbf24",bg:"rgba(251,191,36,0.1)", title:"Instant & Free",  desc:"Full analysis in under 10 seconds — no signup, no credit card."},
                ].map(f=>(
                  <div key={f.title} className="fc">
                    <div className="fc-icon" style={{background:f.bg,color:f.color}}>{f.icon}</div>
                    <div className="fc-t">{f.title}</div>
                    <div className="fc-d">{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        <footer className="ftr">
          © 2025 ResumeAI &nbsp;·&nbsp; Powered by Groq &amp; Llama 3.3 &nbsp;·&nbsp; 100% Free &nbsp;·&nbsp; No signup required
        </footer>
      </div>
    </>
  );
}