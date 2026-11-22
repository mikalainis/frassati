/**
 * Frassati Fellowship — cumulative membership list.
 *
 * Lives in the "Membership" Google Sheet (Extensions › Apps Script), installed while signed in
 * as frassatinj@gmail.com. Adds or updates one row per person whenever someone:
 *   • signs up on frassatinj.org (Get Involved › email sign-up) — the website posts here;
 *   • submits one of the four RSVP Google Forms — also marks that event's column "RSVP".
 *
 * People are matched by email (case-insensitive), or by name when there is no email.
 * Existing rows and columns are never removed; values already typed (e.g. "y") are kept.
 *
 * Setup (once): see apps-script/membership/README.md.
 */

const M = {
  SHEET: 'List',
  EVENTS_SHEET_ID: '17NXd2bSEKu-Ykg6RCbwOFFX_3QUnawvdrQbedEqEFLU', // Frassati Website — Upcoming Events
  TIME_ZONE: 'America/New_York',
  FORMS: {
    'Dinner & Holy Hour': 'https://forms.gle/cscCKP3XbaPE68Mn7',
    'Hike': 'https://forms.gle/j3ASM1pjCYMMDyoE8',
    'Service': 'https://forms.gle/ss8sYbNeeXBUp4856',
    'Spiritual Formation': 'https://forms.gle/1AWuGAqnuJqmSSU87',
  },
  // Columns this script adds at the end of the list if they are missing.
  NEW_COLUMNS: ['Source', 'First contact', 'Last activity'],
};

// ---------------------------------------------------------------- setup & menu

/** Run once from the editor. Finds the RSVP forms, adds columns and triggers. */
function setup() {
  const sh = sheet_();
  const h = headers_(sh);
  M.NEW_COLUMNS.forEach((name) => { if (h[name.toLowerCase()] === undefined) addColumn_(sh, name); });

  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === 'onRsvp')
    .forEach((t) => ScriptApp.deleteTrigger(t));

  const found = findForms_();
  const props = PropertiesService.getScriptProperties();
  const report = [];
  Object.keys(M.FORMS).forEach((gathering) => {
    const form = found[gathering];
    if (!form) { report.push('NOT FOUND: ' + gathering + ' form (' + M.FORMS[gathering] + ')'); return; }
    props.setProperty('form:' + form.getId(), gathering);
    ScriptApp.newTrigger('onRsvp').forForm(form).onFormSubmit().create();
    report.push('Linked: ' + gathering + ' → ' + form.getTitle());
  });
  Logger.log(report.join('\n'));
  SpreadsheetApp.getActive().toast(report.join(' · '), 'Membership setup', 15);
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Membership')
    .addItem('Add everyone who already RSVP\'d', 'backfillRsvps')
    .addToUi();
}

/** Adds people from RSVP responses submitted before setup (safe to run more than once). */
function backfillRsvps() {
  const props = PropertiesService.getScriptProperties().getProperties();
  let n = 0;
  Object.keys(props).filter((k) => k.indexOf('form:') === 0).forEach((k) => {
    const form = FormApp.openById(k.slice(5));
    form.getResponses().forEach((r) => {
      const p = personFromResponse_(r);
      if (p.email || p.name) {
        upsertMember_({ name: p.name, email: p.email, source: 'RSVP: ' + props[k],
          when: r.getTimestamp(), eventHeader: null });
        n++;
      }
    });
  });
  SpreadsheetApp.getActive().toast(n + ' RSVP response(s) checked against the list.', 'Membership', 8);
}

// ---------------------------------------------------------------- entry points

/** Form-submit trigger on each RSVP form. */
function onRsvp(e) {
  const formId = e.source.getId();
  const gathering = PropertiesService.getScriptProperties().getProperty('form:' + formId) || 'Event';
  const p = personFromResponse_(e.response);
  if (!p.email && !p.name) return;
  upsertMember_({ name: p.name, email: p.email, source: 'RSVP: ' + gathering,
    when: e.response.getTimestamp(), eventHeader: nextEventHeader_(gathering) });
}

/** Web app endpoint for the website's sign-up form (deployed: execute as me, anyone can access). */
function doPost(e) {
  try {
    const body = JSON.parse((e.postData && e.postData.contents) || '{}');
    if (body.website) return json_({ ok: true }); // honeypot field filled: a bot
    const email = cleanEmail_(body.email);
    if (!email) return json_({ ok: false, error: 'email' });
    const name = [body.firstName, body.lastName].map(clean_).filter(Boolean).join(' ');
    upsertMember_({ name: name, email: email, source: 'Website sign-up', when: new Date(), eventHeader: null });
    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'server' });
  }
}

// ---------------------------------------------------------------- the list

function upsertMember_(p) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sh = sheet_();
    let h = headers_(sh);
    M.NEW_COLUMNS.forEach((name) => { if (h[name.toLowerCase()] === undefined) { addColumn_(sh, name); } });
    if (p.eventHeader && h[p.eventHeader.toLowerCase()] === undefined) addColumn_(sh, p.eventHeader);
    h = headers_(sh);

    const nameCol = h['name'], emailCol = h['e-mail'] !== undefined ? h['e-mail'] : h['email'];
    const last = Math.max(sh.getLastRow(), 1);
    const data = last > 1 ? sh.getRange(2, 1, last - 1, sh.getLastColumn()).getValues() : [];
    const email = cleanEmail_(p.email);
    let idx = -1;
    if (email) idx = data.findIndex((r) => cleanEmail_(r[emailCol]) === email);
    if (idx < 0 && !email && p.name) {
      idx = data.findIndex((r) => clean_(r[nameCol]).toLowerCase() === p.name.toLowerCase());
    }

    const when = Utilities.formatDate(p.when || new Date(), M.TIME_ZONE, 'M/d/yyyy');
    const set = (row, col, value) => sh.getRange(row, col + 1).setValue(value);

    if (idx < 0) {
      const row = last + 1;
      set(row, nameCol, p.name || email);
      set(row, emailCol, email || 'No email listed');
      set(row, h['source'], p.source);
      set(row, h['first contact'], when);
      set(row, h['last activity'], when);
      if (p.eventHeader) set(row, h[p.eventHeader.toLowerCase()], 'RSVP');
      return;
    }
    const row = idx + 2, r = data[idx];
    if (!clean_(r[nameCol]) && p.name) set(row, nameCol, p.name);
    if (email && !cleanEmail_(r[emailCol])) set(row, emailCol, email);
    if (!clean_(r[h['source']])) set(row, h['source'], p.source);
    if (!clean_(r[h['first contact']])) set(row, h['first contact'], when);
    set(row, h['last activity'], when);
    if (p.eventHeader) {
      const c = h[p.eventHeader.toLowerCase()];
      if (!clean_(sh.getRange(row, c + 1).getValue())) set(row, c, 'RSVP');
    }
  } finally {
    lock.releaseLock();
  }
}

/** "Hike 3/6/2027": the gathering's next event marked Show on site = Yes, or null. */
function nextEventHeader_(gathering) {
  try {
    const tab = SpreadsheetApp.openById(M.EVENTS_SHEET_ID).getSheetByName(gathering);
    if (!tab) return null;
    const rows = tab.getDataRange().getValues();
    const head = rows.shift().map((x) => String(x).trim().toLowerCase());
    const iShow = head.indexOf('show on site'), iDate = head.indexOf('date');
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const dates = rows
      .filter((r) => /^(yes|y|true|x)$/i.test(String(r[iShow]).trim()) && r[iDate] instanceof Date && r[iDate] >= today)
      .map((r) => r[iDate]).sort((a, b) => a - b);
    return dates.length ? gathering + ' ' + Utilities.formatDate(dates[0], M.TIME_ZONE, 'M/d/yyyy') : null;
  } catch (err) {
    console.warn('Could not read the events sheet: ' + err);
    return null;
  }
}

// ---------------------------------------------------------------- forms

/** Matches each forms.gle link to a form this account can edit. */
function findForms_() {
  const wanted = {};
  Object.keys(M.FORMS).forEach((g) => { wanted[g] = publishedId_(resolve_(M.FORMS[g])); });
  const found = {};
  const files = DriveApp.getFilesByType(MimeType.GOOGLE_FORMS);
  while (files.hasNext()) {
    const f = files.next();
    let form;
    try { form = FormApp.openById(f.getId()); } catch (err) { continue; }
    const id = publishedId_(form.getPublishedUrl());
    Object.keys(wanted).forEach((g) => { if (wanted[g] && wanted[g] === id) found[g] = form; });
  }
  return found;
}

function resolve_(url) {
  const res = UrlFetchApp.fetch(url, { followRedirects: false, muteHttpExceptions: true });
  const loc = res.getHeaders()['Location'] || res.getHeaders()['location'];
  return loc || url;
}

/** ".../forms/d/e/<PUBLISHED_ID>/viewform?..." → <PUBLISHED_ID> */
function publishedId_(url) {
  const m = String(url || '').match(/\/forms\/d\/e\/([^/?#]+)/);
  return m ? m[1] : '';
}

/** Name and email from a form response, by question title, or the collected email. */
function personFromResponse_(response) {
  let email = '', first = '', last = '', full = '';
  try { email = response.getRespondentEmail() || ''; } catch (err) { /* not collected */ }
  response.getItemResponses().forEach((ir) => {
    const t = ir.getItem().getTitle().toLowerCase();
    const v = clean_(ir.getResponse());
    if (!v) return;
    if (/e-?mail/.test(t)) email = email || v;
    else if (/first\s*name/.test(t)) first = v;
    else if (/(last|sur)\s*name/.test(t)) last = v;
    else if (/\bname\b/.test(t) && !/(child|kid|guest|spouse)/.test(t)) full = full || v;
  });
  return { email: cleanEmail_(email), name: full || [first, last].filter(Boolean).join(' ') };
}

// ---------------------------------------------------------------- helpers

function sheet_() {
  const ss = SpreadsheetApp.getActive();
  return ss.getSheetByName(M.SHEET) || ss.getSheets()[0];
}

function headers_(sh) {
  const row = sh.getRange(1, 1, 1, Math.max(sh.getLastColumn(), 1)).getValues()[0];
  const map = {};
  row.forEach((v, i) => { const k = String(v).trim().toLowerCase(); if (k && map[k] === undefined) map[k] = i; });
  return map;
}

function addColumn_(sh, name) {
  const col = sh.getLastColumn() + 1;
  sh.getRange(1, col).setValue(name).setFontWeight('bold');
}

function clean_(v) { return String(v == null ? '' : v).replace(/\s+/g, ' ').trim(); }

function cleanEmail_(v) {
  const s = clean_(v).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) ? s : '';
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

if (typeof module !== 'undefined') {
  module.exports = { cleanEmail_, clean_, publishedId_ };
}
