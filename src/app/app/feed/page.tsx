"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  RotateCcw,
  Flag,
  BookOpen,
  Loader2,
} from "lucide-react";
import { TtsPlayer } from "@/components/TtsPlayer";
import { FocusTimer } from "@/components/FocusTimer";
import { authClient } from "@/lib/auth-client";
import { saveProgress, readProgress } from "@/lib/local-progress";
import { QuestionContent } from "@/components/QuestionContent";
import type { PublicQuestion, AnswerResult } from "@/lib/types";
function Practice({
  subject,
  simulado,
  count,
  year,
  onRestart,
}: {
  subject: string | null;
  simulado: string | null;
  count: string | null;
  year: string | null;
  onRestart: () => void;
}) {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [available, setAvailable] = useState(0),
    [unseen, setUnseen] = useState(0);
  const userId = session?.user.id;
  const [questions, setQuestions] = useState<PublicQuestion[]>([]),
    [attemptId, setAttemptId] = useState(""),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [index, setIndex] = useState(0),
    [selected, setSelected] = useState<number | null>(null),
    [result, setResult] = useState<AnswerResult | null>(null),
    [sending, setSending] = useState(false),
    [finished, setFinished] = useState(false),
    [results, setResults] = useState<Record<string, AnswerResult>>({}),
    [reportOpen, setReportOpen] = useState(false),
    [reason, setReason] = useState(""),
    [reportStatus, setReportStatus] = useState("");
  const started = useRef(0),
    busy = useRef(false);
  useEffect(() => {
    if (sessionPending) return;
    const controller = new AbortController();
    const search = new URLSearchParams();
    if (subject) search.set("materia", subject);
    if (simulado) search.set("simulado", simulado);
    if (count) search.set("quantidade", count);
    if (year) search.set("ano", year);
    fetch(`/api/questions?${search}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        excluded: readProgress(userId)
          .map((r) => r.questionId)
          .filter(Boolean),
      }),
      signal: controller.signal,
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw Error(data.error);
        setQuestions(data.questoes);
        setAttemptId(data.attemptId);
        setAvailable(data.available);
        setUnseen(data.unseen);
        started.current = performance.now();
      })
      .catch((e) => {
        if (e.name !== "AbortError")
          setError(e.message || "Não foi possível carregar as questões.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [subject, simulado, count, year, userId, sessionPending]);
  const q = questions[index];
  async function handleAnswer(option: number, answeredAt: number) {
    if (busy.current || result) return;
    busy.current = true;
    setSending(true);
    setSelected(option);
    setError("");
    try {
      const res = await fetch("/api/users/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attemptId,
          questionId: q.id,
          selectedOption: option,
          tempo: Math.min(
            86400,
            Math.max(0, Math.round((answeredAt - started.current) / 1000)),
          ),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw Error(data.error);
      setResult(data);
      setResults((previous) => ({ ...previous, [q.id]: data }));
      saveProgress(
        {
          key: `${attemptId}:${q.id}`,
          questionId: q.id,
          materia: q.materia,
          acertou: data.acertou,
          createdAt: new Date().toISOString(),
        },
        session?.user.id,
      );
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Não foi possível enviar. Tente novamente.",
      );
    } finally {
      busy.current = false;
      setSending(false);
    }
  }
  const next = () => {
    if (!result || sending) return;
    window.scrollTo({ top: 0, behavior: "auto" });
    if (index === questions.length - 1) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setResult(null);
    setReportOpen(false);
    setReportStatus("");
    setReason("");
    started.current = performance.now();
  };
  const report = async () => {
    setReportStatus("");
    try {
      const res = await fetch(`/api/questions/${q.id}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (!res.ok) throw Error(data.error);
      setReportStatus("Obrigado! Sua observação foi registrada para revisão.");
      setReason("");
    } catch (e) {
      setReportStatus(e instanceof Error ? e.message : "Falha ao registrar.");
    }
  };
  if (loading)
    return (
      <main className="page empty">
        <Loader2 className="spin" />
        <h1>Preparando sua prática</h1>
        <p>Um novo passo está chegando.</p>
      </main>
    );
  if (!q)
    return (
      <main className="page empty">
        <BookOpen size={40} />
        <h1>Vamos por outro caminho?</h1>
        <p role="alert">
          {error || "Não há questões disponíveis nesta seleção."}
        </p>
        <button className="button primary" onClick={onRestart}>
          Tentar novamente
        </button>
        <Link className="text-link" href="/app">
          Voltar às matérias
        </Link>
      </main>
    );
  if (finished) {
    const right = Object.values(results).filter((r) => r.acertou).length;
    return (
      <main className="page empty">
        <span className="completion-icon">
          <Check size={34} />
        </span>
        <span className="eyebrow">MAIS UM PASSO CONCLUÍDO</span>
        <h1>Prática finalizada!</h1>
        <p>
          Você acertou{" "}
          <strong>
            {right} de {questions.length}
          </strong>{" "}
          questões. Continue no seu ritmo.
        </p>
        <div className="summary-score">
          {Math.round((right / questions.length) * 100)}
          <small>% de aproveitamento</small>
        </div>
        <p className="muted">
          {session
            ? "Seu histórico está salvo na conta."
            : "Seu histórico foi registrado neste navegador, quando o armazenamento está disponível."}
        </p>
        <button className="button primary" onClick={onRestart}>
          <RotateCcw size={17} />{" "}
          {unseen > questions.length
            ? "Continuar com outras questões"
            : "Começar outra rodada de revisão"}
        </button>
        <p className="muted">
          {available} questões nesta seleção ·{" "}
          {Math.max(0, unseen - questions.length)} ainda não respondidas no
          histórico consultado.
        </p>
        <Link className="text-link" href="/app">
          Escolher outra matéria
        </Link>
      </main>
    );
  }
  return (
    <main className="page practice">
      <div className="practice-heading">
        <Link className="text-link" href="/app">
          <ArrowLeft size={17} /> Voltar
        </Link>
        <span className="muted">
          Questão {index + 1} de {questions.length}
        </span>
      </div>
      <p className="muted small-text">
        {available} questões disponíveis nesta seleção.{" "}
        {unseen
          ? "Prioridade para as ainda não respondidas."
          : "Você percorreu esta seleção: hora de revisar!"}
      </p>
      <nav className="round-options" aria-label="Tamanho da próxima rodada">
        Rodadas:{" "}
        {[5, 10, 20].map((n) => {
          const search = new URLSearchParams();
          if (subject) search.set("materia", subject);
          if (year) search.set("ano", year);
          search.set("quantidade", String(n));
          return (
            <Link key={n} href={`/app/feed?${search}`}>
              {n} questões
            </Link>
          );
        })}
      </nav>
      <div
        className="progress-track"
        role="progressbar"
        aria-label="Progresso do simulado"
        aria-valuenow={index + Number(Boolean(result))}
        aria-valuemin={0}
        aria-valuemax={questions.length}
      >
        <span
          style={{
            width: `${((index + Number(Boolean(result))) / questions.length) * 100}%`,
          }}
        />
      </div>
      <div className="practice-layout">
        <article className="question-card" key={q.id}>
          <div className="question-meta">
            <span className="pill purple">{q.materia}</span>
            <span>
              ENEM {q.source.year} · Questão {q.source.number}
              {q.source.language === "ingles"
                ? " · Inglês"
                : q.source.language === "espanhol"
                  ? " · Espanhol"
                  : ""}
            </span>
          </div>
          <h1 className="sr-only">
            Questão {q.source.number} de {q.materia}
          </h1>
          <QuestionContent question={q} />
          <fieldset
            className="answer-options"
            disabled={sending || Boolean(result)}
          >
            <legend className="sr-only">Escolha sua resposta</legend>
            {q.alternativas.map((alt, i) => (
              <button
                type="button"
                key={i}
                aria-label={`Alternativa ${"ABCDE"[i]}: ${alt}`}
                aria-pressed={selected === i}
                onClick={(event) => handleAnswer(i, event.timeStamp)}
                className={`answer-option ${result ? (i === result.correta ? "correct" : i === selected ? "incorrect" : "faded") : selected === i ? "chosen" : ""}`}
              >
                <span className="answer-letter">{"ABCDE"[i]}</span>
                <span>{alt}</span>
                {result && i === result.correta ? <Check size={20} /> : null}
              </button>
            ))}
          </fieldset>
          {sending && (
            <p role="status" className="muted">
              Conferindo sua resposta…
            </p>
          )}
          {error && (
            <div className="error-box" role="alert">
              {error}
              {selected !== null && (
                <button
                  className="text-link"
                  disabled={sending}
                  onClick={(event) => handleAnswer(selected, event.timeStamp)}
                >
                  Reenviar a mesma resposta
                </button>
              )}
              <button className="text-link" onClick={onRestart}>
                Iniciar nova prática
              </button>
            </div>
          )}
          {result && (
            <section
              className={`answer-feedback ${result.acertou ? "success" : "review"}`}
              aria-live="polite"
            >
              <span className="eyebrow">
                {result.acertou ? "BOM TRABALHO!" : "UMA CHANCE DE APRENDER"}
              </span>
              <h2>
                {result.acertou
                  ? "Você acertou."
                  : q.explanationStatus === "answer-key-only"
                    ? "Confira a alternativa oficial."
                    : "Vamos entender essa resposta."}
              </h2>
              <p>
                <strong>
                  Gabarito: alternativa {"ABCDE"[result.correta]}.
                </strong>
              </p>
              <p>{result.explicacaoIA}</p>
              <p className="muted small-text">
                {q.explanationStatus === "answer-key-only"
                  ? "Gabarito oficial disponível. Comentário pedagógico ainda não revisado."
                  : "Explicação elaborada para estudo. O gabarito é do INEP."}
              </p>
              <TtsPlayer text={result.explicacaoIA} />
              <button className="button primary" onClick={next}>
                {index === questions.length - 1
                  ? "Finalizar simulado"
                  : "Próxima questão"}
                <ArrowRight size={17} />
              </button>
            </section>
          )}
          <div className="source-links">
            <a href={q.source.url} target="_blank" rel="noreferrer">
              Consultar prova original ↗
            </a>
            {result && (
              <a href={q.source.answerKeyUrl} target="_blank" rel="noreferrer">
                Gabarito do INEP ↗
              </a>
            )}
          </div>
        </article>
        <aside className="practice-aside">
          <div className="mini-card">
            <span className="eyebrow">APRENDER LEVA TEMPO</span>
            <h3>
              Respire.
              <br />
              Leia com calma.
            </h3>
            <p>
              Não há corrida contra o relógio. Observe as alternativas e volte
              ao texto sempre que precisar.
            </p>
          </div>
          <button
            type="button"
            className="text-link"
            onClick={() => setReportOpen((o) => !o)}
          >
            <Flag size={15} /> Encontrou um problema?
          </button>
          {reportOpen && (
            <div className="mini-card">
              {session ? (
                <>
                  <label htmlFor="report">Conte o que precisa de revisão</label>
                  <textarea
                    id="report"
                    maxLength={1000}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                  <button
                    className="button quiet small"
                    disabled={reason.trim().length < 5}
                    onClick={report}
                  >
                    Enviar observação
                  </button>
                </>
              ) : (
                <p>
                  <Link href="/app/login">Entre na sua conta</Link> para
                  registrar uma observação. Você também pode conferir a prova
                  original.
                </p>
              )}
              {reportStatus && <p role="status">{reportStatus}</p>}
            </div>
          )}
          <FocusTimer />
        </aside>
      </div>
    </main>
  );
}
function Feed() {
  const params = useSearchParams(),
    subject = params.get("materia"),
    simulado = params.get("simulado"),
    count = params.get("quantidade"),
    year = params.get("ano");
  const [round, setRound] = useState(0);
  return (
    <Practice
      key={`${subject}:${simulado}:${count}:${year}:${round}`}
      subject={subject}
      simulado={simulado}
      count={count}
      year={year}
      onRestart={() => setRound((r) => r + 1)}
    />
  );
}
export default function FeedPage() {
  return (
    <Suspense
      fallback={<main className="page empty">Preparando sua prática…</main>}
    >
      <Feed />
    </Suspense>
  );
}
