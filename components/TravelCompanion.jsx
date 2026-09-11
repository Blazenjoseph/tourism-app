import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function RobotAvatar({ size = 48, isThinking = false, isBlinking = true, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`overflow-visible ${className}`}
    >
      <defs>
        <linearGradient id="tmBotBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="50%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="tmBotScreen" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <filter id="tmBotGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Antenna */}
      <motion.g
        animate={
          isThinking
            ? { rotate: [-10, 10, -10] }
            : { rotate: [0, -3, 3, 0] }
        }
        transition={{
          duration: isThinking ? 0.7 : 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ transformOrigin: "32px 16px" }}
      >
        <line x1="32" y1="16" x2="32" y2="7" stroke="#171717" strokeWidth="2.5" strokeLinecap="round" />
        <motion.circle
          cx="32"
          cy="6"
          r="4"
          fill="#fbbf24"
          stroke="#171717"
          strokeWidth="2"
          animate={{
            scale: isThinking ? [1, 1.4, 1] : [1, 1.18, 1],
            fill: isThinking ? ["#fbbf24", "#f43f5e", "#fbbf24"] : "#fbbf24",
          }}
          transition={{ duration: isThinking ? 0.5 : 1.8, repeat: Infinity }}
        />
      </motion.g>

      {/* Side Ears / Bolts */}
      <rect x="8" y="24" width="4" height="10" rx="2" fill="#f97316" stroke="#171717" strokeWidth="2" />
      <rect x="52" y="24" width="4" height="10" rx="2" fill="#ec4899" stroke="#171717" strokeWidth="2" />

      {/* Head Outer */}
      <rect
        x="11"
        y="15"
        width="42"
        height="32"
        rx="12"
        fill="url(#tmBotBody)"
        stroke="#171717"
        strokeWidth="2.5"
      />

      {/* Face Screen */}
      <rect
        x="16"
        y="20"
        width="32"
        height="22"
        rx="7"
        fill="url(#tmBotScreen)"
        stroke="#171717"
        strokeWidth="1.5"
      />

      {/* Eyes */}
      <motion.g
        animate={
          isBlinking
            ? { scaleY: [1, 1, 1, 0.08, 1, 1, 1] }
            : {}
        }
        transition={{
          duration: 3.5,
          repeat: Infinity,
          times: [0, 0.42, 0.46, 0.49, 0.52, 0.58, 1],
        }}
        style={{ transformOrigin: "32px 29px" }}
      >
        <circle cx="25" cy="29" r="3.2" fill="#38bdf8" filter="url(#tmBotGlow)" />
        <circle cx="26" cy="28" r="1" fill="#ffffff" />
        <circle cx="39" cy="29" r="3.2" fill="#38bdf8" filter="url(#tmBotGlow)" />
        <circle cx="40" cy="28" r="1" fill="#ffffff" />
      </motion.g>

      {/* Blush Cheeks */}
      <circle cx="21" cy="35" r="1.5" fill="#f43f5e" opacity="0.65" />
      <circle cx="43" cy="35" r="1.5" fill="#f43f5e" opacity="0.65" />

      {/* Smile / Mouth */}
      {isThinking ? (
        <motion.path
          d="M 29 36 Q 32 38 35 36"
          stroke="#38bdf8"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
          animate={{ scaleX: [0.8, 1.25, 0.8] }}
          transition={{ duration: 0.7, repeat: Infinity }}
          style={{ transformOrigin: "32px 36px" }}
        />
      ) : (
        <path
          d="M 28 35 Q 32 39 36 35"
          stroke="#38bdf8"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
      )}

      {/* Minimal Body */}
      <path
        d="M 23 48 C 23 47 41 47 41 48 L 44 57 C 44 59 42 60 40 60 L 24 60 C 22 60 20 59 20 57 Z"
        fill="url(#tmBotBody)"
        stroke="#171717"
        strokeWidth="2.5"
      />
      {/* Body Light */}
      <circle cx="32" cy="54" r="2" fill="#fef08a" stroke="#171717" strokeWidth="1" />
    </svg>
  );
}

export default function TravelCompanion() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "model", text: "Namaste! 👋 I'm your TravelMitra assistant. Ask me anything about your trip!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/companion-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.text,
          history: newMessages.slice(1).map((m) => ({ role: m.role, text: m.text })),
        }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "model", text: data.reply || data.error || "Something went wrong." },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "Sorry, I couldn't connect. Please try again." },
      ]);
    }

    setLoading(false);
  }

  return (
    <>
      {/* Launcher Button with Animated Robot Avatar */}
      <motion.button
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={open ? { y: 0 } : { y: [0, -6, 0] }}
        transition={open ? {} : { duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 62,
          height: 62,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #f97316 0%, #ec4899 50%, #8b5cf6 100%)",
          border: "2.5px solid #171717",
          color: "white",
          cursor: "pointer",
          boxShadow: "4px 4px 0px 0px #171717",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          outline: "none",
        }}
        title={open ? "Close chat" : "Chat with TravelMitra AI"}
        aria-label="AI Travel Companion"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.2 }}
              style={{ fontSize: 24, fontWeight: "900", lineHeight: 1 }}
            >
              ✕
            </motion.span>
          ) : (
            <motion.div
              key="robot"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <RobotAvatar size={44} isThinking={isHovered} isBlinking={true} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Expanded Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 24 }}
            transition={{ type: "spring", damping: 25, stiffness: 320 }}
            style={{
              position: "fixed",
              bottom: 96,
              right: 24,
              width: 350,
              maxWidth: "92vw",
              height: 460,
              maxHeight: "72vh",
              background: "#ffffff",
              borderRadius: 24,
              border: "3px solid #171717",
              boxShadow: "6px 6px 0px 0px #171717",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              zIndex: 100,
            }}
          >
            {/* Header with Robot Avatar and Online Status */}
            <div
              style={{
                background: "linear-gradient(135deg, #f97316 0%, #ec4899 60%, #8b5cf6 100%)",
                color: "white",
                padding: "12px 16px",
                borderBottom: "2px solid #171717",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "50%",
                    padding: 3,
                    border: "1.5px solid rgba(255,255,255,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <RobotAvatar size={30} isThinking={loading} isBlinking={true} />
                </div>
                <div>
                  <div style={{ fontWeight: 900, fontSize: 14.5, letterSpacing: "-0.02em" }}>
                    TravelMitra AI
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      opacity: 0.92,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: loading ? "#fef08a" : "#4ade80",
                        boxShadow: "0 0 6px currentColor",
                      }}
                    />
                    {loading ? "Thinking..." : "Always online"}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                style={{
                  background: "rgba(0,0,0,0.2)",
                  border: "none",
                  color: "white",
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: "bold",
                }}
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Messages List */}
            <div style={{ flex: 1, overflowY: "auto", padding: 14, background: "#fffdfa" }}>
              {messages.map((m, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 8,
                    justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                    marginBottom: 12,
                  }}
                >
                  {m.role === "model" && (
                    <div
                      style={{
                        flexShrink: 0,
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        background: "#fff",
                        border: "1.5px solid #171717",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                      }}
                    >
                      <RobotAvatar size={22} isThinking={false} isBlinking={false} />
                    </div>
                  )}

                  <div
                    style={{
                      background: m.role === "user" ? "#171717" : "#fff",
                      color: m.role === "user" ? "#ffffff" : "#171717",
                      padding: "10px 14px",
                      borderRadius: 16,
                      border: "2px solid #171717",
                      boxShadow: m.role === "user" ? "2px 2px 0 0 #f97316" : "2px 2px 0 0 #171717",
                      maxWidth: "80%",
                      fontSize: 13.5,
                      fontWeight: 500,
                      lineHeight: 1.45,
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {/* AI Thinking Animation */}
              {loading && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: "#fff",
                      border: "1.5px solid #171717",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <RobotAvatar size={22} isThinking={true} isBlinking={false} />
                  </div>
                  <div
                    style={{
                      background: "#fef3c7",
                      border: "2px solid #171717",
                      padding: "8px 12px",
                      borderRadius: 14,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      boxShadow: "2px 2px 0 0 #171717",
                    }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 800, color: "#78350f" }}>Thinking</span>
                    <motion.span
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                      style={{ fontSize: 14, fontWeight: "bold", color: "#d97706" }}
                    >
                      ●
                    </motion.span>
                    <motion.span
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                      style={{ fontSize: 14, fontWeight: "bold", color: "#d97706" }}
                    >
                      ●
                    </motion.span>
                    <motion.span
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                      style={{ fontSize: 14, fontWeight: "bold", color: "#d97706" }}
                    >
                      ●
                    </motion.span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={sendMessage}
              style={{
                display: "flex",
                borderTop: "2px solid #171717",
                padding: "10px",
                background: "#ffffff",
                gap: 8,
              }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your trip..."
                style={{
                  flex: 1,
                  border: "2px solid #171717",
                  borderRadius: 12,
                  outline: "none",
                  padding: "9px 12px",
                  fontSize: 13.5,
                  fontWeight: 600,
                  background: "#fff8f1",
                  fontFamily: "inherit",
                }}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                style={{
                  background: "#f97316",
                  color: "#171717",
                  border: "2px solid #171717",
                  borderRadius: 12,
                  padding: "0 14px",
                  fontWeight: 900,
                  fontSize: 15,
                  cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                  opacity: loading || !input.trim() ? 0.5 : 1,
                  boxShadow: "2px 2px 0 0 #171717",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ➤
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
