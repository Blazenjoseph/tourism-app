import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ListingDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function loadReviews() {
    if (!id) return;
    setReviewsLoading(true);
    fetch(`/api/reviews?listingId=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data.reviews || []);
        setReviewsLoading(false);
      })
      .catch(() => setReviewsLoading(false));
  }

  useEffect(() => {
    if (!id) return;
    fetch(`/api/listings/${id}`)
      .then((res) => res.json())
      .then((data) => setListing(data.listing));
    loadReviews();
  }, [id]);

  async function handleSubmitReview(e) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: id, name, rating, comment }),
      });
      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error || "Something went wrong");
      } else {
        setSubmitted(true);
        setName("");
        setComment("");
        setRating(5);
        loadReviews();
      }
    } catch (err) {
      setSubmitError("Failed to submit review. Please try again.");
    }

    setSubmitting(false);
  }

  if (!listing) return <div className="container">Loading...</div>;

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div>
      <nav className="navbar">
        <div className="container">
          <Link href="/" className="logo">TravelMitra</Link>
          <div className="nav-links">
            <Link href="/trip-planner">AI Trip Planner</Link>
            <Link href="/heritage-explorer">Heritage Explorer</Link>
          </div>
        </div>
      </nav>

      <div className="container detail-page">
        <img src={listing.image} alt={listing.name} />
        <h1>{listing.name}</h1>
        <p className="meta">
          {listing.type} · {listing.city} · ⭐ {listing.rating}
          {avgRating && (
            <span> · {reviews.length} review{reviews.length !== 1 ? "s" : ""} (avg {avgRating}/5)</span>
          )}
        </p>
        <p>{listing.description}</p>
        <h2>₹{listing.price}</h2>
        <Link href={`/booking/${listing._id}`} className="btn">
          Book Now
        </Link>

        <div style={{ marginTop: 60, maxWidth: 600 }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 26 }}>Reviews</h2>

          {reviewsLoading && <p style={{ color: "#888" }}>Loading reviews...</p>}

          {!reviewsLoading && reviews.length === 0 && (
            <p style={{ color: "#888" }}>No reviews yet. Be the first to share your experience!</p>
          )}

          {reviews.map((r, i) => (
            <div
              key={i}
              style={{
                background: "white",
                padding: 18,
                borderRadius: 16,
                marginBottom: 14,
                boxShadow: "0 2px 10px rgba(60,40,20,0.05)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{r.name}</strong>
                <span>{"⭐".repeat(r.rating)}</span>
              </div>
              {r.comment && <p style={{ margin: "8px 0 0", color: "#555" }}>{r.comment}</p>}
            </div>
          ))}

          <div style={{ marginTop: 30 }}>
            <h3 style={{ fontSize: 18 }}>Leave a review</h3>

            {submitted ? (
              <p style={{ color: "#2e7d32" }}>Thanks for your review! 🎉</p>
            ) : (
              <form onSubmit={handleSubmitReview}>
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
                    marginBottom: 12,
                    borderRadius: 8,
                    border: "1px solid #ddd",
                  }}
                />

                <div style={{ marginBottom: 12 }}>
                  <label style={{ marginRight: 10, fontSize: 14, color: "#666" }}>
                    Rating:
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    style={{ padding: 8, borderRadius: 8, border: "1px solid #ddd" }}
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {"⭐".repeat(n)} ({n})
                      </option>
                    ))}
                  </select>
                </div>

                <textarea
                  placeholder="Share your experience (optional)"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: 12,
                    marginBottom: 12,
                    borderRadius: 8,
                    border: "1px solid #ddd",
                    fontFamily: "inherit",
                    resize: "vertical",
                  }}
                />

                {submitError && (
                  <p style={{ color: "#c0392b", marginBottom: 12 }}>{submitError}</p>
                )}

                <button type="submit" className="btn" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
