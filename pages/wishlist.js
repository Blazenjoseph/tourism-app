import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell, ToolIntro } from "@/components/app-shell";

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
    <AppShell>
      <ToolIntro eyebrow="For future-you" title="Your Wishlist" description="Every stay that sparked a little ‘wait, we should actually go there’ moment." />

        {items.length === 0 && (
          <div className="tm-surface mt-10 px-6 py-14 text-center">
            <p className="text-4xl">♡</p>
            <h2 className="tm-heading mt-4 text-3xl">Your save pile is empty.</h2>
            <p className="mx-auto mt-3 max-w-md font-semibold leading-relaxed text-neutral-600">Browse a PIN-code search and tap the heart on any stay you want to keep close.</p>
            <Link href="/home" className="mt-6 inline-flex rounded-xl border-2 border-neutral-950 bg-orange-400 px-5 py-3 font-black uppercase tracking-[.1em] shadow-[3px_3px_0_0_#171717] transition-transform hover:-translate-y-0.5">Explore places</Link>
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item._id} className="group relative overflow-hidden rounded-[1.75rem] border-[3px] border-neutral-950 bg-white shadow-[5px_5px_0_0_#171717] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#171717]">
              <Link href={`/listing/${item._id}`}>
                <div className="relative h-52 overflow-hidden border-b-2 border-neutral-950">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute right-3 top-3 rounded-xl border-2 border-neutral-950 bg-yellow-300 px-3 py-1.5 text-sm font-black shadow-[2px_2px_0_0_#171717]">₹{item.price}</span>
                </div>
                <div className="p-5">
                  <h3 className="tm-heading text-2xl">{item.name}</h3>
                  <div className="mt-2 text-sm font-bold text-neutral-600">
                    {item.type} · {item.city} · ⭐ {item.rating}
                  </div>
                </div>
              </Link>
              <button
                onClick={() => removeItem(item._id)}
                className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border-2 border-neutral-950 bg-white font-black shadow-[2px_2px_0_0_#171717] transition-colors hover:bg-rose-300"
                title="Remove from wishlist"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
    </AppShell>
  );
}
