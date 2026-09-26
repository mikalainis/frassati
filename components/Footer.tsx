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
            A lay apostolate of Catholics in Central New Jersey, climbing
            together toward the Kingdom of God.
          </p>
          <div className="mt-6">
            <a
              href="https://www.instagram.com/frassati.nj/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Frassati Fellowship on Instagram (opens in a new tab)"
              className="inline-flex items-center gap-2 text-sm text-mist transition hover:text-goldpale"
            >
              <svg
                className="h-4 w-4 text-gold"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              <span>@frassati.nj</span>
            </a>
          </div>
        </div>

        <nav className="text-sm" aria-label="Footer">
          <p className="eyebrow mb-4">Explore</p>
          <ul className="space-y-2 text-mist">
            <li><Link className="hover:text-goldpale" href="/about">About St. Pier Giorgio</Link></li>
            <li><Link className="hover:text-goldpale" href="/gatherings">Gatherings &amp; Calendar</Link></li>
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
