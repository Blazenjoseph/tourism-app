import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const languages = [
  { label: "English", code: "en-IN", speechCode: "en-IN" },
  { label: "Hindi", code: "hi-IN", speechCode: "hi-IN" },
  { label: "Kannada", code: "kn-IN", speechCode: "kn-IN" },
  { label: "Malayalam", code: "ml-IN", speechCode: "ml-IN" },
  { label: "Tamil", code: "ta-IN", speechCode: "ta-IN" },
];

export default function VoiceAssistant() {
  const [status, setStatus] = useState("idle");
  const [transcript, setTranscript] = useState("");
  const [reply, setReply] = useState("");
  const [lang, setLang] = useState(languages[0]);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      handleAsk(text);
    };

    recognition.onerror = () => {
      setStatus("idle");
    };

    recognition.onend = () => {
      setStatus((prev) => (prev === "listening" ? "idle" : prev));
    };

    recognitionRef.current = recognition;
  }, [lang]);

  function startListening() {
    if (!recognitionRef.current) return;
    setTranscript("");
    setReply("");
    recognitionRef.current.lang = lang.speechCode;
    setStatus("listening");
    recognitionRef.current.start();
  }

  async function handleAsk(text) {
    setStatus("thinking");
    try {
      const res = await fetch("/api/companion-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Respond in ${lang.label} language. User said: ${text}`,
          history: [],
        }),
      });
      const data = await res.json();
      const replyText = data.reply || "Sorry, I couldn't understand that.";
      setReply(replyText);
      speak(replyText);
    } catch (err) {
      setReply("Sorry, something went wrong.");
      setStatus("idle");
    }
  }

  function speak(text) {
    if (!window.speechSynthesis) {
      setStatus("idle");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang.speechCode;
    utterance.onstart = () => setStatus("speaking");
    utterance.onend = () => setStatus("idle");
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  const orbState = {
    idle: { scale: 1, glow: 0.3, label: "Tap to speak" },
    listening: { scale: 1.15, glow: 0.7, label: "Listening..." },
    thinking: { scale: 1.05, glow: 0.5, label: "Thinking..." },
    speaking: { scale: 1.2, glow: 0.9, label: "Speaking..." },
  }[status];

  return (
    <div>
      <nav className="navbar">
        <div className="container">
          <Link href="/" className="logo">TravelMitra</Link>
          <div className="nav-links">
            <Link href="/trip-planner">AI Trip Planner</Link>
            <Link href="/translator">Translator</Link>
            <Link href="/voice-assistant">Negotiator</Link>
          </div>
        </div>
      </nav>

      <div className="container detail-page" style={{ textAlign: "center" }}>
        <h1>Negotiator 🎙️</h1>
        <p style={{ color: "#666" }}>Speak to TravelMitra in your language.</p>

        {!supported && (
          <p style={{ color: "#c0392b", marginTop: 20 }}>
            Voice recognition isn't supported in this browser. Please try Chrome or Edge.
          </p>
        )}

        <div style={{ margin: "20px auto", maxWidth: 240 }}>
          <select
            value={lang.code}
            onChange={(e) => setLang(languages.find((l) => l.code === e.target.value))}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ddd",
              fontSize: 14,
            }}
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
        </div>

        {supported && (
          <div style={{ margin: "50px auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <button
              onClick={startListening}
              disabled={status === "listening" || status === "thinking"}
              style={{
                width: 140,
                height: 140,
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                background: `radial-gradient(circle at 30% 30%, #6ea8ff, #2b6cd9)`,
                boxShadow: `0 0 ${40 * orbState.glow}px ${20 * orbState.glow}px rgba(43, 108, 217, ${orbState.glow * 0.5})`,
                transform: `scale(${orbState.scale})`,
                transition: "all 0.3s ease",
              }}
            />
            <p style={{ marginTop: 24, fontWeight: 600, color: "#555" }}>{orbState.label}</p>
          </div>
        )}

        {transcript && (
          <div style={{ maxWidth: 480, margin: "0 auto 16px", textAlign: "left" }}>
            <p style={{ fontSize: 13, color: "#999", marginBottom: 4 }}>You said:</p>
            <p style={{ background: "white", padding: 14, borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
              {transcript}
            </p>
          </div>
        )}

        {reply && (
          <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "left" }}>
            <p style={{ fontSize: 13, color: "#999", marginBottom: 4 }}>TravelMitra says:</p>
            <p style={{ background: "white", padding: 14, borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
              {reply}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
