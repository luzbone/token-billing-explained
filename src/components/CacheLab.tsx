import { useMemo, useState } from "react";
import { MODELS, byId, cacheBreakeven, priceUsage } from "../lib/pricing";
import { money, num } from "../lib/format";
import { Card, Section, Slider } from "./ui";
import { interpolate, useT } from "../i18n";

export function CacheLab() {
  const t = useT();
  const [modelId, setModelId] = useState("claude-sonnet-5");
  const [prefix, setPrefix] = useState(20000);
  const [hits, setHits] = useState(12);
  const [ttl, setTtl] = useState<"5m" | "1h">("5m");

  const model = byId(modelId);
  const be = cacheBreakeven(model, ttl);
  const writeRate = (ttl === "1h" ? model.cacheWrite1h : model.cacheWrite5m) ?? null;
  const readRate = model.cacheRead;
  const c = t.cache.cards;

  const noCache =
    priceUsage(
      model,
      { input: prefix, cacheWrite: 0, cacheRead: 0, output: 0 },
      { promptTokens: prefix },
    ).total *
    (hits + 1);

  const withCache = useMemo(() => {
    const priced = priceUsage(
      model,
      { input: 0, cacheWrite: prefix, cacheRead: prefix * hits, output: 0 },
      { ttl, promptTokens: prefix, prefixTokens: prefix },
    );
    const storage =
      model.cacheStoragePerHour && !priced.belowCacheMinimum
        ? (prefix / 1e6) * model.cacheStoragePerHour * (ttl === "1h" ? 1 : 5 / 60)
        : 0;
    return { ...priced, storage, total: priced.total + storage };
  }, [model, prefix, hits, ttl]);

  const delta = noCache - withCache.total;
  const savingPct = noCache > 0 ? delta / noCache : 0;

  const cards = [
    {
      t: c.write.t,
      color: "#ffb020",
      price:
        writeRate === null
          ? model.cacheStoragePerHour
            ? interpolate(c.write.storagePrice, { rate: model.cacheStoragePerHour })
            : c.write.noSurcharge
          : interpolate(c.write.per1M, { rate: writeRate }),
      body:
        writeRate === null
          ? model.cacheStoragePerHour
            ? c.write.bodyStorage
            : c.write.bodyFree
          : interpolate(c.write.bodyPaid, { mult: (writeRate / model.input).toFixed(2) }),
    },
    {
      t: c.read.t,
      color: "#00e5ff",
      price: readRate === null ? c.read.notPublished : interpolate(c.read.per1M, { rate: readRate }),
      body:
        readRate === null
          ? c.read.bodyNone
          : interpolate(c.read.bodyPaid, {
              mult: (readRate / model.input).toFixed(2),
              pct: ((1 - readRate / model.input) * 100).toFixed(0),
            }),
    },
    {
      t: c.ttl.t,
      color: "#c6ff2e",
      price:
        model.provider === "Anthropic"
          ? c.ttl.anthropic
          : model.provider === "Google"
            ? c.ttl.google
            : c.ttl.other,
      body:
        model.provider === "Anthropic"
          ? c.ttl.bodyAnthropic
          : model.provider === "Google"
            ? c.ttl.bodyGoogle
            : c.ttl.bodyOther,
    },
    {
      t: c.breakeven.t,
      color: "#ff1464",
      price:
        be === null
          ? c.breakeven.na
          : model.cacheStoragePerHour
            ? c.breakeven.dependsTime
            : be <= 1
              ? c.breakeven.instant
              : interpolate(c.breakeven.reads, { n: be.toFixed(1) }),
      body:
        be === null
          ? c.breakeven.bodyNone
          : model.cacheStoragePerHour
            ? interpolate(c.breakeven.bodyStorage, {
                rate: model.cacheStoragePerHour,
                prefix: (prefix / 1000).toFixed(0),
                hourly: money((prefix / 1e6) * model.cacheStoragePerHour),
              })
            : be <= 1
              ? c.breakeven.bodyInstant
              : interpolate(c.breakeven.bodyPaid, { n: Math.ceil(be) }),
    },
  ];

  return (
    <Section
      id="cache"
      index="04"
      eyebrow={t.cache.eyebrow}
      tint="lime"
      title={
        <>
          {t.cache.title1a}
          <span className="text-lime">{t.cache.title1Bet}</span>
          {t.cache.title1b}
          <br />
          {t.cache.title2}
        </>
      }
      lede={t.cache.lede}
    >
      <div className="mb-8 grid gap-px bg-line md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.t} className="bg-ink-2 p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="block h-2 w-2" style={{ background: card.color }} aria-hidden />
              <span className="eyebrow">{card.t}</span>
            </div>
            <div className="mono mb-3 text-lg font-bold" style={{ color: card.color }}>
              {card.price}
            </div>
            <p className="text-xs leading-relaxed text-mute">{card.body}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <Card className="flex flex-col gap-6 p-5">
          <div className="eyebrow">{t.cache.simulator}</div>
          <select
            value={modelId}
            onChange={(e) => setModelId(e.target.value)}
            className="px-4 py-3 text-sm"
            aria-label={t.cache.ariaModel}
          >
            {MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.provider} · {m.label}
              </option>
            ))}
          </select>

          {model.provider === "Anthropic" && (
            <div className="flex gap-px bg-line">
              {(["5m", "1h"] as const).map((ttlOpt) => (
                <button
                  key={ttlOpt}
                  onClick={() => setTtl(ttlOpt)}
                  className={`flex-1 px-4 py-3 text-xs font-semibold transition-colors ${
                    ttl === ttlOpt ? "bg-lime text-ink" : "bg-ink-3 text-mute hover:text-chalk"
                  }`}
                >
                  {ttlOpt === "5m" ? t.cache.ttl5m : t.cache.ttl1h}
                </button>
              ))}
            </div>
          )}

          <Slider
            label={t.cache.prefixSize}
            value={prefix}
            min={1000}
            max={200000}
            step={1000}
            onChange={setPrefix}
            format={(v) => `${num(v)} tok`}
            hint={t.cache.prefixHint}
          />
          <Slider
            label={t.cache.hitsBefore}
            value={hits}
            min={0}
            max={200}
            onChange={setHits}
            format={(v) => interpolate(t.cache.hitsFormat, { n: v })}
            hint={t.cache.hitsHint}
          />
        </Card>

        <div className="flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Card className="p-5" accent="pink">
              <div className="eyebrow mb-2">{t.cache.without}</div>
              <div className="mono text-3xl font-bold text-pink">{money(noCache)}</div>
              <p className="mt-3 text-xs text-mute">
                {interpolate(t.cache.withoutBody, {
                  tokens: num(prefix * (hits + 1)),
                  rate: model.input,
                })}
              </p>
            </Card>
            <Card className="p-5" accent={delta >= 0 ? "lime" : "amber"}>
              <div className="eyebrow mb-2">{t.cache.with}</div>
              <div
                className={`mono text-3xl font-bold ${delta >= 0 ? "text-lime" : "text-amber"}`}
              >
                {money(withCache.total)}
              </div>
              <p className="mt-3 text-xs text-mute">
                {interpolate(t.cache.withBody, { hits: num(hits) })}
                {withCache.storage > 0 &&
                  interpolate(t.cache.plusStorage, { money: money(withCache.storage) })}
              </p>
            </Card>
          </div>

          <Card className={`p-6 ${delta >= 0 ? "" : "border-amber"}`}>
            <div className="eyebrow mb-3">{t.cache.verdict}</div>
            {delta > 0 ? (
              <>
                <p className="display text-3xl text-lime md:text-4xl">
                  {interpolate(t.cache.saves, {
                    money: money(delta),
                    pct: (savingPct * 100).toFixed(0),
                  })}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-mute">
                  {interpolate(t.cache.savesBody, { hits, prefix: num(prefix) })}
                  {be !== null &&
                    be > 1 &&
                    !model.cacheStoragePerHour &&
                    interpolate(t.cache.needed, { be: Math.ceil(be), hits })}
                </p>
              </>
            ) : delta === 0 ? (
              <>
                <p className="display text-3xl text-mute md:text-4xl">
                  {withCache.belowCacheMinimum ? t.cache.didNothing : t.cache.exactlyBe}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-mute">
                  {withCache.belowCacheMinimum
                    ? interpolate(t.cache.belowMin, {
                        prefix: num(prefix),
                        model: model.label,
                        min: num(model.cacheMinTokens),
                      })
                    : t.cache.noHitsYet}
                </p>
              </>
            ) : (
              <>
                <p className="display text-3xl text-amber md:text-4xl">
                  {interpolate(t.cache.costsExtra, { money: money(-delta) })}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-mute">
                  {model.cacheStoragePerHour && writeRate === null
                    ? interpolate(t.cache.lossRent, { prefix: num(prefix) })
                    : t.cache.classicMistake}
                </p>
              </>
            )}
          </Card>

          <Card className="p-5">
            <div className="eyebrow mb-3">{t.cache.threeRules}</div>
            <ol className="flex flex-col gap-3 text-sm leading-relaxed text-mute">
              <li>
                <span className="mono text-lime">01</span>{" "}
                <span className="text-chalk">{t.cache.rule1Title}</span>
                {t.cache.rule1Body}
              </li>
              <li>
                <span className="mono text-lime">02</span>{" "}
                <span className="text-chalk">{t.cache.rule2Title}</span>
                {t.cache.rule2Body}
              </li>
              <li>
                <span className="mono text-lime">03</span>{" "}
                <span className="text-chalk">{t.cache.rule3Title}</span>
                {interpolate(t.cache.rule3Body, {
                  model: model.label,
                  min: num(model.cacheMinTokens),
                })}
              </li>
            </ol>
          </Card>
        </div>
      </div>
    </Section>
  );
}
