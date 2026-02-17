export default function DemoBadge({
  className = "",
}: {
  className?: string;
}) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm backdrop-blur",
        className,
      ].join(" ")}
      aria-label="Demo mode indicator"
      title="This is a demo experience. Output is placeholder-quality for now."
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
      Demo Mode
    </span>
  );
}
