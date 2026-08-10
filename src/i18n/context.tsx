import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { en, type Dict } from "./en";
import { he } from "./he";
import { localeMeta, type Locale } from "./types";
import { setDefaultNumberLocale } from "../lib/format";

const STORAGE_KEY = "token-bill-locale";

const dictionaries: Record<Locale, Dict> = { en, he };

function detectLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "he") return stored;
  } catch {
    /* ignore */
  }
  if (typeof navigator !== "undefined") {
    const langs = navigator.languages?.length
      ? navigator.languages
      : [navigator.language];
    for (const lang of langs) {
      const code = lang.toLowerCase();
      if (code.startsWith("he") || code.startsWith("iw")) return "he";
    }
  }
  return "en";
}

function applyDocumentLocale(locale: Locale) {
  if (typeof document === "undefined") return;
  const meta = localeMeta(locale);
  document.documentElement.lang = meta.htmlLang;
  document.documentElement.dir = meta.dir;
  document.title = dictionaries[locale].meta.title;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute("content", dictionaries[locale].meta.description);
  setDefaultNumberLocale(locale === "he" ? "he-IL" : "en-US");
}

/** Replace {{key}} placeholders in a translation string. */
export function interpolate(
  template: string,
  vars: Record<string, string | number | undefined | null> = {},
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const v = vars[key];
    return v === undefined || v === null ? "" : String(v);
  });
}

type I18nContextValue = {
  locale: Locale;
  dir: "ltr" | "rtl";
  t: Dict;
  setLocale: (locale: Locale) => void;
  /** Locale string for Intl formatters (e.g. en-US, he-IL). */
  numberLocale: string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const initial = typeof window === "undefined" ? "en" : detectLocale();
    applyDocumentLocale(initial);
    return initial;
  });

  const setLocale = useCallback((next: Locale) => {
    applyDocumentLocale(next);
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const meta = localeMeta(locale);

  // Keep document attrs in sync if locale changes by any path
  useEffect(() => {
    applyDocumentLocale(locale);
  }, [locale]);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      dir: meta.dir,
      t: dictionaries[locale],
      setLocale,
      numberLocale: locale === "he" ? "he-IL" : "en-US",
    }),
    [locale, meta.dir, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export function useT() {
  return useI18n().t;
}
