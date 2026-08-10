import { useState } from "react";
import { Card, Section } from "./ui";
import { useT } from "../i18n";

const CORRECT = [1, 2, 2, 2, 1, 1, 1, 1] as const;

export function Quiz() {
  const t = useT();
  const questions = t.quiz.questions;
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    Array.from({ length: CORRECT.length }, () => null),
  );
  const answered = answers.filter((a) => a !== null).length;
  const score = answers.filter((a, i) => a === CORRECT[i]).length;
  const done = answered === questions.length;

  const verdict =
    score === questions.length
      ? { t: t.quiz.verdicts.perfect, c: "text-lime" }
      : score >= 6
        ? { t: t.quiz.verdicts.solid, c: "text-cyan" }
        : score >= 4
          ? { t: t.quiz.verdicts.mid, c: "text-amber" }
          : { t: t.quiz.verdicts.low, c: "text-pink" };

  return (
    <Section
      id="quiz"
      index="08"
      eyebrow={t.quiz.eyebrow}
      tint="lime"
      title={
        <>
          {t.quiz.title1}
          <br />
          {t.quiz.title2a}
          <span className="text-lime">{t.quiz.title2Guess}</span>
          {t.quiz.title2b}
        </>
      }
      lede={t.quiz.lede}
    >
      <div className="mb-8 flex flex-wrap items-center gap-6">
        <div className="mono text-5xl font-bold text-chalk">
          {score}
          <span className="text-mute">/{questions.length}</span>
        </div>
        <div className="h-2 min-w-[200px] flex-1 bg-ink-3">
          <div
            className="h-full bg-lime transition-[width] duration-500"
            style={{ width: `${(answered / questions.length) * 100}%` }}
          />
        </div>
        {done && <span className={`display text-2xl ${verdict.c}`}>{verdict.t}</span>}
        {answered > 0 && (
          <button
            onClick={() => setAnswers(questions.map(() => null))}
            className="pill border border-line px-5 py-2 text-xs text-mute transition-colors hover:border-lime hover:text-chalk"
          >
            {t.quiz.reset}
          </button>
        )}
      </div>

      <div className="grid gap-px bg-line lg:grid-cols-2">
        {questions.map((q, qi) => {
          const picked = answers[qi] ?? null;
          return (
            <div key={qi} className="bg-ink-2 p-6">
              <div className="mb-4 flex items-start gap-3">
                <span className="mono mt-[2px] text-xs text-lime">
                  {String(qi + 1).padStart(2, "0")}
                </span>
                <h3 className="text-sm leading-snug font-bold text-chalk">{q.q}</h3>
              </div>
              <div className="flex flex-col gap-2">
                {q.a.map((opt, oi) => {
                  const isPicked = picked === oi;
                  const isRight = oi === CORRECT[qi];
                  const reveal = picked !== null;
                  let cls = "border-line text-mute hover:border-cyan hover:text-chalk";
                  if (reveal && isRight) cls = "border-lime bg-lime/10 text-lime";
                  else if (reveal && isPicked) cls = "border-pink bg-pink/10 text-pink";
                  else if (reveal) cls = "border-line/50 text-mute/50";
                  return (
                    <button
                      key={oi}
                      disabled={reveal}
                      onClick={() =>
                        setAnswers((a) => a.map((v, i) => (i === qi ? oi : v)))
                      }
                      className={`border px-4 py-3 text-start text-xs leading-snug transition-colors ${cls}`}
                    >
                      <span className="mono me-2">{String.fromCharCode(65 + oi)}</span>
                      {opt}
                      {reveal && isRight && <span className="float-end">✓</span>}
                      {reveal && isPicked && !isRight && <span className="float-end">✕</span>}
                    </button>
                  );
                })}
              </div>
              <div
                className="grid transition-all duration-300"
                style={{ gridTemplateRows: picked !== null ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className="mt-4 border-t border-line pt-4 text-xs leading-relaxed text-mute">
                    {q.why}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {done && (
        <Card className="rise mt-8 p-8 text-center" accent="lime">
          <div className="eyebrow mb-4">{t.quiz.finalScore}</div>
          <div className="display mb-4 text-6xl text-chalk md:text-7xl">
            {score}/{questions.length}
          </div>
          <p className={`display text-2xl ${verdict.c}`}>{verdict.t}</p>
        </Card>
      )}
    </Section>
  );
}
