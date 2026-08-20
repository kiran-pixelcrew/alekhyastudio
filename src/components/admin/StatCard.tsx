export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-charcoal/10 bg-cream-soft/80 px-5 py-4 shadow-[0_1px_0_rgba(43,38,32,0.04)]">
      <p className="text-xs uppercase tracking-[0.18em] text-charcoal-muted">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl text-charcoal">{value}</p>
      {hint ? (
        <p className="mt-1 text-sm text-charcoal-muted">{hint}</p>
      ) : null}
    </div>
  );
}
