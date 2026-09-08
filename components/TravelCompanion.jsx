import { useState, useRef, useEffect } from "react";

export default function TravelCompanion() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "model", text: "Namaste! 👋 I'm your TravelMitra assistant. Ask me anything about your trip!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
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
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #ec7a3f, #d9622b)",
          border: "none",
          color: "white",
          fontSize: 26,
          cursor: "pointer",
          boxShadow: "0 8px 24px rgba(217, 98, 43, 0.4)",
          zIndex: 100,
        }}
        title="Chat with TravelMitra AI"
      >
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 96,
            right: 24,
            width: 340,
            maxWidth: "90vw",
            height: 440,
            maxHeight: "70vh",
            background: "white",
            borderRadius: 20,
            boxShadow: "0 16px 48px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 100,
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #ec7a3f, #d9622b)",
              color: "white",
              padding: "14px 18px",
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            TravelMitra Assistant
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    background: m.role === "user" ? "#d9622b" : "#f2f0ed",
                    color: m.role === "user" ? "white" : "#222",
                    padding: "9px 14px",
                    borderRadius: 16,
                    maxWidth: "80%",
                    fontSize: 13.5,
                    lineHeight: 1.4,
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ fontSize: 13, color: "#999" }}>Typing...</div>
            )}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={sendMessage} style={{ display: "flex", borderTop: "1px solid #eee", padding: 10 }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your trip..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                padding: "8px 10px",
                fontSize: 13.5,
                fontFamily: "inherit",
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                background: "#d9622b",
                color: "white",
                border: "none",
                borderRadius: 10,
                padding: "8px 14px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}
