import { useState } from "react";
import Link from "next/link";

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
    <div>
      <nav className="navbar">
        <div className="container">
          <Link href="/" className="logo">TravelMitra</Link>
          <div className="nav-links">
            <Link href="/trip-planner">AI Trip Planner</Link>
            <Link href="/heritage-explorer">Heritage Explorer</Link>
            <Link href="/wishlist">Wishlist</Link>
            <Link href="/packing-list">Packing List</Link>
            <Link href="/budget-tracker">Budget Tracker</Link>
            <Link href="/translator">Translator & Negotiator</Link>
          </div>
        </div>
      </nav>

      <div className="container detail-page">
        <h1>Local Translator & Negotiator 🗣️</h1>
        <p style={{ color: "#666" }}>
          Translate phrases or get polite negotiation help with local vendors.
        </p>

        <form onSubmit={handleSubmit} style={{ maxWidth: 480, marginTop: 20 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            <button
              type="button"
              onClick={() => setMode("translate")}
              className="btn"
              style={{
                flex: 1,
                background: mode === "translate" ? undefined : "#eee",
                color: mode === "translate" ? undefined : "#555",
              }}
            >
              Translate
            </button>
            <button
              type="button"
              onClick={() => setMode("negotiate")}
              className="btn"
              style={{
                flex: 1,
                background: mode === "negotiate" ? undefined : "#eee",
                color: mode === "negotiate" ? undefined : "#555",
              }}
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
            style={{
              display: "block",
              width: "100%",
              padding: 12,
              marginBottom: 14,
              borderRadius: 8,
              border: "1px solid #ddd",
              fontFamily: "inherit",
              resize: "vertical",
            }}
          />

          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              padding: 12,
              marginBottom: 14,
              borderRadius: 8,
              border: "1px solid #ddd",
            }}
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Working..." : mode === "negotiate" ? "Get Negotiation Help" : "Translate"}
          </button>
        </form>

        {error && <p style={{ color: "#c0392b", marginTop: 20 }}>Error: {error}</p>}

        {result && (
          <div
            style={{
              marginTop: 30,
              maxWidth: 600,
              background: "white",
              padding: 24,
              borderRadius: 16,
              whiteSpace: "pre-wrap",
              lineHeight: 1.6,
              boxShadow: "0 2px 10px rgba(60,40,20,0.05)",
            }}
          >
            {result}
          </div>
        )}
      </div>
    </div>
  );
}
