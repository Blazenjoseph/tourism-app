export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { pincode } = req.query;
  if (!pincode) {
    return res.status(400).json({ error: "pincode is required" });
  }

  const otmKey = process.env.OPENTRIPMAP_API_KEY;

  try {
    const postResponse = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`
    );
    const postData = await postResponse.json();
    const postOffice = postData?.[0]?.PostOffice?.[0];

    if (!postOffice) {
      return res.status(404).json({ error: "Could not find this PIN code." });
    }

    const cityName = postOffice.District || postOffice.Name;

    const geoResponse = await fetch(
      `https://api.opentripmap.com/0.1/en/places/geoname?name=${encodeURIComponent(
        cityName
      )}&country=IN&apikey=${otmKey}`
    );
    const geoData = await geoResponse.json();

    if (!geoData || !geoData.lat) {
      return res.status(404).json({ error: `Could not locate ${cityName}.` });
    }

    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${geoData.lat}&longitude=${geoData.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
    );
    const weatherData = await weatherResponse.json();

    const current = weatherData?.current;
    if (!current) {
      return res.status(500).json({ error: "Weather data unavailable." });
    }

    res.status(200).json({
      city: cityName,
      temperature: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      weatherCode: current.weather_code,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch weather" });
  }
}
