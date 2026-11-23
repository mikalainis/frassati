"use client";

import { useState } from "react";

// Submissions are emailed to frassatinj@gmail.com via FormSubmit
// (https://formsubmit.co — free, no account needed). The FIRST submission
// triggers a one-time confirmation email to frassatinj@gmail.com; click the
// link in it to activate. After that, every signup arrives in the inbox.
// Each signup is also added to the Membership sheet through /api/join.
const ENDPOINT = "https://formsubmit.co/ajax/frassatinj@gmail.com";

export default function JoinForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", website: "" });

  async function submit() {
    if (!form.email.trim() || status === "sending") return;
    setStatus("sending");
    // Membership sheet: best effort, alongside the email notification.
    const member = fetch("/api/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then((r) => r.ok)
      .catch(() => false);
    if (form.website) {
      setStatus("sent");
      return;
    }
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: "New Frassati Fellowship signup",
          _template: "table",
          _captcha: "false",
          "First name": form.firstName,
          "Last name": form.lastName,
          Email: form.email
        })
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus((await member) ? "sent" : "error");
    }
  }

  if (status === "sent") {
    return (
      <p className="card-dark mt-8 p-6 text-sm text-goldpale">
        Thank you — you&apos;re on the list. We look forward to climbing with
        you. Verso l&apos;alto!
      </p>
    );
  }

  return (
    <div className="card-dark mt-8 grid gap-4 p-6 sm:grid-cols-2">
      <label className="text-sm text-mist">
        First name
        <input
          className="mt-1 w-full rounded-lg border border-white/10 bg-midnight px-3 py-2 text-parchment"
          autoComplete="given-name"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
        />
      </label>
      <label className="text-sm text-mist">
        Last name
        <input
          className="mt-1 w-full rounded-lg border border-white/10 bg-midnight px-3 py-2 text-parchment"
          autoComplete="family-name"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
        />
      </label>
      {/* Hidden from people; bots that fill it in are ignored. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        value={form.website}
        onChange={(e) => setForm({ ...form, website: e.target.value })}
      />
      <label className="text-sm text-mist sm:col-span-2">
        Email address
        <input
          className="mt-1 w-full rounded-lg border border-white/10 bg-midnight px-3 py-2 text-parchment"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </label>
      <div className="sm:col-span-2 flex items-center gap-4">
        <button
          type="button"
          className="btn-gold disabled:opacity-50"
          onClick={submit}
          disabled={status === "sending"}
        >
          {status === "sending" ? "Sending…" : "Subscribe"}
        </button>
        {status === "error" && (
          <p className="text-sm text-red-300">
            Something went wrong — please try again, or email us at
            frassatinj@gmail.com.
          </p>
        )}
      </div>
    </div>
  );
}
