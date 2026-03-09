import { useRef, useState } from "react";

export default function UploadZone({ file, onFile, loading }) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) onFile(f);
  };

  return (
    <div
      onClick={() => !loading && inputRef.current.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={handleDrop}
      className={`
        group relative
        border-2 border-dashed rounded-3xl p-10 md:p-16
        text-center transition-all duration-500 ease-out
        shadow-xl shadow-black/5
        backdrop-blur-sm
        overflow-hidden
        ${loading
          ? "cursor-not-allowed opacity-70 bg-gradient-to-br from-slate-900/80 to-slate-800/80"
          : "cursor-pointer"}
        ${drag
          ? "border-emerald-400/70 bg-gradient-to-br from-emerald-950/30 to-cyan-950/20 scale-[1.02] shadow-2xl shadow-emerald-500/20"
          : file
          ? "border-emerald-500/60 bg-gradient-to-br from-emerald-950/20 to-emerald-900/10 shadow-emerald-500/10"
          : "border-slate-700/70 hover:border-slate-500/70 bg-gradient-to-br from-slate-900/60 to-slate-800/40 hover:shadow-2xl hover:shadow-slate-900/30"}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files[0];
          if (f) onFile(f);
        }}
      />

      {/* Subtle animated background glow when dragging or file selected */}
      <div
        className={`
          absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-700
          ${drag || file ? "opacity-40" : ""}
          bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-transparent
        `}
      />

      {loading ? (
        <div className="relative z-10 flex flex-col items-center justify-center gap-4">
          <div className="text-6xl animate-spin-slow">⚙️</div>
          <p className="text-emerald-400 font-semibold text-xl tracking-wide">
            Analyzing Resume...
          </p>
          <p className="text-slate-400 text-sm mt-1 max-w-xs">
            GROQ AI is carefully reading your document
          </p>
          <div className="mt-4 h-1.5 w-32 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-gradient-to-r from-emerald-400 to-cyan-400 animate-pulse rounded-full"></div>
          </div>
        </div>
      ) : file ? (
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="text-7xl drop-shadow-lg text-emerald-400 animate-bounce-once">✅</div>
          <p className="text-emerald-300 font-semibold text-xl md:text-2xl truncate max-w-[280px] md:max-w-md">
            {file.name}
          </p>
          <p className="text-slate-400 text-sm font-medium">
            {(file.size / 1024).toFixed(1)} KB • Click or drag to replace
          </p>
          <span className="mt-3 px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 font-bold text-sm shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform">
            Change File
          </span>
        </div>
      ) : (
        <div className="relative z-10 flex flex-col items-center gap-5">
          <div className="text-8xl md:text-9xl mb-2 text-slate-300/80 group-hover:text-emerald-400/80 transition-colors duration-500 drop-shadow-xl">
            📄
          </div>
          <p className="text-white font-bold text-2xl md:text-3xl tracking-tight">
            Drop your Resume here
          </p>
          <p className="text-slate-400 text-base md:text-lg font-medium">
            PDF, DOCX, TXT • Max 5MB recommended
          </p>

          <div className="mt-6 px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-size-200 bg-pos-0 hover:bg-pos-100 text-slate-900 font-bold text-base shadow-xl shadow-cyan-500/20 transition-all duration-500 group-hover:scale-105">
            Browse File
          </div>

          <p className="text-slate-500 text-xs md:text-sm mt-4 opacity-80">
            or drag & drop your file
          </p>
        </div>
      )}
    </div>
  );
}