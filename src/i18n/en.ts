export const en = {
  meta: {
    title: "Token Billing, Explained · Interactive",
    description:
      "An interactive playground that teaches how LLM API token billing actually works — input, output, cache writes, cache reads — with live pricing comparison across Anthropic, OpenAI, Gemini and Grok.",
  },
  nav: {
    brand: "Token Bill",
    menu: "menu",
    close: "close",
    links: {
      tokenizer: "01 Tokens",
      anatomy: "02 One call",
      conversation: "03 Chats",
      cache: "04 Cache",
      pricing: "05 Prices",
      calculator: "06 Calculator",
      gotchas: "07 Gotchas",
      quiz: "08 Quiz",
    },
    langAria: "Language",
    themeAria: "Color theme",
    themeDark: "NITE",
    themeLight: "DAY",
  },
  hero: {
    eyebrow: "Interactive · pricing observed {{date}}",
    title1: "Nobody reads",
    title2a: "the ",
    title2Token: "token",
    title2b: " bill",
    title3a: "until it ",
    title3Hurt: "hurts",
    title3b: ".",
    lede:
      "Input, output, cache writes, cache reads. Four numbers that decide whether your AI product has a margin. This is a hands-on walkthrough of how every major API actually charges you — with live pricing from Anthropic, OpenAI, Google and xAI. Nothing to install, nothing to sign up for.",
    statModels: "Models compared",
    statCheapest: "Cheapest input",
    statSpread: "Price spread",
    ctaStart: "Start with a token →",
    ctaCalc: "Skip to the calculator",
  },
  tokenizer: {
    eyebrow: "What you are actually paying for",
    title1: "You are not billed for words.",
    title2a: "You are billed for ",
    title2Tokens: "tokens",
    title2b: ".",
    lede:
      "Before a model sees your text, a tokenizer chops it into sub-word pieces. Every piece is a token, and every token has a price. Type below — each coloured chip is one billable unit.",
    presets: {
      plain: { label: "Plain English", note: "~4 characters per token. The friendliest case." },
      code: {
        label: "Code",
        note: "Punctuation and indentation each cost tokens. Code is denser than prose.",
      },
      json: {
        label: "JSON",
        note: "Braces, quotes and keys are billed too. Verbose schemas get expensive fast.",
      },
      hebrew: {
        label: "Hebrew / non-English",
        note: "Non-Latin scripts are split far more aggressively — often 2-4x more tokens for the same meaning.",
      },
      emoji: {
        label: "Emoji & symbols",
        note: "A single emoji can be several tokens. So can an unusual URL or a UUID.",
      },
      whitespace: {
        label: "Repeated whitespace",
        note: "Runs of spaces get their own tokens. Pretty-printing a payload costs real money.",
      },
    },
    ariaTextarea: "Text to tokenize",
    tokens: "Tokens",
    characters: "Characters",
    charsPerToken: "Chars / token",
    tokensPerWord: "Tokens / word",
    tokenStream: "Token stream",
    vocabNote: "o200k_base · GPT-4o / GPT-5 vocabulary",
    startTyping: "Start typing to see the split…",
    loadingVocab: "Loading the 200k-entry vocabulary…",
    headsUp: "Heads up:",
    headsUpBody:
      "every provider ships its own tokenizer. Claude, Gemini and Grok will count this same string a little differently — usually within 10–20% for English, much further apart for other languages. The billing mechanics are identical everywhere.",
  },
  anatomy: {
    eyebrow: "Anatomy of one API call",
    title1: "One question.",
    title2a: "",
    title2Four: "Four",
    title2b: " billable things.",
    lede: "An API request is not 'a question and an answer'. It's a full context upload, some invisible thinking, and a stream back — priced at two different rates. Run it and watch the meter.",
    ariaModel: "Model",
    per1M: "per 1M",
    run: "▶ Run the call",
    runAgain: "↺ Run again",
    running: "Running…",
    phases: {
      idle: "Press run to send one API call.",
      uploading: "Uploading the whole context. Every token here is billed at the INPUT rate.",
      thinking:
        "The model reasons before answering. These tokens are billed at the OUTPUT rate whether or not the API shows them to you.",
      streaming: "Tokens stream back. Each one is billed at the OUTPUT rate, whether or not you read them.",
      done: "Call complete. Notice how a tiny question produced a not-tiny bill.",
    },
    step1: "Step 1 — what you send (INPUT)",
    step2: "Step 2 — what comes back (OUTPUT)",
    parts: {
      system: {
        label: "System prompt",
        why: "Your instructions. Re-sent and re-billed on every single call.",
      },
      tools: {
        label: "Tool definitions",
        why: "JSON schemas for every tool you expose — often the biggest hidden line item.",
      },
      history: {
        label: "Conversation history",
        why: "The API is stateless. Every previous turn is re-uploaded to give the model memory.",
      },
      user: {
        label: "New user message",
        why: "The only part most people think they're paying for.",
      },
    },
    hiddenReasoning: "Hidden reasoning tokens",
    billedAsOutput: "BILLED AS OUTPUT",
    reasoningBody:
      "Reasoning tokens are billed at the full output rate. Some APIs return a summary or thinking block, but you are charged for the full internal reasoning either way. This is the most common surprise on a bill — lower the reasoning effort or thinking budget where the model supports it.",
    visibleAnswer: "Visible answer",
    liveMeter: "Live meter",
    forOneCall: "for ONE call ·",
    inputTokens: "Input tokens",
    outputTokens: "Output tokens",
    ruleMatters: "The rule that matters",
    outputCosts: "Output costs",
    morePerToken: "more per token than input on",
    ruleBody:
      "Across nearly every model on this page, generation costs 2–8× more per token than reading. So on output-heavy workloads the biggest lever is usually \"ask for a shorter answer\" rather than \"send less context\" — but check which side of your own bill actually dominates before optimising either.",
    rareException: " (This model is a rare exception — its output is unusually cheap.)",
  },
  conversation: {
    eyebrow: "Why chats get expensive",
    title1: "Server-side memory",
    title2a: "isn't ",
    title2Free: "free",
    title2b: " memory.",
    lede: "Some APIs will store a conversation for you, but that doesn't make the earlier turns free — the model still has to process them, and you're still billed for them. Every turn re-pays for the whole history. Drag the turn counter and watch it compound.",
    ariaModel: "Model",
    turnNumber: "Turn number",
    turnOf: "turn {{n}} of {{max}}",
    turnHint: "How deep into the conversation you are.",
    systemPrompt: "System prompt + tools",
    systemHint: "Fixed, identical on every call — the perfect thing to cache.",
    eachUser: "Each user message",
    eachReply: "Each model reply",
    replyHint: "Replies join the history — so a chatty model makes every FUTURE turn pricier too.",
    compounding: "The compounding effect",
    compoundingBody:
      "Turn 1 sends {{t1}} tokens. Turn {{turn}} sends {{tn}} — a {{mult}}× increase for the same size question. As long as every turn keeps the full history and turns stay roughly the same size, total input grows with the square of the turn count. Truncating, summarising, or using a sliding window flattens that curve — at the cost of memory.",
    promptPerTurn: "Prompt tokens sent, per turn",
    greenResent: "green = re-sent history",
    turn1: "turn 1",
    turnN: "turn {{n}}",
    peak: "peak {{n}} tok · {{pct}}% of it is repeat content",
    noCaching: "No caching",
    noCachingBody: "{{tokens}} input tokens billed at the full ${{rate}}/1M rate across {{turns}} turn(s).",
    withCaching: "With prompt caching",
    withCachingBody: "{{read}} tokens read from cache at {{rate}}",
    standardRate: "the standard rate",
    writtenAt: " · {{write}} written at ${{rate}}/1M",
    savedBy: "Saved by caching",
    savedBody:
      "Caching does not make the model cheaper. It makes the repetition cheaper — and in a long conversation, repetition is most of your bill. Output tokens are never cached and never discounted.",
  },
  cache: {
    eyebrow: "The part everyone gets wrong",
    title1a: "Caching is a ",
    title1Bet: "bet",
    title1b: ",",
    title2: "not a discount.",
    lede: "Prompt caching stores a prefix of your request so future calls can skip re-processing it. Some providers charge extra to write it. That makes caching a wager: you pay more now to pay much less later — but only if 'later' actually happens.",
    cards: {
      write: {
        t: "Cache WRITE",
        storagePrice: "${{rate}}/1M/hr storage",
        noSurcharge: "no surcharge",
        per1M: "${{rate}} / 1M",
        bodyStorage:
          "Google doesn't charge a write premium — it rents you the storage by the hour instead. Long-lived caches of huge documents can quietly cost more than the reads save.",
        bodyFree: "This provider populates the cache for free. There is no downside to enabling it, ever.",
        bodyPaid:
          "Storing a prefix costs {{mult}}× the normal input price. You pay this premium ONCE per cache creation — and again every time the cache expires and has to be rebuilt.",
      },
      read: {
        t: "Cache READ",
        notPublished: "not published",
        per1M: "${{rate}} / 1M",
        bodyNone:
          "No cached-input discount is published for this model, so repeated context is billed at full price.",
        bodyPaid:
          "A cache hit costs {{mult}}× the normal input price — a {{pct}}% discount. This is where all the savings live.",
      },
      ttl: {
        t: "Cache TTL",
        anthropic: "5 min or 1 hour",
        google: "implicit or explicit",
        other: "automatic, minutes",
        bodyAnthropic:
          "Every hit refreshes the clock. Idle past the TTL and the cache dies — the next call pays the write premium all over again.",
        bodyGoogle:
          "Implicit caching happens automatically with no storage fee. Explicit caching lets you pin a prefix for a lifetime you choose — and you rent that storage for as long as it lives.",
        bodyOther:
          "Caching is automatic and prefix-based. You can't control it directly — you influence it by keeping the START of your prompt identical between calls.",
      },
      breakeven: {
        t: "Break-even",
        na: "n/a",
        dependsTime: "depends on time",
        instant: "instant",
        reads: "{{n}} reads",
        bodyNone: "Without a published cache-read price there is nothing to break even on.",
        bodyStorage:
          "There's no write premium, but you rent the cache at ${{rate}}/1M tokens/hour. Break-even is a race between read volume and wall-clock time: a {{prefix}}k prefix costs {{hourly}} per hour just to sit there. Hold it idle overnight and the storage can outweigh everything you saved.",
        bodyInstant: "There's no write premium here, so the very first cache hit is already pure profit.",
        bodyPaid:
          "You must re-read this prefix about {{n}} times before the write premium pays for itself. Cache a prompt you'll only use once and you have made it MORE expensive.",
      },
    },
    simulator: "Break-even simulator",
    ariaModel: "Model",
    ttl5m: "5-minute TTL (1.25× write)",
    ttl1h: "1-hour TTL (2× write)",
    prefixSize: "Cached prefix size",
    prefixHint: "System prompt + tool schemas + any document you keep re-sending.",
    hitsBefore: "Cache hits before expiry",
    hitsFormat: "{{n}} read(s)",
    hitsHint: "Drag to 0 to see caching actively lose you money.",
    without: "Without caching",
    withoutBody: "{{tokens}} input tokens at ${{rate}}/1M",
    with: "With caching",
    withBody: "1 write + {{hits}} reads",
    plusStorage: " + {{money}} storage",
    verdict: "Verdict",
    saves: "Saves {{money}} ({{pct}}%)",
    savesBody: "With {{hits}} hit(s) on a {{prefix}}-token prefix, caching is clearly worth it here.",
    needed: " You needed {{be}} to break even and you got {{hits}}.",
    didNothing: "Caching did nothing",
    exactlyBe: "Exactly break-even",
    belowMin:
      "A {{prefix}}-token prefix is below {{model}}'s {{min}}-token minimum, so nothing was cached and every token was billed as ordinary input. Caching isn't hurting you — it simply isn't happening.",
    noHitsYet:
      "No write premium and no hits yet — caching has cost you nothing and saved you nothing. Every read from here is pure upside.",
    costsExtra: "Costs you {{money}} extra",
    lossRent:
      "There's no write premium here — the loss is rent. You're paying to keep {{prefix}} tokens in storage without reading them often enough to justify it. Either raise the hit rate or use implicit caching, which carries no storage fee.",
    classicMistake:
      "You paid the write premium and didn't re-read the prefix enough times to earn it back. This is the classic mistake: enabling caching on one-shot requests, or on a prefix that changes between calls (a timestamp, a user id, a reordered tool list) so every call silently misses the cache and pays the premium again.",
    threeRules: "Three rules that make caching actually work",
    rule1Title: "Put the stable stuff first.",
    rule1Body:
      " Prefix caching matches from the start of the request. Change something near the top and everything after it stops matching. Order: system → tools → documents → history → new message.",
    rule2Title: "Never put volatile data at the top.",
    rule2Body:
      " A current timestamp, a random request id, or a reordered JSON tool schema will drop your hit rate to zero while your bill quietly goes up.",
    rule3Title: "Mind the minimum.",
    rule3Body:
      " {{model}} won't cache a prefix shorter than {{min}} tokens — below that, caching silently does nothing and everything is billed as normal input.",
  },
  pricing: {
    eyebrow: "Anthropic · OpenAI · Google · xAI",
    title1: "Every price,",
    title2a: "side by ",
    title2Side: "side",
    title2b: ".",
    lede: "USD per 1,000,000 tokens, standard tier, observed {{date}} from each provider's official pricing page. Sort by any column — and notice that the \"cheapest\" model changes completely depending on whether your workload is input-heavy or output-heavy.",
    scrollHint: "← scroll the table sideways →",
    cols: {
      model: "Model",
      input: "Input",
      output: "Output",
      ratio: "Out ÷ In",
      cacheWrite: "Cache write",
      cacheRead: "Cache read",
      context: "Context",
      batch: "Batch",
    },
    free: "free",
    min: "min",
    notes: {
      ratio: {
        t: "Out ÷ In is the number to watch",
        b: "A model with cheap input and 6× output is a bad deal for a chatbot and a great deal for document search. Grok 4.3 at 2× is the outlier — the flattest ratio on this table.",
      },
      longContext: {
        t: "Long-context tiers are a cliff, not a slope",
        b: "Cross the threshold and the higher rate applies to the WHOLE request, not just the overflow. One extra token can double the price of the entire call.",
      },
      batch: {
        t: "Batch is the least-used discount",
        b: "If your work isn't interactive — evals, backfills, summarising a corpus overnight — most providers cut input and output by 50%. xAI is the exception: Grok 4.3 is 20% off, and Grok 4.5 / 4.6 have no batch discount at all.",
      },
    },
  },
  calculator: {
    eyebrow: "Put a number on it",
    title1a: "What would ",
    title1Your: "your",
    title1b: "",
    title2: "workload actually cost?",
    lede: "Pick a shape of application, tune it, and watch every model re-rank. The same workload can be 100× cheaper on one model than another — and the winner flips depending on whether you're input-heavy or output-heavy.",
    presets: {
      support: {
        name: "Support chatbot",
        d: "Long system prompt, short questions, medium answers, heavy repetition.",
      },
      rag: {
        name: "RAG over documents",
        d: "Huge retrieved context, short answer. Input dominates the bill.",
      },
      coding: {
        name: "Coding agent",
        d: "Big tool schemas, long files, verbose generated code. Both sides are heavy.",
      },
      overnight: {
        name: "Overnight classification",
        d: "Millions of tiny independent calls. No repetition, latency irrelevant.",
      },
    },
    monthly: "Monthly workload",
    callsMonth: "API calls / month",
    repeatedPrefix: "Repeated prefix per call",
    repeatedHint:
      "System prompt, tool schemas, retrieved docs — the identical part. Push past 200k to watch long-context tiers kick in.",
    freshInput: "Fresh input per call",
    outputPerCall: "Output per call",
    outputHint: "Include reasoning tokens — they're billed as output.",
    cachingEnabled: "Prompt caching enabled",
    cachingHint: "Prefixes below a provider's minimum (1k–4k tokens) can't be cached at all.",
    rebuilds: "Cache rebuilds / month",
    rebuildsHint:
      "Every idle gap past the TTL, deploy, or prompt edit forces a fresh write. 720 ≈ once an hour.",
    keptAlive: "Cache kept alive (Gemini)",
    keptAliveFormat: "{{n}} hr / month",
    keptAliveHint:
      "Google rents explicit-cache storage by the hour. Implicit caching is free — set this to 0.",
    batchApi: "Use the batch API",
    batchHint: "~50% off where offered. Not for interactive apps.",
    volume: "Volume",
    tokensMonth: "tokens / month",
    cheapest: "Cheapest",
    mostExpensive: "Most expensive",
    spread: "Spread",
    sameJob: "same job, different bill",
    monthlyByModel: "Monthly cost by model",
    legendInput: "■ input",
    legendWrite: "■ cache write",
    legendRead: "■ cache read",
    legendOutput: "■ output",
    readBars: "Read the bars, not just the totals",
    onModel: "On {{model}} — the cheapest option here — output is {{out}}% of the bill and everything on the input side is {{inp}}%.",
    outputBound:
      "That makes this an output-bound workload. Trimming context barely moves it. Cap max_tokens, ask for shorter answers, and lower the reasoning effort — then prefer models with a low out÷in ratio.",
    inputBound:
      "That makes this an input-bound workload. Caching and prompt trimming are where the money is; a cheaper output rate will barely register.",
    balanced: "It's balanced, so neither lever dominates — measure both before you optimise either.",
    belowMin:
      "Note: your prefix is below this model's {{min}}-token cache minimum, so caching is being ignored and billed as normal input.",
    longContext:
      "Your per-call prompt crosses the long-context threshold, so the whole request is priced at the higher tier.",
  },
  gotchas: {
    eyebrow: "The surprises on your first invoice",
    title1: "Eight ways the bill",
    title2a: "gets ",
    title2Bigger: "bigger",
    title2b: " than expected.",
    lede: "None of these are hidden fees. They're all documented — they just aren't obvious until you've been surprised once.",
    items: [
      {
        t: "Reasoning tokens are billed as output",
        s: "Thinking models can burn thousands of tokens you never asked for.",
        b: "Extended thinking / reasoning happens before the visible answer and is charged at the full output rate. A 50-word reply can carry a 4,000-token thinking bill. Some APIs return a summary or thinking block, but you pay for the full internal reasoning regardless. If you don't need deliberation, lower the reasoning effort or thinking budget where the model supports it — it's usually the largest line item on an agent's invoice.",
      },
      {
        t: "You pay for output you abandon",
        s: "Closing the stream doesn't refund what was already generated.",
        b: "Cancel a streaming request and you are generally billed for the tokens produced up to that point, even though you threw them away. Worse, a runaway generation that hits max_tokens bills the full ceiling. Set max_tokens defensively — it's a cost control, not just a safety rail — and check the usage object rather than assuming.",
      },
      {
        t: "Tool definitions are billed every single call",
        s: "Twenty tools with rich JSON schemas can be 10k tokens of pure overhead.",
        b: "Every tool schema is serialised into the prompt on every request, whether the model uses it or not. Agents with big toolboxes often spend more on describing their tools than on the actual task. Trim schemas, shorten descriptions, and only attach the tools relevant to the current step.",
      },
      {
        t: "Images, audio and PDFs become billable units",
        s: "A single high-res screenshot can cost more than a page of text.",
        b: "Multimodal input is converted into model-specific billable units — usually tokens, sometimes at a separate audio rate. A detailed image can run well over a thousand tokens; a PDF page is charged as extracted text plus image processing. The conversion rules differ per provider and model, so check the vendor's own calculator rather than guessing. Downscale images to the smallest size that keeps the detail you need.",
      },
      {
        t: "A cache miss is worse than no cache",
        s: "One shifting value at the top of your prompt and you pay the premium for nothing.",
        b: "Prefix caching matches from the start of the request, on the tokenized prompt. Injecting the current time, a request UUID, or a randomly-ordered set of tool schemas near the top guarantees a miss on every call — so on providers that charge for writes you pay the surcharge repeatedly and never collect a discounted read. Prefixes below the provider's minimum (typically 1,024–4,096 tokens) aren't cached at all.",
      },
      {
        t: "Long-context tiers re-price the whole request",
        s: "Token 200,001 doesn't cost 2×. It makes all 200,001 cost 2×.",
        b: "Several providers switch to a higher rate once a prompt crosses a threshold (200k on Gemini and Grok, 272k on some OpenAI models). The higher rate applies to the entire request, not just the overflow. Staying just under a threshold is worth real money.",
      },
      {
        t: "Failed and retried requests can still cost money",
        s: "An error after generation started may still be a billable event.",
        b: "Whether you're charged depends on how far inference got before the failure, and accounting differs between providers. Timeouts, content-filter stops and client-side retries can each produce a billed call. Aggressive retry loops on a slow endpoint are a classic way to quietly triple a bill. Use exponential backoff, cap your retries, and reconcile against the provider's usage logs rather than your own request count.",
      },
      {
        t: "Tokens are not words, and not evenly priced by language",
        s: "The same sentence in Hebrew, Thai or Hindi can cost several times the English version.",
        b: "Tokenizer vocabularies are heavily weighted toward English text, so many other scripts fragment into far more tokens for identical meaning. How much worse varies a lot by language, tokenizer and content — so if you serve a non-English market, measure it with your target model's tokenizer instead of assuming your English benchmark holds.",
      },
    ],
    summary: "The five-line summary",
    sum1a: "You are billed per ",
    sum1Token: "token",
    sum1b: ", in two directions, at two different prices.",
    sum2a: "",
    sum2Out: "Output",
    sum2b:
      " costs 2–8× input on the models here. On output-heavy workloads, shorter answers are the cheapest fix there is.",
    sum3a: "Chats grow ",
    sum3Quad: "quadratically",
    sum3b: " when every turn re-sends the full history — which is the default.",
    sum4a: "",
    sum4Cache: "Cache economics vary by provider",
    sum4b:
      ": a write premium, a discounted read, an hourly storage rental, or some combination. Know which one you're paying before you turn it on.",
    sum5a: "Put the stable content ",
    sum5First: "first",
    sum5b: ", and measure with real usage data instead of estimating.",
  },
  quiz: {
    eyebrow: "Check yourself",
    title1: "Eight questions.",
    title2a: "No ",
    title2Guess: "guessing",
    title2b: ".",
    lede: "If you can answer these, you understand token billing better than most people shipping to production.",
    reset: "Reset",
    finalScore: "Final score",
    verdicts: {
      perfect: "You could write the invoice yourself.",
      solid: "Solid. You won't be surprised by a bill.",
      mid: "Halfway there — re-read the caching section.",
      low: "Worth another pass from the top.",
    },
    questions: [
      {
        q: "You send a 10-token question and get a 10-token answer. Which costs more?",
        a: ["The input", "The output", "They're identical", "Depends on the model only"],
        why: "Output is priced 2–6× higher than input on essentially every provider. Same token count, very different cost.",
      },
      {
        q: "In a 30-turn chat that keeps the full history and has roughly equal-sized turns, total input tokens grow…",
        a: ["Linearly", "Logarithmically", "Quadratically", "They stay flat — the server remembers"],
        why: "Each turn re-sends the whole history, so turn N costs ~N× turn 1. Summed over N turns that's O(N²). Truncating or summarising the history flattens this — at the cost of memory.",
      },
      {
        q: "On Anthropic, writing a prefix to the 5-minute cache costs…",
        a: ["Nothing extra", "0.1× the input rate", "1.25× the input rate", "2× the output rate"],
        why: "Cache writes cost 1.25× input for a 5-minute TTL and 2× for a 1-hour TTL. Reads then cost 0.1× input on most Claude models — 0.025× on Fable 5.1.",
      },
      {
        q: "On Anthropic you write a 50k-token prefix to the 5-minute cache, then the cache expires with zero hits. Versus not caching, you…",
        a: [
          "Saved about 90%",
          "Broke even",
          "Paid 25% more on those tokens",
          "Paid nothing — writes are free",
        ],
        why: "Anthropic's 5-minute cache write costs 1.25× input. With zero hits you collected no discounted reads, so you simply paid a 25% surcharge for nothing. On providers with no write premium (xAI) the same scenario would merely break even. Current OpenAI flagships now charge 1.25× on cache writes too.",
      },
      {
        q: "A reasoning model 'thinks' for 3,000 tokens before a 200-token answer. You are billed for…",
        a: ["200 output tokens", "3,200 output tokens", "3,000 input + 200 output", "200 output, thinking is free"],
        why: "Hidden reasoning tokens are billed at the full output rate even though you never see them. This is the most common bill shock.",
      },
      {
        q: "Using Anthropic prefix caching, your prompt starts with the current timestamp, then a 30k-token system block. What happens?",
        a: [
          "Cache works fine — only the top line changed",
          "Every call misses the cache and pays the write premium again",
          "The cache stores both versions and picks the best",
          "Timestamps are excluded from cache keys",
        ],
        why: "Prefix caching matches from the start of the request. A changing first line means nothing after it matches, so you never get a hit and keep paying the 1.25× write surcharge. Move volatile values to the END of the prompt.",
      },
      {
        q: "Grok 4.5 charges 2× above a 200k-token prompt. You send 200,500 tokens. What's billed at 2×?",
        a: ["Just the 500 overflow tokens", "The entire 200,500 tokens", "Nothing, it's a soft limit", "Only the output"],
        why: "Long-context tiers re-price the whole request, not just the overflow. Trimming 500 tokens here would halve the call's cost.",
      },
      {
        q: "A chatbot on Claude Sonnet 5 sends 2k input and generates 3k output per call. Which change cuts the bill most?",
        a: [
          "Halve the input context (2k → 1k)",
          "Halve the output length (3k → 1.5k)",
          "Send requests more slowly",
          "Remove whitespace from the JSON",
        ],
        why: "At $2/1M in and $10/1M out, that call costs $0.004 input + $0.030 output. Halving input saves $0.002; halving output saves $0.015 — about 7× more. On input-heavy workloads like RAG the answer flips, which is exactly why you check your own breakdown first.",
      },
    ],
  },
  footer: {
    brand: "Token Bill",
    blurb:
      "An interactive explainer for how LLM APIs charge for input, output and cached tokens. Every number here is a teaching aid, not a quote — providers change prices frequently and regional, enterprise and committed-use rates differ. Always verify against the official pricing page before you budget.",
    sources: "Official pricing sources · observed {{date}}",
    tokenizerNote:
      "Tokenizer: o200k_base (OpenAI). Other providers use different vocabularies, so their counts will differ.",
  },
} as const;

/** Widen nested string literals so other locales can differ in wording. */
type DeepStringify<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly DeepStringify<U>[]
    : T extends object
      ? { readonly [K in keyof T]: DeepStringify<T[K]> }
      : T;

export type Dict = DeepStringify<typeof en>;
