"use client";

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Svg,
  Rect,
  Circle,
} from "@react-pdf/renderer";

/* ============================
   Print constants (Letter)
   ============================ */

// Standard print bleed is often 0.125" = 9pt
const BLEED_PT = 9;

// "Safe area" padding to keep text away from trim (0.75" = 54pt)
const SAFE_PT = 54;

/* ============================
   Paper Texture (safe SVG — NO Pattern/Defs)
   ============================ */

function PaperTexture() {
  return (
    <View
      style={{
        position: "absolute",
        top: -BLEED_PT,
        left: -BLEED_PT,
        right: -BLEED_PT,
        bottom: -BLEED_PT,
      }}
      fixed
    >
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 612 792"
        preserveAspectRatio="none"
      >
        {/* base paper tone */}
        <Rect x="0" y="0" width="612" height="792" fill="#fbfbf7" />

        {/* subtle grain dots (manual — compatible with older react-pdf builds) */}
        {[
          [40, 70, 0.6, 0.03],
          [120, 140, 0.7, 0.028],
          [210, 90, 0.6, 0.03],
          [300, 160, 0.7, 0.026],
          [420, 110, 0.6, 0.03],
          [520, 180, 0.7, 0.026],
          [80, 260, 0.6, 0.028],
          [170, 320, 0.7, 0.025],
          [260, 280, 0.6, 0.028],
          [360, 340, 0.7, 0.024],
          [470, 300, 0.6, 0.028],
          [560, 360, 0.7, 0.024],
          [60, 460, 0.6, 0.026],
          [150, 520, 0.7, 0.023],
          [240, 480, 0.6, 0.026],
          [330, 540, 0.7, 0.022],
          [450, 500, 0.6, 0.026],
          [540, 560, 0.7, 0.022],
          [90, 660, 0.6, 0.024],
          [200, 700, 0.7, 0.022],
          [310, 680, 0.6, 0.024],
          [410, 720, 0.7, 0.021],
          [520, 690, 0.6, 0.024],
        ].map(([cx, cy, r, op], i) => (
          <Circle
            key={i}
            cx={cx as number}
            cy={cy as number}
            r={r as number}
            fill="#0f172a"
            opacity={op as number}
          />
        ))}
      </Svg>
    </View>
  );
}

/* ============================
   Styles
   ============================ */

const styles = StyleSheet.create({
  page: {
    // Bleed-safe margins (safe zone)
    paddingTop: SAFE_PT,
    paddingHorizontal: SAFE_PT,
    paddingBottom: SAFE_PT,
    fontSize: 12,
    lineHeight: 1.6,
    fontFamily: "Helvetica",
    color: "#0f172a",
  },

  /* ---------- Cover ---------- */

 coverWrap: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  paddingTop: 40,
  paddingBottom: 40,
},


  brand: {
    fontSize: 11,
    letterSpacing: 3,
    marginBottom: 20,
    opacity: 0.6,
  },

  // spacing improved
  title: {
  fontSize: 34,
  fontFamily: "Times-Roman",
  marginBottom: 16, // more breathing room
},


subtitle: {
  fontSize: 12,
  opacity: 0.75,
  lineHeight: 1.4,
  marginBottom: 6,
},


  // no "Relationship:" label anymore; slightly tighter placement
  meta: {
    marginTop: 16,
    fontSize: 10,
    opacity: 0.6,
    lineHeight: 1.5,
    textAlign: "center",
  },

  // Premium badge line on cover (Human Touch)
  premiumLine: {
    marginTop: 14,
    fontSize: 10,
    letterSpacing: 2,
    color: "#0f172a",
    opacity: 0.75,
  },

  /* ---------- Inside Page ---------- */

  poemWrap: {
    flex: 1,
    justifyContent: "flex-start",
  },

  // Subtle rule above poem title
  topRule: {
  borderTopWidth: 0.75,
  borderTopColor: "#d1d5db",
  opacity: 0.8,
  marginBottom: 24,
},


  poemTitle: {
    fontSize: 22,
    fontFamily: "Times-Roman",
    marginBottom: 28,
  },

  poemBox: {
  borderWidth: 1,
  borderColor: "#e5e7eb",
  padding: 34, // more breathing room
  borderRadius: 16,
  backgroundColor: "#ffffff",
},


  poemText: {
    fontSize: 13,
    lineHeight: 1.8,
    fontFamily: "Times-Roman",
    whiteSpace: "pre-wrap",
  },

  signatureWrap: {
    marginTop: 22,
  },

  signatureLine: {
  fontFamily: "Times-Italic",
  fontSize: 16,
  lineHeight: 1.4,
  color: "#111827",
},

 signatureName: {
  fontFamily: "Times-Italic",
  fontSize: 20,
  lineHeight: 1.2,
  marginTop: 6,
  color: "#111827",
},


  /* ---------- Watermark (DEMO only) ---------- */

  // IMPORTANT: watermark is ONLY "Care Cards"
  watermark: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "45%",
    textAlign: "center",
    fontSize: 96,
    letterSpacing: 6,
    opacity: 0.035,
    transform: "rotate(-20deg)",
    color: "#0f172a",
  },

  /* ---------- Footer ---------- */

  footer: {
    position: "absolute",
    bottom: 32,
    left: SAFE_PT,
    right: SAFE_PT,
    fontSize: 9,
    textAlign: "center",
    opacity: 0.55,
  },
});

/* ============================
   Types
   ============================ */

export type CardPdfMode = "demo" | "human_touch";

export type CardPdfProps = {
  recipientName: string;
  occasion?: string;
  relationship: string;
  poem: string;
  mode?: CardPdfMode;
};

/* ============================
   Helpers
   ============================ */

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

/* ============================
   PDF Component
   ============================ */

export function CardPdf({
  recipientName,
  occasion,
  relationship,
  poem,
  mode = "demo",
}: CardPdfProps) {
  const prettyOccasion = occasion?.trim() || "A Care Card";
  const today = new Date().toLocaleDateString();
  const { bodyText, signatureLine, senderLine } = parsePoem(poem);

  const isPremium = mode === "human_touch";

  return (
    <Document title={`Care Card - ${recipientName || "Recipient"}`}>
      {/* Page 1: Cover */}
      <Page size="LETTER" style={styles.page}>
        <PaperTexture />

        <View style={styles.coverWrap}>
          <Text style={styles.brand}>CARE CARDS COLLECTIVE</Text>
          <Text style={styles.title}>{prettyOccasion}</Text>
          <Text style={styles.subtitle}>
            Created with care for {recipientName || "____"}
          </Text>

          <View style={styles.meta}>
            {/* Removed "Relationship:" label */}
            <Text>{relationship || "____"}</Text>
            <Text>Date: {today}</Text>
          </View>

          {isPremium ? (
            <Text style={styles.premiumLine}>HUMAN TOUCH • Poet-refined</Text>
          ) : null}
        </View>
      </Page>

      {/* Page 2: Poem */}
      <Page size="LETTER" style={styles.page}>
        <PaperTexture />

        {/* DEMO watermark only. Premium should feel clean/print-ready. */}
        {!isPremium ? <Text style={styles.watermark}>Care Cards</Text> : null}

        <View style={styles.poemWrap}>
          {/* Subtle top rule above "For ____" */}
          <View style={styles.topRule} />

          <Text style={styles.poemTitle}>For {recipientName || "____"}</Text>

          <View style={styles.poemBox}>
            <Text style={styles.poemText}>{bodyText}</Text>

            {signatureLine ? (
              <View style={styles.signatureWrap}>
                <Text style={styles.signatureLine}>{signatureLine}</Text>
                {senderLine ? (
                  <Text style={styles.signatureName}>{senderLine}</Text>
                ) : null}
              </View>
            ) : null}
          </View>
        </View>

        <Text style={styles.footer}>
          {isPremium
            ? "Care Cards Collective • Human Touch Edition"
            : "Care Cards Collective • A moment of care, delivered"}
        </Text>
      </Page>
    </Document>
  );
}
