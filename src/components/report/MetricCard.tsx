interface MetricCardProps {
  label: string;
  value: string;
  status: "good" | "needs-improvement" | "poor";
  description?: string;
}

const STATUS_STYLES = {
  good: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  "needs-improvement": "text-amber-400 bg-amber-400/10 border-amber-400/20",
  poor: "text-red-400 bg-red-400/10 border-red-400/20",
};

const STATUS_DOT = {
  good: "bg-emerald-400",
  "needs-improvement": "bg-amber-400",
  poor: "bg-red-400",
};

export default function MetricCard({
  label,
  value,
  status,
  description,
}: MetricCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${STATUS_DOT[status]}`} />
        <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>
      <span
        className={`text-2xl font-bold font-mono px-2 py-0.5 rounded-lg border w-fit ${STATUS_STYLES[status]}`}
      >
        {value}
      </span>
      {description && (
        <p className="text-xs text-slate-600 leading-snug">{description}</p>
      )}
    </div>
  );
}
