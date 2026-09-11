import Link from "next/link";
import { Wand2, Landmark, Luggage, Wallet, Languages, Mic, Heart, ArrowUpRight } from "lucide-react";

const features = [
  {
    icon: Wand2,
    title: "AI Trip Planner",
    desc: "Turn a vague group-chat plan into a day-by-day trip.",
    href: "/trip-planner",
    color: "from-fuchsia-300 to-rose-400",
    big: true,
  },
  {
    icon: Landmark,
    title: "Heritage Explorer",
    desc: "Point, snap, and unlock the backstory.",
    href: "/heritage-explorer",
    color: "from-violet-300 to-purple-400",
  },
  {
    icon: Luggage,
    title: "Packing List",
    desc: "Your essentials, minus the overthinking.",
    href: "/packing-list",
    color: "from-yellow-200 to-orange-400",
  },
  {
    icon: Wallet,
    title: "Budget Tracker",
    desc: "Keep the vibe high and your spends visible.",
    href: "/budget-tracker",
    color: "from-emerald-300 to-teal-400",
  },
  {
    icon: Languages,
    title: "Translator & Negotiator",
    desc: "Say it right, ask it politely, travel easier.",
    href: "/translator",
    color: "from-cyan-300 to-sky-400",
  },
  {
    icon: Mic,
    title: "Voice Negotiator",
    desc: "Speak naturally in your language with real-time audio replies and smart local negotiation.",
    href: "/voice-assistant",
    color: "from-amber-300 to-rose-400",
    big: true,
  },
  {
    icon: Heart,
    title: "Wishlist",
    desc: "Keep your future stays in one happy place.",
    href: "/wishlist",
    color: "from-pink-300 to-rose-400",
  },
];

export function Features() {
  return (
    <section id="features" className="border-t-2 border-neutral-950 bg-[#fff1e7] px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-black uppercase tracking-[.18em] text-fuchsia-700">Make it your trip</p>
          <h2 className="tm-heading mt-4 text-4xl leading-[.95] text-neutral-950 sm:text-6xl">
            Every travel tool,
            <span className="block text-orange-600">
              right up front.
            </span>
          </h2>
          <p className="mt-5 font-semibold leading-relaxed text-neutral-600">Build the plan, decode what you see, keep a budget, or save the place you&apos;re already thinking about.</p>
        </div>

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <Link
            key={f.title}
            href={f.href}
            className={`group relative min-h-[14rem] overflow-hidden rounded-[1.75rem] border-[3px] border-neutral-950 bg-white p-6 shadow-[5px_5px_0_0_#171717] transition-all hover:-translate-y-1.5 hover:shadow-[8px_8px_0_0_#171717] ${
              f.big ? "sm:col-span-2" : ""
            }`}
          >
            <div className={`absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gradient-to-br opacity-90 ${f.color}`} />
            <div
              className={`relative flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-neutral-950 bg-gradient-to-br ${f.color} text-neutral-950 shadow-[3px_3px_0_0_#171717]`}
            >
              <f.icon className="h-6 w-6" strokeWidth={2.6} />
            </div>
            <span className="absolute right-5 top-5 text-xs font-black tracking-[.15em] text-neutral-400">0{i + 1}</span>
            <h3 className={`tm-heading mt-7 text-neutral-950 ${f.big ? "text-3xl" : "text-2xl"}`}>
              {f.title}
            </h3>
            <p className={`mt-3 max-w-xs font-semibold leading-relaxed text-neutral-600 ${f.big ? "text-base" : "text-sm"}`}>
              {f.desc}
            </p>
            <span className="absolute bottom-5 right-5 flex h-9 w-9 items-center justify-center rounded-full border-2 border-neutral-950 bg-neutral-950 text-white transition-transform group-hover:rotate-45 group-hover:bg-fuchsia-600"><ArrowUpRight className="h-4 w-4" /></span>
          </Link>
        ))}
      </div>
      </div>
    </section>
  );
}
