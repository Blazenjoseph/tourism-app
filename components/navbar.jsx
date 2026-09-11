"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  MapPin,
  Heart,
  ChevronDown,
  Wand2,
  Landmark,
  Luggage,
  Wallet,
  Languages,
  Mic,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const aiTools = [
  { label: "Trip Planner", href: "/trip-planner", icon: Wand2 },
  { label: "Heritage Explorer", href: "/heritage-explorer", icon: Landmark },
  { label: "Packing List", href: "/packing-list", icon: Luggage },
  { label: "Budget Tracker", href: "/budget-tracker", icon: Wallet },
  { label: "Translator & Negotiator", href: "/translator", icon: Languages },
  { label: "Voice Negotiator", href: "/voice-assistant", icon: Mic },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (toolsRef.current && !toolsRef.current.contains(event.target)) {
        setToolsOpen(false);
      }
    }
    function handleEscape(event) {
      if (event.key === "Escape") setToolsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-neutral-950 bg-[#fff8f1]/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5" aria-label="TravelMitra home">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-neutral-950 bg-gradient-to-br from-orange-400 via-pink-500 to-violet-600 text-white shadow-[3px_3px_0_0_#111] transition-transform group-hover:-translate-y-0.5">
            <MapPin className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-xl font-black tracking-[-0.08em] text-neutral-950 sm:text-2xl">
            TravelMitra
          </span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          <Link
            href="/home"
            className="text-sm font-extrabold uppercase tracking-[0.12em] text-neutral-700 transition-colors hover:text-fuchsia-600"
          >
            Explore
          </Link>

          <div className="relative" ref={toolsRef}>
            <button
              type="button"
              onClick={() => setToolsOpen((v) => !v)}
              className="flex items-center gap-1 text-sm font-extrabold uppercase tracking-[0.12em] text-neutral-700 transition-colors hover:text-fuchsia-600"
              aria-expanded={toolsOpen}
              aria-haspopup="true"
            >
              AI Tools
              <ChevronDown
                className={`h-4 w-4 transition-transform ${toolsOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>

            {toolsOpen && (
              <div
                role="menu"
                className="absolute left-0 top-full mt-3 w-72 overflow-hidden rounded-2xl border-2 border-neutral-950 bg-white p-2 shadow-[6px_6px_0_0_#111]"
              >
                {aiTools.map((tool) => (
                  <Link
                    key={tool.label}
                    href={tool.href}
                    role="menuitem"
                    onClick={() => setToolsOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-neutral-900 transition-colors hover:bg-orange-100"
                  >
                    <tool.icon className="h-4 w-4 text-fuchsia-600" aria-hidden="true" />
                    {tool.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/wishlist" className="rounded-xl border-2 border-neutral-950 bg-white p-2 text-neutral-950 shadow-[2px_2px_0_0_#111] transition-transform hover:-translate-y-0.5" aria-label="Wishlist">
            <Heart className="h-5 w-5" aria-hidden="true" />
          </Link>
          <Link href="/home" className="inline-flex items-center gap-1 rounded-xl border-2 border-neutral-950 bg-neutral-950 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-white transition-transform hover:-translate-y-0.5 hover:bg-fuchsia-600">
            Plan a trip <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Link href="/wishlist">
            <Button variant="ghost" size="icon" className="rounded-xl border-2 border-neutral-950 bg-white text-neutral-950" aria-label="Wishlist">
              <Heart className="h-5 w-5" aria-hidden="true" />
            </Button>
          </Link>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border-2 border-neutral-950 bg-neutral-950 p-2 text-white"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t-2 border-neutral-950 bg-[#fff8f1] lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            <Link
              href="/home"
              className="rounded-xl px-3 py-2.5 text-sm font-black uppercase tracking-[0.1em] text-neutral-800 hover:bg-orange-200"
              onClick={() => setOpen(false)}
            >
              Explore
            </Link>

            <div className="px-3 pt-3 pb-1 text-xs font-black uppercase tracking-[0.16em] text-neutral-500">
              AI Tools
            </div>
            {aiTools.map((tool) => (
              <Link
                key={tool.label}
                href={tool.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-neutral-800 hover:bg-orange-200"
                onClick={() => setOpen(false)}
              >
                <tool.icon className="h-4 w-4 text-fuchsia-600" aria-hidden="true" />
                {tool.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
