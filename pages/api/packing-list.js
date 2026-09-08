export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { destination, days, tripType } = req.body;

    if (!destination || !days) {
      return res
        .status(400)
        .json({ error: "destination and days are required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res
        .status(500)
        .json({ error: "GEMINI_API_KEY is not set in .env.local" });
    }

    const prompt = `You are a travel packing assistant for Indian tourism.
Generate a practical packing list for a ${days}-day trip to ${destination}, India.
Trip type/focus: ${tripType || "general sightseeing"}.

Consider the likely climate and season for ${destination} and the trip type when deciding what to include.

Format as clean categorized bullet points with these categories (only include categories that are relevant):
- Clothing
- Documents & essentials
- Health & toiletries
- Electronics
- Trip-specific items (based on the trip type/destination)

Keep it practical and concise — no more than 20 total items across all categories. Keep the whole response under 300 words.`;

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

    const packingList =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, no packing list could be generated. Please try again.";

    res.status(200).json({ packingList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate packing list" });
  }
}
