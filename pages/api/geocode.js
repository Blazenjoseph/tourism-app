export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { city } = req.query;
  if (!city) {
    return res.status(400).json({ error: "city is required" });
  }

  const otmKey = process.env.OPENTRIPMAP_API_KEY;
  if (!otmKey) {
    return res
      .status(500)
      .json({ error: "OPENTRIPMAP_API_KEY is not set in .env.local" });
  }

  try {
    const geoResponse = await fetch(
      `https://api.opentripmap.com/0.1/en/places/geoname?name=${encodeURIComponent(
        city
      )}&country=IN&apikey=${otmKey}`
    );
    const geoData = await geoResponse.json();

    if (!geoData || !geoData.lat) {
      return res.status(404).json({ error: `Could not locate ${city}.` });
    }

    res.status(200).json({ lat: geoData.lat, lng: geoData.lon });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to geocode city" });
  }
}
