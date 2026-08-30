/**
 * API pricing, USD per 1,000,000 tokens, standard (non-batch) tier.
 *
 * Observed 2026-08-10 from official sources:
 *   Anthropic — https://platform.claude.com/docs/en/about-claude/pricing
 *   OpenAI    — https://developers.openai.com/api/docs/pricing
 *   Google    — https://ai.google.dev/gemini-api/docs/pricing
 *   xAI       — https://docs.x.ai/developers/models
 *
 * Prices change often. Treat this as a teaching snapshot, not a quote.
 */

export type Provider = "Anthropic" | "OpenAI" | "Google" | "xAI";

export type Model = {
  id: string;
  provider: Provider;
  label: string;
  /** cheap | mid | frontier — used for grouping and default selection */
  tier: "cheap" | "mid" | "frontier";
  contextWindow: number | null;
  input: number;
  output: number;
  /** Surcharge to WRITE tokens into the cache. null = provider charges nothing extra. */
  cacheWrite5m: number | null;
  cacheWrite1h: number | null;
  /** Price for tokens served FROM cache. null = no cached-input discount published. */
  cacheRead: number | null;
  /** Minimum prefix length before a provider will cache it at all. */
  cacheMinTokens: number;
  /** Gemini only: $/1M tokens/hour of cache storage. */
  cacheStoragePerHour?: number | null;
  /** Multiplier applied by the batch/async API to input and output. null = no batch API. */
  batchDiscount: number | null;
  /** Optional long-context tier that kicks in above a token threshold. */
  longContext?: { threshold: number; input: number; output: number; cacheRead: number | null };
  note?: string;
  unverified?: boolean;
};

export const PROVIDER_COLOR: Record<Provider, string> = {
  Anthropic: "var(--orange)",
  OpenAI: "var(--cyan)",
  Google: "var(--lime)",
  xAI: "var(--pink)",
};

export const MODELS: Model[] = [
  // ── Anthropic ───────────────────────────────────────────────
  {
    id: "claude-fable-5",
    provider: "Anthropic",
    label: "Claude Fable 5",
    tier: "frontier",
    contextWindow: 1_000_000,
    input: 10,
    output: 50,
    cacheWrite5m: 12.5,
    cacheWrite1h: 20,
    cacheRead: 1,
    cacheMinTokens: 1024,
    batchDiscount: 0.5,
    note: "Cache writes cost 1.25× input (5-min TTL) or 2× (1-hour TTL). Cache reads cost 0.1× input.",
  },
  {
    id: "claude-opus-5",
    provider: "Anthropic",
    label: "Claude Opus 5",
    tier: "frontier",
    contextWindow: 1_000_000,
    input: 5,
    output: 25,
    cacheWrite5m: 6.25,
    cacheWrite1h: 10,
    cacheRead: 0.5,
    cacheMinTokens: 1024,
    batchDiscount: 0.5,
    note: "Flat rate across the full 1M context — no long-context surcharge.",
  },
  {
    id: "claude-sonnet-5",
    provider: "Anthropic",
    label: "Claude Sonnet 5",
    tier: "mid",
    contextWindow: 1_000_000,
    input: 2,
    output: 10,
    cacheWrite5m: 2.5,
    cacheWrite1h: 4,
    cacheRead: 0.2,
    cacheMinTokens: 1024,
    batchDiscount: 0.5,
    note: "Introductory pricing through 2026-08-31. From 2026-09-01: $3 in / $15 out, cache read $0.30.",
  },
  {
    id: "claude-haiku-4-5",
    provider: "Anthropic",
    label: "Claude Haiku 4.5",
    tier: "cheap",
    contextWindow: 200_000,
    input: 1,
    output: 5,
    cacheWrite5m: 1.25,
    cacheWrite1h: 2,
    cacheRead: 0.1,
    cacheMinTokens: 2048,
    batchDiscount: 0.5,
  },

  // ── OpenAI ──────────────────────────────────────────────────
  {
    id: "gpt-5.6-sol",
    provider: "OpenAI",
    label: "GPT-5.6 Sol",
    tier: "frontier",
    contextWindow: null,
    input: 5,
    output: 30,
    cacheWrite5m: 6.25,
    cacheWrite1h: null,
    cacheRead: 0.5,
    cacheMinTokens: 1024,
    batchDiscount: 0.5,
    longContext: { threshold: 272_000, input: 10, output: 45, cacheRead: 1 },
    note: "OpenAI's first model with an explicit cache-write surcharge (1.25× input).",
  },
  {
    id: "gpt-5.6-terra",
    provider: "OpenAI",
    label: "GPT-5.6 Terra",
    tier: "mid",
    contextWindow: null,
    input: 2,
    output: 12,
    cacheWrite5m: 2.5,
    cacheWrite1h: null,
    cacheRead: 0.2,
    cacheMinTokens: 1024,
    batchDiscount: 0.5,
    longContext: { threshold: 272_000, input: 4, output: 18, cacheRead: 0.4 },
  },
  {
    id: "gpt-5.6-luna",
    provider: "OpenAI",
    label: "GPT-5.6 Luna",
    tier: "cheap",
    contextWindow: null,
    input: 0.2,
    output: 1.2,
    cacheWrite5m: 0.25,
    cacheWrite1h: null,
    cacheRead: 0.02,
    cacheMinTokens: 1024,
    batchDiscount: 0.5,
    longContext: { threshold: 272_000, input: 0.4, output: 1.8, cacheRead: 0.04 },
  },
  {
    id: "gpt-5.5",
    provider: "OpenAI",
    label: "GPT-5.5",
    tier: "frontier",
    contextWindow: 272_000,
    input: 5,
    output: 30,
    cacheWrite5m: null,
    cacheWrite1h: null,
    cacheRead: 0.5,
    cacheMinTokens: 1024,
    batchDiscount: 0.5,
    longContext: { threshold: 272_000, input: 10, output: 45, cacheRead: 1 },
    note: "No cache-write surcharge — caching here is automatic and free to populate.",
  },
  {
    id: "gpt-5.4",
    provider: "OpenAI",
    label: "GPT-5.4",
    tier: "mid",
    contextWindow: 272_000,
    input: 2.5,
    output: 15,
    cacheWrite5m: null,
    cacheWrite1h: null,
    cacheRead: 0.25,
    cacheMinTokens: 1024,
    batchDiscount: 0.5,
    longContext: { threshold: 272_000, input: 5, output: 22.5, cacheRead: 0.5 },
  },
  {
    id: "gpt-5.4-mini",
    provider: "OpenAI",
    label: "GPT-5.4 mini",
    tier: "cheap",
    contextWindow: null,
    input: 0.75,
    output: 4.5,
    cacheWrite5m: null,
    cacheWrite1h: null,
    cacheRead: 0.075,
    cacheMinTokens: 1024,
    batchDiscount: 0.5,
  },

  // ── Google ──────────────────────────────────────────────────
  {
    id: "gemini-3-pro",
    provider: "Google",
    label: "Gemini 3 Pro",
    tier: "frontier",
    contextWindow: null,
    input: 2,
    output: 12,
    cacheWrite5m: null,
    cacheWrite1h: null,
    cacheRead: 0.2,
    cacheStoragePerHour: 4.5,
    cacheMinTokens: 2048,
    batchDiscount: 0.5,
    longContext: { threshold: 200_000, input: 4, output: 18, cacheRead: 0.4 },
    unverified: true,
    note: "Google bills cache storage by the hour ($4.50 / 1M tokens / hr) instead of a write surcharge.",
  },
  {
    id: "gemini-3.1-flash",
    provider: "Google",
    label: "Gemini 3.1 Flash",
    tier: "mid",
    contextWindow: null,
    input: 1.5,
    output: 7.5,
    cacheWrite5m: null,
    cacheWrite1h: null,
    cacheRead: 0.15,
    cacheStoragePerHour: 1,
    cacheMinTokens: 2048,
    batchDiscount: 0.5,
    unverified: true,
  },
  {
    id: "gemini-2.5-pro",
    provider: "Google",
    label: "Gemini 2.5 Pro",
    tier: "frontier",
    contextWindow: 1_000_000,
    input: 1.25,
    output: 10,
    cacheWrite5m: null,
    cacheWrite1h: null,
    cacheRead: 0.125,
    cacheStoragePerHour: 4.5,
    cacheMinTokens: 4096,
    batchDiscount: 0.5,
    longContext: { threshold: 200_000, input: 2.5, output: 15, cacheRead: 0.25 },
  },
  {
    id: "gemini-2.5-flash",
    provider: "Google",
    label: "Gemini 2.5 Flash",
    tier: "mid",
    contextWindow: 1_000_000,
    input: 0.3,
    output: 2.5,
    cacheWrite5m: null,
    cacheWrite1h: null,
    cacheRead: 0.03,
    cacheStoragePerHour: 1,
    cacheMinTokens: 1024,
    batchDiscount: 0.5,
  },
  {
    id: "gemini-2.5-flash-lite",
    provider: "Google",
    label: "Gemini 2.5 Flash Lite",
    tier: "cheap",
    contextWindow: null,
    input: 0.1,
    output: 0.4,
    cacheWrite5m: null,
    cacheWrite1h: null,
    cacheRead: 0.01,
    cacheStoragePerHour: 1,
    cacheMinTokens: 1024,
    batchDiscount: 0.5,
  },

  // ── xAI ─────────────────────────────────────────────────────
  {
    id: "grok-4.5",
    provider: "xAI",
    label: "Grok 4.5",
    tier: "frontier",
    contextWindow: 500_000,
    input: 2,
    output: 6,
    cacheWrite5m: null,
    cacheWrite1h: null,
    cacheRead: 0.3,
    cacheMinTokens: 1024,
    batchDiscount: null,
    longContext: { threshold: 200_000, input: 4, output: 12, cacheRead: 0.6 },
    note: "Cross a 200k-token prompt and the ENTIRE request re-prices at 2×, not just the overflow.",
  },
  {
    id: "grok-4.3",
    provider: "xAI",
    label: "Grok 4.3",
    tier: "mid",
    contextWindow: 1_000_000,
    input: 1.25,
    output: 2.5,
    cacheWrite5m: null,
    cacheWrite1h: null,
    cacheRead: 0.2,
    cacheMinTokens: 1024,
    batchDiscount: null,
    longContext: { threshold: 200_000, input: 2.5, output: 5, cacheRead: 0.4 },
    note: "Notably flat input:output ratio of 1:2 — unusually cheap output for a frontier-class model.",
  },
  {
    id: "grok-build-0.1",
    provider: "xAI",
    label: "Grok Build 0.1",
    tier: "cheap",
    contextWindow: 256_000,
    input: 1,
    output: 2,
    cacheWrite5m: null,
    cacheWrite1h: null,
    cacheRead: 0.2,
    cacheMinTokens: 1024,
    batchDiscount: null,
    longContext: { threshold: 200_000, input: 2, output: 4, cacheRead: 0.4 },
  },
];

export const byId = (id: string) => MODELS.find((m) => m.id === id)!;

export const PROVIDERS: Provider[] = ["Anthropic", "OpenAI", "Google", "xAI"];

/** Default comparison set — one representative model per provider. */
export const DEFAULT_COMPARE = [
  "claude-sonnet-5",
  "gpt-5.6-terra",
  "gemini-3-pro",
  "grok-4.5",
];

export type Usage = {
  /** Fresh input tokens billed at the full input rate. */
  input: number;
  /** Tokens written into the cache (billed at the write rate, if any). */
  cacheWrite: number;
  /** Tokens served from cache (billed at the read rate). */
  cacheRead: number;
  /** Generated tokens, including hidden reasoning tokens. */
  output: number;
};

export type CostBreakdown = {
  input: number;
  cacheWrite: number;
  cacheRead: number;
  output: number;
  total: number;
  /** True when the long-context tier re-priced this request. */
  longContext: boolean;
  /** True when the prefix was too short for the provider to cache. */
  belowCacheMinimum: boolean;
};

export type PriceOpts = {
  ttl?: "5m" | "1h";
  batch?: boolean;
  /**
   * Prompt tokens in a SINGLE request. Long-context tiers are per-request, so
   * aggregate monthly totals must not be passed here.
   */
  promptTokens?: number;
  /**
   * Length of the cached prefix in a SINGLE request. Cache minimums are
   * per-request, so aggregate cached-token totals must not be passed here.
   */
  prefixTokens?: number;
};

export function priceUsage(m: Model, u: Usage, opts?: PriceOpts): CostBreakdown {
  const ttl = opts?.ttl ?? "5m";
  // Batch discounts apply to input and output; cached tokens and storage stay
  // at standard rates on at least some providers, so we don't discount them.
  const mult = opts?.batch && m.batchDiscount ? m.batchDiscount : 1;

  // Long-context tiers re-price the ENTIRE request once the prompt crosses the
  // threshold — not just the overflow.
  const long =
    !!m.longContext && (opts?.promptTokens ?? 0) > m.longContext.threshold;
  const inRate = long ? m.longContext!.input : m.input;
  const outRate = long ? m.longContext!.output : m.output;
  const baseReadRate = long ? m.longContext!.cacheRead : m.cacheRead;

  // A prefix shorter than the provider's minimum is simply never cached, so it
  // is billed as ordinary input. The minimum applies to the per-REQUEST prefix
  // length, so callers must pass it explicitly — aggregate cached-token totals
  // across many calls say nothing about whether any single prefix qualified.
  const hasCache = u.cacheWrite + u.cacheRead > 0;
  const prefix = opts?.prefixTokens;
  const cacheable = !hasCache || prefix === undefined || prefix >= m.cacheMinTokens;

  const writeRate =
    (ttl === "1h" ? m.cacheWrite1h : m.cacheWrite5m) ?? m.cacheWrite5m ?? inRate;
  const readRate = baseReadRate ?? inRate;

  const effWrite = cacheable ? writeRate : inRate;
  const effRead = cacheable ? readRate : inRate;

  const input = (u.input / 1e6) * inRate * mult;
  const cacheWrite = (u.cacheWrite / 1e6) * effWrite;
  const cacheRead = (u.cacheRead / 1e6) * effRead;
  const output = (u.output / 1e6) * outRate * mult;

  return {
    input,
    cacheWrite,
    cacheRead,
    output,
    total: input + cacheWrite + cacheRead + output,
    longContext: long,
    belowCacheMinimum: !cacheable,
  };
}

/** How many times must you re-read a cached prefix before caching pays for itself? */
export function cacheBreakeven(m: Model, ttl: "5m" | "1h" = "5m"): number | null {
  const write = (ttl === "1h" ? m.cacheWrite1h : m.cacheWrite5m) ?? null;
  const read = m.cacheRead;
  if (read === null) return null;
  // No write surcharge → caching is free money from the very first hit.
  if (write === null) return 1;
  const surcharge = write - m.input;
  const savingPerRead = m.input - read;
  if (savingPerRead <= 0) return null;
  return surcharge / savingPerRead;
}
