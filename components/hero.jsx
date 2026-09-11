"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  const [pin, setPin] = useState("");
  const router = useRouter();

  function handleSubmit(e) {
    e.preventDefault();
    if (!pin.trim()) return;
    router.push(`/search?pincode=${pin.trim()}`);
  }

  return (
    <section className="relative overflow-hidden border-b-2 border-neutral-950 bg-[#fff4ec]">
      <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 opacity-30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-40 h-80 w-80 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 opacity-40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-gradient-to-br from-pink-300 to-purple-300 opacity-30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32 lg:py-36">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-neutral-950 bg-neutral-950 px-4 py-2 text-xs font-black uppercase tracking-[.14em] text-white shadow-[3px_3px_0_0_#f97316]">
            <Sparkles className="h-3.5 w-3.5" />
            your trip, your vibe
          </span>

          <h1 className="tm-heading mt-7 text-5xl leading-[0.9] text-neutral-950 sm:text-6xl md:text-8xl">
            Find your next
            <span className="block bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              escape rn 🌴
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg font-bold leading-relaxed text-neutral-600">
            No cap — real stays, real guides, real experiences. Just drop your PIN
            code and let's go.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-10 flex w-full max-w-xl flex-col gap-2 rounded-[1.75rem] border-[3px] border-neutral-950 bg-white p-2 shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] sm:flex-row sm:rounded-full"
          >
            <div className="flex flex-1 items-center gap-2 px-4">
              <Search className="h-5 w-5 shrink-0 text-neutral-400" />
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                placeholder="570001..."
                className="h-12 w-full bg-transparent text-base font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
              />
            </div>
            <Button
              type="submit"
              className="h-12 rounded-full border-2 border-neutral-950 bg-orange-400 px-8 text-base font-black text-neutral-950 hover:bg-pink-400"
            >
              Let's go →
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="font-black uppercase tracking-[.1em] text-neutral-500">trending:</span>
            {[
              { name: "Mysore", pin: "570001" },
              { name: "Goa", pin: "403001" },
              { name: "Manali", pin: "175131" },
            ].map((place) => (
              <button
                key={place.name}
                onClick={() => router.push(`/search?pincode=${place.pin}`)}
                className="rounded-full border-2 border-neutral-950 bg-white px-3 py-1 font-bold text-neutral-700 shadow-[2px_2px_0_0_#171717] transition-transform hover:-translate-y-0.5"
              >
                {place.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
