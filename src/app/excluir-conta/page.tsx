import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Excluir conta | SimuladoUp",
  description:
    "Exclua sua conta do SimuladoUp pelo perfil ou solicite a exclusão por e-mail, mesmo sem entrar no aplicativo.",
  alternates: { canonical: "https://www.simuladoup.com.br/excluir-conta" },
};

const requestEmail =
  "mailto:estrelaincorporadora@gmail.com?subject=" +
  encodeURIComponent("Exclusão de conta — SimuladoUp") +
  "&body=" +
  encodeURIComponent(
    "Olá, solicito a exclusão da minha conta do SimuladoUp e dos dados associados.\n\nE-mail usado no cadastro: \n\nNão inclua senha ou token nesta mensagem.",
  );

export default function DeleteAccountPage() {
  return (
    <LegalPage
      title="Excluir conta do SimuladoUp"
      description="Você pode excluir sua conta no perfil ou solicitar ajuda por e-mail, sem precisar entrar no aplicativo."
    >
      <p>
        Serviço sob responsabilidade da{" "}
        <strong>Estrela Incorporadora Ltda.</strong> A exclusão encerra o acesso
        à conta e remove seu histórico salvo. Esse histórico não poderá ser
        recuperado pelo app.
      </p>
      <section aria-labelledby="no-app">
        <h2 id="no-app">Excluir pelo app ou site</h2>
        <ol>
          <li>
            Entre na sua conta e abra <strong>Perfil</strong>.
          </li>
          <li>
            Escolha <strong>Excluir minha conta</strong>.
          </li>
          <li>
            Digite sua senha atual e selecione{" "}
            <strong>Confirmar exclusão da conta</strong>.
          </li>
        </ol>
        <Link className="button primary" href="/app/perfil">
          Abrir meu perfil
        </Link>
        <p>
          Se não estiver conectado, entre pela{" "}
          <Link href="/app/login">página de login</Link> e depois abra o perfil.
        </p>
      </section>
      <section aria-labelledby="sem-login">
        <h2 id="sem-login">Solicitar sem entrar na conta</h2>
        <p>
          Se você perdeu o acesso ou prefere solicitar por e-mail, escreva para{" "}
          <a href={requestEmail}>estrelaincorporadora@gmail.com</a> com o
          assunto <strong>Exclusão de conta — SimuladoUp</strong>.
        </p>
        <p>
          Informe o e-mail usado no cadastro e, se possível, envie a mensagem a
          partir desse endereço. Não é necessário informar o motivo da exclusão.
          Não envie senha, token ou documentos pessoais na mensagem inicial.
          Confirmaremos a titularidade antes de remover os dados; essa
          solicitação é tratada pela equipe, não de forma automática pelo botão
          abaixo.
        </p>
        <a className="button quiet" href={requestEmail}>
          Solicitar exclusão por e-mail
        </a>
        <p>
          O botão abre seu aplicativo de e-mail. Para enviar a solicitação,
          confira a mensagem e envie por ele.
        </p>
      </section>
      <section aria-labelledby="removidos">
        <h2 id="removidos">Quais dados são excluídos</h2>
        <p>
          Na exclusão da conta, são removidos do banco ativo o nome e e-mail da
          conta, as credenciais e sessões de login, os dados do perfil, as
          tentativas e respostas, o histórico de estudo e sua pontuação, as
          curtidas e relatos vinculados e as salas de desafio associadas à
          conta. Uma confirmação bem-sucedida pelo perfil executa essa remoção
          no próprio serviço.
        </p>
        <p>
          A exclusão não depende de pagamento. Se você voltar a criar uma conta,
          começa com um novo histórico.
        </p>
      </section>
      <section aria-labelledby="outros-registros">
        <h2 id="outros-registros">Histórico local e registros separados</h2>
        <p>
          O histórico feito sem conta permanece no navegador até você limpar os
          dados do site nas configurações dele. Faça isso em cada aparelho em
          que deseja remover esse histórico.
        </p>
        <p>
          Registros técnicos de proteção contra abuso, logs de infraestrutura e
          cópias de segurança seguem os ciclos de retenção dos serviços
          utilizados. Correspondências de atendimento podem ser mantidas para
          concluir e registrar o pedido. Eventuais retenções necessárias por
          segurança ou obrigação legal ficam limitadas a essa finalidade e podem
          ser esclarecidas pelo contato de privacidade.
        </p>
        <p>
          Veja os detalhes na{" "}
          <Link href="/privacidade">Política de Privacidade do SimuladoUp</Link>
          .
        </p>
      </section>
    </LegalPage>
  );
}
