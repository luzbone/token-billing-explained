import { useState } from "react";
import { Card, Section } from "./ui";
import { useT } from "../i18n";

const COLORS = [
  "#ff1464",
  "#ffb020",
  "#00e5ff",
  "#c6ff2e",
  "#ff8a3d",
  "#7df9ff",
  "#8b91a7",
  "#ffb020",
];

export function Gotchas() {
  const t = useT();
  const [open, setOpen] = useState<number | null>(0);
  const items = t.gotchas.items;

  return (
    <Section
      id="gotchas"
      index="07"
      eyebrow={t.gotchas.eyebrow}
      tint="amber"
      title={
        <>
          {t.gotchas.title1}
          <br />
          {t.gotchas.title2a}
          <span className="text-amber">{t.gotchas.title2Bigger}</span>
          {t.gotchas.title2b}
        </>
      }
      lede={t.gotchas.lede}
    >
      <div className="grid gap-px bg-line md:grid-cols-2">
        {items.map((g, i) => {
          const isOpen = open === i;
          const color = COLORS[i % COLORS.length];
          return (
            <button
              key={g.t}
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="bg-ink-2 p-6 text-start transition-colors hover:bg-ink-3"
            >
              <div className="flex items-start gap-4">
                <span className="mono mt-1 text-xs" style={{ color }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-chalk">{g.t}</h3>
                  <p className="mt-1 text-xs text-mute">{g.s}</p>
                  <div
                    className="grid transition-all duration-300"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="mt-4 border-t border-line pt-4 text-sm leading-relaxed text-mute">
                        {g.b}
                      </p>
                    </div>
                  </div>
                </div>
                <span
                  className="mono shrink-0 text-lg transition-transform duration-300"
                  style={{ color, transform: isOpen ? "rotate(45deg)" : "none" }}
                  aria-hidden
                >
                  +
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <Card className="mt-8 p-6" accent="lime">
        <div className="eyebrow mb-4">{t.gotchas.summary}</div>
        <ul className="flex flex-col gap-3 text-sm leading-relaxed text-mute">
          <li>
            <span className="mono text-lime">→</span> {t.gotchas.sum1a}
            <span className="text-chalk">{t.gotchas.sum1Token}</span>
            {t.gotchas.sum1b}
          </li>
          <li>
            <span className="mono text-lime">→</span> {t.gotchas.sum2a}
            <span className="text-chalk">{t.gotchas.sum2Out}</span>
            {t.gotchas.sum2b}
          </li>
          <li>
            <span className="mono text-lime">→</span> {t.gotchas.sum3a}
            <span className="text-chalk">{t.gotchas.sum3Quad}</span>
            {t.gotchas.sum3b}
          </li>
          <li>
            <span className="mono text-lime">→</span> {t.gotchas.sum4a}
            <span className="text-chalk">{t.gotchas.sum4Cache}</span>
            {t.gotchas.sum4b}
          </li>
          <li>
            <span className="mono text-lime">→</span> {t.gotchas.sum5a}
            <span className="text-chalk">{t.gotchas.sum5First}</span>
            {t.gotchas.sum5b}
          </li>
        </ul>
      </Card>
    </Section>
  );
}
