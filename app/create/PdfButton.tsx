"use client";

import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { CardPdf } from "./CardPdf";

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
      className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-800 hover:bg-slate-50"
    >
      {({ loading }) => (loading ? "Preparing PDF…" : "Download PDF")}
    </PDFDownloadLink>
  );
}
