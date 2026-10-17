import Link from "next/link";
export default function Terms() {
  return (
    <main className="page prose-page">
      <span className="eyebrow">TRANSPARÊNCIA</span>
      <h1>Termos e privacidade</h1>
      <p>Atualizado em 17 de outubro de 2026.</p>
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
      <h2>Sem conta</h2>
      <p>
        Você pode praticar sem cadastro. O histórico local fica no armazenamento
        do navegador e pode ser perdido ao limpar seus dados ou trocar de
        aparelho. Esse histórico não participa do ranking.
      </p>
      <h2>Com conta</h2>
      <p>
        Nome, e-mail, credenciais protegidas e sessões são usados para
        autenticação. Respostas, tempos de prática e versões das questões são
        registrados para manter seu progresso e calcular resultados. Cidade e
        escola são opcionais. Não pedimos endereço ou telefone no cadastro. O
        banco utilizado é Turso; não usamos respostas dos estudantes para
        chamadas pagas de IA nesta versão.
      </p>
      <h2>Ranking e desafios</h2>
      <p>
        O ranking é opcional e exibe somente o primeiro nome e a pontuação. Nos
        desafios, os participantes compartilham uma sala por link e veem os
        pontos e o andamento do outro. Evite divulgar links de salas privadas.
      </p>
      <h2>Suas escolhas</h2>
      <p>
        Você pode editar seus dados no perfil, sair da conta ou excluir a conta
        e seus registros pelo mesmo local. Não informe dados pessoais de
        terceiros. Para menores de idade, recomendamos a participação de um
        responsável nas decisões sobre criação de conta e compartilhamento de
        dados.
      </p>
      <h2>Leitura em voz alta</h2>
      <p>
        A reprodução usa o recurso de voz do navegador. As vozes disponíveis
        dependem do dispositivo e do navegador.
      </p>
      <Link className="button quiet" href="/app">
        Voltar ao estudo
      </Link>
    </main>
  );
}
