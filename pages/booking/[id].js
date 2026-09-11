import { useRouter } from "next/router";
import { useState } from "react";
import { AppShell, ToolIntro } from "@/components/app-shell";

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
    <AppShell>
      <ToolIntro eyebrow="Almost there" title="Confirm your booking" description="This is a demo checkout—no real payment is taken. Just one final name check and your travel proof is ready." />

      <div className="mx-auto mt-10 max-w-lg">
        {!result && (
          <form onSubmit={handleBook} className="tm-surface p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[.16em] text-fuchsia-700">One last thing</p>
            <h2 className="tm-heading mt-2 text-3xl">Who&apos;s checking in?</h2>
            <p className="mt-3 font-semibold leading-relaxed text-neutral-600">
              This is a mock payment for demo purposes — no real charge is made.
            </p>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="tm-input mt-6"
            />
            <button type="submit" className="mt-3 w-full rounded-2xl border-2 border-neutral-950 bg-orange-400 px-5 py-3.5 font-black uppercase tracking-[.1em] text-neutral-950 shadow-[4px_4px_0_0_#171717] transition-all hover:-translate-y-0.5 hover:bg-pink-400 disabled:cursor-not-allowed disabled:opacity-60" disabled={loading}>
              {loading ? "Processing..." : "Pay (Mock) & Confirm"}
            </button>
          </form>
        )}

        {result && result.qrDataUrl && (
          <div className="tm-surface text-center p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[.16em] text-fuchsia-700">You&apos;re all set</p>
            <h2 className="tm-heading mt-2 text-4xl">Booking confirmed 🎉</h2>
            <p className="mt-4 font-semibold">Confirmation ID: <span className="font-black">{result.confirmationId}</span></p>
            <img src={result.qrDataUrl} alt="Booking QR code" className="mx-auto my-6 max-w-56 rounded-2xl border-2 border-neutral-950" />
            <p className="font-semibold text-neutral-600">Show this QR code at check-in.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
