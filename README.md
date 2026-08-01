# Frassati Fellowship of New Jersey — frassatinj.com

A Next.js (App Router) + TypeScript + Tailwind CSS site for the Frassati
Fellowship, with an optional AI "Ask about the Fellowship" widget powered by
the Google Gemini API with Google Search grounding.

## Getting started (VS Code / GitHub)

```bash
npm install
cp .env.example .env.local   # add your Gemini API key
npm run dev                  # http://localhost:3000
```

Get a free Gemini API key at https://aistudio.google.com/apikey. The site
works without a key — only the Ask widget will report it's unavailable.

## Project structure

```
app/
  page.tsx              Home (hero, mission, pillars, gatherings, ask, CTA)
  about/page.tsx        St. Pier Giorgio Frassati
  gatherings/page.tsx   Dinner & Holy Hour, The Hike, org structure
  get-involved/page.tsx Ways to help + mailing list form
  api/ask/route.ts      Server route calling Gemini (key stays server-side)
components/
  Nav, Footer, Marks (logo + contour/ridgeline SVGs), Reveal, AskWidget, JoinForm
```

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import the repo at https://vercel.com/new — Vercel auto-detects Next.js.
3. In Project → Settings → Environment Variables, add `GEMINI_API_KEY`.
4. In Project → Settings → Domains, add `frassatinj.com` and follow the DNS
   instructions from your registrar (usually an A record to 76.76.21.21 and a
   CNAME for www).

## To do next

- Wire `components/JoinForm.tsx` to a real mailing list (Mailchimp,
  Buttondown, a Google Form, or an API route with Resend).
- Add real photography (trail shots, Holy Hour) — the design leaves room for
  a hero image behind the contour graphics.
- Add an events/calendar page once the first gatherings are scheduled.

Verso l'alto!
