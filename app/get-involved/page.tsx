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
    d: "Our Dinner & Holy Hour and our first Hike begin in Fall 2026, starting by invitation at St. James and growing outward to neighboring parishes."
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
            A communications committee carries the invitation outward — first
            within St. James, then to neighboring parishes — so that more
            friends, with faith and without, might join the ascent.
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

      <section id="join" className="border-t border-white/5 bg-slate2">
        <div className="mx-auto max-w-2xl px-5 py-24">
          <Reveal>
            <p className="eyebrow">Mailing list</p>
            <h2 className="mt-4 font-display text-3xl text-bone md:text-4xl">
              Receive our invitations.
            </h2>
            <p className="mt-3 text-sm text-mist">
              Leave your name and email and we&apos;ll reach out as the first
              gatherings take shape.
            </p>
          </Reveal>
          <JoinForm />
        </div>
      </section>
    </>
  );
}
