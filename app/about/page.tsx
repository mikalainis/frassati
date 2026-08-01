import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { SummitMark } from "@/components/Marks";

export const metadata: Metadata = {
  title: "St. Pier Giorgio Frassati",
  description:
    "Our patron: St. Pier Giorgio Frassati (1901–1925), the Man of the Beatitudes."
};

const marks = [
  "Devotion to the Eucharist",
  "The rosary, in company",
  "The high places",
  "Hidden service of the poor",
  "Courage for the Church"
];

export default function About() {
  return (
    <>
      <section className="bg-parchment text-ink">
        <div className="mx-auto grid max-w-6xl gap-14 px-5 py-24 md:grid-cols-[1fr_1.4fr] md:items-center">
          <Reveal>
            <div className="mx-auto flex aspect-square max-w-sm items-center justify-center rounded-full border border-gold/50 p-10">
              <SummitMark className="h-40 w-40 text-gold" />
            </div>
          </Reveal>
          <div>
            <Reveal>
              <p className="eyebrow">Our patron</p>
              <h1 className="mt-4 font-display text-4xl md:text-6xl">
                St. Pier Giorgio Frassati
              </h1>
              <p className="mt-3 text-xs uppercase tracking-eyebrow text-gold">
                1901 – 1925 · The Man of the Beatitudes
              </p>
            </Reveal>
            <Reveal>
              <div className="mt-8 space-y-5 leading-relaxed text-ink/80">
                <p>
                  A young Catholic layman of early twentieth-century Turin who
                  held together what so many keep apart: a burning devotion to
                  Christ in the Eucharist, the rosary prayed daily and often in
                  the company of friends, and pure joy in the mountains he
                  loved to climb.
                </p>
                <p>
                  Out of public view he served without ceasing — the poor, the
                  sick, the unemployed, and the outcast of his city. He stood
                  for the moral and social teaching of the Church in a hostile
                  hour, as fascism rose around him. He died at twenty-four,
                  mourned by the poor he had quietly carried.
                </p>
                <p>
                  His mountaineering motto became the rule of his soul, and it
                  is the rule of ours:{" "}
                  <em className="font-display text-lg">
                    Verso l&apos;alto
                  </em>{" "}
                  — to the heights.
                </p>
              </div>
            </Reveal>
            <Reveal>
              <div className="mt-8 flex flex-wrap gap-2">
                {marks.map((m) => (
                  <span key={m} className="chip-light">{m}</span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-24 text-center">
        <Reveal>
          <p className="font-display text-3xl italic leading-snug text-goldpale md:text-4xl">
            &ldquo;The faith given to me in baptism suggests to me surely: by
            yourself you will do nothing, but if you have God as the center of
            all your action, then you will reach the goal.&rdquo;
          </p>
          <p className="mt-6 text-sm uppercase tracking-eyebrow text-mist">
            St. Pier Giorgio Frassati
          </p>
        </Reveal>
      </section>
    </>
  );
}
