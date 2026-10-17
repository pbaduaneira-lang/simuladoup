"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
function Login() {
  const router = useRouter(),
    params = useSearchParams();
  const [signup, setSignup] = useState(params.get("mode") === "signup"),
    [name, setName] = useState(""),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const input = { email: email.trim().toLowerCase(), password };
      const result = signup
        ? await authClient.signUp.email({ ...input, name: name.trim() })
        : await authClient.signIn.email(input);
      if (result.error)
        throw Error(
          result.error.status === 429
            ? "Muitas tentativas. Aguarde um minuto e tente novamente."
            : result.error.status === 503
              ? "O serviço de contas está indisponível. Você pode estudar sem conta."
              : signup
                ? "Não foi possível criar a conta. Confira os dados ou tente entrar."
                : "E-mail ou senha incorretos.",
        );
      router.push("/app");
      router.refresh();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Não foi possível conectar. Tente novamente.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="auth-page">
      <section className="auth-story">
        <Link href="/" className="brand">
          <img src="/logo.png" alt="" />
          Simulado<span>Up</span>
        </Link>
        <BookOpen size={70} />
        <h1>
          Seu espaço
          <br />
          para ir <em>além.</em>
        </h1>
        <p>
          Guarde suas conquistas, acompanhe seu progresso e construa uma rotina
          de aprendizado.
        </p>
        <span className="pill mint">Sempre gratuito nesta versão</span>
      </section>
      <section className="auth-form">
        <Link className="text-link" href="/app">
          <ArrowLeft size={16} /> Continuar sem conta
        </Link>
        <h2>{signup ? "Um novo começo." : "Que bom ter você aqui."}</h2>
        <p>
          {signup
            ? "Crie sua conta gratuita e salve seu progresso."
            : "Entre para continuar a sua jornada."}
        </p>
        <div className="tabs">
          <button
            type="button"
            aria-pressed={!signup}
            onClick={() => {
              setSignup(false);
              setError("");
            }}
          >
            Entrar
          </button>
          <button
            type="button"
            aria-pressed={signup}
            onClick={() => {
              setSignup(true);
              setError("");
            }}
          >
            Criar conta
          </button>
        </div>
        <form onSubmit={submit}>
          {signup && (
            <label>
              Como podemos chamar você?
              <input
                autoComplete="name"
                required
                minLength={2}
                maxLength={120}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          )}
          <label>
            E-mail
            <input
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Senha
            <input
              type="password"
              autoComplete={signup ? "new-password" : "current-password"}
              required
              minLength={signup ? 12 : 1}
              maxLength={128}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {signup && (
            <p className="muted small-text">
              Use pelo menos 12 caracteres. Não pedimos endereço nem telefone.
            </p>
          )}
          {error && (
            <div className="error-box" role="alert">
              {error}
            </div>
          )}
          <button className="button primary" disabled={busy}>
            {busy ? (
              <Loader2 className="spin" size={18} />
            ) : (
              <ArrowRight size={18} />
            )}{" "}
            {signup ? "Criar minha conta" : "Entrar e continuar"}
          </button>
        </form>
        <p className="muted small-text">
          Ao continuar, você concorda com os{" "}
          <Link href="/app/termos">termos e a política de privacidade</Link>.
        </p>
      </section>
    </main>
  );
}
export default function LoginPage() {
  return (
    <Suspense fallback={<main className="page empty">Carregando…</main>}>
      <Login />
    </Suspense>
  );
}
