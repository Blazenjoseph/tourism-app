export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text, targetLanguage, mode } = req.body;

    if (!text || !targetLanguage) {
      return res
        .status(400)
        .json({ error: "text and targetLanguage are required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res
        .status(500)
        .json({ error: "GEMINI_API_KEY is not set in .env.local" });
    }

    let prompt;
    if (mode === "negotiate") {
      prompt = `You are helping a tourist in India negotiate politely with a local vendor.
The tourist wants to say (in English): "${text}"
Target language: ${targetLanguage}

Provide:
1. A polite translation of their message in ${targetLanguage} (with English script/transliteration alongside if the language uses a different script)
2. 2-3 short, culturally appropriate alternative negotiation phrases in ${targetLanguage} they could also use, with English translation for each
3. One brief tip on respectful bargaining etiquette in India

Do NOT suggest or imply any specific market price — only phrasing. Keep the whole response under 200 words.`;
    } else {
      prompt = `Translate this English phrase into ${targetLanguage}, in a natural, everyday spoken style a tourist could use: "${text}"

Provide:
1. The translation in ${targetLanguage} script
2. A transliteration (how to pronounce it using English letters)

Keep the response short and clear, no extra commentary.`;
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      return res
        .status(500)
        .json({ error: data.error?.message || "Gemini API request failed" });
    }

    const result =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, no response could be generated. Please try again.";

    res.status(200).json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to translate" });
  }
}
