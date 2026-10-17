"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserRound, LogOut, Check, ShieldCheck } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { StudyStats } from "@/components/StudyStats";
export default function Profile() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [form, setForm] = useState({
      name: "",
      cidade: "",
      ondeEstuda: "",
      meta: "ENEM",
      rankingOptIn: false,
    }),
    [status, setStatus] = useState(""),
    [busy, setBusy] = useState(false),
    [loadedUserId, setLoadedUserId] = useState<string | null>(null),
    [deleteOpen, setDeleteOpen] = useState(false),
    [deletePassword, setDeletePassword] = useState("");
  const userId = session?.user.id;
  const loaded = loadedUserId === userId;
  useEffect(() => {
    let active = true;
    if (!userId) return;
    fetch("/api/users/me")
      .then(async (res) => {
        if (!res.ok) throw Error("Não foi possível carregar seu perfil.");
        return res.json();
      })
      .then((data) => {
        if (active) {
          setForm({
            name: data.user.name,
            cidade: data.user.cidade || "",
            ondeEstuda: data.user.ondeEstuda || "",
            meta: data.user.meta || "ENEM",
            rankingOptIn: Boolean(data.user.rankingOptIn),
          });
          setLoadedUserId(userId);
        }
      })
      .catch((e) => {
        if (active) setStatus(e.message);
      });
    return () => {
      active = false;
    };
  }, [userId]);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setStatus("");
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw Error(data.error);
      setStatus("Perfil salvo.");
      await authClient.getSession({ query: { disableCookieCache: true } });
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Não foi possível salvar.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="page profile">
      <div className="page-top">
        <div>
          <span className="eyebrow">SUA JORNADA</span>
          <h1>Você, em evolução.</h1>
          <p>Um espaço para acompanhar cada passo.</p>
        </div>
        <UserRound size={38} />
      </div>
      <StudyStats />
      {isPending ? (
        <p className="muted">Carregando sua conta…</p>
      ) : !session ? (
        <section className="mini-card">
          <h2>Seu progresso pode ir com você.</h2>
          <p>
            Crie uma conta para guardar seu histórico no banco e acessar em
            outros dispositivos. Sem conta, a prática continua gratuita e o
            histórico fica neste navegador.
          </p>
          <Link className="button primary" href="/app/login?mode=signup">
            Criar conta gratuita
          </Link>
          <Link className="text-link" href="/app/login">
            Já tenho uma conta
          </Link>
        </section>
      ) : (
        <section className="mini-card">
          <h2>Suas informações</h2>
          <p className="muted">{session.user.email}</p>
          <form onSubmit={save}>
            <label>
              Nome
              <input
                required
                minLength={2}
                maxLength={120}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            {(["cidade", "ondeEstuda", "meta"] as const).map((key) => (
              <label key={key}>
                {key === "cidade"
                  ? "Cidade (opcional)"
                  : key === "ondeEstuda"
                    ? "Onde estuda (opcional)"
                    : "Objetivo"}
                <input
                  maxLength={120}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </label>
            ))}
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={form.rankingOptIn}
                onChange={(e) =>
                  setForm({ ...form, rankingOptIn: e.target.checked })
                }
              />{" "}
              Participar do ranking com meu primeiro nome. E-mail e outros dados
              não serão exibidos.
            </label>
            <button className="button primary" disabled={busy || !loaded}>
              <Check size={17} />
              {busy ? "Salvando…" : "Salvar informações"}
            </button>
          </form>
          <button
            className="text-link"
            onClick={async () => {
              await authClient.signOut();
              router.push("/app");
              router.refresh();
            }}
          >
            <LogOut size={17} /> Sair da conta
          </button>
          <hr className="my-6 border-border" />
          <button
            type="button"
            className="text-link"
            onClick={() => setDeleteOpen((o) => !o)}
          >
            Excluir minha conta
          </button>
          {deleteOpen && (
            <div className="error-box">
              <p>
                Esta ação exclui sua conta, sessões e histórico salvo. Confirme
                com sua senha atual.
              </p>
              <label>
                Senha atual
                <input
                  type="password"
                  autoComplete="current-password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                />
              </label>
              <button
                type="button"
                className="button quiet"
                disabled={busy || !deletePassword}
                onClick={async () => {
                  setBusy(true);
                  try {
                    const result = await authClient.deleteUser({
                      password: deletePassword,
                    });
                    if (result.error)
                      throw Error(
                        "Não foi possível excluir. Confira sua senha.",
                      );
                    router.push("/app");
                    router.refresh();
                  } catch (e) {
                    setStatus(
                      e instanceof Error
                        ? e.message
                        : "Não foi possível excluir.",
                    );
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                Confirmar exclusão da conta
              </button>
            </div>
          )}
        </section>
      )}
      {status && <p role="status">{status}</p>}
      <section className="info-strip">
        <ShieldCheck size={22} />
        <p>
          O app está gratuito. Não há assinatura, cobrança, cartão ou recursos
          bloqueados por plano.
        </p>
      </section>
      <Link className="text-link" href="/app/termos">
        Termos e privacidade
      </Link>
    </main>
  );
}
