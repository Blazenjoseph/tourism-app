export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res
        .status(500)
        .json({ error: "GEMINI_API_KEY is not set in .env.local" });
    }

    const systemContext = `You are TravelMitra's AI travel assistant for tourists in India. You help with destination questions, itinerary tweaks, local customs, safety tips, and general travel advice. Keep answers concise (under 100 words unless the user asks for detail), friendly, and practical. If asked something outside travel, gently redirect to travel topics.`;

    const contents = [
      { role: "user", parts: [{ text: systemContext }] },
      { role: "model", parts: [{ text: "Understood! I'm ready to help travelers with their trip questions." }] },
    ];

    if (Array.isArray(history)) {
      history.forEach((turn) => {
        contents.push({
          role: turn.role === "user" ? "user" : "model",
          parts: [{ text: turn.text }],
        });
      });
    }

    contents.push({ role: "user", parts: [{ text: message }] });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      return res
        .status(500)
        .json({ error: data.error?.message || "Gemini API request failed" });
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't process that. Please try again.";

    res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get a response" });
  }
}
