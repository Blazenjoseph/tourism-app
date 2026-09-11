import { useState } from "react";
import { AppShell, ToolIntro } from "@/components/app-shell";

export default function PackingList() {
  const [form, setForm] = useState({ destination: "", days: "", tripType: "" });
  const [list, setList] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setList("");

    try {
      const res = await fetch("/api/packing-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setList(data.packingList);
      }
    } catch (err) {
      setError("Failed to reach the server. Please try again.");
    }

    setLoading(false);
  }

  return (
    <AppShell>
      <ToolIntro eyebrow="Pack light, live big" title="AI Packing List" description="A custom checklist for your destination, timeline, and trip type—so the essentials don&apos;t get left on the bedroom floor." />

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)]">
        <form onSubmit={handleSubmit} className="tm-surface p-5 sm:p-7">
          <p className="text-xs font-black uppercase tracking-[.16em] text-fuchsia-700">Trip snapshot</p>
          <h2 className="tm-heading mt-2 text-2xl">What&apos;s the plan?</h2>
          <div className="mt-6 space-y-3">
          <input
            type="text"
            name="destination"
            placeholder="Destination (e.g. Manali)"
            value={form.destination}
            onChange={handleChange}
            required
            className="tm-input"
          />
          <input
            type="number"
            name="days"
            placeholder="Number of days (e.g. 5)"
            value={form.days}
            onChange={handleChange}
            required
            min="1"
            className="tm-input"
          />
          <input
            type="text"
            name="tripType"
            placeholder="Trip type (e.g. trekking, beach, pilgrimage, business)"
            value={form.tripType}
            onChange={handleChange}
            className="tm-input"
          />
          </div>
          <button type="submit" className="mt-3 w-full rounded-2xl border-2 border-neutral-950 bg-yellow-300 px-5 py-3.5 font-black uppercase tracking-[.1em] text-neutral-950 shadow-[4px_4px_0_0_#171717] transition-all hover:-translate-y-0.5 hover:bg-orange-300 disabled:cursor-not-allowed disabled:opacity-60" disabled={loading}>
            {loading ? "Generating..." : "Generate Packing List"}
          </button>
        </form>

        {error && <p className="rounded-2xl border-2 border-red-600 bg-red-50 p-4 font-bold text-red-700">Error: {error}</p>}

        {list && (
          <div className="tm-surface h-fit whitespace-pre-wrap p-6 text-[15px] font-medium leading-7 text-neutral-700 sm:p-8">
            <p className="mb-5 text-xs font-black uppercase tracking-[.16em] text-fuchsia-700">Your no-stress checklist</p>
            {list}
          </div>
        )}
      </div>
    </AppShell>
  );
}
