import { useMemo, useState } from "react";
import { MODELS, PROVIDER_COLOR, priceUsage, type Model } from "../lib/pricing";
import { money, num } from "../lib/format";
import { Card, Section, Slider, Toggle } from "./ui";
import { interpolate, useT } from "../i18n";

const PRESET_VALUES = [
  {
    key: "support" as const,
    calls: 20000,
    system: 6000,
    fresh: 300,
    out: 350,
    cacheable: true,
    batch: false,
  },
  {
    key: "rag" as const,
    calls: 8000,
    system: 40000,
    fresh: 200,
    out: 250,
    cacheable: false,
    batch: false,
  },
  {
    key: "coding" as const,
    calls: 3000,
    system: 25000,
    fresh: 2000,
    out: 3000,
    cacheable: true,
    batch: false,
  },
  {
    key: "overnight" as const,
    calls: 500000,
    system: 400,
    fresh: 300,
    out: 20,
    cacheable: false,
    batch: true,
  },
];

export function WorkloadCalculator() {
  const t = useT();
  const [preset, setPreset] = useState(0);
  const p0 = PRESET_VALUES[0];
  const [calls, setCalls] = useState(p0.calls);
  const [system, setSystem] = useState(p0.system);
  const [fresh, setFresh] = useState(p0.fresh);
  const [out, setOut] = useState(p0.out);
  const [useCache, setUseCache] = useState(p0.cacheable);
  const [batch, setBatch] = useState(p0.batch);
  const [rebuilds, setRebuilds] = useState(720);
  const [storageHours, setStorageHours] = useState(8);

  const presets = PRESET_VALUES.map((x) => ({
    ...x,
    name: t.calculator.presets[x.key].name,
    d: t.calculator.presets[x.key].d,
  }));

  const applyPreset = (i: number) => {
    const x = PRESET_VALUES[i];
    setPreset(i);
    setCalls(x.calls);
    setSystem(x.system);
    setFresh(x.fresh);
    setOut(x.out);
    setUseCache(x.cacheable);
    setBatch(x.batch);
  };

  const results = useMemo(() => {
    const promptTokens = system + fresh;
    const rows = MODELS.map((m: Model) => {
      const writes = useCache ? Math.min(calls, rebuilds) : 0;
      const readCalls = useCache ? calls - writes : 0;
      const plainCalls = calls - readCalls - writes;

      const usage = {
        input: fresh * calls + system * plainCalls,
        cacheWrite: system * writes,
        cacheRead: system * readCalls,
        output: out * calls,
      };
      const priced = priceUsage(m, usage, { batch, promptTokens, prefixTokens: system });
      const storage =
        useCache && m.cacheStoragePerHour && !priced.belowCacheMinimum
          ? (system / 1e6) * m.cacheStoragePerHour * storageHours
          : 0;
      return { m, ...priced, storage, total: priced.total + storage };
    });
    return rows.sort((a, b) => a.total - b.total);
  }, [calls, system, fresh, out, useCache, batch, rebuilds, storageHours]);

  const max = results[results.length - 1]?.total ?? 1;
  const cheapest = results[0];
  const dearest = results[results.length - 1];
  const outShare = cheapest.total > 0 ? cheapest.output / cheapest.total : 0;

  const totalTokens = (fresh + system + out) * calls;

  return (
    <Section
      id="calculator"
      index="06"
      eyebrow={t.calculator.eyebrow}
      tint="pink"
      title={
        <>
          {t.calculator.title1a}
          <span className="text-pink">{t.calculator.title1Your}</span>
          {t.calculator.title1b}
          <br />
          {t.calculator.title2}
        </>
      }
      lede={t.calculator.lede}
    >
      <div className="mb-6 grid gap-px bg-line md:grid-cols-4">
        {presets.map((x, i) => (
          <button
            key={x.key}
            onClick={() => applyPreset(i)}
            className={`p-5 text-start transition-colors ${
              preset === i ? "bg-pink text-ink" : "bg-ink-2 text-mute hover:bg-ink-3"
            }`}
          >
            <span className={`block text-sm font-bold ${preset === i ? "text-ink" : "text-chalk"}`}>
              {x.name}
            </span>
            <span className="mt-2 block text-[11px] leading-snug">{x.d}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card className="flex h-fit flex-col gap-6 p-5">
          <div className="eyebrow">{t.calculator.monthly}</div>
          <Slider
            label={t.calculator.callsMonth}
            value={calls}
            min={100}
            max={1000000}
            step={100}
            onChange={(v) => {
              setCalls(v);
              setPreset(-1);
            }}
            format={num}
          />
          <Slider
            label={t.calculator.repeatedPrefix}
            value={system}
            min={0}
            max={400000}
            step={1000}
            onChange={(v) => {
              setSystem(v);
              setPreset(-1);
            }}
            format={(v) => `${num(v)} tok`}
            hint={t.calculator.repeatedHint}
          />
          <Slider
            label={t.calculator.freshInput}
            value={fresh}
            min={0}
            max={20000}
            step={50}
            onChange={(v) => {
              setFresh(v);
              setPreset(-1);
            }}
            format={(v) => `${num(v)} tok`}
          />
          <Slider
            label={t.calculator.outputPerCall}
            value={out}
            min={10}
            max={20000}
            step={10}
            onChange={(v) => {
              setOut(v);
              setPreset(-1);
            }}
            format={(v) => `${num(v)} tok`}
            hint={t.calculator.outputHint}
          />
          <Toggle
            checked={useCache}
            onChange={(v) => {
              setUseCache(v);
              setPreset(-1);
            }}
            label={t.calculator.cachingEnabled}
            hint={t.calculator.cachingHint}
          />
          {useCache && (
            <>
              <Slider
                label={t.calculator.rebuilds}
                value={rebuilds}
                min={1}
                max={2000}
                onChange={setRebuilds}
                format={(v) => `${num(v)}×`}
                hint={t.calculator.rebuildsHint}
              />
              <Slider
                label={t.calculator.keptAlive}
                value={storageHours}
                min={0}
                max={720}
                onChange={setStorageHours}
                format={(v) => interpolate(t.calculator.keptAliveFormat, { n: v })}
                hint={t.calculator.keptAliveHint}
              />
            </>
          )}
          <Toggle
            checked={batch}
            onChange={(v) => {
              setBatch(v);
              setPreset(-1);
            }}
            label={t.calculator.batchApi}
            hint={t.calculator.batchHint}
          />

          <div className="border-t border-line pt-5">
            <div className="eyebrow mb-2">{t.calculator.volume}</div>
            <div className="mono text-lg text-chalk">
              {num(totalTokens)} {t.calculator.tokensMonth}
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-3">
            <Card className="p-5" accent="lime">
              <div className="eyebrow mb-2">{t.calculator.cheapest}</div>
              <div className="mono text-2xl font-bold text-lime">{money(cheapest.total)}</div>
              <div className="mt-1 text-xs text-chalk">{cheapest.m.label}</div>
            </Card>
            <Card className="p-5" accent="pink">
              <div className="eyebrow mb-2">{t.calculator.mostExpensive}</div>
              <div className="mono text-2xl font-bold text-pink">{money(dearest.total)}</div>
              <div className="mt-1 text-xs text-chalk">{dearest.m.label}</div>
            </Card>
            <Card className="p-5" accent="cyan">
              <div className="eyebrow mb-2">{t.calculator.spread}</div>
              <div className="mono text-2xl font-bold text-cyan">
                {cheapest.total > 0 ? `${(dearest.total / cheapest.total).toFixed(0)}×` : "—"}
              </div>
              <div className="mt-1 text-xs text-mute">{t.calculator.sameJob}</div>
            </Card>
          </div>

          <Card className="p-5">
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
              <span className="eyebrow">{t.calculator.monthlyByModel}</span>
              <span className="mono flex flex-wrap gap-3 text-[10px] text-mute">
                <span className="text-cyan">{t.calculator.legendInput}</span>
                <span className="text-amber">{t.calculator.legendWrite}</span>
                <span className="text-lime">{t.calculator.legendRead}</span>
                <span className="text-pink">{t.calculator.legendOutput}</span>
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {results.map((r) => (
                <div
                  key={r.m.id}
                  className="grid grid-cols-[86px_1fr_72px] items-center gap-2 sm:grid-cols-[150px_1fr_92px] sm:gap-3"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span
                      className="block h-3 w-[3px] shrink-0"
                      style={{ background: PROVIDER_COLOR[r.m.provider] }}
                      aria-hidden
                    />
                    <span className="truncate text-xs text-chalk" title={`${r.m.provider} ${r.m.label}`}>
                      {r.m.label}
                    </span>
                  </div>
                  <div className="flex h-5 w-full bg-ink-3">
                    {[
                      { v: r.input, c: "#00e5ff" },
                      { v: r.cacheWrite, c: "#ffb020" },
                      { v: r.cacheRead, c: "#c6ff2e" },
                      { v: r.output, c: "#ff1464" },
                      { v: r.storage, c: "#8b91a7" },
                    ].map((seg, i) => (
                      <div
                        key={i}
                        className="h-full transition-[width] duration-300"
                        style={{ width: `${max ? (seg.v / max) * 100 : 0}%`, background: seg.c }}
                      />
                    ))}
                  </div>
                  <span className="mono text-end text-xs text-chalk">{money(r.total)}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5" accent="amber">
            <div className="eyebrow mb-3">{t.calculator.readBars}</div>
            <p className="text-sm leading-relaxed text-mute">
              {interpolate(t.calculator.onModel, {
                model: cheapest.m.label,
                out: (outShare * 100).toFixed(0),
                inp: ((1 - outShare) * 100).toFixed(0),
              })}{" "}
              {outShare > 0.6
                ? t.calculator.outputBound
                : outShare < 0.4
                  ? t.calculator.inputBound
                  : t.calculator.balanced}
              {cheapest.belowCacheMinimum && (
                <>
                  {" "}
                  <span className="text-amber">
                    {interpolate(t.calculator.belowMin, {
                      min: num(cheapest.m.cacheMinTokens),
                    })}
                  </span>
                </>
              )}
              {cheapest.longContext && (
                <>
                  {" "}
                  <span className="text-amber">{t.calculator.longContext}</span>
                </>
              )}
            </p>
          </Card>
        </div>
      </div>
    </Section>
  );
}
