require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const questoes2022 = [
  {
    materia: "Português",
    dificuldade: "Médio",
    enunciado: `[ENEM 2022 - Q1]\n\nAs my official bio reads, I was made in Cuba, assembled in Spain, and imported to the United States — meaning my mother, seven months pregnant, and the rest of my family arrived as exiles from Cuba to Madrid, where I was born. Less than two months later, we emigrated once more and settled in New York City, then eventually in Miami, where I was raised and educated. Although technically we lived in the United States, the Cuban community was culturally insular in Miami during the 1970s, bonded together by the trauma of exile. What’s more, it seemed that practically everyone was Cuban: my teachers, my classmates, the mechanic, the bus driver. I didn’t grow up feeling different or treated as a minority. The few kids who got picked on in my grade school were the ones with freckles and funny last names like Dawson and O’Neil.\nBLANCO, R. Disponível em: http://edition.cnn.com. Acesso em: 9 dez. 2017 (adaptado).\n\nAo relatar suas vivências, o autor destaca o(a):`,
    alternativas: [
      "qualidade da educação formal em Miami.",
      "prestígio da cultura cubana nos Estados Unidos.",
      "oportunidade de qualificação profissional em Miami.",
      "cenário da integração de cubanos nos Estados Unidos.",
      "fortalecimento do elo familiar em comunidades estadunidenses."
    ],
    correta: 3, // D
    explicacaoIA: "A alternativa correta é a (D). O autor narra o processo de acolhimento e a formação da comunidade insular de exilados cubanos em Miami nos anos 1970."
  },
  {
    materia: "Português",
    dificuldade: "Médio",
    enunciado: `[ENEM 2022 - Q2]\n\nTwo hundred years ago, Jane Austen lived in a world where single men boasted vast estates; single ladies were expected to speak several languages, sing and play the piano. In both cases, it was, of course, advantageous if you looked good too. So, how much has — or hasn’t — changed? Dating apps opaquely outline the demands of today’s relationship market; users ruminate long and hard over their choice of pictures and what they write in their biographies to hook in potential lovers, and that’s just your own profile. What do you look for in a future partner’s profile — potential signifiers of a popular personality, a good job, a nice car? These apps are a poignant reminder of the often classist attitudes we still adopt, as well as the financial and aesthetic expectations we demand from potential partners.\nGALER, S. Disponível em: www.bbc.com. Acesso em: 8 dez. 2017 (adaptado).\n\nO texto aborda relações interpessoais com o objetivo de:`,
    alternativas: [
      "problematizar o papel de gênero em casamentos modernos.",
      "apontar a relevância da educação formal na escolha de parceiros.",
      "comparar a expectativa de parceiros amorosos em épocas distintas.",
      "discutir o uso de aplicativos para proporcionar encontros românticos.",
      "valorizar a importância da aparência física na seleção de pretendentes."
    ],
    correta: 2, // C
    explicacaoIA: "A alternativa correta é a (C). O texto traça um paralelo entre o padrão da época de Jane Austen e o comportamento contemporâneo em aplicativos de namoro."
  },
  {
    materia: "Português",
    dificuldade: "Fácil",
    enunciado: `[ENEM 2022 - Q4]\n\nA Teen’s View of Social Media\nInstagram is made up of all photos and videos. There is the home page that showcases the posts from people you follow, an explore tab which offers posts from accounts all over the world, and your own page, with a notification tab to show who likes and comments on your posts.\nIt has some downsides though. It is known to make many people feel insecure or down about themselves because the platform showcases the highlights of everyone’s lives, while rarely showing the negatives. This can make one feel like their life is not going as well as others, contributing to the growing rates of anxiety or depression in many teens today. There is an underlying desire for acceptance through the number of likes or followers one has.\nDisponível em: https://cyberbullying.org. Acesso em: 29 out. 2021.\n\nO termo “downsides” introduz a ideia de que o Instagram é responsável por:`,
    alternativas: [
      "oferecer recursos de fotografia.",
      "divulgar problemas dos usuários.",
      "estimular aceitação dos seguidores.",
      "provocar ansiedade nos adolescentes.",
      "aproximar pessoas ao redor do mundo."
    ],
    correta: 3, // D
    explicacaoIA: "A alternativa correta é a (D). O autor destaca os 'downsides' (pontos negativos), associando o uso das redes ao aumento de insegurança e ansiedade entre os jovens."
  },
  {
    materia: "Português",
    dificuldade: "Médio",
    enunciado: `[ENEM 2022 - Q5]\n\nI tend the mobile now\nlike an injured bird\nWe text, text, text\nour significant words.\nI re-read your first,\nyour second, your third,\nLook for your small xx,\nfeeling absurd.\nThe codes we send\narrive with a broken chord.\nI try to picture your hands,\ntheir image is blurred.\nNothing my thumbs press\nwill ever be heard.\nDUFFY, C. Disponível em: www.independent.co.uk. Acesso em: 27 out. 2021.\n\nNesse poema, o eu lírico evidencia um sentimento de:`,
    alternativas: [
      "contentamento com a interação virtual.",
      "zelo com o envio de mensagens.",
      "preocupação com a composição de textos.",
      "mágoa com o comportamento de alguém.",
      "insatisfação com uma forma de comunicação."
    ],
    correta: 4, // E
    explicacaoIA: "A alternativa correta é a (E). O eu lírico demonstra a frieza e o vazio da comunicação por mensagens ('Nothing my thumbs press will ever be heard')."
  },
  {
    materia: "Português",
    dificuldade: "Médio",
    enunciado: `[ENEM 2022 - Q6]\n\nUrgência emocional\nSe tudo é para ontem, se a vida engata uma primeira e sai em disparada, se não há mais tempo para paradas estratégicas, caímos fatalmente no vício de querer que os amores sejam igualmente resolvidos num átimo de segundo. Temos pressa para ouvir “eu te amo”. Não vemos a hora de que fiquem estabelecidas as regras de convívio: somos namorados, ficantes, casados, amantes? Urgência emocional. Uma cilada. Associamos diversas palavras ao AMOR: paixão, romance, sexo, adrenalina, palpitação. Esquecemos, no entanto, da palavra que viabiliza esse sentimento: “paciência”. Amor sem paciência não vinga. Amor não pode ser mastigado e engolido com emergência, com fome desesperada. É uma refeição que pode durar uma vida.\nMEDEIROS, M. Disponível em: http://porumavidasimples.blogspot.com.br. Acesso em: 20 ago. 2017 (adaptado).\n\nNesse texto de opinião, as marcas linguísticas revelam uma situação distensa e de pouca formalidade, o que se evidencia pelo(a):`,
    alternativas: [
      "impessoalização ao longo do texto, como em: “se não há mais tempo”.",
      "construção de uma atmosfera de urgência, em palavras como: “pressa”.",
      "repetição de uma determinada estrutura sintática, como em: “Se tudo é para ontem”.",
      "ênfase no emprego da hipérbole, como em: “uma refeição que pode durar uma vida”.",
      "emprego de metáforas, como em: “a vida engata uma primeira e sai em disparada”."
    ],
    correta: 4, // E
    explicacaoIA: "A alternativa correta é a (E). A linguagem informal e expressiva da crônica utiliza metáforas do cotidiano ('engata uma primeira e sai em disparada')."
  },
  {
    materia: "Português",
    dificuldade: "Fácil",
    enunciado: `[ENEM 2022 - Q8]\n\nÉ ruivo? Tem olhos azuis? É homem ou mulher? Usa chapéu? Quem jogou Cara a Cara na infância sabe de cor o roteiro de perguntas para adivinhar quem é o personagem misterioso do seu oponente.\nAgora, o jogo está prestes a ganhar uma nova versão. A designer polonesa Zuzia Kozerska-Girard está desenvolvendo uma variação do Guess Who? (nome do Cara a Cara em inglês), em que as personalidades do tabuleiro são, na verdade, mulheres notáveis da história e da atualidade, como a artista Frida Kahlo, a ativista Malala Yousafzai, a astronauta Valentina Tereshkova e a aviadora Amelia Earhart. O Who’s She? (“Quem é ela?”, em português) traz, no total, 28 mulheres que representam diversas profissões, nacionalidades e idades.\nA ideia é que, em vez de perguntar sobre a aparência das personagens, as questões sejam direcionadas aos feitos delas: ganhou algum Nobel, fez alguma descoberta? Para cada personagem há um cartão com fatos divertidos e interessantes sobre sua vida.\nDisponível em: www.super.abril.com.br. Acesso em: 4 dez. 2018 (adaptado).\n\nAo divulgar a adaptação do jogo para questões relativas a ações e habilidades de mulheres notáveis, o texto busca:`,
    alternativas: [
      "contribuir para a formação cidadã dos jogadores.",
      "refutar modelos estereotipados de beleza e elegância.",
      "estimular a competitividade entre potenciais compradores.",
      "exemplificar estratégias de arrecadação financeira pela internet.",
      "desenvolver conhecimentos lúdicos específicos dos tempos atuais."
    ],
    correta: 0, // A
    explicacaoIA: "A alternativa correta é a (A). O jogo foca nos feitos, profissões e conquistas históricas das mulheres, fomentando a conscientização e formação cidadã."
  },
  {
    materia: "Português",
    dificuldade: "Médio",
    enunciado: `[ENEM 2022 - Q10]\n\nCiente de que, no campo da criação, as inovações tecnológicas abrem amplo leque de possibilidades — ao permitir, e mesmo estimular, que o artista explore a fundo, em seu processo criativo, questões como a aleatoriedade, o acaso, a não linearidade e a hipermídia —, Leo Cunha comenta que, no que tange ao campo da divulgação, as alternativas são ainda mais evidentes: “Afinal, é imensa a capacidade de reprodução, multiplicação e compartilhamento das obras artísticas/culturais. Ao mesmo tempo, ganham dimensão os dilemas envolvidos com a questão da autoria, dos direitos autorais, da reprodução e intervenção não autorizadas, entre outras questões”.\nSILVA JR., M. G. Movidas pela dúvida. Minas faz Ciências, n. 52, dez.-fev. 2013 (adaptado).\n\nSegundo os autores citados no texto, a expansão de possibilidades no campo das manifestações artísticas promovida pela internet pode pôr em risco o(a):`,
    alternativas: [
      "sucesso dos artistas.",
      "valorização dos suportes.",
      "proteção da produção estética.",
      "modo de distribuição de obras.",
      "compartilhamento das obras artísticas."
    ],
    correta: 2, // C
    explicacaoIA: "A alternativa correta é a (C). A facilidade de reprodução digital traz dilemas quanto aos direitos autorais e à proteção da propriedade e integridade da produção estética."
  },
  {
    materia: "Português",
    dificuldade: "Difícil",
    enunciado: `[ENEM 2022 - Q11]\n\nOra, sempre que surge uma nova técnica, ela quer demonstrar que revogará as regras e coerções que presidiram o nascimento de todas as outras invenções do passado. Ela se pretende orgulhosa e única. Como se a nova técnica carreasse com ela, automaticamente, para seus novos usuários, uma propensão natural a fazer economia de qualquer aprendizagem. Como se ela se preparasse para varrer tudo que a precedeu, ao mesmo tempo transformando em analfabetos todos os que ousassem repeli-la.\nFui testemunha dessa mudança ao longo de toda a minha vida. Ao passo que, na realidade, é o contrário que acontece. Cada nova técnica exige uma longa iniciação numa nova linguagem, ainda mais longa na medida em que nosso espírito é formatado pela utilização das linguagens que precederam o nascimento da recém-chegada.\nECO, U.; CARRIÈRE, J.-C. Não contem com o fim do livro. Rio de Janeiro: Record, 2010 (adaptado).\n\nO texto revela que, quando a sociedade promove o desenvolvimento de uma nova técnica, o que mais impacta seus usuários é a:`,
    alternativas: [
      "dificuldade na apropriação da nova linguagem.",
      "valorização da utilização da nova tecnologia.",
      "recorrência das mudanças tecnológicas.",
      "suplantação imediata dos conhecimentos prévios.",
      "rapidez no aprendizado do manuseio das novas invenções."
    ],
    correta: 0, // A
    explicacaoIA: "A alternativa correta é a (A). Umberto Eco argumenta que qualquer inovação exige um esforço demorado de aprendizado e apropriação de novos códigos."
  },
  {
    materia: "Português",
    dificuldade: "Fácil",
    enunciado: `[ENEM 2022 - Q12]\n\nPapos\n— Me disseram...\n— Disseram-me.\n— Hein?\n— O correto é “disseram-me”. Não “me disseram”.\n— Eu falo como quero. E te digo mais... Ou é “digo-te”?\n— O quê?\n— Digo-te que você...\n— O “te” e o “você” não combinam.\n— Lhe digo?\n— Também não. O que você ia me dizer?\n— Que você está sendo grosseiro, pedante e chato. [...]\n— Dispenso as suas correções. Vê se esquece-me. Falo como bem entender. Mais uma correção e eu...\n— O quê?\n— O mato.\n— Que mato?\n— Mato-o. Mato-lhe. Mato você. Matar-lhe-ei-te. Ouviu bem? Pois esqueça-o e para-te. Pronome no lugar certo é elitismo!\n— Se você prefere falar errado...\n— Falo como todo mundo fala. O importante é me entenderem. Ou entenderem-me?\nVERISSIMO, L. F. Comédias para se ler na escola. Rio de Janeiro: Objetiva, 2001 (adaptado).\n\nNesse texto, o uso da norma-padrão defendido por um dos personagens torna-se inadequado em razão do(a):`,
    alternativas: [
      "falta de compreensão causada pelo choque entre gerações.",
      "contexto de comunicação em que a conversa se dá.",
      "grau de polidez distinto entre os interlocutores.",
      "diferença de escolaridade entre os falantes.",
      "nível social dos participantes da situação."
    ],
    correta: 1, // B
    explicacaoIA: "A alternativa correta é a (B). Em um diálogo informal e espontâneo entre conhecidos, a exigência hipercorretiva da norma culta formal quebra a fluidez do contexto comunicativo."
  },
  {
    materia: "Português",
    dificuldade: "Médio",
    enunciado: `[ENEM 2022 - Q13]\n\nSão vários os fatores, internos e externos, que influenciam os hábitos das pessoas no acesso à internet, assim como nas práticas culturais realizadas na rede.\nA utilização das tecnologias de informação e comunicação está diretamente relacionada aos aspectos como: conhecimento de seu uso, acesso à linguagem letrada, nível de instrução, escolaridade, letramento digital etc. Os que detêm tais recursos (os mais escolarizados) são os que mais acessam a rede e também os que possuem maior índice de acumulatividade das práticas. A análise dos dados nos possibilita dizer que a falta de acesso à rede repete as mesmas adversidades e exclusões já verificadas na sociedade brasileira no que se refere a analfabetos, menos escolarizados, negros, população indígena e desempregados. Isso significa dizer que a internet, se não produz diretamente a exclusão, certamente a reproduz, tendo em vista que os que mais a acessam são justamente os mais jovens, escolarizados, remunerados, trabalhadores qualificados, homens e brancos.\nSILVA, F. A. B.; ZIVIANE, P.; GHEZZI, D. R. As tecnologias digitais e seus usos. Brasília; Rio de Janeiro: Ipea, 2019 (adaptado).\n\nAo analisarem a correlação entre os hábitos e o perfil socioeconômico dos usuários da internet no Brasil, os pesquisadores:`,
    alternativas: [
      "apontam o desenvolvimento econômico como solução para ampliar o uso da rede.",
      "questionam a crença de que o acesso à informação é igualitário e democrático.",
      "afirmam que o uso comercial da rede é a causa da exclusão de minorias.",
      "refutam o vínculo entre níveis de escolaridade e dificuldade de acesso.",
      "condicionam a expansão da rede à elaboração de políticas inclusivas."
    ],
    correta: 1, // B
    explicacaoIA: "A alternativa correta é a (B). Os dados do Ipea mostram que a internet reproduz as desigualdades históricas, desmistificando o mito de acesso plenamente democrático."
  },
  {
    materia: "Português",
    dificuldade: "Médio",
    enunciado: `[ENEM 2022 - Q14]\n\nTEXTO I\nA língua não é uma nomenclatura, que se apõe a uma realidade pré-categorizada, ela é que classifica a realidade. No léxico, percebe-se, de maneira mais imediata, o fato de que a língua condensa as experiências de um dado povo.\nFIORIN, J. L. Língua, modernidade e tradição. Diversitas, n. 2, mar.-set. 2014.\n\nTEXTO II\nAs expressões coloquiais ainda estão impregnadas de discriminação contra os negros. Basta recordar algumas delas, como passar um “dia negro”, ter um “lado negro”, ser a “ovelha negra” da família ou praticar “magia negra”.\nDisponível em: https://brasil.elpais.com. Acesso em: 22 maio 2018.\n\nO Texto II exemplifica o que se afirma no Texto I, na medida em que defende a ideia de que as escolhas lexicais são resultantes de um:`,
    alternativas: [
      "expediente próprio do sistema linguístico que nos apresenta diferentes possibilidades para traduzir estados de coisas.",
      "ato inventivo de nomear novas realidades que surgem diante de uma comunidade de falantes de uma língua.",
      "mecanismo de apropriação de formas linguísticas que estão no acervo da formação do idioma nacional.",
      "processo de incorporação de preconceitos que são recorrentes na história de uma sociedade.",
      "recurso de expressão marcado pela objetividade que se requer na comunicação diária."
    ],
    correta: 3, // D
    explicacaoIA: "A alternativa correta é a (D). As expressões mostram como a língua reflete e cristaliza preconceitos raciais historicamente enraizados na cultura."
  },
  {
    materia: "Português",
    dificuldade: "Médio",
    enunciado: `[ENEM 2022 - Q16]\n\nEla era linda. Gostava de dançar, fazia teatro em São Paulo e sonhava ser atriz em Hollywood. Tinha 13 anos quando ganhou uma câmera de vídeo — e uma irmã. As duas se tornaram suas companheiras de experimentações. Adolescente, Elena vivia a criar filminhos e se empenhava em dirigir a pequena Petra nas cenas que inventava. [...] No início de 1990, Elena tinha 20 anos quando se mudou para Nova York para cursar artes cênicas e batalhar uma chance no mercado americano. Deslocada, ansiosa, frustrada após alguns testes de elenco malsucedidos, decepcionada com a ausência de reconhecimento e vitimada por uma depressão que se agravava com a falta de perspectivas, Elena pôs fim à vida no segundo semestre. Petra tinha 7 anos. Vinte anos depois, é ela, a irmã caçula, que volta a Nova York para percorrer os últimos passos da irmã, vasculhar seus arquivos e transformar suas memórias em imagem e poesia.\nElena é um filme sobre a irmã que parte e sobre a irmã que fica. É um filme sobre a busca, a perda, a saudade, mas também sobre o encontro, o legado, a memória. Um filme sobre a Elena de Petra e sobre a Petra de Elena, sobre o que ficou de uma na outra e, essencialmente, um filme sobre a delicadeza.\nVANUCHI, C. Época, 19 out. 2012 (adaptado).\n\nO texto é exemplar de um gênero discursivo que cumpre a função social de:`,
    alternativas: [
      "narrar, por meio de imagem e poesia, cenas da vida das irmãs Petra e Elena.",
      "descrever, por meio das memórias de Petra, a separação de duas irmãs.",
      "sintetizar, por meio das principais cenas do filme, a história de Elena.",
      "lançar, por meio da história de vida do autor, um filme autobiográfico.",
      "avaliar, por meio de análise crítica, o filme em referência."
    ],
    correta: 4, // E
    explicacaoIA: "A alternativa correta é a (E). O texto trata-se de uma resenha crítica cinematográfica, apresentando a sinopse e apreciando os méritos poéticos e sensíveis da obra."
  },
  {
    materia: "Português",
    dificuldade: "Fácil",
    enunciado: `[ENEM 2022 - Q17]\n\nPALAVRA – As gramáticas classificam as palavras em substantivo, adjetivo, verbo, advérbio, conjunção, pronome, numeral, artigo e preposição. Os poetas classificam as palavras pela alma porque gostam de brincar com elas, e para brincar com elas é preciso ter intimidade primeiro. É a alma da palavra que define, explica, ofende ou elogia, se coloca entre o significante e o significado para dizer o que quer, dar sentimento às coisas, fazer sentido. A palavra nuvem chove. A palavra triste chora. A palavra sono dorme. A palavra tempo passa. A palavra fogo queima. A palavra faca corta. A palavra carro corre. A palavra “palavra” diz. O que quer. E nunca desdiz depois. As palavras têm corpo e alma, mas são diferentes das pessoas em vários pontos. As palavras dizem o que querem, está dito, e pronto.\nFALCÃO, A. Pequeno dicionário de palavras ao vento. São Paulo: Salamandra, 2013 (adaptado).\n\nEsse texto, que simula um verbete para a palavra “palavra’’, constitui-se como um poema porque:`,
    alternativas: [
      "tematiza o fazer poético, como em “Os poetas classificam as palavras pela alma”.",
      "utiliza o recurso expressivo da metáfora, como em “As palavras têm corpo e alma”.",
      "valoriza a gramática da língua, como em “substantivo, adjetivo, verbo, advérbio, conjunção”.",
      "estabelece comparações, como em “As palavras têm corpo e alma, mas são diferentes das pessoas”.",
      "apresenta informações pertinentes acerca do conceito de “palavra”, como em “As gramáticas classificam as palavras”."
    ],
    correta: 1, // B
    explicacaoIA: "A alternativa correta é a (B). A dimensão poética e literária se apoia na linguagem conotativa e no uso marcante da metáfora atribuindo vida às palavras."
  },
  {
    materia: "Português",
    dificuldade: "Difícil",
    enunciado: `[ENEM 2022 - Q18]\n\nMorte lenta ao luso infame que inventou a calçada portuguesa. Maldito D. Manuel I e sua corja de tenentes Eusébios. Quadrados de pedregulho irregular socados à mão. À mão! É claro que ia soltar, ninguém reparou que ia soltar? Branco, preto, branco, preto, as ondas do mar de Copacabana. De que me servem as ondas do mar de Copacabana? Me deem chão liso, sem protuberâncias calcárias. Mosaico estúpido. Mania de mosaico. Joga concreto em cima e aplaina. Buraco, cratera, pedra solta, bueiro-bomba. Depois dos setenta, a vida se transforma numa interminável corrida de obstáculos.\nA queda é a maior ameaça para o idoso. “Idoso”, palavra odienta. Pior, só “terceira idade”. A queda separa a velhice da senilidade extrema. O tombo destrói a cadeia que liga a cabeça aos pés. Adeus, corpo. Em casa, vou de corrimão em corrimão, tateio móveis e paredes, e tomo banho sentado. Da poltrona para a janela, da janela para a cama, da cama para a poltrona, da poltrona para a janela. Olha aí, outra vez, a pedrinha traiçoeira atrás de me pegar. Um dia eu caio, hoje não.\nTORRES, F. Fim. São Paulo: Cia. das Letras, 2013.\n\nO recurso que caracteriza a organização estrutural desse texto é o(a):`,
    alternativas: [
      "justaposição de sequências verbais e nominais.",
      "mudança de eventos resultante do jogo temporal.",
      "uso de adjetivos qualificativos na descrição do cenário.",
      "encadeamento semântico pelo uso de substantivos sinônimos.",
      "inter-relação entre orações por elementos linguísticos lógicos."
    ],
    correta: 0, // A
    explicacaoIA: "A alternativa correta é a (A). O narrador encadeia pensamentos por frases curtas e termos nominais justapostos, transmitindo a urgência e o ritmo ofegante da mente do personagem."
  },
  {
    materia: "Português",
    dificuldade: "Médio",
    enunciado: `[ENEM 2022 - Q19]\n\nPisoteamento, arrastão, empurra-empurra, agressões, vandalismo e até furto a um torcedor que estava caído no asfalto após ser atropelado nas imediações do estádio do Maracanã. As cenas de selvageria tiveram como estopim a invasão de milhares de torcedores sem ingresso, que furaram o bloqueio policial e transformaram o estádio em terra de ninguém. Um reflexo não só do quadro de insegurança que assola o Rio de Janeiro, mas também de como a violência social se embrenha pelo esporte mais popular do país. Em 2017, foram registrados 104 episódios de violência no futebol brasileiro, que resultaram em 11 mortes de torcedores. [...] “É impossível dissociar a escalada de violência no futebol do panorama de desordem pública, social, econômica e política vivida pelo país”, de acordo com um doutor em sociologia do esporte.\nDisponível em: https://brasil.elpais.com. Acesso em: 22 jun. 2019 (adaptado).\n\nNesse texto, a violência no futebol está caracterizada como um(a):`,
    alternativas: [
      "problema social localizado numa região do país.",
      "desafio para as torcidas organizadas dos clubes.",
      "reflexo da precariedade da organização social no país.",
      "inadequação de espaço nos estádios para receber o público.",
      "consequência da insatisfação dos clubes com a organização dos jogos."
    ],
    correta: 2, // C
    explicacaoIA: "A alternativa correta é a (C). A análise sociológica aponta que os episódios no estádio são reflexos diretos das mazelas estruturais e sociais mais amplas da sociedade brasileira."
  },
  {
    materia: "Português",
    dificuldade: "Médio",
    enunciado: `[ENEM 2022 - Q21]\n\nA escrava\n— Admira-me —, disse uma senhora de sentimentos sinceramente abolicionistas —; faz-me até pasmar como se possa sentir, e expressar sentimentos escravocratas, no presente século, no século dezenove! A moral religiosa e a moral cívica aí se erguem, e falam bem alto esmagando a hidra que envenena a família no mais sagrado santuário seu, e desmoraliza, e avilta a nação inteira! Levantai os olhos ao Gólgota, ou percorrei-os em torno da sociedade, e dizei-me:\n— Para que se deu em sacrifício o Homem Deus, que ali exalou seu derradeiro alento? Ah! Então não é verdade que seu sangue era o resgate do homem! É então uma mentira abominável ter esse sangue comprado a liberdade!? E depois, olhai a sociedade... Não vedes o abutre que a corrói constantemente!… Não sentis a desmoralização que a enerva, o cancro que a destrói?\nPor qualquer modo que encaremos a escravidão, ela é, e será sempre um grande mal. Dela a decadência do comércio; porque o comércio e a lavoura caminham de mãos dadas, e o escravo não pode fazer florescer a lavoura; porque o seu trabalho é forçado.\nREIS, M. F. Úrsula e outras obras. Brasília: Câmara dos Deputados, 2018.\n\nInscrito na estética romântica da literatura brasileira, o conto descortina aspectos da realidade nacional no século XIX ao:`,
    alternativas: [
      "revelar a imposição de crenças religiosas a pessoas escravizadas.",
      "apontar a hipocrisia do discurso conservador na defesa da escravidão.",
      "sugerir práticas de violência física e moral em nome do progresso material.",
      "relacionar o declínio da produção agrícola e comercial a questões raciais.",
      "ironizar o comportamento dos proprietários de terra na exploração do trabalho."
    ],
    correta: 1, // B
    explicacaoIA: "A alternativa correta é a (B). Maria Firmina dos Reis, primeira romancista negra brasileira, confronta os argumentos pretensamente morais e cristãos usados para justificar a escravatura."
  },
  {
    materia: "Português",
    dificuldade: "Fácil",
    enunciado: `[ENEM 2022 - Q24]\n\nO complexo de falar difícil\nO que importa realmente é que o(a) detentor(a) do notável saber jurídico saiba quando e como deve fazer uso desse português versão 2.0, até porque não tem necessidade de alguém entrar numa padaria de manhã com aquela cara de sono falando o seguinte: “Por obséquio, Vossa Senhoria teria a hipotética possibilidade de estabelecer com minha pessoa uma relação de compra e venda, mediante as imposições dos códigos Civil e do Consumidor, para que seja possível a obtenção de 10 pãezinhos em temperatura estável para que a relação pecuniária no valor de R$ 5,00 seja plenamente legítima e capaz de saciar minha fome matinal?”.\nO problema é que temos uma cultura de valorizar quem demonstra ser inteligente ao invés de valorizar quem é. [...]\nARAÚJO, H. Disponível em: www.diariojurista.com. Acesso em: 20 nov. 2021 (adaptado).\n\nNesse artigo de opinião, ao fazer uso de uma fala rebuscada no exemplo da compra do pão, o autor evidencia a importância de(a):`,
    alternativas: [
      "se ter um notável saber jurídico.",
      "valorização da inteligência do falante.",
      "falar difícil para demonstrar inteligência.",
      "coesão e da coerência em documentos jurídicos.",
      "adequação da linguagem à situação de comunicação."
    ],
    correta: 4, // E
    explicacaoIA: "A alternativa correta é a (E). A eficácia linguística exige adequação da linguagem ao contexto e aos interlocutores, evitando jargões descabidos no dia a dia."
  },
  {
    materia: "Português",
    dificuldade: "Médio",
    enunciado: `[ENEM 2022 - Q26]\n\nAssentamento\nZanza daqui / Zanza pra acolá / Fim de feira, periferia afora / A cidade não mora mais em mim / Francisco, Serafim / Vamos embora\nVer o capim / Ver o baobá / Vamos ver a campina quando flora / A piracema, rios contravim / Binho, Bel, Bia, Quim / Vamos embora\nQuando eu morrer / Cansado de guerra / Morro de bem / Com a minha terra:\nCana, caqui / Inhame, abóbora / Onde só vento se semeava outrora / Amplidão, nação, sertão sem fim / Ó Manuel, Miguilim / Vamos embora\nBUARQUE, C. As cidades. Rio de Janeiro: RCA, 1998 (fragmento).\n\nNesse texto, predomina a função poética da linguagem. Entretanto, a função emotiva pode ser identificada no verso:`,
    alternativas: [
      "“Zanza pra acolá”.",
      "“Fim de feira, periferia afora”.",
      "“A cidade não mora mais em mim”.",
      "“Onde só vento se semeava outrora”.",
      "“Ó Manuel, Miguilim”."
    ],
    correta: 2, // C
    explicacaoIA: "A alternativa correta é a (C). A função emotiva (ou expressiva) centra-se no sentimento do emissor ('A cidade não mora mais em mim')."
  },
  {
    materia: "Português",
    dificuldade: "Difícil",
    enunciado: `[ENEM 2022 - Q29]\n\nEsaú e Jacó\nBárbara entrou, enquanto o pai pegou da viola e passou ao patamar de pedra, à porta da esquerda. Era uma criaturinha leve e breve, saia bordada, chinelinha no pé. Não se lhe podia negar um corpo airoso. Os cabelos, apanhados no alto da cabeça por um pedaço de fita enxovalhada, faziam-lhe um solidéu natural, cuja borla era suprida por um raminho de arruda. Já vai nisto um pouco de sacerdotisa. O mistério estava nos olhos. Estes eram opacos, não sempre nem tanto que não fossem também lúcidos e agudos, e neste último estado eram igualmente compridos; tão compridos e tão agudos que entravam pela gente abaixo, revolviam o coração e tornavam cá fora, prontos para nova entrada e outro revolvimento. Não te minto dizendo que as duas sentiram tal ou qual fascinação. Bárbara interrogou-as; Natividade disse ao que vinha e entregou-lhe os retratos dos filhos e os cabelos cortados, por lhe haverem dito que bastava.\n— Basta, confirmou Bárbara. Os meninos são seus filhos?\n— São.\nASSIS, M. Obra completa. Rio de Janeiro: Nova Aguilar, 1994.\n\nNo relato da visita de duas mulheres ricas a uma vidente no Morro do Castelo, a ironia — um dos traços mais representativos da narrativa machadiana — consiste no:`,
    alternativas: [
      "modo de vestir dos moradores do morro carioca.",
      "senso prático em relação às oportunidades de renda.",
      "mistério que cerca as clientes de práticas de vidência.",
      "misto de singeleza e astúcia dos gestos da personagem.",
      "interesse do narrador pelas figuras femininas ambíguas."
    ],
    correta: 3, // D
    explicacaoIA: "A alternativa correta é a (D). Machado constrói a figura de Bárbara combinando traços de humildade simples com uma agudeza perspicaz e astuta diante das ricas clientes."
  },
  {
    materia: "Português",
    dificuldade: "Médio",
    enunciado: `[ENEM 2022 - Q31]\n\nEra o êxodo da seca de 1898. Uma ressurreição de cemitérios antigos — esqueletos redivivos, com o aspecto terroso e o fedor das covas podres. \nOs fantasmas estropiados como que iam dançando, de tão trôpegos e trêmulos, num passo arrastado de quem leva as pernas, em vez de ser levado por elas. \nAndavam devagar, olhando para trás, como quem quer voltar. Não tinham pressa em chegar, porque não sabiam aonde iam. Expulsos de seu paraíso por espadas de fogo, iam, ao acaso, em descaminhos, no arrastão dos maus fados. \nFugiam do sol e o sol guiava-os nesse forçado nomadismo.\nAdelgaçados na magreira cômica, cresciam, como se o vento os levantasse. E os braços afinados desciam-lhes aos joelhos, de mãos abanando.\nVinham escoteiros. Menos os hidrópicos — de ascite consecutiva à alimentação tóxica — com os fardos das barrigas alarmantes.\nNão tinham sexo, nem idade, nem condição nenhuma. Eram os retirantes. Nada mais.\nALMEIDA, J. A. A bagaceira. Rio de Janeiro: J. Olympio, 1978.\n\nOs recursos composicionais que inserem a obra no chamado “Romance de 30” da literatura brasileira manifestam-se aqui no(a):`,
    alternativas: [
      "desenho cru da realidade dramática dos retirantes.",
      "indefinição dos espaços para efeito de generalização.",
      "análise psicológica da reação dos personagens à seca.",
      "engajamento político do narrador ante as desigualdades.",
      "contemplação lírica da paisagem transformada em alegoria."
    ],
    correta: 0, // A
    explicacaoIA: "A alternativa correta é a (A). O romance regionalista de 30 destaca-se pela crueza documental e denúncia do sofrimento humano imposto pela seca no sertão nordestino."
  },
  {
    materia: "Português",
    dificuldade: "Fácil",
    enunciado: `[ENEM 2022 - Q35]\n\nSer cronista\nSei que não sou, mas tenho meditado ligeiramente no assunto.\nCrônica é um relato? É uma conversa? É um resumo de um estado de espírito? Não sei, pois antes de começar a escrever para o Jornal do Brasil, eu só tinha escrito romances e contos.\nE também sem perceber, à medida que escrevia para aqui, ia me tornando pessoal demais, correndo o risco de em breve publicar minha vida passada e presente, o que não pretendo. Outra coisa notei: basta eu saber que estou escrevendo para o jornal, isto é, para algo aberto facilmente por todo o mundo, e não para um livro, que só é aberto por quem realmente quer, para que, sem mesmo sentir, o modo de escrever se transforme. [...] Mas mudar só porque isso é uma coluna ou uma crônica? Ser mais leve só porque o leitor assim o quer? Divertir? Fazer passar uns minutos de leitura? E outra coisa: nos meus livros quero profundamente a comunicação profunda comigo e com o leitor. Aqui no jornal apenas falo com o leitor e agrada-me que ele fique agradado. Vou dizer a verdade: não estou contente.\nLISPECTOR, C. In: A descoberta do mundo. Rio de Janeiro: Rocco, 1999.\n\nNo texto, ao refletir sobre a atividade de cronista, a autora questiona características do gênero crônica, como:`,
    alternativas: [
      "relação distanciada entre os interlocutores.",
      "articulação de vários núcleos narrativos.",
      "brevidade no tratamento da temática.",
      "descrição minuciosa dos personagens.",
      "público leitor exclusivo."
    ],
    correta: 2, // C
    explicacaoIA: "A alternativa correta é a (C). Clarice problematiza a leveza, a brevidade e o compromisso da crônica em entreter rapidamente o leitor de jornal."
  },
  {
    materia: "Português",
    dificuldade: "Fácil",
    enunciado: `[ENEM 2022 - Q37]\n\n“Vida perfeita” em redes sociais pode afetar a saúde mental\nNas várias redes sociais que povoam a internet, os chamados digital influencers estão sempre felizes e pregam a felicidade como um estilo de vida. Essas pessoas espalham conteúdo para milhares de seguidores, ditando tendência e mostrando um estilo de vida sonhado por muitos, como o corpo esbelto, viagens incríveis, casas deslumbrantes, carros novos e alegria em tempo integral, algo bem improvável de ocorrer o tempo todo, aponta Carla Furtado, mestre em psicologia e fundadora do Instituto Feliciência.\nA problemática pode surgir com a busca incessante por essa felicidade, que gera efeitos colaterais em quem consome diariamente a “vida perfeita” de outros. Daí vem o conceito de positividade tóxica: a expressão tem sido usada para abordar uma espécie de pressão pela adoção de um discurso positivo, aliada a uma vida editada para as redes sociais.\nDisponível em: https://agenciabrasil.ebc.com.br. Acesso em: 21 nov. 2021 (adaptado).\n\nAssociada ao ideário de uma “vida perfeita”, a positividade tóxica mencionada no texto é um fenômeno social recente, que se constitui com base em:`,
    alternativas: [
      "representações estereotipadas e superficiais de felicidade.",
      "ressignificações contemporâneas do conceito de alegria.",
      "estilos de vida inacessíveis para a sociedade brasileira.",
      "atitudes contraditórias de influenciadores digitais.",
      "padrões idealizados e nocivos de beleza física."
    ],
    correta: 0, // A
    explicacaoIA: "A alternativa correta é a (A). O conceito de positividade tóxica origina-se da reprodução de vidas fictícias e ideais inatingíveis de eterna alegria nas redes."
  },
  {
    materia: "História",
    dificuldade: "Médio",
    enunciado: `[ENEM 2022 - Q46]\n\nEspera, resignado, o dia 13 daquele mês porque, em tal data, usança avoenga lhe faculta sondar o futuro, interrogando a providência. É a experiência tradicional de Santa Luzia. No dia 12 ao anoitecer expõe ao relento, em linha, seis pedrinhas de sal, que representam, em ordem sucessiva da esquerda para a direita, os seis meses vindouros, de janeiro a junho. Ao alvorecer de 13 observa-as: se estão intactas, pressagiam a seca; se a primeira apenas se deliu, transmudada em aljôfar límpido, é certa a chuva em janeiro; se a segunda, em fevereiro; se a maioria ou todas, é inevitável o inverno benfazejo. Esta experiência é belíssima.\nCUNHA, E. Os sertões. São Paulo: Editora Três, 1984.\n\nNo experimento descrito, a relação com a paisagem e com a religiosidade permite que o sertanejo seja:`,
    alternativas: [
      "afeito à devoção ao aceitar destinos sacralizados.",
      "acostumado à pobreza ao admitir acasos naturais.",
      "habituado ao solo ao conhecer terrenos cultiváveis.",
      "íntimo à Caatinga ao interpretar condições ambientais.",
      "próximo à vegetação ao identificar espécies arbustivas."
    ],
    correta: 3, // D
    explicacaoIA: "A alternativa correta é a (D). As 'experiências de Santa Luzia' representam a profunda conexão e leitura que o sertanejo faz da dinâmica climática e ambiental do semiárido."
  },
  {
    materia: "História",
    dificuldade: "Difícil",
    enunciado: `[ENEM 2022 - Q47]\n\nSempre que a relevância do discurso entra em jogo, a questão torna-se política por definição, pois é o discurso que faz do homem um ser político. E tudo que os homens fazem, sabem ou experimentam só tem sentido na medida em que pode ser discutido. Haverá, talvez, verdades que ficam além da linguagem e que podem ser de grande relevância para o homem no singular, isto é, para o homem que, seja o que for, não é um ser político. Mas homens no plural, isto é, os homens que vivem e se movem e agem neste mundo, só podem experimentar o significado das coisas por poderem falar e ser inteligíveis entre si e consigo mesmos.\nARENDT, H. A condição humana. Rio de Janeiro: Forense Universitária, 2004.\n\nNo trecho, a filósofa Hannah Arendt mostra a importância da linguagem no processo de:`,
    alternativas: [
      "entendimento da cultura.",
      "aumento da criatividade.",
      "percepção da individualidade.",
      "melhoria da técnica.",
      "construção da sociabilidade."
    ],
    correta: 4, // E
    explicacaoIA: "A alternativa correta é a (E). Arendt enfatiza que a ação política e a sociabilidade humana dependem do discurso e da vida comunitária compartilhada ('homens no plural')."
  },
  {
    materia: "História",
    dificuldade: "Fácil",
    enunciado: `[ENEM 2022 - Q48]\n\nEu estava pagando o sapateiro e conversando com um preto que estava lendo um jornal. Ele estava revoltado com um guarda civil que espancou um preto e amarrou numa árvore. O guarda civil é branco. E há certos brancos que transforma preto em bode expiatório. Quem sabe se guarda civil ignora que já foi extinta a escravidão e ainda estamos no regime da chibata?\nJESUS, C. M. Quarto de despejo: diário de uma favelada. São Paulo: Ática, 2014.\n\nO texto, que guarda a grafia original da autora, expõe uma característica da sociedade brasileira, que é o(a):`,
    alternativas: [
      "Racismo estrutural.",
      "Desemprego latente.",
      "Concentração de renda.",
      "Exclusão informacional.",
      "Precariedade da educação."
    ],
    correta: 0, // A
    explicacaoIA: "A alternativa correta é a (A). Carolina Maria de Jesus denuncia a persistência da violência policial e da hierarquização racial herdadas do período escravocrata."
  },
  {
    materia: "História",
    dificuldade: "Médio",
    enunciado: `[ENEM 2022 - Q50]\n\nNa construção da ferrovia Madeira-Mamoré, o que dizer dos doentes, eternos moribundos a vagar entre delírios febris, doses de quinino e corredores da morte? O Hospital da Candelária era santuário e túmulo, monumento ao progresso científico e preâmbulo da escuridão. Foi ali, com suas instalações moderníssimas, que médicos e sanitaristas dirigiram seu combate aos males tropicais. As maiores vítimas, contudo, permaneceriam na sombra à margem do palco, cobaias sem consolo, credores sem nome de uma sociedade que não lhes concedera tempo algum para ser decifrada.\nFOOT HARDMAN, F. Trem fantasma: modernidade na selva. São Paulo: Cia. das Letras, 1988 (adaptado).\n\nNo texto, há uma crítica ao modo de ocupação do espaço amazônico pautada na:`,
    alternativas: [
      "discrepância entre engenharia ambiental e equilíbrio da fauna.",
      "incoerência entre maquinaria estrangeira e controle da floresta.",
      "incompatibilidade entre investimento estatal e proteção aos nativos.",
      "competição entre farmacologia internacional e produtos da fitoterapia.",
      "contradição entre desenvolvimento nacional e respeito aos trabalhadores."
    ],
    correta: 4, // E
    explicacaoIA: "A alternativa correta é a (E). A ferrovia Madeira-Mamoré ficou conhecida pelo altíssimo custo humano de milhares de operários mortos por doenças em nome do progresso."
  },
  {
    materia: "Geografia",
    dificuldade: "Médio",
    enunciado: `[ENEM 2022 - Q51]\n\nUma nova economia surgiu em escala global no último quartel do século XX. Chamo-a de informacional, global e em rede para identificar suas características fundamentais e diferenciadas e enfatizar sua interligação. É informacional porque depende basicamente de sua capacidade de gerar, processar e aplicar de forma eficiente a informação baseada em conhecimentos. É global porque seus componentes estão organizados em escala global, diretamente ou mediante uma rede de conexões entre agentes econômicos. É rede porque é feita em uma rede global de interação entre redes empresariais.\nCASTELLS, M. A sociedade em rede — a era da informação: economia, sociedade e cultura. São Paulo: Paz e Terra, 1999 (adaptado).\n\nQual mudança estrutural é resultado da forma de organização econômica descrita no texto?`,
    alternativas: [
      "Fabricação em série.",
      "Ampliação de estoques.",
      "Fragilização dos cartéis.",
      "Padronização de mercadorias.",
      "Desterritorialização da produção."
    ],
    correta: 4, // E
    explicacaoIA: "A alternativa correta é a (E). A globalização e as tecnologias da informação permitiram fragmentar e dispersar geograficamente as etapas produtivas pelo planeta."
  },
  {
    materia: "História",
    dificuldade: "Fácil",
    enunciado: `[ENEM 2022 - Q54]\n\nOs caixeiros do comércio a retalho do Rio de Janeiro estiveram entre as primeiras categorias de trabalhadores a se organizar em associações e a exigir a intervenção dos poderes públicos na mediação de suas lutas por direitos. Na década de 1880, os caixeiros participaram da arena política e ganharam as ruas com vários outros, como os republicanos e os abolicionistas.\nPOPINIGIS, F. “Todas as liberdades são irmãs”: os caixeiros e as lutas dos trabalhadores por direitos entre o Império e a República. Estudos Históricos, n. 59, set.-dez. 2016 (adaptado).\n\nA atuação dos trabalhadores mencionados no texto representou, na capital do Império, um momento de:`,
    alternativas: [
      "manutenção das regras patronais.",
      "desprendimento das ideias liberais.",
      "fortalecimento dos contratos laborais.",
      "consolidação das estruturas sindicais.",
      "contestação dos princípios monárquicos."
    ],
    correta: 4, // E
    explicacaoIA: "A alternativa correta é a (E). A aliança dos caixeiros com o movimento abolicionista e republicano enfraqueceu as bases tradicionais do Império de D. Pedro II."
  },
  {
    materia: "História",
    dificuldade: "Difícil",
    enunciado: `[ENEM 2022 - Q57]\n\nO leproso é visto dentro de uma prática da rejeição, do exílio-cerca; deixa-se que se perca lá dentro como numa massa que não tem muita importância diferenciar; os pestilentos são considerados num policiamento tático meticuloso onde as diferenciações individuais são os efeitos limitantes de um poder que se multiplica, se articula e se subdivide. O grande fechamento por um lado; o bom treinamento por outro. A lepra e sua divisão; a peste e seus recortes. Uma é marcada; a outra, analisada e repartida. O exílio do leproso e a prisão da peste não trazem consigo o mesmo sonho político.\nFOUCAULT, M. Vigiar e punir: nascimento da prisão. Petrópolis: Vozes, 1987.\n\nOs modelos autoritários descritos no texto apontam para um sistema de controle que se baseia no(a):`,
    alternativas: [
      "Formação de sociedade disciplinar.",
      "Flexibilização do regramento social.",
      "Banimento da autoridade repressora.",
      "Condenação da degradação humana.",
      "Hierarquização da burocracia estatal."
    ],
    correta: 0, // A
    explicacaoIA: "A alternativa correta é a (A). Foucault analisa a passagem do isolamento bruto para os dispositivos minuciosos de controle e vigilância que estruturam a sociedade disciplinar moderna."
  },
  {
    materia: "História",
    dificuldade: "Médio",
    enunciado: `[ENEM 2022 - Q58]\n\nTEXTO I\nEm março de 1889, quando apareceram as primeiras romarias atraídas pelos milagres da beata Maria de Araújo, Juazeiro inseriu-se no rol da fundação do espaço religioso. Construía-se mais um centro, como Aparecida do Norte, Canindé ou Lourdes.\nRAMOS, F. R. L. O meio do mundo: território sagrado em Juazeiro do Padre Cícero. Fortaleza: Imprensa Universitária, 2014.\n\nTEXTO II\nNão sabemos ao certo quantas pessoas estavam presentes na capela no momento em que a hóstia sangrou na boca de Maria de Araújo. O Padre Cícero nos conta que o fato surpreendeu não só aos presentes, mas a própria beata parecia atordoada com o ocorrido. O fenômeno continuou acontecendo todas as quartas e sextas na Capela de Nossa Senhora das Dores a partir daquele dia. Os paninhos manchados do sangue que escorria da hóstia e da boca da beata, a princípio, ficaram sob a guarda do Padre Cícero, mas logo foram expostos à visitação pública e, além disso, o sangramento foi proclamado como milagre sem o conhecimento e sem a autorização do bispo diocesano.\nNOBRE, E. Incêndios da alma. Rio de Janeiro: Multifoco, 2016 (adaptado).\n\nAs práticas religiosas mencionadas nos textos estão associadas, respectivamente, à:`,
    alternativas: [
      "Delimitação de paisagens urbanas e abandono de componentes espiritualistas.",
      "Demarcação de patrimônios afetivos e apropriação de elementos judaizantes.",
      "Expansão de fronteiras regionais e subjetivação do cristianismo medieval.",
      "Circunscrição de bens simbólicos e admissão de cerimônias ecumênicas.",
      "Criação de lugares místicos e experiências do catolicismo popular."
    ],
    correta: 4, // E
    explicacaoIA: "A alternativa correta é a (E). O fenômeno de Juazeiro do Norte e a liderança de Padre Cícero consolidaram santuários sertanejos marcados pela intensa fé popular."
  },
  {
    materia: "História",
    dificuldade: "Médio",
    enunciado: `[ENEM 2022 - Q61]\n\nA dublagem é o novo campo a ser explorado pela inteligência artificial, e há empresas dedicadas a fazer com que as vozes originais de atores sejam transpostas para outros idiomas. A novidade reforça a tendência da automação de postos de trabalho nas mais diversas áreas. Tem potencial para facilitar a vida de estúdios e produtoras e, ao mesmo tempo, tornar mais escassas as oportunidades para dubladores e atores que trabalham com isso.\nGAGLIONI, C. Disponível em: www.nexojornal.com.br. Acesso em: 25 out. 2021.\n\nA consequência da mudança tecnológica apresentada no texto é a:`,
    alternativas: [
      "proteção da economia nacional.",
      "valorização da cultura tradicional.",
      "diminuição da formação acadêmica.",
      "estagnação da manifestação artística.",
      "ampliação do desemprego estrutural."
    ],
    correta: 4, // E
    explicacaoIA: "A alternativa correta é a (E). A automação substitui postos de trabalho humanos por algoritmos de IA, caracterizando o desemprego estrutural."
  },
  {
    materia: "Geografia",
    dificuldade: "Médio",
    enunciado: `[ENEM 2022 - Q62]\n\nBrasil e Argentina chegaram a um acordo para a redução em 10% da Tarifa Externa Comum (TEC) do Mercosul. O consenso foi alcançado durante negociação entre o ministro das Relações Exteriores do Brasil e o seu equivalente argentino, no Palácio do Itamaraty, em Brasília, no início do mês de outubro de 2021. A redução da TEC é um antigo desejo do Brasil, que pretende abrir mais sua economia e, com isso, ajudar a controlar a inflação. Já a Argentina temia que a medida pudesse afetar sua produção industrial. O acordo vai abranger uma ampla gama de produtos e ainda será apresentado ao Paraguai e Uruguai, para que seja formalizado.\nDisponível em: https://oglobo.globo.com. Acesso em: 8 out. 2021 (adaptado).\n\nA necessidade de negociação diplomática para viabilizar o acordo tarifário mencionado é explicada pela seguinte característica do Mercosul:`,
    alternativas: [
      "Limitação da circulação financeira.",
      "Padronização da política monetária.",
      "Funcionamento da união aduaneira.",
      "Dependência da exportação agrícola.",
      "Equivalência da legislação trabalhista."
    ],
    correta: 2, // C
    explicacaoIA: "A alternativa correta é a (C). Como o Mercosul é uma união aduaneira, qualquer alteração na Tarifa Externa Comum (TEC) exige consenso unânime entre todos os países-membros."
  },
  {
    materia: "História",
    dificuldade: "Médio",
    enunciado: `[ENEM 2022 - Q66]\n\nTEXTO I\nA primeira grande lei educacional do Brasil, de 1827, determinava que, nas “escolas de primeiras letras” do Império, meninos e meninas estudassem separados e tivessem currículos diferentes. No Senado, o Visconde de Cayru foi um dos defensores de que o currículo de matemática das garotas fosse o mais enxuto possível. Nas palavras dele, o “belo sexo” não tinha capacidade intelectual para ir muito longe: — Sobre as contas, são bastantes [para as meninas] as quatro espécies, que não estão fora do seu alcance e lhes podem ser de constante uso na vida.\n\nTEXTO II\nNo Senado, o único a defender publicamente que as meninas tivessem, em matemática, um currículo idêntico ao dos meninos foi o Marquês de Santo Amaro (RJ). Ele argumentou: — Não me parece conforme, às luzes do tempo em que vivemos, deixarmos de facilitar às brasileiras a aquisição desses conhecimentos [mais aprofundados de matemática]. A oposição que se manifesta não pode nascer senão do arraigado e péssimo costume em que estavam os antigos, os quais nem queriam que suas filhas aprendessem a ler.\nWESTIN, R. Senado Notícias. Disponível em: www12.senado.leg.br. Acesso em: 20 out. 2021 (adaptado).\n\nOs discursos expressam pontos de vista divergentes respectivamente pela oposição entre:`,
    alternativas: [
      "liberdade de gênero e controle social.",
      "equidade de escolha e imposição cultural.",
      "dominação de corpos e igualdade humana.",
      "geração de oportunidade e restrição profissional.",
      "exclusão de competências e participação política."
    ],
    correta: 2, // C
    explicacaoIA: "A alternativa correta é a (C). O Visconde de Cayru pretendia restringir o intelecto feminino limitando seu papel social, enquanto o Marquês de Santo Amaro advogava pela igualdade humana no acesso ao conhecimento."
  },
  {
    materia: "Geografia",
    dificuldade: "Fácil",
    enunciado: `[ENEM 2022 - Q72]\n\nBrasileiros levam mais tempo de casa para o trabalho\nPesquisa do IBGE aponta que a situação é mais grave no Sudeste: 13% das pessoas levam mais de uma hora para chegar ao trabalho. Nas regiões metropolitanas de São Paulo e do Rio, o IBGE registrou os maiores percentuais de trabalhadores que levam mais de uma hora no trajeto até o emprego. Quem vê o Marcelo chegar ao trabalho nem imagina a maratona que ele enfrenta todos os dias antes das 5 h. “Acordo 4 h 30, saio de casa 5 h, pego trem 5 h 20, chego na Central umas 6 h 50, pego ônibus e chego no trabalho mais ou menos 7 h 10”, conta. Segundo especialista, são os mais pobres os que moram mais longe do emprego.\nDisponível em: www.portaldotransito.com.br. Acesso em: 23 nov. 2021 (adaptado).\n\nA pesquisa desenvolvida retrata a seguinte dinâmica populacional:`,
    alternativas: [
      "Fluxo de retorno.",
      "Migração interna.",
      "Mudança sazonal.",
      "Movimento pendular.",
      "Deslocamento forçado."
    ],
    correta: 3, // D
    explicacaoIA: "A alternativa correta é a (D). O deslocamento diário de ida e volta entre a residência (geralmente nas periferias ou cidades-dormitório) e o local de trabalho nas metrópoles chama-se migração pendular."
  },
  {
    materia: "História",
    dificuldade: "Fácil",
    enunciado: `[ENEM 2022 - Q81]\n\nDecreto-Lei n. 1 949, de 27/12/1937\nArt. 1º Fica criado o Departamento de Imprensa e Propaganda (DIP), diretamente subordinado ao presidente da República.\nArt. 2º O DIP tem por fim:\nh) coordenar e incentivar as relações da imprensa com os poderes públicos no sentido de maior aproximação da mesma com os fatos que se ligam aos interesses nacionais;\nn) autorizar mensalmente a devolução dos depósitos efetuados pelas empresas jornalísticas para a importação de papel para imprensa, uma vez demonstrada, a seu juízo, a eficiência e a utilidade pública dos jornais ou periódicos por elas administrados ou dirigidos.\nBRASIL apud CARONE, E. A Terceira República (1937-1945). São Paulo: Difel, 1982 (adaptado).\n\nCom base nos trechos do decreto, as finalidades do órgão criado permitiram ao governo promover o(a):`,
    alternativas: [
      "diversificação da opinião pública.",
      "mercantilização da cultura popular.",
      "controle das organizações sindicais.",
      "cerceamento da liberdade de expressão.",
      "privatização dos meios de comunicação."
    ],
    correta: 3, // D
    explicacaoIA: "A alternativa correta é a (D). Criado durante a ditadura do Estado Novo de Getúlio Vargas, o DIP exercia rigorosa censura e controle ideológico sobre jornais e rádios."
  },
  {
    materia: "História",
    dificuldade: "Fácil",
    enunciado: `[ENEM 2022 - Q83]\n\nNascidas no Líbano, as duas irmãs não puderam ser registradas no país, porque lá é exigido que os nascidos sejam filhos de pais e mães libaneses. Seus pais, de nacionalidade síria, também não puderam registrá-las no país de origem. Na Síria, crianças só são registradas por pais oficialmente casados, o que não era o caso deles.\nDisponível em: https://agenciabrasil.ebc.com.br. Acesso em: 7 nov. 2021.\n\nEm situações como a apresentada no texto, as pessoas ao nascerem já se encontram na condição sociopolítica de:`,
    alternativas: [
      "exiladas.",
      "apátridas.",
      "foragidas.",
      "refugiadas.",
      "clandestinas."
    ],
    correta: 1, // B
    explicacaoIA: "A alternativa correta é a (B). Apátrida é o indivíduo que não é considerado como nacional por qualquer Estado segundo a sua legislação."
  },
  {
    materia: "História",
    dificuldade: "Difícil",
    enunciado: `[ENEM 2022 - Q86]\n\nEmpédocles estabelece quatro elementos corporais — fogo, ar, água e terra —, que são eternos e que mudam aumentando e diminuindo mediante mistura e separação; mas os princípios propriamente ditos, pelos quais aqueles são movidos, são o Amor e o Ódio. Pois é preciso que os elementos permaneçam alternadamente em movimento, sendo ora misturados pelo Amor, ora separados pelo Ódio.\nSIMPLÍCIO. Física, 25, 21. In: Os pré-socráticos. São Paulo: Nova Cultural, 1996.\n\nO texto propõe uma reflexão sobre o entendimento de Empédocles acerca da arché, uma preocupação típica do pensamento pré-socrático, porque:`,
    alternativas: [
      "exalta a investigação filosófica.",
      "transcende ao mundo sensível.",
      "evoca a discussão cosmogônica.",
      "fundamenta as paixões humanas.",
      "corresponde à explicação mitológica."
    ],
    correta: 2, // C
    explicacaoIA: "A alternativa correta é a (C). A busca pela arché (princípio primordial originador do cosmos e de todas as coisas) marca a cosmogonia racional pré-socrática."
  },
  {
    materia: "Geografia",
    dificuldade: "Médio",
    enunciado: `[ENEM 2022 - Q87]\n\nMacrocefalia urbana pode ser entendida como a massiva concentração das atividades econômicas em algumas metrópoles que propicia o desencadeamento de processos descompassados: redirecionamento e convergência de fluxos migratórios, déficit no número de empregos, ocupação desordenada de determinadas regiões da cidade e estigmatização de estratos sociais, que comprometem substancialmente a segurança pública urbana.\nSANTOS, M. O espaço dividido: os dois circuitos da economia urbana dos países subdesenvolvidos. São Paulo: Edusp, 2004.\n\nO processo de concentração espacial apresentado foi estimulado por qual fator geográfico?`,
    alternativas: [
      "Limitação da área ocupada.",
      "Êxodo da população do campo.",
      "Ampliação do risco habitacional.",
      "Deficiência do transporte alternativo.",
      "Crescimento da taxa de fecundidade."
    ],
    correta: 1, // B
    explicacaoIA: "A alternativa correta é a (B). A intensa migração campo-cidade (êxodo rural) a partir da modernização agrícola concentrou milhões de pessoas desordenadamente nas grandes metrópoles."
  },
  {
    materia: "História",
    dificuldade: "Médio",
    enunciado: `[ENEM 2022 - Q88]\n\nEntretanto, nosso amigo Basso tem o ânimo alegre. Isso resulta da filosofia: estar alegre diante da morte, forte e contente qualquer que seja o estado do corpo, sem desfalecer, ainda que desfaleça.\nSÊNECA, L. Cartas morais. Lisboa: Calouste Gulbenkian, 1990.\n\nO excerto refere-se a uma carta de Sêneca na qual se apresenta como um bem fundamental da filosofia promover a:`,
    alternativas: [
      "valorização de disputas dialógicas.",
      "rejeição das convenções sociais.",
      "inspiração de natureza religiosa.",
      "exaltação do sofrimento.",
      "moderação das paixões."
    ],
    correta: 4, // E
    explicacaoIA: "A alternativa correta é a (E). O estoicismo de Sêneca preconiza a apatheia e ataraxia (serenidade da alma e autocontrole das paixões) mesmo perante a dor e a morte."
  },
  {
    materia: "História",
    dificuldade: "Fácil",
    enunciado: `[ENEM 2022 - Q89]\n\nQuando os espanhóis chegaram à América, estava em seu apogeu o império teocrático dos Incas, que estendia seu poder sobre o que hoje chamamos Peru, Bolívia e Equador, abarcava parte da Colômbia e do Chile e alcançava até o norte argentino e a selva brasileira; a confederação dos Astecas tinha conquistado um alto nível de eficiência no vale do México, e no Yucatán, na América Central, a esplêndida civilização dos Maias persistia nos povos herdeiros, organizados para o trabalho e para a guerra. Os Maias tinham sido grandes astrônomos, mediram o tempo e o espaço com assombrosa precisão, e tinham descoberto o valor do número zero antes de qualquer povo da história. No museu de Lima, podem ser vistos centenas de crânios que receberam placas de ouro e prata por parte dos cirurgiões Incas.\nGALEANO, E. As veias abertas da América Latina. Porto Alegre: L&PM, 2012.\n\nAs sociedades mencionadas deixaram como legado uma diversidade de:`,
    alternativas: [
      "bens religiosos inspirados na matriz cristã.",
      "materiais bélicos pilhados em batalhas coloniais.",
      "heranças culturais constituídas em saberes próprios.",
      "costumes laborais moldados em estilos estrangeiros.",
      "práticas medicinais alicerçadas no conhecimento científico."
    ],
    correta: 2, // C
    explicacaoIA: "A alternativa correta é a (C). As civilizações pré-colombianas desenvolveram sistemas matemáticos, astronômicos, cirúrgicos e agrícolas sofisticados e autônomos."
  },
  {
    materia: "História",
    dificuldade: "Fácil",
    enunciado: `[ENEM 2022 - Q90]\n\nEm Vitória (ES), no bairro Goiabeiras, encontramos as paneleiras, mulheres que são conhecidas pelos saberes/fazeres das tradicionais panelas de barro, ícones da culinária capixaba. A tradição passada de mãe para filha é de origem indígena e sofreu influência de outras etnias, como a afro e a luso. Dessa mistura, acredita-se que a fabricação das panelas de barro já tenha 400 anos. A fabricação das panelas de barro se dá em várias etapas, desde a obtenção de matéria-prima à confecção das panelas. As matérias-primas tradicionalmente utilizadas são provenientes do meio natural, como: argila, retirada do barreiro no Vale do Mulembá; madeira, atualmente proveniente das sobras da construção civil; e tinta, extraída da casca do manguezal, o popular mangue-vermelho.\nTRISTÃO, M. A educação ambiental e o pós-colonialismo. Revista de Educação, n. 53, ago. 2014.\n\nUma característica de práticas tradicionais como a exemplificada no texto é a vinculação entre os recursos do mundo natural e a:`,
    alternativas: [
      "manutenção dos modos de vida.",
      "conservação dos plantios da roça.",
      "atualização do modelo de gestão.",
      "participação na sociedade de consumo.",
      "especialização nas etapas de produção."
    ],
    correta: 0, // A
    explicacaoIA: "A alternativa correta é a (A). O saber artesanal das paneleiras de Goiabeiras (Patrimônio Cultural Imaterial do IPHAN) expressa a identidade e sobrevivência cultural de sua comunidade."
  }
];

async function ingestEnem2022() {
  console.log(`Iniciando ingestão de ${questoes2022.length} questões oficiais do ENEM 2022...`);
  let count = 0;

  for (const q of questoes2022) {
    // Evita duplicatas se já inserido
    const exists = await prisma.question.findFirst({
      where: { enunciado: { contains: q.enunciado.substring(0, 30) } }
    });

    if (!exists) {
      await prisma.question.create({
        data: {
          materia: q.materia,
          dificuldade: q.dificuldade,
          enunciado: q.enunciado,
          alternativas: JSON.stringify(q.alternativas),
          correta: q.correta,
          explicacaoIA: q.explicacaoIA
        }
      });
      count++;
    }
  }

  console.log(`✅ Inseridas com sucesso: ${count} novas questões do ENEM 2022.`);

  // Recria os simulados consolidados
  const allDbQuestions = await prisma.question.findMany();
  console.log(`Total geral de questões no banco agora: ${allDbQuestions.length}`);

  const q2022 = allDbQuestions.filter(q => q.enunciado.includes('ENEM 2022'));
  if (q2022.length > 0) {
    await prisma.simulado.upsert({
      where: { id: "enem-2022-oficial" },
      update: { questions: JSON.stringify(q2022) },
      create: { id: "enem-2022-oficial", userId: "b6b43411-fe62-4966-ac48-1cfd906d2e85", type: "GERAL", questions: JSON.stringify(q2022) }
    });
  }

  const q2023 = allDbQuestions.filter(q => q.enunciado.includes('ENEM 2023'));
  if (q2023.length > 0) {
    await prisma.simulado.upsert({
      where: { id: "enem-2023-oficial" },
      update: { questions: JSON.stringify(q2023) },
      create: { id: "enem-2023-oficial", userId: "b6b43411-fe62-4966-ac48-1cfd906d2e85", type: "GERAL", questions: JSON.stringify(q2023) }
    });
  }

  await prisma.simulado.upsert({
    where: { id: "enem-mix-completo" },
    update: { questions: JSON.stringify(allDbQuestions) },
    create: { id: "enem-mix-completo", userId: "b6b43411-fe62-4966-ac48-1cfd906d2e85", type: "GERAL", questions: JSON.stringify(allDbQuestions) }
  });

  console.log("Simulado ENEM 2022 Oficial e Mix Geral atualizados!");
}

ingestEnem2022().finally(() => prisma.$disconnect());
