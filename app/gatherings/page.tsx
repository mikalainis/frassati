import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { Ridgeline } from "@/components/Marks";

export const metadata: Metadata = {
  title: "Signature Gatherings",
  description:
    "Dinner & Holy Hour and The Hike — the two events the Frassati Fellowship of New Jersey is built around."
};

export default function Gatherings() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pb-10 pt-24">
        <Reveal>
          <p className="eyebrow">Signature gatherings</p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl text-bone md:text-6xl">
            Two events the fellowship is built around.
          </h1>
          <p className="mt-5 max-w-xl text-mist">
            Each begins in fellowship and rises toward the Lord — one at the
            altar, one on the mountain.
          </p>
        </Reveal>
      </section>
      <Ridgeline className="h-12 w-full" />

      <section className="mx-auto max-w-6xl space-y-10 px-5 py-16">
        <Reveal>
          <article className="card-dark grid gap-8 p-8 md:grid-cols-[1fr_260px] md:p-12">
            <div>
              <p className="eyebrow">Gathering I</p>
              <h2 className="mt-3 font-display text-4xl text-bone">
                Dinner &amp; Holy Hour
              </h2>
              <p className="mt-5 leading-relaxed text-mist">
                Dinners on church property — catered or potluck — where
                couples and singles build friendship and plan the season
                ahead. The evening rises into Exposition of the Blessed
                Sacrament: Confession, liturgical and sacred music sung
                reverently, and quiet time before the Lord.
              </p>
            </div>
            <div className="flex flex-col gap-2 md:pt-10">
              <span className="chip">First: <b>Fall 2026</b></span>
              <span className="chip"><b>Invitation</b> only</span>
              <span className="chip"><b>50–60</b> guests</span>
              <span className="chip">No fewer than <b>3 priests</b></span>
              <span className="chip">Growing from <b>St. James</b> outward</span>
            </div>
          </article>
        </Reveal>

        <Reveal>
          <article className="card-dark grid gap-8 p-8 md:grid-cols-[1fr_260px] md:p-12">
            <div>
              <p className="eyebrow">Gathering II</p>
              <h2 className="mt-3 font-display text-4xl text-bone">The Hike</h2>
              <p className="mt-5 leading-relaxed text-mist">
                Trails scouted and rated by our hiking coordinators. Hikers
                are encouraged to attend Mass beforehand and to carry a prayer
                intention to the heights. The leader prays before, after, and
                at the rest stops, and offers a reflection along the trail —
                families on the gentle routes, adults on the harder ascents.
              </p>
            </div>
            <div className="flex flex-col gap-2 md:pt-10">
              <span className="chip">First: <b>Fall 2026</b></span>
              <span className="chip"><b>Invitation</b> only</span>
              <span className="chip">One <b>family</b> route · one <b>adult</b> route</span>
              <span className="chip">Signed <b>waiver</b> required</span>
            </div>
          </article>
        </Reveal>
      </section>

      <section className="bg-parchment text-ink">
        <div className="mx-auto grid max-w-6xl gap-14 px-5 py-24 md:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Who we serve</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">
              Catholic lay adults — and the families they bring.
            </h2>
            <p className="mt-5 text-ink/75">
              Single and married, with children warmly welcome. The fellowship
              is led by lay men and women and accompanied by our priests at
              every gathering.
            </p>
            <div className="mt-8 border-t border-gold/40 pt-6">
              <h3 className="font-display text-xl">Somerset Hill Deanery</h3>
              <p className="mt-1 text-sm text-ink/60">
                Diocese of Metuchen · beginning at St. James, extending to
                neighboring parishes
              </p>
            </div>
          </Reveal>

          <div className="space-y-5">
            <Reveal>
              <p className="eyebrow">How we&apos;re organized</p>
            </Reveal>
            {[
              {
                t: "Core Team",
                s: "8–12 lay persons",
                d: "Men and women who hold the vision of the ministry, and review and approve the events that align with it."
              },
              {
                t: "Committees",
                s: "3+ per committee",
                d: "Small teams that plan and report to the Core Team for approval: Hikes, Service, Spiritual Formation, Communications, Music."
              },
              {
                t: "Chaplains",
                s: "4–6 priests",
                d: "Ordained chaplains who bring the sacraments to our gatherings."
              }
            ].map((o) => (
              <Reveal key={o.t}>
                <div className="rounded-2xl border border-ink/10 bg-white/60 p-6">
                  <h3 className="font-display text-xl">
                    {o.t}{" "}
                    <span className="ml-2 align-middle text-[11px] uppercase tracking-eyebrow text-gold">
                      {o.s}
                    </span>
                  </h3>
                  <p className="mt-2 text-sm text-ink/70">{o.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-5 py-24 text-center">
        <Reveal>
          <h2 className="font-display text-3xl text-bone md:text-4xl">
            Want to be at the first gathering?
          </h2>
          <Link href="/get-involved#join" className="btn-gold mt-8">
            Get involved
          </Link>
        </Reveal>
      </section>
    </>
  );
}
