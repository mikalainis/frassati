import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import JoinForm from "@/components/JoinForm";

export const metadata: Metadata = {
  title: "Get Involved",
  description:
    "Join the Frassati Fellowship of New Jersey — receive invitations to our gatherings and help build the ministry."
};

const ways = [
  {
    t: "Come to a gathering",
    d: "Join us for a Holy Hour with dinner, or a hike with prayer on the trail — friends and families welcome."
  },
  {
    t: "Serve on a committee",
    d: "Hikes, Service, Spiritual Formation, Communications, and Music — small teams of three or more who plan events and bring them to the Core Team."
  },
  {
    t: "Pray with us",
    d: "Carry an intention on the trail, join us before the Blessed Sacrament, or simply ask St. Pier Giorgio's intercession for the fellowship."
  }
];

export default function GetInvolved() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-24">
        <Reveal>
          <p className="eyebrow">Get involved</p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl text-bone md:text-6xl">
            Come climb with us.
          </h1>
          <p className="mt-5 max-w-xl text-mist">
            A communications committee carries the invitation outward so that
            more friends, with faith and without, might join the ascent.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {ways.map((w) => (
            <Reveal key={w.t}>
              <div className="card-dark h-full p-7">
                <h2 className="font-display text-2xl text-bone">{w.t}</h2>
                <p className="mt-3 text-sm leading-relaxed text-mist">{w.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
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
          </Reveal>

          <div className="space-y-5">
            <Reveal>
              <p className="eyebrow">How we&apos;re organized</p>
            </Reveal>
            {[
              {
                t: "Core Team",
                d: "Men and women who hold the vision of the ministry, and review and approve the events that align with it."
              },
              {
                t: "Committees",
                d: "Small teams that plan and report to the Core Team for approval: Hikes, Service, Spiritual Formation, Communications, Music."
              },
              {
                t: "Chaplains",
                d: "Ordained chaplains who bring the sacraments to our gatherings."
              }
            ].map((o) => (
              <Reveal key={o.t}>
                <div className="rounded-2xl border border-ink/10 bg-white/60 p-6">
                  <h3 className="font-display text-xl">{o.t}</h3>
                  <p className="mt-2 text-sm text-ink/70">{o.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-parchment text-ink">
        <div className="mx-auto max-w-6xl px-5 pb-24">
          <Reveal>
            <p className="eyebrow">Beyond the trail and the altar</p>
            <h2 className="mt-4 max-w-xl font-display text-4xl md:text-5xl">
              Ministries that carry the fellowship.
            </h2>
            <p className="mt-4 max-w-xl text-ink/70">
              The Hike and the Holy Hour remain our heart — these ministries
              exist to lift them up and to carry Frassati&apos;s spirit
              outward.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                t: "Music",
                d: "Liturgical and sacred music, sung reverently at our Holy Hours — and songs for the trail and table."
              },
              {
                t: "Service",
                d: "Soup kitchens, meals on the street, and clothing drives — hidden service of the poor, as Pier Giorgio lived it."
              },
              {
                t: "Spiritual Formation",
                d: "Reflections for the trail, prayer resources, and formation in the Beatitudes for our members."
              },
              {
                t: "Hikes",
                d: "Scouting and rating routes, planning treks, and leading prayer at the rest stops."
              },
              {
                t: "Communications",
                d: "Carrying the invitation outward — first within St. James, then to neighboring parishes."
              }
            ].map((m) => (
              <Reveal key={m.t}>
                <div className="h-full rounded-2xl border border-ink/10 bg-white/60 p-6">
                  <h3 className="font-display text-2xl">{m.t}</h3>
                  <p className="mt-2 text-sm text-ink/70">{m.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="join" className="border-t border-white/5 bg-slate2">
        <div className="mx-auto max-w-2xl px-5 py-24">
          <Reveal>
            <p className="eyebrow">Mailing list</p>
            <h2 className="mt-4 font-display text-3xl text-bone md:text-4xl">
              Receive our invitations.
            </h2>
            <p className="mt-3 text-sm text-mist">
              Leave your name and email and we&apos;ll reach out about upcoming
              events.
            </p>
          </Reveal>
          <JoinForm />
        </div>
      </section>
    </>
  );
}
