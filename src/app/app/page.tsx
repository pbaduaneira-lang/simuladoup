import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  BookOpen,
  Globe,
  ScrollText,
  Languages,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { approvedQuestions } from "@/lib/catalogue";
import { StudyStats } from "@/components/StudyStats";
export default function Dashboard() {
  const qs = approvedQuestions();
  const subjects = [...new Set(qs.map((q) => q.materia))];
  return (
    <main className="page dashboard">
      <div className="page-top">
        <div>
          <span className="eyebrow">CADA PASSO CONTA</span>
          <h1>
            Seu futuro começa
            <br />
            com o próximo <em>Up.</em>
          </h1>
          <p>Escolha por onde seguir. Hoje é um bom dia para aprender.</p>
        </div>
        <span className="pill mint">
          <ShieldCheck size={15} /> Acesso gratuito
        </span>
      </div>
      <StudyStats />
      <section className="start-card">
        <div>
          <span className="eyebrow">SEU MOMENTO DE FOCO</span>
          <h2>
            Dez questões.
            <br />
            Novas possibilidades.
          </h2>
          <p>
            Uma seleção de questões revisadas para exercitar o que você sabe e
            descobrir o que pode melhorar.
          </p>
          <Link className="button primary" href="/app/feed">
            Começar minha prática <ArrowRight size={18} />
          </Link>
        </div>
        <div className="start-art" aria-hidden="true">
          <BookOpen size={66} />
          <Sparkles className="sparkle" size={26} />
          <span>
            um passo
            <br />
            <strong>de cada vez.</strong>
          </span>
        </div>
      </section>
      <div className="section-heading">
        <div>
          <span className="eyebrow">EXPLORE O ACERVO</span>
          <h2>Qual vai ser a matéria de hoje?</h2>
        </div>
        <span>{qs.length} questões disponíveis</span>
      </div>
      <section className="subject-grid">
        {subjects.map((name, i) => {
          const Icon =
            name === "Inglês"
              ? Languages
              : name === "Português"
                ? BookOpen
                : name === "Geografia"
                  ? Globe
                  : ScrollText;
          return (
            <Link
              className={`subject-card subject-${i % 4}`}
              href={`/app/feed?materia=${encodeURIComponent(name)}`}
              key={name}
            >
              <div className="subject-top">
                <Icon size={26} />
                <ArrowUpRight size={19} />
              </div>
              <h3>{name}</h3>
              <p>
                {qs.filter((q) => q.materia === name).length} questões revisadas
              </p>
            </Link>
          );
        })}
      </section>
      <div className="info-strip">
        <ShieldCheck size={21} />
        <p>
          Acervo inicial: questões textuais do ENEM 2022, com origem e gabarito
          identificados. Novas matérias entram após revisão.
        </p>
      </div>
      <section className="bottom-cards">
        <Link href="/app/trilha">
          <Sparkles />
          <div>
            <h3>Uma trilha no seu ritmo</h3>
            <p>Encontre os próximos passos a partir da sua prática.</p>
          </div>
          <ArrowUpRight />
        </Link>
        <Link href="/app/batalha">
          <Globe />
          <div>
            <h3>Aprender em companhia</h3>
            <p>Convide alguém para resolver o mesmo desafio.</p>
          </div>
          <ArrowUpRight />
        </Link>
      </section>
    </main>
  );
}
