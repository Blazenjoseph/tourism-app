import { useState } from "react";
import { useRouter } from "next/router";

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
          <div className="logo">TravelMitra</div>
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
        </div>
      </section>
    </div>
  );
}
