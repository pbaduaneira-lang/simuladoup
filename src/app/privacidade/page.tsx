import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Política de Privacidade | SimuladoUp",
  description:
    "Como o SimuladoUp trata seus dados, mantém seu progresso e permite excluir sua conta.",
  alternates: { canonical: "https://www.simuladoup.com.br/privacidade" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Política de Privacidade"
      description="Conheça os dados usados pelo SimuladoUp e as escolhas que você tem sobre eles."
    >
      <section aria-labelledby="responsavel">
        <h2 id="responsavel">1. Quem é responsável</h2>
        <p>
          O SimuladoUp é um serviço de estudo para o ENEM sob responsabilidade
          da <strong>Estrela Incorporadora Ltda.</strong> Esta política abrange
          o site e as funções do serviço acessadas pelo aplicativo.
        </p>
        <p>
          Para dúvidas de privacidade, atendimento ou solicitações sobre seus
          dados, escreva para{" "}
          <a href="mailto:estrelaincorporadora@gmail.com">
            estrelaincorporadora@gmail.com
          </a>
          .
        </p>
      </section>
      <section aria-labelledby="dados">
        <h2 id="dados">2. Quais dados são usados e por quê</h2>
        <ul>
          <li>
            <strong>Conta:</strong> nome, e-mail, identificador da conta e senha
            protegida por hash, para cadastro e autenticação. A senha não é
            armazenada em texto legível.
          </li>
          <li>
            <strong>Perfil opcional:</strong> cidade, instituição de ensino,
            objetivo de estudo e participação no ranking, quando você preencher
            ou escolher essas opções. A cidade é informada por você; não
            acessamos GPS.
          </li>
          <li>
            <strong>Estudo:</strong> questões e versões apresentadas,
            alternativas escolhidas, acertos, tempos de resposta, datas e
            pontuação, para corrigir exercícios, manter o histórico e sugerir
            próximos estudos.
          </li>
          <li>
            <strong>Interações:</strong> curtidas, relatos de problemas nas
            questões e participação em desafios, para executar esses recursos e
            revisar o acervo. Evite incluir dados pessoais de terceiros nos
            relatos.
          </li>
          <li>
            <strong>Sessão e segurança:</strong> cookies de autenticação,
            identificadores de sessão, endereço IP, informações técnicas do
            navegador, localização aproximada derivada do IP pela hospedagem e
            registros de acesso ou falha, para manter o login, limitar
            tentativas e operar o serviço com segurança.
          </li>
          <li>
            <strong>Atendimento:</strong> endereço de e-mail e informações que
            você enviar ao contato de suporte, para responder dúvidas e
            verificar solicitações.
          </li>
        </ul>
        <p>
          O cadastro não pede CPF, endereço residencial ou telefone. Esta versão
          não solicita acesso à câmera, ao microfone, aos contatos nem à
          localização precisa.
        </p>
      </section>
      <section aria-labelledby="sem-conta">
        <h2 id="sem-conta">3. Uso sem conta e armazenamento no navegador</h2>
        <p>
          É possível praticar sem cadastro. O histórico desse modo fica no
          armazenamento local do navegador e não é sincronizado com uma conta.
          Para removê-lo, limpe os dados do site nas configurações do navegador;
          isso também pode encerrar sessões. Excluir uma conta não limpa
          automaticamente o armazenamento dos seus outros aparelhos.
        </p>
        <p>
          As requisições de quem usa o modo sem conta também passam pela
          hospedagem e podem gerar registros técnicos. Desafios sem login usam
          um identificador aleatório em cookie; a participação e as respostas da
          sala ficam no banco. Salas expiram após 24 horas e são removidas na
          limpeza realizada ao criar novos desafios.
        </p>
      </section>
      <section aria-labelledby="visibilidade">
        <h2 id="visibilidade">4. O que outras pessoas podem ver</h2>
        <p>
          O ranking é opcional. Ao ativá-lo, seu primeiro nome e a pontuação
          ficam visíveis para outros participantes autenticados. O e-mail e o
          histórico individual não são exibidos no ranking.
        </p>
        <p>
          Nos desafios, o outro participante vê pontos e andamento da sala. Quem
          recebe o link pode acessar informações limitadas da sala e tentar
          ocupar a vaga disponível; compartilhe o link apenas com quem deseja
          convidar. A versão atual não oferece comentários públicos.
        </p>
      </section>
      <section aria-labelledby="provedores">
        <h2 id="provedores">5. Serviços que ajudam a operar o app</h2>
        <p>
          Usamos a <strong>Vercel</strong> para hospedagem e execução do site, e
          o <strong>Turso</strong> para armazenamento do banco de contas,
          sessões e progresso. Esses provedores processam os dados necessários
          às respectivas funções. O contato de atendimento utiliza o Gmail, que
          processa as mensagens enviadas a esse endereço.
        </p>
        <p>
          A infraestrutura pode envolver processamento em outros países. Os
          provedores mantêm suas próprias práticas de segurança e privacidade:{" "}
          <a href="https://vercel.com/legal/privacy-policy">Vercel</a>,{" "}
          <a href="https://turso.tech/privacy-policy">Turso</a> e{" "}
          <a href="https://policies.google.com/privacy?hl=pt-BR">Google</a>.
        </p>
        <p>
          Não vendemos dados pessoais. Esta versão não exibe anúncios nem
          integra ferramentas de publicidade ou rastreamento publicitário.
          Respostas e dados de perfil não são enviados a serviços de
          inteligência artificial para gerar explicações.
        </p>
        <p>
          Quando você escolhe ouvir uma explicação, o texto é entregue ao
          recurso de síntese de voz do navegador ou sistema. Algumas vozes podem
          usar serviços on-line do fornecedor do dispositivo. O SimuladoUp não
          grava sua voz nem solicita o microfone para essa função.
        </p>
      </section>
      <section aria-labelledby="retencao">
        <h2 id="retencao">6. Por quanto tempo os dados permanecem</h2>
        <p>
          Dados da conta e do progresso permanecem no serviço enquanto a conta
          existir, até sua exclusão. O histórico sem conta fica no aparelho até
          você limpar os dados do site. Sessões de login têm validade de até
          sete dias e podem ser encerradas antes ao sair ou excluir a conta.
        </p>
        <p>
          Ao confirmar a exclusão, removemos do banco ativo a conta, as
          credenciais de login, as sessões, o perfil, as tentativas, as
          respostas, as curtidas, os relatos vinculados e as salas de desafio
          associadas à conta.
        </p>
        <p>
          Registros técnicos de proteção contra abuso, logs de infraestrutura e
          cópias de segurança são separados do histórico de estudo e podem
          permanecer conforme os ciclos de retenção e substituição dos
          provedores. Mensagens de atendimento podem ser conservadas para
          concluir a solicitação e registrar seu tratamento. Eventual retenção
          necessária por segurança ou obrigação legal será limitada à finalidade
          correspondente; você pode solicitar informações pelo contato de
          privacidade.
        </p>
      </section>
      <section aria-labelledby="controle">
        <h2 id="controle">7. Acesso, correção e exclusão</h2>
        <p>
          Você pode corrigir o perfil no app e alterar sua participação no
          ranking. Para consultar seus dados, pedir correção adicional,
          informações sobre o tratamento ou exclusão, use o contato desta
          política. Podemos confirmar a titularidade antes de atender um pedido
          para proteger sua conta.
        </p>
        <p>
          A exclusão está disponível em{" "}
          <strong>Perfil → Excluir minha conta</strong>, mediante confirmação
          com a senha atual. A página{" "}
          <Link href="/excluir-conta">Excluir conta do SimuladoUp</Link> explica
          esse caminho e oferece contato para solicitar a exclusão mesmo sem
          entrar no aplicativo, inclusive se você não lembrar a senha.
        </p>
        <p>
          Não envie sua senha, tokens ou documentos pessoais junto da
          solicitação inicial.
        </p>
      </section>
      <section aria-labelledby="seguranca">
        <h2 id="seguranca">8. Proteção e cuidados</h2>
        <p>
          A comunicação do serviço público utiliza HTTPS. As senhas são
          protegidas por hash, o acesso às funções privadas depende da sessão e
          o servidor calcula a correção e a pontuação. Mantenha sua senha em
          sigilo e saia da conta em aparelhos compartilhados.
        </p>
        <p>
          Se você é responsável por um estudante menor de idade, pode entrar em
          contato para esclarecer o tratamento de dados ou solicitar
          providências sobre a conta dele, mediante verificação adequada de
          titularidade ou representação.
        </p>
      </section>
      <section aria-labelledby="alteracoes">
        <h2 id="alteracoes">9. Atualizações e contato</h2>
        <p>
          Esta política pode ser atualizada quando as funções ou práticas do
          serviço mudarem. A data da versão aparece no início da página.
          Mudanças relevantes serão indicadas no serviço; quando necessário,
          pediremos uma nova manifestação antes do tratamento correspondente.
        </p>
        <p>
          <strong>Estrela Incorporadora Ltda.</strong>
          <br />
          Privacidade e atendimento:{" "}
          <a href="mailto:estrelaincorporadora@gmail.com">
            estrelaincorporadora@gmail.com
          </a>
          .
        </p>
      </section>
    </LegalPage>
  );
}
