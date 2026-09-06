import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { Ridgeline } from "@/components/Marks";

export const metadata: Metadata = {
  title: "RSVP",
  description:
    "RSVP for upcoming gatherings of the Frassati Fellowship of New Jersey — Dinner & Holy Hour and The Hike."
};

// Edit this array to change what appears on the RSVP page. `date` is
// optional — leave it off and the card simply omits it.
const events: { name: string; formUrl: string; note: string; date?: string }[] = [
  {
    name: "Dinner & Holy Hour",
    formUrl: "https://forms.gle/v1NnrXrrTcWwD3KG8",
    note: "Adoration, Confession, and sacred music, concluding with dinner."
  },
  {
    name: "The Hike",
    formUrl: "https://forms.gle/ChJLBCAMb58wXUHv8",
    note: "Family and adult routes, with prayer on the trail. Registration includes a waiver."
  }
];

export default function Rsvp() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pb-10 pt-24">
        <Reveal>
          <p className="eyebrow">RSVP</p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl text-bone md:text-6xl">
            RSVP for upcoming events
          </h1>
          <p className="mt-5 max-w-xl text-mist">
            Let us know you&apos;re coming. Each gathering has its own short
            registration form — it takes a minute, and it helps us plan the
            table and the trail.
          </p>
        </Reveal>
      </section>
      <Ridgeline className="h-12 w-full" />

      <section className="mx-auto max-w-6xl px-5 py-16">
        {events.length === 0 ? (
          <Reveal>
            <div className="card-dark p-8 text-center md:p-10">
              <h2 className="font-display text-3xl text-bone">
                No open registrations right now
              </h2>
              <p className="mt-4 text-mist">
                Join the mailing list and we&apos;ll send the invitation as soon
                as the next gathering is scheduled.
              </p>
              <div className="mt-8 flex justify-center">
                <Link href="/get-involved#join" className="btn-gold">
                  Join the mailing list
                </Link>
              </div>
            </div>
          </Reveal>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {events.map((e) => (
              <Reveal key={e.name}>
                <article className="card-dark flex h-full flex-col p-8 md:p-10">
                  <h2 className="font-display text-4xl text-bone">{e.name}</h2>
                  {e.date && (
                    <p className="mt-4">
                      <span className="chip">{e.date}</span>
                    </p>
                  )}
                  <p className="mt-5 leading-relaxed text-mist">{e.note}</p>
                  <div className="mt-8 flex flex-wrap gap-4">
                    <a
                      className="btn-gold"
                      href={e.formUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      RSVP
                    </a>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
