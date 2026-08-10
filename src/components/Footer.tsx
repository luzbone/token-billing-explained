import { useT } from "../i18n";

export function Footer() {
  const t = useT();

  return (
    <footer className="border-t border-line px-6 py-16 md:px-10">
      <div className="mx-auto grid max-w-[1240px] gap-10 md:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="mb-5 flex items-center gap-3">
            <span className="block h-5 w-5 bg-pink" aria-hidden />
            <span className="display text-lg text-chalk">{t.footer.brand}</span>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-mute">{t.footer.blurb}</p>
        </div>

        <div>
          <div className="eyebrow mb-5">{t.footer.sources}</div>
          <ul className="flex flex-col gap-3 text-sm">
            {[
              { n: "Anthropic", u: "https://www.anthropic.com/pricing" },
              { n: "OpenAI", u: "https://platform.openai.com/docs/pricing" },
              { n: "Google Gemini", u: "https://ai.google.dev/gemini-api/docs/pricing" },
              { n: "xAI Grok", u: "https://docs.x.ai/developers/models" },
            ].map((l) => (
              <li key={l.n}>
                <a
                  href={l.u}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mono text-mute transition-colors hover:text-cyan"
                >
                  {l.n} ↗
                </a>
              </li>
            ))}
          </ul>
          <p className="mono mt-8 text-[11px] leading-relaxed text-mute/70">
            {t.footer.tokenizerNote}
          </p>
        </div>
      </div>
    </footer>
  );
}
