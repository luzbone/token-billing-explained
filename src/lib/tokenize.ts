export type Tok = { id: number; text: string };

type Enc = {
  encode: (t: string) => number[];
  decode: (ids: number[]) => string;
};

let enc: Enc | null = null;
let loading: Promise<Enc> | null = null;

/**
 * The o200k_base vocabulary is ~2MB, so it is code-split and fetched on demand
 * instead of blocking first paint.
 */
export function loadEncoder(): Promise<Enc> {
  if (enc) return Promise.resolve(enc);
  if (!loading) {
    loading = import("gpt-tokenizer/encoding/o200k_base").then((m) => {
      enc = { encode: m.encode, decode: m.decode };
      return enc;
    });
  }
  return loading;
}

export function isReady() {
  return enc !== null;
}

/**
 * Real BPE tokenization using OpenAI's o200k_base vocabulary (GPT-4o / GPT-5 family).
 * Anthropic, Google and xAI use different vocabularies, so their counts differ by
 * roughly 10-20% on English prose — but the billing mechanics are identical.
 */
export function tokenize(text: string): Tok[] {
  if (!text || !enc) return [];
  return enc.encode(text).map((id) => ({ id, text: enc!.decode([id]) }));
}

export function countTokens(text: string): number {
  if (!text || !enc) return 0;
  return enc.encode(text).length;
}

/** Deterministic hue per token id so the same token always gets the same colour. */
export function tokenHue(id: number): number {
  return (id * 137.508) % 360;
}
