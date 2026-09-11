import { Navbar } from "@/components/navbar";

export function AppShell({ children, className = "" }) {
  return (
    <div className={`min-h-screen bg-[#fff8f1] text-neutral-950 ${className}`}>
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 md:py-14">{children}</main>
    </div>
  );
}

export function ToolIntro({ eyebrow, title, description, children }) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border-[3px] border-neutral-950 bg-neutral-950 px-6 py-9 text-white shadow-[7px_7px_0_0_#f97316] sm:px-9 sm:py-11">
      <div className="pointer-events-none absolute -right-12 -top-16 h-52 w-52 rounded-full bg-fuchsia-500 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-44 w-44 rounded-full bg-orange-400 blur-3xl" />
      <div className="relative max-w-3xl">
        {eyebrow && <p className="text-xs font-black uppercase tracking-[.18em] text-orange-300">{eyebrow}</p>}
        <h1 className="tm-heading mt-3 text-4xl leading-[.92] sm:text-6xl">{title}</h1>
        {description && <p className="mt-5 max-w-2xl text-base font-semibold leading-relaxed text-white/75 sm:text-lg">{description}</p>}
        {children}
      </div>
    </section>
  );
}
