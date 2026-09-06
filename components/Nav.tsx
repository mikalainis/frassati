"use client";

import Link from "next/link";
import { useState } from "react";
import { SummitMark } from "./Marks";

const links = [
  { href: "/about", label: "St. Pier Giorgio" },
  { href: "/gatherings", label: "Gatherings" },
  { href: "/calendar", label: "Calendar" },
  { href: "/rsvp", label: "RSVP" },
  { href: "/get-involved", label: "Get Involved" }
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-midnight/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-3 text-parchment">
          <SummitMark className="h-9 w-9 text-gold" />
          <span className="font-display text-lg leading-tight">
            Frassati Fellowship
            <span className="block text-[10px] font-body uppercase tracking-eyebrow text-mist">
              New Jersey
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-mist transition hover:text-goldpale"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/get-involved#join" className="btn-gold !px-5 !py-2">
            Join us
          </Link>
        </nav>

        <button
          className="md:hidden text-parchment"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.6" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/10 px-5 pb-5 md:hidden" aria-label="Mobile">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block py-3 text-mist"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/get-involved#join"
            className="btn-gold mt-2"
            onClick={() => setOpen(false)}
          >
            Join us
          </Link>
        </nav>
      )}
    </header>
  );
}
