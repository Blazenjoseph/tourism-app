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
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="logo">TravelMitra</div>
          <div style={{ display: "flex", gap: 20 }}>
            <Link href="/trip-planner" style={{ textDecoration: "none", color: "#333", fontWeight: 500 }}>
              AI Trip Planner
            </Link>
            <Link href="/heritage-explorer" style={{ textDecoration: "none", color: "#333", fontWeight: 500 }}>
              Heritage Explorer
            </Link>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="container">
          <h1>Discover local stays, guides & experiences</h1>
          <p>Enter your destination PIN code to explore what's nearby</p>
          <form className="search-box" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Enter PIN code, e.g. 570001"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            />
            <button type="submit" className="btn">
              Explore
            </button>
          </form>

          <div style={{ marginTop: 40, display: "flex", gap: 16, justifyContent: "center" }}>
            <Link href="/trip-planner" className="btn" style={{ textDecoration: "none", background: "#333" }}>
              🗓️ Plan a trip with AI
            </Link>
            <Link href="/heritage-explorer" className="btn" style={{ textDecoration: "none", background: "#333" }}>
              📸 Explore a heritage site
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
