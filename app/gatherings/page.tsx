import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { Ridgeline } from "@/components/Marks";

export const metadata: Metadata = {
  title: "Gatherings & Calendar",
  description:
    "Upcoming gatherings and calendar of the Frassati Fellowship of New Jersey — Dinner & Holy Hour, The Hike, and service."
};

// This embeds the frassatinj@gmail.com Google Calendar. For it to display,
// the calendar must be made public once:
// Google Calendar → Settings → (the calendar) → Access permissions →
// check "Make available to public" (See only free/busy OR full details).
// Any event added to that calendar then appears here automatically.
// showTabs is left on (the default) so visitors keep the Week / Month /
// Agenda switcher; mode=AGENDA only sets which view opens first.
// Google's current embed ignores bgcolor, so the iframe paints itself white
// no matter what we pass. The parchment tint comes from the multiply overlay
// in the markup below, not from this URL.
const CAL_SRC =
  "https://calendar.google.com/calendar/embed?src=frassatinj%40gmail.com" +
  "&ctz=America%2FNew_York&mode=AGENDA&showTitle=0&showPrint=0&showTz=0" +
  "&bgcolor=%23EDE7DB&color=%23C99A3C";

export default function Gatherings() {
  return (
    <>
      {/* INTRO */}
      <section className="mx-auto max-w-6xl px-5 pb-10 pt-24">
        <Reveal>
          <p className="eyebrow">Signature gatherings</p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl text-bone md:text-6xl">
            Events the fellowship is built around.
          </h1>
          <p className="mt-5 max-w-xl text-mist">
            Each begins in fellowship and rises toward the Lord — one at the
            altar, one on the mountain.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#calendar" className="btn-gold">
              See the calendar
            </a>
            <Link href="/get-involved#join" className="btn-ghost">
              Get involved
            </Link>
          </div>
        </Reveal>
      </section>
      <Ridgeline className="h-12 w-full" />

      {/* DESCRIPTIONS */}
      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-16 md:grid-cols-2">
        <Reveal>
          <article className="card-dark flex h-full flex-col p-8 md:p-10">
            <h2 className="font-display text-4xl text-bone">
              Dinner &amp; Holy Hour
            </h2>
            <p className="mt-5 leading-relaxed text-mist">
              The evening begins before the Lord — Exposition of the Blessed
              Sacrament, Confession, and sacred music sung reverently — and
              concludes with dinner, where couples and singles build friendship
              and share their faith.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="chip">First: <b>Fall 2026</b></span>
              <span className="chip"><b>50–60</b> guests</span>
              <span className="chip">Growing from <b>St. James</b> outward</span>
            </div>
          </article>
        </Reveal>

        <Reveal>
          <article className="card-dark flex h-full flex-col p-8 md:p-10">
            <h2 className="font-display text-4xl text-bone">The Hike</h2>
            <p className="mt-5 leading-relaxed text-mist">
              Trails scouted and rated by our hiking coordinators. Hikers are
              encouraged to attend Mass beforehand and to carry a prayer
              intention to the heights. The leader prays before, after, and at
              the rest stops, and offers a reflection along the trail —
              families on the gentle routes, adults on the harder ascents.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="chip">One <b>family</b> route · one <b>adult</b> route</span>
              <span className="chip">Signed <b>waiver</b> required</span>
            </div>
          </article>
        </Reveal>
      </section>

      {/* UPCOMING GATHERINGS & CALENDAR HEADER */}
      <section id="calendar" className="mx-auto max-w-6xl px-5 pb-12 pt-16">
        <Reveal>
          <p className="eyebrow">Calendar</p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl text-bone md:text-5xl">
            Upcoming gatherings.
          </h2>
          <p className="mt-5 max-w-xl text-mist">
            Hikes, Holy Hours, and service — added here as each is scheduled. To
            RSVP, click on the calendar event you&apos;d like to attend and
            respond there.
          </p>
          <p className="mt-4 text-sm text-mist">
            Follow along on Instagram:{" "}
            <a
              href="https://www.instagram.com/frassati.nj/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Frassati Fellowship on Instagram (opens in a new tab)"
              className="font-medium text-gold transition hover:text-goldpale"
            >
              @frassati.nj
            </a>
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/get-involved#join" className="btn-gold">
              Get invitations by email
            </Link>
            <a
              className="btn-ghost"
              href="https://calendar.google.com/calendar/u/0/r?cid=frassatinj@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Add Frassati Fellowship events to your Google Calendar (opens in a new tab)"
            >
              Add to your Google Calendar
            </a>
          </div>
        </Reveal>
      </section>

      {/* CALENDAR EMBED */}
      <section id="rsvp" className="bg-parchment text-ink">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-ink/10">
              <iframe
                src={CAL_SRC}
                title="Frassati Fellowship of New Jersey events calendar"
                className="block h-[70vh] min-h-[480px] w-full"
                style={{ border: 0 }}
              />
              {/* Tints Google's white chrome to parchment. Multiply leaves
                  dark text and gold events untouched (x * white = x), and
                  pointer-events-none keeps the calendar fully clickable. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-parchment mix-blend-multiply"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
