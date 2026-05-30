"use client";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

function getColor(score: number) {
  if (score >= 80) return "#22d3a0";
  if (score >= 60) return "#f59e0b";
  if (score >= 40) return "#f97316";
  return "#ef4444";
}

export default function ScoreRing({
  score,
  size = 100,
  strokeWidth = 7,
  label,
}: ScoreRingProps) {
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (Math.min(score, 100) / 100) * circ;
  const color = getColor(score);
  const cx = size / 2;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke="#1e293b"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{
            transition: "stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)",
          }}
        />
        <text
          x={cx}
          y={cx + size * 0.08}
          textAnchor="middle"
          fill={color}
          fontSize={size * 0.22}
          fontWeight="800"
          fontFamily="'DM Mono', monospace"
          style={{
            transform: "rotate(90deg)",
            transformOrigin: `${cx}px ${cx}px`,
          }}
        >
          {score}
        </text>
      </svg>
      {label && (
        <span className="text-xs font-medium tracking-wide text-slate-400 uppercase">
          {label}
        </span>
      )}
    </div>
  );
}
