"use client";

import { useState } from "react";

export default function AskWidget() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function ask() {
    if (!question.trim() || loading) return;
    setLoading(true);
    setError(null);
    setAnswer(null);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setAnswer(data.answer);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card-dark mt-8 p-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          className="w-full rounded-lg border border-white/10 bg-midnight px-4 py-3 text-sm text-parchment placeholder:text-mist/50"
          placeholder="e.g. Who was St. Pier Giorgio Frassati?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ask()}
          aria-label="Your question"
        />
        <button
          className="btn-gold shrink-0 disabled:opacity-50"
          onClick={ask}
          disabled={loading}
        >
          {loading ? "Thinking…" : "Ask"}
        </button>
      </div>
      {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
      {answer && (
        <p className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-parchment/90">
          {answer}
        </p>
      )}
    </div>
  );
}
