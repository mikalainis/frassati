"use client";

import { useState } from "react";

export default function JoinForm() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  return status === "sent" ? (
    <p className="card-dark mt-8 p-6 text-sm text-goldpale">
      Thank you — you&apos;re on the list. We look forward to climbing with
      you. Verso l&apos;alto!
    </p>
  ) : (
    <div className="card-dark mt-8 grid gap-4 p-6 sm:grid-cols-2">
      <label className="text-sm text-mist">
        First name
        <input
          className="mt-1 w-full rounded-lg border border-white/10 bg-midnight px-3 py-2 text-parchment"
          name="firstName"
          autoComplete="given-name"
        />
      </label>
      <label className="text-sm text-mist">
        Last name
        <input
          className="mt-1 w-full rounded-lg border border-white/10 bg-midnight px-3 py-2 text-parchment"
          name="lastName"
          autoComplete="family-name"
        />
      </label>
      <label className="text-sm text-mist sm:col-span-2">
        Email address
        <input
          className="mt-1 w-full rounded-lg border border-white/10 bg-midnight px-3 py-2 text-parchment"
          type="email"
          name="email"
          autoComplete="email"
          required
        />
      </label>
      <div className="sm:col-span-2">
        <button
          type="button"
          className="btn-gold"
          onClick={() => {
            /* TODO: wire to your email provider (Mailchimp, Buttondown,
               a Google Form, or a Next.js API route + Resend). */
            setStatus("sent");
          }}
        >
          Subscribe
        </button>
      </div>
    </div>
  );
}
