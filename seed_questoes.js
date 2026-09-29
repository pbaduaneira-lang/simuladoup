const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const questoes = [
  {
    materia: "Português",
    dificuldade: "Médio",
    enunciado: "Assinale a alternativa em que a crase foi empregada corretamente:",
    alternativas: JSON.stringify([
      "Fui à pé até o centro da cidade.",
      "Entreguei o relatório à ela ontem.",
      "Vamos à praia amanhã de manhã.",
      "Começou à chover muito forte."
    ]),
    correta: 2,
    explicacaoIA: "A crase ocorre pela fusão da preposição 'a' (quem vai, vai a algum lugar) com o artigo feminino 'a' (a praia)."
  },
  {
    materia: "Matemática",
    dificuldade: "Fácil",
    enunciado: "Se 3x + 7 = 22, qual o valor de x?",
    alternativas: JSON.stringify([
      "3",
      "4",
      "5",
      "6"
    ]),
    correta: 2,
    explicacaoIA: "Subtraindo 7 dos dois lados temos 3x = 15. Dividindo por 3, encontramos x = 5."
  },
  {
    materia: "História",
    dificuldade: "Médio",
    enunciado: "Qual o principal objetivo da Revolução Francesa (1789)?",
    alternativas: JSON.stringify([
      "Manter o poder absoluto do rei Luís XVI.",
      "Estabelecer uma aliança comercial com a Inglaterra.",
      "Derrubar a monarquia absolutista e garantir direitos aos cidadãos.",
      "Criar o primeiro império ultramarino da França."
    ]),
    correta: 2,
    explicacaoIA: "A Revolução buscou derrubar o absolutismo sob o lema Liberdade, Igualdade e Fraternidade, baseada no Iluminismo."
  },
  {
    materia: "Ciências",
    dificuldade: "Fácil",
    enunciado: "Qual o principal gás responsável pelo efeito estufa?",
    alternativas: JSON.stringify([
      "Gás Oxigênio (O2)",
      "Gás Carbônico (CO2)",
      "Gás Nitrogênio (N2)",
      "Gás Hélio (He)"
    ]),
    correta: 1,
    explicacaoIA: "O Dióxido de Carbono (CO2) é o principal gás de efeito estufa associado à atividade humana (queima de combustíveis)."
  },
  {
    materia: "Geografia",
    dificuldade: "Médio",
    enunciado: "O Aquífero Guarani é um dos maiores reservatórios de água doce subterrânea do mundo. Ele está localizado na:",
    alternativas: JSON.stringify([
      "América do Norte",
      "América Central",
      "América do Sul",
      "Europa"
    ]),
    correta: 2,
    explicacaoIA: "Ele abrange áreas do Brasil, Argentina, Paraguai e Uruguai, na América do Sul."
  },
  {
    materia: "Português",
    dificuldade: "Difícil",
    enunciado: "Marque a opção com erro de concordância verbal:",
    alternativas: JSON.stringify([
      "Faz dez anos que não a vejo.",
      "Haverão muitas mudanças no projeto.",
      "Existiam várias dúvidas sobre o caso.",
      "Choveu muito ontem."
    ]),
    correta: 1,
    explicacaoIA: "O verbo 'haver' no sentido de existir é impessoal e deve ficar no singular: 'Haverá muitas mudanças'."
  },
  {
    materia: "Matemática",
    dificuldade: "Médio",
    enunciado: "Qual a área de um círculo com raio igual a 5cm? (Use pi = 3,14)",
    alternativas: JSON.stringify([
      "31,4 cm²",
      "78,5 cm²",
      "15,7 cm²",
      "100 cm²"
    ]),
    correta: 1,
    explicacaoIA: "A área é A = pi * r². Logo, A = 3,14 * (5)² = 3,14 * 25 = 78,5."
  },
  {
    materia: "História",
    dificuldade: "Fácil",
    enunciado: "Em que ano ocorreu o descobrimento do Brasil pelos portugueses?",
    alternativas: JSON.stringify([
      "1492",
      "1500",
      "1822",
      "1889"
    ]),
    correta: 1,
    explicacaoIA: "A esquadra de Pedro Álvares Cabral chegou ao Brasil no ano de 1500."
  },
  {
    materia: "Física",
    dificuldade: "Médio",
    enunciado: "Se um carro percorre 120 km em 2 horas com velocidade constante, qual é sua velocidade média?",
    alternativas: JSON.stringify([
      "50 km/h",
      "60 km/h",
      "70 km/h",
      "80 km/h"
    ]),
    correta: 1,
    explicacaoIA: "V = D / t. Velocidade = 120 km / 2 horas = 60 km/h."
  },
  {
    materia: "Biologia",
    dificuldade: "Difícil",
    enunciado: "Qual organela celular é responsável pela respiração celular e produção de ATP?",
    alternativas: JSON.stringify([
      "Complexo de Golgi",
      "Retículo Endoplasmático",
      "Ribossomo",
      "Mitocôndria"
    ]),
    correta: 3,
    explicacaoIA: "As mitocôndrias são as usinas de energia das células, responsáveis por produzir a maior parte do ATP."
  },
  {
    materia: "Química",
    dificuldade: "Médio",
    enunciado: "Qual é a fórmula química do Cloreto de Sódio (sal de cozinha)?",
    alternativas: JSON.stringify([
      "NaCl",
      "HCl",
      "NaOH",
      "H2O"
    ]),
    correta: 0,
    explicacaoIA: "O cloreto de sódio é um sal inorgânico composto por um átomo de sódio e um de cloro (NaCl)."
  },
  {
    materia: "Geografia",
    dificuldade: "Fácil",
    enunciado: "Qual é a capital do Brasil?",
    alternativas: JSON.stringify([
      "São Paulo",
      "Rio de Janeiro",
      "Salvador",
      "Brasília"
    ]),
    correta: 3,
    explicacaoIA: "Brasília foi inaugurada em 1960 pelo presidente Juscelino Kubitschek."
  },
  {
    materia: "Matemática",
    dificuldade: "Difícil",
    enunciado: "Qual o valor de log2(32)?",
    alternativas: JSON.stringify([
      "4",
      "5",
      "6",
      "16"
    ]),
    correta: 1,
    explicacaoIA: "O logaritmo na base 2 de 32 é 5, pois 2 elevado a 5 é igual a 32."
  }
];

async function main() {
  console.log("Iniciando o seeding de questões...");
  for (const q of questoes) {
    await prisma.question.create({
      data: q
    });
  }
  console.log("Seeding concluído!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
