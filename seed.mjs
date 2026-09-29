import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MOCK_QUESTIONS = [
  {
    materia: "Português",
    dificuldade: "Médio",
    enunciado: "Assinale a alternativa em que a crase foi empregada corretamente:",
    alternativas: JSON.stringify([
      "Fui à escola.",
      "Vou a pé.",
      "Entregou o prêmio a ele.",
      "Ficou cara a cara com o perigo."
    ]),
    correta: 0,
    explicacaoIA: JSON.stringify([
      "✅ Quem vai, vai A algum lugar (escola = feminino). Logo, a + a = à.",
      "❌ 'pé' é masculino, não tem crase antes de palavra masculina.",
      "❌ 'ele' é pronome pessoal masculino.",
      "❌ não se usa crase entre palavras repetidas."
    ])
  },
  {
    materia: "Matemática",
    dificuldade: "Difícil",
    enunciado: "Se 3 gatos caçam 3 ratos em 3 minutos, quanto tempo 100 gatos levam para caçar 100 ratos?",
    alternativas: JSON.stringify([
      "100 minutos",
      "3 minutos",
      "33 minutos",
      "1 minuto"
    ]),
    correta: 1,
    explicacaoIA: JSON.stringify([
      "✅ Se 3 gatos caçam 3 ratos em 3 min, a proporção é 1 gato por rato em 3 minutos.",
      "❌ 100 gatos têm a mesma taxa de caça. Eles caçarão os 100 ratos ao mesmo tempo (nos mesmos 3 min).",
      "🧠 Pegadinha clássica de lógica!"
    ])
  }
];

async function main() {
  console.log("Seeding questions...");
  for (const q of MOCK_QUESTIONS) {
    const created = await prisma.question.create({
      data: q
    });
    console.log(`Created question with ID: ${created.id}`);
  }
  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
