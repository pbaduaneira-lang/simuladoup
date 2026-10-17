"use client";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { readProgress, localStats } from "@/lib/local-progress";
export function StudyStats() {
  const { data: session } = authClient.useSession();
  const [stats, setStats] = useState({ total: 0, correct: 0, today: 0 });
  const [cloudError, setCloudError] = useState(false);
  useEffect(() => {
    let active = true;
    const update = async () => {
      const local = localStats(readProgress(session?.user.id));
      if (!session) {
        setStats(local);
        setCloudError(false);
        return;
      }
      try {
        const res = await fetch("/api/users/me");
        if (!res.ok) throw Error();
        const data = await res.json();
        if (active) {
          setStats(data.stats);
          setCloudError(false);
        }
      } catch {
        if (active) {
          setStats(local);
          setCloudError(true);
        }
      }
    };
    void update();
    window.addEventListener("study-updated", update);
    window.addEventListener("storage", update);
    return () => {
      active = false;
      window.removeEventListener("study-updated", update);
      window.removeEventListener("storage", update);
    };
  }, [session]);
  return (
    <section aria-label="Seu progresso" className="stats-grid">
      <div className="stat">
        <span>Questões respondidas</span>
        <strong>{stats.total}</strong>
      </div>
      <div className="stat">
        <span>Aproveitamento</span>
        <strong>
          {stats.total ? Math.round((stats.correct / stats.total) * 100) : 0}
          <small>%</small>
        </strong>
      </div>
      <div className="stat">
        <span>Hoje, no seu ritmo</span>
        <strong>
          {stats.today}
          <small> / 10</small>
        </strong>
      </div>
      <p className="stats-note">
        {session && !cloudError
          ? "Progresso salvo na sua conta."
          : cloudError
            ? "Conta indisponível. Mostrando somente o histórico deste navegador."
            : "Sem conta: seu histórico fica neste navegador."}
      </p>
    </section>
  );
}
