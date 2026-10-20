import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Globe,
  ScrollText,
  Languages,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { approvedQuestions } from "@/lib/catalogue";
import { StudyStats } from "@/components/StudyStats";
import { PracticeSetup } from "@/components/PracticeSetup";
export default function Dashboard() {
  const qs = approvedQuestions();
  const subjects = [...new Set(qs.map((q) => q.materia))];
  const years = [...new Set(qs.map((q) => q.source.year))].sort();
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
            {qs.length} questões.
            <br />
            Novas possibilidades.
          </h2>
          <p>
            Questões de provas oficiais para exercitar o que você sabe e
            descobrir o que pode melhorar.
          </p>
          <PracticeSetup years={years} />
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
              <h3>{name === "Português" ? "Português e Linguagens" : name}</h3>
              <p>
                {qs.filter((q) => q.materia === name).length} questões oficiais
              </p>
            </Link>
          );
        })}
      </section>
      <div className="info-strip">
        <ShieldCheck size={21} />
        <p>
          ENEM {years.join(", ")}: provas oficiais com gabaritos do Inep. Sua
          próxima rodada prioriza questões ainda não respondidas. As anuladas
          ficam fora da prática.
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
