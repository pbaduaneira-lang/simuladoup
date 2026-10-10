require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const visualWords = [
  'o gráfico', 'no gráfico', 'do gráfico', 'esse gráfico', 'este gráfico', 'gráfico que',
  'a figura', 'na figura', 'da figura', 'essa figura', 'esta figura', 'figura que',
  'a tirinha', 'na tirinha', 'da tirinha', 'nessa tirinha', 'nesta tirinha',
  'o cartum', 'no cartum', 'do cartum', 'esse cartum', 'este cartum',
  'a charge', 'na charge', 'da charge', 'essa charge', 'esta charge',
  'o mapa', 'no mapa', 'do mapa', 'esse mapa', 'este mapa', 'mapa que',
  'o infográfico', 'no infográfico', 'do infográfico',
  'a imagem', 'na imagem', 'da imagem', 'essa imagem', 'esta imagem', 'imagem que',
  'quadro abaixo', 'tabela abaixo', 'esquema abaixo', 'conforme o esquema', 'observou o gráfico'
];

async function purgeVisualAndCorrupt() {
  console.log("Iniciando purificação das questões no banco de dados...");
  const allQ = await prisma.question.findMany();
  console.log(`Total inicial de questões: ${allQ.length}`);

  let removedCount = 0;
  const idsToDelete = [];

  for (const q of allQ) {
    const el = q.enunciado.toLowerCase();
    
    // 1. Checa dependência de recurso visual (sem link de imagem)
    const hasVisual = visualWords.some(vw => el.includes(vw)) && !q.enunciado.includes("http");

    // 2. Checa integridade das alternativas
    let alts = [];
    try {
      alts = JSON.parse(q.alternativas);
    } catch(e) {
      alts = [];
    }
    const badAlts = alts.length !== 5 || alts.some(a => a.length < 2 || a.length > 280);

    // 3. Enunciado truncado ou incompleto
    const isTruncated = q.enunciado.length < 80 || q.enunciado.endsWith(" a") || q.enunciado.endsWith(" l");

    if (hasVisual || badAlts || isTruncated) {
      idsToDelete.push(q.id);
    }
  }

  console.log(`Questões com recurso visual ou inconsistência a excluir: ${idsToDelete.length}`);

  // Excluir em lote
  if (idsToDelete.length > 0) {
    // Primeiro remove relações em UserAnswer se houver
    await prisma.userAnswer.deleteMany({
      where: { questionId: { in: idsToDelete } }
    });
    await prisma.questionLike.deleteMany({
      where: { questionId: { in: idsToDelete } }
    });
    await prisma.questionComment.deleteMany({
      where: { questionId: { in: idsToDelete } }
    });
    await prisma.questionReport.deleteMany({
      where: { questionId: { in: idsToDelete } }
    });

    const deleted = await prisma.question.deleteMany({
      where: { id: { in: idsToDelete } }
    });
    console.log(`Excluídas do banco: ${deleted.count} questões.`);
  }

  // Deduplicação por similaridade de enunciado
  const remaining = await prisma.question.findMany();
  console.log(`Restantes no banco: ${remaining.length}`);

  const seenEnunciados = new Set();
  const duplicateIds = [];

  for (const q of remaining) {
    // Chave de deduplicação pelos primeiros 80 caracteres
    const key = q.enunciado.substring(0, 80).toLowerCase().trim();
    if (seenEnunciados.has(key)) {
      duplicateIds.push(q.id);
    } else {
      seenEnunciados.add(key);
    }
  }

  if (duplicateIds.length > 0) {
    console.log(`Excluindo ${duplicateIds.length} questões duplicadas...`);
    await prisma.userAnswer.deleteMany({ where: { questionId: { in: duplicateIds } } });
    await prisma.questionLike.deleteMany({ where: { questionId: { in: duplicateIds } } });
    await prisma.questionComment.deleteMany({ where: { questionId: { in: duplicateIds } } });
    await prisma.questionReport.deleteMany({ where: { questionId: { in: duplicateIds } } });
    await prisma.question.deleteMany({ where: { id: { in: duplicateIds } } });
  }

  const finalTotal = await prisma.question.count();
  console.log(`\n🎉 Banco purificado com sucesso! Total atual de questões 100% blindadas: ${finalTotal}`);
}

purgeVisualAndCorrupt().finally(() => prisma.$disconnect());
