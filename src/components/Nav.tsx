import { useEffect, useState } from "react";
import { LOCALES, useI18n, useT } from "../i18n";

const LINK_IDS = [
  "tokenizer",
  "anatomy",
  "conversation",
  "cache",
  "pricing",
  "calculator",
  "gotchas",
  "quiz",
] as const;

export function Nav() {
  const t = useT();
  const { locale, setLocale } = useI18n();
  const [active, setActive] = useState("tokenizer");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const links = LINK_IDS.map((id) => ({
    id,
    label: t.nav.links[id],
  }));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    LINK_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      obs.disconnect();
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-line bg-ink/92 backdrop-blur-md" : ""
      }`}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-6 py-4 md:px-10">
        <a href="#top" className="flex shrink-0 items-center gap-3">
          <span className="block h-5 w-5 bg-pink" aria-hidden />
          <span className="display text-lg text-chalk">{t.nav.brand}</span>
        </a>

        <div className="hidden items-center gap-1 xl:flex">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={`mono px-3 py-2 text-[11px] tracking-wide transition-colors ${
                active === l.id ? "text-cyan" : "text-mute hover:text-chalk"
              }`}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-px border border-line"
            role="group"
            aria-label={t.nav.langAria}
          >
            {LOCALES.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLocale(l.id)}
                className={`mono px-3 py-2 text-[11px] tracking-wide transition-colors ${
                  locale === l.id
                    ? "bg-cyan text-ink"
                    : "text-mute hover:text-chalk"
                }`}
                aria-pressed={locale === l.id}
              >
                {l.id === "en" ? "EN" : "עב"}
              </button>
            ))}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="mono pill border border-line px-4 py-2 text-[11px] text-mute xl:hidden"
            aria-expanded={open}
          >
            {open ? t.nav.close : t.nav.menu}
          </button>
        </div>
      </div>

      {open && (
        <div className="grid grid-cols-2 gap-px border-t border-line bg-line xl:hidden">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={() => setOpen(false)}
              className={`mono bg-ink px-5 py-4 text-[11px] ${
                active === l.id ? "text-cyan" : "text-mute"
              }`}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
