"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpen, CheckCircle2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { readProgress } from "@/lib/local-progress";
type Step = { name: string; errors: number };
export default function Trail() {
  const { data: session } = authClient.useSession();
  const [steps, setSteps] = useState<Step[]>([]),
    [notice, setNotice] = useState("");
  const userId = session?.user.id;
  useEffect(() => {
    let active = true;
    const load = async () => {
      const counts = new Map<string, number>();
      for (const r of readProgress(userId))
        if (!r.acertou) counts.set(r.materia, (counts.get(r.materia) || 0) + 1);
      const local = [...counts]
        .map(([name, errors]) => ({ name, errors }))
        .sort((a, b) => b.errors - a.errors);
      if (!userId) {
        setSteps(local);
        return;
      }
      try {
        const res = await fetch("/api/trilha");
        const data = await res.json();
        if (!res.ok) throw Error(data.error);
        if (active) setSteps(data.trilha);
      } catch {
        if (active) {
          setSteps(local);
          setNotice("Conta indisponível. Usando o histórico deste navegador.");
        }
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [userId]);
  const trail = steps.length
    ? steps
    : [
        { name: "Português", errors: 0 },
        { name: "História", errors: 0 },
        { name: "Inglês", errors: 0 },
      ];
  return (
    <main className="page">
      <div className="page-top">
        <div>
          <span className="eyebrow">CONSTÂNCIA, SEM PRESSA</span>
          <h1>Seu próximo capítulo.</h1>
          <p>
            {steps.length
              ? "Estas matérias merecem mais uma visita, com base nas respostas registradas."
              : "Comece por uma destas matérias. Sua trilha se adapta quando você pratica."}
          </p>
        </div>
        <BookOpen size={38} />
      </div>
      {notice && <p role="status">{notice}</p>}
      <section className="trail-list">
        {trail.map((s, i) => (
          <Link
            className="trail-step"
            key={s.name}
            href={`/app/feed?materia=${encodeURIComponent(s.name)}`}
          >
            <span className="step-number">{i + 1}</span>
            <div>
              <span className="eyebrow">
                {s.errors
                  ? `${s.errors} RESPOSTAS PARA REVISAR`
                  : "UM BOM PONTO DE PARTIDA"}
              </span>
              <h2>{s.name}</h2>
              <p>Releia, pratique e observe o que mudou.</p>
            </div>
            <ArrowUpRight />
          </Link>
        ))}
      </section>
      <div className="info-strip">
        <CheckCircle2 />
        <p>
          Todos os passos estão abertos. Não há bloqueios por plano, e você
          escolhe a ordem.
        </p>
      </div>
    </main>
  );
}
