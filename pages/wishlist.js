import { useEffect, useState } from "react";
import Link from "next/link";

export default function Wishlist() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setItems(saved);
  }, []);

  function removeItem(id) {
    const updated = items.filter((item) => item._id !== id);
    setItems(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  }

  return (
    <div>
      <nav className="navbar">
        <div className="container">
          <Link href="/" className="logo">TravelMitra</Link>
          <div className="nav-links">
            <Link href="/trip-planner">AI Trip Planner</Link>
            <Link href="/heritage-explorer">Heritage Explorer</Link>
            <Link href="/wishlist">Wishlist</Link>
          </div>
        </div>
      </nav>

      <div className="container detail-page">
        <h1>Your Wishlist</h1>
        <p style={{ color: "#666" }}>Places you've saved for later.</p>

        {items.length === 0 && (
          <p style={{ color: "#888", marginTop: 30 }}>
            No saved places yet. Browse listings and tap the ♡ icon to save one.
          </p>
        )}

        <div className="grid">
          {items.map((item) => (
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
                onClick={() => removeItem(item._id)}
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
                title="Remove from wishlist"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
