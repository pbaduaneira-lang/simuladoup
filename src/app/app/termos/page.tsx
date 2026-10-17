import Link from "next/link";
export default function Terms() {
  return (
    <main className="page prose-page">
      <span className="eyebrow">TRANSPARÊNCIA</span>
      <h1>Termos de uso</h1>
      <p>Atualizado em 17 de outubro de 2026.</p>
      <p>
        O SimuladoUp é um serviço de estudo para o ENEM sob responsabilidade da{" "}
        <strong>Estrela Incorporadora Ltda.</strong> Para atendimento, escreva
        para{" "}
        <a className="text-link" href="mailto:estrelaincorporadora@gmail.com">
          estrelaincorporadora@gmail.com
        </a>
        .
      </p>
      <p>
        O tratamento de dados está descrito na{" "}
        <Link className="text-link" href="/privacidade">
          Política de Privacidade
        </Link>
        . As instruções de exclusão, inclusive sem login, estão na página{" "}
        <Link className="text-link" href="/excluir-conta">
          Excluir conta do SimuladoUp
        </Link>
        .
      </p>
      <h2>Uso gratuito</h2>
      <p>
        Esta versão do SimuladoUp é gratuita. Não solicitamos cartão e não há
        assinaturas ou compras dentro do app.
      </p>
      <h2>Aprendizado e fontes</h2>
      <p>
        As questões disponibilizadas têm fonte e gabarito identificados. As
        explicações de estudo são elaboradas pelo app e não são resoluções
        oficiais do INEP. O SimuladoUp não é afiliado ao INEP e não garante
        aprovação ou reprodução da nota oficial do ENEM.
      </p>
      <h2>Conta e progresso</h2>
      <p>
        Você pode praticar sem cadastro; nesse modo, o histórico fica no
        navegador e pode ser perdido ao limpar os dados do site ou trocar de
        aparelho. Com conta, o progresso é registrado no serviço. Mantenha sua
        senha em sigilo e use informações próprias no cadastro.
      </p>
      <h2>Ranking e desafios</h2>
      <p>
        A participação no ranking é opcional. Nos desafios, o link permite
        convidar outro participante; compartilhe-o apenas com quem deseja
        convidar. Evite inserir dados de terceiros nos relatos sobre questões.
      </p>
      <h2>Suas escolhas</h2>
      <p>
        Você pode editar o perfil, sair da conta e solicitar sua exclusão.
        Estudantes e responsáveis podem entrar em contato para esclarecer o
        funcionamento e o tratamento de dados. Saiba mais na{" "}
        <Link className="text-link" href="/privacidade">
          Política de Privacidade
        </Link>
        .
      </p>
      <Link className="button quiet" href="/app">
        Voltar ao estudo
      </Link>
    </main>
  );
}
