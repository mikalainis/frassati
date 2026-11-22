# Frassati Fellowship of New Jersey — frassatinj.org

A Next.js (App Router) + TypeScript + Tailwind CSS site for the Frassati
Fellowship.

## Getting started (VS Code / GitHub)

```bash
npm install
npm run dev                  # http://localhost:3000
```

## Development in Codespaces

This repository includes a devcontainer configuration for GitHub Codespaces with Node.js 20+ and the Gemini CLI preconfigured.

1. **Add your API Key secret:** Go to **GitHub Settings → Codespaces → Secrets** and add a secret named `GEMINI_API_KEY` with access granted to this repository.
2. **Rebuild the container:** If your Codespace was already running before adding the secret, you must rebuild the container (**Command Palette (`Ctrl/Cmd+Shift+P`) → Codespaces: Rebuild Container**) so that `$GEMINI_API_KEY` is loaded and populated into `~/.gemini/.env`.

## Project structure

```
app/
  page.tsx              Home (hero, mission, pillars, gatherings, CTA)
  about/page.tsx        St. Pier Giorgio Frassati
  gatherings/page.tsx   Dinner & Holy Hour, The Hike, org structure
  get-involved/page.tsx Ways to help + mailing list form
  rsvp/page.tsx         Calendar redirect & gathering RSVP info
components/
  Nav, Footer, Marks (logo + contour/ridgeline SVGs), Reveal, JoinForm
```

## Hosting: Google Cloud Run

The site runs on Google Cloud Run (us-east4) at frassatinj.org. Every merge to
`main` builds a container and deploys it automatically
(`.github/workflows/deploy.yml`); you can also start it by hand under
Actions → Deploy website → Run workflow. GitHub signs in to Google Cloud through
Workload Identity Federation, so no keys are stored anywhere.

One-time setup (in Google Cloud Shell, https://shell.cloud.google.com):

1. Create a Google Cloud project and link billing.
2. `git clone https://github.com/mikalainis/frassati && cd frassati`
3. `PROJECT_ID=<project id> bash infra/gcp/bootstrap.sh`, then paste the lines
   it prints into `infra/gcp/production.env` and merge that to `main`. The
   first deploy runs.
4. `gcloud domains verify frassatinj.org` (once), then
   `PROJECT_ID=<project id> bash infra/gcp/domain.sh` and enter the DNS records
   it prints at GoDaddy, replacing the old Vercel ones.

Cost: within Cloud Run's free tier at this site's traffic; old images are
cleaned up automatically to stay within free storage.

## One-time setup

- **Signup form** (`components/JoinForm.tsx`): sends every signup to
  frassatinj@gmail.com via FormSubmit. The very first submission triggers a
  confirmation email to that inbox — click the activation link once, and all
  future signups arrive automatically.
- **Calendar** (`app/gatherings/page.tsx`): embeds the frassatinj@gmail.com
  Google Calendar. Make it public once: Google Calendar → Settings → that
  calendar → Access permissions → "Make available to public." Events you add
  there appear on the site automatically.

## To do next

- Add real photography (trail shots, Holy Hour) — the design leaves room for
  a hero image behind the contour graphics.

Verso l'alto!
