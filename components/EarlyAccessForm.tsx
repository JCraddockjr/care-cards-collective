"use client";

import * as React from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function EarlyAccessForm() {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<Status>("idle");
  const [message, setMessage] = React.useState<string>("");

  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const isError = status === "error";

  function validateEmail(value: string) {
    // Simple, practical validation (not overly strict)
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmed = email.trim();

    if (!trimmed) {
      setStatus("error");
      setMessage("Please enter your email.");
      return;
    }

    if (!validateEmail(trimmed)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      // Demo-mode: simulate a successful signup without persistence.
      // If you later add a real endpoint, replace this block with a fetch() call.
      await new Promise((r) => setTimeout(r, 600));

      setStatus("success");
      setMessage("You’re on the list. We’ll email you when early access opens.");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  // After success, show a clean confirmation panel instead of the form
  if (isSuccess) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <span
            className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-green-700"
            aria-hidden="true"
          >
            ✓
          </span>

          <div>
            <p className="text-sm font-semibold text-slate-900">
              You&apos;re in.
            </p>
            <p className="mt-1 text-sm text-slate-600">{message}</p>

            <button
              type="button"
              className="mt-4 inline-flex items-center rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              onClick={() => {
                setEmail("");
                setStatus("idle");
                setMessage("");
              }}
            >
              Add another email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      aria-label="Early access signup"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <label htmlFor="early-access-email" className="sr-only">
            Email address
          </label>

          <input
            id="early-access-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              // Clear error state as user edits
              if (status === "error") {
                setStatus("idle");
                setMessage("");
              }
            }}
            disabled={isLoading}
            placeholder="you@example.com"
            className={[
              "w-full rounded-full border bg-white px-4 py-3 text-sm text-slate-900 outline-none",
              "placeholder:text-slate-400",
              "focus:ring-2 focus:ring-blue-500/30",
              isError ? "border-red-300" : "border-slate-300",
              isLoading ? "opacity-70" : "",
            ].join(" ")}
          />

          <p className="mt-2 text-xs text-slate-500">
            Demo mode: we won&apos;t store this yet.
          </p>

          {isError && (
            <p className="mt-2 text-sm text-red-600">{message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={[
            "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium text-white",
            "bg-blue-600 hover:bg-blue-700 transition",
            isLoading ? "opacity-80 cursor-not-allowed" : "",
          ].join(" ")}
        >
          {isLoading ? "Joining..." : "Get Early Access"}
        </button>
      </div>
    </form>
  );
}
