# Event flyers + calendar (Google Apps Script)

Lives in the **Frassati Website — Upcoming Events** Google Sheet (Extensions › Apps Script).
When a row's **Show on site** is switched to **Yes**, it:

1. makes a **dark** and a **light** flyer from the *Frassati Flyer Template* (Google Slides,
   in Drive › Frassati › Event Flyers), filled from the row: date, title, time, location,
   summary, and a QR code for the RSVP form;
2. saves each as editable Slides plus a PDF in **Event Flyers** (PDFs viewable by link);
3. creates the event on the **frassatinj@gmail.com** calendar (or updates one already there
   that day with the same title) and attaches both PDFs;
4. writes **Flyer (dark)**, **Flyer (light)** and **Calendar event** links into the row.

A row is done once it has flyer links. After changing a row's details, use the sheet's
**Frassati** menu › *Remake flyer for this row*. *Make flyers for all rows marked Yes* catches up
rows switched before the script was installed.

## Setup (once)

1. **Calendar access.** Signed in as frassatinj@gmail.com: Google Calendar › Settings ›
   the Frassati calendar › *Share with specific people* › add the account that will run the
   script (e.g. pmikalainis@gmail.com) with **Make changes to events**.
2. **Install the script.** In the events sheet: Extensions › Apps Script. Replace `Code.gs`
   with this folder's `Code.gs`. Project Settings › tick *Show "appsscript.json" manifest file*,
   then replace its contents with this folder's `appsscript.json` (it turns on the Calendar
   API, needed for attachments, and sets the New York time zone).
3. **Run `setup`** (choose it in the function menu, press Run) and approve the permissions.
   It adds the three link columns and the edit trigger. Reload the sheet to see the
   **Frassati** menu.

## Notes

- Event length: Dinner & Holy Hour 3 h, Hike 4 h, Service 3 h, Formation 2 h, starting at the
  first time in the **Time** cell. With no time, the event is all-day.
- A row with its own **RSVP link** gets a QR code for that link (made with quickchart.io);
  otherwise the flyer uses the gathering's standing form.
- The template's slides are tagged in their speaker notes (`hike|dark`, …) and the QR image by
  its alt text (`QR`). Edit the look freely in Slides, but keep those tags and the
  `{{PLACEHOLDERS}}`.
