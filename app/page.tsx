// app/page.tsx
"use client";

import DemoBadge from "@/components/DemoBadge";
import React from "react";
import EarlyAccessForm from "@/components/EarlyAccessForm";


export default function Home() {
  return (
    <div className="space-y-6">

      {/* Hero */}
<section className="mx-auto max-w-6xl px-6 py-16 md:py-20 grid md:grid-cols-2 gap-12 lg:gap-14 items-center">
  <div className="space-y-6">
    <DemoBadge />

    <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
      Thoughtful cards, crafted with care.
    </h1>

    <p className="text-lg text-slate-600 leading-relaxed">
      Create a meaningful poem card in minutes — with Human Touch refinement
      when the moment matters most.
    </p>

    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
      <a
        href="#early"
        className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition"
      >
        Get early access
      </a>

      <a
        href="#how"
        className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 font-medium text-slate-800 hover:bg-slate-50 transition"
      >
        See how it works
      </a>
    </div>
  </div>

  {/* Card preview */}
  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
    <div className="h-48 rounded-xl bg-gradient-to-b from-blue-100 to-white flex items-center justify-center text-slate-500">
      Card cover preview
    </div>

    <div className="mt-5 space-y-3">
      <div className="h-3 bg-slate-300 rounded w-3/4" />
      <div className="h-3 bg-slate-300 rounded w-2/3" />
      <div className="h-3 bg-slate-300 rounded w-1/2" />
    </div>

    <div className="mt-5 text-sm text-blue-700 font-medium">
      Print-ready PDF
    </div>
  </div>
</section>


      {/* How it works */}
      <section id="how" className="border-t border-slate-200 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-semibold tracking-tight">How it works</h2>

          <div className="mt-10 grid md:grid-cols-3 gap-8">
            <Step
              number="01"
              title="Share what you want to say"
              desc="Answer a few guided prompts about the recipient and the message you want to convey."
            />
            <Step
              number="02"
              title="We shape it into a beautiful card"
              desc="Your words are crafted into a thoughtful poem and paired with a clean, elegant design."
            />
            <Step
              number="03"
              title="Download & share"
              desc="Receive a print-ready PDF you can send digitally or keep as a lasting memory."
            />
          </div>
        </div>
      </section>

      {/* Human Touch */}
      <section id="human" className="border-t border-slate-200 py-20 bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Human Touch</h2>

          <p className="mt-5 text-lg text-slate-600">
            When words truly matter, a Care Cards poet personally refines your
            poem for tone, clarity, and emotional resonance.
          </p>

          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Badge>Human Touch · $35</Badge>
            <Badge>Priority (same-day) · +$20</Badge>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Priority is an add-on to Human Touch.
          </p>
        </div>
      </section>

      {/* Early access */}
      <section id="early" className="border-t border-slate-200 py-20">
        <div className="mx-auto max-w-md px-6 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Early access</h2>

          <p className="mt-4 text-slate-600">
            Be the first to know when Care Cards Collective opens.
          </p>

          <EarlyAccessForm />
        </div>
      </section>
    </div>
  );
}

function Step({
  number,
  title,
  desc,
}: {
  number: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-sm font-semibold text-blue-700">{number}</div>
      <h3 className="mt-3 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-slate-600">{desc}</p>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-800">
      {children}
    </span>
  );
}
