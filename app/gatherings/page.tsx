import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { Ridgeline } from "@/components/Marks";

export const metadata: Metadata = {
  title: "Signature Gatherings",
  description:
    "Dinner & Holy Hour and The Hike — the events the Frassati Fellowship of New Jersey is built around."
};

export default function Gatherings() {
  return (
    <>
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
            <Link href="/get-involved#join" className="btn-gold">
              Get involved
            </Link>
            <Link href="/calendar" className="btn-ghost">
              See the calendar
            </Link>
          </div>
        </Reveal>
      </section>
      <Ridgeline className="h-12 w-full" />

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

      <section className="mx-auto max-w-2xl px-5 py-24 text-center">
        <Reveal>
          <h2 className="font-display text-3xl text-bone md:text-4xl">
            Want to attend a gathering?
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/get-involved#join" className="btn-gold">
              RSVP for upcoming events
            </Link>
            <Link href="/calendar" className="btn-ghost">
              See the calendar
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
