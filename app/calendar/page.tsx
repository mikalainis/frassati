import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Calendar",
  description:
    "Upcoming gatherings of the Frassati Fellowship of New Jersey — hikes, Holy Hours, and service."
};

// This embeds the frassatinj@gmail.com Google Calendar. For it to display,
// the calendar must be made public once:
// Google Calendar → Settings → (the calendar) → Access permissions →
// check "Make available to public" (See only free/busy OR full details).
// Any event added to that calendar then appears here automatically.
const CAL_SRC =
  "https://calendar.google.com/calendar/embed?src=frassatinj%40gmail.com" +
  "&ctz=America%2FNew_York&mode=AGENDA&showTitle=0&showPrint=0&showTz=0" +
  "&bgcolor=%23EDE7DB&color=%23C99A3C";

export default function CalendarPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pb-12 pt-24">
        <Reveal>
          <p className="eyebrow">Calendar</p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl text-bone md:text-6xl">
            Upcoming gatherings.
          </h1>
          <p className="mt-5 max-w-xl text-mist">
            Hikes, Holy Hours, and service — added here as each is scheduled.
            Our first gatherings begin in Fall 2026.
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
            >
              Add to your Google Calendar
            </a>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-parchment">
            <iframe
              src={CAL_SRC}
              title="Frassati Fellowship of New Jersey events calendar"
              className="h-[70vh] min-h-[480px] w-full"
              style={{ border: 0 }}
            />
          </div>
        </Reveal>
      </section>
    </>
  );
}
