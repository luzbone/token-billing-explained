# Token Billing, Explained

**▶ Live: https://token.luzbone.com/**

An interactive, hands-on explainer for **how LLM APIs actually charge you** — input tokens, output tokens, cache writes and cache reads — with a live pricing comparison across **Anthropic, OpenAI, Google Gemini and xAI Grok**.

No signup, no API key, nothing sent anywhere. Everything runs in the browser.

## Why

Most people ship an AI feature, get an invoice, and only then discover that output costs 5× input, that a 30-turn chat costs far more than 30 messages, and that "enabling caching" made things *more* expensive. This app makes all of that visible and playable before it costs you money.

## What's in it

| # | Section | What it teaches |
|---|---------|-----------------|
| 01 | **Tokenizer Lab** | Real BPE tokenization (`o200k_base`). Watch prose, code, JSON, Hebrew, emoji and whitespace split into billable chips. Non-Latin text costs multiples more for identical meaning. |
| 02 | **Anatomy of one call** | An animated meter for a single request, separating system prompt / tool schemas / history / user message on the input side, and hidden reasoning vs visible answer on the output side. |
| 03 | **The conversation trap** | The API is stateless, so every turn re-uploads the whole history. Total input grows with the *square* of the turn count. Toggle caching and watch the bill collapse. |
| 04 | **Cache Lab** | Cache write vs read vs TTL vs break-even. Models Anthropic's 1.25×/2× write multipliers, OpenAI's 1.25× writes on current flagships, xAI's free writes, and Google's hourly storage rental. Drag hits to zero and watch caching actively lose money. |
| 05 | **Pricing table** | 17 models, sortable by input, output, out÷in ratio or cache read. Shows long-context cliffs and batch discounts. |
| 06 | **Workload calculator** | Four realistic app shapes (chatbot, RAG, coding agent, overnight batch). Stacked cost bars per model, and advice that adapts to whether you're input-bound or output-bound. |
| 07 | **Gotchas** | Eight ways the invoice gets bigger than expected. |
| 08 | **Quiz** | Eight questions with explanations. |

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
```

## Deploying

Production is the Cloudflare Worker `token-billing`, served at https://token.luzbone.com/. The GitHub repo is connected to that Worker, so a push to `main` deploys.

`vite.config.ts` sets `base: './'`, so the static build also works from a project subpath.

## Pricing data

To refresh the catalog, follow [`docs/catalog-refresh.md`](docs/catalog-refresh.md). Prompt: *Follow docs/catalog-refresh.md. Refresh the catalog to today. Don't expand scope.*

All prices live in [`src/lib/pricing.ts`](src/lib/pricing.ts) as USD per 1,000,000 tokens, standard (non-batch) tier. The observed date is the `PRICING_AS_OF` constant in that file — currently **2026-09-16** — and the UI reads it from there. Official sources:

- [Anthropic](https://platform.claude.com/docs/en/about-claude/pricing)
- [OpenAI](https://developers.openai.com/api/docs/pricing)
- [Google Gemini](https://ai.google.dev/gemini-api/docs/pricing)
- [xAI Grok](https://docs.x.ai/developers/pricing)

**This is a teaching aid, not a quote.** Providers change prices frequently, and regional / enterprise / committed-use rates differ. Verify against the official page before you budget.

## Notes on accuracy

- The tokenizer is OpenAI's `o200k_base`. Anthropic, Google and xAI use different vocabularies, so their counts differ — typically 10–20% on English prose, further apart on other scripts. The billing *mechanics* are identical everywhere.
- The 2 MB vocabulary is code-split and lazy-loaded, so it never blocks first paint.
- Cost models in the calculator are deliberate simplifications, tuned to teach the shape of the cost curve rather than to produce an invoice. The two biggest assumptions — how often the cached prefix is rebuilt, and how many hours it sits in storage — are exposed as sliders rather than hidden, so you can match them to your own traffic.
- The app does model provider-specific rules that materially change the answer: long-context tiers re-price the **entire** request (not just the overflow), prefixes below a provider's cache minimum are billed as ordinary input, cache write premiums vs. hourly storage rental are handled separately, and batch discounts are applied to input/output only.

## Stack

Vite · React 19 · TypeScript · Tailwind v4 · `gpt-tokenizer`
