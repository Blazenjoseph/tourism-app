// pages/api/attractions.js
import { resolvePincode, attractionsCache } from "../../lib/pincodes";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { pincode } = req.query;
  if (!pincode) {
    return res.status(400).json({ error: "pincode is required" });
  }

  const pinStr = String(pincode).trim();

  // 1. Check in-memory cache
  if (attractionsCache.has(pinStr)) {
    const cached = attractionsCache.get(pinStr);
    if (Date.now() - cached.timestamp < 1000 * 60 * 60 * 12) { // 12 hours
      return res.status(200).json(cached.data);
    }
  }

  const otmKey = process.env.OPENTRIPMAP_API_KEY;

  try {
    const resolved = await resolvePincode(pinStr, otmKey);
    if (!resolved) {
      return res.status(404).json({
        error: "Could not find this PIN code. Please check and try again.",
      });
    }

    let attractions = resolved.attractions || [];

    // If no pre-known attractions, fetch from OpenTripMap
    if (attractions.length === 0 && resolved.lat && resolved.lng && otmKey) {
      try {
        const radiusResponse = await fetch(
          `https://api.opentripmap.com/0.1/en/places/radius?radius=15000&lon=${resolved.lng}&lat=${resolved.lat}&kinds=interesting_places,historic,cultural&limit=8&format=json&apikey=${otmKey}`,
          { signal: AbortSignal.timeout(3500) }
        );
        const attractionsRaw = await radiusResponse.json();

        if (Array.isArray(attractionsRaw)) {
          attractions = attractionsRaw
            .filter((place) => place.name && place.name.trim() !== "")
            .map((place) => ({
              name: place.name,
              rating: place.rate || null,
              distance_m: Math.round(place.dist || 0),
              lat: place.point?.lat || null,
              lng: place.point?.lon || null,
            }));
        }
      } catch (err) {
        console.warn("OpenTripMap radius fetch error, continuing with fallback:", err.message);
      }
    }

    const responseData = {
      pincode: pinStr,
      city: resolved.city,
      state: resolved.state,
      cityLat: resolved.lat,
      cityLng: resolved.lng,
      attractions,
    };

    attractionsCache.set(pinStr, {
      timestamp: Date.now(),
      data: responseData,
    });

    res.status(200).json(responseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch attractions" });
  }
}
