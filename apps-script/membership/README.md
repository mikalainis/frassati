# Membership list (Google Apps Script)

Lives in the **Membership** Google Sheet (owned by frassatinj@gmail.com). Keeps one row per
person, matched by email (or by name when there is no email), and adds people automatically when:

- someone signs up on **frassatinj.org** (Get Involved › email sign-up). The website's
  `/api/join` route posts to this script's web app; the email notification to
  frassatinj@gmail.com still goes as before.
- someone submits one of the four **RSVP Google Forms**. If that gathering has an upcoming event
  marked *Show on site = Yes* in the events sheet, the person's cell in that event's column
  (e.g. `Hike 3/6/2027`, added if missing) is set to `RSVP`.

It adds three columns at the end: **Source**, **First contact**, **Last activity**. It never
deletes rows or columns and never overwrites what someone typed (an existing `y` stays).

## Setup (once), signed in as frassatinj@gmail.com

1. Open the Membership sheet › Extensions › Apps Script. Paste `Code.gs`; in Project Settings
   tick *Show "appsscript.json"* and paste `appsscript.json`.
2. Run **setup** and approve the permissions. The log lists each RSVP form as *Linked* or
   *NOT FOUND*. A form is found only if this account owns or can edit it.
3. **Deploy › New deployment › Web app** (Execute as: Me, Who has access: Anyone) and copy the
   web app URL (ends in `/exec`).
4. Save that URL as the GitHub repository secret **MEMBERSHIP_WEBHOOK_URL**
   (Settings › Secrets and variables › Actions), then re-run *Deploy website*.
5. Optional: reload the sheet and use **Membership › Add everyone who already RSVP'd**.
