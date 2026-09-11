import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { AppShell } from "@/components/app-shell";

const ListingsMap = dynamic(() => import("../components/ListingsMap"), {
  ssr: false,
});

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800";

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
  const [activeFilter, setActiveFilter] = useState("all");

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
      })
      .catch(() => setLoading(false));

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

  const filteredListings = useMemo(() => {
    if (activeFilter === "all") return listings;
    return listings.filter((l) => l.type?.toLowerCase() === activeFilter.toLowerCase());
  }, [listings, activeFilter]);

  const filterCounts = useMemo(() => {
    const counts = { all: listings.length };
    listings.forEach((l) => {
      const t = l.type?.toLowerCase();
      if (t) counts[t] = (counts[t] || 0) + 1;
    });
    return counts;
  }, [listings]);

  const mapCenter = !attractionsLoading;

  return (
    <AppShell>
      <section className="relative overflow-hidden rounded-[2rem] border-[3px] border-neutral-950 bg-neutral-950 px-6 py-8 text-white shadow-[7px_7px_0_0_#f97316] sm:px-9">
        <div className="absolute -right-12 -top-10 h-48 w-48 rounded-full bg-fuchsia-500 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[.18em] text-orange-300">Your local radar</p>
            <h1 className="tm-heading mt-2 text-3xl sm:text-5xl">
              {loading ? "Searching..." : `${listings.length} places near ${pincode}`}
              {cityInfo && (
                <span className="ml-2 block text-base font-bold tracking-normal text-white/65 sm:inline">
                  {" "}— {cityInfo.city}, {cityInfo.state}
                </span>
              )}
            </h1>
          </div>

          {weather && (
            <div className="relative flex items-center gap-3 rounded-2xl border-2 border-white bg-white px-4 py-3 text-neutral-950 shadow-[3px_3px_0_0_#f97316]">
              <span style={{ fontSize: 22 }}>{weatherDescription(weather.weatherCode).icon}</span>
              <div style={{ lineHeight: 1.2 }}>
                <div className="text-sm font-black">{Math.round(weather.temperature)}°C</div>
                <div className="text-xs font-bold text-neutral-500">{weatherDescription(weather.weatherCode).text}</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {mapCenter && (
        <div className="mt-8 overflow-hidden rounded-[1.75rem] border-[3px] border-neutral-950 bg-white p-2 shadow-[5px_5px_0_0_#171717]">
          <ListingsMap
            listings={listings}
            attractions={attractions}
            cityName={cityInfo?.city}
            cityCenter={cityInfo?.lat ? { lat: cityInfo.lat, lng: cityInfo.lng } : null}
          />
        </div>
      )}

      {/* Categories Filter Bar */}
      {listings.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: "All" },
            { id: "homestay", label: "Homestays" },
            { id: "hotel", label: "Hotels" },
            { id: "guide", label: "Guides" },
            { id: "experience", label: "Experiences" },
          ].map((cat) => {
            const count = filterCounts[cat.id] ?? 0;
            if (cat.id !== "all" && count === 0) return null;
            const isActive = activeFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`rounded-full border-2 border-neutral-950 px-4 py-1.5 text-xs font-black uppercase tracking-wider transition-all ${
                  isActive
                    ? "bg-neutral-950 text-white shadow-[3px_3px_0_0_#f97316]"
                    : "bg-white text-neutral-800 shadow-[2px_2px_0_0_#171717] hover:bg-orange-100"
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Listings Grid with Skeleton Loading */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          [1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-80 animate-pulse rounded-[1.75rem] border-[3px] border-neutral-950 bg-white/70 p-4 shadow-[5px_5px_0_0_#171717]"
            >
              <div className="h-44 rounded-2xl bg-neutral-200" />
              <div className="mt-4 h-6 w-3/4 rounded-md bg-neutral-200" />
              <div className="mt-2 h-4 w-1/2 rounded-md bg-neutral-200" />
            </div>
          ))
        ) : (
          filteredListings.map((item) => {
            const isSaved = wishlistIds.includes(item._id);
            return (
              <div
                key={item._id}
                className="group relative overflow-hidden rounded-[1.75rem] border-[3px] border-neutral-950 bg-white shadow-[5px_5px_0_0_#171717] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#171717]"
              >
                <Link href={`/listing/${item._id}`}>
                  <div className="relative h-52 overflow-hidden border-b-2 border-neutral-950 bg-neutral-100">
                    <img
                      src={item.image || FALLBACK_IMAGE}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute right-3 top-3 rounded-xl border-2 border-neutral-950 bg-yellow-300 px-3 py-1.5 text-sm font-black shadow-[2px_2px_0_0_#171717]">
                      ₹{item.price}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="tm-heading text-2xl">{item.name}</h3>
                    <div className="mt-2 text-sm font-bold text-neutral-600">
                      {item.type} · {item.city} · ⭐ {item.rating}
                    </div>
                  </div>
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleWishlist(item);
                  }}
                  className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border-2 border-neutral-950 bg-white text-base shadow-[2px_2px_0_0_#171717] transition-colors hover:bg-rose-300"
                  title={isSaved ? "Remove from wishlist" : "Save to wishlist"}
                >
                  {isSaved ? "❤️" : "🤍"}
                </button>
              </div>
            );
          })
        )}
      </div>

      {!loading && listings.length === 0 && (
        <p className="mt-10 rounded-2xl border-2 border-neutral-950 bg-yellow-100 p-5 font-semibold leading-relaxed">
          No hotel/homestay listings in our database for this PIN code yet — but check the real nearby attractions below. (Try PIN 570001, 403001, or 175131 for curated stays and tours.)
        </p>
      )}

      <section className="tm-surface my-10 p-5 sm:p-7">
        <p className="text-xs font-black uppercase tracking-[.16em] text-fuchsia-700">Pinpoint picks</p>
        <h2 className="tm-heading mt-2 text-3xl">Nearby attractions to explore</h2>

        {attractionsLoading && <p className="mt-5 font-semibold text-neutral-500">Loading real attraction data...</p>}
        {attractionsError && <p className="mt-5 font-semibold text-neutral-500">{attractionsError}</p>}

        {attractions && attractions.length === 0 && !attractionsLoading && (
          <p className="mt-5 font-semibold text-neutral-500">No listed attractions found nearby.</p>
        )}

        {attractions && attractions.length > 0 && (
          <ul className="mt-5 grid gap-3">
            {attractions.map((a, i) => (
              <li key={i} className="rounded-xl border-2 border-neutral-950 bg-orange-50 px-4 py-3 font-semibold">
                <strong>{a.name}</strong>
                {a.rating ? ` — rated ${a.rating}/7` : ""}
                {a.distance_m ? ` (${(a.distance_m / 1000).toFixed(1)} km away)` : ""}
              </li>
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  );
}
