# Catalog refresh playbook

Commit this file. Do not gitignore it. The next refresh is: point an agent at this document and say the prompt below.

## Prompt

```
Follow docs/catalog-refresh.md. Refresh the catalog to today. Don't expand scope.
```

## Official sources (only these)

Standard (non-batch) USD per 1M tokens. Ignore marketing pages, OpenRouter, and third-party roundups.

- Anthropic — https://docs.anthropic.com/en/docs/about-claude/pricing and https://docs.anthropic.com/en/docs/about-claude/models
- OpenAI — https://developers.openai.com/api/docs/pricing and https://developers.openai.com/api/docs/models
- Google — https://ai.google.dev/gemini-api/docs/pricing and https://ai.google.dev/gemini-api/docs/models
- xAI — https://docs.x.ai/developers/pricing

## Catalog policy

Keep a compact teaching table: **one cheap, one mid, one frontier per provider**, plus the Google cheap floor if it is still the lowest input on the table.

Target size: about **16–18 text chat models**. Current shape (2026-09-16): 4 Anthropic, 4 OpenAI, 5 Google, 4 xAI.

- Prefer each provider's **current** recommended lineup, not every SKU still on the API.
- Replace a previous-gen row when the new model is the same role at a new id/price (Fable 5 → Fable 5.1, Gemini 3 Pro → 3.1 Pro).
- Keep a previous-gen row only when it is still the **price floor** (Gemini 2.5 Flash Lite) or still the default workhorse.
- Skip: limited-availability (Mythos), specialized (Cyber, Daybreak, Rosalind), image/audio/video, dated snapshots (`grok-4.20-*`), extra Gemini Flash gens that share the current Flash price.

## Files to touch (stop here)

Do not re-read the rest of the app.

1. [`src/lib/pricing.ts`](../src/lib/pricing.ts) — source of truth. Set `PRICING_AS_OF` to today (`YYYY-MM-DD`). Update `MODELS`, notes, `DEFAULT_COMPARE`. Use official API ids as `id`. Fill `longContext.cacheWrite` when the provider publishes a long-context cache-write rate.
2. [`src/i18n/en.ts`](../src/i18n/en.ts) and [`src/i18n/he.ts`](../src/i18n/he.ts) — only strings that name a model, a price, a date, or a batch/cache rule. Dates already use `{{date}}`; do not hardcode the date in i18n.
3. [`README.md`](../README.md) — model count, cache-write one-liner if OpenAI/xAI write rules changed, source links if they moved.
4. This playbook — only if the catalog **policy** itself changed (new provider, new skip rule). Do not paste this year's price table in here.

UI that already interpolates `PRICING_AS_OF`: Hero, pricing lede, Footer. No date edits needed there unless you rename the placeholder.

Lab defaults (`claude-sonnet-5` in Cache Lab / Anatomy / Conversation Trap) can stay if that id still exists.

## Copy traps

Grep `en.ts` / `he.ts` / model notes for leftover names and stale claims:

- Quiz and notes that say a provider has **free cache writes** (OpenAI flagships charge 1.25× as of 2026-09; xAI still does not).
- Claude cache-read **0.1× vs 0.025×** (Fable 5.1 is the cheap-read exception).
- Quiz math that embeds a specific `$X / $Y` (Sonnet 5 Q8). Recalculate if that model's price moved.
- Batch copy that says **everyone is 50% off** (xAI 4.3 was 20%; 4.5/4.6 had none).
- Scheduled price changes that already happened or were cancelled (the Sonnet 5 Sept 2026 increase did not occur).
- Gemini `ID?` / `unverified` — do not bring that back; ids are on the models page.

`batchDiscount` is the multiplier charged (0.5 = 50% off, 0.8 = 20% off, `null` = no batch).

## Verify

```bash
npm run build
```

Spot-check: hero date is today, table row count matches `MODELS.length`, dropped ids are gone, new flagships appear. Do not deploy unless asked. A push to `main` publishes https://token.luzbone.com/ via the Cloudflare Worker `token-billing`.

## Out of scope unless asked

- Other providers.
- Changing the tokenizer vocab.
- Discounting **cached** tokens on xAI batch (today `priceUsage` discounts input/output only).
- Haiku retirement dates, Claude 4.7+ tokenizer token-count warning.
- Committing `temp/`.
