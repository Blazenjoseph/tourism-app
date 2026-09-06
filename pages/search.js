import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Search() {
  const router = useRouter();
  const { pincode } = router.query;
  const [listings, setListings] = useState([]);
  const [attractions, setAttractions] = useState(null);
  const [cityInfo, setCityInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attractionsLoading, setAttractionsLoading] = useState(true);
  const [attractionsError, setAttractionsError] = useState("");

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
          setCityInfo({ city: data.city, state: data.state });
        }
        setAttractionsLoading(false);
      })
      .catch(() => {
        setAttractionsError("Could not load attractions right now.");
        setAttractionsLoading(false);
      });
  }, [pincode]);

  return (
    <div>
      <nav className="navbar">
        <div className="container">
          <Link href="/" className="logo">
            TravelMitra
          </Link>
        </div>
      </nav>

      <div className="container">
        <h2 style={{ marginTop: 30 }}>
          {loading ? "Searching..." : `${listings.length} places near ${pincode}`}
          {cityInfo && (
            <span style={{ color: "#888", fontWeight: 400, fontSize: 16 }}>
              {" "}
              — {cityInfo.city}, {cityInfo.state}
            </span>
          )}
        </h2>

        <div className="grid">
          {listings.map((item) => (
            <Link key={item._id} href={`/listing/${item._id}`} className="card">
              <img src={item.image} alt={item.name} />
              <div className="card-body">
                <h3>{item.name}</h3>
                <div className="meta">
                  {item.type} · {item.city} · ⭐ {item.rating}
                </div>
                <div className="price">₹{item.price}</div>
              </div>
            </Link>
          ))}
        </div>

        {!loading && listings.length === 0 && (
          <p>
            No hotel/homestay listings in our database for this PIN code yet — but check the real nearby attractions below. (Try PIN 570001 for a full demo with sample hotels and guides.)
          </p>
        )}

        <div style={{ marginTop: 10, marginBottom: 60 }}>
          <h2>Nearby attractions to explore</h2>

          {attractionsLoading && <p>Loading real attraction data...</p>}

          {attractionsError && (
            <p style={{ color: "#888" }}>{attractionsError}</p>
          )}

          {attractions && attractions.length === 0 && !attractionsLoading && (
            <p style={{ color: "#888" }}>
              No listed attractions found nearby in the database we queried.
            </p>
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
