import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { AppShell, ToolIntro } from "@/components/app-shell";

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
    idle: { scale: 1, glow: 0.3, label: "Tap to speak", color: "from-violet-500 via-fuchsia-500 to-orange-400" },
    listening: { scale: 1.15, glow: 0.7, label: "Listening...", color: "from-cyan-400 via-blue-500 to-violet-500" },
    thinking: { scale: 1.05, glow: 0.5, label: "Thinking...", color: "from-amber-300 via-orange-400 to-rose-500" },
    speaking: { scale: 1.2, glow: 0.9, label: "Speaking...", color: "from-emerald-400 via-cyan-400 to-blue-500" },
  }[status];

  return (
    <AppShell>
      <ToolIntro eyebrow="A voice that travels" title="Voice Negotiator" description="Speak naturally. TravelMitra listens, thinks, and replies in the language you choose." />

      <section className="tm-surface mt-10 overflow-hidden px-5 py-10 text-center sm:px-8 sm:py-12">
        <div className="mx-auto max-w-xs">
          <label className="mb-2 block text-left text-xs font-black uppercase tracking-[.14em] text-neutral-600">I&apos;m speaking</label>
          <select
            value={lang.code}
            onChange={(e) => setLang(languages.find((l) => l.code === e.target.value))}
            className="tm-input"
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
        </div>

        {!supported && (
          <p className="mx-auto mt-8 max-w-xl rounded-2xl border-2 border-red-600 bg-red-50 p-4 text-left font-bold text-red-700">
            Voice recognition isn't supported in this browser. Please try Chrome or Edge.
          </p>
        )}

        {supported && (
          <div className="relative mx-auto mt-12 flex min-h-80 max-w-lg flex-col items-center justify-center">
            <motion.div
              animate={{
                scale: status === "listening" ? [1, 1.32, 1] : status === "speaking" ? [1, 1.18, 1] : 1,
                opacity: status === "idle" ? .32 : [.25, .7, .25],
              }}
              transition={{ duration: status === "thinking" ? 1.2 : .9, repeat: Infinity, ease: "easeInOut" }}
              className={`absolute h-60 w-60 rounded-full bg-gradient-to-br blur-3xl ${orbState.color}`}
            />
            <motion.div
              animate={{ rotate: status === "thinking" ? 360 : 0, scale: orbState.scale }}
              transition={{ rotate: { duration: 1.8, repeat: Infinity, ease: "linear" }, scale: { type: "spring", stiffness: 240, damping: 16 } }}
              className="relative"
            >
              <div className={`absolute inset-0 rounded-full border-2 border-dashed border-neutral-950/40 ${status === "thinking" ? "tm-orb-spin" : ""}`} />
              <motion.button
              onClick={startListening}
              disabled={status === "listening" || status === "thinking"}
              whileTap={{ scale: .94 }}
              className={`tm-orb-float relative flex h-48 w-48 items-center justify-center rounded-full border-[3px] border-neutral-950 bg-gradient-to-br shadow-[7px_7px_0_0_#171717] transition-opacity disabled:cursor-wait disabled:opacity-80 ${orbState.color}`}
              aria-label={orbState.label}
            >
              <span className="absolute inset-4 rounded-full border-2 border-white/70" />
              <span className="absolute left-10 top-9 h-10 w-14 rotate-[-35deg] rounded-full bg-white/70 blur-md" />
              <span className="relative text-4xl">{status === "thinking" ? "✦" : status === "speaking" ? "◖◗" : "◉"}</span>
            </motion.button>
            </motion.div>
            <div className="mt-9 flex items-end gap-1.5" aria-hidden="true">
              {[0, 1, 2, 3, 4, 5, 6].map((bar) => (
                <span key={bar} className={`w-1.5 rounded-full bg-neutral-950 ${status === "idle" ? "h-2" : "tm-audio-bar h-7"}`} style={{ animationDelay: `${bar * .1}s` }} />
              ))}
            </div>
            <p className="mt-4 text-sm font-black uppercase tracking-[.16em] text-neutral-600">{orbState.label}</p>
          </div>
        )}

        {transcript && (
          <div className="mx-auto mb-5 max-w-2xl text-left">
            <p className="mb-2 text-xs font-black uppercase tracking-[.14em] text-neutral-500">You said</p>
            <p className="rounded-2xl border-2 border-neutral-950 bg-cyan-100 p-4 font-semibold leading-relaxed">
              {transcript}
            </p>
          </div>
        )}

        {reply && (
          <div className="mx-auto max-w-2xl text-left">
            <p className="mb-2 text-xs font-black uppercase tracking-[.14em] text-neutral-500">TravelMitra says</p>
            <p className="rounded-2xl border-2 border-neutral-950 bg-orange-100 p-4 font-semibold leading-relaxed">
              {reply}
            </p>
          </div>
        )}
      </section>
    </AppShell>
  );
}
