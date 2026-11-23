/**
 * Frassati Fellowship — cumulative membership list.
 *
 * Lives in the "Membership" Google Sheet (Extensions › Apps Script), installed while signed in
 * as frassatinj@gmail.com. Adds or updates one row per person whenever someone:
 *   • signs up on frassatinj.org (Get Involved › email sign-up) — the website posts here;
 *   • RSVPs with one of the four RSVP forms — read from each form's response sheet. A new RSVP
 *     also marks that gathering's next confirmed event column (e.g. "Hike 3/6/2027") "RSVP".
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
  // Each RSVP form's response spreadsheet.
  RESPONSE_SHEETS: {
    'Dinner & Holy Hour': '1agk5gJQM8Ob78rm7pR0kBcGkMaYLKgsvQlkMZ1xB1Uo',
    'Hike': '1IMdnXxH4s2K5LtrN89UnDYWNyW84zLTVVZrMWmIJM7I',
    'Service': '1qfsycl5FTTeB4il06wcG5wtFJlo2go6YeNKhR0jQAzQ',
    'Spiritual Formation': '1lNoUI4VvHCZmmi8vkutOHlBn5EB6Zvq8XuXJjQyYIsk',
  },
  // Columns this script adds at the end of the list if they are missing.
  NEW_COLUMNS: ['Source', 'First contact', 'Last activity'],
};

// ---------------------------------------------------------------- setup & menu

/** Run once from the editor: adds columns, brings in past RSVPs, and sets up the triggers. */
function setup() {
  PropertiesService.getScriptProperties().setProperty('sheetId', SpreadsheetApp.getActive().getId());
  const sh = sheet_();
  const h = headers_(sh);
  M.NEW_COLUMNS.forEach((name) => { if (h[name.toLowerCase()] === undefined) addColumn_(sh, name); });

  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === 'syncRsvps')
    .forEach((t) => ScriptApp.deleteTrigger(t));

  const report = [];
  Object.keys(M.RESPONSE_SHEETS).forEach((g) => {
    const id = M.RESPONSE_SHEETS[g];
    try {
      SpreadsheetApp.openById(id);
      ScriptApp.newTrigger('syncRsvps').forSpreadsheet(id).onFormSubmit().create(); // instant
      report.push('Linked: ' + g);
    } catch (err) {
      report.push('CANNOT OPEN: ' + g + ' responses (' + err.message + ')');
    }
  });
  ScriptApp.newTrigger('syncRsvps').timeBased().everyHours(1).create(); // safety net

  const added = syncRsvps_(true); // past responses: add people, but mark no event columns
  report.push(added + ' past RSVP(s) checked against the list');
  Logger.log(report.join('\n'));
  SpreadsheetApp.getActive().toast(report.join(' · '), 'Membership setup', 15);
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Membership')
    .addItem('Check for new RSVPs now', 'syncRsvps')
    .addItem('Import website sign-ups from Gmail', 'importSignupEmails')
    .addItem('Update the "Frassati Members" contact label now', 'syncContactsLabel')
    .addToUi();
}

// ---------------------------------------------------------------- entry points

/** Reads rows added to the RSVP response sheets since the last run. */
function syncRsvps() { syncRsvps_(false); }

function syncRsvps_(isBackfill) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) return 0;
  let n = 0;
  try {
    const props = PropertiesService.getScriptProperties();
    Object.keys(M.RESPONSE_SHEETS).forEach((g) => {
      const id = M.RESPONSE_SHEETS[g];
      let rows;
      try { rows = SpreadsheetApp.openById(id).getSheets()[0].getDataRange().getValues(); }
      catch (err) { console.warn('Cannot read ' + g + ' responses: ' + err); return; }
      const head = rows.shift().map((x) => clean_(x).toLowerCase());
      const iTime = head.indexOf('timestamp');
      const iName = head.findIndex((x) => /\bname\b/.test(x) && !/(legal|signature|guest|child)/.test(x));
      const iEmail = head.findIndex((x) => /e-?mail/.test(x));
      const done = Number(props.getProperty('done:' + id) || 0);
      const header = isBackfill ? null : nextEventHeader_(g);
      rows.slice(isBackfill ? 0 : done).forEach((r) => {
        const email = iEmail >= 0 ? cleanEmail_(r[iEmail]) : '';
        const name = iName >= 0 ? titleCase_(clean_(r[iName])) : '';
        if (!email && !name) return;
        upsertMember_({ name: name, email: email, source: 'RSVP: ' + g,
          when: r[iTime] instanceof Date ? r[iTime] : new Date(), eventHeader: header });
        n++;
      });
      props.setProperty('done:' + id, String(rows.length));
    });
  } finally {
    lock.releaseLock();
  }
  return n;
}

/** Web app endpoint for the website's sign-up form (deployed: execute as me, anyone can access). */
function doPost(e) {
  try {
    const body = JSON.parse((e.postData && e.postData.contents) || '{}');
    if (body.website) return json_({ ok: true }); // honeypot field filled: a bot
    const email = cleanEmail_(body.email);
    if (!email) return json_({ ok: false, error: 'email' });
    const name = [body.firstName, body.lastName].map(clean_).filter(Boolean).join(' ');
    const lock = LockService.getScriptLock();
    lock.waitLock(30000);
    try {
      upsertMember_({ name: name, email: email, source: 'Website sign-up', when: new Date(), eventHeader: null });
    } finally {
      lock.releaseLock();
    }
    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'server' });
  }
}

/**
 * One-time catch-up: adds people from the website sign-up emails (sent by FormSubmit to this
 * account's inbox) who are not on the list yet. Safe to run more than once.
 */
function importSignupEmails() {
  const threads = GmailApp.search('subject:"New Frassati Fellowship signup" OR from:formsubmit.co', 0, 500);
  const seen = {};
  let found = 0, added = 0;
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const before = sheet_().getLastRow();
    threads.forEach((t) => t.getMessages().forEach((msg) => {
      const p = parseSignup_(msg.getPlainBody());
      if (!p.email || seen[p.email]) return;
      seen[p.email] = true;
      found++;
      upsertMember_({ name: p.name, email: p.email, source: 'Website sign-up', when: msg.getDate(), eventHeader: null });
    }));
    added = sheet_().getLastRow() - before;
  } finally {
    lock.releaseLock();
  }
  const msg = found + ' sign-up email(s) found; ' + added + ' new person(s) added to the list.';
  Logger.log(msg);
  try { SpreadsheetApp.getActive().toast(msg, 'Membership', 10); } catch (e) { /* run from editor */ }
}

/** Reads "First name / Last name / Email" from a FormSubmit email (table or "Label: value"). */
function parseSignup_(body) {
  const text = String(body || '').replace(/\r/g, '').replace(/\*/g, ''); // Gmail marks bold cells *like this*
  const field = (label) => {
    const m = text.match(new RegExp(label + '\\s*[:|\\t]?\\s*\\n?\\s*([^\\n|\\t]+)', 'i'));
    return m ? clean_(m[1]) : '';
  };
  const email = cleanEmail_(field('Email')) ||
    cleanEmail_((text.match(/[^\s@<>]+@[^\s@<>]+\.[a-z]{2,}/i) || [''])[0].replace(/formsubmit\.co$/i, ''));
  if (!email || /@formsubmit\.co$|frassatinj@gmail\.com$/i.test(email)) return { email: '', name: '' };
  const name = [field('First name'), field('Last name')].filter((x) => x && !/@/.test(x) &&
    !/^(last name|email)$/i.test(x)).map(titleCase_).join(' ');
  return { email: email, name: name };
}

// ---------------------------------------------------------------- Google Contacts label

const LABEL = 'Frassati Members';
const OPT_OUT_COLUMN = 'No emails'; // any value in this column keeps a person off the label

/** Run once: puts everyone on the list under the label and keeps it updated every hour. */
function setupContactsLabel() {
  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === 'syncContactsLabel')
    .forEach((t) => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('syncContactsLabel').timeBased().everyHours(1).create();
  const sh = sheet_();
  if (headers_(sh)[OPT_OUT_COLUMN.toLowerCase()] === undefined) addColumn_(sh, OPT_OUT_COLUMN);
  syncContactsLabel();
}

/**
 * Makes the "Frassati Members" label in this account's Google Contacts match the list: every
 * person with an email is added (creating the contact if needed); anyone with a value in the
 * "No emails" column is taken off the label. Contacts are never deleted, and people you put
 * under the label by hand are left alone.
 */
function syncContactsLabel() {
  const group = contactGroup_();

  // Everyone in Contacts, by email, with whether they already carry the label.
  const byEmail = {};
  let pageToken;
  do {
    const res = People.People.Connections.list('people/me', {
      personFields: 'emailAddresses,memberships', pageSize: 1000, pageToken: pageToken,
    });
    (res.connections || []).forEach((c) => {
      const inGroup = (c.memberships || []).some((m) =>
        m.contactGroupMembership && m.contactGroupMembership.contactGroupResourceName === group);
      (c.emailAddresses || []).forEach((e) => {
        const k = cleanEmail_(e.value);
        if (k && !byEmail[k]) byEmail[k] = { resourceName: c.resourceName, inGroup: inGroup };
      });
    });
    pageToken = res.nextPageToken;
  } while (pageToken);

  // The list.
  const sh = sheet_();
  const h = headers_(sh);
  const emailCol = h['e-mail'] !== undefined ? h['e-mail'] : h['email'];
  const optCol = h[OPT_OUT_COLUMN.toLowerCase()];
  const rows = sh.getLastRow() > 1 ? sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).getValues() : [];

  const toAdd = [], toRemove = [], seen = {};
  const props = PropertiesService.getScriptProperties();
  let created = 0;
  rows.forEach((r) => {
    const email = cleanEmail_(r[emailCol]);
    if (!email || seen[email]) return;
    seen[email] = true;
    const optedOut = optCol !== undefined && clean_(r[optCol]) !== '';
    const known = byEmail[email];
    if (optedOut) { if (known && known.inGroup) toRemove.push(known.resourceName); return; }
    if (known) { if (!known.inGroup) toAdd.push(known.resourceName); return; }
    // Contacts take a few minutes to show up in the listing; don't create the same one twice.
    if (props.getProperty('contact:' + email)) return;
    const name = /[a-z]/i.test(clean_(r[h['name']])) ? clean_(r[h['name']]) : '';
    const person = People.People.createContact({
      names: name ? [{ unstructuredName: name }] : [],
      emailAddresses: [{ value: email }],
      memberships: [{ contactGroupMembership: { contactGroupResourceName: group } }],
    });
    props.setProperty('contact:' + email, person.resourceName || 'created');
    created++;
    Utilities.sleep(700); // stay under the Contacts write limit
  });

  for (let i = 0; i < Math.max(toAdd.length, toRemove.length); i += 500) {
    const body = {};
    if (toAdd.length > i) body.resourceNamesToAdd = toAdd.slice(i, i + 500);
    if (toRemove.length > i) body.resourceNamesToRemove = toRemove.slice(i, i + 500);
    People.ContactGroups.Members.modify(body, group);
  }
  const msg = LABEL + ': ' + created + ' contact(s) created, ' + toAdd.length + ' existing contact(s) labeled, ' +
    toRemove.length + ' removed (No emails).';
  Logger.log(msg);
  try { SpreadsheetApp.getActive().toast(msg, 'Membership', 10); } catch (e) { /* trigger or editor */ }
}

/** Resource name of the "Frassati Members" contact label, creating it if needed. */
function contactGroup_() {
  let pageToken;
  do {
    const res = People.ContactGroups.list({ pageSize: 1000, pageToken: pageToken });
    const g = (res.contactGroups || []).find((x) => x.name === LABEL || x.formattedName === LABEL);
    if (g) return g.resourceName;
    pageToken = res.nextPageToken;
  } while (pageToken);
  return People.ContactGroups.create({ contactGroup: { name: LABEL } }).resourceName;
}

// ---------------------------------------------------------------- the list

/** Adds or updates one person. Callers hold the script lock. */
function upsertMember_(p) {
  const sh = sheet_();
  let h = headers_(sh);
  M.NEW_COLUMNS.forEach((name) => { if (h[name.toLowerCase()] === undefined) addColumn_(sh, name); });
  if (p.eventHeader && h[p.eventHeader.toLowerCase()] === undefined) addColumn_(sh, p.eventHeader);
  h = headers_(sh);

  const nameCol = h['name'];
  const emailCol = h['e-mail'] !== undefined ? h['e-mail'] : h['email'];
  const last = Math.max(sh.getLastRow(), 1);
  const data = last > 1 ? sh.getRange(2, 1, last - 1, sh.getLastColumn()).getValues() : [];
  const email = cleanEmail_(p.email);
  let idx = -1;
  if (email) idx = data.findIndex((r) => cleanEmail_(r[emailCol]) === email);
  if (idx < 0 && p.name) {
    // Same name and no email on file (e.g. "No email listed"): treat as the same person.
    idx = data.findIndex((r) => clean_(r[nameCol]).toLowerCase() === p.name.toLowerCase() &&
      (!cleanEmail_(r[emailCol]) || !email));
  }

  const when = p.when || new Date();
  const setDate = (row, col, d) => sh.getRange(row, col + 1).setValue(d).setNumberFormat('M/d/yyyy');
  const set = (row, col, value) => sh.getRange(row, col + 1).setValue(value);

  if (idx < 0) {
    const row = last + 1;
    set(row, nameCol, p.name || email);
    set(row, emailCol, email || 'No email listed');
    set(row, h['source'], p.source);
    setDate(row, h['first contact'], when);
    setDate(row, h['last activity'], when);
    if (p.eventHeader) set(row, h[p.eventHeader.toLowerCase()], 'RSVP');
    return;
  }
  const row = idx + 2, r = data[idx];
  if (!/[a-z]/i.test(clean_(r[nameCol])) && p.name) set(row, nameCol, p.name); // blank or junk like "* *"
  if (email && !cleanEmail_(r[emailCol])) set(row, emailCol, email);
  const first = r[h['first contact']];
  const earliest = !(first instanceof Date) || when < first;
  if (earliest) setDate(row, h['first contact'], when);
  if (!clean_(r[h['source']]) || (earliest && first instanceof Date)) set(row, h['source'], p.source); // how they first came
  const lastSeen = r[h['last activity']];
  if (!(lastSeen instanceof Date) || when > lastSeen) setDate(row, h['last activity'], when);
  if (p.eventHeader) {
    const c = h[p.eventHeader.toLowerCase()];
    if (!clean_(sh.getRange(row, c + 1).getValue())) set(row, c, 'RSVP');
  }
}

/** "Hike 3/6/2027": the gathering's next event marked Show on site = Yes, or null. */
function nextEventHeader_(gathering) {
  try {
    const tab = SpreadsheetApp.openById(M.EVENTS_SHEET_ID).getSheetByName(gathering);
    if (!tab) return null;
    const rows = tab.getDataRange().getValues();
    const head = rows.shift().map((x) => clean_(x).toLowerCase());
    const iShow = head.indexOf('show on site'), iDate = head.indexOf('date');
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const dates = rows
      .filter((r) => /^(yes|y|true|x)$/i.test(clean_(r[iShow])) && r[iDate] instanceof Date && r[iDate] >= today)
      .map((r) => r[iDate]).sort((a, b) => a - b);
    return dates.length ? gathering + ' ' + Utilities.formatDate(dates[0], M.TIME_ZONE, 'M/d/yyyy') : null;
  } catch (err) {
    console.warn('Could not read the events sheet: ' + err);
    return null;
  }
}

// ---------------------------------------------------------------- helpers

function sheet_() {
  // Triggers on the response sheets run with no "active" sheet of ours, so open it by ID.
  const id = PropertiesService.getScriptProperties().getProperty('sheetId');
  const ss = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActive();
  return ss.getSheetByName(M.SHEET) || ss.getSheets()[0];
}

function headers_(sh) {
  const row = sh.getRange(1, 1, 1, Math.max(sh.getLastColumn(), 1)).getValues()[0];
  const map = {};
  row.forEach((v, i) => { const k = clean_(v).toLowerCase(); if (k && map[k] === undefined) map[k] = i; });
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

/** "paulius mikalainis" → "Paulius Mikalainis"; leaves mixed-case names as typed. */
function titleCase_(s) {
  if (s !== s.toLowerCase() && s !== s.toUpperCase()) return s;
  return s.toLowerCase().replace(/(^|[\s'-])([a-z])/g, (m, a, b) => a + b.toUpperCase());
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

if (typeof module !== 'undefined') {
  module.exports = { cleanEmail_, clean_, titleCase_, parseSignup_ };
}
