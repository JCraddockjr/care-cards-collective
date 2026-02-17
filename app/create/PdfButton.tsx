"use client";

import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { CardPdf } from "./CardPdf";
import { track } from "@/lib/analytics";

export default function PdfButton(props: {
  poem: string;
  recipientName: string;
  occasion: string;
  relationship: string;
}) {
  const { poem, recipientName, occasion, relationship } = props;

  if (!poem) {
    return (
      <button
        disabled
        className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-400 cursor-not-allowed"
      >
        Download PDF
      </button>
    );
  }

  return (
    <PDFDownloadLink
  document={
    <CardPdf
      recipientName={recipientName}
      occasion={occasion}
      relationship={relationship}
      poem={poem}
    />
  }
  fileName={`care-card-${(recipientName || "recipient")
    .toLowerCase()
    .replace(/\s+/g, "-")}.pdf`}
  onClick={() => {
    track("download_pdf_clicked", {
      occasion,
      recipientName,
      relationship,
      poem_length: poem.length,
    });

    // Non-blocking delight: ask the page to show a toast
    try {
      window.dispatchEvent(
        new CustomEvent("carecards:toast", {
          detail: { message: "Preparing your PDF…", tone: "success" },
        })
      );
    } catch {
      // no-op
    }
  }}
  className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-800 hover:bg-slate-50"
>

        {({ loading }) => (loading ? "Preparing PDF…" : "Download PDF")}
    </PDFDownloadLink>
  );
}
