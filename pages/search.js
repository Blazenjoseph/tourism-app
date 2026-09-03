import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Search() {
  const router = useRouter();
  const { pincode } = router.query;
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pincode) return;
    setLoading(true);
    fetch(`/api/listings?pincode=${pincode}`)
      .then((res) => res.json())
      .then((data) => {
        setListings(data.listings || []);
        setLoading(false);
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
          <p>No listings found for this PIN code yet. Try 570001 (Mysore).</p>
        )}
      </div>
    </div>
  );
}
