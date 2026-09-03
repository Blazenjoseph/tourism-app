import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";

export default function Booking() {
  const router = useRouter();
  const { id } = router.query;
  const [name, setName] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleBook(e) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId: id, name }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  return (
    <div>
      <nav className="navbar">
        <div className="container">
          <Link href="/" className="logo">
            TravelMitra
          </Link>
        </div>
      </nav>

      <div className="container detail-page">
        {!result && (
          <form onSubmit={handleBook} style={{ maxWidth: 400 }}>
            <h1>Confirm your booking</h1>
            <p style={{ color: "#888" }}>
              This is a mock payment for demo purposes — no real charge is made.
            </p>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                display: "block",
                width: "100%",
                padding: 12,
                margin: "16px 0",
                borderRadius: 8,
                border: "1px solid #ddd",
              }}
            />
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Processing..." : "Pay (Mock) & Confirm"}
            </button>
          </form>
        )}

        {result && result.qrDataUrl && (
          <div className="qr-box">
            <h1>Booking Confirmed 🎉</h1>
            <p>Confirmation ID: {result.confirmationId}</p>
            <img src={result.qrDataUrl} alt="Booking QR code" />
            <p>Show this QR code at check-in.</p>
          </div>
        )}
      </div>
    </div>
  );
}
