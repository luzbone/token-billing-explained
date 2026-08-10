import { useEffect, useMemo, useState } from "react";
import { tokenize, tokenHue, loadEncoder } from "../lib/tokenize";
import { num } from "../lib/format";
import { Card, Section } from "./ui";
import { useT } from "../i18n";

const PRESET_TEXTS = [
  "The quick brown fox jumps over the lazy dog and then writes a short report about it.",
  `function add(a, b) {\n  return a + b;\n}\n\nconst total = add(2, 40);\nconsole.log(\`total = \${total}\`);`,
  `{"user_id":48211,"preferences":{"theme":"dark","notifications":true},"tags":["billing","tokens"]}`,
  "שלום עולם, איך עובד חיוב לפי טוקנים?",
  "🚀🔥 https://api.example.com/v1/chat/completions?id=8f14e45f-ceea-467a-9e1b-2ac4c9a1d0f2",
  "value:      42\nother:            7\n\n\n        indented deeply",
] as const;

const PRESET_KEYS = ["plain", "code", "json", "hebrew", "emoji", "whitespace"] as const;

export function TokenizerLab() {
  const t = useT();
  const [text, setText] = useState<string>(PRESET_TEXTS[0]);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);

  const presets = PRESET_KEYS.map((key, i) => ({
    label: t.tokenizer.presets[key].label,
    note: t.tokenizer.presets[key].note,
    text: PRESET_TEXTS[i],
  }));

  useEffect(() => {
    let alive = true;
    loadEncoder().then(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, []);

  const tokens = useMemo(() => (ready ? tokenize(text) : []), [text, ready]);

  const chars = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const ratio = tokens.length ? chars / tokens.length : 0;
  const perWord = words ? tokens.length / words : 0;

  return (
    <Section
      id="tokenizer"
      index="01"
      eyebrow={t.tokenizer.eyebrow}
      tint="cyan"
      title={
        <>
          {t.tokenizer.title1}
          <br />
          {t.tokenizer.title2a}
          <span className="text-cyan">{t.tokenizer.title2Tokens}</span>
          {t.tokenizer.title2b}
        </>
      }
      lede={t.tokenizer.lede}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {presets.map((p, i) => (
              <button
                key={PRESET_KEYS[i]}
                onClick={() => {
                  setText(p.text);
                  setActive(i);
                }}
                className={`pill border px-4 py-2 text-xs font-semibold transition-colors ${
                  active === i
                    ? "border-cyan bg-cyan text-ink"
                    : "border-line text-mute hover:border-cyan hover:text-chalk"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setActive(-1);
            }}
            spellCheck={false}
            rows={9}
            aria-label={t.tokenizer.ariaTextarea}
            className="w-full resize-y p-4 text-sm leading-relaxed"
            dir="auto"
          />

          {active >= 0 && (
            <p className="border border-line bg-ink-3 p-4 text-xs leading-relaxed text-mute">
              <span className="text-cyan">▸</span> {presets[active].note}
            </p>
          )}

          <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-4">
            {[
              { l: t.tokenizer.tokens, v: num(tokens.length), tone: "text-cyan" },
              { l: t.tokenizer.characters, v: num(chars), tone: "text-chalk" },
              { l: t.tokenizer.charsPerToken, v: ratio ? ratio.toFixed(2) : "—", tone: "text-chalk" },
              { l: t.tokenizer.tokensPerWord, v: perWord ? perWord.toFixed(2) : "—", tone: "text-pink" },
            ].map((s) => (
              <div key={s.l} className="bg-ink-2 p-4">
                <div className="eyebrow mb-2">{s.l}</div>
                <div className={`mono text-xl font-bold ${s.tone}`}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        <Card className="flex flex-col p-5">
          <div className="mb-4 flex items-baseline justify-between">
            <span className="eyebrow">{t.tokenizer.tokenStream}</span>
            <span className="mono text-xs text-mute">{t.tokenizer.vocabNote}</span>
          </div>

          <div className="min-h-[280px] flex-1 overflow-auto bg-ink-3 p-3">
            {tokens.length === 0 ? (
              <p className="mono p-6 text-center text-sm text-mute">
                {ready ? t.tokenizer.startTyping : t.tokenizer.loadingVocab}
              </p>
            ) : (
              <div className="flex flex-wrap gap-[3px]" dir="ltr">
                {tokens.map((tok, i) => {
                  const hue = tokenHue(tok.id);
                  const display = tok.text
                    .replace(/ /g, "·")
                    .replace(/\n/g, "⏎")
                    .replace(/\t/g, "⇥");
                  return (
                    <span
                      key={i}
                      title={`token #${i + 1} · id ${tok.id} · ${JSON.stringify(tok.text)}`}
                      className="mono px-[6px] py-[3px] text-[12.5px] leading-tight whitespace-pre"
                      style={{
                        background: `hsl(${hue} 72% 60% / 0.22)`,
                        color: `hsl(${hue} 85% 78%)`,
                        borderBottom: `2px solid hsl(${hue} 80% 62%)`,
                      }}
                    >
                      {display || "␀"}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          <p className="mt-4 text-xs leading-relaxed text-mute">
            <span className="text-pink">{t.tokenizer.headsUp}</span> {t.tokenizer.headsUpBody}
          </p>
        </Card>
      </div>
    </Section>
  );
}
