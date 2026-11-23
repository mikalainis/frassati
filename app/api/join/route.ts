import { NextResponse } from "next/server";

// Adds website sign-ups to the fellowship's Membership sheet, through the Apps Script web app in
// apps-script/membership. Its URL comes from the MEMBERSHIP_WEBHOOK_URL GitHub secret, passed to
// Cloud Run at deploy; without it, this route does nothing (the email notification still goes).
export const dynamic = "force-dynamic";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const short = (v: unknown, max = 100) => String(v ?? "").trim().slice(0, max);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (short(body.website)) return NextResponse.json({ ok: true }); // honeypot: a bot
  const email = short(body.email, 200).toLowerCase();
  if (!EMAIL.test(email)) return NextResponse.json({ ok: false }, { status: 400 });

  const url = process.env.MEMBERSHIP_WEBHOOK_URL;
  if (!url) return NextResponse.json({ ok: true, stored: false });
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: short(body.firstName),
        lastName: short(body.lastName),
        email
      }),
      signal: AbortSignal.timeout(15000)
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean };
    return NextResponse.json({ ok: true, stored: data.ok === true });
  } catch {
    return NextResponse.json({ ok: true, stored: false });
  }
}
