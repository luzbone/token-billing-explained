/** Default locale for number formatting when no i18n context is available. */
let defaultNumberLocale = "en-US";

export function setDefaultNumberLocale(locale: string) {
  defaultNumberLocale = locale;
}

export const usd = (n: number, maxFrac = 2) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Math.min(2, maxFrac),
    maximumFractionDigits: maxFrac,
  }).format(n);

/** Money formatter that keeps tiny amounts readable instead of collapsing to $0.00.
 *  Always LTR ($-prefixed ASCII) so RTL pages don't reverse "$0.10" → "0.10$". */
export const money = (n: number) => {
  const a = Math.abs(n);
  let s: string;
  if (a === 0) s = "$0";
  else if (a < 0.0001) s = `$${n.toExponential(2)}`;
  else if (a < 0.01) s = usd(n, 6);
  else if (a < 1) s = usd(n, 4);
  else if (a < 1000) s = usd(n, 2);
  else s = usd(Math.round(n), 0);
  // Isolate LTR so parent dir=rtl cannot reorder the $ or decimal.
  return `\u2066${s}\u2069`;
};

export const num = (n: number, locale = defaultNumberLocale) =>
  new Intl.NumberFormat(locale).format(Math.round(n));

export const compact = (n: number, locale = defaultNumberLocale) =>
  new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 }).format(n);

export const pct = (n: number, frac = 0) => `${(n * 100).toFixed(frac)}%`;

export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** Prices are quoted per 1M tokens. Converts a token count + unit price to dollars. */
export const costOf = (tokens: number, pricePerMillion: number) =>
  (tokens / 1_000_000) * pricePerMillion;
