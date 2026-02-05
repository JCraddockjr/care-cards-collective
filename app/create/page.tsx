"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";

// IMPORTANT: client-only component to avoid Turbopack SSR/CJS async issues
const PdfButton = dynamic(() => import("./PdfButton"), { ssr: false });

type Tone = "Warm" | "Uplifting" | "Comforting" | "Grateful" | "Celebratory";
type Occasion =
  | "Birthday"
  | "Thinking of You"
  | "Just Because"
  | "Sympathy"
  | "Congratulations"
  | "Get Well"
  | "Anniversary";

type SignatureLine =
  | "With Care"
  | "With Love"
  | "Love"
  | "Sincerely"
  | "Respectfully"
  | "Kindly";

type FormState = {
  senderName: string;
  recipientName: string;
  relationship: string;
  occasion: Occasion;
  tone: Tone;
  signature: SignatureLine;
  messageIntent: string;
  meaning: string;
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

export default function CreatePage() {
  const [form, setForm] = useState<FormState>({
    senderName: "",
    recipientName: "",
    relationship: "",
    occasion: "Thinking of You",
    tone: "Warm",
    signature: "With Care",
    messageIntent: "",
    meaning: "",
  });

  const [poem, setPoem] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");

  const canGenerate = useMemo(() => {
    return (
      form.recipientName.trim().length > 0 &&
      form.relationship.trim().length > 0 &&
      form.messageIntent.trim().length > 0
    );
  }, [form]);

  async function onGenerate() {
    setErr("");
    setPoem("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/demo-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Generation failed");
      }

      const data = (await res.json()) as { poem: string };
      setPoem(data.poem);
    } catch (e: any) {
      setErr(e?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-14">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Create a Care Card
        </h1>
        <p className="mt-2 text-slate-500">
          Fill out the details. We’ll generate a heartfelt poem (demo mode) and show a preview.
        </p>
      </header>

      <div className="grid gap-10 md:grid-cols-2">
        {/* Left: Form */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Intake</h2>
          <p className="mt-1 text-sm text-slate-500">
            The more detail you share, the better the result.
          </p>

          <div className="mt-6 grid gap-4">
            <Field label="Your Name (optional)">
              <input
                className={inputClass}
                value={form.senderName}
                onChange={(e) => setForm({ ...form, senderName: e.target.value })}
                placeholder="e.g., Jordan"
              />
            </Field>

            <Field label="Recipient Name *">
              <input
                className={inputClass}
                value={form.recipientName}
                onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
                placeholder="e.g., Maya"
              />
            </Field>

            <Field label="Relationship *">
              <input
                className={inputClass}
                value={form.relationship}
                onChange={(e) => setForm({ ...form, relationship: e.target.value })}
                placeholder="e.g., best friend, mom, coworker"
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Occasion">
                <select
                  className={inputClass}
                  value={form.occasion}
                  onChange={(e) =>
                    setForm({ ...form, occasion: e.target.value as Occasion })
                  }
                >
                  {[
                    "Birthday",
                    "Thinking of You",
                    "Just Because",
                    "Sympathy",
                    "Congratulations",
                    "Get Well",
                    "Anniversary",
                  ].map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Tone">
                <select
                  className={inputClass}
                  value={form.tone}
                  onChange={(e) => setForm({ ...form, tone: e.target.value as Tone })}
                >
                  {["Warm", "Uplifting", "Comforting", "Grateful", "Celebratory"].map(
                    (t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    )
                  )}
                </select>
              </Field>

              <Field label="Signature (optional)">
                <select
                  className={inputClass}
                  value={form.signature}
                  onChange={(e) =>
                    setForm({ ...form, signature: e.target.value as SignatureLine })
                  }
                >
                  <option value="With Care">With Care (default)</option>
                  <option value="With Love">With Love</option>
                  <option value="Love">Love</option>
                  <option value="Sincerely">Sincerely</option>
                  <option value="Respectfully">Respectfully</option>
                  <option value="Kindly">Kindly</option>
                </select>
              </Field>
            </div>

            <Field label="What do you want to express? *">
              <textarea
                className={inputClass + " min-h-[110px]"}
                value={form.messageIntent}
                onChange={(e) => setForm({ ...form, messageIntent: e.target.value })}
                placeholder="e.g., I want them to know I'm proud of them and I'm here for them."
              />
            </Field>

            <Field label="What does this person mean to you? (optional)">
              <textarea
                className={inputClass + " min-h-[110px]"}
                value={form.meaning}
                onChange={(e) => setForm({ ...form, meaning: e.target.value })}
                placeholder="e.g., They’ve been steady during hard times and always show up."
              />
            </Field>

            <button
              type="button"
              onClick={onGenerate}
              disabled={!canGenerate || isLoading}
              className={[
                "mt-2 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium",
                canGenerate && !isLoading
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-slate-200 text-slate-500 cursor-not-allowed",
              ].join(" ")}
            >
              {isLoading ? "Generating…" : "Generate Poem"}
            </button>

            {err ? <p className="text-sm text-red-600">{err}</p> : null}
          </div>
        </section>

        {/* Right: Preview */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Preview</h2>
              <p className="mt-1 text-sm text-slate-500">
                This is how the card content will feel.
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              {form.occasion} • {form.tone}
            </span>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-b from-blue-50 to-white p-8">
              <p className="text-xs font-medium text-blue-700">Care Cards Collective</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                {form.occasion}
              </h3>
              <p className="mt-2 text-slate-600">
                For{" "}
                <span className="font-medium text-slate-900">
                  {form.recipientName || "____"}
                </span>
              </p>
              <p className="mt-3 text-sm text-slate-600">
                {form.senderName ? `From ${form.senderName}` : "From ____"}
              </p>
            </div>

            <div className="p-8">
              <div className="leading-relaxed text-slate-900">
                {poem ? (
                  <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed">
                    {poem}
                  </pre>
                ) : (
                  <span className="text-slate-400">
                    Generate a poem to see your preview here.
                  </span>
                )}
              </div>

              <div className="mt-8 flex gap-3">
                <PdfButton
                  poem={poem}
                  recipientName={form.recipientName}
                  occasion={form.occasion}
                  relationship={form.relationship}
                />

                <button
                  disabled={!poem}
                  className={[
                    "rounded-full bg-blue-600 px-4 py-2 text-sm text-white",
                    poem ? "hover:bg-blue-700" : "opacity-50 cursor-not-allowed",
                  ].join(" ")}
                  onClick={() => {
                    if (!poem) return;
                    navigator.clipboard.writeText(poem);
                    alert("Copied poem to clipboard (demo).");
                  }}
                >
                  Copy Text
                </button>
              </div>

              <p className="mt-3 text-xs text-slate-500">
                Next: we’ll replace “Copy Text” with “Share link / Email delivery”.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
