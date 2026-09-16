import { useMemo, useState } from "react";
import { MODELS, PRICING_AS_OF, PROVIDERS, PROVIDER_COLOR, type Provider, type Model } from "../lib/pricing";
import { compact, num } from "../lib/format";
import { Card, Section } from "./ui";
import { interpolate, useT } from "../i18n";

type SortKey = "provider" | "input" | "output" | "cacheRead" | "ratio";

export function PricingTable() {
  const t = useT();
  const [sort, setSort] = useState<SortKey>("input");
  const [asc, setAsc] = useState(true);
  const [active, setActive] = useState<Provider[]>([...PROVIDERS]);

  const toggle = (p: Provider) =>
    setActive((a) => (a.includes(p) ? a.filter((x) => x !== p) : [...a, p]));

  const rows = useMemo(() => {
    const f = MODELS.filter((m) => active.includes(m.provider));
    const val = (m: Model) =>
      sort === "provider"
        ? m.provider
        : sort === "ratio"
          ? m.output / m.input
          : sort === "cacheRead"
            ? (m.cacheRead ?? m.input)
            : m[sort];
    return [...f].sort((a, b) => {
      const va = val(a);
      const vb = val(b);
      const c = typeof va === "string" ? String(va).localeCompare(String(vb)) : Number(va) - Number(vb);
      return asc ? c : -c;
    });
  }, [sort, asc, active]);

  const head = (k: SortKey, label: string, right = true) => (
    <th
      className={`cursor-pointer select-none px-3 py-3 text-[11px] font-semibold whitespace-nowrap uppercase tracking-wider text-mute transition-colors hover:text-cyan ${
        right ? "text-end" : "text-start"
      }`}
      onClick={() => {
        if (sort === k) setAsc(!asc);
        else {
          setSort(k);
          setAsc(true);
        }
      }}
    >
      {label}
      <span className={sort === k ? "text-cyan" : "opacity-0"}> {asc ? "↑" : "↓"}</span>
    </th>
  );

  return (
    <Section
      id="pricing"
      index="05"
      eyebrow={t.pricing.eyebrow}
      tint="cyan"
      title={
        <>
          {t.pricing.title1}
          <br />
          {t.pricing.title2a}
          <span className="text-cyan">{t.pricing.title2Side}</span>
          {t.pricing.title2b}
        </>
      }
      lede={interpolate(t.pricing.lede, { date: PRICING_AS_OF })}
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {PROVIDERS.map((p) => {
          const on = active.includes(p);
          return (
            <button
              key={p}
              onClick={() => toggle(p)}
              className="pill flex items-center gap-2 border px-4 py-2 text-xs font-semibold transition-all"
              style={{
                borderColor: on ? PROVIDER_COLOR[p] : "var(--line)",
                color: on ? "var(--on-fill)" : "var(--mute)",
                background: on ? PROVIDER_COLOR[p] : "transparent",
              }}
            >
              {p}
            </button>
          );
        })}
      </div>

      <Card className="overflow-x-auto">
        <p className="mono border-b border-line px-3 py-2 text-[10px] text-mute lg:hidden">
          {t.pricing.scrollHint}
        </p>
        <table className="w-full min-w-[880px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line">
              {head("provider", t.pricing.cols.model, false)}
              {head("input", t.pricing.cols.input)}
              {head("output", t.pricing.cols.output)}
              {head("ratio", t.pricing.cols.ratio)}
              <th className="px-3 py-3 text-end text-[11px] font-semibold uppercase tracking-wider text-mute">
                {t.pricing.cols.cacheWrite}
              </th>
              {head("cacheRead", t.pricing.cols.cacheRead)}
              <th className="px-3 py-3 text-end text-[11px] font-semibold uppercase tracking-wider text-mute">
                {t.pricing.cols.context}
              </th>
              <th className="px-3 py-3 text-end text-[11px] font-semibold uppercase tracking-wider text-mute">
                {t.pricing.cols.batch}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => {
              const ratio = m.output / m.input;
              const readDisc = m.cacheRead === null ? null : 1 - m.cacheRead / m.input;
              return (
                <tr key={m.id} className="border-b border-line/60 transition-colors hover:bg-ink-3">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="block h-8 w-[3px] shrink-0"
                        style={{ background: PROVIDER_COLOR[m.provider] }}
                        aria-hidden
                      />
                      <span>
                        <span className="block font-semibold text-chalk">{m.label}</span>
                        <span className="mono text-[11px] text-mute">{m.provider}</span>
                      </span>
                    </div>
                  </td>
                  <td className="mono px-3 py-3 text-end text-chalk">${m.input.toFixed(2)}</td>
                  <td className="mono px-3 py-3 text-end text-pink">${m.output.toFixed(2)}</td>
                  <td className="mono px-3 py-3 text-end">
                    <span className={ratio >= 5 ? "text-pink" : ratio <= 2.5 ? "text-lime" : "text-mute"}>
                      {ratio.toFixed(1)}×
                    </span>
                  </td>
                  <td className="mono px-3 py-3 text-end text-amber">
                    {m.cacheWrite5m !== null ? (
                      <>
                        ${m.cacheWrite5m.toFixed(2)}
                        {m.cacheWrite1h !== null && (
                          <span className="text-mute"> / ${m.cacheWrite1h.toFixed(2)}</span>
                        )}
                      </>
                    ) : m.cacheStoragePerHour ? (
                      <span className="text-mute" title="Charged as storage per hour, not per write">
                        ${m.cacheStoragePerHour}/hr
                      </span>
                    ) : (
                      <span className="text-lime">{t.pricing.free}</span>
                    )}
                  </td>
                  <td className="mono px-3 py-3 text-end">
                    {m.cacheRead === null ? (
                      <span className="text-mute">—</span>
                    ) : (
                      <>
                        <span className="text-cyan">${m.cacheRead.toFixed(3)}</span>
                        <span className="block text-[10px] text-mute">
                          −{((readDisc ?? 0) * 100).toFixed(0)}% · {t.pricing.min} {compact(m.cacheMinTokens)}
                        </span>
                      </>
                    )}
                  </td>
                  <td className="mono px-3 py-3 text-end text-mute">
                    {m.contextWindow ? compact(m.contextWindow) : "—"}
                    {m.longContext && (
                      <span
                        className="block text-[10px] text-amber"
                        title={`Above ${num(m.longContext.threshold)} tokens: $${m.longContext.input} in / $${m.longContext.output} out`}
                      >
                        2× &gt;{compact(m.longContext.threshold)}
                      </span>
                    )}
                  </td>
                  <td className="mono px-3 py-3 text-end text-mute">
                    {m.batchDiscount ? `−${(1 - m.batchDiscount) * 100}%` : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {[
          { ...t.pricing.notes.ratio, c: "var(--pink)" },
          { ...t.pricing.notes.longContext, c: "var(--amber)" },
          { ...t.pricing.notes.batch, c: "var(--lime)" },
        ].map((x) => (
          <Card key={x.t} className="p-5">
            <span className="mb-3 block h-1 w-10" style={{ background: x.c }} aria-hidden />
            <h3 className="mb-2 text-sm font-bold text-chalk">{x.t}</h3>
            <p className="text-xs leading-relaxed text-mute">{x.b}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
