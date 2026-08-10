import { useMemo, useState } from "react";
import { MODELS, byId, priceUsage } from "../lib/pricing";
import { money, num } from "../lib/format";
import { Card, Section, Slider } from "./ui";
import { interpolate, useT } from "../i18n";

const TURNS = 20;

type TurnRow = {
  n: number;
  prompt: number;
  cacheable: number;
  output: number;
};

function buildTurns(systemTokens: number, userTokens: number, replyTokens: number): TurnRow[] {
  const rows: TurnRow[] = [];
  let history = 0;
  for (let n = 1; n <= TURNS; n++) {
    const prompt = systemTokens + history + userTokens;
    const cacheable = systemTokens + history;
    rows.push({ n, prompt, cacheable, output: replyTokens });
    history += userTokens + replyTokens;
  }
  return rows;
}

export function ConversationTrap() {
  const t = useT();
  const [modelId, setModelId] = useState("claude-sonnet-5");
  const [systemTokens, setSystemTokens] = useState(4000);
  const [userTokens, setUserTokens] = useState(150);
  const [replyTokens, setReplyTokens] = useState(400);
  const [turn, setTurn] = useState(6);

  const model = byId(modelId);
  const rows = useMemo(
    () => buildTurns(systemTokens, userTokens, replyTokens),
    [systemTokens, userTokens, replyTokens],
  );
  const shown = rows.slice(0, turn);

  const naive = shown.reduce(
    (acc, r) => {
      const c = priceUsage(
        model,
        { input: r.prompt, cacheWrite: 0, cacheRead: 0, output: r.output },
        { promptTokens: r.prompt },
      );
      return { cost: acc.cost + c.total, tokens: acc.tokens + r.prompt };
    },
    { cost: 0, tokens: 0 },
  );

  const cached = shown.reduce(
    (acc, r, i) => {
      const prevCacheable = i === 0 ? 0 : rows[i - 1].cacheable;
      const read = i === 0 ? 0 : prevCacheable;
      const write = r.cacheable - prevCacheable;
      const c = priceUsage(
        model,
        { input: userTokens, cacheWrite: write, cacheRead: read, output: r.output },
        { promptTokens: r.prompt, prefixTokens: r.cacheable },
      );
      return {
        cost: acc.cost + c.total,
        read: acc.read + read,
        write: acc.write + write,
      };
    },
    { cost: 0, read: 0, write: 0 },
  );

  const saving = naive.cost > 0 ? 1 - cached.cost / naive.cost : 0;
  const maxPrompt = rows[turn - 1].prompt;

  const compoundingText = interpolate(t.conversation.compoundingBody, {
    t1: num(rows[0].prompt),
    turn,
    tn: num(rows[turn - 1].prompt),
    mult: (rows[turn - 1].prompt / rows[0].prompt).toFixed(1),
  });

  return (
    <Section
      id="conversation"
      index="03"
      eyebrow={t.conversation.eyebrow}
      tint="amber"
      title={
        <>
          {t.conversation.title1}
          <br />
          {t.conversation.title2a}
          <span className="text-amber">{t.conversation.title2Free}</span>
          {t.conversation.title2b}
        </>
      }
      lede={t.conversation.lede}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1.25fr]">
        <div className="flex flex-col gap-5">
          <Card className="flex flex-col gap-6 p-5">
            <select
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              className="px-4 py-3 text-sm"
              aria-label={t.conversation.ariaModel}
            >
              {MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.provider} · {m.label}
                </option>
              ))}
            </select>
            <Slider
              label={t.conversation.turnNumber}
              value={turn}
              min={1}
              max={TURNS}
              onChange={setTurn}
              format={(v) => interpolate(t.conversation.turnOf, { n: v, max: TURNS })}
              hint={t.conversation.turnHint}
            />
            <Slider
              label={t.conversation.systemPrompt}
              value={systemTokens}
              min={200}
              max={30000}
              step={200}
              onChange={setSystemTokens}
              format={(v) => `${num(v)} tok`}
              hint={t.conversation.systemHint}
            />
            <Slider
              label={t.conversation.eachUser}
              value={userTokens}
              min={20}
              max={2000}
              step={10}
              onChange={setUserTokens}
              format={(v) => `${num(v)} tok`}
            />
            <Slider
              label={t.conversation.eachReply}
              value={replyTokens}
              min={50}
              max={4000}
              step={50}
              onChange={setReplyTokens}
              format={(v) => `${num(v)} tok`}
              hint={t.conversation.replyHint}
            />
          </Card>

          <Card className="p-5" accent="amber">
            <div className="eyebrow mb-3">{t.conversation.compounding}</div>
            <p className="text-sm leading-relaxed text-mute">{compoundingText}</p>
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card className="p-5">
            <div className="mb-4 flex items-baseline justify-between">
              <span className="eyebrow">{t.conversation.promptPerTurn}</span>
              <span className="mono text-xs text-mute">{t.conversation.greenResent}</span>
            </div>
            <div className="flex h-48 items-end gap-[3px]">
              {rows.map((r) => {
                const active = r.n <= turn;
                const h = (r.prompt / rows[TURNS - 1].prompt) * 100;
                const histShare = r.cacheable / r.prompt;
                return (
                  <div
                    key={r.n}
                    className="group relative flex-1 transition-opacity"
                    style={{ height: `${h}%`, opacity: active ? 1 : 0.18 }}
                    title={`Turn ${r.n}: ${num(r.prompt)} prompt tokens (${num(r.cacheable)} is repeat history)`}
                  >
                    <div className="flex h-full w-full flex-col justify-end">
                      <div className="w-full bg-amber" style={{ height: `${(1 - histShare) * 100}%` }} />
                      <div className="w-full bg-lime/70" style={{ height: `${histShare * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mono mt-2 flex justify-between text-[10px] text-mute">
              <span>{t.conversation.turn1}</span>
              <span>
                {interpolate(t.conversation.peak, {
                  n: num(maxPrompt),
                  pct: ((rows[turn - 1].cacheable / maxPrompt) * 100).toFixed(0),
                })}
              </span>
              <span>{interpolate(t.conversation.turnN, { n: TURNS })}</span>
            </div>
          </Card>

          <div className="grid gap-5 sm:grid-cols-2">
            <Card className="p-5" accent="pink">
              <div className="eyebrow mb-2">{t.conversation.noCaching}</div>
              <div className="mono text-3xl font-bold text-pink">{money(naive.cost)}</div>
              <p className="mt-3 text-xs leading-relaxed text-mute">
                {interpolate(t.conversation.noCachingBody, {
                  tokens: num(naive.tokens),
                  rate: model.input,
                  turns: turn,
                })}
              </p>
            </Card>
            <Card className="p-5" accent="cyan">
              <div className="eyebrow mb-2">{t.conversation.withCaching}</div>
              <div className="mono text-3xl font-bold text-cyan">{money(cached.cost)}</div>
              <p className="mt-3 text-xs leading-relaxed text-mute">
                {interpolate(t.conversation.withCachingBody, {
                  read: num(cached.read),
                  rate:
                    model.cacheRead === null
                      ? t.conversation.standardRate
                      : `$${model.cacheRead}/1M`,
                })}
                {model.cacheWrite5m !== null &&
                  interpolate(t.conversation.writtenAt, {
                    write: num(cached.write),
                    rate: model.cacheWrite5m,
                  })}
              </p>
            </Card>
          </div>

          <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <div className="eyebrow mb-2">{t.conversation.savedBy}</div>
              <div className="mono text-4xl font-bold text-lime">
                {saving > 0 ? `${(saving * 100).toFixed(0)}%` : "—"}
              </div>
            </div>
            <p className="max-w-sm text-xs leading-relaxed text-mute">{t.conversation.savedBody}</p>
          </Card>
        </div>
      </div>
    </Section>
  );
}
