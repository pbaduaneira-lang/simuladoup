const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando inserção em lote (batch) das questões do ENEM 2025...");
  
  const rawData = fs.readFileSync(path.join(__dirname, 'enem_2025_questoes.json'), 'utf-8');
  const questoes = JSON.parse(rawData);

  const dataToInsert = questoes.map(q => ({
    materia: q.materia,
    dificuldade: q.dificuldade,
    enunciado: q.enunciado,
    alternativas: JSON.stringify(q.alternativas),
    correta: q.correta,
    explicacaoIA: q.explicacaoIA
  }));

  const res = await prisma.question.createMany({
    data: dataToInsert,
    skipDuplicates: true
  });

  console.log(`Inseridas em lote: ${res.count} questões no banco!`);

  // Busca 20 questões para compor o Simulado Oficial
  const sampleQuestions = await prisma.question.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' }
  });

  const formattedSample = sampleQuestions.map(q => ({
    ...q,
    alternativas: typeof q.alternativas === 'string' ? JSON.parse(q.alternativas) : q.alternativas
  }));

  const user = await prisma.user.findFirst();
  const userId = user ? user.id : "b6b43411-fe62-4966-ac48-1cfd906d2e85";

  // Upsert do Simulado Oficial ENEM 2025
  const simuladoId = "enem-2025-oficial";
  
  const existing = await prisma.simulado.findUnique({ where: { id: simuladoId } });
  if (existing) {
    await prisma.simulado.update({
      where: { id: simuladoId },
      data: { questions: JSON.stringify(formattedSample) }
    });
  } else {
    await prisma.simulado.create({
      data: {
        id: simuladoId,
        userId: userId,
        type: "ENEM_2025",
        questions: JSON.stringify(formattedSample)
      }
    });
  }

  console.log(`\n🎉 Simulado ENEM 2025 criado com sucesso!`);
  console.log(`🔗 Link direto: http://localhost:3005/app/feed?simulado=${simuladoId}`);
}

main()
  .catch(e => {
    console.error("Erro:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
