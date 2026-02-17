import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Care Cards
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex gap-6 text-sm text-slate-600">
          <Link href="/#how" className="hover:text-slate-900">
            How it works
          </Link>
          <Link href="/#human" className="hover:text-slate-900">
            Human Touch
          </Link>
          <Link href="/#early" className="hover:text-slate-900">
            Early access
          </Link>
        </nav>

        {/* CTA */}
        <Link
          href="/create"
          className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
        >
          Create a Card
        </Link>
      </div>
    </header>
  );
}
