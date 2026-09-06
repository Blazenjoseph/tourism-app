
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { destination, days, budget, interests } = req.body;

    if (!destination || !days || !budget) {
      return res
        .status(400)
        .json({ error: "destination, days, and budget are required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res
        .status(500)
        .json({ error: "GEMINI_API_KEY is not set in .env.local" });
    }

    const prompt = `You are a travel planning assistant for Indian tourism.
Create a personalized ${days}-day itinerary for a trip to ${destination}.
Budget: ₹${budget} total.
Traveler interests: ${interests || "general sightseeing"}.

Format your response as clean, simple text with:
- A short one-line intro
- "Day 1", "Day 2", etc. as headers
- 2-4 bullet points per day (morning/afternoon/evening activities)
- Keep it realistic and practical, mentioning real-sounding local spots for ${destination}
- End with a short budget breakdown estimate

Keep the whole response under 400 words.`;

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

    const itinerary =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, no itinerary could be generated. Please try again.";

    res.status(200).json({ itinerary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate itinerary" });
  }
}
