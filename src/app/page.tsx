import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Headphones,
  Sparkles,
} from "lucide-react";
export default function Landing() {
  return (
    <div className="landing">
      <header className="landing-nav">
        <Link href="/" className="brand">
          <img src="/logo.png" alt="" />
          Simulado<span>Up</span>
        </Link>
        <Link className="text-link" href="/app/login">
          Entrar na minha conta <ArrowRight size={16} />
        </Link>
      </header>
      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="live-dot" /> ACESSO GRATUITO PARA TODOS
            </span>
            <h1>
              Um pouco por dia.
              <br />
              <em>Um futuro inteiro</em>
              <br />
              pela frente.
            </h1>
            <p>
              Transforme alguns minutos em aprendizado. Pratique com questões do
              ENEM, confira o gabarito e entenda cada resposta no seu ritmo.
            </p>
            <div className="hero-actions">
              <Link className="button primary" href="/app">
                Começar a estudar <ArrowRight size={19} />
              </Link>
              <Link className="button quiet" href="/app/login?mode=signup">
                Salvar meu progresso
              </Link>
            </div>
            <p className="hero-footnote">
              <CheckCircle2 size={15} /> Sem cartão. Sem assinatura. Você pode
              começar sem conta.
            </p>
          </div>
          <div
            className="hero-preview"
            aria-label="Prévia do ambiente de estudo"
          >
            <div className="preview-top">
              <span className="mini-label">SEU PRÓXIMO PASSO</span>
              <span className="pill mint">ENEM</span>
            </div>
            <div className="preview-orbit">
              <BookOpen size={48} />
              <span className="orbit-star">✦</span>
            </div>
            <h2>
              Aprender é<br />
              construir possibilidades.
            </h2>
            <p>
              Uma questão. Uma descoberta.
              <br />
              Um passo mais perto do seu objetivo.
            </p>
            <div className="preview-progress">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="preview-bottom">
              <span>Uma rotina que cabe na sua vida</span>
              <ArrowRight size={20} />
            </div>
          </div>
        </section>
        <section className="feature-grid" aria-label="Como funciona">
          {[
            {
              icon: BookOpen,
              title: "Pratique com contexto",
              text: "Textos de apoio completos e alternativas legíveis para você se concentrar no aprendizado.",
            },
            {
              icon: CheckCircle2,
              title: "Confira e aprenda",
              text: "Veja a resposta e uma explicação depois de resolver cada questão.",
            },
            {
              icon: Headphones,
              title: "Estude do seu jeito",
              text: "Ouça as explicações com a voz do navegador, sem custos adicionais.",
            },
            {
              icon: Sparkles,
              title: "Crie sua rotina",
              text: "Acompanhe seu progresso e revisite as matérias que precisam de atenção.",
            },
          ].map((f) => (
            <article key={f.title}>
              <f.icon size={23} />
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </article>
          ))}
        </section>
      </main>
      <footer className="landing-footer">
        <span>SimuladoUp · Aprendizado acessível, um passo de cada vez.</span>
        <nav aria-label="Informações do serviço">
          <Link href="/privacidade">Política de Privacidade</Link>
          <Link href="/excluir-conta">Excluir conta</Link>
          <Link href="/app/termos">Termos de uso</Link>
        </nav>
      </footer>
    </div>
  );
}
