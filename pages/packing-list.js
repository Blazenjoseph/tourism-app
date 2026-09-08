import { useState } from "react";
import Link from "next/link";

export default function PackingList() {
  const [form, setForm] = useState({ destination: "", days: "", tripType: "" });
  const [list, setList] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setList("");

    try {
      const res = await fetch("/api/packing-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setList(data.packingList);
      }
    } catch (err) {
      setError("Failed to reach the server. Please try again.");
    }

    setLoading(false);
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
        <h1>AI Packing List 🎒</h1>
        <p style={{ color: "#666" }}>
          Get a personalized packing list based on your destination and trip type.
        </p>

        <form onSubmit={handleSubmit} style={{ maxWidth: 480, marginTop: 20 }}>
          <input
            type="text"
            name="destination"
            placeholder="Destination (e.g. Manali)"
            value={form.destination}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="number"
            name="days"
            placeholder="Number of days (e.g. 5)"
            value={form.days}
            onChange={handleChange}
            required
            min="1"
            style={inputStyle}
          />
          <input
            type="text"
            name="tripType"
            placeholder="Trip type (e.g. trekking, beach, pilgrimage, business)"
            value={form.tripType}
            onChange={handleChange}
            style={inputStyle}
          />
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Generating..." : "Generate Packing List"}
          </button>
        </form>

        {error && <p style={{ color: "#c0392b", marginTop: 20 }}>Error: {error}</p>}

        {list && (
          <div
            style={{
              marginTop: 30,
              maxWidth: 600,
              background: "white",
              padding: 24,
              borderRadius: 16,
              whiteSpace: "pre-wrap",
              lineHeight: 1.6,
              boxShadow: "0 2px 10px rgba(60,40,20,0.05)",
            }}
          >
            {list}
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: 12,
  marginBottom: 14,
  borderRadius: 8,
  border: "1px solid #ddd",
  fontSize: 15,
};
