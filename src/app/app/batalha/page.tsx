"use client";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Copy, ArrowRight, Users, Check, Loader2 } from "lucide-react";
import type { PublicQuestion } from "@/lib/types";
import { QuestionContent } from "@/components/QuestionContent";
interface Battle {
  id: string;
  participant: boolean;
  canJoin?: boolean;
  waiting?: boolean;
  total: number;
  answered: number;
  opponentAnswered: number;
  myScore: number;
  opponentScore: number;
  finished: boolean;
  ownFinished: boolean;
  question: PublicQuestion | null;
}
interface Result {
  acertou: boolean;
  correta: number;
  explicacaoIA: string;
  points: number;
}
function BattlePage({ room }: { room: string | null }) {
  const router = useRouter();
  const [state, setState] = useState<Battle | null>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [copied, setCopied] = useState(false),
    [result, setResult] = useState<Result | null>(null),
    [displayQuestion, setDisplayQuestion] = useState<PublicQuestion | null>(
      null,
    );
  const pending = useRef(false);
  const load = useCallback(async () => {
    if (!room) return;
    const res = await fetch(`/api/battles/${encodeURIComponent(room)}`);
    const data = await res.json();
    if (!res.ok) throw Error(data.error);
    setState(data);
  }, [room]);
  useEffect(() => {
    if (!room) return;
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    const poll = async () => {
      try {
        await load();
        if (active) setError("");
      } catch (e) {
        if (active)
          setError(e instanceof Error ? e.message : "Desafio indisponível.");
      }
      if (active) timer = setTimeout(poll, 3000);
    };
    void poll();
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [room, load]);
  async function action(kind: "create" | "join" | "answer", option?: number) {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setError("");
    try {
      const q = state?.question;
      if (kind === "answer" && !q) return;
      const res = await fetch(
        kind === "create" ? "/api/battles" : `/api/battles/${room}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            kind === "create"
              ? {}
              : kind === "join"
                ? { action: "join" }
                : {
                    action: "answer",
                    questionId: q!.id,
                    selectedOption: option,
                  },
          ),
        },
      );
      const data = await res.json();
      if (!res.ok) throw Error(data.error);
      if (kind === "create") {
        router.push(`/app/batalha?room=${data.id}`);
      } else {
        if (kind === "answer") {
          setDisplayQuestion(q!);
          setResult(data.result);
        }
        await load();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível continuar.");
    } finally {
      setBusy(false);
      pending.current = false;
    }
  }
  const q = displayQuestion || state?.question;
  return (
    <main className="page practice">
      <div className="page-top">
        <div>
          <span className="eyebrow">APRENDER EM COMPANHIA</span>
          <h1>
            Um desafio.
            <br />
            Duas jornadas.
          </h1>
          <p>
            As mesmas cinco questões, cada um no seu ritmo. Cada acerto vale 10
            pontos no desafio, sem alterar o XP do ranking.
          </p>
        </div>
        <Users size={36} />
      </div>
      {error && (
        <div className="error-box" role="alert">
          {error}
        </div>
      )}
      {!room ? (
        <section className="mini-card">
          <h2>Convide alguém para estudar.</h2>
          <p>
            Crie uma sala e envie o link para um amigo. O desafio é gratuito e a
            sala fica disponível por 24 horas.
          </p>
          <button
            className="button primary"
            disabled={busy}
            onClick={() => action("create")}
          >
            {busy ? (
              <Loader2 className="spin" size={18} />
            ) : (
              <Users size={18} />
            )}{" "}
            Criar desafio
          </button>
        </section>
      ) : !state ? (
        <p className="muted">
          {error
            ? "A sala depende da conexão com o banco. A prática individual continua disponível."
            : "Carregando sala…"}
        </p>
      ) : !state.participant ? (
        <section className="mini-card">
          <h2>
            {state.canJoin
              ? "Você recebeu um convite."
              : "Esta sala já está completa."}
          </h2>
          {state.canJoin && (
            <button
              className="button primary"
              disabled={busy}
              onClick={() => action("join")}
            >
              Aceitar desafio <ArrowRight size={17} />
            </button>
          )}
        </section>
      ) : (
        <>
          <div className="battle-score">
            <div>
              <span>
                Você · {state.answered}/{state.total}
              </span>
              <strong>{state.myScore} pontos</strong>
            </div>
            <div>
              <span>
                Outro participante · {state.opponentAnswered}/{state.total}
              </span>
              <strong>{state.opponentScore} pontos</strong>
            </div>
          </div>
          {state.waiting ? (
            <section className="mini-card">
              <h2>Aguardando companhia.</h2>
              <p>Compartilhe este link com a pessoa que vai participar:</p>
              <input
                aria-label="Link do desafio"
                readOnly
                value={
                  typeof window === "undefined" ? "" : window.location.href
                }
              />
              <button
                className="button quiet"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(window.location.href);
                    setCopied(true);
                  } catch {
                    setError("Selecione e copie o link acima.");
                  }
                }}
              >
                {copied ? <Check size={17} /> : <Copy size={17} />}{" "}
                {copied ? "Copiado" : "Copiar convite"}
              </button>
            </section>
          ) : state.finished && !result ? (
            <section className="mini-card">
              <h2>
                {state.myScore === state.opponentScore
                  ? "Um empate e muito aprendizado."
                  : state.myScore > state.opponentScore
                    ? "Você venceu o desafio!"
                    : "Desafio concluído. Continue aprendendo!"}
              </h2>
              <p>
                O resultado é calculado no servidor a partir das respostas dos
                participantes.
              </p>
              <Link className="button primary" href="/app">
                Continuar estudando
              </Link>
            </section>
          ) : q ? (
            <article className="question-card">
              <div className="question-meta">
                <span className="pill purple">{q.materia}</span>
                <span>
                  ENEM {q.source.year} · Questão {q.source.number}
                </span>
              </div>
              <QuestionContent question={q} />
              <fieldset
                className="answer-options"
                disabled={busy || Boolean(result)}
              >
                <legend className="sr-only">Alternativas do desafio</legend>
                {q.alternativas.map((alt, i) => (
                  <button
                    type="button"
                    className={`answer-option ${result && i === result.correta ? "correct" : ""}`}
                    key={i}
                    onClick={() => action("answer", i)}
                  >
                    <span className="answer-letter">{"ABCDE"[i]}</span>
                    <span>{alt}</span>
                  </button>
                ))}
              </fieldset>
              {result && (
                <section className="answer-feedback">
                  <h2>
                    {result.acertou
                      ? "Você acertou!"
                      : "Vamos aprender com essa."}
                  </h2>
                  <p>{result.explicacaoIA}</p>
                  <button
                    className="button primary"
                    onClick={() => {
                      setResult(null);
                      setDisplayQuestion(null);
                    }}
                  >
                    Continuar <ArrowRight size={17} />
                  </button>
                </section>
              )}
            </article>
          ) : (
            <section className="mini-card">
              <h2>Sua parte está concluída.</h2>
              <p>
                Aguardando o outro participante terminar para mostrar o
                resultado final.
              </p>
            </section>
          )}
        </>
      )}
      <Link className="text-link" href="/app/feed">
        Prefiro praticar individualmente
      </Link>
    </main>
  );
}
function BattleRouter() {
  const room = useSearchParams().get("room");
  return <BattlePage key={room || "new"} room={room} />;
}
export default function Battle() {
  return (
    <Suspense fallback={<main className="page">Carregando desafio…</main>}>
      <BattleRouter />
    </Suspense>
  );
}
