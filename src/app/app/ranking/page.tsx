"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Trophy } from "lucide-react";
import { authClient } from "@/lib/auth-client";
export default function Ranking() {
  const { data: session, isPending } = authClient.useSession();
  const [rows, setRows] = useState<
      { name: string; xp: number; isMe: boolean }[]
    >([]),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true);
  const uid = session?.user.id;
  useEffect(() => {
    let active = true;
    if (!uid) return;
    fetch("/api/ranking")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw Error(data.error);
        if (active) setRows(data.users);
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [uid]);
  return (
    <main className="page">
      <div className="page-top">
        <div>
          <span className="eyebrow">CRESCER EM COMUNIDADE</span>
          <h1>Cada conquista conta.</h1>
          <p>
            Um incentivo para continuar. Seu aprendizado vale mais que uma
            posição.
          </p>
        </div>
        <Trophy size={40} />
      </div>
      {isPending || (session && loading) ? (
        <p>Carregando…</p>
      ) : !session ? (
        <section className="mini-card">
          <h2>Participe quando quiser.</h2>
          <p>
            O ranking usa apenas resultados salvos em contas que escolheram
            participar.
          </p>
          <Link className="button primary" href="/app/login">
            Entrar na conta
          </Link>
        </section>
      ) : (
        <section className="mini-card">
          <p>
            Ranking geral · 10 XP pelo primeiro acerto de cada questão no dia.
          </p>
          {error ? (
            <p role="alert">{error}</p>
          ) : rows.length ? (
            rows.map((r, i) => (
              <div className={`rank-row ${r.isMe ? "is-me" : ""}`} key={i}>
                <span>{i + 1}</span>
                <strong>
                  {r.name}
                  {r.isMe ? " (você)" : ""}
                </strong>
                <span>{r.xp} XP</span>
              </div>
            ))
          ) : (
            <p>
              Ainda não há participantes. Você pode ativar sua participação no
              perfil.
            </p>
          )}
          <Link className="text-link" href="/app/perfil">
            Gerenciar minha participação
          </Link>
        </section>
      )}
    </main>
  );
}
