export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { pincode } = req.query;
  if (!pincode) {
    return res.status(400).json({ error: "pincode is required" });
  }

  const otmKey = process.env.OPENTRIPMAP_API_KEY;
  if (!otmKey) {
    return res
      .status(500)
      .json({ error: "OPENTRIPMAP_API_KEY is not set in .env.local" });
  }

  try {
    const postResponse = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`
    );
    const postData = await postResponse.json();

    const postOffice = postData?.[0]?.PostOffice?.[0];
    if (!postOffice) {
      return res.status(404).json({
        error: "Could not find this PIN code. Please check and try again.",
      });
    }

    const cityName = postOffice.District || postOffice.Name;
    const state = postOffice.State;

    const geoResponse = await fetch(
      `https://api.opentripmap.com/0.1/en/places/geoname?name=${encodeURIComponent(
        cityName
      )}&country=IN&apikey=${otmKey}`
    );
    const geoData = await geoResponse.json();

    if (!geoData || geoData.status === "error" || !geoData.lat) {
      return res.status(404).json({
        error: `Could not locate "${cityName}" for attractions lookup.`,
      });
    }

    const radiusResponse = await fetch(
      `https://api.opentripmap.com/0.1/en/places/radius?radius=15000&lon=${geoData.lon}&lat=${geoData.lat}&kinds=interesting_places,historic,cultural&limit=8&format=json&apikey=${otmKey}`
    );
    const attractionsRaw = await radiusResponse.json();

    const attractions = (attractionsRaw || [])
      .filter((place) => place.name && place.name.trim() !== "")
      .map((place) => ({
        name: place.name,
        rating: place.rate || null,
        distance_m: Math.round(place.dist),
        lat: place.point?.lat || null,
        lng: place.point?.lon || null,
      }));

    res.status(200).json({
      pincode,
      city: cityName,
      state,
      cityLat: geoData.lat,
      cityLng: geoData.lon,
      attractions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch attractions" });
  }
}
