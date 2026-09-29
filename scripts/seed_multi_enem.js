const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando Seed dos novos anos do ENEM no Supabase...');

  const dataPath = path.join(__dirname, 'enem_multi_anos.json');
  if (!fs.existsSync(dataPath)) {
    console.error('Arquivo enem_multi_anos.json não encontrado!');
    process.exit(1);
  }

  const questoes = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  console.log(`Carregando ${questoes.length} questões do dataset...`);

  let count = 0;
  const insertedIds = [];

  for (const q of questoes) {
    try {
      const created = await prisma.question.create({
        data: {
          materia: q.materia,
          dificuldade: q.dificuldade,
          enunciado: q.enunciado,
          alternativas: JSON.stringify(q.alternativas),
          correta: q.correta,
          explicacaoIA: q.explicacaoIA,
        }
      });
      insertedIds.push(created.id);
      count++;
      if (count % 25 === 0) {
        console.log(`✅ Inseridas ${count}/${questoes.length} questões...`);
      }
    } catch (e) {
      console.error(`Erro ao inserir questão [${q.ano} #${q.numero}]:`, e.message);
    }
  }

  console.log(`\n🎉 Total de novas questões inseridas com sucesso: ${count}`);

  // Criação dos Simulados Oficiais
  const TEST_USER_ID = "b6b43411-fe62-4966-ac48-1cfd906d2e85";

  // Busca todas as questões do banco para criar o Simulado Mix Geral
  const allDbQuestions = await prisma.question.findMany();
  console.log(`Total geral de questões no banco: ${allDbQuestions.length}`);

  // 1. Simulado ENEM 2023 Oficial
  const q2023 = allDbQuestions.filter(q => q.enunciado.includes('ENEM 2023'));
  if (q2023.length > 0) {
    await prisma.simulado.upsert({
      where: { id: "enem-2023-oficial" },
      update: { questions: JSON.stringify(q2023) },
      create: {
        id: "enem-2023-oficial",
        userId: TEST_USER_ID,
        type: "GERAL",
        questions: JSON.stringify(q2023)
      }
    });
    console.log(`✅ Simulado 'enem-2023-oficial' criado com ${q2023.length} questões!`);
  }

  // 2. Simulado ENEM 2024 Oficial
  const q2024 = allDbQuestions.filter(q => q.enunciado.includes('ENEM 2024'));
  if (q2024.length > 0) {
    await prisma.simulado.upsert({
      where: { id: "enem-2024-oficial" },
      update: { questions: JSON.stringify(q2024) },
      create: {
        id: "enem-2024-oficial",
        userId: TEST_USER_ID,
        type: "GERAL",
        questions: JSON.stringify(q2024)
      }
    });
    console.log(`✅ Simulado 'enem-2024-oficial' criado com ${q2024.length} questões!`);
  }

  // 3. Simulado Banco Geral Randômico (Todos os anos misturados)
  await prisma.simulado.upsert({
    where: { id: "enem-mix-completo" },
    update: { questions: JSON.stringify(allDbQuestions) },
    create: {
      id: "enem-mix-completo",
      userId: TEST_USER_ID,
      type: "GERAL",
      questions: JSON.stringify(allDbQuestions)
    }
  });
  console.log(`✅ Simulado 'enem-mix-completo' atualizado com ${allDbQuestions.length} questões de múltiplos anos!`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
