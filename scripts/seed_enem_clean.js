const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log("Atualizando o banco de dados com as questões limpas por coluna...");

  const rawData = fs.readFileSync(path.join(__dirname, 'enem_2025_clean.json'), 'utf-8');
  const questoes = JSON.parse(rawData);

  // Remove questões antigas do ENEM 2025 para evitar duplicidade ou mistura
  await prisma.question.deleteMany({
    where: {
      enunciado: {
        contains: "[ENEM 2025"
      }
    }
  });

  const dataToInsert = questoes.map(q => ({
    materia: q.materia,
    dificuldade: q.dificuldade,
    enunciado: q.enunciado,
    alternativas: JSON.stringify(q.alternativas),
    correta: q.correta,
    explicacaoIA: q.explicacaoIA
  }));

  const res = await prisma.question.createMany({
    data: dataToInsert
  });

  console.log(`✅ Inseridas com sucesso ${res.count} questões 100% limpas no Supabase!`);

  // Busca 30 questões variadas para o Simulado Oficial
  const sampleQuestions = await prisma.question.findMany({
    where: {
      enunciado: {
        contains: "[ENEM 2025"
      }
    },
    take: 30,
    orderBy: { createdAt: 'desc' }
  });

  const formattedSample = sampleQuestions.map(q => ({
    ...q,
    alternativas: typeof q.alternativas === 'string' ? JSON.parse(q.alternativas) : q.alternativas
  }));

  const user = await prisma.user.findFirst();
  const userId = user ? user.id : "b6b43411-fe62-4966-ac48-1cfd906d2e85";
  const simuladoId = "enem-2025-oficial";

  await prisma.simulado.upsert({
    where: { id: simuladoId },
    update: { questions: JSON.stringify(formattedSample) },
    create: {
      id: simuladoId,
      userId: userId,
      type: "ENEM_2025",
      questions: JSON.stringify(formattedSample)
    }
  });

  console.log(`🎉 Simulado Oficial atualizado: http://localhost:3005/app/feed?simulado=${simuladoId}`);
}

main()
  .catch(e => {
    console.error("Erro:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
