import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800";

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

  if (!listing) return <div className="min-h-screen bg-[#fff8f1] p-10 font-black">Loading your stay...</div>;

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <AppShell>
      <section className="overflow-hidden rounded-[2rem] border-[3px] border-neutral-950 bg-white shadow-[7px_7px_0_0_#171717]">
        <div className="relative h-72 border-b-[3px] border-neutral-950 sm:h-96">
          <img
            src={listing.image || FALLBACK_IMAGE}
            alt={listing.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
          <span className="absolute left-5 top-5 rounded-xl border-2 border-neutral-950 bg-yellow-300 px-3 py-1.5 text-sm font-black shadow-[2px_2px_0_0_#171717]">₹{listing.price}</span>
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <p className="text-xs font-black uppercase tracking-[.15em] text-orange-300">{listing.type} · {listing.city}</p>
            <h1 className="tm-heading mt-2 text-4xl leading-[.92] sm:text-6xl">{listing.name}</h1>
          </div>
        </div>
        <div className="grid gap-7 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="font-bold text-neutral-600">
              ⭐ {listing.rating}
          {avgRating && (
            <span> · {reviews.length} review{reviews.length !== 1 ? "s" : ""} (avg {avgRating}/5)</span>
          )}
            </p>
            <p className="mt-4 max-w-2xl font-medium leading-relaxed text-neutral-700">{listing.description}</p>
          </div>
          <Link href={`/booking/${listing._id}`} className="inline-flex items-center justify-center rounded-2xl border-2 border-neutral-950 bg-orange-400 px-6 py-4 text-sm font-black uppercase tracking-[.1em] text-neutral-950 shadow-[4px_4px_0_0_#171717] transition-all hover:-translate-y-0.5 hover:bg-pink-400">Book now →</Link>
        </div>
      </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1fr_.9fr]">
          <div className="tm-surface p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[.16em] text-fuchsia-700">Guest stories</p>
          <h2 className="tm-heading mt-2 text-3xl">Reviews</h2>

          {reviewsLoading && <p className="mt-5 font-semibold text-neutral-500">Loading reviews...</p>}

          {!reviewsLoading && reviews.length === 0 && (
            <p className="mt-5 font-semibold text-neutral-500">No reviews yet. Be the first to share your experience!</p>
          )}

          {reviews.map((r, i) => (
            <div
              key={i}
              className="mt-5 rounded-2xl border-2 border-neutral-950 bg-orange-50 p-4"
            >
              <div className="flex justify-between gap-3">
                <strong>{r.name}</strong>
                <span>{"⭐".repeat(r.rating)}</span>
              </div>
              {r.comment && <p className="mt-2 font-medium text-neutral-600">{r.comment}</p>}
            </div>
          ))}
          </div>

          <div className="tm-surface h-fit p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[.16em] text-fuchsia-700">Add yours</p>
            <h3 className="tm-heading mt-2 text-3xl">Leave a review</h3>

            {submitted ? (
              <p className="mt-5 rounded-xl border-2 border-emerald-700 bg-emerald-50 p-4 font-bold text-emerald-800">Thanks for your review! 🎉</p>
            ) : (
              <form onSubmit={handleSubmitReview} className="mt-5">
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="tm-input"
                />

                <div className="mt-3">
                  <label className="mr-3 text-sm font-bold text-neutral-600">
                    Rating:
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="rounded-lg border-2 border-neutral-950 bg-white px-3 py-2 font-bold"
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
                  className="tm-input mt-3 min-h-28 resize-y"
                />

                {submitError && (
                  <p className="mt-3 font-bold text-red-700">{submitError}</p>
                )}

                <button type="submit" className="mt-3 w-full rounded-2xl border-2 border-neutral-950 bg-fuchsia-300 px-5 py-3 font-black uppercase tracking-[.1em] text-neutral-950 shadow-[3px_3px_0_0_#171717] hover:bg-orange-300 disabled:cursor-not-allowed disabled:opacity-60" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            )}
          </div>
        </section>
    </AppShell>
  );
}
