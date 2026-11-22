/**
 * Frassati Fellowship — event flyers and calendar events from the "Upcoming Events" sheet.
 *
 * When a row's "Show on site" is switched to Yes on a gathering tab, this script:
 *   1. makes a dark and a light flyer from the "Frassati Flyer Template" (Google Slides),
 *      saved as editable Slides plus PDFs in the "Event Flyers" Drive folder;
 *   2. creates the event on the Frassati Google Calendar (or finds it, by date and title)
 *      and attaches both PDFs;
 *   3. writes the flyer and calendar links back into the row.
 *
 * A row is done once its "Flyer (dark)" cell has a link; use the Frassati menu ›
 * "Remake flyer for this row" after editing a row's details.
 *
 * Setup (once): see apps-script/README.md.
 */

const CONFIG = {
  TEMPLATE_ID: '1hG3kQ0CUXr_sL8nGi8c3eFoNVhI3KakVSSgzhi0rRek', // Frassati Flyer Template
  FOLDER_ID: '1kCpi7V0-1wI5WtznV7keGhjUwVVTLQNU',              // Event Flyers
  CALENDAR_ID: 'frassatinj@gmail.com',
  TIME_ZONE: 'America/New_York',
};

const GATHERINGS = {
  'Dinner & Holy Hour': { key: 'dinner', hours: 3, rsvp: 'https://forms.gle/cscCKP3XbaPE68Mn7' },
  'Hike': { key: 'hike', hours: 4, rsvp: 'https://forms.gle/j3ASM1pjCYMMDyoE8' },
  'Service': { key: 'service', hours: 3, rsvp: 'https://forms.gle/ss8sYbNeeXBUp4856' },
  'Spiritual Formation': { key: 'formation', hours: 2, rsvp: 'https://forms.gle/1AWuGAqnuJqmSSU87' },
};

const COL = {
  show: 'Show on site', date: 'Date', time: 'Time', title: 'Title', location: 'Location',
  summary: 'Summary', rsvp: 'RSVP link',
  dark: 'Flyer (dark)', light: 'Flyer (light)', event: 'Calendar event',
};

const THEMES = {
  dark: { qrDark: '0B1420', qrLight: 'FFFFFF' },
  light: { qrDark: '1C2530', qrLight: 'F5F1E8' },
};

// ---------------------------------------------------------------- setup & menu

/** Run once from the editor: adds the link columns and the edit trigger. */
function setup() {
  const ss = SpreadsheetApp.getActive();
  Object.keys(GATHERINGS).forEach((name) => {
    const sh = ss.getSheetByName(name);
    if (!sh) throw new Error('Missing tab: ' + name);
    const headers = headerMap_(sh);
    [COL.dark, COL.light, COL.event].forEach((h) => {
      if (!(h in headers)) {
        const col = sh.getLastColumn() + 1;
        sh.getRange(1, col).setValue(h).setFontWeight('bold')
          .setFontColor('#E4C77E').setBackground('#0B1420');
        sh.setColumnWidth(col, 160);
      }
    });
  });
  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === 'handleEdit')
    .forEach((t) => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('handleEdit').forSpreadsheet(ss).onEdit().create();
  CalendarApp.getCalendarById(CONFIG.CALENDAR_ID) ||
    Logger.log('Cannot open the calendar %s: share it with this account ("Make changes to events").', CONFIG.CALENDAR_ID);
  ss.toast('Flyer automation is on. Switch "Show on site" to Yes to make a flyer.', 'Frassati', 8);
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Frassati')
    .addItem('Make flyer for this row', 'menuMake')
    .addItem('Remake flyer for this row', 'menuRemake')
    .addItem('Make flyers for all rows marked Yes', 'menuAll')
    .addToUi();
}

function menuMake() { menuRow_(false); }
function menuRemake() { menuRow_(true); }

function menuRow_(force) {
  const sh = SpreadsheetApp.getActiveSheet();
  if (!GATHERINGS[sh.getName()]) return toast_('Open a gathering tab first.');
  const row = sh.getActiveRange().getRow();
  if (row < 2) return toast_('Select an event row.');
  processRow_(sh, row, force);
}

function menuAll() {
  const ss = SpreadsheetApp.getActive();
  let made = 0;
  Object.keys(GATHERINGS).forEach((name) => {
    const sh = ss.getSheetByName(name);
    const h = headerMap_(sh);
    const last = sh.getLastRow();
    for (let r = 2; r <= last; r++) {
      const v = sh.getRange(r, h[COL.show] + 1).getValue();
      const done = h[COL.dark] !== undefined && sh.getRange(r, h[COL.dark] + 1).getValue();
      if (isYes_(v) && !done && processRow_(sh, r, false)) made++;
    }
  });
  toast_(made + ' flyer(s) made.');
}

// ---------------------------------------------------------------- trigger

/** Installable on-edit trigger (runs as the person who ran setup). */
function handleEdit(e) {
  const sh = e.range.getSheet();
  if (!GATHERINGS[sh.getName()]) return;
  const h = headerMap_(sh);
  const showCol = h[COL.show] + 1;
  const r0 = e.range.getRow(), r1 = e.range.getLastRow();
  const c0 = e.range.getColumn(), c1 = e.range.getLastColumn();
  if (showCol < c0 || showCol > c1) return;
  for (let r = Math.max(2, r0); r <= r1; r++) {
    if (!isYes_(sh.getRange(r, showCol).getValue())) continue;
    const done = h[COL.dark] !== undefined && sh.getRange(r, h[COL.dark] + 1).getValue();
    if (!done) processRow_(sh, r, false);
  }
}

// ---------------------------------------------------------------- the work

function processRow_(sh, row, force) {
  const g = GATHERINGS[sh.getName()];
  const h = headerMap_(sh);
  if (h[COL.dark] === undefined) return toast_('Run setup() once from Extensions › Apps Script.');
  const vals = sh.getRange(row, 1, 1, sh.getLastColumn()).getValues()[0];
  const get = (name) => (h[name] === undefined ? '' : vals[h[name]]);

  if (!force && get(COL.dark)) return false;
  const date = get(COL.date);
  if (!(date instanceof Date)) return toast_('Row ' + row + ': enter a date first.');
  const title = String(get(COL.title)).trim();
  if (!title) return toast_('Row ' + row + ': enter a title first.');

  const rsvp = safeUrl_(get(COL.rsvp)) || g.rsvp;
  const ev = {
    date: date,
    title: title,
    timeText: String(get(COL.time)).trim(),
    location: String(get(COL.location)).trim(),
    summary: String(get(COL.summary)).trim(),
    rsvp: rsvp,
    customRsvp: rsvp !== g.rsvp,
  };
  toast_('Making the flyer for "' + title + '"…');

  const folder = DriveApp.getFolderById(CONFIG.FOLDER_ID);
  const stamp = Utilities.formatDate(date, CONFIG.TIME_ZONE, 'yyyy-MM-dd');
  const links = {};
  ['dark', 'light'].forEach((theme) => {
    const name = stamp + ' ' + title + ' (' + theme + ')';
    const deck = buildDeck_(folder, name, g.key, theme, ev);
    const pdf = folder.createFile(deck.getAs('application/pdf').setName(name + '.pdf'));
    pdf.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    links[theme] = pdf;
  });

  const eventLink = upsertEvent_(g, ev, links);

  sh.getRange(row, h[COL.dark] + 1).setFormula(linkFormula_(links.dark.getUrl(), 'Dark PDF'));
  sh.getRange(row, h[COL.light] + 1).setFormula(linkFormula_(links.light.getUrl(), 'Light PDF'));
  if (eventLink) sh.getRange(row, h[COL.event] + 1).setFormula(linkFormula_(eventLink, 'Open event'));
  toast_('Flyers made' + (eventLink ? ' and attached to the calendar.' : '. (Calendar not reachable: see the log.)'));
  return true;
}

/** Copies the template, keeps the one slide for this gathering and theme, and fills it in. */
function buildDeck_(folder, name, key, theme, ev) {
  const file = DriveApp.getFileById(CONFIG.TEMPLATE_ID).makeCopy(name, folder);
  const deck = SlidesApp.openById(file.getId());
  deck.getSlides().forEach((s) => {
    const tag = s.getNotesPage().getSpeakerNotesShape().getText().asString().trim();
    if (tag !== key + '|' + theme) s.remove();
  });
  const slide = deck.getSlides()[0];

  const time = splitTime_(ev.timeText);
  const place = splitPlace_(ev.location);
  const values = {
    '{{EYEBROW}}': Utilities.formatDate(ev.date, CONFIG.TIME_ZONE, "EEEE '·' MMMM d, yyyy").toUpperCase(),
    '{{TITLE}}': ev.title,
    '{{SUMMARY}}': ev.summary,
    '{{TIME_MAIN}}': time.main || 'To be announced',
    '{{TIME_SUB}}': time.sub,
    '{{PLACE_MAIN}}': place.main || 'To be announced',
    '{{PLACE_SUB}}': place.sub,
  };

  // Shrink long headlines and chip values to fit before the text goes in.
  slide.getShapes().forEach((shape) => {
    if (!shape.getText) return;
    const t = shape.getText().asString().trim();
    if (t === '{{TITLE}}') shape.getText().getTextStyle().setFontSize(titleSize_(ev.title));
    if (t === '{{PLACE_MAIN}}' && values[t].length > 18) shape.getText().getTextStyle().setFontSize(12);
    if (t === '{{TIME_MAIN}}' && values[t].length > 18) shape.getText().getTextStyle().setFontSize(12);
  });
  Object.keys(values).forEach((k) => slide.replaceAllText(k, values[k] || ' '));

  if (ev.customRsvp) {
    const c = THEMES[theme];
    const qrUrl = 'https://quickchart.io/qr?size=600&margin=1&ecLevel=M&dark=' + c.qrDark +
      '&light=' + c.qrLight + '&text=' + encodeURIComponent(ev.rsvp);
    try {
      const blob = UrlFetchApp.fetch(qrUrl).getBlob();
      slide.getImages().filter((i) => i.getDescription() === 'QR').forEach((i) => i.replace(blob));
    } catch (err) {
      Logger.log('QR for custom RSVP link failed, kept the standing form: ' + err);
    }
  }
  deck.saveAndClose();
  return DriveApp.getFileById(file.getId());
}

/** Creates the calendar event (or reuses one on that day with the same title) and attaches the PDFs. */
function upsertEvent_(g, ev, links) {
  const cal = CalendarApp.getCalendarById(CONFIG.CALENDAR_ID);
  if (!cal) {
    Logger.log('No access to calendar %s. Share it with this account with "Make changes to events".', CONFIG.CALENDAR_ID);
    return null;
  }
  const dayStart = new Date(ev.date); dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dayStart); dayEnd.setDate(dayEnd.getDate() + 1);
  let event = cal.getEvents(dayStart, dayEnd).filter((x) => x.getTitle().trim() === ev.title)[0];

  const description = [
    ev.summary,
    '',
    ev.timeText ? 'When: ' + ev.timeText : '',
    'RSVP: ' + ev.rsvp,
    'Flyer: ' + links.light.getUrl(),
    '',
    'Frassati Fellowship of New Jersey · frassatinj.org',
  ].join('\n').replace(/\n{3,}/g, '\n\n').trim();

  if (!event) {
    const start = startTime_(ev.date, ev.timeText);
    if (start) {
      const end = new Date(start.getTime() + g.hours * 3600 * 1000);
      event = cal.createEvent(ev.title, start, end, { location: ev.location, description: description });
    } else {
      event = cal.createAllDayEvent(ev.title, dayStart, { location: ev.location, description: description });
    }
  } else {
    event.setDescription(description);
    if (ev.location) event.setLocation(ev.location);
  }

  // Attachments need the Calendar advanced service (appsscript.json enables it).
  const eventId = event.getId().replace(/@google\.com$/, '');
  const existing = Calendar.Events.get(CONFIG.CALENDAR_ID, eventId);
  const keep = (existing.attachments || []).filter((a) => !/\((dark|light)\)\.pdf$/.test(a.title || ''));
  const add = ['dark', 'light'].map((t) => ({
    fileUrl: links[t].getUrl(), fileId: links[t].getId(), title: links[t].getName(), mimeType: 'application/pdf',
  }));
  const updated = Calendar.Events.patch({ attachments: keep.concat(add) }, CONFIG.CALENDAR_ID, eventId,
    { supportsAttachments: true });
  return updated.htmlLink;
}

// ---------------------------------------------------------------- helpers (pure)

function headerMap_(sh) {
  const row = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  const map = {};
  row.forEach((v, i) => { const k = String(v).trim(); if (k) map[k] = i; });
  return map;
}

function isYes_(v) {
  return v === true || ['yes', 'y', 'true', 'x', '✓', '✔'].indexOf(String(v).trim().toLowerCase()) >= 0;
}

function safeUrl_(v) {
  const s = String(v || '').trim();
  return /^https?:\/\/\S+$/i.test(s) ? s : '';
}

/** "8:00 AM Mass · 9:30 AM trailhead" → {main: "8:00 AM", sub: "Mass · 9:30 AM trailhead"} */
function splitTime_(text) {
  const s = String(text || '').trim();
  const m = s.match(/^(\d{1,2}(?::\d{2})?\s*[AP]\.?M\.?)\s*[·\-–—,]?\s*(.*)$/i);
  if (m) return { main: m[1].replace(/\s+/, ' ').toUpperCase(), sub: m[2].trim() };
  const parts = s.split(/\s*·\s*/);
  return { main: parts[0] || '', sub: parts.slice(1).join(' · ') };
}

/** "St. James Church, Basking Ridge" → {main: "St. James Church", sub: "Basking Ridge"} */
function splitPlace_(text) {
  const s = String(text || '').trim();
  const paren = s.indexOf(' (');
  const comma = s.indexOf(', ');
  const cut = [paren, comma].filter((i) => i > 0).sort((a, b) => a - b)[0];
  if (cut === undefined) return { main: s, sub: '' };
  return { main: s.slice(0, cut).trim(), sub: s.slice(cut).replace(/^,\s*/, '').trim() };
}

function titleSize_(title) {
  const n = title.length;
  return n <= 30 ? 39 : n <= 42 ? 34 : n <= 56 ? 30 : 26; // points; template default is 39
}

/** Start time from the first time in the Time text, on the event's date; null if none. */
function startTime_(date, text) {
  const m = String(text || '').match(/(\d{1,2})(?::(\d{2}))?\s*([AP])\.?M/i);
  if (!m) return null;
  let hour = Number(m[1]) % 12;
  if (m[3].toUpperCase() === 'P') hour += 12;
  const d = new Date(date);
  d.setHours(hour, Number(m[2] || 0), 0, 0);
  return d;
}

function linkFormula_(url, label) {
  return '=HYPERLINK("' + url.replace(/"/g, '""') + '","' + label + '")';
}

function toast_(msg) {
  try { SpreadsheetApp.getActive().toast(msg, 'Frassati', 6); } catch (e) { Logger.log(msg); }
  return false;
}

if (typeof module !== 'undefined') {
  module.exports = { splitTime_, splitPlace_, titleSize_, startTime_, isYes_, safeUrl_ };
}
