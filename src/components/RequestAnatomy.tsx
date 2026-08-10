import { useEffect, useMemo, useRef, useState } from "react";
import { MODELS, byId, priceUsage } from "../lib/pricing";
import { money, num } from "../lib/format";
import { Card, Section } from "./ui";
import { useT } from "../i18n";

type Phase = "idle" | "uploading" | "thinking" | "streaming" | "done";

const PART_META = [
  { key: "system" as const, tokens: 1200, tone: "#00e5ff" },
  { key: "tools" as const, tokens: 2400, tone: "#7df9ff" },
  { key: "history" as const, tokens: 3600, tone: "#c6ff2e" },
  { key: "user" as const, tokens: 180, tone: "#ffb020" },
];

const INPUT_TOTAL = PART_META.reduce((s, p) => s + p.tokens, 0);
const REASONING = 900;
const VISIBLE_OUT = 420;
const OUTPUT_TOTAL = REASONING + VISIBLE_OUT;

export function RequestAnatomy() {
  const t = useT();
  const [modelId, setModelId] = useState("claude-sonnet-5");
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const raf = useRef<number | undefined>(undefined);
  const model = byId(modelId);

  const parts = PART_META.map((p) => ({
    ...p,
    label: t.anatomy.parts[p.key].label,
    why: t.anatomy.parts[p.key].why,
  }));

  const run = () => {
    cancelAnimationFrame(raf.current!);
    const seq: { p: Phase; ms: number }[] = [
      { p: "uploading", ms: 1600 },
      { p: "thinking", ms: 1300 },
      { p: "streaming", ms: 1800 },
    ];
    let i = 0;
    const step = () => {
      const start = performance.now();
      setPhase(seq[i].p);
      const tick = (now: number) => {
        const elapsed = Math.min(1, (now - start) / seq[i].ms);
        setProgress(elapsed);
        if (elapsed < 1) {
          raf.current = requestAnimationFrame(tick);
        } else if (i < seq.length - 1) {
          i++;
          step();
        } else {
          setPhase("done");
          setProgress(1);
        }
      };
      raf.current = requestAnimationFrame(tick);
    };
    step();
  };

  useEffect(() => () => cancelAnimationFrame(raf.current!), []);

  const billedInput =
    phase === "idle" ? 0 : phase === "uploading" ? Math.round(INPUT_TOTAL * progress) : INPUT_TOTAL;
  const billedReasoning =
    phase === "thinking" ? Math.round(REASONING * progress) : phase === "streaming" || phase === "done" ? REASONING : 0;
  const billedVisible =
    phase === "streaming" ? Math.round(VISIBLE_OUT * progress) : phase === "done" ? VISIBLE_OUT : 0;

  const live = useMemo(
    () =>
      priceUsage(
        model,
        {
          input: billedInput,
          cacheWrite: 0,
          cacheRead: 0,
          output: billedReasoning + billedVisible,
        },
        { promptTokens: INPUT_TOTAL },
      ),
    [model, billedInput, billedReasoning, billedVisible],
  );

  const full = priceUsage(
    model,
    { input: INPUT_TOTAL, cacheWrite: 0, cacheRead: 0, output: OUTPUT_TOTAL },
    { promptTokens: INPUT_TOTAL },
  );
  const ratio = model.output / model.input;

  const phaseCopy: Record<Phase, string> = {
    idle: t.anatomy.phases.idle,
    uploading: t.anatomy.phases.uploading,
    thinking: t.anatomy.phases.thinking,
    streaming: t.anatomy.phases.streaming,
    done: t.anatomy.phases.done,
  };

  return (
    <Section
      id="anatomy"
      index="02"
      eyebrow={t.anatomy.eyebrow}
      tint="pink"
      title={
        <>
          {t.anatomy.title1}
          <br />
          {t.anatomy.title2a}
          <span className="text-pink">{t.anatomy.title2Four}</span>
          {t.anatomy.title2b}
        </>
      }
      lede={t.anatomy.lede}
    >
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <select
          value={modelId}
          onChange={(e) => setModelId(e.target.value)}
          className="px-4 py-3 text-sm"
          aria-label={t.anatomy.ariaModel}
        >
          {MODELS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.provider} · {m.label} — ${m.input}/${m.output} {t.anatomy.per1M}
            </option>
          ))}
        </select>
        <button
          onClick={run}
          className={`pill px-7 py-3 text-sm font-bold text-ink transition-transform hover:scale-[1.03] ${
            phase === "idle" || phase === "done" ? "bg-pink glow-pink" : "bg-line text-mute"
          }`}
        >
          {phase === "idle" ? t.anatomy.run : phase === "done" ? t.anatomy.runAgain : t.anatomy.running}
        </button>
        <span className="mono text-xs text-mute">{phaseCopy[phase]}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        <div className="flex flex-col gap-4">
          <Card className="p-5" accent="cyan">
            <div className="mb-4 flex items-baseline justify-between">
              <span className="eyebrow">{t.anatomy.step1}</span>
              <span className="mono text-sm text-cyan">
                {num(billedInput)} / {num(INPUT_TOTAL)} tok
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {parts.map((p, i) => {
                const before = parts.slice(0, i).reduce((s, x) => s + x.tokens, 0);
                const filled = Math.max(0, Math.min(p.tokens, billedInput - before));
                return (
                  <div key={p.key}>
                    <div className="mb-1 flex items-baseline justify-between gap-3">
                      <span className="text-sm text-chalk">{p.label}</span>
                      <span className="mono text-xs text-mute">{num(p.tokens)} tok</span>
                    </div>
                    <div className="h-2 w-full bg-ink-3">
                      <div
                        className="h-full transition-[width] duration-100"
                        style={{ width: `${(filled / p.tokens) * 100}%`, background: p.tone }}
                      />
                    </div>
                    <p className="mt-1 text-[11px] leading-snug text-mute">{p.why}</p>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-5" accent="pink">
            <div className="mb-4 flex items-baseline justify-between">
              <span className="eyebrow">{t.anatomy.step2}</span>
              <span className="mono text-sm text-pink">
                {num(billedReasoning + billedVisible)} / {num(OUTPUT_TOTAL)} tok
              </span>
            </div>

            <div className="mb-4">
              <div className="mb-1 flex items-baseline justify-between gap-3">
                <span className="text-sm text-chalk">
                  {t.anatomy.hiddenReasoning}{" "}
                  <span className="mono text-[10px] text-amber">{t.anatomy.billedAsOutput}</span>
                </span>
                <span className="mono text-xs text-mute">{num(REASONING)} tok</span>
              </div>
              <div className="h-2 w-full bg-ink-3">
                <div
                  className="h-full bg-amber transition-[width] duration-100"
                  style={{ width: `${(billedReasoning / REASONING) * 100}%` }}
                />
              </div>
              <p className="mt-1 text-[11px] leading-snug text-mute">{t.anatomy.reasoningBody}</p>
            </div>

            <div>
              <div className="mb-1 flex items-baseline justify-between gap-3">
                <span className="text-sm text-chalk">{t.anatomy.visibleAnswer}</span>
                <span className="mono text-xs text-mute">{num(VISIBLE_OUT)} tok</span>
              </div>
              <div className="h-2 w-full bg-ink-3">
                <div
                  className="h-full bg-pink transition-[width] duration-100"
                  style={{ width: `${(billedVisible / VISIBLE_OUT) * 100}%` }}
                />
              </div>
            </div>
          </Card>
        </div>

        <Card className="flex flex-col justify-between p-6">
          <div>
            <div className="eyebrow mb-3">{t.anatomy.liveMeter}</div>
            <div className="mono mb-1 text-5xl font-bold text-chalk md:text-6xl">
              {money(live.total)}
            </div>
            <div className="mono text-xs text-mute">
              {t.anatomy.forOneCall} {model.provider} {model.label}
            </div>

            <div className="mt-8 flex flex-col gap-4">
              {[
                { l: t.anatomy.inputTokens, v: live.input, tok: INPUT_TOTAL, rate: model.input, c: "#00e5ff" },
                { l: t.anatomy.outputTokens, v: live.output, tok: OUTPUT_TOTAL, rate: model.output, c: "#ff1464" },
              ].map((r) => (
                <div key={r.l}>
                  <div className="mb-1 flex items-baseline justify-between">
                    <span className="text-sm text-chalk">{r.l}</span>
                    <span className="mono text-sm" style={{ color: r.c }}>
                      {money(r.v)}
                    </span>
                  </div>
                  <div className="h-3 w-full bg-ink-3">
                    <div
                      className="h-full transition-[width] duration-200"
                      style={{
                        width: `${full.total ? (r.v / full.total) * 100 : 0}%`,
                        background: r.c,
                      }}
                    />
                  </div>
                  <div className="mono mt-1 text-[11px] text-mute">
                    {num(r.tok)} tok × ${r.rate}/1M
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 border-t border-line pt-6">
            <div className="eyebrow mb-2">{t.anatomy.ruleMatters}</div>
            <p className="text-sm leading-relaxed text-chalk">
              {t.anatomy.outputCosts}{" "}
              <span className="mono text-2xl font-bold text-pink">{ratio.toFixed(1)}×</span>{" "}
              {t.anatomy.morePerToken} {model.label}.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-mute">
              {t.anatomy.ruleBody}
              {ratio < 3 && t.anatomy.rareException}
            </p>
          </div>
        </Card>
      </div>
    </Section>
  );
}
