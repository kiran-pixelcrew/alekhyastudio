const tones: Record<string, string> = {
  inquiry: "bg-sand text-charcoal",
  confirmed: "bg-teal/15 text-teal",
  completed: "bg-gold/25 text-charcoal",
  cancelled: "bg-charcoal/10 text-charcoal-muted",
  pending: "bg-sand text-charcoal",
  paid: "bg-teal/15 text-teal",
  partial: "bg-gold/25 text-charcoal",
  refunded: "bg-charcoal/10 text-charcoal-muted",
  sent: "bg-teal/15 text-teal",
  failed: "bg-terracotta/15 text-terracotta-deep",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium capitalize ${
        tones[status] ?? "bg-charcoal/10 text-charcoal"
      }`}
    >
      {status}
    </span>
  );
}
