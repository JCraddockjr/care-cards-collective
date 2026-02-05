import { NextResponse } from "next/server";

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
  | "- With Care"
  | "With Love"
  | "Love"
  | "Sincerely"
  | "Respectfully"
  | "Kindly";


type Payload = {
  senderName?: string;
  recipientName: string;
  relationship: string;
  occasion: Occasion;
  tone: Tone;
  messageIntent: string;
  meaning?: string;
  signature?: SignatureLine;
};

function clamp(s: string, max: number) {
  return (s || "").trim().slice(0, max);
}

function generatePoem(p: Payload) {
  const recipient = clamp(p.recipientName, 40) || "Friend";
  const relationship = clamp(p.relationship, 60) || "someone special";
  const intent = clamp(p.messageIntent, 280) || "I’m thinking of you.";
  const meaning = clamp(p.meaning || "", 260);
  const sender = clamp(p.senderName || "", 40);

// Normalize signature (dropdown-safe, no double dash)
const signatureText = clamp(p.signature || "With Care", 40) || "With Care";

// Always render em-dash style signature block
const signOff = `\n— ${signatureText}${sender ? `\n${sender}` : ""}`;



  const toneBlocks: Record<Tone, { opener: string[]; closer: string[] }> = {
    Warm: {
      opener: [`Dear ${recipient},`, `Hey ${recipient},`, `${recipient},`],
      closer: [
        `I’m grateful for you—more than I say.`,
        `You matter to me, in real ways.`,
        `Thank you for being you.`,
      ],
    },
    Uplifting: {
      opener: [`${recipient},`, `Dear ${recipient},`, `Hey ${recipient},`],
      closer: [
        `Keep going—your light is real.`,
        `I believe in you, fully.`,
        `You’re built for better days.`,
      ],
    },
    Comforting: {
      opener: [`Dear ${recipient},`, `${recipient},`, `Hey ${recipient},`],
      closer: [
        `You don’t have to carry it alone.`,
        `I’m here—steady, present, and real.`,
        `May peace meet you, little by little.`,
      ],
    },
    Grateful: {
      opener: [`${recipient},`, `Dear ${recipient},`, `Hey ${recipient},`],
      closer: [
        `Thank you for all you are and all you do.`,
        `I don’t take you for granted—ever.`,
        `You’ve made my life better.`,
      ],
    },
    Celebratory: {
      opener: [`Hey ${recipient}!`, `${recipient}!`, `Dear ${recipient},`],
      closer: [
        `Today is yours—enjoy every moment.`,
        `You deserve the celebration.`,
        `Here’s to you—now and next.`,
      ],
    },
  };

  const occasionLine: Record<Occasion, string> = {
    Birthday: `On your birthday, I just want to say this clearly:`,
    "Thinking of You": `Just a note to remind you:`,
    "Just Because": `No special reason—just truth:`,
    Sympathy: `In this moment, I want you to know:`,
    Congratulations: `This is worth celebrating, and so are you:`,
    "Get Well": `As you rest and recover, remember:`,
    Anniversary: `On your anniversary, I’m celebrating you both:`,
  };

  const { opener, closer } = toneBlocks[p.tone] || toneBlocks.Warm;
  const open = opener[Math.floor(Math.random() * opener.length)];
  const close = closer[Math.floor(Math.random() * closer.length)];

  const meaningStanza = meaning
    ? `\nYou are ${relationship} to me—\n${meaning.endsWith(".") ? meaning : meaning + "."}\n`
    : `\nYou are ${relationship} to me,\nand I don’t say that lightly.\n`;

  const lines = [
    open,
    "",
    occasionLine[p.occasion],
    "",
    intent.endsWith(".") ? intent : intent + ".",
    meaningStanza.trimEnd(),
    "If the day feels heavy, I’ll hold hope for you—",
    "if it feels bright, I’ll celebrate right beside you.",
    "",
    close,
    signOff,
  ];

  return lines.join("\n");
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<Payload>;

    if (!body.recipientName || !body.relationship || !body.messageIntent) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const poem = generatePoem(body as Payload);
    return NextResponse.json({ poem });
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
}
