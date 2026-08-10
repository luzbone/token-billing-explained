export type Locale = "en" | "he";

export type Dir = "ltr" | "rtl";

export const LOCALES: { id: Locale; label: string; dir: Dir; htmlLang: string }[] = [
  { id: "en", label: "English", dir: "ltr", htmlLang: "en" },
  { id: "he", label: "עברית", dir: "rtl", htmlLang: "he" },
];

export function localeMeta(locale: Locale) {
  return LOCALES.find((l) => l.id === locale)!;
}
