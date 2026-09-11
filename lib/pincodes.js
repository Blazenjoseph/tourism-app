// lib/pincodes.js
// Fast local lookup and in-memory cache for Indian PIN codes, coordinates, and top attractions.

const knownPincodes = {
  "570001": {
    city: "Mysore",
    state: "Karnataka",
    lat: 12.3052,
    lng: 76.6552,
    attractions: [
      { name: "Mysore Palace", rating: 7, distance_m: 350, lat: 12.3051, lng: 76.6551 },
      { name: "Devaraja Market", rating: 5, distance_m: 600, lat: 12.3101, lng: 76.6519 },
      { name: "Jaganmohan Palace & Art Gallery", rating: 6, distance_m: 850, lat: 12.3082, lng: 76.6496 },
      { name: "Sri Chamarajendra Zoological Gardens (Mysore Zoo)", rating: 7, distance_m: 1400, lat: 12.3023, lng: 76.6644 },
      { name: "St. Philomena's Cathedral", rating: 6, distance_m: 1900, lat: 12.3213, lng: 76.6582 },
      { name: "Karanji Lake & Nature Park", rating: 5, distance_m: 2300, lat: 12.3025, lng: 76.6742 },
      { name: "Chamundeshwari Temple (Chamundi Hill)", rating: 7, distance_m: 5200, lat: 12.2753, lng: 76.6705 },
      { name: "Brindavan Gardens", rating: 6, distance_m: 14500, lat: 12.4262, lng: 76.5728 },
    ],
  },
  "570010": {
    city: "Mysore Chamundi",
    state: "Karnataka",
    lat: 12.2724,
    lng: 76.6693,
    attractions: [
      { name: "Chamundi Hill Steps & Viewpoint", rating: 7, distance_m: 400, lat: 12.2720, lng: 76.6690 },
      { name: "Chamundeshwari Temple", rating: 7, distance_m: 650, lat: 12.2753, lng: 76.6705 },
      { name: "Nandi Monolithic Bull Statue", rating: 6, distance_m: 1100, lat: 12.2812, lng: 76.6718 },
      { name: "Mysore Palace", rating: 7, distance_m: 4800, lat: 12.3051, lng: 76.6551 },
    ],
  },
  "403001": {
    city: "Panaji",
    state: "Goa",
    lat: 15.4909,
    lng: 73.8278,
    attractions: [
      { name: "Fontainhas Latin Quarter", rating: 7, distance_m: 400, lat: 15.4950, lng: 73.8320 },
      { name: "Our Lady of the Immaculate Conception Church", rating: 7, distance_m: 500, lat: 15.4989, lng: 73.8288 },
      { name: "Miramar Beach", rating: 6, distance_m: 3200, lat: 15.4820, lng: 73.8070 },
      { name: "Dona Paula Viewpoint", rating: 6, distance_m: 5800, lat: 15.4540, lng: 73.8030 },
      { name: "Basilica of Bom Jesus (Old Goa)", rating: 7, distance_m: 9500, lat: 15.5009, lng: 73.9116 },
      { name: "Aguada Fort & Lighthouse", rating: 7, distance_m: 11000, lat: 15.4925, lng: 73.7735 },
    ],
  },
  "175131": {
    city: "Manali",
    state: "Himachal Pradesh",
    lat: 32.2432,
    lng: 77.1892,
    attractions: [
      { name: "Hadimba Temple", rating: 7, distance_m: 1200, lat: 32.2483, lng: 77.1706 },
      { name: "Old Manali Village & Cafes", rating: 6, distance_m: 1800, lat: 32.2530, lng: 77.1750 },
      { name: "Jogini Waterfall", rating: 7, distance_m: 3800, lat: 32.2700, lng: 77.1950 },
      { name: "Vashisht Hot Water Springs & Temple", rating: 6, distance_m: 2900, lat: 32.2610, lng: 77.1980 },
      { name: "Solang Valley Adventures", rating: 7, distance_m: 11500, lat: 32.3160, lng: 77.1570 },
      { name: "Atal Tunnel South Portal", rating: 7, distance_m: 24000, lat: 32.3630, lng: 77.1330 },
    ],
  },
  "302001": {
    city: "Jaipur",
    state: "Rajasthan",
    lat: 26.9124,
    lng: 75.7873,
    attractions: [
      { name: "Hawa Mahal", rating: 7, distance_m: 1800, lat: 26.9239, lng: 75.8267 },
      { name: "City Palace Jaipur", rating: 7, distance_m: 2100, lat: 26.9258, lng: 75.8236 },
      { name: "Jantar Mantar", rating: 7, distance_m: 2200, lat: 26.9248, lng: 75.8246 },
      { name: "Albert Hall Museum", rating: 6, distance_m: 2500, lat: 26.9116, lng: 75.8195 },
      { name: "Amer Fort (Amber Palace)", rating: 7, distance_m: 9500, lat: 26.9855, lng: 75.8513 },
      { name: "Nahargarh Fort Sunset Point", rating: 7, distance_m: 6200, lat: 26.9373, lng: 75.8157 },
    ],
  },
  "560001": {
    city: "Bengaluru",
    state: "Karnataka",
    lat: 12.9716,
    lng: 77.5946,
    attractions: [
      { name: "Cubbon Park", rating: 6, distance_m: 500, lat: 12.9763, lng: 77.5929 },
      { name: "Vidhana Soudha", rating: 7, distance_m: 900, lat: 12.9796, lng: 77.5908 },
      { name: "Bangalore Palace", rating: 6, distance_m: 3100, lat: 12.9988, lng: 77.5921 },
      { name: "Lalbagh Botanical Garden", rating: 7, distance_m: 3400, lat: 12.9507, lng: 77.5848 },
    ],
  },
  "110001": {
    city: "New Delhi",
    state: "Delhi",
    lat: 28.6304,
    lng: 77.2177,
    attractions: [
      { name: "Connaught Place", rating: 6, distance_m: 300, lat: 28.6315, lng: 77.2167 },
      { name: "India Gate", rating: 7, distance_m: 2200, lat: 28.6129, lng: 77.2295 },
      { name: "Rashtrapati Bhavan", rating: 7, distance_m: 3100, lat: 28.6143, lng: 77.1994 },
      { name: "Red Fort", rating: 7, distance_m: 4200, lat: 28.6562, lng: 77.2410 },
      { name: "Humayun's Tomb", rating: 7, distance_m: 5100, lat: 28.5933, lng: 77.2507 },
    ],
  },
};

// Global in-memory cache for dynamic pincodes across fast refreshes
if (!global._tmPincodeCache) {
  global._tmPincodeCache = new Map();
}
if (!global._tmWeatherCache) {
  global._tmWeatherCache = new Map();
}
if (!global._tmAttractionsCache) {
  global._tmAttractionsCache = new Map();
}

const pincodeCache = global._tmPincodeCache;
const weatherCache = global._tmWeatherCache;
const attractionsCache = global._tmAttractionsCache;

/**
 * Resolves a 6-digit Indian PIN code to city, state, lat, lng with 0ms fast path.
 */
export async function resolvePincode(pincode, otmKey) {
  const pinStr = String(pincode).trim();

  // 1. Check predefined lookup
  if (knownPincodes[pinStr]) {
    return { ...knownPincodes[pinStr], pincode: pinStr, cached: true };
  }

  // 2. Check dynamic cache
  if (pincodeCache.has(pinStr)) {
    return pincodeCache.get(pinStr);
  }

  // 3. Fallback to Postal API + OpenTripMap Geocoding
  try {
    const postPromise = fetch(`https://api.postalpincode.in/pincode/${pinStr}`, {
      signal: AbortSignal.timeout(3500),
    }).then((r) => r.json());

    const postData = await postPromise;
    const postOffice = postData?.[0]?.PostOffice?.[0];
    if (!postOffice) {
      return null;
    }

    const cityName = postOffice.District || postOffice.Name;
    const state = postOffice.State;

    let lat = null;
    let lng = null;

    if (otmKey) {
      try {
        const geoRes = await fetch(
          `https://api.opentripmap.com/0.1/en/places/geoname?name=${encodeURIComponent(
            cityName
          )}&country=IN&apikey=${otmKey}`,
          { signal: AbortSignal.timeout(3000) }
        );
        const geoData = await geoRes.json();
        if (geoData?.lat) {
          lat = geoData.lat;
          lng = geoData.lon;
        }
      } catch (e) {
        // Continue without lat/lng
      }
    }

    const resolved = {
      pincode: pinStr,
      city: cityName,
      state,
      lat,
      lng,
    };

    pincodeCache.set(pinStr, resolved);
    return resolved;
  } catch (err) {
    console.error("resolvePincode error:", err);
    return null;
  }
}

export { knownPincodes, weatherCache, attractionsCache };
