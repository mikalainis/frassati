import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { Ridgeline } from "@/components/Marks";

export const metadata: Metadata = {
  title: "Join an Upcoming Gathering",
  description:
    "Join upcoming gatherings of the Frassati Fellowship of New Jersey — see our calendar to RSVP for dinners, Holy Hours, and hikes."
};

function InstagramIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
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
  );
}

export default function Rsvp() {
  return (
    <>
      <section id="rsvp" className="mx-auto max-w-4xl px-5 py-24 text-center">
        <Reveal>
          <p className="eyebrow justify-center">Upcoming gatherings</p>
          <h1 className="mt-4 font-display text-4xl text-bone md:text-6xl">
            Join an upcoming gathering
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-mist">
            Our dinners, Holy Hours, and hikes are all on our calendar. To RSVP,
            click on the calendar event you&apos;d like to attend and respond
            there. Hike events include a link to the required waiver.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/gatherings#calendar" className="btn-gold">
              View the calendar
            </Link>
          </div>
          <div className="mt-10 flex items-center justify-center gap-2 text-sm text-mist">
            <span>Follow along on Instagram</span>
            <a
              href="https://www.instagram.com/frassati.nj/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Frassati Fellowship on Instagram (opens in a new tab)"
              className="inline-flex items-center gap-1.5 font-medium text-gold transition hover:text-goldpale"
            >
              <InstagramIcon className="h-4 w-4" />
              <span>@frassati.nj</span>
            </a>
          </div>
        </Reveal>
      </section>
      <Ridgeline className="h-12 w-full" />
    </>
  );
}
