import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ListingDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [listing, setListing] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/listings/${id}`)
      .then((res) => res.json())
      .then((data) => setListing(data.listing));
  }, [id]);

  if (!listing) return <div className="container">Loading...</div>;

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
        <img src={listing.image} alt={listing.name} />
        <h1>{listing.name}</h1>
        <p className="meta">
          {listing.type} · {listing.city} · ⭐ {listing.rating}
        </p>
        <p>{listing.description}</p>
        <h2>₹{listing.price}</h2>
        <Link href={`/booking/${listing._id}`} className="btn">
          Book Now
        </Link>
      </div>
    </div>
  );
}
