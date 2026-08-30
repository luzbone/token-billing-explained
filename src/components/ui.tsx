import type { ReactNode } from "react";

export function Section({
  id,
  index,
  eyebrow,
  title,
  lede,
  children,
  tint = "pink",
}: {
  id: string;
  index: string;
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  children: ReactNode;
  tint?: "pink" | "cyan" | "lime" | "amber";
}) {
  const bar = {
    pink: "bg-pink",
    cyan: "bg-cyan",
    lime: "bg-lime",
    amber: "bg-amber",
  }[tint];

  return (
    <section id={id} className="relative px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1240px]">
        <header className="mb-12 max-w-3xl md:mb-16">
          <div className="mb-5 flex items-center gap-4">
            <span className={`block h-6 w-1 ${bar}`} aria-hidden />
            <span className="eyebrow">
              {index} — {eyebrow}
            </span>
          </div>
          <h2 className="display text-4xl text-chalk md:text-6xl">{title}</h2>
          {lede && (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-mute md:text-lg">{lede}</p>
          )}
        </header>
        {children}
      </div>
    </section>
  );
}

export function Card({
  children,
  className = "",
  accent,
}: {
  children: ReactNode;
  className?: string;
  accent?: "pink" | "cyan" | "lime" | "amber";
}) {
  const stripe = accent
    ? {
        pink: "border-pink/35",
        cyan: "border-cyan/35",
        lime: "border-lime/35",
        amber: "border-amber/35",
      }[accent]
    : "";
  return <div className={`card ${stripe} ${className}`}>{children}</div>;
}

export function Stat({
  label,
  value,
  sub,
  tone = "chalk",
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: "chalk" | "pink" | "cyan" | "lime" | "amber" | "mute";
}) {
  const color = {
    chalk: "text-chalk",
    pink: "text-pink",
    cyan: "text-cyan",
    lime: "text-lime",
    amber: "text-amber",
    mute: "text-mute",
  }[tone];
  return (
    <div>
      <div className="eyebrow mb-2">{label}</div>
      <div className={`mono text-2xl font-bold md:text-3xl ${color}`}>{value}</div>
      {sub && <div className="mt-1 text-xs text-mute">{sub}</div>}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="group flex w-full items-center gap-4 border border-line bg-ink-3 p-4 text-start transition-colors hover:border-cyan"
    >
      <span
        className={`pill relative block h-6 w-11 shrink-0 transition-colors ${
          checked ? "bg-cyan" : "bg-line"
        }`}
      >
        <span
          className={`pill absolute top-1 h-4 w-4 bg-ink-2 transition-all ${
            checked ? "start-6" : "start-1"
          }`}
        />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-chalk">{label}</span>
        {hint && <span className="block text-xs text-mute">{hint}</span>}
      </span>
    </button>
  );
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format = (v: number) => String(v),
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-3 flex items-baseline justify-between gap-3">
        <span className="text-sm font-semibold text-chalk">{label}</span>
        <span className="mono text-sm text-cyan">{format(value)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {hint && <span className="mt-2 block text-xs text-mute">{hint}</span>}
    </label>
  );
}

export function Bar({
  value,
  max,
  tone = "pink",
  height = 10,
}: {
  value: number;
  max: number;
  tone?: "pink" | "cyan" | "lime" | "amber" | "line";
  height?: number;
}) {
  const bg = {
    pink: "bg-pink",
    cyan: "bg-cyan",
    lime: "bg-lime",
    amber: "bg-amber",
    line: "bg-line",
  }[tone];
  const w = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="w-full bg-ink-3" style={{ height }}>
      <div
        className={`${bg} h-full transition-[width] duration-500 ease-out`}
        style={{ width: `${w}%` }}
      />
    </div>
  );
}
