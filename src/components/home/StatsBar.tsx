"use client";

import { useEffect, useState } from "react";

function Counter({ value }: { value: string }) {
  const numericString = value.replace(/[^0-9]/g, "");
  const target = parseInt(numericString, 10);

  const [val, setVal] = useState(isNaN(target) ? value : 0);

  useEffect(() => {
    if (isNaN(target)) return;

    let start = 0;
    const step = Math.max(1, target / 30);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setVal(target);
        clearInterval(timer);
      } else {
        setVal(Math.floor(start));
      }
    }, 30);

    return () => clearInterval(timer);
  }, [target]);

  if (isNaN(target)) return <>{value}</>;

  const prefix = value.startsWith("~") ? "~" : "";
  const suffix = value.includes("+") ? "+" : value.includes("s") ? "s" : "";

  return (
    <>
      {prefix}
      {val}
      {suffix}
    </>
  );
}

const STATS = [
  { value: "35+", label: "Data points extracted" },
  { value: "30+", label: "Custom audit rules" },
  { value: "6", label: "Audit categories" },
  { value: "~60s", label: "Average analysis time" },
];

export default function StatsBar() {
  return (
    <section className="border-y border-slate-800/60 bg-slate-900/30 py-8 px-6">
      <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
        {STATS.map((s) => (
          <div key={s.label}>
            <div className="text-3xl font-extrabold tracking-tighter bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              <Counter value={s.value} />
            </div>
            <div className="text-xs text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
