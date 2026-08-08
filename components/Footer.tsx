import Link from "next/link";
import { Ridgeline, SummitMark } from "./Marks";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-midnight">
      <Ridgeline className="h-10 w-full" />
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3 text-parchment">
            <SummitMark className="h-8 w-8 text-gold" />
            <span className="font-display">Frassati Fellowship of New Jersey</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-mist">
            A lay apostolate in the Somerset Hill Deanery, Diocese of Metuchen —
            beginning at St. James and extending to neighboring parishes.
          </p>
        </div>

        <nav className="text-sm" aria-label="Footer">
          <p className="eyebrow mb-4">Explore</p>
          <ul className="space-y-2 text-mist">
            <li><Link className="hover:text-goldpale" href="/about">About St. Pier Giorgio</Link></li>
            <li><Link className="hover:text-goldpale" href="/gatherings">Signature gatherings</Link></li>
            <li><Link className="hover:text-goldpale" href="/calendar">Calendar</Link></li>
            <li><Link className="hover:text-goldpale" href="/get-involved">Get involved</Link></li>
          </ul>
        </nav>

        <div className="text-sm">
          <p className="eyebrow mb-4">The rule of our fellowship</p>
          <p className="font-display text-2xl italic text-goldpale">Verso l&apos;alto.</p>
          <p className="mt-2 text-mist">To the heights — St. Pier Giorgio Frassati, pray for us.</p>
        </div>
      </div>
      <div className="border-t border-white/5 py-5 text-center text-xs text-mist/60">
        © {new Date().getFullYear()} Frassati Fellowship of New Jersey · frassatinj.com
      </div>
    </footer>
  );
}
