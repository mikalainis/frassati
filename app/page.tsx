import Link from "next/link";
import Reveal from "@/components/Reveal";
import AskWidget from "@/components/AskWidget";
import { Contours, Ridgeline } from "@/components/Marks";

const pillars = [
  {
    n: "i.",
    title: "Prayer & the Sacraments",
    items: [
      "A deepening life of private prayer",
      "Holy Hour and dinner gatherings",
      "Prayer and reflection on the trail",
      "The sacraments — Mass and Confession"
    ]
  },
  {
    n: "ii.",
    title: "Support for Christ's Church",
    items: [
      "A life ordered to the Church's teaching",
      "A visible presence, carried in humility",
      "Welcoming friends — with faith and without",
      "Standing for life and for the Church under attack"
    ]
  },
  {
    n: "iii.",
    title: "Service of the Poor",
    items: [
      "Soup kitchens and meals on the street",
      "Clothing drives for those in need",
      "Partnering with Catholic apostolates",
      "Family-friendly service opportunities"
    ]
  },
  {
    n: "iv.",
    title: "The Outdoors",
    items: [
      "Hikes at every level of difficulty",
      "Routes for families and for adults",
      "Bi-annual longer treks, some with travel",
      "An annual hike with Mass and Confession on the trail"
    ]
  }
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="contours">
          <Contours className="absolute -right-40 -top-40 h-[720px] w-[720px]" />
        </div>
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full summit-glow"
          style={{
            background:
              "radial-gradient(closest-side, rgba(201,154,60,0.22), transparent 70%)"
          }}
        />
        <div className="relative mx-auto max-w-6xl px-5 pb-28 pt-24 md:pt-32">
          <p className="eyebrow">A lay apostolate · New Jersey</p>
          <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[1.05] text-bone md:text-7xl">
            Frassati Fellowship
          </h1>
          <p className="mt-4 font-display text-2xl italic text-goldpale md:text-3xl">
            Verso l&apos;alto — to the heights.
          </p>
          <p className="mt-6 max-w-xl text-lg text-mist">
            A fellowship of Catholics drawn to the mountains and to the Mass,
            climbing together toward the Kingdom of God.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/gatherings" className="btn-gold">
              See our gatherings
            </Link>
            <Link href="/get-involved#join" className="btn-ghost">
              Join the ascent
            </Link>
          </div>
        </div>
        <Ridgeline className="h-14 w-full" />
      </section>

      {/* MISSION */}
      <section className="border-y border-white/5 bg-slate2">
        <div className="mx-auto max-w-4xl px-5 py-24 text-center">
          <Reveal>
            <p className="eyebrow justify-center">Our mission</p>
            <p className="mt-8 font-display text-3xl leading-snug text-bone md:text-4xl">
              To create a fellowship of Catholics passionate about the
              outdoors, supporting one another to live out the{" "}
              <em className="text-goldpale">Beatitudes</em> and to build up the{" "}
              <em className="text-goldpale">Kingdom of God</em>.
            </p>
          </Reveal>
        </div>
      </section>

      {/* PILLARS */}
      <section className="bg-parchment text-ink">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <Reveal>
            <p className="eyebrow">How we live it</p>
            <h2 className="mt-4 max-w-md font-display text-4xl md:text-5xl">
              Four pillars hold the fellowship up.
            </h2>
            <p className="mt-4 max-w-xl text-ink/70">
              Prayer that ascends, a Church we love, a poor we serve, and a
              creation we climb — woven into one common life.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {pillars.map((p) => (
              <Reveal key={p.n}>
                <div className="h-full rounded-2xl border border-ink/10 bg-white/60 p-7">
                  <p className="font-display italic text-gold">{p.n}</p>
                  <h3 className="mt-1 font-display text-2xl">{p.title}</h3>
                  <ul className="mt-4 space-y-2 text-sm text-ink/75">
                    {p.items.map((it) => (
                      <li key={it} className="flex gap-3">
                        <span aria-hidden className="mt-1 text-gold">◇</span>
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* GATHERINGS PREVIEW */}
      <section className="relative overflow-hidden">
        <div className="contours">
          <Contours className="absolute -left-56 top-10 h-[640px] w-[640px]" />
        </div>
        <div className="relative mx-auto max-w-6xl px-5 py-24">
          <Reveal>
            <p className="eyebrow">Signature gatherings</p>
            <h2 className="mt-4 font-display text-4xl text-bone md:text-5xl">
              Two events the fellowship is built around.
            </h2>
            <p className="mt-4 max-w-xl text-mist">
              Each begins in fellowship and rises toward the Lord — one at the
              altar, one on the mountain.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <Reveal>
              <div className="card-dark h-full p-8">
                <p className="eyebrow">Gathering I</p>
                <h3 className="mt-3 font-display text-3xl text-bone">
                  Dinner &amp; Holy Hour
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-mist">
                  Dinners on church property where couples and singles build
                  friendship and plan the season ahead. The evening rises into
                  Exposition of the Blessed Sacrament: Confession, sacred music
                  sung reverently, and quiet time before the Lord.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="chip">First: <b>Fall 2026</b></span>
                  <span className="chip"><b>50–60</b> guests</span>
                  <span className="chip">No fewer than <b>3 priests</b></span>
                </div>
              </div>
            </Reveal>
            <Reveal>
              <div className="card-dark h-full p-8">
                <p className="eyebrow">Gathering II</p>
                <h3 className="mt-3 font-display text-3xl text-bone">
                  The Hike
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-mist">
                  Trails scouted and rated by our hiking coordinators. Hikers
                  are encouraged to attend Mass beforehand and to carry a
                  prayer intention to the heights — families on the gentle
                  routes, adults on the harder ascents.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="chip">First: <b>Fall 2026</b></span>
                  <span className="chip"><b>Family</b> &amp; <b>adult</b> routes</span>
                  <span className="chip">Prayer on the trail</span>
                </div>
              </div>
            </Reveal>
          </div>
          <Reveal className="mt-10">
            <Link href="/gatherings" className="btn-ghost">
              Learn more about our gatherings
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ASK */}
      <section className="border-t border-white/5 bg-slate2">
        <div className="mx-auto max-w-3xl px-5 py-24">
          <Reveal>
            <p className="eyebrow">Questions?</p>
            <h2 className="mt-4 font-display text-3xl text-bone md:text-4xl">
              Ask about the Fellowship.
            </h2>
            <p className="mt-3 text-sm text-mist">
              Curious about St. Pier Giorgio, our gatherings, or how to get
              involved? Ask below.
            </p>
          </Reveal>
          <AskWidget />
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden text-center">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(201,154,60,0.14), transparent 70%)"
          }}
        />
        <div className="relative mx-auto max-w-2xl px-5 py-28">
          <h2 className="font-display text-4xl text-bone md:text-5xl">
            Come climb with us.
          </h2>
          <p className="mt-5 text-mist">
            We begin small and by invitation, and we trust the rest to God.
          </p>
          <Link href="/get-involved#join" className="btn-gold mt-8">
            Join the ascent
          </Link>
          <p className="mt-10 font-display text-2xl italic text-goldpale">
            Verso l&apos;alto.
          </p>
        </div>
      </section>
    </>
  );
}
