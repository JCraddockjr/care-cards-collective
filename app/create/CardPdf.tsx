"use client";

import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
/* ============================
   Watermark Component
   ============================ */

const watermarkStyles = StyleSheet.create({
  layer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  text: {
    position: "absolute",
    left: "50%",
    top: "50%",
    fontFamily: "Helvetica",
    fontSize: 64,
    letterSpacing: 2,
    color: "#000",
    opacity: 0.11,
    transform: "translate(-50%, -50%) rotate(-32deg)",
  },
});

function Watermark({
  label = "Care Cards Collective",
}: {
  label?: string;
}) {
  return (
    <View style={watermarkStyles.layer} fixed>
      <Text style={watermarkStyles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 64,
    paddingHorizontal: 48,
    paddingBottom: 64,
    fontSize: 12,
    lineHeight: 1.6,
    fontFamily: "Helvetica",
    color: "#0f172a",
  },

  coverWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },

  brand: {
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 16,
    opacity: 0.75,
  },

  title: {
    fontSize: 32,
    fontFamily: "Times-Roman",
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 12,
    opacity: 0.75,
  },

  meta: {
    marginTop: 28,
    fontSize: 10,
    opacity: 0.65,
  },

  poemTitle: {
    fontSize: 20,
    fontFamily: "Times-Roman",
    marginBottom: 20,
  },

  poemBox: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 20,
    borderRadius: 12,
  },

  poemText: {
    fontSize: 13,
    lineHeight: 1.8,
    fontFamily: "Times-Roman",
    whiteSpace: "pre-wrap",
  },

  signatureWrap: {
    marginTop: 18,
  },

  signatureLine: {
    fontFamily: "Helvetica-Oblique",
    fontSize: 16,
    lineHeight: 1.2,
    color: "#111827",
  },

  signatureName: {
    fontFamily: "Helvetica-Oblique",
    fontSize: 18,
    lineHeight: 1.2,
    marginTop: 4,
    color: "#111827",
  },

  footer: {
    position: "absolute",
    bottom: 32,
    left: 48,
    right: 48,
    fontSize: 9,
    textAlign: "center",
    opacity: 0.55,
  },

  watermark: {
    position: "absolute",
    top: "45%",
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 48,
    opacity: 0.06,
    letterSpacing: 6,
  },
});

export type CardPdfProps = {
  recipientName: string;
  occasion?: string;
  relationship: string;
  poem: string;
};

function parsePoem(poem: string) {
  const lines = (poem || "").split("\n");

  let signatureLine = "";
  let senderLine = "";
  let bodyText = poem || "";

  if (lines.length >= 2) {
    const last = lines[lines.length - 1].trim();
    const secondLast = lines[lines.length - 2].trim();

    if (secondLast.startsWith("— ")) {
      signatureLine = secondLast;

      if (last && !last.startsWith("— ")) {
        senderLine = last;
        bodyText = lines.slice(0, -2).join("\n");
      } else {
        bodyText = lines.slice(0, -1).join("\n");
      }
    }
  }

  return { bodyText, signatureLine, senderLine };
}

export function CardPdf({ recipientName, occasion, relationship, poem }: CardPdfProps) {
  const prettyOccasion = occasion?.trim() ? occasion.trim() : "A Care Card";
  const today = new Date().toLocaleDateString();

  const { bodyText, signatureLine, senderLine } = parsePoem(poem);

  return (
    <Document title={`Care Card - ${recipientName || "Recipient"}`}>
      {/* Page 1: Cover */}
      <Page size="LETTER" style={styles.page}>
        <Watermark />
        <View style={styles.coverWrap}>
          <Text style={styles.brand}>CARE CARDS COLLECTIVE</Text>
          <Text style={styles.title}>{prettyOccasion}</Text>
          <Text style={styles.subtitle}>
            Created with care for {recipientName || "____"}
          </Text>
          <Text style={styles.meta}>
            Relationship: {relationship || "____"}
            {"\n"}
            Date: {today}
          </Text>
        </View>
      </Page>

      {/* Page 2: Poem */}
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.poemTitle}>For {recipientName || "____"}</Text>

        <View style={styles.poemBox}>
          <Text style={styles.poemText}>{bodyText}</Text>

          {signatureLine ? (
            <View style={styles.signatureWrap}>
              <Text style={styles.signatureLine}>{signatureLine}</Text>
              {senderLine ? <Text style={styles.signatureName}>{senderLine}</Text> : null}
            </View>
          ) : null}
        </View>

        <Text style={styles.watermark}>DEMO</Text>

        <Text style={styles.footer}>
          Care Cards Collective • A moment of care, delivered
        </Text>
      </Page>
    </Document>
  );
}
