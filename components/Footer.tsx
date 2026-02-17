import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 py-8">
      <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row justify-between gap-4 text-sm text-slate-500">
        {/* Copyright */}
        <div>
          © {new Date().getFullYear()} Care Cards Collective
        </div>

        {/* Legal links */}
        <div className="flex gap-4">
          <Link href="/privacy" className="text-blue-700 hover:underline">
            Privacy
          </Link>
          <Link href="/terms" className="text-blue-700 hover:underline">
            Terms
          </Link>
          <Link href="/care-balance" className="text-blue-700 hover:underline">
            Care Balance
          </Link>
        </div>

        {/* Contact */}
        <div>
          Contact:{" "}
          <a
            href="mailto:hello@carecardscollective.com"
            className="text-blue-700 hover:underline"
          >
            hello@carecardscollective.com
          </a>
        </div>
      </div>
    </footer>
  );
}
