import { useState } from "react";
import { AppShell, ToolIntro } from "@/components/app-shell";

const languages = ["Hindi", "Kannada", "Malayalam", "Tamil", "Telugu", "Bengali", "Marathi"];

export default function Translator() {
  const [text, setText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("Hindi");
  const [mode, setMode] = useState("translate");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/translator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLanguage, mode }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setResult(data.result);
      }
    } catch (err) {
      setError("Failed to reach the server. Please try again.");
    }

    setLoading(false);
  }

  return (
    <AppShell>
      <ToolIntro eyebrow="Say it with confidence" title="Translator & Negotiator" description="Translate a phrase or get a thoughtful, polite way to negotiate with local vendors." />

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)]">
        <form onSubmit={handleSubmit} className="tm-surface p-5 sm:p-7">
          <p className="text-xs font-black uppercase tracking-[.16em] text-fuchsia-700">Choose your move</p>
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={() => setMode("translate")}
              className={`flex-1 rounded-xl border-2 border-neutral-950 px-3 py-3 text-sm font-black uppercase tracking-[.08em] transition-all ${mode === "translate" ? "bg-cyan-300 shadow-[3px_3px_0_0_#171717]" : "bg-white hover:bg-neutral-100"}`}
            >
              Translate
            </button>
            <button
              type="button"
              onClick={() => setMode("negotiate")}
              className={`flex-1 rounded-xl border-2 border-neutral-950 px-3 py-3 text-sm font-black uppercase tracking-[.08em] transition-all ${mode === "negotiate" ? "bg-pink-300 shadow-[3px_3px_0_0_#171717]" : "bg-white hover:bg-neutral-100"}`}
            >
              Negotiate
            </button>
          </div>

          <textarea
            placeholder={
              mode === "negotiate"
                ? "e.g. Can you give this to me a bit cheaper?"
                : "e.g. Where is the nearest bus stop?"
            }
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            required
            className="tm-input mt-5 min-h-28 resize-y"
          />

          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="tm-input mt-3"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>

          <button type="submit" className="mt-3 w-full rounded-2xl border-2 border-neutral-950 bg-fuchsia-300 px-5 py-3.5 font-black uppercase tracking-[.1em] text-neutral-950 shadow-[4px_4px_0_0_#171717] transition-all hover:-translate-y-0.5 hover:bg-orange-300 disabled:cursor-not-allowed disabled:opacity-60" disabled={loading}>
            {loading ? "Working..." : mode === "negotiate" ? "Get Negotiation Help" : "Translate"}
          </button>
        </form>

        {error && <p className="rounded-2xl border-2 border-red-600 bg-red-50 p-4 font-bold text-red-700">Error: {error}</p>}

        {result && (
          <div className="tm-surface h-fit whitespace-pre-wrap p-6 text-[15px] font-medium leading-7 text-neutral-700 sm:p-8">
            <p className="mb-5 text-xs font-black uppercase tracking-[.16em] text-fuchsia-700">Your local-language assist</p>
            {result}
          </div>
        )}
      </div>
    </AppShell>
  );
}
