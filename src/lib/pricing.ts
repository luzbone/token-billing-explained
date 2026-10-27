/**
 * API pricing, USD per 1,000,000 tokens, standard (non-batch) tier.
 *
 * Observed from official sources:
 *   Anthropic — https://platform.claude.com/docs/en/about-claude/pricing
 *   OpenAI    — https://developers.openai.com/api/docs/pricing
 *   Google    — https://ai.google.dev/gemini-api/docs/pricing
 *   xAI       — https://docs.x.ai/developers/pricing
 *
 * Prices change often. Treat this as a teaching snapshot, not a quote.
 */

export const PRICING_AS_OF = "2026-10-27";

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
  longContext?: {
    threshold: number;
    input: number;
    output: number;
    cacheRead: number | null;
    cacheWrite?: number | null;
  };
  note?: string;
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
    id: "claude-fable-5-1",
    provider: "Anthropic",
    label: "Claude Fable 5.1",
    tier: "frontier",
    contextWindow: 1_000_000,
    input: 10,
    output: 50,
    cacheWrite5m: 12.5,
    cacheWrite1h: 20,
    cacheRead: 0.25,
    cacheMinTokens: 512,
    batchDiscount: 0.5,
    note: "Cache writes cost 1.25× input (5-min TTL) or 2× (1-hour TTL). Cache reads are 0.025× input ($0.25). Opus 5.5 and Sonnet 5.5 use 0.05×; Haiku 5.5 uses 0.1×.",
  },
  {
    id: "claude-opus-5-5",
    provider: "Anthropic",
    label: "Claude Opus 5.5",
    tier: "frontier",
    contextWindow: 1_000_000,
    input: 4,
    output: 20,
    cacheWrite5m: 5,
    cacheWrite1h: 8,
    cacheRead: 0.2,
    cacheMinTokens: 512,
    batchDiscount: 0.5,
    note: "Cache reads are 0.05× input ($0.20). Flat $4 / $20 across the full 1M context.",
  },
  {
    id: "claude-sonnet-5-5",
    provider: "Anthropic",
    label: "Claude Sonnet 5.5",
    tier: "mid",
    contextWindow: 1_000_000,
    input: 2,
    output: 10,
    cacheWrite5m: 2.5,
    cacheWrite1h: 4,
    cacheRead: 0.1,
    cacheMinTokens: 512,
    batchDiscount: 0.5,
    note: "Same $2 / $10 sticker as Sonnet 5. Cache reads are 0.05× input ($0.10), half the Sonnet 5 rate.",
  },
  {
    id: "claude-haiku-5-5",
    provider: "Anthropic",
    label: "Claude Haiku 5.5",
    tier: "cheap",
    contextWindow: 1_000_000,
    input: 0.1,
    output: 0.5,
    cacheWrite5m: 0.125,
    cacheWrite1h: 0.2,
    cacheRead: 0.01,
    cacheMinTokens: 512,
    batchDiscount: 0.5,
    longContext: { threshold: 100_000, input: 0.5, output: 2.5, cacheRead: 0.05, cacheWrite: 0.625 },
    note: "Prompts over 100k tokens re-price the entire request at 5× ($0.50 in / $2.50 out). The long-context 5-minute write is $0.625; the 1-hour long-context write is $1. Cache minimum is 512 tokens.",
  },

  // ── OpenAI ──────────────────────────────────────────────────
  // cacheWrite5m holds the 30-minute write (1.25×). cacheWrite1h holds the
  // 12-hour write (2.5×) — OpenAI has no 1-hour tier. longContext.cacheWrite
  // is the 30-minute long-context write.
  {
    id: "gpt-6-astra",
    provider: "OpenAI",
    label: "GPT-6 Astra",
    tier: "frontier",
    contextWindow: 1_050_000,
    input: 10,
    output: 50,
    cacheWrite5m: 12.5,
    cacheWrite1h: 25,
    cacheRead: 1,
    cacheMinTokens: 1024,
    batchDiscount: 0.5,
    longContext: { threshold: 272_000, input: 20, output: 75, cacheRead: 2, cacheWrite: 25 },
    note: "30-minute writes are 1.25× ($12.50; $25 above 272k). 12-hour writes are 2.5× ($25; $50 above 272k) — that second table price is the 12-hour rate, not a 1-hour rate. Cache reads are 0.1×. Prompts above 272k re-price the whole request at 2× input and 1.5× output.",
  },
  {
    id: "gpt-6.1-sol",
    provider: "OpenAI",
    label: "GPT-6.1 Sol",
    tier: "frontier",
    contextWindow: 1_050_000,
    input: 2,
    output: 10,
    cacheWrite5m: 2.5,
    cacheWrite1h: 5,
    cacheRead: 0.1,
    cacheMinTokens: 1024,
    batchDiscount: 0.5,
    longContext: { threshold: 272_000, input: 4, output: 15, cacheRead: 0.2, cacheWrite: 5 },
    note: "Cache reads are 0.05× input, not 0.1×. 30-minute writes are 1.25×; 12-hour writes are 2.5× (the second write price). Above 272k the whole request re-prices at 2× input and 1.5× output. The 12-hour long-context write is $10.",
  },
  {
    id: "gpt-6.1-terra",
    provider: "OpenAI",
    label: "GPT-6.1 Terra",
    tier: "mid",
    contextWindow: 1_050_000,
    input: 1,
    output: 5,
    cacheWrite5m: 1.25,
    cacheWrite1h: 2.5,
    cacheRead: 0.05,
    cacheMinTokens: 1024,
    batchDiscount: 0.5,
    longContext: { threshold: 272_000, input: 2, output: 7.5, cacheRead: 0.1, cacheWrite: 2.5 },
    note: "Same cache rules as GPT-6.1 Sol: 0.05× reads, 1.25× 30-minute writes, 2.5× 12-hour writes. Above 272k the whole request re-prices at 2× input and 1.5× output. The 12-hour long-context write is $5.",
  },
  {
    id: "gpt-6-luna",
    provider: "OpenAI",
    label: "GPT-6 Luna",
    tier: "cheap",
    contextWindow: 1_050_000,
    input: 0.1,
    output: 0.5,
    cacheWrite5m: 0.125,
    cacheWrite1h: 0.25,
    cacheRead: 0.01,
    cacheMinTokens: 1024,
    batchDiscount: 0.5,
    longContext: { threshold: 272_000, input: 0.2, output: 0.75, cacheRead: 0.02, cacheWrite: 0.25 },
    note: "Cache reads are 0.1×. 30-minute writes are 1.25×; 12-hour writes are 2.5× (the second write price). Above 272k the whole request re-prices at 2× input and 1.5× output. The 12-hour long-context write is $0.50.",
  },

  // ── Google ──────────────────────────────────────────────────
  {
    id: "gemini-4-argon",
    provider: "Google",
    label: "Gemini 4 Argon",
    tier: "frontier",
    contextWindow: 1_048_576,
    input: 2,
    output: 10,
    cacheWrite5m: null,
    cacheWrite1h: null,
    cacheRead: 0.1,
    cacheMinTokens: 4096,
    batchDiscount: 0.5,
    note: "Introductory pricing through 2026-11-30, then $4 in / $20 out and cache read $0.20. Implicit caching only — no write surcharge and no hourly storage. Minimum 4,096 tokens.",
  },
  {
    id: "gemini-3.8-flash",
    provider: "Google",
    label: "Gemini 3.8 Flash",
    tier: "mid",
    contextWindow: 1_000_000,
    input: 0.75,
    output: 3.75,
    cacheWrite5m: null,
    cacheWrite1h: null,
    cacheRead: 0.075,
    cacheStoragePerHour: 0.5,
    cacheMinTokens: 4096,
    batchDiscount: 0.5,
    note: "Introductory pricing through 2026-12-31, then $1.50 in / $7.50 out, cache read $0.15, storage $1.00/hr. Implicit cache minimum is 4,096 tokens.",
  },
  {
    id: "gemini-3.1-flash-lite",
    provider: "Google",
    label: "Gemini 3.1 Flash-Lite",
    tier: "cheap",
    contextWindow: 1_000_000,
    input: 0.25,
    output: 1.5,
    cacheWrite5m: null,
    cacheWrite1h: null,
    cacheRead: 0.025,
    cacheStoragePerHour: 1,
    cacheMinTokens: 1024,
    batchDiscount: 0.5,
  },
  {
    id: "gemini-2.5-flash-lite",
    provider: "Google",
    label: "Gemini 2.5 Flash Lite",
    tier: "cheap",
    contextWindow: 1_000_000,
    input: 0.1,
    output: 0.4,
    cacheWrite5m: null,
    cacheWrite1h: null,
    cacheRead: 0.01,
    cacheStoragePerHour: 1,
    cacheMinTokens: 1024,
    batchDiscount: 0.5,
    note: "Still the Google input-price floor at $0.10 / 1M.",
  },

  // ── xAI ─────────────────────────────────────────────────────
  {
    id: "grok-4.7",
    provider: "xAI",
    label: "Grok 4.7",
    tier: "frontier",
    contextWindow: 500_000,
    input: 2,
    output: 6,
    cacheWrite5m: null,
    cacheWrite1h: null,
    cacheRead: 0.5,
    cacheMinTokens: 1024,
    batchDiscount: 0.8,
    longContext: { threshold: 200_000, input: 4, output: 12, cacheRead: 1 },
    note: "Same $2 / $6 and $0.50 cache read as Grok 4.6. Cross 200k and the entire request re-prices at 2×. Batch API is 20% off.",
  },
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
    batchDiscount: 0.8,
    longContext: { threshold: 200_000, input: 4, output: 12, cacheRead: 0.6 },
    note: "Cache reads stay $0.30, cheaper than Grok 4.7's $0.50. Cross 200k and the entire request re-prices at 2×. Batch API is 20% off.",
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
    batchDiscount: 0.8,
    longContext: { threshold: 200_000, input: 2.5, output: 5, cacheRead: 0.4 },
    note: "Notably flat input:output ratio of 1:2. Batch API is 20% off — not the 50% most other providers advertise.",
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
    note: "No batch discount. Cross 200k and the entire request re-prices at 2×.",
  },
];

export const byId = (id: string) => MODELS.find((m) => m.id === id)!;

export const PROVIDERS: Provider[] = ["Anthropic", "OpenAI", "Google", "xAI"];

/** Default comparison set — one representative model per provider. */
export const DEFAULT_COMPARE = [
  "claude-sonnet-5-5",
  "gpt-6.1-terra",
  "gemini-3.8-flash",
  "grok-4.7",
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

  const baseWrite =
    (ttl === "1h" ? m.cacheWrite1h : m.cacheWrite5m) ?? m.cacheWrite5m ?? inRate;
  const writeRate =
    long && m.longContext?.cacheWrite != null ? m.longContext.cacheWrite : baseWrite;
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
