"use client";

import DemoBadge from "@/components/DemoBadge";
import React, { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { track } from "@/lib/analytics";

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

  const [toast, setToast] = useState<null | { message: string; tone?: "success" | "error" }>(null);

  function showToast(message: string, tone: "success" | "error" = "success") {
    setToast({ message, tone });
    window.setTimeout(() => setToast(null), 2200);
  }

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as
        | { message?: string; tone?: "success" | "error"; ms?: number }
        | undefined;

      if (!detail?.message) return;

      setToast({ message: detail.message, tone: detail.tone ?? "success" });
      window.setTimeout(() => setToast(null), detail.ms ?? 2200);
    };

    window.addEventListener("carecards:toast", handler as EventListener);

    return () => {
      window.removeEventListener("carecards:toast", handler as EventListener);
    };
  }, []);

  const canGenerate = useMemo(() => {
    return (
      form.recipientName.trim().length > 0 &&
      form.relationship.trim().length > 0 &&
      form.messageIntent.trim().length > 0
    );
  }, [form]);

  const missing = useMemo(() => {
    const m: string[] = [];
    if (!form.recipientName.trim()) m.push("Recipient Name");
    if (!form.relationship.trim()) m.push("Relationship");
    if (!form.messageIntent.trim()) m.push("Message");
    return m;
  }, [form]);



  async function onGenerate() {
    setErr("");
    setPoem("");
    setIsLoading(true);
    track("generate_poem_clicked", {
  occasion: form.occasion,
  tone: form.tone,
  has_sender_name: Boolean(form.senderName.trim()),
  has_meaning: Boolean(form.meaning.trim()),
});


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
      track("generate_poem_success", {
  occasion: form.occasion,
  tone: form.tone,
  poem_length: data.poem.length,
});

    } catch (e: any) {
    track("generate_poem_error", {
  occasion: form.occasion,
  tone: form.tone,
  message: e?.message || "unknown_error",
});
  setErr(e?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-14">
      <header className="mb-10 space-y-3">
  <div className="flex items-start justify-between gap-4">
    <div className="space-y-2">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
        Create a card
      </h1>
      <p className="text-slate-500">
        Fill out the details. We’ll generate a heartfelt poem (demo mode) and show a preview.
      </p>
    </div>

    <DemoBadge />
  </div>
</header>

      <div className="grid gap-10 md:grid-cols-2">
        {/* Left: Form */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Intake</h2>
          <p className="mt-1 text-sm text-slate-500">
            The more detail you share, the better the result.
          </p>

          <div className="mt-6 space-y-4">

            <Field label="Your Name (optional)">
              <input
                className={inputClass}
                value={form.senderName}
                onChange={(e) => setForm({ ...form, senderName: e.target.value })}
                placeholder="e.g., Jordan"
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
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
</div>

   <div className="grid gap-4 md:grid-cols-2">
  <Field label="Occasion">
    <select
      className={inputClass}
      value={form.occasion}
      onChange={(e) => setForm({ ...form, occasion: e.target.value as Occasion })}
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
      {["Warm", "Uplifting", "Comforting", "Grateful", "Celebratory"].map((t) => (
        <option key={t} value={t}>
          {t}
        </option>
      ))}
    </select>
  </Field>
</div>

<Field label="Signature (optional)">
  <select
    className={inputClass}
    value={form.signature}
    onChange={(e) => setForm({ ...form, signature: e.target.value as SignatureLine })}
  >
    <option value="With Care">With Care (default)</option>
    <option value="With Love">With Love</option>
    <option value="Love">Love</option>
    <option value="Sincerely">Sincerely</option>
    <option value="Respectfully">Respectfully</option>
    <option value="Kindly">Kindly</option>
  </select>
</Field>
        

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
                "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium",
                canGenerate && !isLoading
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-slate-200 text-slate-500 cursor-not-allowed",
              ].join(" ")}
            >
              {isLoading ? "Generating…" : "Generate Poem"}
            </button>

            {!canGenerate && missing.length ? (
  <p className="text-xs text-slate-500">
    To generate, add: <span className="font-medium">{missing.join(", ")}</span>.
  </p>
) : null}

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

              <div className="mt-8 flex flex-wrap gap-3">
                <PdfButton
                  poem={poem}
                  recipientName={form.recipientName}
                  occasion={form.occasion}
                  relationship={form.relationship}
                />

                <button
                  disabled={!poem}
                  className={[
                    "rounded-full bg-blue-600 px-4 py-2 text-sm text-white whitespace-nowrap",

                    poem ? "hover:bg-blue-700" : "opacity-50 cursor-not-allowed",
                  ].join(" ")}
                  onClick={async () => {
  if (!poem) return;

  track("share_card_clicked", {
    occasion: form.occasion,
    tone: form.tone,
    recipientName: form.recipientName,
    poem_length: poem.length,
  });

  try {
    await navigator.clipboard.writeText(poem);
    showToast("Copied to clipboard (demo).", "success");
  } catch {
    showToast("Couldn’t copy. Please copy manually.", "error");
  }
}}
                >
                  Share Card
                </button>
              </div>

              <p className="mt-3 text-xs text-slate-500">
                  Demo mode: sharing links + email delivery will be available at launch.
              </p>
            </div>
          </div>
        </section>
      </div>
      {toast ? (
  <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
    <div
      className={[
        "rounded-full border px-4 py-2 text-sm shadow-md backdrop-blur",
        toast.tone === "error"
          ? "border-red-200 bg-white/90 text-red-700"
          : "border-slate-200 bg-white/90 text-slate-800",
      ].join(" ")}
      role="status"
      aria-live="polite"
    >
      {toast.message}
    </div>
  </div>
) : null}

    </main>
  );
}
