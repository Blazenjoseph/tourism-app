import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Home() {
  const [pincode, setPincode] = useState("");
  const router = useRouter();

  function handleSearch(e) {
    e.preventDefault();
    if (!pincode.trim()) return;
    router.push(`/search?pincode=${pincode.trim()}`);
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

      <section className="hero">
        <div className="container">
          <span className="eyebrow">✨ AI-Powered Travel, Made for India</span>
          <h1>Discover local stays, guides & experiences</h1>
          <p>Enter your destination PIN code to explore what's nearby</p>
          <form className="search-box" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Enter PIN code, e.g. 570001"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            />
            <button type="submit" className="btn">Explore</button>
          </form>

          <div className="hero-actions">
            <Link href="/trip-planner" className="btn-secondary">
              🗓️ Plan a trip with AI
            </Link>
            <Link href="/heritage-explorer" className="btn-secondary">
              📸 Explore a heritage site
            </Link>
          </div>
        </div>
      </section>

      <section className="feature-strip">
        <div className="container">
          <div className="feature-item">
            <span className="icon">🗺️</span>
            <h4>Any PIN code in India</h4>
            <p>Real, live attraction data for every district</p>
          </div>
          <div className="feature-item">
            <span className="icon">🤖</span>
            <h4>AI-personalized itineraries</h4>
            <p>Day-by-day plans built around your budget</p>
          </div>
          <div className="feature-item">
            <span className="icon">🏛️</span>
            <h4>Instant heritage insights</h4>
            <p>Snap a photo, learn the story behind it</p>
          </div>
        </div>
      </section>
    </div>
  );
}
