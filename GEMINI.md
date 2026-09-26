# Frassati Fellowship of New Jersey — Project Guide

## Overview
This repository powers the website for the **Frassati Fellowship of New Jersey** (`frassatinj.com`), a Catholic young-adult lay apostolate inspired by Blessed Pier Giorgio Frassati ("Verso l'alto"). The site provides information on monthly gatherings, hikes, spiritual formation, a public calendar, and contact/membership forms.

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5
- **UI & Styling:** React 18, Tailwind CSS 3, PostCSS, Autoprefixer
- **Form Handling:** FormSubmit.co service for mailing list submissions (`frassatinj@gmail.com`)
- **Hosting / Deployment:** Vercel (with custom domain `frassatinj.com`)

## Folder Structure
```
├── .devcontainer/       # Dev container configuration for GitHub Codespaces
├── app/                 # Next.js App Router pages and layouts
│   ├── layout.tsx       # Root layout with fonts, metadata, Nav, and Footer
│   ├── globals.css      # Dark mode styling tokens and utility classes
│   ├── page.tsx         # Homepage (hero, mission, pillars, gatherings, CTA)
│   ├── about/           # Blessed Pier Giorgio Frassati biography & spirituality
│   ├── gatherings/      # Signature gatherings & embedded Google Calendar
│   ├── get-involved/    # Volunteer opportunities and signup form
│   └── rsvp/            # Calendar redirect & RSVP information
├── components/          # Reusable UI components
│   ├── Footer.tsx       # Global footer with links, social accounts, and Instagram
│   ├── JoinForm.tsx     # Mailing list submission form (FormSubmit.co)
│   ├── Marks.tsx        # Brand SVG contour lines and emblems
│   ├── Nav.tsx          # Navigation bar
│   └── Reveal.tsx       # IntersectionObserver scroll animation wrapper
├── public/              # Static media assets and icons
├── package.json         # Project metadata and dependencies
├── tailwind.config.ts   # Custom theme colors (night, gold, parchment, stone, cream)
└── tsconfig.json        # TypeScript configuration
```

## Setup & Commands

### Prerequisites
- Node.js 20+ (LTS recommended)
- `npm`

### Commands
- **Install dependencies:** `npm install`
- **Start development server:** `npm run dev` (starts on `http://localhost:3000`)
- **Build production bundle:** `npm run build`
- **Start production server:** `npm run start`
- **Lint code:** `npm run lint`
- **Test:** TODO: confirm (no automated testing framework currently installed in `package.json`)

## Coding Conventions
- **App Router Architecture:** Pages and layouts are React Server Components by default. Interactive client-side components must declare `"use client"` at the top (e.g., `JoinForm.tsx`, `Nav.tsx`, `Reveal.tsx`).
- **Styling:** Use Tailwind CSS utility classes adhering to the custom design tokens defined in `tailwind.config.ts` (e.g., colors `night-900`, `gold-400`, `parchment-100`) and utility classes in `app/globals.css` (`.card-dark`, `.btn-gold`, `.eyebrow`, `.reveal`).
- **Icons & Graphics:** Prefer SVG vectors and existing symbols in `components/Marks.tsx` for consistent brand identity.
- **Type Safety:** Maintain strict TypeScript typing. Avoid bypassing types or using `any`.

## Rules & Boundaries: What to Change vs. What Not to Change
- **Security:**
  - NEVER commit or hardcode API keys, secrets, or private environment variables into the repository.
- **External Integrations:**
  - Preserve the FormSubmit destination email (`frassatinj@gmail.com`) in `components/JoinForm.tsx` unless explicitly redirected.
  - Preserve the Google Calendar integration in `app/gatherings/page.tsx`.
- **Aesthetics & Theme:**
  - Maintain the established aesthetic: contemplative dark theme, mountain/topographic contour imagery, and gold accents.
