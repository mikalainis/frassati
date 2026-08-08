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

## One-time setup

- **Signup form** (`components/JoinForm.tsx`): sends every signup to
  frassatinj@gmail.com via FormSubmit. The very first submission triggers a
  confirmation email to that inbox — click the activation link once, and all
  future signups arrive automatically.
- **Calendar** (`app/calendar/page.tsx`): embeds the frassatinj@gmail.com
  Google Calendar. Make it public once: Google Calendar → Settings → that
  calendar → Access permissions → "Make available to public." Events you add
  there appear on the site automatically.

## To do next

- Add real photography (trail shots, Holy Hour) — the design leaves room for
  a hero image behind the contour graphics.

Verso l'alto!
