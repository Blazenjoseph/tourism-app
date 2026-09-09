import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const ListingsMap = dynamic(() => import("../components/ListingsMap"), {
  ssr: false,
});

function weatherDescription(code) {
  if (code === 0) return { text: "Clear sky", icon: "☀️" };
  if (code <= 3) return { text: "Partly cloudy", icon: "⛅" };
  if (code <= 48) return { text: "Foggy", icon: "🌫️" };
  if (code <= 67) return { text: "Rainy", icon: "🌧️" };
  if (code <= 77) return { text: "Snowy", icon: "❄️" };
  if (code <= 82) return { text: "Rain showers", icon: "🌦️" };
  if (code <= 99) return { text: "Thunderstorm", icon: "⛈️" };
  return { text: "Clear", icon: "🌤️" };
}

export default function Search() {
  const router = useRouter();
  const { pincode } = router.query;
  const [listings, setListings] = useState([]);
  const [attractions, setAttractions] = useState(null);
  const [cityInfo, setCityInfo] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attractionsLoading, setAttractionsLoading] = useState(true);
  const [attractionsError, setAttractionsError] = useState("");
  const [wishlistIds, setWishlistIds] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlistIds(saved.map((item) => item._id));
  }, []);

  function toggleWishlist(item) {
    const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const exists = saved.find((i) => i._id === item._id);
    let updated;
    if (exists) {
      updated = saved.filter((i) => i._id !== item._id);
    } else {
      updated = [...saved, item];
    }
    localStorage.setItem("wishlist", JSON.stringify(updated));
    setWishlistIds(updated.map((i) => i._id));
  }

  useEffect(() => {
    if (!pincode) return;

    setLoading(true);
    fetch(`/api/listings?pincode=${pincode}`)
      .then((res) => res.json())
      .then((data) => {
        setListings(data.listings || []);
        setLoading(false);
      });

    setAttractionsLoading(true);
    setAttractionsError("");
    fetch(`/api/attractions?pincode=${pincode}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setAttractionsError(data.error);
        } else {
          setAttractions(data.attractions || []);
          setCityInfo({ city: data.city, state: data.state, lat: data.cityLat, lng: data.cityLng });
        }
        setAttractionsLoading(false);
      })
      .catch(() => {
        setAttractionsError("Could not load attractions right now.");
        setAttractionsLoading(false);
      });

    fetch(`/api/weather?pincode=${pincode}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setWeather(data);
      })
      .catch(() => {});
  }, [pincode]);

  const mapCenter = !attractionsLoading;

  return (
    <div>
      <nav className="navbar">
        <div className="container">
          <Link href="/" className="logo">TravelMitra</Link>
          <div className="nav-links">
            <Link href="/trip-planner">AI Trip Planner</Link>
            <Link href="/heritage-explorer">Heritage Explorer</Link>
            <Link href="/wishlist">Wishlist</Link>
            <Link href="/packing-list">Packing List</Link>
            <Link href="/budget-tracker">Budget Tracker</Link>
            <Link href="/translator">Translator</Link>
            <Link href="/voice-assistant">Negotiator</Link>
          </div>
        </div>
      </nav>

      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginTop: 30 }}>
          <h2 style={{ margin: 0 }}>
            {loading ? "Searching..." : `${listings.length} places near ${pincode}`}
            {cityInfo && (
              <span style={{ color: "#888", fontWeight: 400, fontSize: 16 }}>
                {" "}— {cityInfo.city}, {cityInfo.state}
              </span>
            )}
          </h2>

          {weather && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "white",
              padding: "10px 18px",
              borderRadius: 30,
              boxShadow: "0 4px 14px rgba(60,40,20,0.08)",
            }}>
              <span style={{ fontSize: 22 }}>{weatherDescription(weather.weatherCode).icon}</span>
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{Math.round(weather.temperature)}°C</div>
                <div style={{ fontSize: 12, color: "#999" }}>{weatherDescription(weather.weatherCode).text}</div>
              </div>
            </div>
          )}
        </div>

        {mapCenter && (
          <div style={{ marginTop: 24 }}>
            <ListingsMap
              listings={listings}
              attractions={attractions}
              cityName={cityInfo?.city}
              cityCenter={cityInfo?.lat ? { lat: cityInfo.lat, lng: cityInfo.lng } : null}
            />
          </div>
        )}

        <div className="grid">
          {listings.map((item) => {
            const isSaved = wishlistIds.includes(item._id);
            return (
              <div key={item._id} className="card" style={{ position: "relative" }}>
                <Link href={`/listing/${item._id}`}>
                  <div className="img-wrap">
                    <img src={item.image} alt={item.name} />
                    <span className="price-badge">₹{item.price}</span>
                  </div>
                  <div className="card-body">
                    <h3>{item.name}</h3>
                    <div className="meta">
                      {item.type} · {item.city} · ⭐ {item.rating}
                    </div>
                  </div>
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleWishlist(item);
                  }}
                  style={{
                    position: "absolute",
                    top: 14,
                    left: 14,
                    background: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: 34,
                    height: 34,
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                    fontSize: 16,
                  }}
                  title={isSaved ? "Remove from wishlist" : "Save to wishlist"}
                >
                  {isSaved ? "❤️" : "🤍"}
                </button>
              </div>
            );
          })}
        </div>

        {!loading && listings.length === 0 && (
          <p>No hotel/homestay listings in our database for this PIN code yet — but check the real nearby attractions below. (Try PIN 570001 for a full demo with sample hotels and guides.)</p>
        )}

        <div style={{ marginTop: 10, marginBottom: 60 }}>
          <h2>Nearby attractions to explore</h2>

          {attractionsLoading && <p>Loading real attraction data...</p>}
          {attractionsError && <p style={{ color: "#888" }}>{attractionsError}</p>}

          {attractions && attractions.length === 0 && !attractionsLoading && (
            <p style={{ color: "#888" }}>No listed attractions found nearby.</p>
          )}

          {attractions && attractions.length > 0 && (
            <ul style={{ paddingLeft: 20, lineHeight: 1.9 }}>
              {attractions.map((a, i) => (
                <li key={i}>
                  <strong>{a.name}</strong>
                  {a.rating ? ` — rated ${a.rating}/7` : ""}
                  {a.distance_m ? ` (${(a.distance_m / 1000).toFixed(1)} km away)` : ""}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
