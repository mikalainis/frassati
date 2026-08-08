import { NextRequest, NextResponse } from "next/server";

// Server-side route so the Gemini key never reaches the browser.
// Set GEMINI_API_KEY in .env.local (and in Vercel project settings).

const MODEL = "gemini-2.5-flash";

const CONTEXT = `
You are the friendly assistant for the Frassati Fellowship of New Jersey
(frassatinj.com), a Catholic lay apostolate of Catholics in Central New
Jersey, climbing together toward the Kingdom of God.

Mission: to create a fellowship of Catholics passionate about the outdoors,
supporting one another to live out the Beatitudes and to build up the
Kingdom of God. Patron: St. Pier Giorgio Frassati (1901-1925). Motto:
"Verso l'alto" - to the heights.

Four pillars: (1) Prayer & the Sacraments, (2) Support for Christ's Church,
(3) Service of the Poor, (4) The Outdoors.

Signature gatherings, beginning Fall 2026:
- Dinner & Holy Hour: the evening begins before the Lord with Exposition of
  the Blessed Sacrament, Confession, and sacred music sung reverently, and
  concludes with dinner, where couples and singles build friendship and
  share their faith; 50-60 guests.
- The Hike: scouted and rated trails, family and adult routes, prayer and
  reflection on the trail, signed waiver required.

Organization: a Core Team of lay men and women who hold the vision of the
ministry, committees that plan and report to them (Hikes, Service, Spiritual
Formation, Communications, Music), and priest chaplains who bring the
sacraments to the gatherings.

Answer warmly and concisely. If asked about St. Pier Giorgio Frassati or
general Catholic topics, you may use web search for accuracy. If asked
something you don't know about the fellowship (specific dates, contacts),
suggest joining the mailing list on the Get Involved page.
`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured." },
      { status: 500 }
    );
  }

  let question: string;
  try {
    const body = await req.json();
    question = String(body.question ?? "").slice(0, 500);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!question.trim()) {
    return NextResponse.json({ error: "Empty question." }, { status: 400 });
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: CONTEXT }] },
        contents: [{ role: "user", parts: [{ text: question }] }],
        tools: [{ google_search: {} }],
        generationConfig: { maxOutputTokens: 512 }
      })
    }
  );

  if (!res.ok) {
    const detail = await res.text();
    console.error("Gemini error:", detail);
    return NextResponse.json(
      { error: "The assistant is unavailable right now." },
      { status: 502 }
    );
  }

  const data = await res.json();
  const answer: string =
    data?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text ?? "")
      .join("") ?? "Sorry — I couldn't find an answer.";

  return NextResponse.json({ answer });
}
