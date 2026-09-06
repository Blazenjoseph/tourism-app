export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { imageBase64, mimeType } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "imageBase64 is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res
        .status(500)
        .json({ error: "GEMINI_API_KEY is not set in .env.local" });
    }

    const prompt = `You are a heritage and cultural expert helping tourists in India understand monuments, statues, and historic sites.

Look at this image carefully and:
1. Try to identify the specific monument, statue, temple, or heritage site shown.
2. If you recognize it with reasonable confidence, explain: its name, historical background, cultural/religious significance, and one or two interesting facts.
3. If you are NOT confident about the exact identification, clearly say so upfront (e.g. "I can't confidently identify this specific monument, but here's what I can tell from the image style/architecture..."). Do not guess and present it as fact.
4. Keep the response conversational, under 200 words, and easy for a tourist to read.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: mimeType || "image/jpeg",
                    data: imageBase64,
                  },
                },
              ],
            },
          ],
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

    const explanation =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't analyze this image. Please try another photo.";

    res.status(200).json({ explanation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to analyze image" });
  }
}
