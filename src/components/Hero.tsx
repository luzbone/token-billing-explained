import { useEffect, useState } from "react";
import { MODELS, PRICING_AS_OF } from "../lib/pricing";
import { interpolate, useT } from "../i18n";

const cheapest = MODELS.reduce((a, b) => (a.input < b.input ? a : b));
const dearest = MODELS.reduce((a, b) => (a.output > b.output ? a : b));
const spread = dearest.output / cheapest.input;

function Counter({ to, suffix = "", decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setV(to * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return (
    <span className="mono" dir="ltr">
      {v.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export function Hero() {
  const t = useT();

  return (
    <header id="top" className="glow-field relative overflow-hidden px-6 pt-32 pb-20 md:px-10 md:pt-44 md:pb-28">
      <div className="mx-auto max-w-[1240px]">
        <div className="eyebrow mb-8 flex flex-wrap items-center gap-3">
          <span className="pill inline-block h-2 w-2 bg-lime ring-pulse" aria-hidden />
          {interpolate(t.hero.eyebrow, { date: PRICING_AS_OF })}
        </div>

        <h1 className="display max-w-5xl text-[13vw] leading-[0.92] text-chalk sm:text-[9vw] lg:text-[112px]">
          {t.hero.title1}
          <br />
          {t.hero.title2a}
          <span className="text-pink">{t.hero.title2Token}</span>
          {t.hero.title2b}
          <br />
          {t.hero.title3a}
          <span className="text-cyan">{t.hero.title3Hurt}</span>
          {t.hero.title3b}
        </h1>

        <div className="mt-12 grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-end">
          <p className="max-w-xl text-lg leading-relaxed text-mute md:text-xl">
            {t.hero.lede}
          </p>

          <div className="grid grid-cols-3 gap-px bg-line">
            {[
              { l: t.hero.statModels, v: <Counter to={MODELS.length} /> },
              { l: t.hero.statCheapest, v: <Counter to={cheapest.input} decimals={2} suffix="" /> , pre: "$" },
              { l: t.hero.statSpread, v: <Counter to={spread} decimals={0} suffix="×" /> },
            ].map((s) => (
              <div key={s.l} className="bg-ink-2 p-4 md:p-5">
                <div className="eyebrow mb-2 text-[9px]">{s.l}</div>
                <div className="text-2xl font-bold text-chalk md:text-3xl" dir="ltr">
                  {s.pre}
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-4">
          <a
            href="#tokenizer"
            className="pill glow-pink bg-pink px-8 py-4 text-sm font-bold text-ink transition-transform hover:scale-[1.03]"
          >
            {t.hero.ctaStart}
          </a>
          <a
            href="#calculator"
            className="pill border border-cyan px-8 py-4 text-sm font-bold text-cyan transition-colors hover:bg-cyan hover:text-ink"
          >
            {t.hero.ctaCalc}
          </a>
        </div>
      </div>
    </header>
  );
}
